'use client';

import { motion } from 'framer-motion';

interface SkeletonCardProps {
  variant?: 'default' | 'horizontal';
  showAttendees?: boolean;
}

export default function SkeletonCard({
  variant = 'default',
  showAttendees = true
}: SkeletonCardProps) {
  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-gray-100">
      {/* Hero Image Skeleton */}
      <div className="relative w-full h-52">
        <div className="w-full h-full bg-gray-200 skeleton-shimmer" />

        {/* Category Tag Skeleton */}
        <div className="absolute top-4 left-4">
          <div className="w-20 h-6 bg-gray-300 rounded-xl skeleton-shimmer" />
        </div>

        {/* Bookmark Button Skeleton */}
        <div className="absolute top-4 right-4">
          <div className="w-8 h-8 bg-gray-300 rounded-xl skeleton-shimmer" />
        </div>

        {/* Price Badge Skeleton */}
        <div className="absolute bottom-4 right-4">
          <div className="w-12 h-7 bg-gray-300 rounded-xl skeleton-shimmer" />
        </div>
      </div>

      {/* Card Content Skeleton */}
      <div className="p-5">
        {/* Event Title Skeleton */}
        <div className="mb-3">
          <div className="w-full h-6 bg-gray-200 rounded skeleton-shimmer mb-2" />
          <div className="w-3/4 h-6 bg-gray-200 rounded skeleton-shimmer" />
        </div>

        {/* Date & Time Skeleton */}
        <div className="flex items-center mb-2">
          <div className="w-4 h-4 bg-gray-300 rounded skeleton-shimmer mr-2" />
          <div className="w-32 h-4 bg-gray-200 rounded skeleton-shimmer" />
        </div>

        {/* Location Skeleton */}
        <div className="flex items-center mb-4">
          <div className="w-4 h-4 bg-gray-300 rounded skeleton-shimmer mr-2" />
          <div className="w-24 h-4 bg-gray-200 rounded skeleton-shimmer" />
        </div>

        {showAttendees && (
          /* Attendees and RSVP Skeleton */
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              {/* Avatar Stack Skeleton */}
              <div className="flex -space-x-3">
                {[...Array(3)].map((_, index) => (
                  <div
                    key={index}
                    className="relative w-8 h-8 rounded-full bg-gray-300 border-2 border-white skeleton-shimmer"
                  />
                ))}
              </div>
              {/* Count Skeleton */}
              <div className="ml-3 w-16 h-4 bg-gray-200 rounded skeleton-shimmer" />
            </div>

            {/* RSVP Button Skeleton */}
            <div className="w-20 h-8 bg-gray-200 rounded-xl skeleton-shimmer" />
          </div>
        )}
      </div>
    </div>
  );
}

// Animated Skeleton Card for sections with stagger animations
interface AnimatedSkeletonCardProps extends SkeletonCardProps {
  index?: number;
  staggerDelay?: number;
}

export function AnimatedSkeletonCard({
  variant = 'default',
  showAttendees = true,
  index = 0,
  staggerDelay = 100
}: AnimatedSkeletonCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.4,
        ease: "easeOut",
        delay: index * (staggerDelay / 1000),
      }}
    >
      <SkeletonCard variant={variant} showAttendees={showAttendees} />
    </motion.div>
  );
}