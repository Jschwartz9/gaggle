'use client';

import { useState, useMemo, useEffect } from 'react';
import { Filter } from 'lucide-react';
import Image from 'next/image';
import EventCard from '@/components/EventCard';
import AnimatedEventCard from '@/components/AnimatedEventCard';
import FilterSheet from '@/components/FilterSheet';
import CitySelector from '@/components/CitySelector';
import SearchBar from '@/components/SearchBar';
import BottomNav from '@/components/BottomNav';
import NearMeButton from '@/components/NearMeButton';
import MapView from '@/components/MapView';
import MapToggleButton from '@/components/MapToggleButton';
import { mockEvents, mockCities } from '@/lib/mockData';
import { EventFilters, EventCategory } from '@/lib/types';
import { useApp } from '@/contexts/AppContext';
import { calculateDistance } from '@/lib/utils';
import { searchEvents } from '@/lib/searchUtils';
import {
  FeaturedEventsSkeleton,
  HotThisWeekendSkeleton,
  MainEventsGridSkeleton,
  FilterBarSkeleton
} from '@/components/SkeletonSections';

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
  const { state, setSearchQuery } = useApp();
  const [activeCategory, setActiveCategory] = useState<EventCategory | 'All'>('All');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isFilterLoading, setIsFilterLoading] = useState(false);
  const [filters, setFilters] = useState<EventFilters>({
    category: 'All',
    price: 'Any',
    distance: 'Any',
    ageGroup: 'Any',
    date: 'Any'
  });

  // Filter events based on selected city, search query, and filters
  const filteredEvents = useMemo(() => {
    let events = mockEvents.filter(event => event.location.city === state.selectedCity);

    // Apply search filter first if there's a search query
    if (state.searchQuery.trim()) {
      const searchResults = searchEvents(events, state.searchQuery);
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

    // Sort by distance when near me is enabled (but preserve search relevance order if searching)
    if (state.nearMeEnabled && state.userLocation && !state.searchQuery.trim()) {
      events = events
        .filter(event => event.location.coordinates) // Only include events with coordinates
        .map(event => ({
          ...event,
          distance: calculateDistance(
            state.userLocation!.latitude,
            state.userLocation!.longitude,
            event.location.coordinates!.lat,
            event.location.coordinates!.lng
          ),
        }))
        .sort((a, b) => a.distance - b.distance);
    }

    return events;
  }, [state.selectedCity, state.searchQuery, activeCategory, filters, state.nearMeEnabled, state.userLocation]);

  // Featured/sponsored events for top section
  const sponsoredFeaturedEvents = useMemo(() => {
    return mockEvents
      .filter(event => event.location.city === state.selectedCity && (event.featured || event.sponsored))
      .sort((a, b) => {
        // Prioritize sponsored events first, then featured
        if (a.sponsored && !b.sponsored) return -1;
        if (!a.sponsored && b.sponsored) return 1;
        return b.attendeeIds.length - a.attendeeIds.length;
      })
      .slice(0, 3);
  }, [state.selectedCity]);

  // Featured events for "Hot This Weekend"
  const featuredEvents = useMemo(() => {
    return mockEvents
      .filter(event => event.location.city === state.selectedCity)
      .sort((a, b) => b.attendeeIds.length - a.attendeeIds.length)
      .slice(0, 5);
  }, [state.selectedCity]);

  const hasActiveFilters = Object.values(filters).some(value => value !== 'Any') || activeCategory !== 'All' || state.searchQuery.trim();

  // Simulate initial loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsInitialLoading(false);
    }, 1500); // 1.5 seconds loading time
    return () => clearTimeout(timer);
  }, []);

  // Handle filter loading when city, search, or filters change
  useEffect(() => {
    if (!isInitialLoading) {
      setIsFilterLoading(true);
      const timer = setTimeout(() => {
        setIsFilterLoading(false);
      }, 800); // 0.8 seconds for filter changes
      return () => clearTimeout(timer);
    }
  }, [state.selectedCity, state.searchQuery, activeCategory, filters, isInitialLoading]);

  // Show initial skeleton during first load
  if (isInitialLoading) {
    return (
      <div className="min-h-screen bg-background">
        {/* Main Content (with padding for desktop sidebar) */}
        <div className="md:pl-72">
          {/* Header */}
          <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-sm border-b border-gray-100 px-6 py-4">
            <div className="flex items-center justify-between max-w-7xl mx-auto gap-4">
              {/* Logo */}
              <div className="flex items-center flex-shrink-0">
                <Image
                  src="/gaggle-logo.svg"
                  alt="Gaggle Logo"
                  width={140}
                  height={44}
                  className="h-9 w-auto"
                />
              </div>

              {/* Search Bar - Hidden on mobile, shown on tablet+ */}
              <div className="hidden md:flex flex-1 max-w-lg">
                <SearchBar className="w-full" />
              </div>

              {/* City Selector */}
              <div className="flex-shrink-0">
                <CitySelector />
              </div>
            </div>

            {/* Mobile Search Bar */}
            <div className="md:hidden mt-4">
              <SearchBar className="w-full" />
            </div>
          </header>

          {/* Skeleton Sections */}
          <FeaturedEventsSkeleton />
          <HotThisWeekendSkeleton selectedCity={state.selectedCity} />
          <FilterBarSkeleton />
          <MainEventsGridSkeleton selectedCity={state.selectedCity} />
        </div>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Main Content (with padding for desktop sidebar) */}
      <div className="md:pl-72">
        {/* Header */}
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-sm border-b border-gray-100 px-6 py-4">
          <div className="flex items-center justify-between max-w-7xl mx-auto gap-4">
            {/* Logo */}
            <div className="flex items-center flex-shrink-0">
              <Image
                src="/gaggle-logo.svg"
                alt="Gaggle Logo"
                width={140}
                height={44}
                className="h-9 w-auto"
              />
            </div>

            {/* Search Bar - Hidden on mobile, shown on tablet+ */}
            <div className="hidden md:flex flex-1 max-w-lg">
              <SearchBar className="w-full" />
            </div>

            {/* City Selector */}
            <div className="flex-shrink-0">
              <CitySelector />
            </div>
          </div>

          {/* Mobile Search Bar */}
          <div className="md:hidden mt-4">
            <SearchBar className="w-full" />
          </div>
        </header>

{/* Featured & Sponsored Events Section - Hide in map view */}
        {!state.isMapView && (
          <>
            {isFilterLoading ? (
              <FeaturedEventsSkeleton />
            ) : sponsoredFeaturedEvents.length > 0 ? (
              <section className="px-6 py-8 bg-gradient-to-br from-primary/3 via-accent/2 to-transparent">
                <div className="max-w-7xl mx-auto">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-2xl font-bold text-text mb-1">Featured Events</h2>
                      <p className="text-muted text-sm">Hand-picked experiences you won't want to miss</p>
                    </div>
                    <span className="bg-primary text-white px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wide">
                      Don't Miss
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {sponsoredFeaturedEvents.map((event, index) => (
                      <AnimatedEventCard
                        key={event.id}
                        event={event}
                        index={index}
                        staggerDelay={100}
                      />
                    ))}
                  </div>
                </div>
              </section>
            ) : null}

            {/* Hot This Weekend / Curated Events Section */}
            {isFilterLoading ? (
              <HotThisWeekendSkeleton selectedCity={state.selectedCity} />
            ) : (
              <section className="px-6 py-8">
                <div className="max-w-7xl mx-auto">
                  {state.selectedCity === 'Lexington' ? (
                    <>
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h2 className="text-2xl font-bold text-text mb-1">Curated for Lexington</h2>
                          <p className="text-muted text-sm">
                            Specially selected experiences that showcase the best of Lexington's charm
                          </p>
                        </div>
                        <span className="bg-primary/10 text-primary px-3 py-1.5 rounded-full text-xs font-semibold">
                          Hand-picked
                        </span>
                      </div>
                    </>
                  ) : (
                    <div className="mb-6">
                      <h2 className="text-2xl font-bold text-text mb-1">Hot This Weekend</h2>
                      <p className="text-muted text-sm">Popular events happening near you</p>
                    </div>
                  )}
                  <div className="flex space-x-6 overflow-x-auto pb-4 scrollbar-hide">
                    {featuredEvents.map((event, index) => (
                      <div key={event.id} className="w-80 flex-shrink-0">
                        <AnimatedEventCard
                          event={event}
                          index={index}
                          staggerDelay={80}
                          reducedStagger={true}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            )}
          </>
        )}

        {/* Filter Bar */}
        {isFilterLoading ? (
          <FilterBarSkeleton />
        ) : (
          <div className="sticky top-[85px] z-20 bg-white/90 backdrop-blur-sm border-b border-gray-100 px-6 py-4">
            <div className="max-w-7xl mx-auto">
              <div className="flex items-center space-x-4 overflow-x-auto scrollbar-hide">
                {/* Category Tabs */}
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

                {/* Map Toggle Button */}
                <MapToggleButton className="flex-shrink-0" />

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
        )}

        {/* Map View or Events Grid */}
        {state.isMapView ? (
          <section className="relative">
            <div className="h-[calc(100vh-200px)] min-h-[500px]">
              <MapView className="w-full h-full" />
            </div>
          </section>
        ) : (
          <>
            {/* Events Grid */}
            {isFilterLoading ? (
              <MainEventsGridSkeleton selectedCity={state.selectedCity} />
            ) : (
              <section className="px-6 py-8 pb-24 md:pb-8">
                <div className="max-w-7xl mx-auto">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-2xl font-bold text-text mb-1">
                        {state.searchQuery.trim()
                          ? `Search Results for "${state.searchQuery}"`
                          : state.nearMeEnabled
                            ? 'Events Near You'
                            : `Events in ${state.selectedCity}`
                        }
                      </h2>
                      <p className="text-muted text-sm">
                        {filteredEvents.length} event{filteredEvents.length !== 1 ? 's' : ''}
                        {state.searchQuery.trim()
                          ? ` found in ${state.selectedCity}`
                          : ' available'
                        }
                        {state.nearMeEnabled && !state.searchQuery.trim() && ' • Sorted by distance'}
                        {state.searchQuery.trim() && ' • Sorted by relevance'}
                      </p>
                    </div>
                    <NearMeButton />
                  </div>

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
                        <span className="text-2xl">{state.searchQuery.trim() ? '🔍' : '🎉'}</span>
                      </div>
                      <h3 className="text-xl font-semibold text-text mb-2">No events found</h3>
                      <p className="text-muted max-w-md mx-auto">
                        {state.searchQuery.trim()
                          ? `No events match "${state.searchQuery}" in ${state.selectedCity}. Try different keywords or check other cities.`
                          : `Try adjusting your filters or check back later for new events in ${state.selectedCity}`
                        }
                      </p>
                      {state.searchQuery.trim() && (
                        <button
                          onClick={() => setSearchQuery('')}
                          className="mt-4 px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-semibold"
                        >
                          Clear search
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </section>
            )}
          </>
        )}
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
