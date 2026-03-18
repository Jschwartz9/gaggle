'use client';

import { useEffect, useRef, useState } from 'react';
import { Event } from '@/lib/types';
import { MapPin, ExternalLink, Copy } from 'lucide-react';
import { motion } from 'framer-motion';

// Get category color matching the app's theme
const getCategoryColor = (category: string): string => {
  const colors = {
    'Food & Drink': '#FF6B35', // Primary orange/coral
    'Nightlife': '#8B5CF6',    // Purple
    'Fitness': '#10B981',      // Green
    'Outdoors': '#3B82F6',     // Blue
    'Arts & Culture': '#EC4899', // Pink
    'Music': '#EF4444',        // Red
    'Networking': '#6B7280',   // Gray
    'Wellness': '#14B8A6',     // Teal
    'Sports': '#6366F1',       // Indigo
    'Pop-ups & Markets': '#F59E0B', // Amber
  };
  return colors[category as keyof typeof colors] || '#FF6B35';
};

interface EventLocationMapProps {
  event: Event;
  className?: string;
  height?: string;
}

export default function EventLocationMap({ event, className = '', height = 'h-48' }: EventLocationMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [copied, setCopied] = useState(false);

  const categoryColor = getCategoryColor(event.category);

  // Copy address functionality
  const copyAddress = async () => {
    if (event.location.address) {
      await navigator.clipboard.writeText(event.location.address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Open in external maps
  const openInMaps = () => {
    const query = encodeURIComponent(
      `${event.location.address || ''} ${event.location.neighborhood} ${event.location.city}`
    );
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    if (isMobile) {
      // Try Apple Maps first on iOS, then Google Maps
      window.open(`maps://?q=${query}`, '_blank') ||
      window.open(`https://maps.google.com/maps?q=${query}`, '_blank');
    } else {
      window.open(`https://maps.google.com/maps?q=${query}`, '_blank');
    }
  };

  useEffect(() => {
    // Dynamically import Leaflet only on client side
    const loadLeaflet = async () => {
      if (typeof window === 'undefined' || !event.location.coordinates) return;

      const L = await import('leaflet');

      // Fix for default markers
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
      });

      if (mapRef.current && !mapInstanceRef.current && event.location.coordinates) {
        // Initialize map centered on event location
        mapInstanceRef.current = L.map(mapRef.current).setView(
          [event.location.coordinates.lat, event.location.coordinates.lng],
          15
        );

        // Add OpenStreetMap tiles
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors',
          maxZoom: 18,
        }).addTo(mapInstanceRef.current);

        // Create custom marker HTML
        const markerHtml = `
          <div style="
            width: 32px;
            height: 32px;
            background-color: ${categoryColor};
            border: 3px solid white;
            border-radius: 50%;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
          ">
            <div style="
              width: 6px;
              height: 6px;
              background-color: white;
              border-radius: 50%;
            "></div>
            <div style="
              position: absolute;
              top: -4px;
              right: -4px;
              width: 16px;
              height: 16px;
              background-color: #FCD34D;
              border: 2px solid white;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 8px;
            ">
              🎉
            </div>
          </div>
        `;

        // Create custom icon
        const customIcon = L.divIcon({
          html: markerHtml,
          className: 'custom-event-marker',
          iconSize: [32, 32],
          iconAnchor: [16, 16],
          popupAnchor: [0, -16]
        });

        // Create popup content
        const popupContent = `
          <div style="min-width: 250px; font-family: system-ui, -apple-system, sans-serif;">
            <div style="padding: 12px 0;">
              <h3 style="margin: 0 0 8px 0; font-size: 18px; font-weight: 600; color: #1a1a1a; line-height: 1.3;">
                ${event.title}
              </h3>
              <p style="margin: 0 0 4px 0; font-size: 14px; color: #6b7280;">
                📅 ${event.date} • ${event.time}
              </p>
              <p style="margin: 0 0 4px 0; font-size: 14px; color: #6b7280;">
                📍 ${event.location.neighborhood}, ${event.location.city}
              </p>
              ${event.location.address ? `
                <p style="margin: 0 0 8px 0; font-size: 14px; color: #6b7280;">
                  ${event.location.address}
                </p>
              ` : ''}
              <p style="margin: 0 0 8px 0; font-size: 16px; font-weight: 600; color: ${categoryColor};">
                ${event.price === null ? 'Free' : `$${event.price}`}
              </p>
              <p style="margin: 0 0 16px 0; font-size: 13px; color: #9ca3af;">
                ${event.attendeeIds.length} people going
              </p>
              <div style="display: flex; gap: 8px;">
                <a
                  href="/events/${event.id}"
                  style="
                    display: inline-block;
                    background-color: ${categoryColor};
                    color: white;
                    padding: 10px 16px;
                    border-radius: 8px;
                    text-decoration: none;
                    font-size: 14px;
                    font-weight: 600;
                    transition: opacity 0.2s;
                    flex: 1;
                    text-align: center;
                  "
                  onmouseover="this.style.opacity='0.9'"
                  onmouseout="this.style.opacity='1'"
                >
                  View Details
                </a>
                <button
                  onclick="navigator.clipboard.writeText('${event.location.address || event.location.neighborhood + ', ' + event.location.city}')"
                  style="
                    background-color: #f3f4f6;
                    color: #6b7280;
                    padding: 10px;
                    border: none;
                    border-radius: 8px;
                    cursor: pointer;
                    font-size: 14px;
                    transition: background-color 0.2s;
                  "
                  onmouseover="this.style.backgroundColor='#e5e7eb'"
                  onmouseout="this.style.backgroundColor='#f3f4f6'"
                  title="Copy Address"
                >
                  📋
                </button>
              </div>
            </div>
          </div>
        `;

        // Create and add marker
        markerRef.current = L.marker(
          [event.location.coordinates.lat, event.location.coordinates.lng],
          { icon: customIcon }
        ).addTo(mapInstanceRef.current);

        // Bind popup
        markerRef.current.bindPopup(popupContent, {
          maxWidth: 320,
          className: 'custom-event-popup'
        });

        setIsLoaded(true);
      }
    };

    loadLeaflet();

    // Cleanup on unmount
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        markerRef.current = null;
        setIsLoaded(false);
      }
    };
  }, [event, categoryColor]);

  // If no coordinates, show a placeholder
  if (!event.location.coordinates) {
    return (
      <div className={`relative ${height} ${className} bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-xl overflow-hidden`}>
        {/* Street grid background */}
        <div className="absolute inset-0 opacity-20">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="street-grid" width="60" height="60" patternUnits="userSpaceOnUse">
                <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#6366f1" strokeWidth="1"/>
                <circle cx="30" cy="30" r="2" fill="#6366f1" opacity="0.6"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#street-grid)" />
          </svg>
        </div>

        {/* Event marker positioned in center */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="relative"
          >
            <div className="relative w-12 h-12 rounded-full border-3 border-white shadow-xl flex items-center justify-center z-10"
                 style={{ backgroundColor: categoryColor }}>
              <MapPin className="w-6 h-6 text-white drop-shadow-sm" />
            </div>
          </motion.div>
        </div>

        {/* Location info */}
        <div className="absolute bottom-4 left-4">
          <div className="bg-white/95 backdrop-blur-sm rounded-lg p-3 shadow-lg border border-gray-100 max-w-xs">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                   style={{ backgroundColor: `${categoryColor}20` }}>
                <MapPin className="w-3 h-3" style={{ color: categoryColor }} />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-gray-900 truncate">{event.location.neighborhood}</p>
                <p className="text-xs text-gray-600">{event.location.city}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="absolute top-4 right-4 flex flex-col space-y-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={openInMaps}
            className="bg-white/90 backdrop-blur-sm text-gray-700 p-3 rounded-xl shadow-lg hover:bg-white transition-colors border border-gray-200"
            title="Open in Maps App"
          >
            <ExternalLink className="w-5 h-5" />
          </motion.button>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Load Leaflet CSS */}
      <link
        rel="stylesheet"
        href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
        integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
        crossOrigin=""
      />
      <style jsx global>{`
        .custom-event-popup .leaflet-popup-content-wrapper {
          border-radius: 12px;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
        }
        .custom-event-popup .leaflet-popup-tip {
          background: white;
        }
        .custom-event-marker {
          background: transparent !important;
          border: none !important;
        }
        .leaflet-container {
          font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }
      `}</style>

      <div className={`relative ${height} ${className} rounded-xl overflow-hidden`}>
        <div
          ref={mapRef}
          className="w-full h-full"
          style={{ zIndex: 1 }}
        />

        {/* Loading overlay */}
        {!isLoaded && (
          <div className="absolute inset-0 bg-gray-100 rounded-xl flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-gray-600 text-sm">Loading map...</p>
            </div>
          </div>
        )}

        {/* Map controls overlay */}
        <div className="absolute top-4 right-4 flex flex-col space-y-2 z-20">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={openInMaps}
            className="bg-white/90 backdrop-blur-sm text-gray-700 p-3 rounded-xl shadow-lg hover:bg-white transition-colors border border-gray-200"
            title="Open in Maps App"
          >
            <ExternalLink className="w-5 h-5" />
          </motion.button>

          {event.location.address && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={copyAddress}
              className={`bg-white/90 backdrop-blur-sm p-3 rounded-xl shadow-lg transition-all border border-gray-200 ${
                copied ? 'text-green-600' : 'text-gray-700 hover:bg-white'
              }`}
              title={copied ? "Copied!" : "Copy Address"}
            >
              {copied ? (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-5 h-5 text-center"
                >
                  ✓
                </motion.div>
              ) : (
                <Copy className="w-5 h-5" />
              )}
            </motion.button>
          )}
        </div>

        {/* Location info overlay */}
        <div className="absolute bottom-4 left-4 z-20">
          <div className="bg-white/95 backdrop-blur-sm rounded-lg p-3 shadow-lg border border-gray-100 max-w-xs">
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                     style={{ backgroundColor: `${categoryColor}20` }}>
                  <MapPin className="w-3 h-3" style={{ color: categoryColor }} />
                </div>
                <div className="text-xs">
                  <p className="font-medium text-gray-900">{event.location.neighborhood}</p>
                  <p className="text-gray-600">{event.location.city}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}