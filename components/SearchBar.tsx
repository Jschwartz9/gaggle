'use client';

import { useState, useRef, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useApp } from '@/contexts/AppContext';
import { mockEvents } from '@/lib/mockData';
import { searchEvents, highlightText, debounce } from '@/lib/searchUtils';
import { Event } from '@/lib/types';

interface SearchBarProps {
  className?: string;
  placeholder?: string;
}

interface SearchResult {
  event: Event;
  relevanceScore: number;
  matchedFields: string[];
}

export default function SearchBar({ className = '', placeholder = 'Search events...' }: SearchBarProps) {
  const { state, setSearchQuery } = useApp();
  const [inputValue, setInputValue] = useState(state.searchQuery);
  const [isFocused, setIsFocused] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Filter events by selected city first
  const cityEvents = mockEvents.filter(event => event.location.city === state.selectedCity);

  // Debounced search function
  const debouncedSearch = debounce((query: string) => {
    if (query.trim()) {
      const results = searchEvents(cityEvents, query).slice(0, 8); // Limit to 8 results
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  }, 300);

  // Handle input change
  const handleInputChange = (value: string) => {
    setInputValue(value);
    setSelectedIndex(-1);
    debouncedSearch(value);
  };

  // Handle search submission
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setIsFocused(false);
    setSelectedIndex(-1);
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isFocused || searchResults.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev =>
          prev < searchResults.length - 1 ? prev + 1 : -1
        );
        break;

      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev =>
          prev > -1 ? prev - 1 : searchResults.length - 1
        );
        break;

      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && searchResults[selectedIndex]) {
          handleEventClick(searchResults[selectedIndex].event);
        } else {
          handleSearch(inputValue);
        }
        break;

      case 'Escape':
        setIsFocused(false);
        setSelectedIndex(-1);
        inputRef.current?.blur();
        break;
    }
  };

  // Handle event click
  const handleEventClick = (event: Event) => {
    setSearchQuery('');
    setInputValue('');
    setIsFocused(false);
    setSelectedIndex(-1);
    router.push(`/event/${event.id}`);
  };

  // Clear search
  const clearSearch = () => {
    setInputValue('');
    setSearchQuery('');
    setSearchResults([]);
    setSelectedIndex(-1);
    inputRef.current?.focus();
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        resultsRef.current &&
        !resultsRef.current.contains(event.target as Node) &&
        !inputRef.current?.contains(event.target as Node)
      ) {
        setIsFocused(false);
        setSelectedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Sync with global search state
  useEffect(() => {
    if (state.searchQuery !== inputValue) {
      setInputValue(state.searchQuery);
    }
  }, [state.searchQuery]);

  // Format price for display
  const formatPrice = (price: number | null) => {
    if (price === null) return 'Free';
    return `$${price}`;
  };

  // Get match indicator
  const getMatchIndicator = (matchedFields: string[]) => {
    if (matchedFields.includes('title')) return '🎯';
    if (matchedFields.includes('category')) return '🏷️';
    if (matchedFields.includes('vibes')) return '✨';
    if (matchedFields.includes('description')) return '📝';
    return '📍';
  };

  return (
    <div className={`relative ${className}`}>
      {/* Search Input */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>

        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => handleInputChange(e.target.value)}
          onFocus={() => {
            setIsFocused(true);
            if (inputValue.trim()) {
              debouncedSearch(inputValue);
            }
          }}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="w-full pl-12 pr-12 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 shadow-sm hover:shadow-md"
          aria-label="Search events"
          aria-expanded={isFocused && searchResults.length > 0}
          aria-haspopup="listbox"
          role="combobox"
          autoComplete="off"
        />

        {/* Clear Button */}
        {inputValue && (
          <button
            onClick={clearSearch}
            className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Clear search"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Search Results Dropdown */}
      <AnimatePresence>
        {isFocused && searchResults.length > 0 && (
          <motion.div
            ref={resultsRef}
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg shadow-black/10 z-50 overflow-hidden"
            role="listbox"
          >
            <div className="max-h-96 overflow-y-auto">
              {/* Search Results Header */}
              <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
                <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                  {searchResults.length} result{searchResults.length !== 1 ? 's' : ''} in {state.selectedCity}
                </p>
              </div>

              {/* Results List */}
              <div className="py-2">
                {searchResults.map((result, index) => {
                  const { event, matchedFields } = result;
                  const isSelected = index === selectedIndex;
                  const highlightedTitle = highlightText(event.title, inputValue);
                  const highlightedDescription = highlightText(
                    event.description.substring(0, 120) + '...',
                    inputValue
                  );

                  return (
                    <button
                      key={event.id}
                      onClick={() => handleEventClick(event)}
                      className={`w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors duration-150 border-l-2 ${
                        isSelected
                          ? 'bg-primary/5 border-l-primary'
                          : 'border-l-transparent'
                      }`}
                      role="option"
                      aria-selected={isSelected}
                    >
                      <div className="flex items-start space-x-3">
                        {/* Event Image */}
                        <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                          <img
                            src={event.imageUrl}
                            alt={event.title}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        {/* Event Details */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="text-xs" title={`Matched in: ${matchedFields.join(', ')}`}>
                              {getMatchIndicator(matchedFields)}
                            </span>
                            <h3 className="font-semibold text-gray-900 truncate">
                              {highlightedTitle.map((segment, i) => (
                                <span
                                  key={i}
                                  className={segment.isHighlight ? 'bg-primary/20 text-primary font-bold' : ''}
                                >
                                  {segment.text}
                                </span>
                              ))}
                            </h3>
                          </div>

                          <p className="text-sm text-gray-600 line-clamp-2">
                            {highlightedDescription.map((segment, i) => (
                              <span
                                key={i}
                                className={segment.isHighlight ? 'bg-primary/20 text-primary font-medium' : ''}
                              >
                                {segment.text}
                              </span>
                            ))}
                          </p>

                          <div className="flex items-center space-x-4 mt-2">
                            <span className="text-xs text-gray-500">
                              {event.location.neighborhood}
                            </span>
                            <span className="text-xs font-semibold text-primary">
                              {formatPrice(event.price)}
                            </span>
                            <span className="text-xs text-gray-500">
                              {event.attendeeIds.length} going
                            </span>
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Show All Results Footer */}
              {inputValue.trim() && (
                <div className="border-t border-gray-100 px-4 py-3">
                  <button
                    onClick={() => handleSearch(inputValue)}
                    className="w-full text-sm font-semibold text-primary hover:text-primary/80 transition-colors"
                  >
                    See all results for "{inputValue}"
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* No Results State */}
      <AnimatePresence>
        {isFocused && inputValue.trim() && searchResults.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-50 p-6 text-center"
          >
            <div className="text-gray-400 mb-2">🔍</div>
            <h3 className="font-semibold text-gray-900 mb-1">No events found</h3>
            <p className="text-sm text-gray-600">
              No events match "{inputValue}" in {state.selectedCity}. Try different keywords or check other cities.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}