import Link from 'next/link';
import Image from 'next/image';
import { Event } from '@/lib/types';
import { getUserById } from '@/lib/mockData';
import { Calendar, MapPin, Star, DollarSign } from 'lucide-react';

interface EventCardProps {
  event: Event;
}

const categoryColors: Record<string, string> = {
  'Food & Drink': 'bg-orange-100 text-orange-800',
  'Nightlife': 'bg-purple-100 text-purple-800',
  'Fitness': 'bg-green-100 text-green-800',
  'Outdoors': 'bg-blue-100 text-blue-800',
  'Arts & Culture': 'bg-pink-100 text-pink-800',
  'Music': 'bg-red-100 text-red-800',
  'Networking': 'bg-gray-100 text-gray-800',
  'Wellness': 'bg-teal-100 text-teal-800',
  'Sports': 'bg-indigo-100 text-indigo-800',
  'Pop-ups & Markets': 'bg-yellow-100 text-yellow-800',
};

export default function EventCard({ event }: EventCardProps) {
  const formatDate = (date: string, time: string) => {
    const eventDate = new Date(date);
    const dayName = eventDate.toLocaleDateString('en-US', { weekday: 'short' });
    const monthDay = eventDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    return `${dayName} ${monthDay} • ${time}`;
  };

  const formatPrice = (price: number | null) => {
    if (price === null) return 'Free';
    return `$${price}`;
  };

  // Get first 3 attendees for avatar preview
  const attendeeAvatars = event.attendeeIds.slice(0, 3).map(id => {
    const user = getUserById(id);
    return user?.avatar || `https://picsum.photos/seed/user${id}/40/40`;
  });

  return (
    <Link href={`/events/${event.id}`}>
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow cursor-pointer">
        {/* Hero Image */}
        <div className="relative w-full h-48">
          <Image
            src={event.imageUrl}
            alt={event.title}
            fill
            className="object-cover"
          />
          {/* Category Tag */}
          <div className="absolute top-3 left-3">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${categoryColors[event.category] || 'bg-gray-100 text-gray-800'}`}>
              {event.category}
            </span>
          </div>

          {/* Featured/Sponsored Badges */}
          <div className="absolute top-3 right-3 flex flex-col space-y-2">
            {event.featured && (
              <span className="flex items-center space-x-1 px-2 py-1 bg-primary text-deep rounded-full text-xs font-medium">
                <Star className="w-3 h-3" />
                <span>Featured</span>
              </span>
            )}
            {event.sponsored && (
              <span className="flex items-center space-x-1 px-2 py-1 bg-yellow-500 text-white rounded-full text-xs font-medium">
                <DollarSign className="w-3 h-3" />
                <span>Sponsored</span>
              </span>
            )}
          </div>
        </div>

        {/* Card Content */}
        <div className="p-4">
          {/* Event Title */}
          <h3 className="font-bold text-lg text-text mb-2 line-clamp-1">{event.title}</h3>

          {/* Date & Time */}
          <div className="flex items-center text-muted text-sm mb-2">
            <Calendar className="w-4 h-4 mr-1" />
            {formatDate(event.date, event.time)}
          </div>

          {/* Location */}
          <div className="flex items-center text-muted text-sm mb-3">
            <MapPin className="w-4 h-4 mr-1" />
            {event.location.neighborhood}
          </div>

          {/* Price and Attendees */}
          <div className="flex items-center justify-between">
            {/* Price */}
            <span className="font-semibold text-text">{formatPrice(event.price)}</span>

            {/* Attendees */}
            <div className="flex items-center">
              {/* Avatar Stack */}
              <div className="flex -space-x-2 mr-2">
                {attendeeAvatars.map((avatar, index) => (
                  <div key={index} className="relative w-6 h-6 rounded-full border-2 border-white overflow-hidden">
                    <Image
                      src={avatar}
                      alt={`Attendee ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
              {/* Count */}
              <span className="text-sm text-muted">{event.attendeeIds.length} going</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}