import { User, Event, City, EventCategory, AgeGroup, Notification, Message, Conversation, EventStory, EventHighlight, GroupChat, GroupMessage, EventCheckIn, Club } from './types';

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
    imageUrl: 'https://picsum.photos/seed/wineglass/400/300',
    date: '2024-04-18',
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
    happyHourPrice: 20,
    studentPrice: 25,
    ageGroup: '21+' as AgeGroup,
    attendeeIds: ['1', '5', '3', '4', '8', '2', '7'], // 47 mock attendees (showing first 7)
    vibesTags: ['Upscale', 'Social', 'Views'],
    createdAt: '2024-03-01',
    featured: true,
    sponsored: true,
    hasHappyHour: true,
    hasStudentDiscount: true,
  },
  {
    id: '2',
    title: 'Sunday Morning Trail Run',
    description: 'Start your week right with a refreshing trail run through scenic mountain paths. All fitness levels welcome!',
    category: 'Fitness',
    hostId: '2',
    imageUrl: 'https://picsum.photos/seed/running/400/300',
    date: '2024-04-22',
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
    imageUrl: 'https://picsum.photos/seed/saxophone/400/300',
    date: '2024-04-21',
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
    imageUrl: 'https://picsum.photos/seed/networking/400/300',
    date: '2024-04-18',
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
    imageUrl: 'https://picsum.photos/seed/artgallery/400/300',
    date: '2024-04-16',
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
    imageUrl: 'https://picsum.photos/seed/dancing/400/300',
    date: '2024-04-19',
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
    imageUrl: 'https://picsum.photos/seed/kayaking/400/300',
    date: '2024-04-20',
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
    date: '2024-04-16',
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
    imageUrl: 'https://picsum.photos/seed/microphone/400/300',
    date: '2024-04-21',
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
    title: 'After Dark Food Adventure',
    description: 'Guided late-night food tour through Houston\'s Montrose district. Four stops including food trucks, 24-hour joints, and hidden gems known only to locals.',
    category: 'Food & Drink',
    hostId: 'houston-food-crawls',
    hostName: 'Houston Food Crawls',
    hostType: 'business',
    hostVerified: true,
    imageUrl: 'https://picsum.photos/seed/food/400/300',
    date: '2024-04-22',
    time: '11:30 PM',
    location: {
      city: 'Houston',
      neighborhood: 'Montrose District',
      coordinates: {
        lat: 29.7342,
        lng: -95.3954,
      },
    },
    price: 35,
    ageGroup: '21+' as AgeGroup,
    attendeeIds: ['8', '4', '1', '7'], // 22 mock attendees (showing first 4)
    vibesTags: ['Late-night', 'Foodie', 'Local'],
    createdAt: '2024-03-09',
  },
  // Real Lexington, VA Events
  {
    id: '11',
    title: 'Natural Bridge State Park Adventure',
    description: 'Explore the massive 215-ft natural rock bridge with hiking trails and waterfall views. Perfect for photos and sunset watching.',
    category: 'Outdoors',
    hostId: 'natural-bridge-state-park',
    hostName: 'Natural Bridge State Park',
    hostType: 'business',
    hostVerified: true,
    imageUrl: 'https://picsum.photos/seed/bridge/400/300',
    date: '2024-04-23',
    time: '2:00 PM',
    location: {
      city: 'Lexington',
      neighborhood: '15-20 min south of Lexington',
      address: 'Natural Bridge State Park',
      coordinates: {
        lat: 37.6301,
        lng: -79.5467,
      },
    },
    price: 9,
    ageGroup: 'All ages' as AgeGroup,
    attendeeIds: ['7', '2', '1', '5', '3'],
    vibesTags: ['Scenic', 'Adventure', 'Photography'],
    createdAt: '2024-03-10',
  },
  {
    id: '12',
    title: 'Maury River Kayaking Adventure',
    description: 'Float down the scenic Maury River with stunning cliff views. Perfect for swimming, relaxation, and adventure. All equipment provided.',
    category: 'Outdoors',
    hostId: 'maury-river-outfitters',
    hostName: 'Maury River Outfitters',
    hostType: 'business',
    hostVerified: true,
    imageUrl: 'https://picsum.photos/seed/river/400/300',
    date: '2024-04-24',
    time: '10:00 AM',
    location: {
      city: 'Lexington',
      neighborhood: 'Goshen Pass area',
      address: 'Maury River Access Point',
      coordinates: {
        lat: 37.8104,
        lng: -79.3898,
      },
    },
    price: 35,
    studentPrice: 25,
    ageGroup: 'All ages' as AgeGroup,
    attendeeIds: ['1', '3', '5', '8'],
    vibesTags: ['Adventure', 'Water Sports', 'Scenic'],
    createdAt: '2024-03-11',
    hasStudentDiscount: true,
  },
  {
    id: '13',
    title: 'Lime Kiln Theater Concert Under the Stars',
    description: 'Outdoor concert at the unique hillside venue built into limestone cliffs. Live music under the stars in one of Virginia\'s most beautiful settings.',
    category: 'Music',
    hostId: 'lime-kiln-theater',
    hostName: 'Lime Kiln Theater',
    hostType: 'business',
    hostVerified: true,
    imageUrl: 'https://picsum.photos/seed/theater/400/300',
    date: '2024-04-25',
    time: '7:30 PM',
    location: {
      city: 'Lexington',
      neighborhood: 'Borden Road',
      address: '607 Borden Rd, Lexington, VA',
      coordinates: {
        lat: 37.7735,
        lng: -79.4512,
      },
    },
    price: 28,
    studentPrice: 20,
    ageGroup: 'All ages' as AgeGroup,
    attendeeIds: ['8', '1', '4', '5', '2', '3'],
    vibesTags: ['Live Music', 'Outdoor', 'Cultural'],
    createdAt: '2024-03-12',
    hasStudentDiscount: true,
    featured: true,
  },
  {
    id: '14',
    title: 'Retro Arcade Night at Tommy\'s',
    description: 'Classic arcade games and casual hangout spot in downtown Lexington. Perfect for groups looking for a fun, low-key night activity.',
    category: 'Gaming & Tech',
    hostId: 'tommys-arcade',
    hostName: 'Tommy\'s Arcade',
    hostType: 'business',
    hostVerified: true,
    imageUrl: 'https://picsum.photos/seed/arcade/400/300',
    date: '2024-04-26',
    time: '7:00 PM',
    location: {
      city: 'Lexington',
      neighborhood: 'Downtown',
      address: '5 W Nelson St, Lexington, VA',
      coordinates: {
        lat: 37.7844,
        lng: -79.4426,
      },
    },
    price: 10,
    ageGroup: 'All ages' as AgeGroup,
    attendeeIds: ['5', '1', '8', '3'],
    vibesTags: ['Retro', 'Social', 'Casual'],
    createdAt: '2024-03-13',
  },
  {
    id: '15',
    title: 'Haunting Tales Ghost Tour',
    description: 'Night walking tour through historic downtown Lexington featuring local history and ghost stories. Discover the spooky side of this historic town.',
    category: 'Arts & Culture',
    hostId: 'haunting-tales-lex',
    hostName: 'Haunting Tales Lexington',
    hostType: 'business',
    hostVerified: true,
    imageUrl: 'https://picsum.photos/seed/historic/400/300',
    date: '2024-04-27',
    time: '8:00 PM',
    location: {
      city: 'Lexington',
      neighborhood: 'Historic Downtown',
      address: 'Downtown Lexington Meeting Point',
      coordinates: {
        lat: 37.7844,
        lng: -79.4426,
      },
    },
    price: 18,
    studentPrice: 15,
    ageGroup: 'All ages' as AgeGroup,
    attendeeIds: ['3', '1', '5', '8', '2'],
    vibesTags: ['Spooky', 'Historic', 'Walking Tour'],
    createdAt: '2024-03-14',
    hasStudentDiscount: true,
  },
  {
    id: '16',
    title: 'Candlelit Date Night Experience',
    description: 'Intimate 5-course tasting menu with wine pairings and live acoustic music. Personalized service for couples celebrating special moments.',
    category: 'Date Night',
    hostId: 'whiskey-bar-kitchen',
    hostName: 'Whiskey Bar & Kitchen',
    hostType: 'business',
    hostVerified: true,
    imageUrl: 'https://picsum.photos/seed/candle/400/300',
    date: '2024-04-19',
    time: '7:30 PM',
    location: {
      city: 'New York',
      neighborhood: 'SoHo',
      address: '789 Romance St',
      coordinates: {
        lat: 40.7231,
        lng: -74.0021,
      },
    },
    price: 95,
    ageGroup: '21+' as AgeGroup,
    attendeeIds: ['1', '4', '6', '7'], // 18 mock attendees
    vibesTags: ['Romantic', 'Luxury', 'Intimate'],
    createdAt: '2024-03-12',
    featured: true,
  },
  {
    id: '17',
    title: 'Private Booth Karaoke Night',
    description: 'Premium karaoke experience with craft cocktails, private booths, and extensive song library. Party packages available until 2am.',
    category: 'Late Night',
    hostId: 'sing-sing-karaoke',
    hostName: 'Sing Sing Karaoke Lounge',
    hostType: 'business',
    hostVerified: true,
    imageUrl: 'https://picsum.photos/seed/karaoke/400/300',
    date: '2024-04-16',
    time: '10:00 PM',
    location: {
      city: 'Los Angeles',
      neighborhood: 'West Hollywood',
      address: '456 Night Owl Blvd',
      coordinates: {
        lat: 34.0902,
        lng: -118.3644,
      },
    },
    price: 35,
    happyHourPrice: 20,
    studentPrice: 25,
    ageGroup: '21+' as AgeGroup,
    attendeeIds: ['3', '2', '5', '8', '1', '4'], // 32 mock attendees
    vibesTags: ['Party', 'Social', 'Premium'],
    createdAt: '2024-03-08',
    hasHappyHour: true,
    hasStudentDiscount: true,
  },
  {
    id: '18',
    title: 'Oceanfront Bottomless Brunch',
    description: 'Instagrammable brunch with unlimited mimosas, fresh seafood, and live DJ. Beachside dining with panoramic ocean views.',
    category: 'Brunch & Chill',
    hostId: 'ocean-deck-miami',
    hostName: 'Ocean Deck Miami',
    hostType: 'business',
    hostVerified: true,
    imageUrl: 'https://picsum.photos/seed/brunch/400/300',
    date: '2024-04-17',
    time: '11:00 AM',
    location: {
      city: 'Miami',
      neighborhood: 'South Beach',
      address: '123 Brunch Ave',
      coordinates: {
        lat: 25.7907,
        lng: -80.1300,
      },
    },
    price: 45,
    ageGroup: '21+' as AgeGroup,
    attendeeIds: ['5', '1', '3', '6', '7', '2'], // 28 mock attendees
    vibesTags: ['Oceanview', 'Upscale', 'Social'],
    createdAt: '2024-03-11',
    featured: true,
  },
  {
    id: '19',
    title: 'Pottery Wheel & Wine Workshop',
    description: 'Create your own ceramic masterpiece with professional instruction and wine pairings. All materials included, plus kiln firing and pickup in 2 weeks.',
    category: 'Skills & Hobbies',
    hostId: 'clay-collective-austin',
    hostName: 'Clay Collective Austin',
    hostType: 'business',
    hostVerified: true,
    imageUrl: 'https://picsum.photos/seed/pottery/400/300',
    date: '2024-04-20',
    time: '6:00 PM',
    location: {
      city: 'Austin',
      neighborhood: 'East Austin',
      address: '321 Creative Lane',
      coordinates: {
        lat: 30.2615,
        lng: -97.7522,
      },
    },
    price: 65,
    ageGroup: 'All ages' as AgeGroup,
    attendeeIds: ['2', '4', '6', '1'], // 15 mock attendees
    vibesTags: ['Hands-on', 'Artistic', 'Social'],
    createdAt: '2024-03-09',
  },
  {
    id: '20',
    title: 'Board Game Tournament Night',
    description: 'Weekly board game tournament with 200+ games, craft beer, specialty coffee, and prizes. Expert game masters help you learn new games.',
    category: 'Gaming & Tech',
    hostId: 'dice-dojo-chicago',
    hostName: 'The Dice Dojo',
    hostType: 'business',
    hostVerified: true,
    imageUrl: 'https://picsum.photos/seed/boardgames/400/300',
    date: '2024-04-21',
    time: '7:00 PM',
    location: {
      city: 'Chicago',
      neighborhood: 'Lincoln Park',
      address: '654 Gamer St',
      coordinates: {
        lat: 41.9278,
        lng: -87.6366,
      },
    },
    price: 8,
    ageGroup: 'All ages' as AgeGroup,
    attendeeIds: ['4', '8', '2', '5', '3', '7', '1'], // 35 mock attendees
    vibesTags: ['Strategic', 'Social', 'Competitive'],
    createdAt: '2024-03-07',
  },
  {
    id: '21',
    title: 'Natural Bridge Illumination Show',
    description: 'Magical nighttime light show projected on the 215-ft natural rock bridge. A unique and spectacular evening experience.',
    category: 'Arts & Culture',
    hostId: 'natural-bridge-state-park',
    hostName: 'Natural Bridge State Park',
    hostType: 'business',
    hostVerified: true,
    imageUrl: 'https://picsum.photos/seed/lights/400/300',
    date: '2024-04-28',
    time: '8:30 PM',
    location: {
      city: 'Lexington',
      neighborhood: 'Natural Bridge',
      address: 'Natural Bridge State Park',
      coordinates: {
        lat: 37.6301,
        lng: -79.5467,
      },
    },
    price: 12,
    studentPrice: 10,
    ageGroup: 'All ages' as AgeGroup,
    attendeeIds: ['2', '4', '6', '1'],
    vibesTags: ['Spectacular', 'Nighttime', 'Unique'],
    createdAt: '2024-03-15',
    hasStudentDiscount: true,
    featured: true,
  },
  {
    id: '22',
    title: 'Boxerwood Gardens Nature Walk',
    description: 'Peaceful walking trails through beautiful gardens and treehouses. Perfect for relaxation, journaling, or mindful walking.',
    category: 'Wellness',
    hostId: 'boxerwood-gardens',
    hostName: 'Boxerwood Gardens',
    hostType: 'business',
    hostVerified: true,
    imageUrl: 'https://picsum.photos/seed/garden/400/300',
    date: '2024-04-29',
    time: '2:00 PM',
    location: {
      city: 'Lexington',
      neighborhood: 'Ross Road',
      address: '963 Ross Rd, Lexington, VA',
      coordinates: {
        lat: 37.7892,
        lng: -79.4654,
      },
    },
    price: null, // Free (donations encouraged)
    ageGroup: 'All ages' as AgeGroup,
    attendeeIds: ['3', '5', '7'],
    vibesTags: ['Peaceful', 'Nature', 'Mindful'],
    createdAt: '2024-03-16',
  },
  {
    id: '23',
    title: 'Virginia Safari Park Drive-Through Adventure',
    description: 'Drive-through safari experience where you can feed animals from your car. One of the most fun group activities near Lexington.',
    category: 'Outdoors',
    hostId: 'virginia-safari-park',
    hostName: 'Virginia Safari Park',
    hostType: 'business',
    hostVerified: true,
    imageUrl: 'https://picsum.photos/seed/animals/400/300',
    date: '2024-04-30',
    time: '11:00 AM',
    location: {
      city: 'Lexington',
      neighborhood: 'Natural Bridge',
      address: '229 Safari Ln, Natural Bridge, VA',
      coordinates: {
        lat: 37.6234,
        lng: -79.5398,
      },
    },
    price: 25,
    studentPrice: 20,
    ageGroup: 'All ages' as AgeGroup,
    attendeeIds: ['1', '2', '3', '4', '5', '6'],
    vibesTags: ['Animals', 'Adventure', 'Group Fun'],
    createdAt: '2024-03-17',
    hasStudentDiscount: true,
  },
  {
    id: '24',
    title: 'Chessie Nature Trail Bike Ride',
    description: '6-mile scenic trail ride along the Maury River following an old railroad line. Beautiful views and perfect for all skill levels.',
    category: 'Fitness',
    hostId: 'chessie-trail-outfitters',
    hostName: 'Chessie Trail Bike Rentals',
    hostType: 'business',
    hostVerified: true,
    imageUrl: 'https://picsum.photos/seed/bicycle/400/300',
    date: '2024-05-01',
    time: '10:00 AM',
    location: {
      city: 'Lexington',
      neighborhood: 'Old Buena Vista Road',
      address: 'Chessie Nature Trail Trailhead',
      coordinates: {
        lat: 37.7789,
        lng: -79.4203,
      },
    },
    price: 15, // Bike rental
    ageGroup: 'All ages' as AgeGroup,
    attendeeIds: ['2', '7', '4'],
    vibesTags: ['Scenic', 'Active', 'River Views'],
    createdAt: '2024-03-18',
  },
  {
    id: '25',
    title: 'Historic Downtown Carriage Tour',
    description: 'Unique horse-drawn carriage tour through historic Lexington. Learn local history while enjoying a charming ride through town.',
    category: 'Arts & Culture',
    hostId: 'lexington-carriage-company',
    hostName: 'Lexington Carriage Company',
    hostType: 'business',
    hostVerified: true,
    imageUrl: 'https://picsum.photos/seed/horse/400/300',
    date: '2024-05-02',
    time: '3:00 PM',
    location: {
      city: 'Lexington',
      neighborhood: 'Historic Downtown',
      address: 'Downtown Lexington Departure Point',
      coordinates: {
        lat: 37.7844,
        lng: -79.4426,
      },
    },
    price: 25,
    studentPrice: 20,
    ageGroup: 'All ages' as AgeGroup,
    attendeeIds: ['1', '3', '8'],
    vibesTags: ['Historic', 'Unique', 'Charming'],
    createdAt: '2024-03-19',
    hasStudentDiscount: true,
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

// Get personalized event recommendations based on user interests and friend activity
export const getPersonalizedEvents = (userId: string): Event[] => {
  const user = getUserById(userId);
  if (!user) return [];

  const userInterests = user.interests || [];
  const userCity = user.city;
  const friendsGoing = getFriendsListForUser(userId);

  // Score events based on multiple factors
  const scoredEvents = mockEvents.map(event => {
    let score = 0;

    // Interest match (high weight)
    if (userInterests.includes(event.category)) {
      score += 50;
    }

    // Location preference (medium weight)
    if (event.location.city === userCity) {
      score += 30;
    }

    // Friend social proof (high weight)
    const friendsAttending = friendsGoing.filter(friend =>
      friend.eventsAttending?.includes(event.id)
    );
    score += friendsAttending.length * 25;

    // Budget-friendly bonus for young adults
    if (event.price === null || event.hasHappyHour || event.hasStudentDiscount || (event.price && event.price < 25)) {
      score += 15;
    }

    // Recent events get slight boost
    const eventDate = new Date(event.createdAt);
    const daysSinceCreated = (Date.now() - eventDate.getTime()) / (1000 * 60 * 60 * 24);
    if (daysSinceCreated < 7) {
      score += 10;
    }

    // Young adult friendly categories get extra boost
    const youngAdultCategories = ['Date Night', 'Late Night', 'Brunch & Chill', 'Skills & Hobbies', 'Gaming & Tech'];
    if (youngAdultCategories.includes(event.category)) {
      score += 20;
    }

    return { event, score };
  });

  // Sort by score and return top events
  return scoredEvents
    .sort((a, b) => b.score - a.score)
    .slice(0, 8)
    .map(item => item.event);
};

// Get trending events based on recent popularity and RSVP velocity
export const getTrendingEvents = (): Event[] => {
  const now = new Date();

  const trendingEvents = mockEvents.map(event => {
    let trendScore = 0;

    // Base popularity from attendee count
    trendScore += event.attendeeIds.length * 5;

    // Recent creation bonus (events created in last 3 days)
    const eventDate = new Date(event.createdAt);
    const daysSinceCreated = (now.getTime() - eventDate.getTime()) / (1000 * 60 * 60 * 24);
    if (daysSinceCreated <= 3) {
      trendScore += 50;
    } else if (daysSinceCreated <= 7) {
      trendScore += 25;
    }

    // Young adult categories get trending boost
    const trendyCategories = ['Late Night', 'Brunch & Chill', 'Gaming & Tech', 'Date Night'];
    if (trendyCategories.includes(event.category)) {
      trendScore += 30;
    }

    // Events happening soon get boost
    const eventDateTime = new Date(`${event.date} ${event.time}`);
    const hoursUntilEvent = (eventDateTime.getTime() - now.getTime()) / (1000 * 60 * 60);
    if (hoursUntilEvent > 0 && hoursUntilEvent <= 48) {
      trendScore += 40;
    }

    // Budget-friendly events are more likely to trend
    if (event.price === null || event.hasHappyHour || event.hasStudentDiscount || (event.price && event.price < 30)) {
      trendScore += 20;
    }

    return { event, trendScore };
  });

  return trendingEvents
    .sort((a, b) => b.trendScore - a.trendScore)
    .slice(0, 6)
    .map(item => item.event);
};

// Add new event to mock data (for demo purposes - in real app would be API call)
export const addNewEvent = (eventData: Omit<Event, 'id' | 'createdAt' | 'attendeeIds'>): Event => {
  const newEvent: Event = {
    ...eventData,
    id: `${mockEvents.length + 1}`,
    createdAt: new Date().toISOString().split('T')[0],
    attendeeIds: [], // Start with no attendees
  };

  mockEvents.unshift(newEvent); // Add to beginning of array for recent events
  return newEvent;
};

// Mock Event Stories - Recent stories from events (expire after 24 hours)
export const mockEventStories: EventStory[] = [
  {
    id: 'story_1',
    eventId: '1',
    userId: '1',
    type: 'image',
    mediaUrl: 'https://picsum.photos/seed/story1/400/600',
    caption: 'Amazing wine selection! 🍷',
    timestamp: '2024-04-18T19:30:00Z',
    expiresAt: '2024-04-19T19:30:00Z',
    views: ['current', '2', '3', '4'],
  },
  {
    id: 'story_2',
    eventId: '1',
    userId: '3',
    type: 'image',
    mediaUrl: 'https://picsum.photos/seed/story2/400/600',
    caption: 'The rooftop views are incredible! 🌆',
    timestamp: '2024-03-18T20:15:00Z',
    expiresAt: '2024-03-19T20:15:00Z',
    views: ['current', '1', '2', '5'],
  },
  {
    id: 'story_3',
    eventId: '3',
    userId: '2',
    type: 'image',
    mediaUrl: 'https://picsum.photos/seed/story3/400/600',
    caption: 'Live jazz hitting different tonight 🎷',
    timestamp: '2024-03-18T21:00:00Z',
    expiresAt: '2024-03-19T21:00:00Z',
    views: ['current', '1', '3'],
  },
  {
    id: 'story_4',
    eventId: '5',
    userId: '4',
    type: 'image',
    mediaUrl: 'https://picsum.photos/seed/story4/400/600',
    caption: 'Perfect date night spot 💕',
    timestamp: '2024-03-18T20:45:00Z',
    expiresAt: '2024-03-19T20:45:00Z',
    views: ['current', '2', '6'],
  },
  {
    id: 'story_5',
    eventId: '8',
    userId: '5',
    type: 'image',
    mediaUrl: 'https://picsum.photos/seed/story5/400/600',
    caption: 'Tech meetup vibes! 💻',
    timestamp: '2024-03-18T18:20:00Z',
    expiresAt: '2024-03-19T18:20:00Z',
    views: ['current', '1', '3', '7', '8'],
  },
];

// Mock Event Highlights - Permanent collections of stories
export const mockEventHighlights: EventHighlight[] = [
  {
    id: 'highlight_1',
    eventId: '1',
    title: 'Wine Night',
    coverImage: 'https://picsum.photos/seed/highlight1/150/150',
    stories: [
      {
        id: 'highlight_story_1',
        eventId: '1',
        userId: '1',
        type: 'image',
        mediaUrl: 'https://picsum.photos/seed/h1s1/400/600',
        caption: 'Setting up for tonight!',
        timestamp: '2024-03-15T17:00:00Z',
        expiresAt: '2024-03-16T17:00:00Z',
        views: ['current', '2', '3', '4', '5'],
      },
      {
        id: 'highlight_story_2',
        eventId: '1',
        userId: '3',
        type: 'image',
        mediaUrl: 'https://picsum.photos/seed/h1s2/400/600',
        caption: 'Cheers to new friends! 🥂',
        timestamp: '2024-03-15T19:45:00Z',
        expiresAt: '2024-03-16T19:45:00Z',
        views: ['current', '1', '2', '4', '6'],
      },
    ],
    createdAt: '2024-03-15T17:00:00Z',
  },
  {
    id: 'highlight_2',
    eventId: '3',
    title: 'Jazz Vibes',
    coverImage: 'https://picsum.photos/seed/highlight2/150/150',
    stories: [
      {
        id: 'highlight_story_3',
        eventId: '3',
        userId: '2',
        type: 'image',
        mediaUrl: 'https://picsum.photos/seed/h2s1/400/600',
        caption: 'The band is setting up 🎵',
        timestamp: '2024-03-14T19:00:00Z',
        expiresAt: '2024-03-15T19:00:00Z',
        views: ['current', '1', '3', '5'],
      },
    ],
    createdAt: '2024-03-14T19:00:00Z',
  },
];

// Event Stories Helper Functions
export const getActiveEventStories = (): EventStory[] => {
  const now = new Date();
  return mockEventStories.filter(story => new Date(story.expiresAt) > now);
};

export const getEventStoriesGrouped = (): { [eventId: string]: EventStory[] } => {
  const activeStories = getActiveEventStories();
  return activeStories.reduce((groups, story) => {
    if (!groups[story.eventId]) {
      groups[story.eventId] = [];
    }
    groups[story.eventId].push(story);
    return groups;
  }, {} as { [eventId: string]: EventStory[] });
};

export const getEventHighlights = (eventId: string): EventHighlight[] => {
  return mockEventHighlights.filter(highlight => highlight.eventId === eventId);
};

export const getAllEventHighlights = (): EventHighlight[] => {
  return mockEventHighlights.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
};

export const getEventsWithActiveStories = (): Event[] => {
  const storiesGrouped = getEventStoriesGrouped();
  const eventIds = Object.keys(storiesGrouped);
  return mockEvents.filter(event => eventIds.includes(event.id));
};

// Mock Group Chats - Event-specific group chats
export const mockGroupChats: GroupChat[] = [
  {
    id: 'group_1',
    eventId: '1',
    name: 'Wine Night Squad',
    description: 'Group for tonight\'s rooftop wine tasting! 🍷',
    memberIds: ['current', '1', '3', '4', '5'],
    adminIds: ['1'], // Event host is admin
    createdAt: '2024-03-18T15:00:00Z',
    lastActivity: '2024-03-18T19:45:00Z',
    isPublic: true,
    maxMembers: 20,
  },
  {
    id: 'group_2',
    eventId: '1',
    name: 'First Timers Club',
    description: 'New to wine tasting? Join us for tips and chatting!',
    memberIds: ['current', '6', '7', '8'],
    adminIds: ['6'],
    createdAt: '2024-03-18T16:30:00Z',
    lastActivity: '2024-03-18T18:20:00Z',
    isPublic: true,
    maxMembers: 10,
  },
  {
    id: 'group_3',
    eventId: '3',
    name: 'Jazz Lovers Unite',
    description: 'For the jazz enthusiasts attending Saturday night!',
    memberIds: ['current', '2', '3', '7'],
    adminIds: ['2', '3'],
    createdAt: '2024-03-18T12:00:00Z',
    lastActivity: '2024-03-18T17:30:00Z',
    isPublic: true,
    maxMembers: 15,
  },
  {
    id: 'group_4',
    eventId: '5',
    name: 'Date Night Crew',
    description: 'Couples and friends looking for a fun evening!',
    memberIds: ['current', '4', '5', '6'],
    adminIds: ['4'],
    createdAt: '2024-03-18T14:15:00Z',
    lastActivity: '2024-03-18T16:00:00Z',
    isPublic: false, // Private group
    maxMembers: 8,
  },
];

// Mock Group Messages
export const mockGroupMessages: GroupMessage[] = [
  // Wine Night Squad messages
  {
    id: 'gmsg_1',
    groupChatId: 'group_1',
    senderId: '1',
    content: 'Hey everyone! So excited for tonight! 🍷✨',
    type: 'text',
    timestamp: '2024-03-18T19:45:00Z',
  },
  {
    id: 'gmsg_2',
    groupChatId: 'group_1',
    senderId: '3',
    content: 'Same! Should we meet up beforehand? I know a great spot nearby',
    type: 'text',
    timestamp: '2024-03-18T19:46:30Z',
  },
  {
    id: 'gmsg_3',
    groupChatId: 'group_1',
    senderId: 'current',
    content: 'That sounds perfect! What time were you thinking?',
    type: 'text',
    timestamp: '2024-03-18T19:47:15Z',
  },
  {
    id: 'gmsg_4',
    groupChatId: 'group_1',
    senderId: '4',
    content: 'I can be there by 6:30! Can\'t wait to try those wines',
    type: 'text',
    timestamp: '2024-03-18T19:48:00Z',
  },

  // First Timers Club messages
  {
    id: 'gmsg_5',
    groupChatId: 'group_2',
    senderId: '6',
    content: 'Welcome first-timers! Any questions about wine tasting?',
    type: 'text',
    timestamp: '2024-03-18T18:20:00Z',
  },
  {
    id: 'gmsg_6',
    groupChatId: 'group_2',
    senderId: '7',
    content: 'I\'ve never been to one before! Any tips?',
    type: 'text',
    timestamp: '2024-03-18T18:21:30Z',
  },
  {
    id: 'gmsg_7',
    groupChatId: 'group_2',
    senderId: 'current',
    content: 'Same here! Super nervous but excited 😅',
    type: 'text',
    timestamp: '2024-03-18T18:22:00Z',
  },

  // Jazz Lovers messages
  {
    id: 'gmsg_8',
    groupChatId: 'group_3',
    senderId: '2',
    content: 'Saturday\'s lineup looks amazing! Anyone know the opening act?',
    type: 'text',
    timestamp: '2024-03-18T17:30:00Z',
  },
  {
    id: 'gmsg_9',
    groupChatId: 'group_3',
    senderId: '3',
    content: 'Yeah! It\'s a local quartet - they\'re incredible live 🎷',
    type: 'text',
    timestamp: '2024-03-18T17:31:45Z',
  },
];

// Group Chat Helper Functions
export const getGroupChatsForEvent = (eventId: string): GroupChat[] => {
  return mockGroupChats.filter(chat => chat.eventId === eventId);
};

export const getPublicGroupChatsForEvent = (eventId: string): GroupChat[] => {
  return mockGroupChats.filter(chat => chat.eventId === eventId && chat.isPublic);
};

export const getUserGroupChats = (userId: string): GroupChat[] => {
  return mockGroupChats.filter(chat => chat.memberIds.includes(userId))
    .sort((a, b) => new Date(b.lastActivity).getTime() - new Date(a.lastActivity).getTime());
};

export const getGroupMessages = (groupChatId: string): GroupMessage[] => {
  return mockGroupMessages
    .filter(msg => msg.groupChatId === groupChatId)
    .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
};

export const getGroupChatById = (groupChatId: string): GroupChat | undefined => {
  return mockGroupChats.find(chat => chat.id === groupChatId);
};

export const canUserJoinGroupChat = (groupChatId: string, userId: string): boolean => {
  const chat = getGroupChatById(groupChatId);
  if (!chat) return false;

  // Already a member
  if (chat.memberIds.includes(userId)) return false;

  // Check if at max capacity
  if (chat.maxMembers && chat.memberIds.length >= chat.maxMembers) return false;

  // Must be public or invited
  return chat.isPublic;
};

// Friend Suggestions Helper Functions
export const getPeopleYouMayKnow = (userId: string): User[] => {
  const user = getUserById(userId);
  if (!user) return [];

  const currentFollowing = user.following || [];
  const currentFollowers = user.followers || [];
  const userInterests = user.interests || [];
  const userCity = user.city;

  // Get all users except current user and already connected
  const candidates = mockUsers.filter(candidate =>
    candidate.id !== userId &&
    !currentFollowing.includes(candidate.id) &&
    !currentFollowers.includes(candidate.id)
  );

  // Score potential friends based on multiple factors
  const scoredCandidates = candidates.map(candidate => {
    let score = 0;

    // Same city = +30 points
    if (candidate.city === userCity) {
      score += 30;
    }

    // Shared interests = +15 points per shared interest
    const sharedInterests = candidate.interests.filter(interest =>
      userInterests.includes(interest)
    );
    score += sharedInterests.length * 15;

    // Mutual friends = +25 points per mutual friend
    const userFriends = new Set([...currentFollowing, ...currentFollowers]);
    const candidateFriends = new Set([...candidate.following, ...candidate.followers]);
    const mutualFriends = [...userFriends].filter(friendId => candidateFriends.has(friendId));
    score += mutualFriends.length * 25;

    // Attending same events = +20 points per shared event
    const userEvents = new Set(user.eventsAttending || []);
    const candidateEvents = new Set(candidate.eventsAttending || []);
    const sharedEvents = [...userEvents].filter(eventId => candidateEvents.has(eventId));
    score += sharedEvents.length * 20;

    // Age similarity (within 5 years) = +10 points
    const ageDifference = Math.abs(user.age - candidate.age);
    if (ageDifference <= 5) {
      score += 10;
    }

    // Active user (hosting or attending events) = +5 points
    if (candidate.eventsHosted.length > 0 || candidate.eventsAttending.length > 2) {
      score += 5;
    }

    const mutualFriendUsers = mutualFriends.map(id => getUserById(id)).filter(Boolean);
    const sharedEventObjects = sharedEvents.map(id => getEventById(id)).filter(Boolean);

    return {
      user: candidate,
      score,
      sharedInterests,
      mutualFriends: mutualFriendUsers,
      sharedEvents: sharedEventObjects,
      reasonsToConnect: calculateConnectionReasons(candidate, user, sharedInterests, mutualFriendUsers, sharedEventObjects)
    };
  });

  // Sort by score (highest first) and return top 8 suggestions
  return scoredCandidates
    .sort((a, b) => b.score - a.score)
    .slice(0, 8)
    .map(item => ({
      ...item.user,
      suggestionReasons: item.reasonsToConnect
    }));
};

const calculateConnectionReasons = (
  candidate: User,
  currentUser: User,
  sharedInterests: string[],
  mutualFriends: (User | undefined)[],
  sharedEvents: (Event | undefined)[]
): string[] => {
  const reasons: string[] = [];

  if (candidate.city === currentUser.city) {
    reasons.push(`Lives in ${candidate.city}`);
  }

  if (sharedInterests.length > 0) {
    if (sharedInterests.length === 1) {
      reasons.push(`Interested in ${sharedInterests[0]}`);
    } else {
      reasons.push(`${sharedInterests.length} shared interests`);
    }
  }

  if (mutualFriends.length > 0) {
    if (mutualFriends.length === 1) {
      reasons.push(`Mutual friend: ${mutualFriends[0]?.name}`);
    } else {
      reasons.push(`${mutualFriends.length} mutual friends`);
    }
  }

  if (sharedEvents.length > 0) {
    if (sharedEvents.length === 1) {
      reasons.push(`Going to ${sharedEvents[0]?.title}`);
    } else {
      reasons.push(`${sharedEvents.length} shared events`);
    }
  }

  if (candidate.eventsHosted.length > 0) {
    reasons.push(`Event organizer`);
  }

  return reasons.slice(0, 2); // Limit to top 2 most relevant reasons
};

// Mock Event Check-ins
export const mockEventCheckIns: EventCheckIn[] = [
  {
    id: 'checkin_1',
    eventId: '1',
    userId: '1',
    timestamp: '2024-03-18T19:35:00Z',
    location: { lat: 40.7589, lng: -73.9851 },
    photo: 'https://picsum.photos/seed/checkin1/400/400',
    caption: 'Ready for some amazing wines! 🍷✨',
    verified: true,
  },
  {
    id: 'checkin_2',
    eventId: '1',
    userId: '3',
    timestamp: '2024-03-18T19:42:00Z',
    location: { lat: 40.7589, lng: -73.9851 },
    caption: 'The rooftop view is incredible!',
    verified: true,
  },
  {
    id: 'checkin_3',
    eventId: '1',
    userId: 'current',
    timestamp: '2024-03-18T19:50:00Z',
    location: { lat: 40.7589, lng: -73.9851 },
    photo: 'https://picsum.photos/seed/checkin3/400/400',
    caption: 'First wine tasting event - so excited!',
    verified: true,
  },
  {
    id: 'checkin_4',
    eventId: '3',
    userId: '2',
    timestamp: '2024-03-18T20:15:00Z',
    location: { lat: 30.2672, lng: -97.7431 },
    caption: 'Jazz night is starting! 🎷',
    verified: true,
  },
  {
    id: 'checkin_5',
    eventId: '5',
    userId: '4',
    timestamp: '2024-03-18T18:30:00Z',
    location: { lat: 25.7617, lng: -80.1918 },
    photo: 'https://picsum.photos/seed/checkin5/400/400',
    caption: 'Perfect date night spot with my partner ❤️',
    verified: true,
  },
];

// Check-in Helper Functions
export const getEventCheckIns = (eventId: string): EventCheckIn[] => {
  return mockEventCheckIns
    .filter(checkIn => checkIn.eventId === eventId)
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
};

export const getUserCheckIns = (userId: string): EventCheckIn[] => {
  return mockEventCheckIns
    .filter(checkIn => checkIn.userId === userId)
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
};

export const getRecentCheckIns = (limit: number = 10): EventCheckIn[] => {
  return mockEventCheckIns
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, limit);
};

export const hasUserCheckedInToEvent = (eventId: string, userId: string): boolean => {
  return mockEventCheckIns.some(
    checkIn => checkIn.eventId === eventId && checkIn.userId === userId
  );
};

export const getCheckInCount = (eventId: string): number => {
  return mockEventCheckIns.filter(checkIn => checkIn.eventId === eventId).length;
};

export const getFriendsCheckedInToEvent = (eventId: string, userId: string): EventCheckIn[] => {
  const user = getUserById(userId);
  if (!user) return [];

  const friends = user.following || [];
  return mockEventCheckIns.filter(
    checkIn => checkIn.eventId === eventId && friends.includes(checkIn.userId)
  );
};

// Mock Clubs - Private interest-based groups
export const mockClubs: Club[] = [
  {
    id: 'club_1',
    name: 'NYC Morning Runners Club',
    description: 'Early birds who love to start the day with a run through Central Park. All fitness levels welcome!',
    category: 'Fitness',
    city: 'New York',
    memberIds: ['current', '2', '4', '7', '1'],
    adminIds: ['2'],
    memberCount: 127,
    maxMembers: 200,
    isPrivate: true,
    activityLevel: 'High',
    coverImage: 'https://picsum.photos/seed/runclub/400/300',
    createdAt: '2024-01-15',
    lastActivity: '2024-03-18T08:00:00Z',
    tags: ['Running', 'Early Morning', 'Central Park', 'Fitness'],
    requirements: 'Must commit to 2+ runs per week'
  },
  {
    id: 'club_2',
    name: 'Brooklyn Art Collective',
    description: 'Creative community exploring galleries, hosting studio visits, and organizing pop-up exhibitions.',
    category: 'Arts & Culture',
    city: 'New York',
    memberIds: ['current', '1', '3', '5', '8'],
    adminIds: ['1', '5'],
    memberCount: 89,
    maxMembers: 150,
    isPrivate: true,
    activityLevel: 'Medium',
    coverImage: 'https://picsum.photos/seed/artcollective/400/300',
    createdAt: '2024-02-01',
    lastActivity: '2024-03-17T19:30:00Z',
    tags: ['Art', 'Galleries', 'Creative', 'Brooklyn']
  },
  {
    id: 'club_3',
    name: 'DC Volleyball League',
    description: 'Competitive volleyball league with weekly games and tournaments. Indoor and beach volleyball options.',
    category: 'Sports',
    city: 'Washington DC',
    memberIds: ['7', '2', '4'],
    adminIds: ['7'],
    memberCount: 156,
    maxMembers: 200,
    isPrivate: true,
    activityLevel: 'High',
    coverImage: 'https://picsum.photos/seed/volleyball/400/300',
    createdAt: '2024-01-20',
    lastActivity: '2024-03-18T18:00:00Z',
    tags: ['Volleyball', 'Sports', 'Competitive', 'Team'],
    requirements: 'Intermediate skill level required'
  },
  {
    id: 'club_4',
    name: 'Miami Food & Wine Society',
    description: 'Exclusive dining experiences, wine tastings, and chef collaborations across South Beach and beyond.',
    category: 'Food & Drink',
    city: 'Miami',
    memberIds: ['6', '1', '3'],
    adminIds: ['6'],
    memberCount: 73,
    maxMembers: 100,
    isPrivate: true,
    activityLevel: 'Medium',
    coverImage: 'https://picsum.photos/seed/foodwine/400/300',
    createdAt: '2024-02-10',
    lastActivity: '2024-03-16T20:15:00Z',
    tags: ['Fine Dining', 'Wine', 'Exclusive', 'Culinary']
  },
  {
    id: 'club_5',
    name: 'Chicago Tech Founders Circle',
    description: 'Intimate network of startup founders and tech entrepreneurs. Monthly dinners, pitch practice, and mentorship.',
    category: 'Networking',
    city: 'Chicago',
    memberIds: ['4', '2', '8'],
    adminIds: ['4'],
    memberCount: 52,
    maxMembers: 75,
    isPrivate: true,
    activityLevel: 'Medium',
    coverImage: 'https://picsum.photos/seed/techfounders/400/300',
    createdAt: '2024-01-25',
    lastActivity: '2024-03-17T18:30:00Z',
    tags: ['Startups', 'Founders', 'Tech', 'Mentorship'],
    requirements: 'Must be founder/co-founder of a company'
  }
];

// Club Helper Functions
export const getClubById = (id: string): Club | undefined => {
  return mockClubs.find(club => club.id === id);
};

export const getClubsByCity = (cityName: string): Club[] => {
  return mockClubs.filter(club => club.city === cityName);
};

export const getClubsByCategory = (category: EventCategory): Club[] => {
  return mockClubs.filter(club => club.category === category);
};

export const getUserClubs = (userId: string): Club[] => {
  return mockClubs.filter(club => club.memberIds.includes(userId));
};

export const getClubsUserCanJoin = (userId: string, cityName: string): Club[] => {
  return mockClubs.filter(club =>
    club.city === cityName &&
    !club.memberIds.includes(userId) &&
    (!club.maxMembers || club.memberCount < club.maxMembers)
  );
};

export const isUserClubMember = (clubId: string, userId: string): boolean => {
  const club = getClubById(clubId);
  return club ? club.memberIds.includes(userId) : false;
};

export const isUserClubAdmin = (clubId: string, userId: string): boolean => {
  const club = getClubById(clubId);
  return club ? club.adminIds.includes(userId) : false;
};

// Club Events - Only visible to club members
export const mockClubEvents: Event[] = [
  {
    id: 'club_event_1',
    title: 'Morning Runners Weekly 5K',
    description: 'Our weekly group 5K run through Central Park. Coffee and stretching session afterward.',
    category: 'Fitness',
    hostId: 'club_1',
    hostName: 'NYC Morning Runners Club',
    hostType: 'business',
    hostVerified: true,
    clubId: 'club_1',
    imageUrl: 'https://picsum.photos/seed/running/400/300',
    date: '2024-04-23',
    time: '7:00 AM',
    location: {
      city: 'New York',
      neighborhood: 'Central Park',
      address: 'Central Park Bandshell',
      coordinates: {
        lat: 40.7689,
        lng: -73.9760,
      },
    },
    price: null,
    ageGroup: 'All ages' as AgeGroup,
    attendeeIds: ['current', '2', '4', '7'], // Only club members
    vibesTags: ['Members Only', 'Morning', 'Regular'],
    createdAt: '2024-03-15',
  },
  {
    id: 'club_event_2',
    title: 'Private Gallery Opening - Emerging Artists',
    description: 'Exclusive preview of new contemporary works before public opening. Wine and artist meet-and-greet.',
    category: 'Arts & Culture',
    hostId: 'club_2',
    hostName: 'Brooklyn Art Collective',
    hostType: 'business',
    hostVerified: true,
    clubId: 'club_2',
    imageUrl: 'https://picsum.photos/seed/artgallery/400/300',
    date: '2024-04-24',
    time: '6:00 PM',
    location: {
      city: 'New York',
      neighborhood: 'Brooklyn',
      address: 'Collective Art Space',
      coordinates: {
        lat: 40.6782,
        lng: -73.9442,
      },
    },
    price: null,
    ageGroup: '21+' as AgeGroup,
    attendeeIds: ['current', '1', '3', '5'], // Only club members
    vibesTags: ['Members Only', 'Exclusive', 'Preview'],
    createdAt: '2024-03-16',
    featured: true,
  }
];

export const getClubEvents = (clubId: string): Event[] => {
  return mockClubEvents.filter(event => event.clubId === clubId);
};

export const getAllClubEvents = (): Event[] => {
  return mockClubEvents;
};

export const getClubEventsForUser = (userId: string): Event[] => {
  const userClubs = getUserClubs(userId);
  const userClubIds = userClubs.map(club => club.id);
  return mockClubEvents.filter(event => event.clubId && userClubIds.includes(event.clubId));
};