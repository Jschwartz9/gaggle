'use client';

import { useState } from 'react';
import { Share2, Users, Gift, Copy, Check, Settings, Edit3, CalendarDays, MapPin } from 'lucide-react';
import Image from 'next/image';
import BottomNav from '@/components/BottomNav';
import { mockUsers, mockEvents } from '@/lib/mockData';

export default function ProfilePage() {
  const [copiedReferralLink, setCopiedReferralLink] = useState(false);
  const [copiedProfileLink, setCopiedProfileLink] = useState(false);

  // Mock current user data - in reality this would come from auth context
  const currentUserId = '1';
  const currentUser = mockUsers.find(u => u.id === currentUserId);

  // Mock referral data
  const referralCode = 'SARAH2024';
  const referralCount = 12;
  const referralLink = `https://gaggle.app/invite/${referralCode}`;
  const profileLink = `https://gaggle.app/profile/${currentUserId}`;

  // User's hosted and attending events
  const hostedEvents = mockEvents.filter(event => event.hostId === currentUserId);
  const attendingEvents = mockEvents.filter(event =>
    event.attendeeIds.includes(currentUserId) && event.hostId !== currentUserId
  );

  if (!currentUser) return null;

  const copyToClipboard = async (text: string, type: 'referral' | 'profile') => {
    try {
      await navigator.clipboard.writeText(text);
      if (type === 'referral') {
        setCopiedReferralLink(true);
        setTimeout(() => setCopiedReferralLink(false), 2000);
      } else {
        setCopiedProfileLink(true);
        setTimeout(() => setCopiedProfileLink(false), 2000);
      }
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const shareProfile = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Check out ${currentUser.name}'s profile on Gaggle`,
          text: `I'm on Gaggle discovering amazing local events! Come join me.`,
          url: profileLink,
        });
      } catch (err) {
        console.log('Share cancelled');
      }
    } else {
      copyToClipboard(profileLink, 'profile');
    }
  };

  const shareReferral = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Join me on Gaggle!',
          text: `I've been discovering amazing local events on Gaggle. Join me and get access to exclusive events! Use my referral code: ${referralCode}`,
          url: referralLink,
        });
      } catch (err) {
        console.log('Share cancelled');
      }
    } else {
      copyToClipboard(referralLink, 'referral');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Main Content (with padding for desktop sidebar) */}
      <div className="md:pl-72">
        {/* Header */}
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-sm border-b border-gray-100 px-6 py-6">
          <div className="flex items-center justify-between max-w-6xl mx-auto">
            <div>
              <h1 className="text-3xl font-bold text-text mb-1">Profile</h1>
              <p className="text-gray-600">Manage your account and connect with friends</p>
            </div>
            <button className="p-3 hover:bg-gray-100 rounded-2xl transition-all hover:scale-105">
              <Settings className="w-6 h-6 text-gray-600" />
            </button>
          </div>
        </header>

        {/* Profile Section */}
        <section className="px-6 py-8">
          <div className="max-w-6xl mx-auto">
            <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm hover:shadow-lg transition-shadow duration-200">
              <div className="flex items-start space-x-6">
                <div className="relative">
                  <Image
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    width={100}
                    height={100}
                    className="w-25 h-25 rounded-2xl object-cover"
                  />
                  <button className="absolute -bottom-2 -right-2 w-8 h-8 bg-primary text-white rounded-xl flex items-center justify-center shadow-lg shadow-primary/25 hover:scale-110 transition-transform">
                    <Edit3 className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-3">
                    <h2 className="text-2xl font-bold text-text">{currentUser.name}</h2>
                    <span className="text-gray-500 font-medium">({currentUser.age})</span>
                  </div>

                  <p className="text-gray-600 mb-4 text-lg leading-relaxed">{currentUser.bio}</p>

                  <div className="flex items-center space-x-6 mb-4">
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-5 h-5 text-primary" />
                      <span className="text-gray-700 font-medium">{currentUser.city}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Users className="w-5 h-5 text-primary" />
                      <span className="text-gray-700 font-medium">{currentUser.followers.length} followers</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3 mb-6">
                    {currentUser.interests.slice(0, 3).map((interest, index) => (
                      <span key={index} className="px-4 py-2 bg-primary/10 text-primary font-semibold rounded-xl border border-primary/20">
                        {interest}
                      </span>
                    ))}
                  </div>

                  <button
                    onClick={shareProfile}
                    className="flex items-center space-x-3 px-6 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-accent transition-all hover:scale-105 shadow-lg shadow-primary/25"
                  >
                    <Share2 className="w-5 h-5" />
                    <span>Share Profile</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Share & Refer Section */}
        <section className="px-6 pb-8">
          <div className="max-w-6xl mx-auto">
            <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-accent/10 rounded-2xl border border-primary/20 p-8 shadow-sm">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/25">
                  <Gift className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-text">Invite Friends</h3>
                  <p className="text-gray-600 text-lg">Share Gaggle and earn rewards</p>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 mb-6 border border-gray-100 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-lg font-semibold text-text">Your referral code</span>
                  <span className="bg-green-100 text-green-800 px-4 py-2 rounded-xl font-bold">
                    {referralCount} friends joined
                  </span>
                </div>

                <div className="flex items-center space-x-3">
                  <code className="flex-1 px-5 py-4 bg-gray-50 rounded-xl text-primary font-mono text-lg font-bold border border-gray-200">
                    {referralCode}
                  </code>
                  <button
                    onClick={() => copyToClipboard(referralLink, 'referral')}
                    className="p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all hover:scale-105"
                  >
                    {copiedReferralLink ? (
                      <Check className="w-5 h-5 text-green-600" />
                    ) : (
                      <Copy className="w-5 h-5 text-gray-600" />
                    )}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  onClick={shareReferral}
                  className="flex items-center justify-center space-x-3 px-6 py-4 bg-primary text-white rounded-xl font-semibold hover:bg-accent transition-all hover:scale-105 shadow-lg shadow-primary/25"
                >
                  <Share2 className="w-5 h-5" />
                  <span>Share Link</span>
                </button>

                <button
                  onClick={() => copyToClipboard(referralLink, 'referral')}
                  className="flex items-center justify-center space-x-3 px-6 py-4 border-2 border-primary text-primary rounded-xl font-semibold hover:bg-primary hover:text-white transition-all hover:scale-105"
                >
                  {copiedReferralLink ? (
                    <>
                      <Check className="w-5 h-5" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-5 h-5" />
                      <span>Copy Link</span>
                    </>
                  )}
                </button>
              </div>

              <p className="text-gray-600 mt-4 text-center text-lg">
                Friends who join with your link get exclusive access to premium events
              </p>
            </div>
          </div>
        </section>

        {/* Events Stats Section */}
        <section className="px-6 pb-24 md:pb-8">
          <div className="max-w-6xl mx-auto">
            <h3 className="text-2xl font-bold text-text mb-6">Your Events</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="bg-white rounded-2xl border border-gray-100 p-6 text-center shadow-sm hover:shadow-lg transition-shadow duration-200">
                <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <CalendarDays className="w-7 h-7 text-primary" />
                </div>
                <div className="text-3xl font-bold text-text mb-2">{hostedEvents.length}</div>
                <div className="text-gray-600 font-medium">Events Hosted</div>
              </div>

              <div className="bg-white rounded-2xl border border-gray-100 p-6 text-center shadow-sm hover:shadow-lg transition-shadow duration-200">
                <div className="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Users className="w-7 h-7 text-green-600" />
                </div>
                <div className="text-3xl font-bold text-text mb-2">{attendingEvents.length}</div>
                <div className="text-gray-600 font-medium">Events Attending</div>
              </div>
            </div>

            {/* Quick Share Profile Link */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-lg transition-shadow duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xl font-semibold text-text mb-1">Profile Link</h4>
                  <p className="text-gray-600">Share your Gaggle profile with friends</p>
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={() => copyToClipboard(profileLink, 'profile')}
                    className="p-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all hover:scale-105"
                  >
                    {copiedProfileLink ? (
                      <Check className="w-5 h-5 text-green-600" />
                    ) : (
                      <Copy className="w-5 h-5 text-gray-600" />
                    )}
                  </button>
                  <button
                    onClick={shareProfile}
                    className="p-3 bg-primary text-white rounded-xl hover:bg-accent transition-all hover:scale-105 shadow-lg shadow-primary/25"
                  >
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
}