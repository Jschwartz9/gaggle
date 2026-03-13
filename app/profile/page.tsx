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
      <div className="md:pl-64">
        {/* Header */}
        <header className="sticky top-0 z-30 bg-background border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-text">Profile</h1>
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <Settings className="w-5 h-5 text-muted" />
            </button>
          </div>
        </header>

        {/* Profile Section */}
        <section className="p-4">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-start space-x-4">
              <div className="relative">
                <Image
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  width={80}
                  height={80}
                  className="w-20 h-20 rounded-full"
                />
                <button className="absolute -bottom-1 -right-1 w-6 h-6 bg-primary text-deep rounded-full flex items-center justify-center">
                  <Edit3 className="w-3 h-3" />
                </button>
              </div>

              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <h2 className="text-xl font-bold text-text">{currentUser.name}</h2>
                  <span className="text-sm text-muted">({currentUser.age})</span>
                </div>

                <p className="text-muted text-sm mb-3">{currentUser.bio}</p>

                <div className="flex items-center space-x-4 text-sm text-muted mb-3">
                  <div className="flex items-center space-x-1">
                    <MapPin className="w-4 h-4" />
                    <span>{currentUser.city}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Users className="w-4 h-4" />
                    <span>{currentUser.followers.length} followers</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {currentUser.interests.slice(0, 3).map((interest, index) => (
                    <span key={index} className="px-2 py-1 bg-gray-100 text-muted text-xs rounded-full">
                      {interest}
                    </span>
                  ))}
                </div>

                <button
                  onClick={shareProfile}
                  className="flex items-center space-x-2 px-4 py-2 bg-primary text-deep rounded-lg text-sm font-medium hover:bg-accent transition-colors"
                >
                  <Share2 className="w-4 h-4" />
                  <span>Share Profile</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Share & Refer Section */}
        <section className="p-4">
          <div className="bg-gradient-to-r from-primary/5 to-accent/5 rounded-lg border border-primary/20 p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                <Gift className="w-5 h-5 text-deep" />
              </div>
              <div>
                <h3 className="font-bold text-text">Invite Friends</h3>
                <p className="text-sm text-muted">Share Gaggle and earn rewards</p>
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-text">Your referral code</span>
                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                  {referralCount} friends joined
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <code className="flex-1 px-3 py-2 bg-gray-50 rounded-lg text-primary font-mono text-sm">
                  {referralCode}
                </code>
                <button
                  onClick={() => copyToClipboard(referralLink, 'referral')}
                  className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  {copiedReferralLink ? (
                    <Check className="w-4 h-4 text-green-600" />
                  ) : (
                    <Copy className="w-4 h-4 text-muted" />
                  )}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={shareReferral}
                className="flex items-center justify-center space-x-2 px-4 py-3 bg-primary text-deep rounded-lg font-medium hover:bg-accent transition-colors"
              >
                <Share2 className="w-4 h-4" />
                <span>Share Link</span>
              </button>

              <button
                onClick={() => copyToClipboard(referralLink, 'referral')}
                className="flex items-center justify-center space-x-2 px-4 py-3 border border-primary text-primary rounded-lg font-medium hover:bg-primary hover:text-deep transition-colors"
              >
                {copiedReferralLink ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Copy Link</span>
                  </>
                )}
              </button>
            </div>

            <p className="text-xs text-muted mt-3 text-center">
              Friends who join with your link get exclusive access to premium events
            </p>
          </div>
        </section>

        {/* Events Stats Section */}
        <section className="p-4">
          <h3 className="text-lg font-bold text-text mb-4">Your Events</h3>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2">
                <CalendarDays className="w-5 h-5 text-primary" />
              </div>
              <div className="text-xl font-bold text-text">{hostedEvents.length}</div>
              <div className="text-sm text-muted">Events Hosted</div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <Users className="w-5 h-5 text-green-600" />
              </div>
              <div className="text-xl font-bold text-text">{attendingEvents.length}</div>
              <div className="text-sm text-muted">Events Attending</div>
            </div>
          </div>

          {/* Quick Share Profile Link */}
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-text">Profile Link</h4>
                <p className="text-xs text-muted">Share your Gaggle profile</p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => copyToClipboard(profileLink, 'profile')}
                  className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  {copiedProfileLink ? (
                    <Check className="w-4 h-4 text-green-600" />
                  ) : (
                    <Copy className="w-4 h-4 text-muted" />
                  )}
                </button>
                <button
                  onClick={shareProfile}
                  className="p-2 bg-primary text-deep rounded-lg hover:bg-accent transition-colors"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </section>

        <div className="pb-20 md:pb-4"></div>
      </div>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
}