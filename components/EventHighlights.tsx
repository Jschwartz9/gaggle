'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Play } from 'lucide-react';
import { EventHighlight, EventStory } from '@/lib/types';
import { getEventHighlights, getUserById } from '@/lib/mockData';

interface EventHighlightsProps {
  eventId: string;
  className?: string;
}

export default function EventHighlights({ eventId, className = '' }: EventHighlightsProps) {
  const highlights = getEventHighlights(eventId);
  const [selectedHighlight, setSelectedHighlight] = useState<EventHighlight | null>(null);
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);

  if (highlights.length === 0) return null;

  const handleHighlightClick = (highlight: EventHighlight) => {
    setSelectedHighlight(highlight);
    setCurrentStoryIndex(0);
  };

  const closeHighlightViewer = () => {
    setSelectedHighlight(null);
    setCurrentStoryIndex(0);
  };

  const nextStory = () => {
    if (!selectedHighlight) return;
    const stories = selectedHighlight.stories;
    if (currentStoryIndex < stories.length - 1) {
      setCurrentStoryIndex(currentStoryIndex + 1);
    } else {
      closeHighlightViewer();
    }
  };

  const previousStory = () => {
    if (currentStoryIndex > 0) {
      setCurrentStoryIndex(currentStoryIndex - 1);
    }
  };

  const currentStory = selectedHighlight?.stories[currentStoryIndex];

  return (
    <>
      {/* Highlights Row */}
      <div className={`${className}`}>
        <div className="mb-4">
          <h3 className="font-semibold text-text mb-3">Event Highlights</h3>
          <div className="flex items-center space-x-4 overflow-x-auto scrollbar-hide">
            {highlights.map((highlight) => (
              <motion.button
                key={highlight.id}
                onClick={() => handleHighlightClick(highlight)}
                className="flex-shrink-0 flex flex-col items-center space-y-2 group"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {/* Highlight Circle */}
                <div className="relative">
                  <div className="w-16 h-16 rounded-full p-1 bg-gray-200">
                    <div className="w-full h-full bg-white rounded-full p-1">
                      <div className="w-full h-full rounded-full overflow-hidden relative">
                        <Image
                          src={highlight.coverImage}
                          alt={highlight.title}
                          width={56}
                          height={56}
                          className="w-full h-full object-cover"
                        />
                        {/* Play Icon Overlay */}
                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <Play className="w-4 h-4 text-white fill-white" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Story Count Badge */}
                  <div className="absolute -bottom-1 -right-1 bg-primary text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center border-2 border-white">
                    {highlight.stories.length}
                  </div>
                </div>

                {/* Highlight Title */}
                <span className="text-xs font-medium text-gray-700 max-w-16 truncate group-hover:text-primary transition-colors">
                  {highlight.title}
                </span>
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      {/* Highlight Viewer Modal */}
      <AnimatePresence>
        {selectedHighlight && currentStory && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black flex items-center justify-center"
            onClick={closeHighlightViewer}
          >
            <div className="relative max-w-md w-full h-full max-h-screen bg-black">
              {/* Story Progress Bars */}
              <div className="absolute top-4 left-4 right-4 z-20 flex space-x-1">
                {selectedHighlight.stories.map((_, index) => (
                  <div
                    key={index}
                    className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden"
                  >
                    <div
                      className={`h-full bg-white rounded-full transition-all duration-300 ${
                        index < currentStoryIndex ? 'w-full' :
                        index === currentStoryIndex ? 'w-full' : 'w-0'
                      }`}
                    />
                  </div>
                ))}
              </div>

              {/* Close Button */}
              <button
                onClick={closeHighlightViewer}
                className="absolute top-4 right-4 z-20 p-2 text-white hover:bg-white/20 rounded-full transition-colors"
              >
                <X className="w-6 h-6" />
              </button>

              {/* Highlight Title */}
              <div className="absolute top-16 left-4 right-4 z-20">
                <h3 className="text-white font-semibold text-lg">{selectedHighlight.title}</h3>
                <p className="text-white/70 text-sm">
                  {new Date(selectedHighlight.createdAt).toLocaleDateString()}
                </p>
              </div>

              {/* Story Content */}
              <div
                className="relative w-full h-full flex items-center justify-center"
                onClick={(e) => e.stopPropagation()}
              >
                <Image
                  src={currentStory.mediaUrl}
                  alt={currentStory.caption || 'Highlight'}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />

                {/* Story Info */}
                <div className="absolute top-28 left-4 right-4 z-10">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full overflow-hidden border border-white/50">
                      <Image
                        src={getUserById(currentStory.userId)?.avatar || 'https://picsum.photos/seed/default/150/150'}
                        alt="User"
                        width={32}
                        height={32}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="text-white text-sm font-semibold">
                        {getUserById(currentStory.userId)?.name || 'User'}
                      </p>
                      <p className="text-white/70 text-xs">
                        {new Date(currentStory.timestamp).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Story Caption */}
                {currentStory.caption && (
                  <div className="absolute bottom-8 left-4 right-4 z-10">
                    <div className="bg-black/50 backdrop-blur-sm rounded-2xl p-4">
                      <p className="text-white text-sm">{currentStory.caption}</p>
                    </div>
                  </div>
                )}

                {/* Navigation Areas */}
                <div className="absolute inset-0 flex">
                  {/* Previous Story Area */}
                  <div
                    className="flex-1 flex items-center justify-start pl-4 cursor-pointer"
                    onClick={previousStory}
                  >
                    {currentStoryIndex > 0 && (
                      <ChevronLeft className="w-8 h-8 text-white/50" />
                    )}
                  </div>

                  {/* Next Story Area */}
                  <div
                    className="flex-1 flex items-center justify-end pr-4 cursor-pointer"
                    onClick={nextStory}
                  >
                    <ChevronRight className="w-8 h-8 text-white/50" />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}