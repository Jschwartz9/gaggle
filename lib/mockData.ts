import { User, Event, City, EventCategory, AgeGroup, Notification, Message, Conversation } from './types';

// Mock Cities (11 US cities as specified, including Lexington)
export const mockCities: City[] = [
  { id: 'nyc', name: 'New York', state: 'NY', coordinates: { lat: 40.7128, lng: -74.0060 } },
  { id: 'la', name: 'Los Angeles', state: 'CA', coordinates: { lat: 34.0522, lng: -118.2437 } },
  { id: 'chi', name: 'Chicago', state: 'IL', coordinates: { lat: 41.8781, lng: -87.6298 } },
  { id: 'hou', name: 'Houston', state: 'TX', coordinates: { lat: 29.7604, lng: -95.3698 } },
  { id: 'mia', name: 'Miami', state: 'FL', coordinates: { lat: 25.7617, lng: -80.1918 } },
  { id: 'aus', name: 'Austin', state: 'TX', coordinates: { lat: 30.2672, lng: -97.7431 } },
  { id: 'nash', name: 'Nashville', state: 'TN', coordinates: { lat: 36.1627, lng: -86.7816 } },
  { id: 'atl', name: 'Atlanta', state: 'GA', coordinates: { lat: 33.7490, lng: -84.3880 } },
  { id: 'den', name: 'Denver', state: 'CO', coordinates: { lat: 39.7392, lng: -104.9903 } },
  { id: 'dc', name: 'Washington DC', state: 'DC', coordinates: { lat: 38.9072, lng: -77.0369 } },
  { id: 'lex', name: 'Lexington', state: 'VA', coordinates: { lat: 37.7844, lng: -79.4426 } },
];

// Current user - this will be the logged-in user
export const currentUser: User = {
  id: 'current',
  name: 'You',
  age: 27,
  bio: 'Social event discoverer',
  avatar: 'https://picsum.photos/seed/currentuser/150/150',
  interests: ['Food & Drink', 'Music', 'Arts & Culture', 'Networking'],
  city: 'New York',
  eventsAttending: ['1', '3', '5'],
  eventsHosted: [],
  following: ['1', '2', '3', '4', '5'], // Following Sarah, Marcus, Emma, Alex, Jordan
  followers: ['1', '2', '3'],
};

// Mock Users (8 users, ages 22-30)
export const mockUsers: User[] = [
  {
    id: '1',
    name: 'Sarah Chen',
    age: 26,
    bio: 'Art enthusiast & weekend adventurer',
    avatar: 'https://picsum.photos/seed/sarah/150/150',
    interests: ['Arts & Culture', 'Food & Drink', 'Outdoors'],
    city: 'New York',
    eventsAttending: ['1', '5', '12'], // Added more events
    eventsHosted: ['1', '12'],
    following: ['2', '3', 'current'],
    followers: ['2', '4', '5', 'current'],
  },
  {
    id: '2',
    name: 'Marcus Johnson',
    age: 28,
    bio: 'Tech professional who loves running',
    avatar: 'https://picsum.photos/seed/marcus/150/150',
    interests: ['Fitness', 'Networking', 'Outdoors'],
    city: 'New York', // Changed to NYC to create more friend overlap
    eventsAttending: ['2', '4', '1', '15'], // Added more events including event 1
    eventsHosted: ['2'],
    following: ['1', '3', '4', 'current'],
    followers: ['1', '6', 'current'],
  },
  {
    id: '3',
    name: 'Emma Rodriguez',
    age: 24,
    bio: 'Music lover & social butterfly',
    avatar: 'https://picsum.photos/seed/emma/150/150',
    interests: ['Music', 'Nightlife', 'Arts & Culture'],
    city: 'New York', // Changed to NYC for more overlap
    eventsAttending: ['3', '9', '1', '5', '15'], // Added overlapping events
    eventsHosted: ['3', '15'],
    following: ['1', '2', '7', 'current'],
    followers: ['1', '2', '8', 'current'],
  },
  {
    id: '4',
    name: 'Alex Kim',
    age: 30,
    bio: 'Startup founder & networking enthusiast',
    avatar: 'https://picsum.photos/seed/alex/150/150',
    interests: ['Networking', 'Food & Drink', 'Wellness'],
    city: 'New York', // Changed to NYC for more overlap
    eventsAttending: ['4', '8', '13'], // Added events
    eventsHosted: ['4'],
    following: ['2', '5', '6', 'current'],
    followers: ['1', '3', '7', 'current'],
  },
  {
    id: '5',
    name: 'Jordan Taylor',
    age: 23,
    bio: 'Artist & pop-up market curator',
    avatar: 'https://picsum.photos/seed/jordan/150/150',
    interests: ['Arts & Culture', 'Pop-ups & Markets', 'Wellness'],
    city: 'New York',
    eventsAttending: ['1', '5', '14'], // Added more events
    eventsHosted: ['5', '14'],
    following: ['1', '3', '8', 'current'],
    followers: ['2', '4', '6', 'current'],
  },
  {
    id: '6',
    name: 'Sofia Morales',
    age: 27,
    bio: 'Dance instructor & fitness enthusiast',
    avatar: 'https://picsum.photos/seed/sofia/150/150',
    interests: ['Fitness', 'Music', 'Nightlife'],
    city: 'Miami',
    eventsAttending: ['6', '7'],
    eventsHosted: ['6'],
    following: ['2', '3', '5'],
    followers: ['4', '7', '8'],
  },
  {
    id: '7',
    name: 'Ryan O\'Connor',
    age: 25,
    bio: 'Outdoor enthusiast & photographer',
    avatar: 'https://picsum.photos/seed/ryan/150/150',
    interests: ['Outdoors', 'Sports', 'Arts & Culture'],
    city: 'Washington DC',
    eventsAttending: ['7', '8'],
    eventsHosted: ['7'],
    following: ['1', '4', '6'],
    followers: ['3', '5'],
  },
  {
    id: '8',
    name: 'Maya Patel',
    age: 29,
    bio: 'Foodie & community organizer',
    avatar: 'https://picsum.photos/seed/maya/150/150',
    interests: ['Food & Drink', 'Pop-ups & Markets', 'Networking'],
    city: 'Nashville',
    eventsAttending: ['8', '10'],
    eventsHosted: ['8'],
    following: ['3', '5', '7'],
    followers: ['1', '6'],
  },
];

// Mock Events (10 events as specified)
export const mockEvents: Event[] = [
  {
    id: '1',
    title: 'Rooftop Wine Tasting',
    description: 'Join us for an evening of curated wines with Manhattan skyline views. Featured wines from local vineyards with light bites.',
    category: 'Food & Drink',
    hostId: '1',
    imageUrl: 'https://picsum.photos/seed/wine/400/300',
    date: '2024-03-15',
    time: '7:00 PM',
    location: {
      city: 'New York',
      neighborhood: 'Manhattan',
      address: '123 Rooftop Ave',
      coordinates: {
        lat: 40.7589,
        lng: -73.9851,
      },
    },
    price: 35,
    ageGroup: '21+' as AgeGroup,
    attendeeIds: ['1', '5', '3', '4', '8', '2', '7'], // 47 mock attendees (showing first 7)
    vibesTags: ['Upscale', 'Social', 'Views'],
    createdAt: '2024-03-01',
    featured: true,
    sponsored: true,
  },
  {
    id: '2',
    title: 'Sunday Morning Trail Run',
    description: 'Start your week right with a refreshing trail run through scenic mountain paths. All fitness levels welcome!',
    category: 'Fitness',
    hostId: '2',
    imageUrl: 'https://picsum.photos/seed/trail/400/300',
    date: '2024-03-17',
    time: '8:00 AM',
    location: {
      city: 'Denver',
      neighborhood: 'Rocky Mountain National Park',
      coordinates: {
        lat: 40.3428,
        lng: -105.6836,
      },
    },
    price: null, // Free
    ageGroup: 'All ages' as AgeGroup,
    attendeeIds: ['2', '1', '7', '4', '6'], // 23 mock attendees (showing first 5)
    vibesTags: ['Outdoorsy', 'Active', 'Morning'],
    createdAt: '2024-03-05',
  },
  {
    id: '3',
    title: 'Jazz & Bites Night',
    description: 'Live jazz performances paired with artisanal small plates. Discover local musicians and flavors.',
    category: 'Music',
    hostId: '3',
    imageUrl: 'https://picsum.photos/seed/jazz/400/300',
    date: '2024-03-16',
    time: '8:30 PM',
    location: {
      city: 'Austin',
      neighborhood: 'East Austin',
      address: '456 Music Lane',
      coordinates: {
        lat: 30.2637,
        lng: -97.7157,
      },
    },
    price: 15,
    ageGroup: '21+' as AgeGroup,
    attendeeIds: ['3', '1', '8', '5', '2'], // 31 mock attendees (showing first 5)
    vibesTags: ['Intimate', 'Artsy', 'Live Music'],
    createdAt: '2024-03-02',
  },
  {
    id: '4',
    title: 'Tech Networking Mixer',
    description: 'Connect with Chicago\'s tech community. Structured networking activities and startup showcase.',
    category: 'Networking',
    hostId: '4',
    imageUrl: 'https://picsum.photos/seed/tech/400/300',
    date: '2024-03-18',
    time: '6:00 PM',
    location: {
      city: 'Chicago',
      neighborhood: 'River North',
      address: '789 Innovation Hub',
      coordinates: {
        lat: 41.8919,
        lng: -87.6278,
      },
    },
    price: null, // Free
    ageGroup: '25+' as AgeGroup,
    attendeeIds: ['4', '2', '8', '1', '7', '5', '3', '6'], // 68 mock attendees (showing first 8)
    vibesTags: ['Professional', 'Innovative', 'Structured'],
    createdAt: '2024-02-28',
    featured: true,
  },
  {
    id: '5',
    title: 'Pop-up Art Market',
    description: 'Browse unique artworks from emerging local artists. Interactive art installations and live painting demos.',
    category: 'Pop-ups & Markets',
    hostId: '5',
    imageUrl: 'https://picsum.photos/seed/artmarket/400/300',
    date: '2024-03-16',
    time: '11:00 AM',
    location: {
      city: 'New York',
      neighborhood: 'Brooklyn',
      address: 'Prospect Park',
      coordinates: {
        lat: 40.6602,
        lng: -73.9690,
      },
    },
    price: null, // Free
    ageGroup: 'All ages' as AgeGroup,
    attendeeIds: ['5', '1', '3', '8', '7', '2', '4', '6'], // 112 mock attendees (showing first 8)
    vibesTags: ['Creative', 'Community', 'Interactive'],
    createdAt: '2024-03-03',
    sponsored: true,
  },
  {
    id: '6',
    title: 'Salsa Dancing Intro Class',
    description: 'Learn basic salsa steps in a fun, welcoming environment. No partner or experience required!',
    category: 'Fitness',
    hostId: '6',
    imageUrl: 'https://picsum.photos/seed/salsa/400/300',
    date: '2024-03-19',
    time: '7:30 PM',
    location: {
      city: 'Miami',
      neighborhood: 'South Beach',
      address: '321 Dance Studio',
      coordinates: {
        lat: 25.7907,
        lng: -80.1300,
      },
    },
    price: 20,
    ageGroup: 'All ages' as AgeGroup,
    attendeeIds: ['6', '3', '1', '5', '8'], // 28 mock attendees (showing first 5)
    vibesTags: ['Energetic', 'Beginner-friendly', 'Social'],
    createdAt: '2024-03-06',
  },
  {
    id: '7',
    title: 'Sunset Kayaking',
    description: 'Paddle along the Potomac River as the sun sets behind the monuments. Equipment provided.',
    category: 'Outdoors',
    hostId: '7',
    imageUrl: 'https://picsum.photos/seed/kayak/400/300',
    date: '2024-03-20',
    time: '6:30 PM',
    location: {
      city: 'Washington DC',
      neighborhood: 'Georgetown Waterfront',
      coordinates: {
        lat: 38.9048,
        lng: -77.0621,
      },
    },
    price: 40,
    ageGroup: 'All ages' as AgeGroup,
    attendeeIds: ['7', '2', '4', '1'], // 14 mock attendees (showing first 4)
    vibesTags: ['Scenic', 'Adventure', 'Sunset'],
    createdAt: '2024-03-07',
  },
  {
    id: '8',
    title: 'Saturday Farmers Market Crawl',
    description: 'Tour Nashville\'s best farmers markets with tastings and local vendor meetups.',
    category: 'Food & Drink',
    hostId: '8',
    imageUrl: 'https://picsum.photos/seed/market/400/300',
    date: '2024-03-16',
    time: '9:00 AM',
    location: {
      city: 'Nashville',
      neighborhood: 'Music City Center area',
      coordinates: {
        lat: 36.1581,
        lng: -86.7759,
      },
    },
    price: null, // Free
    ageGroup: 'All ages' as AgeGroup,
    attendeeIds: ['8', '4', '7', '2', '5', '3'], // 55 mock attendees (showing first 6)
    vibesTags: ['Local', 'Community', 'Morning'],
    createdAt: '2024-03-04',
  },
  {
    id: '9',
    title: 'Comedy Open Mic',
    description: 'Support local comedians and enjoy laughs with craft cocktails. Sign up to perform or just enjoy the show!',
    category: 'Nightlife',
    hostId: '3',
    imageUrl: 'https://picsum.photos/seed/comedy/400/300',
    date: '2024-03-21',
    time: '9:00 PM',
    location: {
      city: 'Los Angeles',
      neighborhood: 'West Hollywood',
      address: '654 Comedy Club',
      coordinates: {
        lat: 34.0900,
        lng: -118.3617,
      },
    },
    price: 10,
    ageGroup: '21+' as AgeGroup,
    attendeeIds: ['3', '1', '5', '8', '2'], // 39 mock attendees (showing first 5)
    vibesTags: ['Funny', 'Relaxed', 'Creative'],
    createdAt: '2024-03-08',
  },
  {
    id: '10',
    title: 'Midnight Food Tour',
    description: 'Explore Houston\'s best late-night eats with a local food guide. Four stops, endless flavor.',
    category: 'Food & Drink',
    hostId: '8',
    imageUrl: 'https://picsum.photos/seed/foodtour/400/300',
    date: '2024-03-22',
    time: '11:30 PM',
    location: {
      city: 'Houston',
      neighborhood: 'Montrose District',
      coordinates: {
        lat: 29.7342,
        lng: -95.3954,
      },
    },
    price: 30,
    ageGroup: '21+' as AgeGroup,
    attendeeIds: ['8', '4', '1', '7'], // 22 mock attendees (showing first 4)
    vibesTags: ['Late-night', 'Foodie', 'Adventure'],
    createdAt: '2024-03-09',
  },
  // Lexington, VA Curated Events
  {
    id: '11',
    title: 'Blue Ridge Mountain Sunset Hike',
    description: 'Join us for a guided sunset hike with stunning valley views. Perfect for photography and making new friends.',
    category: 'Outdoors',
    hostId: '7',
    imageUrl: 'https://picsum.photos/seed/blueridge/400/300',
    date: '2024-03-23',
    time: '5:30 PM',
    location: {
      city: 'Lexington',
      neighborhood: 'Blue Ridge Parkway',
      coordinates: {
        lat: 37.7844,
        lng: -79.4426,
      },
    },
    price: 15,
    ageGroup: 'All ages' as AgeGroup,
    attendeeIds: ['7', '2', '1', '5', '3'], // 18 mock attendees (showing first 5)
    vibesTags: ['Scenic', 'Adventure', 'Photography'],
    createdAt: '2024-03-10',
  },
  {
    id: '12',
    title: 'Historic Downtown Walking Tour',
    description: 'Discover Lexington\'s rich Civil War history and charming architecture. Led by local historian.',
    category: 'Arts & Culture',
    hostId: '1',
    imageUrl: 'https://picsum.photos/seed/historic/400/300',
    date: '2024-03-24',
    time: '2:00 PM',
    location: {
      city: 'Lexington',
      neighborhood: 'Historic Downtown',
      address: 'Washington & Lee University',
      coordinates: {
        lat: 37.7871,
        lng: -79.4415,
      },
    },
    price: null, // Free
    ageGroup: 'All ages' as AgeGroup,
    attendeeIds: ['1', '3', '5', '8'], // 12 mock attendees (showing first 4)
    vibesTags: ['Educational', 'Historic', 'Walking'],
    createdAt: '2024-03-11',
  },
  {
    id: '13',
    title: 'Farm-to-Table Dinner Experience',
    description: 'Savor locally-sourced cuisine at a beautiful countryside venue. Meet the farmers and chefs behind your meal.',
    category: 'Food & Drink',
    hostId: '8',
    imageUrl: 'https://picsum.photos/seed/farmtable/400/300',
    date: '2024-03-25',
    time: '6:00 PM',
    location: {
      city: 'Lexington',
      neighborhood: 'Countryside',
      address: 'Valley View Farm',
      coordinates: {
        lat: 37.7921,
        lng: -79.4601,
      },
    },
    price: 45,
    ageGroup: '21+' as AgeGroup,
    attendeeIds: ['8', '1', '4', '5', '2', '3'], // 24 mock attendees (showing first 6)
    vibesTags: ['Farm-fresh', 'Intimate', 'Local'],
    createdAt: '2024-03-12',
  },
  {
    id: '14',
    title: 'Artisan Coffee Cupping Workshop',
    description: 'Learn the art of coffee tasting with local roasters. Discover flavor profiles and brewing techniques.',
    category: 'Wellness',
    hostId: '5',
    imageUrl: 'https://picsum.photos/seed/coffee/400/300',
    date: '2024-03-26',
    time: '10:00 AM',
    location: {
      city: 'Lexington',
      neighborhood: 'Downtown',
      address: 'Main Street Coffee Co.',
      coordinates: {
        lat: 37.7844,
        lng: -79.4380,
      },
    },
    price: 25,
    ageGroup: 'All ages' as AgeGroup,
    attendeeIds: ['5', '1', '8', '3'], // 16 mock attendees (showing first 4)
    vibesTags: ['Artisan', 'Educational', 'Cozy'],
    createdAt: '2024-03-13',
  },
  {
    id: '15',
    title: 'Vintage Vinyl & Wine Night',
    description: 'Browse rare vinyl records while sampling Virginia wines. Local musicians will perform acoustic sets.',
    category: 'Music',
    hostId: '3',
    imageUrl: 'https://picsum.photos/seed/vinyl/400/300',
    date: '2024-03-27',
    time: '7:00 PM',
    location: {
      city: 'Lexington',
      neighborhood: 'Main Street',
      address: 'Record Exchange',
      coordinates: {
        lat: 37.7851,
        lng: -79.4390,
      },
    },
    price: 20,
    ageGroup: '21+' as AgeGroup,
    attendeeIds: ['3', '1', '5', '8', '2'], // 20 mock attendees (showing first 5)
    vibesTags: ['Vintage', 'Musical', 'Wine'],
    createdAt: '2024-03-14',
  },
];

// Mock Notifications
export const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'rsvp',
    message: '3 new people are going to Rooftop Wine Tasting',
    timestamp: '2024-03-10T10:30:00Z',
    read: false,
    relatedEventId: '1',
  },
  {
    id: '2',
    type: 'like',
    message: 'Jake liked your event "Jazz & Bites Night"',
    timestamp: '2024-03-10T09:15:00Z',
    read: false,
    relatedEventId: '3',
    relatedUserId: '2',
  },
  {
    id: '3',
    type: 'new_event',
    message: 'New event in Music near you',
    timestamp: '2024-03-10T08:00:00Z',
    read: true,
    relatedEventId: '9',
  },
];

// Mock Messages
export const mockMessages: Message[] = [
  {
    id: '1',
    senderId: '2',
    receiverId: '1',
    content: 'Hey! Are you going to the trail run this weekend?',
    timestamp: '2024-03-10T14:30:00Z',
    read: true,
  },
  {
    id: '2',
    senderId: '1',
    receiverId: '2',
    content: 'Yes! Can\'t wait. It looks like perfect weather for it.',
    timestamp: '2024-03-10T14:35:00Z',
    read: true,
  },
  {
    id: '3',
    senderId: '2',
    receiverId: '1',
    content: 'Awesome! Want to grab coffee after?',
    timestamp: '2024-03-10T14:40:00Z',
    read: false,
  },
  {
    id: '4',
    senderId: '3',
    receiverId: '1',
    content: 'Thanks for coming to jazz night! Hope you enjoyed the music.',
    timestamp: '2024-03-09T22:15:00Z',
    read: true,
  },
  {
    id: '5',
    senderId: '1',
    receiverId: '3',
    content: 'It was incredible! The saxophone player was amazing. When\'s the next one?',
    timestamp: '2024-03-09T22:20:00Z',
    read: true,
  },
  {
    id: '6',
    senderId: '3',
    receiverId: '1',
    content: 'Next month! I\'ll send you the details when we announce it.',
    timestamp: '2024-03-09T22:25:00Z',
    read: false,
  },
];

// Mock Conversations
export const mockConversations: Conversation[] = [
  {
    id: '1-2',
    participantIds: ['1', '2'],
    lastMessage: {
      id: '3',
      senderId: '2',
      receiverId: '1',
      content: 'Awesome! Want to grab coffee after?',
      timestamp: '2024-03-10T14:40:00Z',
      read: false,
    },
    lastActivity: '2024-03-10T14:40:00Z',
    unreadCount: 1,
  },
  {
    id: '1-3',
    participantIds: ['1', '3'],
    lastMessage: {
      id: '6',
      senderId: '3',
      receiverId: '1',
      content: 'Next month! I\'ll send you the details when we announce it.',
      timestamp: '2024-03-09T22:25:00Z',
      read: false,
    },
    lastActivity: '2024-03-09T22:25:00Z',
    unreadCount: 1,
  },
];

// Helper functions
export const getEventById = (id: string): Event | undefined => {
  return mockEvents.find(event => event.id === id);
};

export const getUserById = (id: string): User | undefined => {
  return mockUsers.find(user => user.id === id);
};

export const getCityById = (id: string): City | undefined => {
  return mockCities.find(city => city.id === id);
};

export const getEventsByCity = (cityName: string): Event[] => {
  return mockEvents.filter(event => event.location.city === cityName);
};

export const getEventsByCategory = (category: EventCategory): Event[] => {
  return mockEvents.filter(event => event.category === category);
};

export const getConversationById = (id: string): Conversation | undefined => {
  return mockConversations.find(conv => conv.id === id);
};

export const getConversationByParticipants = (userId1: string, userId2: string): Conversation | undefined => {
  return mockConversations.find(conv =>
    conv.participantIds.includes(userId1) && conv.participantIds.includes(userId2)
  );
};

export const getMessagesForConversation = (conversationId: string): Message[] => {
  return mockMessages.filter(message => {
    const conv = getConversationById(conversationId);
    if (!conv) return false;
    return conv.participantIds.includes(message.senderId) &&
           conv.participantIds.includes(message.receiverId);
  }).sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
};

export const getUserConversations = (userId: string): Conversation[] => {
  return mockConversations.filter(conv => conv.participantIds.includes(userId))
    .sort((a, b) => new Date(b.lastActivity).getTime() - new Date(a.lastActivity).getTime());
};

// Friend-related helper functions
export const getFriendsListForUser = (userId: string): User[] => {
  const user = getUserById(userId);
  if (!user) return [];

  return user.following
    .map(friendId => getUserById(friendId))
    .filter((friend): friend is User => friend !== undefined);
};

export const getFriendsAttendingEvent = (eventId: string, userId: string): User[] => {
  const event = getEventById(eventId);
  const friends = getFriendsListForUser(userId);

  if (!event) return [];

  return friends.filter(friend => event.attendeeIds.includes(friend.id));
};

export const getCurrentUserWithUpdatedRSVPs = (userRSVPs: Set<string>): User => {
  return {
    ...currentUser,
    eventsAttending: [...new Set([...currentUser.eventsAttending, ...Array.from(userRSVPs)])]
  };
};

// Get all users including current user for context
export const getAllUsers = (): User[] => {
  return [currentUser, ...mockUsers];
};