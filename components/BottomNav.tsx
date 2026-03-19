'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Home, Search, Plus, User, Users } from 'lucide-react';

const navItems = [
  { href: '/', icon: Home, label: 'Home' },
  { href: '/explore', icon: Search, label: 'Explore' },
  { href: '/post', icon: Plus, label: 'Post', isProminent: true },
  { href: '/friends', icon: Users, label: 'Friends' },
  { href: '/profile', icon: User, label: 'Profile' },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-lg border-t border-gray-100 px-6 py-3 md:hidden z-50">
        <div className="flex items-center justify-between max-w-md mx-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const IconComponent = item.icon;

            if (item.isProminent) {
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex flex-col items-center justify-center w-14 h-14 bg-primary rounded-2xl shadow-xl shadow-primary/25 -mt-2"
                >
                  <IconComponent className="w-6 h-6 text-white" />
                </Link>
              );
            }

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center justify-center p-3 min-w-0 flex-1 rounded-2xl transition-all duration-200 ${
                  isActive ? 'bg-primary/10' : 'hover:bg-gray-50'
                }`}
              >
                <IconComponent className={`w-6 h-6 ${isActive ? 'text-primary' : 'text-gray-400'}`} />
                <span className={`text-xs mt-1 font-medium ${isActive ? 'text-primary' : 'text-gray-400'}`}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Desktop Left Sidebar */}
      <nav className="hidden md:flex fixed left-0 top-0 h-full w-72 bg-white border-r border-gray-100 p-8 flex-col z-40">
        {/* Logo */}
        <div className="mb-12">
          <Image
            src="/gaggle-logo.png"
            alt="Gaggle Logo"
            width={180}
            height={60}
            loading="eager"
            className="h-12 w-auto"
          />
        </div>

        {/* Navigation Items */}
        <div className="space-y-3">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const IconComponent = item.icon;

            if (item.isProminent) {
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center space-x-4 p-4 bg-primary text-white rounded-2xl font-semibold shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all hover:scale-105"
                >
                  <IconComponent className="w-6 h-6" />
                  <span>{item.label} Event</span>
                </Link>
              );
            }

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center space-x-4 p-4 rounded-2xl transition-all ${
                  isActive
                    ? 'bg-primary/10 text-primary font-semibold shadow-sm'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
                }`}
              >
                <IconComponent className="w-6 h-6" />
                <span className="text-lg">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}