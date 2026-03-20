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
import { mockEvents, mockCities, getPersonalizedEvents, getTrendingEvents } from '@/lib/mockData';
import { EventFilters, EventCategory } from '@/lib/types';
import { useApp } from '@/contexts/AppContext';
import { calculateDistance } from '@/lib/utils';
import { searchEvents } from '@/lib/searchUtils';
import {
  MainEventsGridSkeleton,
  FilterBarSkeleton
} from '@/components/SkeletonSections';

const categories: (EventCategory | 'All')[] = [
  'All',
  'Food & Drink',
  'Nightlife',
  'Date Night',
  'Late Night',
  'Brunch & Chill',
  'Fitness',
  'Outdoors',
  'Arts & Culture',
  'Music',
  'Skills & Hobbies',
  'Gaming & Tech',
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
  const [eventTypeFilter, setEventTypeFilter] = useState<'all' | 'business' | 'community'>('all');
  const [filters, setFilters] = useState<EventFilters>({
    category: 'All',
    price: 'Any',
    distance: 'Any',
    ageGroup: 'Any',
    date: 'Any',
    vibe: 'Any',
    groupSize: 'Any',
    recurring: 'Any',
    venue: 'Any'
  });

  // Filter events based on selected city, search query, and filters
  const filteredEvents = useMemo(() => {
    let events = mockEvents.filter(event => event.location.city === state.selectedCity);

    // Apply search filter first if there's a search query
    if (state.searchQuery.trim()) {
      const searchResults = searchEvents(events, state.searchQuery);
      events = searchResults.map(result => result.event);
    }

    // Apply event type filter (business vs personal)
    if (eventTypeFilter !== 'all') {
      events = events.filter(event => {
        if (eventTypeFilter === 'business') {
          return event.hostType === 'business' && event.hostVerified === true;
        }
        if (eventTypeFilter === 'community') {
          return event.hostType !== 'business' || !event.hostVerified;
        }
        return true;
      });
    }

    // Apply category filter
    if (activeCategory !== 'All') {
      events = events.filter(event => event.category === activeCategory);
    }

    // Apply additional filters
    if (filters.price !== 'Any') {
      events = events.filter(event => {
        if (filters.price === 'Free') return event.price === null;
        if (filters.price === 'Under $15') {
          // Check regular price, happy hour price, or student price
          const regularPrice = event.price !== null && event.price < 15;
          const happyHourPrice = event.happyHourPrice !== undefined && event.happyHourPrice < 15;
          const studentPrice = event.studentPrice !== undefined && event.studentPrice < 15;
          return regularPrice || happyHourPrice || studentPrice;
        }
        if (filters.price === 'Under $25') {
          const regularPrice = event.price !== null && event.price < 25;
          const happyHourPrice = event.happyHourPrice !== undefined && event.happyHourPrice < 25;
          const studentPrice = event.studentPrice !== undefined && event.studentPrice < 25;
          return regularPrice || happyHourPrice || studentPrice;
        }
        if (filters.price === 'Under $50') {
          const regularPrice = event.price !== null && event.price < 50;
          const happyHourPrice = event.happyHourPrice !== undefined && event.happyHourPrice < 50;
          const studentPrice = event.studentPrice !== undefined && event.studentPrice < 50;
          return regularPrice || happyHourPrice || studentPrice;
        }
        if (filters.price === 'Happy Hour') return event.hasHappyHour === true;
        if (filters.price === 'Student Discount') return event.hasStudentDiscount === true;
        return true;
      });
    }

    if (filters.ageGroup !== 'Any') {
      events = events.filter(event => event.ageGroup === filters.ageGroup);
    }

    // Apply vibe filter
    if (filters.vibe !== 'Any') {
      events = events.filter(event => {
        if (filters.vibe === 'Chill') return event.vibesTags.some(tag => ['Chill', 'Relaxed', 'Cozy', 'Intimate'].includes(tag));
        if (filters.vibe === 'High Energy') return event.vibesTags.some(tag => ['Energetic', 'Party', 'High Energy', 'Active'].includes(tag));
        if (filters.vibe === 'Networking') return event.vibesTags.some(tag => ['Professional', 'Networking', 'Business'].includes(tag));
        if (filters.vibe === 'Romantic') return event.vibesTags.some(tag => ['Romantic', 'Intimate', 'Date'].includes(tag));
        if (filters.vibe === 'Wild Night') return event.vibesTags.some(tag => ['Party', 'Wild', 'Late-night', 'Crazy'].includes(tag));
        return true;
      });
    }

    // Apply group size filter
    if (filters.groupSize !== 'Any') {
      events = events.filter(event => {
        const attendeeCount = event.attendeeIds.length;
        if (filters.groupSize === 'Solo-friendly') return attendeeCount <= 15 || event.vibesTags.includes('Solo-friendly');
        if (filters.groupSize === 'Small group (2-5)') return attendeeCount <= 25;
        if (filters.groupSize === 'Big crowd (10+)') return attendeeCount >= 30;
        return true;
      });
    }

    // Apply recurring filter
    if (filters.recurring !== 'Any') {
      events = events.filter(event => {
        const isRecurring = event.vibesTags.includes('Regular') || event.vibesTags.includes('Weekly') || event.vibesTags.includes('Monthly');
        if (filters.recurring === 'Recurring') return isRecurring;
        if (filters.recurring === 'One-time') return !isRecurring;
        return true;
      });
    }

    // Apply venue filter
    if (filters.venue !== 'Any') {
      events = events.filter(event => {
        if (filters.venue === 'Outdoor') return event.vibesTags.some(tag => ['Outdoor', 'Scenic', 'Adventure', 'Park'].includes(tag));
        if (filters.venue === 'Indoor') return !event.vibesTags.some(tag => ['Outdoor', 'Scenic', 'Adventure', 'Park'].includes(tag));
        return true;
      });
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
  }, [state.selectedCity, state.searchQuery, eventTypeFilter, activeCategory, filters, state.nearMeEnabled, state.userLocation]);


  const hasActiveFilters = Object.values(filters).some(value => value !== 'Any') || activeCategory !== 'All' || state.searchQuery.trim() || eventTypeFilter !== 'all';

  // Get personalized recommendations when no active filters or search
  const personalizedEvents = useMemo(() => {
    if (!hasActiveFilters && !isInitialLoading) {
      return getPersonalizedEvents('current');
    }
    return [];
  }, [hasActiveFilters, isInitialLoading]);

  // Get trending events
  const trendingEvents = useMemo(() => {
    if (!hasActiveFilters && !isInitialLoading) {
      return getTrendingEvents();
    }
    return [];
  }, [hasActiveFilters, isInitialLoading]);

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
  }, [state.selectedCity, state.searchQuery, eventTypeFilter, activeCategory, filters, isInitialLoading]);

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
                  src="/gaggle-logo.png"
                  alt="Gaggle Logo"
                  width={280}
                  height={88}
                  loading="eager"
                  className="h-16 w-auto"
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

          {/* Event Type Filter Toggle - Skeleton */}
          <div className="sticky top-[85px] z-30 bg-white/95 backdrop-blur-sm border-b border-gray-50 px-6 py-3">
            <div className="max-w-7xl mx-auto">
              <div className="flex items-center justify-between">
                <div className="h-5 bg-gray-200 rounded w-48 animate-pulse"></div>
                <div className="flex items-center bg-gray-100 rounded-lg p-1">
                  <div className="h-8 bg-gray-200 rounded-md w-20 animate-pulse mr-1"></div>
                  <div className="h-8 bg-gray-200 rounded-md w-28 animate-pulse mr-1"></div>
                  <div className="h-8 bg-gray-200 rounded-md w-32 animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Skeleton Sections */}
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
                src="/gaggle-logo.png"
                alt="Gaggle Logo"
                width={140}
                height={44}
                loading="eager"
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

        {/* Event Type Filter Toggle */}
        <div className="sticky top-[85px] z-30 bg-white/95 backdrop-blur-sm border-b border-gray-50 px-6 py-3">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between">
              {/* Tagline */}

              {/* Toggle Buttons */}
              <div className="flex items-center bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setEventTypeFilter('all')}
                  className={`px-4 py-1.5 text-sm font-semibold rounded-md transition-all ${
                    eventTypeFilter === 'all'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  All Events
                </button>
                <button
                  onClick={() => setEventTypeFilter('business')}
                  className={`px-4 py-1.5 text-sm font-semibold rounded-md transition-all flex items-center space-x-1 ${
                    eventTypeFilter === 'business'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <span>Business Events</span>
                  <svg className="w-3.5 h-3.5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </button>
                <button
                  onClick={() => setEventTypeFilter('community')}
                  className={`px-4 py-1.5 text-sm font-semibold rounded-md transition-all ${
                    eventTypeFilter === 'community'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Community Events
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Bar */}
        {isFilterLoading ? (
          <FilterBarSkeleton />
        ) : (
          <div className="sticky top-[144px] z-20 bg-white/90 backdrop-blur-sm border-b border-gray-100 px-6 py-4">
            <div className="max-w-7xl mx-auto">
              <div className="flex items-center space-x-4 overflow-x-auto scrollbar-hide">
                {/* Category Tabs */}
                <div className="flex space-x-3 flex-shrink-0">
                  {categories.slice(0, 4).map((category) => (
                    <button
                      key={category}
                      onClick={() => setActiveCategory(category)}
                      className={`font-body text-ui-button px-5 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${
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
                    className={`font-body text-ui-caption px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
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
              <div className="w-full h-full bg-gray-100 rounded-2xl flex items-center justify-center">
                <div className="text-center">
                  <p className="text-gray-600 text-lg font-semibold">Interactive Map</p>
                  <p className="text-gray-500 text-sm mt-2">Available on the Explore page</p>
                </div>
              </div>
            </div>
          </section>
        ) : (
          <>
            {/* For You Section - Only show when no filters/search active */}
            {personalizedEvents.length > 0 && (
              <section className="px-6 py-6">
                <div className="max-w-7xl mx-auto">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="font-editorial text-editorial-lg font-semibold text-text mb-1">
                        For You ✨
                      </h2>
                      <p className="font-body text-body-primary text-muted text-sm">
                        Events picked just for you based on your interests and friend activity
                      </p>
                    </div>
                  </div>

                  {/* Horizontal scrolling event cards */}
                  <div className="overflow-x-auto scrollbar-hide">
                    <div className="flex space-x-4 pb-4">
                      {personalizedEvents.map((event, index) => (
                        <div key={event.id} className="flex-shrink-0 w-72">
                          <AnimatedEventCard
                            event={event}
                            index={index}
                            staggerDelay={50}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* Trending Now Section */}
            {trendingEvents.length > 0 && (
              <section className="px-6 py-6 bg-gradient-to-r from-orange-50 via-red-50 to-pink-50">
                <div className="max-w-7xl mx-auto">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="font-editorial text-editorial-lg font-semibold text-text mb-1">
                        Trending Now 🔥
                      </h2>
                      <p className="font-body text-body-primary text-muted text-sm">
                        What everyone's talking about right now
                      </p>
                    </div>
                  </div>

                  {/* Horizontal scrolling trending events */}
                  <div className="overflow-x-auto scrollbar-hide">
                    <div className="flex space-x-4 pb-4">
                      {trendingEvents.map((event, index) => (
                        <div key={event.id} className="flex-shrink-0 w-80">
                          <AnimatedEventCard
                            event={event}
                            index={index}
                            staggerDelay={75}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* Main Events Grid */}
            {isFilterLoading ? (
              <MainEventsGridSkeleton selectedCity={state.selectedCity} />
            ) : (
              <section className="px-6 py-8 pb-24 md:pb-8">
                <div className="max-w-7xl mx-auto">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="font-editorial text-editorial-lg font-semibold text-text mb-1">
                        {state.searchQuery.trim()
                          ? `Search Results for "${state.searchQuery}"`
                          : state.nearMeEnabled
                            ? 'Events Near You'
                            : `Events in ${state.selectedCity}`
                        }
                      </h2>
                      <p className="font-body text-body-primary text-muted text-sm">
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
                      <h3 className="font-editorial text-editorial-md font-semibold text-text mb-2">No events found</h3>
                      <p className="font-body text-body-primary text-muted max-w-md mx-auto">
                        {state.searchQuery.trim()
                          ? `No events match "${state.searchQuery}" in ${state.selectedCity}. Try different keywords or check other cities.`
                          : `Try adjusting your filters or check back later for new events in ${state.selectedCity}`
                        }
                      </p>
                      {state.searchQuery.trim() && (
                        <button
                          onClick={() => setSearchQuery('')}
                          className="font-body text-ui-button mt-4 px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-semibold"
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
