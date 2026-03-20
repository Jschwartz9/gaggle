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
  hostName?: string; // Display name for business hosts
  hostType?: 'business' | 'user'; // Type of host
  hostVerified?: boolean; // Whether business host is verified
  clubId?: string; // If event is hosted by a club (members-only)
  imageUrl: string;
  date: string;
  time: string;
  location: Location;
  price: number | null; // null for free events
  happyHourPrice?: number; // Special happy hour pricing
  studentPrice?: number; // Special student discount pricing
  ageGroup: AgeGroup;
  maxGroupSize?: number;
  attendeeIds: string[];
  vibesTags: string[];
  createdAt: string;
  featured?: boolean; // Featured events appear prominently
  sponsored?: boolean; // Sponsored events have special badges
  distance?: number; // Distance in miles when near me mode is active
  hasHappyHour?: boolean; // Indicates if event has happy hour pricing
  hasStudentDiscount?: boolean; // Indicates if event offers student discounts
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
  | 'Date Night'
  | 'Late Night'
  | 'Brunch & Chill'
  | 'Fitness'
  | 'Outdoors'
  | 'Arts & Culture'
  | 'Music'
  | 'Skills & Hobbies'
  | 'Gaming & Tech'
  | 'Networking'
  | 'Wellness'
  | 'Sports'
  | 'Pop-ups & Markets';

export type InterestTag = EventCategory;

export type AgeGroup = 'All ages' | '21+' | '25+';

export type FilterPrice = 'Free' | 'Under $15' | 'Under $25' | 'Under $50' | 'Happy Hour' | 'Student Discount' | 'Any';
export type FilterDistance = 'Under 1 mile' | 'Under 5 miles' | 'Under 10 miles' | 'Any';
export type FilterDate = 'Today' | 'Tonight' | 'This Weekend' | 'This Week' | 'Any';
export type FilterVibe = 'Chill' | 'High Energy' | 'Networking' | 'Romantic' | 'Wild Night' | 'Any';
export type FilterGroupSize = 'Solo-friendly' | 'Small group (2-5)' | 'Big crowd (10+)' | 'Any';
export type FilterRecurring = 'One-time' | 'Recurring' | 'Any';
export type FilterVenue = 'Indoor' | 'Outdoor' | 'Any';

// Filter interface
export interface EventFilters {
  category: EventCategory | 'All';
  price: FilterPrice;
  distance: FilterDistance;
  ageGroup: AgeGroup | 'Any';
  date: FilterDate;
  vibe: FilterVibe;
  groupSize: FilterGroupSize;
  recurring: FilterRecurring;
  venue: FilterVenue;
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

// Event Stories types
export interface EventStory {
  id: string;
  eventId: string;
  userId: string; // Who posted the story
  type: 'image' | 'video';
  mediaUrl: string;
  caption?: string;
  timestamp: string;
  expiresAt: string; // Stories expire after 24 hours
  views: string[]; // Array of user IDs who viewed the story
}

export interface EventHighlight {
  id: string;
  eventId: string;
  title: string;
  coverImage: string;
  stories: EventStory[];
  createdAt: string;
}

// Group Chat types
export interface GroupChat {
  id: string;
  eventId: string;
  name: string;
  description?: string;
  memberIds: string[];
  adminIds: string[];
  createdAt: string;
  lastActivity: string;
  isPublic: boolean; // Public chats can be joined by anyone attending the event
  maxMembers?: number;
}

export interface GroupMessage {
  id: string;
  groupChatId: string;
  senderId: string;
  content: string;
  type: 'text' | 'image' | 'system';
  timestamp: string;
  replyTo?: string; // ID of message being replied to
}

// Check-in types
export interface EventCheckIn {
  id: string;
  eventId: string;
  userId: string;
  timestamp: string;
  location?: {
    lat: number;
    lng: number;
  };
  photo?: string; // Optional photo from check-in
  caption?: string; // Optional caption
  verified: boolean; // Whether check-in was location-verified
}

// Club types
export interface Club {
  id: string;
  name: string;
  description: string;
  category: InterestTag;
  city: string;
  memberIds: string[];
  adminIds: string[];
  memberCount: number;
  maxMembers?: number;
  isPrivate: boolean;
  activityLevel: 'Low' | 'Medium' | 'High';
  coverImage: string;
  createdAt: string;
  lastActivity: string;
  tags: string[];
  requirements?: string; // Special requirements to join
}