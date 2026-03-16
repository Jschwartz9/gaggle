'use client';

import { MotionConfig } from 'framer-motion';
import { ReactNode } from 'react';

interface MotionProviderProps {
  children: ReactNode;
}

export function MotionProvider({ children }: MotionProviderProps) {
  return (
    <MotionConfig
      // Respect user's motion preferences
      reducedMotion="user"
      // Global transition configuration
      transition={{
        type: "tween",
        ease: "easeOut",
        duration: 0.4
      }}
    >
      {children}
    </MotionConfig>
  );
}