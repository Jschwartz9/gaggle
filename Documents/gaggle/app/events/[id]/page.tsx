'use client';

import { useParams } from 'next/navigation';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Calendar, MapPin, DollarSign, UserPlus, Heart } from 'lucide-react';
import { getEventById, getUserById, mockEvents } from '@/lib/mockData';
import WhoIsGoing from '@/components/WhoIsGoing';
import EventCard from '@/components/EventCard';
import BottomNav from '@/components/BottomNav';

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

export default function EventDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const [isGoing, setIsGoing] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);

  const event = getEventById(id);

  if (!event) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-text mb-2">Event Not Found</h1>
          <p className="text-muted">The event you're looking for doesn't exist.</p>
          <Link href="/" className="text-primary font-medium mt-4 inline-block">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  const host = getUserById(event.hostId);

  // Get related events (same category, different city)
  const relatedEvents = mockEvents
    .filter(e => e.id !== event.id && e.category === event.category)
    .slice(0, 3);

  const formatDate = (date: string, time: string) => {
    const eventDate = new Date(date);
    const dayName = eventDate.toLocaleDateString('en-US', { weekday: 'long' });
    const monthDay = eventDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
    return `${dayName}, ${monthDay} • ${time}`;
  };

  const formatPrice = (price: number | null) => {
    if (price === null) return 'Free';
    return `$${price}`;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Main Content (with padding for desktop sidebar) */}
      <div className="md:pl-64 pb-20 md:pb-4">
        {/* Header with Back Button */}
        <div className="sticky top-0 z-30 bg-background p-4 border-b border-gray-200">
          <Link
            href="/"
            className="flex items-center space-x-2 text-muted hover:text-text transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Events</span>
          </Link>
        </div>

        {/* Hero Image */}
        <div className="relative w-full h-64 md:h-80">
          <Image
            src={event.imageUrl}
            alt={event.title}
            fill
            className="object-cover"
          />
          {/* Category Tag Overlay */}
          <div className="absolute top-4 left-4">
            <span className={`px-3 py-1.5 rounded-full text-sm font-medium ${categoryColors[event.category] || 'bg-gray-100 text-gray-800'}`}>
              {event.category}
            </span>
          </div>
        </div>

        {/* Event Details */}
        <div className="p-4 space-y-6">
          {/* Title and Vibe Tags */}
          <div className="space-y-3">
            <h1 className="text-3xl font-bold text-text">{event.title}</h1>
            <div className="flex flex-wrap gap-2">
              {event.vibesTags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Date, Time, Location */}
          <div className="space-y-3">
            <div className="flex items-center text-text">
              <Calendar className="w-5 h-5 mr-3 text-primary" />
              <span className="font-medium">{formatDate(event.date, event.time)}</span>
            </div>

            <div className="flex items-start text-text">
              <MapPin className="w-5 h-5 mr-3 text-primary mt-0.5" />
              <div>
                <p className="font-medium">{event.location.neighborhood}</p>
                <p className="text-sm text-muted">{event.location.city}</p>
                {event.location.address && (
                  <p className="text-sm text-muted">{event.location.address}</p>
                )}
              </div>
            </div>
          </div>

          {/* Map Placeholder */}
          <div className="bg-gray-100 rounded-lg h-32 flex items-center justify-center">
            <p className="text-muted text-sm">Map placeholder</p>
          </div>

          {/* Host Info */}
          {host && (
            <div className="flex items-center justify-between bg-white rounded-lg p-4 border border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="relative w-12 h-12 rounded-full overflow-hidden">
                  <Image
                    src={host.avatar}
                    alt={host.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <p className="font-medium text-text">Hosted by {host.name}</p>
                  <p className="text-sm text-muted">{host.age} years old • {host.bio}</p>
                </div>
              </div>
              <button
                onClick={() => setIsFollowing(!isFollowing)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isFollowing
                    ? 'bg-primary/10 text-primary border border-primary'
                    : 'bg-white border border-gray-300 text-muted hover:border-gray-400'
                }`}
              >
                <UserPlus className="w-4 h-4" />
                <span>{isFollowing ? 'Following' : 'Follow'}</span>
              </button>
            </div>
          )}

          {/* Price and RSVP */}
          <div className="flex items-center justify-between bg-white rounded-lg p-4 border border-gray-200">
            <div className="flex items-center space-x-2">
              <DollarSign className="w-5 h-5 text-primary" />
              <span className="text-xl font-bold text-text">{formatPrice(event.price)}</span>
            </div>
            <button
              onClick={() => setIsGoing(!isGoing)}
              className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-colors ${
                isGoing
                  ? 'bg-accent text-white'
                  : 'bg-primary text-deep hover:bg-primary/90'
              }`}
            >
              <Heart className={`w-4 h-4 ${isGoing ? 'fill-current' : ''}`} />
              <span>{isGoing ? 'Going' : 'RSVP'}</span>
            </button>
          </div>

          {/* Event Description */}
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <h2 className="text-lg font-bold text-text mb-3">About this event</h2>
            <p className="text-text leading-relaxed">{event.description}</p>
          </div>

          {/* Who's Going Section */}
          <WhoIsGoing event={event} />

          {/* Related Events */}
          {relatedEvents.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-text">Similar Events</h2>
              <div className="space-y-3">
                {relatedEvents.map((relatedEvent) => (
                  <EventCard key={relatedEvent.id} event={relatedEvent} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
}