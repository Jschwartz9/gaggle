'use client';

import { useState, useEffect } from 'react';
import { ChevronDown, MapPin, Search, Navigation, Loader } from 'lucide-react';
import { mockCities } from '@/lib/mockData';
import { useApp } from '@/contexts/AppContext';

interface CitySelectorProps {
  className?: string;
}

export default function CitySelector({ className = '' }: CitySelectorProps) {
  const { state, setCity, setUserLocation } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);

  const handleCitySelect = (cityName: string) => {
    setCity(cityName);
    setIsOpen(false);
    setSearchQuery('');
  };

  const detectLocation = async () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by this browser.');
      return;
    }

    setIsDetectingLocation(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ latitude, longitude });

        // Find closest city based on coordinates
        const closestCity = findClosestCity(latitude, longitude);
        if (closestCity) {
          setCity(closestCity.name);
        }

        setIsDetectingLocation(false);
        setIsOpen(false);
      },
      (error) => {
        console.error('Location detection failed:', error);
        setIsDetectingLocation(false);
        alert('Unable to detect your location. Please select a city manually.');
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000, // 5 minutes
      }
    );
  };

  const findClosestCity = (lat: number, lng: number) => {
    let closest = mockCities[0];
    let minDistance = calculateDistance(lat, lng, closest.coordinates.lat, closest.coordinates.lng);

    for (const city of mockCities) {
      const distance = calculateDistance(lat, lng, city.coordinates.lat, city.coordinates.lng);
      if (distance < minDistance) {
        minDistance = distance;
        closest = city;
      }
    }

    return closest;
  };

  const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number) => {
    const R = 6371; // Earth's radius in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLng = ((lng2 - lng1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const filteredCities = mockCities.filter(city =>
    city.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    city.state.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedCityData = mockCities.find(city => city.name === state.selectedCity);

  return (
    <div className={`relative ${className}`}>
      {/* City Selector Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-4 py-2.5 bg-white border border-gray-200 rounded-2xl hover:bg-gray-50 transition-all hover:scale-105 shadow-sm"
      >
        <MapPin className="w-5 h-5 text-primary" />
        <span className="font-semibold text-text">{selectedCityData?.name || state.selectedCity}</span>
        <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          {/* Overlay to close dropdown */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />

          {/* Dropdown Content */}
          <div className="absolute top-full right-0 mt-2 bg-white border border-gray-100 rounded-2xl shadow-xl z-20 w-80 max-w-[calc(100vw-2rem)]">
            <div className="p-4">
              <h3 className="text-lg font-bold text-text mb-4">Select Your City</h3>

              {/* Location Detection Button */}
              <button
                onClick={detectLocation}
                disabled={isDetectingLocation}
                className="w-full flex items-center justify-center space-x-2 px-4 py-3 mb-4 bg-primary text-white rounded-xl font-semibold hover:bg-accent transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary/25"
              >
                {isDetectingLocation ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    <span>Detecting Location...</span>
                  </>
                ) : (
                  <>
                    <Navigation className="w-5 h-5" />
                    <span>Use My Location</span>
                  </>
                )}
              </button>

              {/* Search Bar */}
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search cities..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              {/* Cities List */}
              <div className="max-h-64 overflow-y-auto space-y-1">
                {filteredCities.length > 0 ? (
                  filteredCities.map((city) => {
                    const isSelected = city.name === state.selectedCity;

                    return (
                      <button
                        key={city.id}
                        onClick={() => handleCitySelect(city.name)}
                        className={`w-full text-left px-4 py-3 rounded-xl transition-all ${
                          isSelected
                            ? 'bg-primary text-white shadow-lg shadow-primary/25'
                            : 'hover:bg-gray-50 text-gray-700'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-semibold">{city.name}</span>
                          <span className={`text-sm ${isSelected ? 'text-white/80' : 'text-gray-500'}`}>
                            {city.state}
                          </span>
                        </div>
                      </button>
                    );
                  })
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <MapPin className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                    <p>No cities found matching "{searchQuery}"</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}