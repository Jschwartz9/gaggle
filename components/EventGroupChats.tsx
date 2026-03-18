'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageCircle,
  Users,
  Plus,
  Lock,
  Globe,
  X,
  Send,
  ArrowRight
} from 'lucide-react';
import { GroupChat, GroupMessage } from '@/lib/types';
import {
  getPublicGroupChatsForEvent,
  getUserGroupChats,
  getGroupMessages,
  getGroupChatById,
  getUserById,
  canUserJoinGroupChat
} from '@/lib/mockData';

interface EventGroupChatsProps {
  eventId: string;
  className?: string;
}

export default function EventGroupChats({ eventId, className = '' }: EventGroupChatsProps) {
  const publicChats = getPublicGroupChatsForEvent(eventId);
  const userChats = getUserGroupChats('current').filter(chat => chat.eventId === eventId);
  const [selectedChat, setSelectedChat] = useState<GroupChat | null>(null);
  const [newMessage, setNewMessage] = useState('');

  if (publicChats.length === 0 && userChats.length === 0) return null;

  const handleJoinChat = (chatId: string) => {
    if (canUserJoinGroupChat(chatId, 'current')) {
      // In a real app, this would make an API call
      console.log(`Joining chat: ${chatId}`);
    }
  };

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedChat) return;

    // In a real app, this would send the message via API
    console.log(`Sending message to ${selectedChat.id}: ${newMessage}`);
    setNewMessage('');
  };

  const openChatViewer = (chat: GroupChat) => {
    setSelectedChat(chat);
  };

  const closeChatViewer = () => {
    setSelectedChat(null);
    setNewMessage('');
  };

  const currentMessages = selectedChat ? getGroupMessages(selectedChat.id) : [];

  return (
    <>
      {/* Group Chats Section */}
      <div className={`${className}`}>
        <div className="mb-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-text">Event Chats</h3>
            <button className="flex items-center space-x-1 text-primary text-sm font-medium hover:text-primary/80 transition-colors">
              <Plus className="w-4 h-4" />
              <span>Create Chat</span>
            </button>
          </div>

          {/* User's Active Chats */}
          {userChats.length > 0 && (
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-600 mb-2">Your Chats</h4>
              <div className="space-y-2">
                {userChats.map((chat) => {
                  const lastMessages = getGroupMessages(chat.id);
                  const lastMessage = lastMessages[lastMessages.length - 1];
                  const lastSender = lastMessage ? getUserById(lastMessage.senderId) : null;

                  return (
                    <motion.button
                      key={chat.id}
                      onClick={() => openChatViewer(chat)}
                      className="w-full p-3 bg-white rounded-xl border border-gray-100 hover:border-primary/20 hover:shadow-sm transition-all text-left"
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3 flex-1">
                          <div className="relative">
                            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                              <MessageCircle className="w-5 h-5 text-primary" />
                            </div>
                            {!chat.isPublic && (
                              <div className="absolute -top-1 -right-1 w-4 h-4 bg-gray-500 rounded-full flex items-center justify-center">
                                <Lock className="w-2 h-2 text-white" />
                              </div>
                            )}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2">
                              <h4 className="font-medium text-text truncate">{chat.name}</h4>
                              <div className="flex items-center space-x-1 text-xs text-gray-500">
                                <Users className="w-3 h-3" />
                                <span>{chat.memberIds.length}</span>
                              </div>
                            </div>
                            {lastMessage && (
                              <p className="text-sm text-gray-600 truncate">
                                <span className="font-medium">{lastSender?.name || 'User'}:</span>{' '}
                                {lastMessage.content}
                              </p>
                            )}
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-gray-400" />
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Public Chats to Join */}
          {publicChats.filter(chat => !chat.memberIds.includes('current')).length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-gray-600 mb-2">Join a Chat</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {publicChats
                  .filter(chat => !chat.memberIds.includes('current'))
                  .map((chat) => (
                    <motion.div
                      key={chat.id}
                      className="p-4 bg-gradient-to-r from-orange-50 to-pink-50 rounded-xl border border-orange-100"
                      whileHover={{ scale: 1.02 }}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="flex items-center space-x-2 mb-1">
                            <h4 className="font-semibold text-text">{chat.name}</h4>
                            <Globe className="w-4 h-4 text-green-500" />
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{chat.description}</p>
                          <div className="flex items-center space-x-4 text-xs text-gray-500">
                            <div className="flex items-center space-x-1">
                              <Users className="w-3 h-3" />
                              <span>{chat.memberIds.length}{chat.maxMembers ? `/${chat.maxMembers}` : ''}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <MessageCircle className="w-3 h-3" />
                              <span>Active</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => handleJoinChat(chat.id)}
                        disabled={!canUserJoinGroupChat(chat.id, 'current')}
                        className="w-full py-2 px-4 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                      >
                        {!canUserJoinGroupChat(chat.id, 'current') ? 'Full' : 'Join Chat'}
                      </button>
                    </motion.div>
                  ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Chat Viewer Modal */}
      <AnimatePresence>
        {selectedChat && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 flex items-end md:items-center justify-center"
            onClick={closeChatViewer}
          >
            <motion.div
              initial={{ y: '100%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '100%', opacity: 0 }}
              className="bg-white w-full h-[80vh] md:w-96 md:h-[600px] md:rounded-2xl flex flex-col shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Chat Header */}
              <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50 md:rounded-t-2xl">
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="font-semibold text-text">{selectedChat.name}</h3>
                    {!selectedChat.isPublic && <Lock className="w-4 h-4 text-gray-500" />}
                  </div>
                  <div className="flex items-center space-x-1 text-xs text-gray-500">
                    <Users className="w-3 h-3" />
                    <span>{selectedChat.memberIds.length} members</span>
                  </div>
                </div>
                <button
                  onClick={closeChatViewer}
                  className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {currentMessages.map((message) => {
                  const sender = getUserById(message.senderId);
                  const isCurrentUser = message.senderId === 'current';

                  return (
                    <div
                      key={message.id}
                      className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`flex items-start space-x-2 max-w-[80%] ${isCurrentUser ? 'flex-row-reverse space-x-reverse' : ''}`}>
                        {!isCurrentUser && (
                          <div className="w-6 h-6 rounded-full overflow-hidden flex-shrink-0">
                            <Image
                              src={sender?.avatar || 'https://picsum.photos/seed/default/150/150'}
                              alt={sender?.name || 'User'}
                              width={24}
                              height={24}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}

                        <div className={`rounded-2xl p-3 ${
                          isCurrentUser
                            ? 'bg-primary text-white'
                            : 'bg-gray-100 text-text'
                        }`}>
                          {!isCurrentUser && (
                            <p className="text-xs font-medium mb-1 opacity-70">
                              {sender?.name || 'User'}
                            </p>
                          )}
                          <p className="text-sm">{message.content}</p>
                          <p className={`text-xs mt-1 opacity-70 ${
                            isCurrentUser ? 'text-white' : 'text-gray-500'
                          }`}>
                            {new Date(message.timestamp).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Message Input */}
              <div className="p-4 border-t border-gray-100 bg-gray-50">
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder={`Message ${selectedChat.name}...`}
                    className="flex-1 p-3 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim()}
                    className="p-3 bg-primary text-white rounded-full hover:bg-primary/90 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}