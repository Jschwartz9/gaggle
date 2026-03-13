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
        <div className={`max-w-xs lg:max-w-md px-5 py-3 rounded-2xl shadow-sm ${
          isFromCurrentUser
            ? 'bg-primary text-white'
            : 'bg-white border border-gray-200 text-text'
        }`}>
          <p className="text-sm leading-relaxed">{message.content}</p>
          <p className={`text-xs mt-2 font-medium ${
            isFromCurrentUser ? 'text-white/70' : 'text-gray-500'
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
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-sm border-b border-gray-100 px-6 py-4">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <div className="flex items-center space-x-4">
            <Link
              href="/messages"
              className="p-3 hover:bg-gray-100 rounded-2xl transition-all hover:scale-105"
            >
              <ArrowLeft className="w-5 h-5 text-text" />
            </Link>

            <div className="flex items-center space-x-4">
              <Image
                src={otherUser.avatar}
                alt={otherUser.name}
                width={48}
                height={48}
                className="w-12 h-12 rounded-2xl object-cover"
              />
              <div>
                <h1 className="text-xl font-bold text-text">{otherUser.name}</h1>
                <p className="text-sm text-gray-600 font-medium">{otherUser.city}</p>
              </div>
            </div>
          </div>

          <button className="p-3 hover:bg-gray-100 rounded-2xl transition-all hover:scale-105">
            <MoreVertical className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </header>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto px-6 py-6 pb-20 md:pb-6">
        <div className="max-w-4xl mx-auto">
          {messages.length > 0 ? (
            <div className="space-y-2">
              {messages.map(message => (
                <MessageBubble key={message.id} message={message} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Image
                  src={otherUser.avatar}
                  alt={otherUser.name}
                  width={40}
                  height={40}
                  className="w-10 h-10 rounded-xl object-cover"
                />
              </div>
              <h3 className="text-2xl font-semibold text-text mb-3">
                Start a conversation with {otherUser.name}
              </h3>
              <p className="text-gray-600 max-w-md mx-auto">
                Say hello and break the ice! You both share interests in {otherUser.interests.slice(0, 2).join(' and ')}.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Message Input */}
      <div className="sticky bottom-0 bg-white/80 backdrop-blur-sm border-t border-gray-100 px-6 py-4">
        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSendMessage} className="flex items-center space-x-4">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 px-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent focus:bg-white transition-all text-lg"
            />
            <button
              type="submit"
              disabled={!newMessage.trim()}
              className={`p-4 rounded-2xl transition-all hover:scale-105 shadow-lg ${
                newMessage.trim()
                  ? 'bg-primary text-white hover:bg-accent shadow-primary/25'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed shadow-gray-200/50'
              }`}
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}