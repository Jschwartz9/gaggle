'use client';

import { useState } from 'react';
import { MapPin, Loader2, AlertCircle } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { getCurrentLocation } from '@/lib/utils';
import { motion } from 'framer-motion';

export default function NearMeButton() {
  const { state, setUserLocation, toggleNearMe } = useApp();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleToggleNearMe = async () => {
    if (state.nearMeEnabled) {
      // Turn off near me mode
      toggleNearMe(false);
      setError(null);
      return;
    }

    // Turn on near me mode
    if (state.userLocation) {
      // We already have location, just toggle on
      toggleNearMe(true);
      return;
    }

    // Need to request location
    setIsLoading(true);
    setError(null);

    try {
      const location = await getCurrentLocation();

      if (location) {
        setUserLocation(location);
        toggleNearMe(true);
        setError(null);
      } else {
        setError('Location access denied or unavailable');
        toggleNearMe(false);
      }
    } catch (err) {
      setError('Failed to get your location');
      toggleNearMe(false);
    } finally {
      setIsLoading(false);
    }
  };

  const getButtonText = () => {
    if (isLoading) return 'Getting Location...';
    if (state.nearMeEnabled) return 'Near Me';
    return 'Near Me';
  };

  const getButtonIcon = () => {
    if (isLoading) return <Loader2 className="w-4 h-4 animate-spin" />;
    if (error) return <AlertCircle className="w-4 h-4" />;
    return <MapPin className="w-4 h-4" />;
  };

  return (
    <div className="relative">
      <motion.button
        onClick={handleToggleNearMe}
        whileTap={{ scale: 0.95 }}
        disabled={isLoading}
        className={`
          flex items-center space-x-2 px-6 py-3 rounded-2xl font-semibold text-sm transition-all duration-200 shadow-sm
          ${
            state.nearMeEnabled
              ? 'bg-primary text-white shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30'
              : error
              ? 'bg-red-50 text-red-600 border border-red-200 hover:bg-red-100'
              : 'bg-white text-gray-700 border border-gray-200 hover:border-gray-300 hover:bg-gray-50'
          }
          ${isLoading ? 'opacity-75 cursor-not-allowed' : 'hover:-translate-y-0.5'}
        `}
      >
        {getButtonIcon()}
        <span>{getButtonText()}</span>
        {state.nearMeEnabled && !isLoading && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-2 h-2 bg-white rounded-full"
          />
        )}
      </motion.button>

      {/* Error tooltip */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="absolute top-full left-0 mt-2 px-3 py-2 bg-red-600 text-white text-xs rounded-lg shadow-lg whitespace-nowrap z-10"
        >
          {error}
          <div className="absolute -top-1 left-4 w-2 h-2 bg-red-600 transform rotate-45" />
        </motion.div>
      )}
    </div>
  );
}