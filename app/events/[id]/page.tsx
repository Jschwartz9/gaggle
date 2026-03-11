import { getEventById, mockEvents } from '@/lib/mockData';
import EventDetailClient from './EventDetailClient';
import Link from 'next/link';

// Generate static paths for all events
export function generateStaticParams() {
  return mockEvents.map((event) => ({
    id: event.id,
  }));
}

interface EventDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function EventDetailPage({ params }: EventDetailPageProps) {
  const { id } = await params;
  const event = getEventById(id);

  if (!event) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-text mb-2">Event Not Found</h1>
          <p className="text-muted">The event you're looking for doesn't exist.</p>
          <Link href="/" className="text-primary font-medium mt-4 inline-block">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  return <EventDetailClient event={event} />;
}