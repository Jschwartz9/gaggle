import { User, Event, City, EventCategory, AgeGroup, Notification } from './types';

// Mock Cities (10 US cities as specified)
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
];

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
    eventsAttending: ['1', '5'],
    eventsHosted: ['1'],
    following: ['2', '3'],
    followers: ['2', '4', '5'],
  },
  {
    id: '2',
    name: 'Marcus Johnson',
    age: 28,
    bio: 'Tech professional who loves running',
    avatar: 'https://picsum.photos/seed/marcus/150/150',
    interests: ['Fitness', 'Networking', 'Outdoors'],
    city: 'Denver',
    eventsAttending: ['2', '4'],
    eventsHosted: ['2'],
    following: ['1', '3', '4'],
    followers: ['1', '6'],
  },
  {
    id: '3',
    name: 'Emma Rodriguez',
    age: 24,
    bio: 'Music lover & social butterfly',
    avatar: 'https://picsum.photos/seed/emma/150/150',
    interests: ['Music', 'Nightlife', 'Arts & Culture'],
    city: 'Austin',
    eventsAttending: ['3', '9'],
    eventsHosted: ['3'],
    following: ['1', '2', '7'],
    followers: ['1', '2', '8'],
  },
  {
    id: '4',
    name: 'Alex Kim',
    age: 30,
    bio: 'Startup founder & networking enthusiast',
    avatar: 'https://picsum.photos/seed/alex/150/150',
    interests: ['Networking', 'Food & Drink', 'Wellness'],
    city: 'Chicago',
    eventsAttending: ['4', '8'],
    eventsHosted: ['4'],
    following: ['2', '5', '6'],
    followers: ['1', '3', '7'],
  },
  {
    id: '5',
    name: 'Jordan Taylor',
    age: 23,
    bio: 'Artist & pop-up market curator',
    avatar: 'https://picsum.photos/seed/jordan/150/150',
    interests: ['Arts & Culture', 'Pop-ups & Markets', 'Wellness'],
    city: 'New York',
    eventsAttending: ['1', '5'],
    eventsHosted: ['5'],
    following: ['1', '3', '8'],
    followers: ['2', '4', '6'],
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
    },
    price: 35,
    ageGroup: '21+' as AgeGroup,
    attendeeIds: ['1', '5', '3', '4', '8', '2', '7'], // 47 mock attendees (showing first 7)
    vibesTags: ['Upscale', 'Social', 'Views'],
    createdAt: '2024-03-01',
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
    },
    price: null, // Free
    ageGroup: '25+' as AgeGroup,
    attendeeIds: ['4', '2', '8', '1', '7', '5', '3', '6'], // 68 mock attendees (showing first 8)
    vibesTags: ['Professional', 'Innovative', 'Structured'],
    createdAt: '2024-02-28',
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
    },
    price: null, // Free
    ageGroup: 'All ages' as AgeGroup,
    attendeeIds: ['5', '1', '3', '8', '7', '2', '4', '6'], // 112 mock attendees (showing first 8)
    vibesTags: ['Creative', 'Community', 'Interactive'],
    createdAt: '2024-03-03',
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
    },
    price: 30,
    ageGroup: '21+' as AgeGroup,
    attendeeIds: ['8', '4', '1', '7'], // 22 mock attendees (showing first 4)
    vibesTags: ['Late-night', 'Foodie', 'Adventure'],
    createdAt: '2024-03-09',
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