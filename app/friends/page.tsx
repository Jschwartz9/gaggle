'use client';

import { useState } from 'react';
import { Search, UserPlus, Users, MessageCircle } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import BottomNav from '@/components/BottomNav';
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
    <div className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg">
      <div className="flex items-center space-x-3">
        <Image
          src={user.avatar}
          alt={user.name}
          width={48}
          height={48}
          className="w-12 h-12 rounded-full"
        />
        <div>
          <h3 className="font-medium text-text">{user.name}</h3>
          <p className="text-xs text-muted">{user.bio}</p>
          <div className="flex items-center space-x-2 mt-1">
            <span className="text-xs text-muted">{user.city}</span>
            {user.interests.slice(0, 2).map((interest, index) => (
              <span key={index} className="text-xs bg-gray-100 text-muted px-2 py-0.5 rounded-full">
                {interest}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="flex space-x-2">
        {type === 'friend' ? (
          <Link
            href={`/messages/${user.id}`}
            className="flex items-center space-x-1 px-3 py-2 bg-primary text-deep rounded-lg text-sm font-medium hover:bg-accent transition-colors"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Message</span>
          </Link>
        ) : (
          <button className="flex items-center space-x-1 px-3 py-2 border border-primary text-primary rounded-lg text-sm font-medium hover:bg-primary hover:text-deep transition-colors">
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
      <div className="md:pl-64">
        {/* Header */}
        <header className="sticky top-0 z-30 bg-background border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-text">Friends</h1>
            <div className="flex items-center space-x-2 text-sm text-muted">
              <Users className="w-4 h-4" />
              <span>{friends.length} friends</span>
            </div>
          </div>
        </header>

        {/* Search Bar */}
        <div className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted" />
            <input
              type="text"
              placeholder="Search people..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
        </div>

        {/* Tabs */}
        <div className="px-4 mb-4">
          <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setActiveTab('friends')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'friends'
                  ? 'bg-white text-text shadow-sm'
                  : 'text-muted hover:text-text'
              }`}
            >
              Friends ({friends.length})
            </button>
            <button
              onClick={() => setActiveTab('suggestions')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'suggestions'
                  ? 'bg-white text-text shadow-sm'
                  : 'text-muted hover:text-text'
              }`}
            >
              Suggestions ({suggestions.length})
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="px-4 pb-20 md:pb-4">
          {activeTab === 'friends' ? (
            <div className="space-y-3">
              {searchQuery && (
                <p className="text-sm text-muted mb-3">
                  {filteredFriends.length} result{filteredFriends.length !== 1 ? 's' : ''} for "{searchQuery}"
                </p>
              )}

              {filteredFriends.length > 0 ? (
                filteredFriends.map(user => (
                  <FriendCard key={user.id} user={user} type="friend" />
                ))
              ) : (
                <div className="text-center py-12">
                  <Users className="w-12 h-12 text-muted mx-auto mb-3" />
                  <h3 className="text-lg font-medium text-text mb-2">
                    {searchQuery ? 'No friends found' : 'No friends yet'}
                  </h3>
                  <p className="text-sm text-muted mb-4">
                    {searchQuery
                      ? 'Try adjusting your search terms'
                      : 'Start following people to see them here'
                    }
                  </p>
                  {!searchQuery && (
                    <button
                      onClick={() => setActiveTab('suggestions')}
                      className="px-4 py-2 bg-primary text-deep rounded-lg font-medium"
                    >
                      Discover People
                    </button>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {searchQuery && (
                <p className="text-sm text-muted mb-3">
                  {filteredSuggestions.length} result{filteredSuggestions.length !== 1 ? 's' : ''} for "{searchQuery}"
                </p>
              )}

              <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 mb-4">
                <h3 className="font-medium text-text mb-1">People You Might Know</h3>
                <p className="text-sm text-muted">
                  Based on your interests and events you've attended
                </p>
              </div>

              {filteredSuggestions.length > 0 ? (
                filteredSuggestions.map(user => (
                  <FriendCard key={user.id} user={user} type="suggestion" />
                ))
              ) : (
                <div className="text-center py-12">
                  <UserPlus className="w-12 h-12 text-muted mx-auto mb-3" />
                  <h3 className="text-lg font-medium text-text mb-2">
                    No suggestions found
                  </h3>
                  <p className="text-sm text-muted">
                    {searchQuery
                      ? 'Try different search terms'
                      : 'Check back later for more suggestions'
                    }
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
}