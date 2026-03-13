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
        className="flex items-center space-x-3 p-4 hover:bg-gray-50 transition-colors border-b border-gray-100"
      >
        <div className="relative">
          <Image
            src={otherParticipant.avatar}
            alt={otherParticipant.name}
            width={48}
            height={48}
            className="w-12 h-12 rounded-full"
          />
          {conversation.unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-white text-xs rounded-full flex items-center justify-center font-medium">
              {conversation.unreadCount}
            </span>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h3 className={`font-medium text-text ${conversation.unreadCount > 0 ? 'font-semibold' : ''}`}>
              {otherParticipant.name}
            </h3>
            <span className="text-xs text-muted">
              {formatTime(conversation.lastActivity)}
            </span>
          </div>

          <p className={`text-sm truncate mt-1 ${
            conversation.unreadCount > 0 ? 'text-text font-medium' : 'text-muted'
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
      <div className="md:pl-64">
        {/* Header */}
        <header className="sticky top-0 z-30 bg-background border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-text">Messages</h1>
            <div className="flex items-center space-x-2 text-sm text-muted">
              <MessageCircle className="w-4 h-4" />
              <span>{conversations.length} conversation{conversations.length !== 1 ? 's' : ''}</span>
            </div>
          </div>
        </header>

        {/* Search Bar */}
        <div className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
        </div>

        {/* Conversations List */}
        <div className="pb-20 md:pb-4">
          {searchQuery && (
            <div className="px-4 mb-3">
              <p className="text-sm text-muted">
                {filteredConversations.length} result{filteredConversations.length !== 1 ? 's' : ''} for "{searchQuery}"
              </p>
            </div>
          )}

          {filteredConversations.length > 0 ? (
            <div className="bg-white border-t border-gray-200">
              {filteredConversations.map(conversation => (
                <ConversationItem key={conversation.id} conversation={conversation} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 px-4">
              <MessageCircle className="w-12 h-12 text-muted mx-auto mb-3" />
              <h3 className="text-lg font-medium text-text mb-2">
                {searchQuery ? 'No conversations found' : 'No messages yet'}
              </h3>
              <p className="text-sm text-muted mb-4">
                {searchQuery
                  ? 'Try different search terms'
                  : 'Start a conversation with friends from events you attend'
                }
              </p>
              {!searchQuery && (
                <Link
                  href="/friends"
                  className="inline-flex items-center space-x-2 px-4 py-2 bg-primary text-deep rounded-lg font-medium hover:bg-accent transition-colors"
                >
                  <span>Find Friends</span>
                </Link>
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