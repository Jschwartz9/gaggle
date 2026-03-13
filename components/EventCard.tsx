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
    <Link href={`/events/${event.id}`} className="group block">
      <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-gray-200 hover:shadow-xl hover:shadow-black/5 transition-all duration-300 group-hover:-translate-y-1">
        {/* Hero Image */}
        <div className="relative w-full h-52">
          <Image
            src={event.imageUrl}
            alt={event.title}
            fill
            className="object-cover"
          />

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />

          {/* Category Tag */}
          <div className="absolute top-4 left-4">
            <span className={`px-3 py-1.5 rounded-xl text-xs font-semibold backdrop-blur-sm border border-white/20 ${categoryColors[event.category] || 'bg-gray-100 text-gray-800'}`}>
              {event.category}
            </span>
          </div>

          {/* Featured/Sponsored Badges */}
          <div className="absolute top-4 right-4 flex flex-col space-y-2">
            {event.featured && (
              <span className="flex items-center space-x-1.5 px-3 py-1.5 bg-primary text-white rounded-xl text-xs font-semibold shadow-lg shadow-primary/25">
                <Star className="w-3 h-3 fill-current" />
                <span>Featured</span>
              </span>
            )}
            {event.sponsored && (
              <span className="flex items-center space-x-1.5 px-3 py-1.5 bg-yellow-500 text-white rounded-xl text-xs font-semibold shadow-lg">
                <DollarSign className="w-3 h-3" />
                <span>Sponsored</span>
              </span>
            )}
          </div>

          {/* Price Badge */}
          <div className="absolute bottom-4 right-4">
            <span className="px-3 py-1.5 bg-white/90 backdrop-blur-sm rounded-xl text-sm font-bold text-text shadow-sm">
              {formatPrice(event.price)}
            </span>
          </div>
        </div>

        {/* Card Content */}
        <div className="p-5">
          {/* Event Title */}
          <h3 className="font-bold text-xl text-text mb-3 line-clamp-2 leading-tight group-hover:text-primary transition-colors">
            {event.title}
          </h3>

          {/* Date & Time */}
          <div className="flex items-center text-gray-600 text-sm mb-2">
            <Calendar className="w-4 h-4 mr-2 text-primary" />
            <span className="font-medium">{formatDate(event.date, event.time)}</span>
          </div>

          {/* Location */}
          <div className="flex items-center text-gray-600 text-sm mb-4">
            <MapPin className="w-4 h-4 mr-2 text-primary" />
            <span>{event.location.neighborhood}</span>
          </div>

          {/* Attendees */}
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
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
              {/* Count */}
              <span className="text-sm text-gray-600 ml-3 font-medium">
                {event.attendeeIds.length} going
              </span>
            </div>

            {/* Join Indicator */}
            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center group-hover:bg-primary/20 transition-colors">
              <span className="text-primary text-xs font-bold">→</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}