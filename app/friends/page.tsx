'use client';

import { useState } from 'react';
import { Search, UserPlus, Users, MessageCircle } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import BottomNav from '@/components/BottomNav';
import PeopleYouMayKnow from '@/components/PeopleYouMayKnow';
import { mockUsers } from '@/lib/mockData';
import { User } from '@/lib/types';

export default function FriendsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'friends' | 'suggestions'>('friends');

  // Mock current user data - in reality this would come from auth context
  const currentUserId = '1';
  const currentUser = mockUsers.find(u => u.id === currentUserId);

  // Friends are users you're following
  const friends = mockUsers.filter(user =>
    currentUser?.following?.includes(user.id)
  );

  // Suggestions are users you're not following yet, excluding current user
  const suggestions = mockUsers.filter(user =>
    user.id !== currentUserId && !currentUser?.following?.includes(user.id)
  );

  // Filter by search query
  const filteredFriends = friends.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredSuggestions = suggestions.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const FriendCard = ({ user, type }: { user: User; type: 'friend' | 'suggestion' }) => (
    <div className="flex items-center justify-between p-5 bg-white border border-gray-100 rounded-2xl hover:border-gray-200 hover:shadow-lg transition-all duration-200">
      <div className="flex items-center space-x-4">
        <Image
          src={user.avatar}
          alt={user.name}
          width={56}
          height={56}
          className="w-14 h-14 rounded-2xl object-cover"
        />
        <div className="flex-1">
          <h3 className="font-semibold text-lg text-text mb-1">{user.name}</h3>
          <p className="text-sm text-gray-600 mb-2 line-clamp-2">{user.bio}</p>
          <div className="flex items-center space-x-3">
            <span className="text-xs text-gray-500 font-medium">{user.city}</span>
            <div className="flex space-x-1">
              {user.interests.slice(0, 2).map((interest, index) => (
                <span key={index} className="text-xs bg-gray-50 text-gray-600 px-2 py-1 rounded-lg font-medium">
                  {interest}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="flex space-x-3">
        {type === 'friend' ? (
          <Link
            href={`/messages/${user.id}`}
            className="flex items-center space-x-2 px-4 py-2.5 bg-primary text-white rounded-xl font-semibold hover:bg-accent transition-all hover:scale-105 shadow-lg shadow-primary/25"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Message</span>
          </Link>
        ) : (
          <button className="flex items-center space-x-2 px-4 py-2.5 border-2 border-primary text-primary rounded-xl font-semibold hover:bg-primary hover:text-white transition-all hover:scale-105">
            <UserPlus className="w-4 h-4" />
            <span>Follow</span>
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Main Content (with padding for desktop sidebar) */}
      <div className="md:pl-72">
        {/* Header */}
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-sm border-b border-gray-100 px-6 py-6">
          <div className="flex items-center justify-between max-w-6xl mx-auto">
            <div>
              <h1 className="text-3xl font-bold text-text mb-1">Friends</h1>
              <p className="text-gray-600">Connect with people who share your interests</p>
            </div>
            <div className="flex items-center space-x-3 bg-primary/10 px-4 py-2 rounded-2xl">
              <Users className="w-5 h-5 text-primary" />
              <span className="text-primary font-semibold">{friends.length} friends</span>
            </div>
          </div>
        </header>

        {/* Search Bar */}
        <div className="px-6 py-6">
          <div className="max-w-6xl mx-auto">
            <div className="relative max-w-md">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search people..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent shadow-sm text-lg"
              />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="px-6 mb-8">
          <div className="max-w-6xl mx-auto">
            <div className="flex space-x-2 bg-gray-50 rounded-2xl p-2 max-w-sm">
              <button
                onClick={() => setActiveTab('friends')}
                className={`flex-1 py-3 px-6 rounded-xl text-sm font-semibold transition-all ${
                  activeTab === 'friends'
                    ? 'bg-white text-text shadow-sm'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Friends ({friends.length})
              </button>
              <button
                onClick={() => setActiveTab('suggestions')}
                className={`flex-1 py-3 px-6 rounded-xl text-sm font-semibold transition-all ${
                  activeTab === 'suggestions'
                    ? 'bg-white text-text shadow-sm'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Suggestions ({suggestions.length})
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 pb-24 md:pb-8">
          <div className="max-w-6xl mx-auto">
            {activeTab === 'friends' ? (
              <div className="space-y-4">
                {searchQuery && (
                  <p className="text-sm text-gray-600 mb-4">
                    {filteredFriends.length} result{filteredFriends.length !== 1 ? 's' : ''} for "{searchQuery}"
                  </p>
                )}

                {filteredFriends.length > 0 ? (
                  filteredFriends.map(user => (
                    <FriendCard key={user.id} user={user} type="friend" />
                  ))
                ) : (
                  <div className="text-center py-16">
                    <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                      <Users className="w-10 h-10 text-gray-400" />
                    </div>
                    <h3 className="text-2xl font-semibold text-text mb-3">
                      {searchQuery ? 'No friends found' : 'No friends yet'}
                    </h3>
                    <p className="text-gray-600 mb-6 max-w-md mx-auto">
                      {searchQuery
                        ? 'Try adjusting your search terms'
                        : 'Start following people to see them here and build your network'
                      }
                    </p>
                    {!searchQuery && (
                      <button
                        onClick={() => setActiveTab('suggestions')}
                        className="px-6 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-accent transition-all hover:scale-105 shadow-lg shadow-primary/25"
                      >
                        Discover People
                      </button>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {searchQuery && (
                  <p className="text-sm text-gray-600 mb-4">
                    {filteredSuggestions.length} result{filteredSuggestions.length !== 1 ? 's' : ''} for "{searchQuery}"
                  </p>
                )}

{!searchQuery ? (
                  <PeopleYouMayKnow />
                ) : (
                  <>
                    <div className="bg-gradient-to-br from-primary/5 to-accent/5 border border-primary/10 rounded-2xl p-6 mb-6">
                      <h3 className="text-lg font-semibold text-text mb-2">Search Results</h3>
                      <p className="text-gray-600">
                        {filteredSuggestions.length} result{filteredSuggestions.length !== 1 ? 's' : ''} for "{searchQuery}"
                      </p>
                    </div>

                    {filteredSuggestions.length > 0 ? (
                      filteredSuggestions.map(user => (
                        <FriendCard key={user.id} user={user} type="suggestion" />
                      ))
                    ) : (
                      <div className="text-center py-16">
                        <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                          <UserPlus className="w-10 h-10 text-gray-400" />
                        </div>
                        <h3 className="text-2xl font-semibold text-text mb-3">
                          No suggestions found
                        </h3>
                        <p className="text-gray-600 max-w-md mx-auto">
                          Try different search terms
                        </p>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
}