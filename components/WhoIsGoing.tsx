import Image from 'next/image';
import { Event, User } from '@/lib/types';
import { getUserById } from '@/lib/mockData';
import { Users } from 'lucide-react';

interface WhoIsGoingProps {
  event: Event;
  showOptIn?: boolean;
}

export default function WhoIsGoing({ event, showOptIn = true }: WhoIsGoingProps) {
  // Get attendee data
  const attendees = event.attendeeIds.map(id => getUserById(id)).filter(Boolean) as User[];

  // Calculate age statistics
  const ages = attendees.map(user => user.age);
  const minAge = Math.min(...ages);
  const maxAge = Math.max(...ages);
  const ageRange = ages.length > 0 ? `${minAge}–${maxAge}` : '';

  // Find common interests (simplified)
  const allInterests = attendees.flatMap(user => user.interests);
  const interestCounts = allInterests.reduce((acc, interest) => {
    acc[interest] = (acc[interest] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const popularInterests = Object.entries(interestCounts)
    .filter(([_, count]) => count > 1)
    .sort(([_, a], [__, b]) => b - a)
    .slice(0, 2);

  return (
    <div className="bg-white rounded-lg p-6 space-y-4">
      {/* Header */}
      <div className="flex items-center space-x-2">
        <Users className="w-5 h-5 text-primary" />
        <h2 className="text-lg font-bold text-text">Who's Going</h2>
      </div>

      {/* Attendee Count & Age Range */}
      <div className="space-y-2">
        <p className="text-text font-medium">
          {event.attendeeIds.length} people going
        </p>
        {ageRange && (
          <p className="text-sm text-muted">
            Mostly {ageRange} years old
          </p>
        )}
      </div>

      {/* Avatar Grid */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-text">Attendees</h3>
        <div className="grid grid-cols-8 gap-2">
          {attendees.slice(0, 8).map((user) => (
            <div key={user.id} className="flex flex-col items-center space-y-1">
              <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-gray-200">
                <Image
                  src={user.avatar}
                  alt={user.name}
                  fill
                  className="object-cover"
                />
              </div>
              <span className="text-xs text-muted text-center leading-tight">
                {user.name.split(' ')[0]}
              </span>
            </div>
          ))}

          {/* Show remaining count if more than 8 */}
          {event.attendeeIds.length > 8 && (
            <div className="flex flex-col items-center space-y-1">
              <div className="w-10 h-10 rounded-full bg-gray-100 border-2 border-gray-200 flex items-center justify-center">
                <span className="text-xs font-medium text-muted">
                  +{event.attendeeIds.length - 8}
                </span>
              </div>
              <span className="text-xs text-muted">more</span>
            </div>
          )}
        </div>
      </div>

      {/* Common Interests */}
      {popularInterests.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-text">Shared Interests</h3>
          <div className="flex flex-wrap gap-2">
            {popularInterests.map(([interest, count]) => (
              <span
                key={interest}
                className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full"
              >
                {count} people also like {interest}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Privacy Opt-in */}
      {showOptIn && (
        <div className="pt-4 border-t border-gray-100">
          <label className="flex items-start space-x-3">
            <input
              type="checkbox"
              defaultChecked
              className="mt-1 w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
            />
            <div>
              <p className="text-sm text-text font-medium">
                Show my profile to other attendees
              </p>
              <p className="text-xs text-muted">
                Let people see you're going and your interests
              </p>
            </div>
          </label>
        </div>
      )}
    </div>
  );
}