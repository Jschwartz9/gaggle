'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Event } from '@/lib/types';
import { mockCities } from '@/lib/mockData';

// Category colors matching the app's theme
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

// Get city center coordinates
const getCityCoordinates = (cityName: string) => {
  if (cityName === 'All Cities') {
    // Default to center of US
    return { lat: 39.8283, lng: -98.5795 };
  }
  const city = mockCities.find(c => c.name === cityName);
  return city ? city.coordinates : { lat: 39.8283, lng: -98.5795 };
};

interface LeafletMapProps {
  events: Event[];
  selectedCity: string;
  className?: string;
}

export default function LeafletMap({ events, selectedCity, className = '' }: LeafletMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Dynamically import Leaflet only on client side
    const loadLeaflet = async () => {
      if (typeof window === 'undefined') return;

      const L = await import('leaflet');

      // Fix for default markers
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
      });

      if (mapRef.current && !mapInstanceRef.current) {
        const cityCoords = getCityCoordinates(selectedCity);
        const zoomLevel = selectedCity === 'All Cities' ? 4 : 12;

        // Initialize map
        mapInstanceRef.current = L.map(mapRef.current).setView(
          [cityCoords.lat, cityCoords.lng],
          zoomLevel
        );

        // Add OpenStreetMap tiles
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors',
          maxZoom: 18,
        }).addTo(mapInstanceRef.current);

        setIsLoaded(true);
      }
    };

    loadLeaflet();

    // Cleanup on unmount
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        markersRef.current = [];
        setIsLoaded(false);
      }
    };
  }, []);

  // Update map center when city changes
  useEffect(() => {
    if (mapInstanceRef.current && isLoaded) {
      const cityCoords = getCityCoordinates(selectedCity);
      const zoomLevel = selectedCity === 'All Cities' ? 4 : 12;
      mapInstanceRef.current.setView([cityCoords.lat, cityCoords.lng], zoomLevel);
    }
  }, [selectedCity, isLoaded]);

  // Update markers when events change
  useEffect(() => {
    if (!mapInstanceRef.current || !isLoaded) return;

    const L = require('leaflet');

    // Clear existing markers
    markersRef.current.forEach(marker => {
      mapInstanceRef.current.removeLayer(marker);
    });
    markersRef.current = [];

    // Filter events with coordinates
    const eventsWithCoordinates = events.filter(event => event.location.coordinates);

    // Add new markers
    eventsWithCoordinates.forEach(event => {
      if (!event.location.coordinates) return;

      const categoryColor = getCategoryColor(event.category);

      // Create custom marker HTML
      const markerHtml = `
        <div style="
          width: 24px;
          height: 24px;
          background-color: ${categoryColor};
          border: 3px solid white;
          border-radius: 50%;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          color: white;
          font-weight: bold;
        ">
          📍
        </div>
      `;

      // Create custom icon
      const customIcon = L.divIcon({
        html: markerHtml,
        className: 'custom-marker',
        iconSize: [24, 24],
        iconAnchor: [12, 12],
        popupAnchor: [0, -12]
      });

      // Create popup content
      const popupContent = `
        <div style="min-width: 200px; font-family: system-ui, -apple-system, sans-serif;">
          <div style="padding: 8px 0;">
            <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: 600; color: #1a1a1a; line-height: 1.3;">
              ${event.title}
            </h3>
            <p style="margin: 0 0 4px 0; font-size: 14px; color: #6b7280;">
              📅 ${event.date} • ${event.time}
            </p>
            <p style="margin: 0 0 4px 0; font-size: 14px; color: #6b7280;">
              📍 ${event.location.neighborhood}, ${event.location.city}
            </p>
            <p style="margin: 0 0 8px 0; font-size: 14px; font-weight: 600; color: ${categoryColor};">
              ${event.price === null ? 'Free' : `$${event.price}`}
            </p>
            <p style="margin: 0 0 12px 0; font-size: 12px; color: #9ca3af;">
              ${event.attendeeIds.length} people going
            </p>
            <a
              href="/events/${event.id}"
              style="
                display: inline-block;
                background-color: ${categoryColor};
                color: white;
                padding: 8px 16px;
                border-radius: 8px;
                text-decoration: none;
                font-size: 14px;
                font-weight: 600;
                transition: opacity 0.2s;
              "
              onmouseover="this.style.opacity='0.9'"
              onmouseout="this.style.opacity='1'"
            >
              View Event
            </a>
          </div>
        </div>
      `;

      // Create and add marker
      const marker = L.marker(
        [event.location.coordinates.lat, event.location.coordinates.lng],
        { icon: customIcon }
      ).addTo(mapInstanceRef.current);

      // Bind popup
      marker.bindPopup(popupContent, {
        maxWidth: 300,
        className: 'custom-popup'
      });

      markersRef.current.push(marker);
    });

    // Fit bounds if we have markers and not showing all cities
    if (markersRef.current.length > 0 && selectedCity !== 'All Cities') {
      const group = new L.featureGroup(markersRef.current);
      const bounds = group.getBounds();
      if (bounds.isValid()) {
        mapInstanceRef.current.fitBounds(bounds, {
          padding: [20, 20],
          maxZoom: 15
        });
      }
    }
  }, [events, isLoaded]);

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
        .custom-popup .leaflet-popup-content-wrapper {
          border-radius: 12px;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
        }
        .custom-popup .leaflet-popup-tip {
          background: white;
        }
        .custom-marker {
          background: transparent !important;
          border: none !important;
        }
        .leaflet-container {
          font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }
      `}</style>
      <div
        ref={mapRef}
        className={`w-full h-full min-h-[500px] rounded-2xl overflow-hidden ${className}`}
        style={{ zIndex: 1 }}
      />

      {/* Loading overlay */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-gray-100 rounded-2xl flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-600 text-sm">Loading map...</p>
          </div>
        </div>
      )}
    </>
  );
}