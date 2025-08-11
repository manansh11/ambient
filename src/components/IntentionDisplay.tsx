'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { IntentionData, IntentionStats, getIntentionStats, updateIntentionStats, formatTimeForDisplay, getLocationPrecision, isIntentionExpired } from '@/lib/intention';

interface IntentionDisplayProps {
  intention: IntentionData;
  payload: string;
}

export default function IntentionDisplay({ intention, payload }: IntentionDisplayProps) {
  const [stats, setStats] = useState<IntentionStats>({ interested: 0, here: 0 });
  const [hasInteracted, setHasInteracted] = useState<'interested' | 'here' | null>(null);
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const initialStats = getIntentionStats(payload);
    setStats(initialStats);
    
    const userInteraction = localStorage.getItem(`ambient_user_${payload}`);
    if (userInteraction) {
      setHasInteracted(userInteraction as 'interested' | 'here');
    }

    setIsExpired(isIntentionExpired(intention));
  }, [payload, intention]);

  const handleInteraction = () => {
    if (hasInteracted || isExpired) return;

    const newStats = updateIntentionStats(payload, 'interested');
    setStats(newStats);
    setHasInteracted('interested');
    
    localStorage.setItem(`ambient_user_${payload}`, 'interested');
  };

  if (isExpired) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 px-4 py-8">
        <div className="max-w-md mx-auto">
          <header className="text-center mb-8">
            <h1 className="text-3xl font-black text-gray-900 mb-2">
              ambient
            </h1>
          </header>
          
          <div className="bg-white rounded-3xl shadow-lg p-6 text-center">
            <div className="text-6xl mb-4">⏰</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              this link has expired
            </h2>
            <p className="text-gray-600 mb-6">
              links automatically expire 2 hours after the scheduled time.
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 px-4 py-8">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <header className="text-center mb-8">
          <h1 className="text-3xl font-black text-gray-900 mb-2">
            ambient
          </h1>
          <p className="text-gray-600">
            someone wants to hang out!
          </p>
        </header>

        {/* Main Card */}
        <div className="bg-white rounded-3xl shadow-lg p-6 mb-6">
          <div className="text-center">
            {/* Activity */}
            <div className="mb-4">
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                {intention.what}
              </h2>
              
              {/* Time */}
              <div className="text-lg text-gray-700 mb-2">
                {formatTimeForDisplay(intention.when)}
              </div>
              
              {/* Location */}
              {intention.where && (
                <div className="text-gray-600 mb-2">
                  📍 {getLocationPrecision(intention)}
                </div>
              )}
              
              {/* Note */}
              {intention.note && (
                <div className="text-gray-600 italic mt-3 p-3 bg-gray-50 rounded-2xl">
                  &quot;{intention.note}&quot;
                </div>
              )}
            </div>

            {/* Stats */}
            {stats.interested > 0 && (
              <div className="mb-6 p-3 bg-purple-50 rounded-2xl">
                <div className="text-xl font-bold text-purple-700">
                  {stats.interested} {stats.interested === 1 ? 'person is' : 'people are'} interested
                </div>
              </div>
            )}

            {/* Action Button */}
            <button
              onClick={handleInteraction}
              disabled={hasInteracted !== null}
              className={`w-full py-5 px-6 rounded-2xl text-lg font-bold transition-all transform active:scale-[0.98] ${
                hasInteracted
                  ? 'bg-green-100 text-green-700 border-2 border-green-200'
                  : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 hover:scale-[1.02] shadow-lg'
              }`}
            >
              {hasInteracted ? '✨ you&rsquo;re in!' : 'count me in!'}
            </button>

            {!hasInteracted && (
              <div className="mt-3 text-center text-xs text-gray-500">
                on ambient, people share activities they&rsquo;re already doing and would love company for - no pressure to join
              </div>
            )}

            {hasInteracted && (
              <div className="mt-4 text-center text-sm text-gray-600">
                nice! you&rsquo;re all set. others can still join.
              </div>
            )}
          </div>
        </div>

        {/* Create Your Own */}
        <div className="text-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center w-full py-4 px-6 bg-gray-100 text-gray-700 rounded-2xl font-bold hover:bg-gray-200 transition-all"
          >
            create your own link
          </Link>
        </div>
      </div>
    </div>
  );
}