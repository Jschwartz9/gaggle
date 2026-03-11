'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import { EventFilters, FilterPrice, FilterDistance, FilterDate, AgeGroup } from '@/lib/types';

interface FilterSheetProps {
  isOpen: boolean;
  onClose: () => void;
  filters: EventFilters;
  onFiltersChange: (filters: EventFilters) => void;
}

export default function FilterSheet({
  isOpen,
  onClose,
  filters,
  onFiltersChange
}: FilterSheetProps) {
  const [localFilters, setLocalFilters] = useState<EventFilters>(filters);

  const priceOptions: FilterPrice[] = ['Free', 'Under $25', 'Under $50', 'Any'];
  const distanceOptions: FilterDistance[] = ['Under 1 mile', 'Under 5 miles', 'Under 10 miles', 'Any'];
  const ageOptions: (AgeGroup | 'Any')[] = ['21+', '25+', 'All ages', 'Any'];
  const dateOptions: FilterDate[] = ['Today', 'This Weekend', 'This Week', 'Any'];

  const handleApplyFilters = () => {
    onFiltersChange(localFilters);
    onClose();
  };

  const handleReset = () => {
    const resetFilters: EventFilters = {
      category: 'All',
      price: 'Any',
      distance: 'Any',
      ageGroup: 'Any',
      date: 'Any'
    };
    setLocalFilters(resetFilters);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      />

      {/* Bottom Sheet */}
      <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl z-50 max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-bold text-text">Filters</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-100"
          >
            <X className="w-5 h-5 text-muted" />
          </button>
        </div>

        {/* Filter Content */}
        <div className="p-4 overflow-y-auto max-h-[60vh]">
          {/* Price Filter */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-text mb-3">Price</h3>
            <div className="grid grid-cols-2 gap-2">
              {priceOptions.map((option) => (
                <button
                  key={option}
                  onClick={() => setLocalFilters({ ...localFilters, price: option })}
                  className={`p-3 rounded-lg border text-sm font-medium transition-colors ${
                    localFilters.price === option
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-gray-200 text-muted hover:border-gray-300'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          {/* Distance Filter */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-text mb-3">Distance</h3>
            <div className="grid grid-cols-2 gap-2">
              {distanceOptions.map((option) => (
                <button
                  key={option}
                  onClick={() => setLocalFilters({ ...localFilters, distance: option })}
                  className={`p-3 rounded-lg border text-sm font-medium transition-colors ${
                    localFilters.distance === option
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-gray-200 text-muted hover:border-gray-300'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          {/* Age Group Filter */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-text mb-3">Age Group</h3>
            <div className="grid grid-cols-2 gap-2">
              {ageOptions.map((option) => (
                <button
                  key={option}
                  onClick={() => setLocalFilters({ ...localFilters, ageGroup: option })}
                  className={`p-3 rounded-lg border text-sm font-medium transition-colors ${
                    localFilters.ageGroup === option
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-gray-200 text-muted hover:border-gray-300'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          {/* Date Filter */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-text mb-3">Date</h3>
            <div className="grid grid-cols-2 gap-2">
              {dateOptions.map((option) => (
                <button
                  key={option}
                  onClick={() => setLocalFilters({ ...localFilters, date: option })}
                  className={`p-3 rounded-lg border text-sm font-medium transition-colors ${
                    localFilters.date === option
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-gray-200 text-muted hover:border-gray-300'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 bg-white">
          <div className="flex gap-3">
            <button
              onClick={handleReset}
              className="flex-1 py-3 px-4 border border-gray-300 rounded-lg text-muted font-medium hover:bg-gray-50 transition-colors"
            >
              Reset
            </button>
            <button
              onClick={handleApplyFilters}
              className="flex-1 py-3 px-4 bg-primary text-deep rounded-lg font-medium hover:bg-primary/90 transition-colors"
            >
              Apply Filters
            </button>
          </div>
        </div>
      </div>
    </>
  );
}