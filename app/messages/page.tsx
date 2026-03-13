'use client';

import { useState } from 'react';
import { Search, MessageCircle } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import BottomNav from '@/components/BottomNav';
import { mockUsers, getUserConversations } from '@/lib/mockData';

export default function MessagesPage() {
  const [searchQuery, setSearchQuery] = useState('');

  // Mock current user data - in reality this would come from auth context
  const currentUserId = '1';
  const conversations = getUserConversations(currentUserId);

  // Filter conversations by search query (search by participant name)
  const filteredConversations = conversations.filter(conversation => {
    const otherParticipant = conversation.participantIds.find(id => id !== currentUserId);
    const user = mockUsers.find(u => u.id === otherParticipant);
    return !searchQuery || user?.name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

    if (diffInMinutes < 60) {
      return `${diffInMinutes}m`;
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)}h`;
    } else {
      return `${Math.floor(diffInMinutes / 1440)}d`;
    }
  };

  const ConversationItem = ({ conversation }: { conversation: any }) => {
    const otherParticipantId = conversation.participantIds.find((id: string) => id !== currentUserId);
    const otherParticipant = mockUsers.find(u => u.id === otherParticipantId);

    if (!otherParticipant) return null;

    return (
      <Link
        href={`/messages/${otherParticipantId}`}
        className="flex items-center space-x-4 p-5 bg-white border border-gray-100 rounded-2xl hover:border-gray-200 hover:shadow-lg transition-all duration-200 group"
      >
        <div className="relative">
          <Image
            src={otherParticipant.avatar}
            alt={otherParticipant.name}
            width={56}
            height={56}
            className="w-14 h-14 rounded-2xl object-cover"
          />
          {conversation.unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-6 h-6 bg-primary text-white text-xs rounded-full flex items-center justify-center font-bold shadow-lg shadow-primary/25">
              {conversation.unreadCount}
            </span>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <h3 className={`font-semibold text-lg text-text group-hover:text-primary transition-colors ${conversation.unreadCount > 0 ? 'font-bold' : ''}`}>
              {otherParticipant.name}
            </h3>
            <span className="text-sm text-gray-500 font-medium">
              {formatTime(conversation.lastActivity)}
            </span>
          </div>

          <p className={`text-sm truncate ${
            conversation.unreadCount > 0 ? 'text-text font-semibold' : 'text-gray-600'
          }`}>
            {conversation.lastMessage?.content || 'No messages yet'}
          </p>
        </div>
      </Link>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Main Content (with padding for desktop sidebar) */}
      <div className="md:pl-72">
        {/* Header */}
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-sm border-b border-gray-100 px-6 py-6">
          <div className="flex items-center justify-between max-w-6xl mx-auto">
            <div>
              <h1 className="text-3xl font-bold text-text mb-1">Messages</h1>
              <p className="text-gray-600">Stay connected with your event friends</p>
            </div>
            <div className="flex items-center space-x-3 bg-primary/10 px-4 py-2 rounded-2xl">
              <MessageCircle className="w-5 h-5 text-primary" />
              <span className="text-primary font-semibold">{conversations.length} conversation{conversations.length !== 1 ? 's' : ''}</span>
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
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent shadow-sm text-lg"
              />
            </div>
          </div>
        </div>

        {/* Conversations List */}
        <div className="px-6 pb-24 md:pb-8">
          <div className="max-w-6xl mx-auto">
            {searchQuery && (
              <p className="text-sm text-gray-600 mb-4">
                {filteredConversations.length} result{filteredConversations.length !== 1 ? 's' : ''} for "{searchQuery}"
              </p>
            )}

            {filteredConversations.length > 0 ? (
              <div className="space-y-4">
                {filteredConversations.map(conversation => (
                  <ConversationItem key={conversation.id} conversation={conversation} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <MessageCircle className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-2xl font-semibold text-text mb-3">
                  {searchQuery ? 'No conversations found' : 'No messages yet'}
                </h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  {searchQuery
                    ? 'Try adjusting your search terms'
                    : 'Start a conversation with friends from events you attend'
                  }
                </p>
                {!searchQuery && (
                  <Link
                    href="/friends"
                    className="px-6 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-accent transition-all hover:scale-105 shadow-lg shadow-primary/25"
                  >
                    Find Friends
                  </Link>
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