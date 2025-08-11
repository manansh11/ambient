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
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 px-4 py-8">
        <div className="max-w-md mx-auto">
          <header className="text-center mb-8">
            <h1 className="text-3xl font-black text-gray-900 mb-2">
              ambient
            </h1>
          </header>
          
          <div className="bg-white rounded-3xl shadow-lg p-6 text-center">
            <div className="text-6xl mb-4">😵</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              invalid link
            </h2>
            <p className="text-gray-600 mb-6">
              this link is broken or corrupted.
            </p>
            <Link
              href="/"
              className="inline-flex items-center justify-center w-full py-4 px-6 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-2xl font-bold hover:from-purple-600 hover:to-pink-600 transition-all transform hover:scale-[1.02]"
            >
              create a new link
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const { payload } = await params;
  return <IntentionDisplay intention={intention} payload={payload} />;
}