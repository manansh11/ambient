import { Metadata } from 'next';
import Link from 'next/link';
import IntentionDisplay from '@/components/IntentionDisplay';
import { decodeIntention, formatTimeForDisplay, getLocationPrecision } from '@/lib/intention';

interface PageProps {
  params: Promise<{
    payload: string;
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  try {
    const { payload } = await params;
    const intention = decodeIntention(payload);
    const location = getLocationPrecision(intention);
    
    return {
      title: `${intention.what} - Ambient`,
      description: `Join me for ${intention.what} ${formatTimeForDisplay(intention.when)}${location ? ` at ${location}` : ''}`,
      openGraph: {
        title: intention.what,
        description: `${formatTimeForDisplay(intention.when)}${location ? ` • ${location}` : ''}${intention.note ? ` • ${intention.note}` : ''}`,
        type: 'website',
        images: [
          {
            url: `/api/og?payload=${payload}`,
            width: 1200,
            height: 630,
            alt: `${intention.what} - Ambient intention`,
          }
        ],
      },
      twitter: {
        card: 'summary_large_image',
        title: intention.what,
        description: `${formatTimeForDisplay(intention.when)}${location ? ` • ${location}` : ''}`,
      },
    };
  } catch {
    return {
      title: 'Invalid Intention - Ambient',
      description: 'This ambient link is invalid or expired.',
    };
  }
}

export default async function IntentionPage({ params }: PageProps) {
  let intention;
  
  try {
    const { payload } = await params;
    intention = decodeIntention(payload);
  } catch {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4">
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="text-red-400 text-5xl mb-4">❌</div>
            <h1 className="text-2xl font-semibold text-gray-800 mb-2">
              Invalid Link
            </h1>
            <p className="text-gray-600 mb-6">
              This ambient link is invalid or corrupted.
            </p>
            <Link
              href="/"
              className="inline-block bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Create Your Own
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const { payload } = await params;
  return <IntentionDisplay intention={intention} payload={payload} />;
}