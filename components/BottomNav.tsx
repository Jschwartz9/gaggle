'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Home, Search, Plus, Bell, User, Users } from 'lucide-react';

const navItems = [
  { href: '/', icon: Home, label: 'Home' },
  { href: '/explore', icon: Search, label: 'Explore' },
  { href: '/friends', icon: Users, label: 'Friends' },
  { href: '/post', icon: Plus, label: 'Post', isProminent: true },
  { href: '/notifications', icon: Bell, label: 'Notifications' },
  { href: '/profile', icon: User, label: 'Profile' },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 md:hidden z-50">
        <div className="flex items-center justify-between">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const IconComponent = item.icon;

            if (item.isProminent) {
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex flex-col items-center justify-center w-12 h-12 bg-primary rounded-full shadow-lg"
                >
                  <IconComponent className="w-6 h-6 text-deep" />
                </Link>
              );
            }

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center justify-center p-2 min-w-0 flex-1 ${
                  isActive ? 'text-primary' : 'text-muted'
                }`}
              >
                <IconComponent className={`w-6 h-6 ${isActive ? 'text-primary' : 'text-muted'}`} />
                <span className={`text-xs mt-1 ${isActive ? 'text-primary' : 'text-muted'}`}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Desktop Left Sidebar */}
      <nav className="hidden md:flex fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 p-6 flex-col z-40">
        {/* Logo */}
        <div className="mb-8">
          <Image
            src="/gaggle-logo.svg"
            alt="Gaggle Logo"
            width={160}
            height={60}
            className="h-12 w-auto"
          />
        </div>

        {/* Navigation Items */}
        <div className="space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const IconComponent = item.icon;

            if (item.isProminent) {
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center space-x-3 p-3 bg-primary text-deep rounded-lg font-medium shadow-sm hover:shadow-md transition-shadow"
                >
                  <IconComponent className="w-5 h-5" />
                  <span>{item.label} Event</span>
                </Link>
              );
            }

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-primary/10 text-primary font-medium'
                    : 'text-muted hover:bg-gray-50'
                }`}
              >
                <IconComponent className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}