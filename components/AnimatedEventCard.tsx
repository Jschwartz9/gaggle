'use client';

import { motion } from 'framer-motion';
import { Event } from '@/lib/types';
import EventCard from './EventCard';
import { eventCardVariants, motionConfig } from '@/lib/motionConfig';

interface AnimatedEventCardProps {
  event: Event;
  index?: number;
  staggerDelay?: number;
  reducedStagger?: boolean;
}

export default function AnimatedEventCard({
  event,
  index = 0,
  staggerDelay = 100,
  reducedStagger = false
}: AnimatedEventCardProps) {
  // Calculate delay with optional reduction for performance
  const actualDelay = reducedStagger
    ? Math.min(index * (staggerDelay / 1000), 0.6) // Cap at 600ms
    : index * (staggerDelay / 1000);

  return (
    <motion.div
      variants={eventCardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={motionConfig.viewport}
      transition={{
        ...motionConfig.transition,
        delay: actualDelay,
      }}
      // Performance optimizations
      style={{
        willChange: 'opacity, transform',
      }}
      // Reduce motion complexity on slower devices
      {...(typeof window !== 'undefined' &&
          window.matchMedia('(prefers-reduced-motion: reduce)').matches && {
        initial: "visible",
        animate: "visible",
        transition: { duration: 0 }
      })}
    >
      <EventCard event={event} />
    </motion.div>
  );
}