'use client';

import { useState } from 'react';
import { ArrowLeft, Send, MoreVertical } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { mockUsers, getConversationByParticipants, getMessagesForConversation } from '@/lib/mockData';

interface MessagePageProps {
  params: {
    userId: string;
  };
}

export default function MessagePage({ params }: MessagePageProps) {
  const [newMessage, setNewMessage] = useState('');

  // Mock current user data - in reality this would come from auth context
  const currentUserId = '1';
  const otherUser = mockUsers.find(u => u.id === params.userId);

  // Get conversation and messages
  const conversation = getConversationByParticipants(currentUserId, params.userId);
  const messages = conversation ? getMessagesForConversation(conversation.id) : [];

  if (!otherUser) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-xl font-bold text-text mb-2">User not found</h1>
          <Link href="/messages" className="text-primary hover:underline">
            Back to Messages
          </Link>
        </div>
      </div>
    );
  }

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    // In a real app, this would send the message to the backend
    console.log('Sending message:', newMessage);
    setNewMessage('');
  };

  const formatMessageTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const MessageBubble = ({ message }: { message: any }) => {
    const isFromCurrentUser = message.senderId === currentUserId;

    return (
      <div className={`flex ${isFromCurrentUser ? 'justify-end' : 'justify-start'} mb-4`}>
        <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
          isFromCurrentUser
            ? 'bg-primary text-deep'
            : 'bg-gray-100 text-text'
        }`}>
          <p className="text-sm">{message.content}</p>
          <p className={`text-xs mt-1 ${
            isFromCurrentUser ? 'text-deep/70' : 'text-muted'
          }`}>
            {formatMessageTime(message.timestamp)}
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Link
              href="/messages"
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-text" />
            </Link>

            <div className="flex items-center space-x-3">
              <Image
                src={otherUser.avatar}
                alt={otherUser.name}
                width={40}
                height={40}
                className="w-10 h-10 rounded-full"
              />
              <div>
                <h1 className="font-semibold text-text">{otherUser.name}</h1>
                <p className="text-xs text-muted">{otherUser.city}</p>
              </div>
            </div>
          </div>

          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <MoreVertical className="w-5 h-5 text-muted" />
          </button>
        </div>
      </header>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 pb-20 md:pb-4">
        {messages.length > 0 ? (
          <div className="space-y-1">
            {messages.map(message => (
              <MessageBubble key={message.id} message={message} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Image
              src={otherUser.avatar}
              alt={otherUser.name}
              width={80}
              height={80}
              className="w-20 h-20 rounded-full mx-auto mb-4"
            />
            <h3 className="text-lg font-medium text-text mb-2">
              Start a conversation with {otherUser.name}
            </h3>
            <p className="text-sm text-muted mb-4">
              Say hello and break the ice! You both share interests in {otherUser.interests.slice(0, 2).join(' and ')}.
            </p>
          </div>
        )}
      </div>

      {/* Message Input */}
      <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4">
        <form onSubmit={handleSendMessage} className="flex items-center space-x-3">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 px-4 py-3 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
          <button
            type="submit"
            disabled={!newMessage.trim()}
            className={`p-3 rounded-full transition-colors ${
              newMessage.trim()
                ? 'bg-primary text-deep hover:bg-accent'
                : 'bg-gray-100 text-muted cursor-not-allowed'
            }`}
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
}