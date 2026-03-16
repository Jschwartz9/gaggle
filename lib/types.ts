// User types
export interface User {
  id: string;
  name: string;
  age: number;
  bio: string;
  avatar: string;
  interests: InterestTag[];
  city: string;
  eventsAttending: string[];
  eventsHosted: string[];
  following: string[];
  followers: string[];
}

// Event types
export interface Event {
  id: string;
  title: string;
  description: string;
  category: EventCategory;
  hostId: string;
  imageUrl: string;
  date: string;
  time: string;
  location: Location;
  price: number | null; // null for free events
  ageGroup: AgeGroup;
  maxGroupSize?: number;
  attendeeIds: string[];
  vibesTags: string[];
  createdAt: string;
  featured?: boolean; // Featured events appear prominently
  sponsored?: boolean; // Sponsored events have special badges
  distance?: number; // Distance in miles when near me mode is active
}

// Location types
export interface Location {
  city: string;
  neighborhood: string;
  address?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

// City types
export interface City {
  id: string;
  name: string;
  state: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}

// Enums and types
export type EventCategory =
  | 'Food & Drink'
  | 'Nightlife'
  | 'Fitness'
  | 'Outdoors'
  | 'Arts & Culture'
  | 'Music'
  | 'Networking'
  | 'Wellness'
  | 'Sports'
  | 'Pop-ups & Markets';

export type InterestTag = EventCategory;

export type AgeGroup = 'All ages' | '21+' | '25+';

export type FilterPrice = 'Free' | 'Under $25' | 'Under $50' | 'Any';
export type FilterDistance = 'Under 1 mile' | 'Under 5 miles' | 'Under 10 miles' | 'Any';
export type FilterDate = 'Today' | 'This Weekend' | 'This Week' | 'Any';

// Filter interface
export interface EventFilters {
  category: EventCategory | 'All';
  price: FilterPrice;
  distance: FilterDistance;
  ageGroup: AgeGroup | 'Any';
  date: FilterDate;
}

// Onboarding types
export interface OnboardingData {
  selectedCity: string;
  visitingCity?: string;
  interests: InterestTag[];
  profile: {
    name: string;
    age: number;
    bio: string;
    avatar?: string;
  };
}

// Notification types
export interface Notification {
  id: string;
  type: 'like' | 'rsvp' | 'new_event' | 'follow';
  message: string;
  timestamp: string;
  read: boolean;
  relatedEventId?: string;
  relatedUserId?: string;
}

// Message types
export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: string;
  read: boolean;
}

export interface Conversation {
  id: string;
  participantIds: string[];
  lastMessage?: Message;
  lastActivity: string;
  unreadCount: number;
}