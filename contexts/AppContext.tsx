'use client';

import { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { Event, User } from '@/lib/types';
import { currentUser, getFriendsListForUser, getFriendsAttendingEvent, getCurrentUserWithUpdatedRSVPs, addNewEvent } from '@/lib/mockData';

// State types
interface AppState {
  currentUser: User | null;
  userRSVPs: Set<string>; // Event IDs user has RSVP'd to
  savedEvents: Set<string>; // Bookmarked event IDs
  selectedCity: string;
  userLocation: {
    latitude: number;
    longitude: number;
  } | null;
  nearMeEnabled: boolean;
  isLoading: boolean;
  isMapView: boolean;
  searchQuery: string;
}

// Action types
type AppAction =
  | { type: 'SET_CURRENT_USER'; user: User }
  | { type: 'TOGGLE_RSVP'; eventId: string }
  | { type: 'TOGGLE_SAVED_EVENT'; eventId: string }
  | { type: 'SET_CITY'; city: string }
  | { type: 'SET_USER_LOCATION'; location: { latitude: number; longitude: number } }
  | { type: 'TOGGLE_NEAR_ME'; enabled: boolean }
  | { type: 'SET_LOADING'; loading: boolean }
  | { type: 'SET_MAP_VIEW'; isMapView: boolean }
  | { type: 'SET_SEARCH_QUERY'; query: string }
  | { type: 'LOAD_SAVED_STATE' }
  | { type: 'ADD_NEW_EVENT'; event: Event };

// Initial state
const initialState: AppState = {
  currentUser: currentUser, // Set current user from mockData
  userRSVPs: new Set(),
  savedEvents: new Set(),
  selectedCity: 'New York',
  userLocation: null,
  nearMeEnabled: false,
  isLoading: false,
  isMapView: false,
  searchQuery: '',
};

// Reducer
function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_CURRENT_USER':
      return { ...state, currentUser: action.user };

    case 'TOGGLE_RSVP': {
      const newRSVPs = new Set(state.userRSVPs);
      if (newRSVPs.has(action.eventId)) {
        newRSVPs.delete(action.eventId);
      } else {
        newRSVPs.add(action.eventId);
      }
      return { ...state, userRSVPs: newRSVPs };
    }

    case 'TOGGLE_SAVED_EVENT': {
      const newSaved = new Set(state.savedEvents);
      if (newSaved.has(action.eventId)) {
        newSaved.delete(action.eventId);
      } else {
        newSaved.add(action.eventId);
      }
      return { ...state, savedEvents: newSaved };
    }

    case 'SET_CITY':
      return { ...state, selectedCity: action.city, searchQuery: '' }; // Clear search when city changes

    case 'SET_USER_LOCATION':
      return { ...state, userLocation: action.location };

    case 'TOGGLE_NEAR_ME':
      return { ...state, nearMeEnabled: action.enabled };

    case 'SET_LOADING':
      return { ...state, isLoading: action.loading };

    case 'SET_MAP_VIEW':
      return { ...state, isMapView: action.isMapView };

    case 'SET_SEARCH_QUERY':
      return { ...state, searchQuery: action.query };

    case 'LOAD_SAVED_STATE': {
      // Load from localStorage
      const savedRSVPs = localStorage.getItem('gaggle_rsvps');
      const savedBookmarks = localStorage.getItem('gaggle_bookmarks');
      const savedCity = localStorage.getItem('gaggle_city');

      return {
        ...state,
        userRSVPs: savedRSVPs ? new Set(JSON.parse(savedRSVPs)) : new Set(),
        savedEvents: savedBookmarks ? new Set(JSON.parse(savedBookmarks)) : new Set(),
        selectedCity: savedCity || state.selectedCity,
      };
    }

    case 'ADD_NEW_EVENT': {
      // The event is already added to mockEvents by the addNewEvent function
      // This action can be used to trigger UI updates if needed
      return state;
    }

    default:
      return state;
  }
}

// Context
const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  toggleRSVP: (eventId: string) => void;
  toggleSavedEvent: (eventId: string) => void;
  setCity: (city: string) => void;
  setUserLocation: (location: { latitude: number; longitude: number }) => void;
  toggleNearMe: (enabled: boolean) => void;
  toggleMapView: () => void;
  setSearchQuery: (query: string) => void;
  isUserRSVP: (eventId: string) => boolean;
  isEventSaved: (eventId: string) => boolean;
  getRSVPCount: (event: Event) => number;
  getUsersRSVPForEvent: (event: Event) => User[];
  getFriendsRSVPForEvent: (event: Event) => User[];
  getCurrentUserFriends: () => User[];
  getFriendsGoingToEvent: (eventId: string) => User[];
  addEvent: (eventData: Omit<Event, 'id' | 'createdAt' | 'attendeeIds'>) => Event;
} | null>(null);

// Provider component
export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Load saved state on mount
  useEffect(() => {
    dispatch({ type: 'LOAD_SAVED_STATE' });
  }, []);

  // Save state to localStorage when it changes
  useEffect(() => {
    if (state.userRSVPs.size > 0) {
      localStorage.setItem('gaggle_rsvps', JSON.stringify([...state.userRSVPs]));
    }
  }, [state.userRSVPs]);

  useEffect(() => {
    if (state.savedEvents.size > 0) {
      localStorage.setItem('gaggle_bookmarks', JSON.stringify([...state.savedEvents]));
    }
  }, [state.savedEvents]);

  useEffect(() => {
    localStorage.setItem('gaggle_city', state.selectedCity);
  }, [state.selectedCity]);

  // Helper functions
  const toggleRSVP = (eventId: string) => {
    dispatch({ type: 'TOGGLE_RSVP', eventId });
  };

  const toggleSavedEvent = (eventId: string) => {
    dispatch({ type: 'TOGGLE_SAVED_EVENT', eventId });
  };

  const setCity = (city: string) => {
    dispatch({ type: 'SET_CITY', city });
  };

  const setUserLocation = (location: { latitude: number; longitude: number }) => {
    dispatch({ type: 'SET_USER_LOCATION', location });
  };

  const toggleNearMe = (enabled: boolean) => {
    dispatch({ type: 'TOGGLE_NEAR_ME', enabled });
  };

  const toggleMapView = () => {
    dispatch({ type: 'SET_MAP_VIEW', isMapView: !state.isMapView });
  };

  const setSearchQuery = (query: string) => {
    dispatch({ type: 'SET_SEARCH_QUERY', query });
  };

  const isUserRSVP = (eventId: string) => state.userRSVPs.has(eventId);

  const isEventSaved = (eventId: string) => state.savedEvents.has(eventId);

  const getRSVPCount = (event: Event) => {
    // Original attendee count plus user RSVP if applicable
    const originalCount = event.attendeeIds.length;
    const userRSVP = state.userRSVPs.has(event.id);
    const userInOriginal = state.currentUser ? event.attendeeIds.includes(state.currentUser.id) : false;

    if (userRSVP && !userInOriginal) {
      return originalCount + 1;
    } else if (!userRSVP && userInOriginal) {
      return originalCount - 1;
    }
    return originalCount;
  };

  const getUsersRSVPForEvent = (event: Event) => {
    // This would normally fetch from API - for now return empty array
    // In a real app, you'd maintain a mapping of eventId -> User[]
    return [];
  };

  const getFriendsRSVPForEvent = (event: Event) => {
    if (!state.currentUser) return [];
    return getFriendsAttendingEvent(event.id, state.currentUser.id);
  };

  const getCurrentUserFriends = () => {
    if (!state.currentUser) return [];
    return getFriendsListForUser(state.currentUser.id);
  };

  const getFriendsGoingToEvent = (eventId: string) => {
    if (!state.currentUser) return [];

    // Get friends from mockData who are originally attending
    const friendsFromMock = getFriendsAttendingEvent(eventId, state.currentUser.id);

    // Also include friends who have RSVP'd through the app
    const currentUserFriends = getFriendsListForUser(state.currentUser.id);
    const friendsWhoRSVPd = currentUserFriends.filter(friend =>
      state.userRSVPs.has(eventId) && friend.id !== state.currentUser?.id
    );

    // Combine and deduplicate
    const allFriendsGoing = [...friendsFromMock];
    friendsWhoRSVPd.forEach(friend => {
      if (!allFriendsGoing.some(f => f.id === friend.id)) {
        allFriendsGoing.push(friend);
      }
    });

    return allFriendsGoing;
  };

  const addEvent = (eventData: Omit<Event, 'id' | 'createdAt' | 'attendeeIds'>) => {
    const newEvent = addNewEvent(eventData);
    dispatch({ type: 'ADD_NEW_EVENT', event: newEvent });
    return newEvent;
  };

  const value = {
    state,
    dispatch,
    toggleRSVP,
    toggleSavedEvent,
    setCity,
    setUserLocation,
    toggleNearMe,
    toggleMapView,
    setSearchQuery,
    isUserRSVP,
    isEventSaved,
    getRSVPCount,
    getUsersRSVPForEvent,
    getFriendsRSVPForEvent,
    getCurrentUserFriends,
    getFriendsGoingToEvent,
    addEvent,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

// Hook to use the context
export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}