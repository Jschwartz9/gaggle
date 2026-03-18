'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { UserPlus, X, MessageCircle, MapPin, Heart } from 'lucide-react';
import { User } from '@/lib/types';
import { getPeopleYouMayKnow } from '@/lib/mockData';

interface PeopleYouMayKnowProps {
  className?: string;
}

export default function PeopleYouMayKnow({ className = '' }: PeopleYouMayKnowProps) {
  const [dismissedSuggestions, setDismissedSuggestions] = useState<Set<string>>(new Set());
  const [followingUsers, setFollowingUsers] = useState<Set<string>>(new Set());

  const suggestions = useMemo(() => {
    const allSuggestions = getPeopleYouMayKnow('current');
    return allSuggestions.filter(user => !dismissedSuggestions.has(user.id));
  }, [dismissedSuggestions]);

  const handleDismiss = (userId: string) => {
    setDismissedSuggestions(prev => new Set([...prev, userId]));
  };

  const handleFollow = (userId: string) => {
    setFollowingUsers(prev => new Set([...prev, userId]));
    // Auto-accept and dismiss the suggestion
    setTimeout(() => {
      setDismissedSuggestions(prev => new Set([...prev, userId]));
    }, 1500);
    // In a real app, this would make an API call
    console.log(`Auto-followed user: ${userId}`);
  };

  if (suggestions.length === 0) return null;

  return (
    <div className={`${className}`}>
      <div className="mb-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-text">People you may know</h3>
          <span className="text-sm text-gray-500">{suggestions.length} suggestions</span>
        </div>

        {/* Suggestion Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {suggestions.slice(0, 6).map((user, index) => {
            const isFollowing = followingUsers.has(user.id);

            return (
              <motion.div
                key={user.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl border border-gray-100 p-4 hover:shadow-lg hover:border-gray-200 transition-all duration-300"
              >
                {/* Dismiss Button */}
                <div className="flex justify-end mb-2">
                  <button
                    onClick={() => handleDismiss(user.id)}
                    className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* User Info */}
                <div className="text-center mb-4">
                  <div className="relative w-16 h-16 mx-auto mb-3">
                    <Image
                      src={user.avatar}
                      alt={user.name}
                      width={64}
                      height={64}
                      className="w-full h-full rounded-full object-cover border-2 border-gray-100"
                    />

                    {/* Activity indicator */}
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 border-2 border-white rounded-full flex items-center justify-center">
                      <Heart className="w-2.5 h-2.5 text-white fill-current" />
                    </div>
                  </div>

                  <h4 className="font-semibold text-text mb-1">{user.name}</h4>
                  <p className="text-sm text-gray-600 mb-2">{user.age} years old</p>

                  <div className="flex items-center justify-center space-x-1 text-xs text-gray-500 mb-3">
                    <MapPin className="w-3 h-3" />
                    <span>{user.city}</span>
                  </div>
                </div>

                {/* Connection Reasons */}
                <div className="mb-4">
                  <div className="space-y-1">
                    {(user as any).suggestionReasons?.slice(0, 2).map((reason: string, idx: number) => (
                      <div
                        key={idx}
                        className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full text-center font-medium"
                      >
                        {reason}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Shared Interests */}
                <div className="mb-4">
                  <div className="flex flex-wrap gap-1 justify-center">
                    {user.interests.slice(0, 2).map((interest) => (
                      <span
                        key={interest}
                        className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full"
                      >
                        {interest}
                      </span>
                    ))}
                    {user.interests.length > 2 && (
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                        +{user.interests.length - 2}
                      </span>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleFollow(user.id)}
                    disabled={isFollowing}
                    className={`flex-1 flex items-center justify-center space-x-1 py-2 px-3 rounded-xl text-sm font-semibold transition-all ${
                      isFollowing
                        ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                        : 'bg-primary text-white hover:bg-primary/90'
                    }`}
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>{isFollowing ? 'Added!' : 'Add Friend'}</span>
                  </button>

                  <button className="p-2 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 transition-colors">
                    <MessageCircle className="w-4 h-4" />
                  </button>
                </div>

                {/* User Stats */}
                <div className="flex justify-center space-x-4 mt-3 pt-3 border-t border-gray-100 text-xs text-gray-500">
                  <div className="text-center">
                    <div className="font-semibold text-text">{user.eventsAttending.length}</div>
                    <div>Events</div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold text-text">{user.followers.length}</div>
                    <div>Friends</div>
                  </div>
                  {user.eventsHosted.length > 0 && (
                    <div className="text-center">
                      <div className="font-semibold text-text">{user.eventsHosted.length}</div>
                      <div>Hosted</div>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Show More Button */}
        {suggestions.length > 6 && (
          <div className="text-center mt-6">
            <button className="px-6 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-medium">
              Show {suggestions.length - 6} more suggestions
            </button>
          </div>
        )}
      </div>
    </div>
  );
}