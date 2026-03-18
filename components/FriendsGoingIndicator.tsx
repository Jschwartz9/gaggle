'use client';

import { useState } from 'react';
import Image from 'next/image';
import { User } from '@/lib/types';
import { motion } from 'framer-motion';
import { Users } from 'lucide-react';
import FriendsModal from './FriendsModal';

interface FriendsGoingIndicatorProps {
  friends: User[];
  eventId: string;
  eventTitle: string;
}

export default function FriendsGoingIndicator({ friends, eventId, eventTitle }: FriendsGoingIndicatorProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (friends.length === 0) return null;

  const displayFriends = friends.slice(0, 3);
  const remainingCount = friends.length - displayFriends.length;

  const getFriendsText = () => {
    if (friends.length === 1) {
      return `${friends[0].name} is going`;
    } else if (friends.length === 2) {
      return `${friends[0].name} and ${friends[1].name} are going`;
    } else if (friends.length === 3) {
      return `${friends[0].name}, ${friends[1].name} and 1 other are going`;
    } else {
      return `${friends[0].name}, ${friends[1].name} and ${remainingCount} others are going`;
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsModalOpen(true);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        onClick={handleClick}
        className="flex items-center space-x-3 p-3 mb-3 bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl border border-orange-200 cursor-pointer hover:shadow-md hover:border-orange-300 transition-all duration-200"
      >
        {/* Friend Avatars Stack */}
        <div className="flex -space-x-2">
          {displayFriends.map((friend, index) => (
            <motion.div
              key={friend.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="relative w-8 h-8 rounded-full border-2 border-white overflow-hidden shadow-sm ring-2 ring-orange-200"
            >
              <Image
                src={friend.avatar}
                alt={friend.name}
                fill
                sizes="32px"
                className="object-cover"
              />
            </motion.div>
          ))}
          {remainingCount > 0 && (
            <div className="relative w-8 h-8 rounded-full border-2 border-white bg-orange-500 flex items-center justify-center shadow-sm ring-2 ring-orange-200">
              <span className="text-white text-xs font-bold">+{remainingCount}</span>
            </div>
          )}
        </div>

        {/* Friends Text */}
        <div className="flex items-center space-x-2 flex-1">
          <Users className="w-4 h-4 text-orange-600" />
          <span className="text-sm font-medium text-orange-800">
            {getFriendsText()}
          </span>
        </div>

        {/* Subtle arrow or indicator */}
        <div className="text-orange-400">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </motion.div>

      <FriendsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        friends={friends}
        eventTitle={eventTitle}
        eventId={eventId}
      />
    </>
  );
}