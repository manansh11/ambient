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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4">
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="text-gray-400 text-5xl mb-4">⏰</div>
            <h1 className="text-2xl font-semibold text-gray-800 mb-2">
              This intention has expired
            </h1>
            <p className="text-gray-600">
              Intentions automatically expire 2 hours after the scheduled time.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-16 px-6">
      <div className="max-w-md mx-auto">
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl shadow-blue-100/50 overflow-hidden">
          {/* Gradient header */}
          <div className="h-3 bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-500"></div>
          
          <div className="p-10">
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                {intention.what}
              </h1>
              <div className="text-lg text-gray-600 mb-1">
                {formatTimeForDisplay(intention.when)}
              </div>
              {intention.where && (
                <div className="text-gray-500">
                  📍 {getLocationPrecision(intention)}
                </div>
              )}
              {intention.note && (
                <div className="text-gray-600 italic mt-2">
                  &quot;{intention.note}&quot;
                </div>
              )}
            </div>

            {/* Stats display */}
            <div className="flex justify-center mb-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">
                  {stats.interested}
                </div>
                <div className="text-sm text-gray-500">others interested</div>
              </div>
            </div>

            {/* Interaction button */}
            <div>
              <button
                onClick={handleInteraction}
                disabled={hasInteracted !== null}
                className={`w-full py-4 px-6 rounded-2xl font-medium transition-all duration-200 ${
                  hasInteracted
                    ? 'bg-blue-100 text-blue-800 border border-blue-200'
                    : 'bg-blue-600 text-white hover:bg-blue-700 transform hover:scale-[1.02]'
                }`}
              >
                {hasInteracted ? '✓ You\'re in!' : 'Count me in'}
              </button>
            </div>

            {hasInteracted && (
              <div className="mt-4 text-center text-sm text-gray-500">
                You&rsquo;re in. Others can still join naturally.
              </div>
            )}
          </div>
        </div>

        <div className="text-center mt-6">
          <Link
            href="/"
            className="text-blue-600 hover:text-blue-800 text-sm"
          >
            Share your own intention
          </Link>
        </div>
      </div>
    </div>
  );
}