'use client';

import { useState } from 'react';
import { ChevronDown, MapPin } from 'lucide-react';
import { mockCities } from '@/lib/mockData';

interface CitySelectorProps {
  selectedCity?: string;
  onCitySelect?: (cityName: string) => void;
  className?: string;
}

export default function CitySelector({
  selectedCity = 'New York',
  onCitySelect,
  className = ''
}: CitySelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleCitySelect = (cityName: string) => {
    onCitySelect?.(cityName);
    setIsOpen(false);
  };

  const selectedCityData = mockCities.find(city => city.name === selectedCity);

  return (
    <div className={`relative ${className}`}>
      {/* City Selector Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
      >
        <MapPin className="w-4 h-4 text-muted" />
        <span className="font-medium text-text">{selectedCityData?.name || selectedCity}</span>
        <ChevronDown className={`w-4 h-4 text-muted transition-transform ${isOpen ? 'rotate-180' : ''}`} />
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
          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-20 max-h-64 overflow-y-auto">
            <div className="p-2">
              <h3 className="text-sm font-semibold text-text px-2 py-1 mb-1">Select City</h3>
              {mockCities.map((city) => {
                const isSelected = city.name === selectedCity;

                return (
                  <button
                    key={city.id}
                    onClick={() => handleCitySelect(city.name)}
                    className={`w-full text-left px-3 py-2 rounded-md hover:bg-gray-50 transition-colors ${
                      isSelected ? 'bg-primary/10 text-primary font-medium' : 'text-text'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span>{city.name}</span>
                      <span className="text-xs text-muted">{city.state}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}