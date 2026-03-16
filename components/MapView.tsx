'use client';

import { useState, useMemo, useCallback, useRef } from 'react';
import Map, { Marker, Popup } from 'react-map-gl/mapbox';
import { Event, EventCategory } from '@/lib/types';
import { useApp } from '@/contexts/AppContext';
import { mockEvents } from '@/lib/mockData';
import { MapPin, Users, Clock, DollarSign } from 'lucide-react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

// Category color mapping matching the existing design
const getCategoryColor = (category: EventCategory): string => {
  const colors = {
    'Food & Drink': '#FF6B35', // Primary orange
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
  return colors[category] || '#FF6B35';
};

interface MapViewProps {
  className?: string;
}

const MapView = ({ className = '' }: MapViewProps) => {
  const { state } = useApp();
  const mapRef = useRef<any>(null);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [viewState, setViewState] = useState({
    longitude: -74.0060,
    latitude: 40.7128,
    zoom: 12,
  });

  // Filter events for the current city and only those with coordinates
  const eventsWithCoordinates = useMemo(() => {
    return mockEvents.filter(event =>
      event.location.city === state.selectedCity &&
      event.location.coordinates
    );
  }, [state.selectedCity]);

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
  }, []);

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
              animate={{ scale: 1 }}
              whileHover={{ scale: 1.1 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="cursor-pointer"
              onClick={() => handleMarkerClick(event)}
            >
              <div
                className="w-8 h-8 rounded-full border-2 border-white shadow-lg flex items-center justify-center"
                style={{ backgroundColor: getCategoryColor(event.category) }}
              >
                <MapPin className="w-4 h-4 text-white" />
              </div>
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

                  {/* View Event Button */}
                  <button className="w-full bg-primary text-white py-2 px-4 rounded-xl font-semibold text-sm hover:bg-primary/90 transition-colors">
                    View Event Details
                  </button>
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
      </Map>

      {/* Map Controls Overlay */}
      <div className="absolute top-4 left-4 bg-white rounded-lg shadow-lg p-2">
        <div className="text-sm font-semibold text-text mb-1">
          {state.selectedCity}
        </div>
        <div className="text-xs text-muted">
          {eventsWithCoordinates.length} events
        </div>
      </div>

      {/* Category Legend */}
      <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg p-3 max-w-xs">
        <div className="text-sm font-semibold text-text mb-2">Event Categories</div>
        <div className="grid grid-cols-2 gap-1 text-xs">
          {Array.from(new Set(eventsWithCoordinates.map(e => e.category))).map(category => (
            <div key={category} className="flex items-center">
              <div
                className="w-2 h-2 rounded-full mr-2"
                style={{ backgroundColor: getCategoryColor(category) }}
              />
              <span className="text-muted truncate">{category}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MapView;