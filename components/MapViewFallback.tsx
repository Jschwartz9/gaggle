'use client';

import { useState, useMemo } from 'react';
import { Event, EventCategory } from '@/lib/types';
import { useApp } from '@/contexts/AppContext';
import { mockEvents } from '@/lib/mockData';
import { MapPin, Users, Clock, DollarSign, Heart, Calendar, Navigation } from 'lucide-react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import Link from 'next/link';

// Category color mapping
const getCategoryColor = (category: EventCategory): string => {
  const colors: Record<EventCategory, string> = {
    'Food & Drink': '#FF6A2A',
    'Nightlife': '#FF1744',
    'Date Night': '#E91E63',
    'Late Night': '#9C27B0',
    'Brunch & Chill': '#FF9800',
    'Fitness': '#4CAF50',
    'Outdoors': '#2E7D32',
    'Arts & Culture': '#9C27B0',
    'Music': '#E91E63',
    'Skills & Hobbies': '#00BCD4',
    'Gaming & Tech': '#1976D2',
    'Networking': '#1976D2',
    'Wellness': '#00BCD4',
    'Sports': '#FF9800',
    'Pop-ups & Markets': '#795548',
  };
  return colors[category] || '#FF6A2A';
};

interface MapViewFallbackProps {
  className?: string;
}

const MapViewFallback = ({ className = '' }: MapViewFallbackProps) => {
  const { state, toggleSavedEvent, toggleRSVP } = useApp();
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  // Filter events for the current city and only those with coordinates
  const eventsWithCoordinates = useMemo(() => {
    return mockEvents.filter(event =>
      event.location.city === state.selectedCity &&
      event.location.coordinates
    );
  }, [state.selectedCity]);

  const handleEventClick = (event: Event) => {
    setSelectedEvent(selectedEvent?.id === event.id ? null : event);
  };

  return (
    <div className={`relative w-full h-full bg-gradient-to-br from-blue-50 to-green-50 ${className}`}>
      {/* Map-style background */}
      <div className="absolute inset-0 opacity-10">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#94a3b8" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* City Info Card */}
      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-4 border border-gray-100 z-10">
        <div className="text-sm font-semibold text-text mb-1">
          📍 {state.selectedCity} Map View
        </div>
        <div className="text-xs text-muted">
          {eventsWithCoordinates.length} events visible
        </div>
        <div className="text-xs text-blue-600 mt-1">
          🗺️ Interactive map loading...
        </div>
      </div>

      {/* Event Markers Grid */}
      <div className="absolute inset-0 p-8 pt-20">
        <div className="relative h-full max-w-4xl mx-auto">
          {eventsWithCoordinates.map((event, index) => {
            // Distribute events across the map area
            const position = {
              left: `${15 + (index % 4) * 20 + Math.random() * 10}%`,
              top: `${20 + Math.floor(index / 4) * 20 + Math.random() * 10}%`
            };

            return (
              <motion.div
                key={event.id}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="absolute cursor-pointer"
                style={position}
                onClick={() => handleEventClick(event)}
              >
                {/* Event Marker */}
                <motion.div
                  whileHover={{ scale: 1.2 }}
                  className={`w-8 h-8 rounded-full border-2 border-white shadow-lg flex items-center justify-center relative ${
                    selectedEvent?.id === event.id ? 'ring-4 ring-primary/30 scale-125' : ''
                  }`}
                  style={{ backgroundColor: getCategoryColor(event.category) }}
                >
                  <MapPin className="w-4 h-4 text-white" />
                  {event.featured && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full border border-white"></div>
                  )}
                </motion.div>

                {/* Event Popup */}
                {selectedEvent?.id === event.id && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-4 w-80 bg-white rounded-xl shadow-xl border border-gray-100 z-20"
                  >
                    {/* Event Image */}
                    <div className="relative h-32 w-full">
                      <Image
                        src={event.imageUrl}
                        alt={event.title}
                        fill
                        className="object-cover rounded-t-xl"
                        sizes="320px"
                      />
                      <div className="absolute top-2 right-2 px-2 py-1 bg-black/50 rounded-full text-white text-xs font-semibold">
                        {event.category}
                      </div>
                    </div>

                    {/* Event Content */}
                    <div className="p-4">
                      <h3 className="font-bold text-lg text-text mb-2 line-clamp-2">
                        {event.title}
                      </h3>

                      <p className="text-muted text-sm mb-3 line-clamp-2">
                        {event.description}
                      </p>

                      {/* Event Details */}
                      <div className="space-y-2 mb-3">
                        <div className="flex items-center text-sm text-text">
                          <Clock className="w-4 h-4 text-primary mr-2" />
                          <span>{event.date} • {event.time}</span>
                        </div>

                        <div className="flex items-center text-sm text-text">
                          <MapPin className="w-4 h-4 text-primary mr-2" />
                          <span>{event.location.neighborhood}</span>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center text-sm text-text">
                            <Users className="w-4 h-4 text-primary mr-2" />
                            <span>{event.attendeeIds.length} going</span>
                          </div>

                          <div className="flex items-center text-sm text-text">
                            <DollarSign className="w-4 h-4 text-primary mr-2" />
                            <span className="font-semibold">
                              {event.price === null ? 'Free' : `$${event.price}`}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex space-x-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleSavedEvent(event.id);
                          }}
                          className={`flex-1 flex items-center justify-center space-x-1 py-2 px-3 rounded-lg font-semibold text-xs transition-colors ${
                            state.savedEvents.has(event.id)
                              ? 'bg-red-100 text-red-600 border border-red-200'
                              : 'bg-gray-100 text-gray-600 border border-gray-200 hover:bg-gray-200'
                          }`}
                        >
                          <Heart className={`w-3 h-3 ${
                            state.savedEvents.has(event.id) ? 'fill-current' : ''
                          }`} />
                          <span>Save</span>
                        </button>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleRSVP(event.id);
                          }}
                          className={`flex-1 flex items-center justify-center space-x-1 py-2 px-3 rounded-lg font-semibold text-xs transition-colors ${
                            state.userRSVPs.has(event.id)
                              ? 'bg-primary text-white'
                              : 'bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20'
                          }`}
                        >
                          <Calendar className="w-3 h-3" />
                          <span>{state.userRSVPs.has(event.id) ? 'Going' : 'RSVP'}</span>
                        </button>

                        <Link href={`/events/${event.id}`} className="flex-1">
                          <button className="w-full bg-primary text-white py-2 px-3 rounded-lg font-semibold text-xs hover:bg-primary/90 transition-colors">
                            Details
                          </button>
                        </Link>
                      </div>
                    </div>

                    {/* Arrow pointing to marker */}
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent border-t-white"></div>
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Map Legend */}
      <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-4 border border-gray-100 max-w-xs">
        <div className="text-sm font-semibold text-text mb-2">Event Categories</div>
        <div className="space-y-1 text-xs">
          {Array.from(new Set(eventsWithCoordinates.map(e => e.category))).map(category => (
            <div key={category} className="flex items-center">
              <div
                className="w-3 h-3 rounded-full mr-2"
                style={{ backgroundColor: getCategoryColor(category) }}
              />
              <span className="text-muted">{category}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Map Status */}
      <div className="absolute bottom-4 right-4 bg-blue-500 text-white px-3 py-2 rounded-lg text-sm font-semibold">
        🔄 Loading full map...
      </div>
    </div>
  );
};

export default MapViewFallback;