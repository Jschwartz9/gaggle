'use client';

import { useState, useMemo, useCallback, useRef } from 'react';
import Map, { Marker, Popup, NavigationControl, FullscreenControl, ScaleControl, GeolocateControl } from 'react-map-gl/mapbox';
import { Event, EventCategory } from '@/lib/types';
import { useApp } from '@/contexts/AppContext';
import { mockEvents } from '@/lib/mockData';
import { MapPin, Users, Clock, DollarSign, Heart, Calendar, Navigation, Maximize2, Layers, Filter } from 'lucide-react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

// Category color mapping matching the existing design
const getCategoryColor = (category: EventCategory): string => {
  const colors = {
    'Food & Drink': '#FF6A2A', // Orange accent color
    'Nightlife': '#FF1744',
    'Fitness': '#4CAF50',
    'Outdoors': '#2E7D32',
    'Arts & Culture': '#9C27B0',
    'Music': '#E91E63',
    'Networking': '#1976D2',
    'Wellness': '#00BCD4',
    'Sports': '#FF9800',
    'Pop-ups & Markets': '#795548',
  };
  return colors[category] || '#FF6A2A';
};

interface MapViewProps {
  className?: string;
}

const MapView = ({ className = '' }: MapViewProps) => {
  const { state, toggleSavedEvent, toggleRSVP } = useApp();
  const mapRef = useRef<any>(null);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [hoveredEvent, setHoveredEvent] = useState<Event | null>(null);
  const [mapStyle, setMapStyle] = useState('mapbox://styles/mapbox/light-v11');
  const [showCategoryFilter, setShowCategoryFilter] = useState(false);
  const [visibleCategories, setVisibleCategories] = useState<Set<EventCategory>>(new Set());
  const [isClusteringEnabled, setIsClusteringEnabled] = useState(true);
  const [viewState, setViewState] = useState({
    longitude: -74.0060,
    latitude: 40.7128,
    zoom: 12,
  });

  // Filter events for the current city and only those with coordinates
  const eventsWithCoordinates = useMemo(() => {
    let events = mockEvents.filter(event =>
      event.location.city === state.selectedCity &&
      event.location.coordinates
    );

    // Apply category filter if categories are selected
    if (visibleCategories.size > 0) {
      events = events.filter(event => visibleCategories.has(event.category));
    }

    return events;
  }, [state.selectedCity, visibleCategories]);

  // Get city center coordinates for initial view
  const cityCenter = useMemo(() => {
    const cityCoords = {
      'New York': { lng: -74.0060, lat: 40.7128 },
      'Los Angeles': { lng: -118.2437, lat: 34.0522 },
      'Chicago': { lng: -87.6298, lat: 41.8781 },
      'Houston': { lng: -95.3698, lat: 29.7604 },
      'Miami': { lng: -80.1918, lat: 25.7617 },
      'Austin': { lng: -97.7431, lat: 30.2672 },
      'Nashville': { lng: -86.7816, lat: 36.1627 },
      'Atlanta': { lng: -84.3880, lat: 33.7490 },
      'Denver': { lng: -104.9903, lat: 39.7392 },
      'Washington DC': { lng: -77.0369, lat: 38.9072 },
      'Lexington': { lng: -79.4426, lat: 37.7844 },
    };
    return cityCoords[state.selectedCity as keyof typeof cityCoords] || cityCoords['New York'];
  }, [state.selectedCity]);

  // Update view when city changes
  useMemo(() => {
    setViewState(prev => ({
      ...prev,
      longitude: cityCenter.lng,
      latitude: cityCenter.lat,
      zoom: state.selectedCity === 'Lexington' ? 13 : 12, // Zoom in more for smaller city
    }));
  }, [cityCenter, state.selectedCity]);

  const handleMarkerClick = useCallback((event: Event) => {
    setSelectedEvent(event);
    // Animate to marker location
    if (mapRef.current && event.location.coordinates) {
      mapRef.current.flyTo({
        center: [event.location.coordinates.lng, event.location.coordinates.lat],
        zoom: 15,
        duration: 1000
      });
    }
  }, []);

  const handleMarkerHover = useCallback((event: Event | null) => {
    setHoveredEvent(event);
  }, []);

  const handleBookmarkClick = useCallback((event: Event, e: React.MouseEvent) => {
    e.stopPropagation();
    toggleSavedEvent(event.id);
  }, [toggleSavedEvent]);

  const handleRSVPClick = useCallback((event: Event, e: React.MouseEvent) => {
    e.stopPropagation();
    toggleRSVP(event.id);
  }, [toggleRSVP]);

  const toggleCategoryVisibility = useCallback((category: EventCategory) => {
    setVisibleCategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(category)) {
        newSet.delete(category);
      } else {
        newSet.add(category);
      }
      return newSet;
    });
  }, []);

  const resetMapView = useCallback(() => {
    if (mapRef.current) {
      mapRef.current.flyTo({
        center: [cityCenter.lng, cityCenter.lat],
        zoom: state.selectedCity === 'Lexington' ? 13 : 12,
        duration: 1000
      });
    }
    setSelectedEvent(null);
  }, [cityCenter, state.selectedCity]);

  // Get unique categories from filtered events
  const availableCategories = useMemo(() => {
    return Array.from(new Set(eventsWithCoordinates.map(e => e.category)));
  }, [eventsWithCoordinates]);

  const handleClosePopup = useCallback(() => {
    setSelectedEvent(null);
  }, []);

  const formatEventTime = (timeString: string): string => {
    return timeString;
  };

  const formatEventPrice = (price: number | null): string => {
    return price === null ? 'Free' : `$${price}`;
  };

  return (
    <div className={`relative w-full h-full ${className}`}>
      <Map
        ref={mapRef}
        {...viewState}
        onMove={evt => setViewState(evt.viewState)}
        mapStyle="mapbox://styles/mapbox/light-v11"
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN || 'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4M29iazA2Z2gycXA4N2pmbDZmangifQ.-g_vE53SD2WrJ_TTWCiEw'}
        style={{ width: '100%', height: '100%' }}
        attributionControl={false}
        logoPosition="bottom-left"
      >
        {/* Event Markers */}
        {eventsWithCoordinates.map((event) => (
          <Marker
            key={event.id}
            longitude={event.location.coordinates!.lng}
            latitude={event.location.coordinates!.lat}
            anchor="bottom"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{
                scale: selectedEvent?.id === event.id ? 1.3 : hoveredEvent?.id === event.id ? 1.2 : 1
              }}
              whileHover={{ scale: 1.2 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="cursor-pointer relative"
              onClick={() => handleMarkerClick(event)}
              onMouseEnter={() => handleMarkerHover(event)}
              onMouseLeave={() => handleMarkerHover(null)}
            >
              <div
                className={`w-8 h-8 rounded-full border-2 border-white shadow-lg flex items-center justify-center relative ${
                  selectedEvent?.id === event.id ? 'ring-4 ring-primary/30' : ''
                }`}
                style={{ backgroundColor: getCategoryColor(event.category) }}
              >
                <MapPin className="w-4 h-4 text-white" />
                {event.featured && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full border border-white"></div>
                )}
                {event.sponsored && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full border border-white"></div>
                )}
              </div>

              {/* Hover tooltip */}
              <AnimatePresence>
                {hoveredEvent?.id === event.id && !selectedEvent && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-black/80 text-white text-sm rounded-lg whitespace-nowrap pointer-events-none z-50"
                  >
                    {event.title}
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-black/80"></div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </Marker>
        ))}

        {/* User Location Marker (if available) */}
        {state.userLocation && (
          <Marker
            longitude={state.userLocation.longitude}
            latitude={state.userLocation.latitude}
            anchor="center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
              className="w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-lg"
            />
          </Marker>
        )}

        {/* Event Popup */}
        <AnimatePresence>
          {selectedEvent && selectedEvent.location.coordinates && (
            <Popup
              longitude={selectedEvent.location.coordinates.lng}
              latitude={selectedEvent.location.coordinates.lat}
              anchor="bottom"
              onClose={handleClosePopup}
              closeButton={false}
              className="map-popup"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.2 }}
                className="w-80 bg-white rounded-xl shadow-xl overflow-hidden border border-gray-100"
              >
                {/* Event Image */}
                <div className="relative h-32 w-full">
                  <Image
                    src={selectedEvent.imageUrl}
                    alt={selectedEvent.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-2 right-2 px-2 py-1 bg-black/50 rounded-full text-white text-xs font-semibold">
                    {selectedEvent.category}
                  </div>
                  {selectedEvent.featured && (
                    <div className="absolute top-2 left-2 px-2 py-1 bg-primary rounded-full text-white text-xs font-semibold">
                      Featured
                    </div>
                  )}
                </div>

                {/* Event Content */}
                <div className="p-4">
                  <h3 className="font-bold text-lg text-text mb-2 line-clamp-2">
                    {selectedEvent.title}
                  </h3>

                  <p className="text-muted text-sm mb-3 line-clamp-2">
                    {selectedEvent.description}
                  </p>

                  {/* Event Details */}
                  <div className="space-y-2 mb-3">
                    <div className="flex items-center text-sm text-text">
                      <Clock className="w-4 h-4 text-primary mr-2" />
                      <span>{selectedEvent.date} • {formatEventTime(selectedEvent.time)}</span>
                    </div>

                    <div className="flex items-center text-sm text-text">
                      <MapPin className="w-4 h-4 text-primary mr-2" />
                      <span>{selectedEvent.location.neighborhood}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-sm text-text">
                        <Users className="w-4 h-4 text-primary mr-2" />
                        <span>{selectedEvent.attendeeIds.length} going</span>
                      </div>

                      <div className="flex items-center text-sm text-text">
                        <DollarSign className="w-4 h-4 text-primary mr-2" />
                        <span className="font-semibold">{formatEventPrice(selectedEvent.price)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-2">
                    <button
                      onClick={(e) => handleBookmarkClick(selectedEvent, e)}
                      className={`flex-1 flex items-center justify-center space-x-2 py-2 px-3 rounded-lg font-semibold text-sm transition-colors ${
                        state.savedEvents.has(selectedEvent.id)
                          ? 'bg-red-100 text-red-600 border border-red-200'
                          : 'bg-gray-100 text-gray-600 border border-gray-200 hover:bg-gray-200'
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${
                        state.savedEvents.has(selectedEvent.id) ? 'fill-current' : ''
                      }`} />
                      <span className="hidden sm:inline">Save</span>
                    </button>

                    <button
                      onClick={(e) => handleRSVPClick(selectedEvent, e)}
                      className={`flex-1 flex items-center justify-center space-x-2 py-2 px-3 rounded-lg font-semibold text-sm transition-colors ${
                        state.userRSVPs.has(selectedEvent.id)
                          ? 'bg-primary text-white'
                          : 'bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20'
                      }`}
                    >
                      <Calendar className="w-4 h-4" />
                      <span className="hidden sm:inline">
                        {state.userRSVPs.has(selectedEvent.id) ? 'Going' : 'RSVP'}
                      </span>
                    </button>

                    <Link href={`/events/${selectedEvent.id}`} className="flex-1">
                      <button className="w-full bg-primary text-white py-2 px-3 rounded-lg font-semibold text-sm hover:bg-primary/90 transition-colors">
                        View Details
                      </button>
                    </Link>
                  </div>
                </div>

                {/* Close Button */}
                <button
                  onClick={handleClosePopup}
                  className="absolute top-2 right-2 w-6 h-6 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors"
                >
                  <span className="text-gray-600 text-sm">×</span>
                </button>
              </motion.div>
            </Popup>
          )}
        </AnimatePresence>
        {/* Map Controls */}
        <NavigationControl position="top-right" />
        <FullscreenControl position="top-right" />
        <GeolocateControl
          position="top-right"
          trackUserLocation={true}
          showUserLocation={true}
        />
        <ScaleControl position="bottom-right" />
      </Map>

      {/* Enhanced Map Controls Overlay */}
      <div className="absolute top-4 left-4 space-y-2">
        {/* City Info Card */}
        <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-4 border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm font-semibold text-text">
              {state.selectedCity}
            </div>
            <button
              onClick={resetMapView}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              title="Reset map view"
            >
              <Navigation className="w-4 h-4 text-gray-600" />
            </button>
          </div>
          <div className="text-xs text-muted">
            {eventsWithCoordinates.length} event{eventsWithCoordinates.length !== 1 ? 's' : ''} visible
          </div>
        </div>

        {/* Map Style Selector */}
        <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-3 border border-gray-100">
          <div className="text-xs font-semibold text-text mb-2">Map Style</div>
          <div className="flex space-x-2">
            {[
              { key: 'mapbox://styles/mapbox/light-v11', name: 'Light', emoji: '☀️' },
              { key: 'mapbox://styles/mapbox/dark-v11', name: 'Dark', emoji: '🌙' },
              { key: 'mapbox://styles/mapbox/satellite-v9', name: 'Satellite', emoji: '🛰️' },
            ].map((style) => (
              <button
                key={style.key}
                onClick={() => setMapStyle(style.key)}
                className={`flex flex-col items-center p-2 rounded-lg text-xs transition-colors ${
                  mapStyle === style.key
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                title={style.name}
              >
                <span className="text-base mb-1">{style.emoji}</span>
                <span className="hidden sm:inline">{style.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Category Filter Toggle */}
        <button
          onClick={() => setShowCategoryFilter(!showCategoryFilter)}
          className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-3 border border-gray-100 w-full flex items-center justify-between hover:bg-white transition-colors"
        >
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-primary" />
            <span className="text-sm font-semibold text-text">Categories</span>
          </div>
          <span className={`text-xs transition-transform ${
            showCategoryFilter ? 'rotate-180' : ''
          }`}>▼</span>
        </button>
      </div>

      {/* Enhanced Category Filter Panel */}
      <AnimatePresence>
        {showCategoryFilter && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-[280px] left-4 bg-white/95 backdrop-blur-sm rounded-xl shadow-lg border border-gray-100 p-4 max-w-xs z-10"
          >
            <div className="text-sm font-semibold text-text mb-3">Filter by Category</div>
            <div className="space-y-2">
              <button
                onClick={() => setVisibleCategories(new Set())}
                className="text-xs text-primary hover:text-primary/80 font-medium"
              >
                Clear all filters
              </button>
              {availableCategories.map(category => {
                const isVisible = visibleCategories.size === 0 || visibleCategories.has(category);
                const eventCount = eventsWithCoordinates.filter(e => e.category === category).length;
                return (
                  <div key={category} className="flex items-center justify-between">
                    <button
                      onClick={() => toggleCategoryVisibility(category)}
                      className={`flex items-center space-x-2 text-xs transition-colors ${
                        isVisible ? 'text-text' : 'text-gray-400'
                      }`}
                    >
                      <div
                        className={`w-3 h-3 rounded-full transition-all ${
                          isVisible ? 'scale-100' : 'scale-75 opacity-50'
                        }`}
                        style={{ backgroundColor: getCategoryColor(category) }}
                      />
                      <span className="truncate flex-1">{category}</span>
                    </button>
                    <span className={`text-xs font-medium ${
                      isVisible ? 'text-primary' : 'text-gray-400'
                    }`}>
                      {eventCount}
                    </span>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Event Count and Quick Stats */}
      <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-4 border border-gray-100 max-w-xs">
        <div className="text-sm font-semibold text-text mb-2">Map Overview</div>
        <div className="space-y-2 text-xs">
          <div className="flex justify-between">
            <span className="text-muted">Total Events:</span>
            <span className="font-medium text-text">{eventsWithCoordinates.length}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted">Categories:</span>
            <span className="font-medium text-text">{availableCategories.length}</span>
          </div>
          {state.userLocation && (
            <div className="flex justify-between">
              <span className="text-muted">Your Location:</span>
              <span className="font-medium text-primary">📍 Visible</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MapView;