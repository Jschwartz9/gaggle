import { MotionConfig } from 'framer-motion';

// Framer Motion configuration for optimal performance
export const motionConfig = {
  // Respect user's reduced motion preference
  reducedMotion: "user",

  // Global transition defaults
  transition: {
    type: "tween",
    ease: "easeOut",
    duration: 0.4
  },

  // Viewport settings for scroll animations
  viewport: {
    once: true,
    threshold: 0.1,
    margin: "-50px 0px -50px 0px"
  }
} as const;

// Animation variants for event cards
export const eventCardVariants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
  },
} as const;

// Stagger configuration
export const staggerConfig = {
  // Standard stagger delay between cards (in milliseconds)
  cardDelay: 100,

  // Reduced stagger for horizontal scrolling sections
  horizontalDelay: 80,

  // Quick stagger for grid layouts
  gridDelay: 50,
} as const;