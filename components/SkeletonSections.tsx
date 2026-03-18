'use client';

import { AnimatedSkeletonCard } from './SkeletonCard';


// Main Events Grid Skeleton (9 cards in responsive grid)
export function MainEventsGridSkeleton({ selectedCity }: { selectedCity: string }) {
  return (
    <section className="px-6 py-8 pb-24 md:pb-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-32 h-8 bg-gray-200 rounded skeleton-shimmer" />
              <div className="w-24 h-8 bg-gray-200 rounded skeleton-shimmer" />
            </div>
            <div className="w-40 h-5 bg-gray-200 rounded skeleton-shimmer" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(9)].map((_, index) => (
            <AnimatedSkeletonCard
              key={`main-grid-skeleton-${index}`}
              index={index}
              staggerDelay={100}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

// Filter Bar Skeleton
export function FilterBarSkeleton() {
  return (
    <div className="sticky top-[85px] z-20 bg-white/90 backdrop-blur-sm border-b border-gray-100 px-6 py-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center space-x-4 overflow-x-auto scrollbar-hide">
          {/* Category Tabs Skeleton */}
          <div className="flex space-x-3 flex-shrink-0">
            {[...Array(4)].map((_, index) => (
              <div
                key={`category-skeleton-${index}`}
                className="w-16 h-10 bg-gray-200 rounded-xl skeleton-shimmer"
              />
            ))}
          </div>

          {/* Filter Button Skeleton */}
          <div className="w-20 h-10 bg-gray-200 rounded-xl skeleton-shimmer" />
        </div>

        {/* Additional Category Pills Skeleton */}
        <div className="flex space-x-3 mt-4 overflow-x-auto scrollbar-hide">
          {[...Array(6)].map((_, index) => (
            <div
              key={`pill-skeleton-${index}`}
              className="w-20 h-8 bg-gray-200 rounded-full skeleton-shimmer"
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// Combined loading skeleton for the entire homepage
export function HomePageSkeleton({ selectedCity }: { selectedCity: string }) {
  return (
    <>
      <FilterBarSkeleton />
      <MainEventsGridSkeleton selectedCity={selectedCity} />
    </>
  );
}