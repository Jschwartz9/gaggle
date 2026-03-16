'use client';

import { Map, List } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { motion } from 'framer-motion';

interface MapToggleButtonProps {
  className?: string;
}

const MapToggleButton = ({ className = '' }: MapToggleButtonProps) => {
  const { state, toggleMapView } = useApp();

  return (
    <motion.button
      onClick={toggleMapView}
      className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl border text-sm font-semibold transition-all duration-200 ${
        state.isMapView
          ? 'border-primary bg-primary text-white shadow-lg shadow-primary/25'
          : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50'
      } ${className}`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      initial={false}
    >
      <motion.div
        animate={{ rotate: state.isMapView ? 180 : 0 }}
        transition={{ duration: 0.2 }}
      >
        {state.isMapView ? (
          <List className="w-4 h-4" />
        ) : (
          <Map className="w-4 h-4" />
        )}
      </motion.div>
      <span>
        {state.isMapView ? 'List' : 'Map'}
      </span>
    </motion.button>
  );
};

export default MapToggleButton;