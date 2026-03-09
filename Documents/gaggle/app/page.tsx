'use client';

import { useState, useMemo } from 'react';
import { Filter } from 'lucide-react';
import EventCard from '@/components/EventCard';
import FilterSheet from '@/components/FilterSheet';
import CitySelector from '@/components/CitySelector';
import BottomNav from '@/components/BottomNav';
import { mockEvents, mockCities } from '@/lib/mockData';
import { EventFilters, EventCategory } from '@/lib/types';

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

export default function HomePage() {
  const [selectedCity, setSelectedCity] = useState('New York');
  const [activeCategory, setActiveCategory] = useState<EventCategory | 'All'>('All');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState<EventFilters>({
    category: 'All',
    price: 'Any',
    distance: 'Any',
    ageGroup: 'Any',
    date: 'Any'
  });

  // Filter events based on selected city and filters
  const filteredEvents = useMemo(() => {
    let events = mockEvents.filter(event => event.location.city === selectedCity);

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
  }, [selectedCity, activeCategory, filters]);

  // Featured events for "Hot This Weekend"
  const featuredEvents = useMemo(() => {
    return mockEvents
      .filter(event => event.location.city === selectedCity)
      .sort((a, b) => b.attendeeIds.length - a.attendeeIds.length)
      .slice(0, 5);
  }, [selectedCity]);

  const hasActiveFilters = Object.values(filters).some(value => value !== 'Any') || activeCategory !== 'All';

  return (
    <div className="min-h-screen bg-background">
      {/* Main Content (with padding for desktop sidebar) */}
      <div className="md:pl-64">
        {/* Header */}
        <header className="sticky top-0 z-30 bg-background border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <h1 className="text-2xl font-bold text-primary">Gaggle</h1>

            {/* City Selector */}
            <CitySelector
              selectedCity={selectedCity}
              onCitySelect={setSelectedCity}
            />
          </div>
        </header>

        {/* Hot This Weekend Section */}
        <section className="p-4">
          <h2 className="text-lg font-bold text-text mb-3">Hot This Weekend</h2>
          <div className="flex space-x-4 overflow-x-auto pb-2">
            {featuredEvents.map((event) => (
              <div key={event.id} className="w-72 flex-shrink-0">
                <EventCard event={event} />
              </div>
            ))}
          </div>
        </section>

        {/* Filter Bar */}
        <div className="sticky top-[73px] z-20 bg-background border-b border-gray-200 p-4">
          <div className="flex items-center space-x-4 overflow-x-auto">
            {/* Category Tabs */}
            <div className="flex space-x-2 flex-shrink-0">
              {categories.slice(0, 4).map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                    activeCategory === category
                      ? 'bg-primary text-deep'
                      : 'bg-gray-100 text-muted hover:bg-gray-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* Filter Button */}
            <button
              onClick={() => setIsFilterOpen(true)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-full border text-sm font-medium transition-colors ${
                hasActiveFilters
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-gray-300 text-muted hover:border-gray-400'
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
          <div className="flex space-x-2 mt-3 overflow-x-auto">
            {categories.slice(4).map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                  activeCategory === category
                    ? 'bg-primary text-deep'
                    : 'bg-gray-100 text-muted hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Events Grid */}
        <section className="p-4 pb-20 md:pb-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-text">
              Events in {selectedCity}
            </h2>
            <span className="text-sm text-muted">
              {filteredEvents.length} event{filteredEvents.length !== 1 ? 's' : ''}
            </span>
          </div>

          {filteredEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted text-lg mb-2">No events found</p>
              <p className="text-sm text-muted">
                Try adjusting your filters or check back later
              </p>
            </div>
          )}
        </section>
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
