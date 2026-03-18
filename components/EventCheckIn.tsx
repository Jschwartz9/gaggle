'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin,
  Camera,
  Check,
  X,
  Users,
  Clock,
  Verified,
  UserCheck
} from 'lucide-react';
import { EventCheckIn } from '@/lib/types';
import {
  getEventCheckIns,
  hasUserCheckedInToEvent,
  getCheckInCount,
  getFriendsCheckedInToEvent,
  getUserById
} from '@/lib/mockData';

interface EventCheckInProps {
  eventId: string;
  className?: string;
}

export default function EventCheckInComponent({ eventId, className = '' }: EventCheckInProps) {
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [showCheckInModal, setShowCheckInModal] = useState(false);
  const [checkInCaption, setCheckInCaption] = useState('');
  const [isCheckingIn, setIsCheckingIn] = useState(false);

  const checkIns = getEventCheckIns(eventId);
  const checkInCount = getCheckInCount(eventId);
  const friendsCheckedIn = getFriendsCheckedInToEvent(eventId, 'current');

  useEffect(() => {
    setIsCheckedIn(hasUserCheckedInToEvent(eventId, 'current'));
  }, [eventId]);

  const handleCheckIn = async () => {
    setIsCheckingIn(true);

    // Simulate location verification and API call
    setTimeout(() => {
      setIsCheckedIn(true);
      setShowCheckInModal(false);
      setCheckInCaption('');
      setIsCheckingIn(false);

      // In a real app, this would create a new check-in record
      console.log(`Checked in to event ${eventId} with caption: ${checkInCaption}`);
    }, 2000);
  };

  const openCheckInModal = () => {
    setShowCheckInModal(true);
  };

  const closeCheckInModal = () => {
    setShowCheckInModal(false);
    setCheckInCaption('');
    setIsCheckingIn(false);
  };

  return (
    <>
      {/* Check-in Section */}
      <div className={`${className}`}>
        <div className="mb-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <h3 className="font-semibold text-text">Check-ins</h3>
              {checkInCount > 0 && (
                <div className="flex items-center space-x-1 text-sm text-gray-600">
                  <Users className="w-4 h-4" />
                  <span>{checkInCount}</span>
                </div>
              )}
            </div>

            {/* Check-in Button */}
            {!isCheckedIn ? (
              <button
                onClick={openCheckInModal}
                className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-primary/90 transition-colors"
              >
                <MapPin className="w-4 h-4" />
                <span>Check In</span>
              </button>
            ) : (
              <div className="flex items-center space-x-2 px-4 py-2 bg-green-100 text-green-800 rounded-xl text-sm font-semibold">
                <Check className="w-4 h-4" />
                <span>Checked In</span>
              </div>
            )}
          </div>

          {/* Friends Checked In */}
          {friendsCheckedIn.length > 0 && (
            <div className="mb-4 p-3 bg-gradient-to-r from-green-50 to-blue-50 border border-green-100 rounded-xl">
              <div className="flex items-center space-x-2 mb-2">
                <UserCheck className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-green-800">
                  {friendsCheckedIn.length} {friendsCheckedIn.length === 1 ? 'friend' : 'friends'} checked in
                </span>
              </div>
              <div className="flex items-center space-x-2">
                {friendsCheckedIn.slice(0, 3).map((checkIn) => {
                  const user = getUserById(checkIn.userId);
                  return (
                    <div key={checkIn.id} className="flex items-center space-x-1">
                      <div className="w-6 h-6 rounded-full overflow-hidden">
                        <Image
                          src={user?.avatar || 'https://picsum.photos/seed/default/150/150'}
                          alt={user?.name || 'User'}
                          width={24}
                          height={24}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span className="text-xs text-green-700">{user?.name}</span>
                    </div>
                  );
                })}
                {friendsCheckedIn.length > 3 && (
                  <span className="text-xs text-green-600">
                    +{friendsCheckedIn.length - 3} more
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Recent Check-ins */}
          {checkIns.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-gray-600">Recent Check-ins</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {checkIns.slice(0, 4).map((checkIn) => {
                  const user = getUserById(checkIn.userId);
                  const isCurrentUser = checkIn.userId === 'current';

                  return (
                    <motion.div
                      key={checkIn.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`p-3 rounded-xl border ${
                        isCurrentUser
                          ? 'bg-primary/5 border-primary/20'
                          : 'bg-white border-gray-100'
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <div className="relative">
                          <div className="w-10 h-10 rounded-full overflow-hidden">
                            <Image
                              src={user?.avatar || 'https://picsum.photos/seed/default/150/150'}
                              alt={user?.name || 'User'}
                              width={40}
                              height={40}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          {checkIn.verified && (
                            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                              <Verified className="w-2 h-2 text-white" />
                            </div>
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-1">
                            <h5 className="font-medium text-text text-sm">
                              {isCurrentUser ? 'You' : user?.name || 'User'}
                            </h5>
                            <div className="flex items-center space-x-1 text-xs text-gray-500">
                              <Clock className="w-3 h-3" />
                              <span>
                                {new Date(checkIn.timestamp).toLocaleTimeString([], {
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </span>
                            </div>
                          </div>

                          {checkIn.caption && (
                            <p className="text-sm text-gray-600 mb-2">{checkIn.caption}</p>
                          )}

                          {checkIn.photo && (
                            <div className="relative w-full h-24 rounded-lg overflow-hidden bg-gray-100">
                              <Image
                                src={checkIn.photo}
                                alt="Check-in photo"
                                fill
                                className="object-cover"
                                sizes="(max-width: 768px) 100vw, 50vw"
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Empty State */}
          {checkIns.length === 0 && (
            <div className="text-center py-8 bg-gray-50 rounded-xl">
              <MapPin className="w-8 h-8 text-gray-400 mx-auto mb-3" />
              <h4 className="font-medium text-gray-700 mb-1">No check-ins yet</h4>
              <p className="text-sm text-gray-500">Be the first to check in at this event!</p>
            </div>
          )}
        </div>
      </div>

      {/* Check-in Modal */}
      <AnimatePresence>
        {showCheckInModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
            onClick={closeCheckInModal}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl p-6 w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-text mb-2">Check in to this event</h3>
                <p className="text-gray-600 text-sm">
                  Let your friends know you're here and share the experience!
                </p>
              </div>

              <div className="space-y-4">
                {/* Caption Input */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Add a caption (optional)
                  </label>
                  <textarea
                    value={checkInCaption}
                    onChange={(e) => setCheckInCaption(e.target.value)}
                    placeholder="How are you feeling about this event?"
                    className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                    rows={3}
                    maxLength={200}
                  />
                  <div className="text-xs text-gray-500 mt-1 text-right">
                    {checkInCaption.length}/200
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex space-x-3 pt-4">
                  <button
                    onClick={closeCheckInModal}
                    disabled={isCheckingIn}
                    className="flex-1 py-3 px-4 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCheckIn}
                    disabled={isCheckingIn}
                    className="flex-1 py-3 px-4 bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
                  >
                    {isCheckingIn ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Checking in...</span>
                      </>
                    ) : (
                      <>
                        <MapPin className="w-4 h-4" />
                        <span>Check In</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Location Notice */}
                <p className="text-xs text-gray-500 text-center">
                  We'll verify your location to confirm you're at the event
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}