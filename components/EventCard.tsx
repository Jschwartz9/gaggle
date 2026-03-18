import Link from 'next/link';
import Image from 'next/image';
import { Event } from '@/lib/types';
import { getUserById } from '@/lib/mockData';
import { Calendar, MapPin, Star, DollarSign, Heart, Check, Navigation } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { motion } from 'framer-motion';
import { formatDistance } from '@/lib/utils';
import FriendsGoingIndicator from './FriendsGoingIndicator';

interface EventCardProps {
  event: Event;
}

const categoryColors: Record<string, string> = {
  'Food & Drink': 'bg-orange-100 text-orange-800',
  'Nightlife': 'bg-purple-100 text-purple-800',
  'Date Night': 'bg-rose-100 text-rose-800',
  'Late Night': 'bg-violet-100 text-violet-800',
  'Brunch & Chill': 'bg-amber-100 text-amber-800',
  'Fitness': 'bg-green-100 text-green-800',
  'Outdoors': 'bg-blue-100 text-blue-800',
  'Arts & Culture': 'bg-pink-100 text-pink-800',
  'Music': 'bg-red-100 text-red-800',
  'Skills & Hobbies': 'bg-emerald-100 text-emerald-800',
  'Gaming & Tech': 'bg-cyan-100 text-cyan-800',
  'Networking': 'bg-gray-100 text-gray-800',
  'Wellness': 'bg-teal-100 text-teal-800',
  'Sports': 'bg-indigo-100 text-indigo-800',
  'Pop-ups & Markets': 'bg-yellow-100 text-yellow-800',
};

export default function EventCard({ event }: EventCardProps) {
  const { toggleRSVP, toggleSavedEvent, isUserRSVP, isEventSaved, getRSVPCount, getFriendsGoingToEvent, state } = useApp();

  const isRSVP = isUserRSVP(event.id);
  const isSaved = isEventSaved(event.id);
  const attendeeCount = getRSVPCount(event);
  const showDistance = state.nearMeEnabled && event.distance !== undefined;
  const friendsGoing = getFriendsGoingToEvent(event.id);

  const formatDate = (date: string, time: string) => {
    const eventDate = new Date(date);
    const dayName = eventDate.toLocaleDateString('en-US', { weekday: 'short' });
    const monthDay = eventDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    return `${dayName} ${monthDay} • ${time}`;
  };

  const formatPrice = (event: Event) => {
    if (event.price === null) return 'Free';

    // Show the best price available
    const prices = [];
    if (event.price !== null) prices.push(event.price);
    if (event.happyHourPrice !== undefined) prices.push(event.happyHourPrice);
    if (event.studentPrice !== undefined) prices.push(event.studentPrice);

    const minPrice = Math.min(...prices);
    const isDiscounted = minPrice < (event.price || 0);

    return isDiscounted ? `From $${minPrice}` : `$${event.price}`;
  };

  const handleRSVP = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleRSVP(event.id);
  };

  const handleBookmark = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleSavedEvent(event.id);
  };

  // Get first 3 attendees for avatar preview
  const attendeeAvatars = event.attendeeIds.slice(0, 3).map(id => {
    const user = getUserById(id);
    return user?.avatar || `https://picsum.photos/seed/user${id}/40/40`;
  });

  return (
    <Link href={`/events/${event.id}`} className="group block">
      <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-gray-200 hover:shadow-xl hover:shadow-black/5 transition-all duration-300 group-hover:-translate-y-1">
        {/* Hero Image */}
        <div className="relative w-full h-52">
          <Image
            src={event.imageUrl}
            alt={event.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover"
          />

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />

          {/* Category Tag */}
          <div className="absolute top-4 left-4">
            <span className={`font-body text-ui-caption px-3 py-1.5 rounded-xl text-xs font-semibold backdrop-blur-sm border border-white/20 ${categoryColors[event.category] || 'bg-gray-100 text-gray-800'}`}>
              {event.category}
            </span>
          </div>

          {/* Bookmark Button */}
          <div className="absolute top-4 right-4 z-10">
            <motion.button
              onClick={handleBookmark}
              whileTap={{ scale: 0.9 }}
              className={`p-2 rounded-xl backdrop-blur-sm border border-white/20 transition-all ${
                isSaved
                  ? 'bg-red-500 text-white'
                  : 'bg-white/90 text-gray-600 hover:text-red-500'
              }`}
            >
              <Heart className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
            </motion.button>
          </div>

          {/* Featured/Sponsored Badges */}
          {(event.featured || event.sponsored) && (
            <div className="absolute top-16 left-4 flex flex-col space-y-2">
              {event.featured && (
                <span className="font-body text-ui-caption flex items-center space-x-1.5 px-3 py-1.5 bg-primary text-white rounded-xl text-xs font-semibold shadow-lg shadow-primary/25">
                  <Star className="w-3 h-3 fill-current" />
                  <span>Featured</span>
                </span>
              )}
              {event.sponsored && (
                <span className="font-body text-ui-caption flex items-center space-x-1.5 px-3 py-1.5 bg-yellow-500 text-white rounded-xl text-xs font-semibold shadow-lg">
                  <DollarSign className="w-3 h-3" />
                  <span>Sponsored</span>
                </span>
              )}
            </div>
          )}

          {/* Price Badge */}
          <div className="absolute bottom-4 right-4 flex flex-col items-end space-y-1">
            <span className="font-body text-body-semibold px-3 py-1.5 bg-white/90 backdrop-blur-sm rounded-xl text-sm font-bold text-text shadow-sm">
              {formatPrice(event)}
            </span>
            {/* Budget-friendly badges */}
            <div className="flex space-x-1">
              {event.hasHappyHour && (
                <span className="px-2 py-1 bg-green-100 text-green-800 rounded-md text-xs font-semibold">
                  Happy Hour
                </span>
              )}
              {event.hasStudentDiscount && (
                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-md text-xs font-semibold">
                  Student
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Card Content */}
        <div className="p-5">
          {/* Event Title */}
          <h3 className="font-editorial text-editorial-subhead font-bold text-xl text-text mb-3 line-clamp-2 leading-tight group-hover:text-primary transition-colors">
            {event.title}
          </h3>

          {/* Friends Going Indicator */}
          <FriendsGoingIndicator
            friends={friendsGoing}
            eventId={event.id}
            eventTitle={event.title}
          />

          {/* Date & Time */}
          <div className="flex items-center text-gray-600 text-sm mb-2">
            <Calendar className="w-4 h-4 mr-2 text-primary" />
            <span className="font-body text-body-medium font-medium">{formatDate(event.date, event.time)}</span>
          </div>

          {/* Location */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center text-gray-600 text-sm">
              <MapPin className="w-4 h-4 mr-2 text-primary" />
              <span className="font-body text-body-primary">{event.location.neighborhood}</span>
            </div>
            {showDistance && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2 }}
                className="font-body text-ui-caption flex items-center space-x-1 bg-primary/10 text-primary px-2.5 py-1 rounded-full text-xs font-semibold"
              >
                <Navigation className="w-3 h-3" />
                <span>{formatDistance(event.distance!)}</span>
              </motion.div>
            )}
          </div>

          {/* Attendees and RSVP */}
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              {/* Avatar Stack */}
              <div className="flex -space-x-3">
                {attendeeAvatars.map((avatar, index) => (
                  <div
                    key={index}
                    className="relative w-8 h-8 rounded-full border-2 border-white overflow-hidden shadow-sm"
                  >
                    <Image
                      src={avatar}
                      alt={`Attendee ${index + 1}`}
                      fill
                      sizes="32px"
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
              {/* Count */}
              <span className="font-body text-body-medium text-sm text-gray-600 ml-3 font-medium">
                <motion.span
                  key={attendeeCount}
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  {attendeeCount} going
                </motion.span>
              </span>
            </div>

            {/* RSVP Button */}
            <motion.button
              onClick={handleRSVP}
              whileTap={{ scale: 0.95 }}
              className={`font-body text-ui-button px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                isRSVP
                  ? 'bg-primary text-white shadow-lg shadow-primary/25'
                  : 'bg-primary/10 text-primary hover:bg-primary hover:text-white'
              }`}
            >
              {isRSVP ? (
                <div className="flex items-center space-x-1.5">
                  <Check className="w-4 h-4" />
                  <span>Going</span>
                </div>
              ) : (
                <span>I'm Going</span>
              )}
            </motion.button>
          </div>
        </div>
      </div>
    </Link>
  );
}