'use client';

import { useState } from 'react';
import IntentionForm from '@/components/IntentionForm';

export default function Home() {
  const [createdUrl, setCreatedUrl] = useState<string | null>(null);

  const handleIntentionCreated = (url: string) => {
    setCreatedUrl(url);
  };

  const copyToClipboard = async () => {
    if (createdUrl) {
      await navigator.clipboard.writeText(createdUrl);
      alert('URL copied to clipboard!');
    }
  };

  const shareUrl = () => {
    if (createdUrl && typeof navigator !== 'undefined' && 'share' in navigator) {
      navigator.share({
        title: 'Join me for this',
        url: createdUrl,
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-16 px-6">
      <div className="max-w-2xl mx-auto">
        <header className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6 tracking-tight">
            Ambient
          </h1>
          <p className="text-xl text-gray-600 max-w-lg mx-auto leading-relaxed">
            Share intentions, skip negotiations.
          </p>
        </header>

        {!createdUrl ? (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl shadow-blue-100/50 p-10">
            <h2 className="text-xl font-semibold text-gray-800 mb-6 text-center">
              Create Your Intention
            </h2>
            <IntentionForm onIntentionCreated={handleIntentionCreated} />
          </div>
        ) : (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl shadow-blue-100/50 p-10">
            <h2 className="text-xl font-semibold text-gray-800 mb-6 text-center">
              Your intention is out there
            </h2>
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg border">
                <div className="text-sm text-gray-600 mb-2">Share this link:</div>
                <div className="font-mono text-sm break-all text-blue-600">
                  {createdUrl}
                </div>
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={copyToClipboard}
                  className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-xl hover:bg-blue-700 transition-all duration-200"
                >
                  Copy Link
                </button>
                {typeof navigator !== 'undefined' && 'share' in navigator && (
                  <button
                    onClick={shareUrl}
                    className="flex-1 bg-green-600 text-white py-3 px-4 rounded-xl hover:bg-green-700 transition-all duration-200"
                  >
                    Share
                  </button>
                )}
              </div>
              
              <button
                onClick={() => setCreatedUrl(null)}
                className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-xl hover:bg-gray-200 transition-all duration-200 font-medium"
              >
                Share Another Intention
              </button>
            </div>
          </div>
        )}

        <footer className="text-center mt-12 text-sm text-gray-500">
          <p>Share your link anywhere and see what happens naturally.</p>
        </footer>
      </div>
    </div>
  );
}
