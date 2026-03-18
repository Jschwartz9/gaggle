'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Event, EventStory } from '@/lib/types';
import { getEventsWithActiveStories, getEventStoriesGrouped, getUserById } from '@/lib/mockData';

interface EventStoriesProps {
  className?: string;
}

export default function EventStories({ className = '' }: EventStoriesProps) {
  const eventsWithStories = getEventsWithActiveStories();
  const storiesGrouped = getEventStoriesGrouped();
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);

  if (eventsWithStories.length === 0) return null;

  const handleEventClick = (event: Event) => {
    setSelectedEvent(event);
    setCurrentStoryIndex(0);
  };

  const closeStoryViewer = () => {
    setSelectedEvent(null);
    setCurrentStoryIndex(0);
  };

  const nextStory = () => {
    if (!selectedEvent) return;
    const stories = storiesGrouped[selectedEvent.id] || [];
    if (currentStoryIndex < stories.length - 1) {
      setCurrentStoryIndex(currentStoryIndex + 1);
    } else {
      closeStoryViewer();
    }
  };

  const previousStory = () => {
    if (currentStoryIndex > 0) {
      setCurrentStoryIndex(currentStoryIndex - 1);
    }
  };

  const currentStories = selectedEvent ? storiesGrouped[selectedEvent.id] || [] : [];
  const currentStory = currentStories[currentStoryIndex];

  return (
    <>
      {/* Stories Row */}
      <div className={`${className}`}>
        <div className="flex items-center space-x-4 overflow-x-auto scrollbar-hide pb-4">
          {eventsWithStories.map((event) => {
            const stories = storiesGrouped[event.id] || [];
            const hasUnviewed = stories.some(story => !story.views.includes('current'));

            return (
              <motion.button
                key={event.id}
                onClick={() => handleEventClick(event)}
                className="flex-shrink-0 flex flex-col items-center space-y-2 group"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {/* Story Circle */}
                <div className="relative">
                  {/* Gradient Ring for Unviewed Stories */}
                  <div className={`w-20 h-20 rounded-full p-1 ${
                    hasUnviewed
                      ? 'bg-gradient-to-tr from-yellow-400 via-red-500 to-pink-500'
                      : 'bg-gray-200'
                  }`}>
                    <div className="w-full h-full bg-white rounded-full p-1">
                      <div className="w-full h-full rounded-full overflow-hidden">
                        <Image
                          src={event.imageUrl}
                          alt={event.title}
                          width={64}
                          height={64}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Story Count Badge */}
                  <div className="absolute -bottom-1 -right-1 bg-primary text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center border-2 border-white">
                    {stories.length}
                  </div>
                </div>

                {/* Event Title */}
                <span className="text-xs font-medium text-gray-700 max-w-16 truncate group-hover:text-primary transition-colors">
                  {event.title}
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Story Viewer Modal */}
      <AnimatePresence>
        {selectedEvent && currentStory && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black flex items-center justify-center"
            onClick={closeStoryViewer}
          >
            <div className="relative max-w-md w-full h-full max-h-screen bg-black">
              {/* Story Progress Bars */}
              <div className="absolute top-4 left-4 right-4 z-20 flex space-x-1">
                {currentStories.map((_, index) => (
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
                onClick={closeStoryViewer}
                className="absolute top-4 right-4 z-20 p-2 text-white hover:bg-white/20 rounded-full transition-colors"
              >
                <X className="w-6 h-6" />
              </button>

              {/* Story Content */}
              <div
                className="relative w-full h-full flex items-center justify-center"
                onClick={(e) => e.stopPropagation()}
              >
                <Image
                  src={currentStory.mediaUrl}
                  alt={currentStory.caption || 'Story'}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />

                {/* Story Info */}
                <div className="absolute top-16 left-4 right-4 z-10">
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
                        {new Date(currentStory.timestamp).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
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