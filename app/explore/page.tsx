'use client';

import { useState, useMemo } from 'react';
import { Search, Map, List, Filter } from 'lucide-react';
import { mockEvents, mockCities } from '@/lib/mockData';
import { EventCategory, EventFilters } from '@/lib/types';
import { useApp } from '@/contexts/AppContext';
import { searchEvents } from '@/lib/searchUtils';
import AnimatedEventCard from '@/components/AnimatedEventCard';
import FilterSheet from '@/components/FilterSheet';
import BottomNav from '@/components/BottomNav';
import LeafletMap from '@/components/LeafletMap';
import { motion } from 'framer-motion';

const categories: (EventCategory | 'All')[] = [
  'All',
  'Food & Drink',
  'Nightlife',
  'Fitness',
  'Outdoors',
  'Arts & Culture',
  'Music',
  'Networking',
  'Wellness',
  'Sports',
  'Pop-ups & Markets',
];

export default function ExplorePage() {
  const { state } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('All Cities');
  const [activeCategory, setActiveCategory] = useState<EventCategory | 'All'>('All');
  const [isMapView, setIsMapView] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState<EventFilters>({
    category: 'All',
    price: 'Any',
    distance: 'Any',
    ageGroup: 'Any',
    date: 'Any'
  });

  // Get all cities for filter
  const allCities = ['All Cities', ...Array.from(new Set(mockEvents.map(event => event.location.city)))];

  // Filter events based on search, city, category and other filters
  const filteredEvents = useMemo(() => {
    let events = [...mockEvents];

    // Filter by city
    if (selectedCity !== 'All Cities') {
      events = events.filter(event => event.location.city === selectedCity);
    }

    // Apply search filter
    if (searchQuery.trim()) {
      const searchResults = searchEvents(events, searchQuery);
      events = searchResults.map(result => result.event);
    }

    // Apply category filter
    if (activeCategory !== 'All') {
      events = events.filter(event => event.category === activeCategory);
    }

    // Apply additional filters
    if (filters.price !== 'Any') {
      events = events.filter(event => {
        if (filters.price === 'Free') return event.price === null;
        if (filters.price === 'Under $25') return event.price !== null && event.price < 25;
        if (filters.price === 'Under $50') return event.price !== null && event.price < 50;
        return true;
      });
    }

    if (filters.ageGroup !== 'Any') {
      events = events.filter(event => event.ageGroup === filters.ageGroup);
    }

    return events;
  }, [searchQuery, selectedCity, activeCategory, filters]);

  const hasActiveFilters = Object.values(filters).some(value => value !== 'Any') ||
                          activeCategory !== 'All' ||
                          selectedCity !== 'All Cities' ||
                          searchQuery.trim();

  const MapView = () => (
    <div className="relative min-h-[500px] md:min-h-[600px]">
      {/* Map Header */}
      <div className="absolute top-6 left-6 right-6 z-20">
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="text-sm font-semibold text-text">
              {filteredEvents.length} events found
              {selectedCity !== 'All Cities' && ` in ${selectedCity}`}
            </div>
            <div className="flex items-center space-x-2 text-xs text-gray-600">
              <div className="w-3 h-3 bg-primary rounded-full"></div>
              <span>Food & Drink</span>
              <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
              <span>Nightlife</span>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span>Fitness</span>
            </div>
          </div>
        </div>
      </div>

      {/* Leaflet Map */}
      <LeafletMap
        events={filteredEvents}
        selectedCity={selectedCity}
        className="w-full"
      />

      {/* Map Legend */}
      <div className="absolute bottom-6 left-6 z-20">
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-3 shadow-lg max-w-xs">
          <div className="text-xs font-semibold text-gray-700 mb-2">Event Categories</div>
          <div className="grid grid-cols-1 gap-1 text-xs">
            {Array.from(new Set(filteredEvents.map(e => e.category))).slice(0, 6).map((category) => {
              const colors = {
                'Food & Drink': '#FF6B35',
                'Nightlife': '#8B5CF6',
                'Fitness': '#10B981',
                'Outdoors': '#3B82F6',
                'Arts & Culture': '#EC4899',
                'Music': '#EF4444',
                'Networking': '#6B7280',
                'Wellness': '#14B8A6',
                'Sports': '#6366F1',
                'Pop-ups & Markets': '#F59E0B',
              };
              const eventCount = filteredEvents.filter(e => e.category === category).length;
              return (
                <div key={category} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: colors[category as keyof typeof colors] || '#FF6B35' }}
                    />
                    <span className="text-gray-600">{category}</span>
                  </div>
                  <span className="text-gray-500 font-medium">{eventCount}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Main Content (with padding for desktop sidebar) */}
      <div className="md:pl-72 pb-24 md:pb-8">
        {/* Header */}
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-sm border-b border-gray-100 px-6 py-4">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold text-text mb-6">Explore Events</h1>

            {/* Search Bar */}
            <div className="relative mb-4">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search events, categories, or locations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent focus:bg-white transition-all text-lg"
              />
            </div>

            {/* City Selector & View Toggle */}
            <div className="flex items-center justify-between">
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary text-sm font-semibold"
              >
                {allCities.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>

              <div className="flex items-center space-x-3">
                {/* View Toggle */}
                <div className="flex bg-gray-100 rounded-xl p-1">
                  <button
                    onClick={() => setIsMapView(false)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                      !isMapView ? 'bg-primary text-white' : 'text-gray-600 hover:text-gray-800'
                    }`}
                  >
                    <List className="w-4 h-4" />
                    <span>List</span>
                  </button>
                  <button
                    onClick={() => setIsMapView(true)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                      isMapView ? 'bg-primary text-white' : 'text-gray-600 hover:text-gray-800'
                    }`}
                  >
                    <Map className="w-4 h-4" />
                    <span>Map</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Filters */}
        <div className="sticky top-[140px] z-20 bg-white/90 backdrop-blur-sm border-b border-gray-100 px-6 py-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center space-x-4 overflow-x-auto scrollbar-hide">
              {/* Category Pills */}
              <div className="flex space-x-3 flex-shrink-0">
                {categories.slice(0, 4).map((category) => (
                  <button
                    key={category}
                    onClick={() => setActiveCategory(category)}
                    className={`px-5 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${
                      activeCategory === category
                        ? 'bg-primary text-white shadow-lg shadow-primary/25'
                        : 'bg-gray-50 text-gray-600 hover:bg-gray-100 hover:text-gray-800'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>

              {/* Filter Button */}
              <button
                onClick={() => setIsFilterOpen(true)}
                className={`flex items-center space-x-2 px-5 py-2.5 rounded-xl border text-sm font-semibold transition-all ${
                  hasActiveFilters
                    ? 'border-primary bg-primary/10 text-primary shadow-sm'
                    : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <Filter className="w-4 h-4" />
                <span>Filter</span>
                {hasActiveFilters && (
                  <span className="w-2 h-2 bg-primary rounded-full"></span>
                )}
              </button>
            </div>

            {/* Additional Category Pills */}
            <div className="flex space-x-3 mt-4 overflow-x-auto scrollbar-hide">
              {categories.slice(4).map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                    activeCategory === category
                      ? 'bg-primary text-white'
                      : 'bg-gray-50 text-gray-500 hover:bg-gray-100 hover:text-gray-700'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-8">
          <div className="max-w-7xl mx-auto">
            {/* Results Header */}
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-text mb-1">
                {searchQuery.trim()
                  ? `Search Results for "${searchQuery}"`
                  : selectedCity === 'All Cities'
                    ? 'All Events'
                    : `Events in ${selectedCity}`
                }
              </h2>
              <p className="text-muted text-sm">
                {filteredEvents.length} event{filteredEvents.length !== 1 ? 's' : ''} found
                {searchQuery.trim() && ' • Sorted by relevance'}
              </p>
            </div>

            {/* Map or List View */}
            {isMapView ? (
              <MapView />
            ) : (
              <div>
                {filteredEvents.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredEvents.map((event, index) => (
                      <AnimatedEventCard
                        key={event.id}
                        event={event}
                        index={index}
                        staggerDelay={100}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                      <Search className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-text mb-2">No events found</h3>
                    <p className="text-muted max-w-md mx-auto">
                      {searchQuery.trim()
                        ? `No events match "${searchQuery}". Try different keywords or adjust your filters.`
                        : `No events found with the current filters. Try adjusting your search criteria.`
                      }
                    </p>
                    {hasActiveFilters && (
                      <button
                        onClick={() => {
                          setSearchQuery('');
                          setSelectedCity('All Cities');
                          setActiveCategory('All');
                          setFilters({
                            category: 'All',
                            price: 'Any',
                            distance: 'Any',
                            ageGroup: 'Any',
                            date: 'Any'
                          });
                        }}
                        className="mt-4 px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-semibold"
                      >
                        Clear all filters
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Filter Sheet */}
      <FilterSheet
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        filters={filters}
        onFiltersChange={(newFilters) => {
          setFilters(newFilters);
          setActiveCategory(newFilters.category);
        }}
      />

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
}