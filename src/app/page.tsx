'use client';

import { useState, useEffect } from 'react';
import IntentionForm from '@/components/IntentionForm';
import ConfirmationScreen from '@/components/ConfirmationScreen';
import { IntentionData } from '@/lib/intention';

interface SavedVibe {
  id: string;
  what: string;
  when: string;
  created: number;
  responses?: number;
}

export default function Home() {
  const [createdUrl, setCreatedUrl] = useState<string | null>(null);
  const [savedVibes, setSavedVibes] = useState<SavedVibe[]>([]);
  const [showMyVibes, setShowMyVibes] = useState(false);
  const [confirmationData, setConfirmationData] = useState<IntentionData | null>(null);

  useEffect(() => {
    // Load saved vibes from localStorage
    const saved = localStorage.getItem('my-vibes');
    if (saved) {
      setSavedVibes(JSON.parse(saved));
    }
  }, []);

  const handleIntentionPreview = (data: IntentionData) => {
    setConfirmationData(data);
  };

  const handleConfirmAndCreate = (url: string, data: IntentionData) => {
    setCreatedUrl(url);
    setConfirmationData(null);
    
    // Save to localStorage for tracking
    const vibe: SavedVibe = {
      id: url.split('/').pop() || '',
      what: data.what,
      when: data.when,
      created: Date.now(),
      responses: 0
    };
    
    const existing = savedVibes.filter(v => Date.now() - v.created < 86400000); // Keep only last 24h
    const updated = [...existing, vibe];
    setSavedVibes(updated);
    localStorage.setItem('my-vibes', JSON.stringify(updated));
    
    // Auto-copy to clipboard
    navigator.clipboard.writeText(url);
  };

  const handleBackToEdit = () => {
    setConfirmationData(null);
  };

  const checkResponses = async () => {
    // In a real app, this would fetch from an API
    // For now, we'll just check localStorage
    const updated = savedVibes.map(vibe => {
      const stats = localStorage.getItem(`ambient_stats_${vibe.id}`);
      if (stats) {
        const parsed = JSON.parse(stats);
        return { ...vibe, responses: parsed.interested || 0 };
      }
      return vibe;
    });
    setSavedVibes(updated);
    localStorage.setItem('my-vibes', JSON.stringify(updated));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <div className="max-w-md mx-auto px-4 py-8">
        {/* Header */}
        <header className="text-center mb-8">
          <h1 className="text-4xl font-black text-gray-900 mb-2">
            ambient
          </h1>
          <p className="text-lg text-gray-700 font-medium">
            do more stuff with your friends
          </p>
        </header>

        {!createdUrl && !showMyVibes && !confirmationData ? (
          <>
            {/* Main Form */}
            <div className="bg-white rounded-3xl shadow-lg p-6">
              <IntentionForm onIntentionPreview={handleIntentionPreview} />
            </div>

            {/* Check My Vibes */}
            {savedVibes.length > 0 && (
              <button
                onClick={() => {
                  checkResponses();
                  setShowMyVibes(true);
                }}
                className="w-full mt-4 text-gray-600 hover:text-gray-900 py-3 font-medium transition-colors"
              >
                check my links ({savedVibes.length})
              </button>
            )}
          </>
        ) : confirmationData ? (
          /* Confirmation View */
          <ConfirmationScreen 
            data={confirmationData}
            onConfirm={handleConfirmAndCreate}
            onBack={handleBackToEdit}
          />
        ) : showMyVibes ? (
          /* My Vibes View */
          <div className="bg-white rounded-3xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">your links</h2>
            <div className="space-y-3">
              {savedVibes.map((vibe, idx) => (
                <div key={idx} className="p-3 bg-gray-50 rounded-xl">
                  <div className="font-medium text-gray-900">{vibe.what}</div>
                  <div className="text-sm text-gray-600">
                    {new Date(vibe.when).toLocaleString()}
                  </div>
                  {vibe.responses && vibe.responses > 0 && (
                    <div className="text-sm font-bold text-blue-600 mt-1">
                      {vibe.responses} interested!
                    </div>
                  )}
                </div>
              ))}
            </div>
            <button
              onClick={() => {
                setShowMyVibes(false);
                setConfirmationData(null);
              }}
              className="w-full mt-6 bg-gray-900 text-white py-4 px-6 rounded-2xl font-bold hover:bg-gray-800 transition-all"
            >
              create new link
            </button>
          </div>
        ) : (
          /* Success View */
          <div className="bg-white rounded-3xl shadow-lg p-6 text-center">
            <div className="text-6xl mb-4">✨</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              link copied!
            </h2>
            <p className="text-gray-600 mb-6">
              share it anywhere and see who&rsquo;s down
            </p>
            
            <div className="space-y-3">
              {typeof navigator !== 'undefined' && 'share' in navigator && (
                <button
                  onClick={() => {
                    if (createdUrl) {
                      navigator.share({
                        title: 'Join me!',
                        url: createdUrl,
                      });
                    }
                  }}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 px-6 rounded-2xl font-bold hover:from-purple-700 hover:to-pink-700 transition-all transform hover:scale-[1.02]"
                >
                  share now
                </button>
              )}
              
              <button
                onClick={() => {
                  setCreatedUrl(null);
                  setConfirmationData(null);
                }}
                className="w-full bg-gray-100 text-gray-700 py-4 px-6 rounded-2xl font-bold hover:bg-gray-200 transition-all"
              >
                create another
              </button>

              {savedVibes.length > 0 && (
                <button
                  onClick={() => {
                    setCreatedUrl(null);
                    setConfirmationData(null);
                    checkResponses();
                    setShowMyVibes(true);
                  }}
                  className="w-full text-gray-600 hover:text-gray-900 py-3 font-medium transition-colors"
                >
                  check who&rsquo;s interested
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
