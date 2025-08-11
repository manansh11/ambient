'use client';

import { useState } from 'react';
import { IntentionData, createIntentionUrl, formatTimeForDisplay } from '@/lib/intention';

interface ConfirmationScreenProps {
  data: IntentionData;
  onConfirm: (url: string, data: IntentionData) => void;
  onBack: () => void;
}

export default function ConfirmationScreen({ data, onConfirm, onBack }: ConfirmationScreenProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirm = async () => {
    setIsLoading(true);
    try {
      const url = createIntentionUrl(data);
      onConfirm(url, data);
    } catch (error) {
      console.error('Error creating link:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-lg p-6">
      <div className="text-center mb-6">
        <div className="text-4xl mb-2">👀</div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">
          look good?
        </h2>
        <p className="text-gray-600 text-sm">
          this is what your friends will see
        </p>
      </div>

      {/* Preview Card */}
      <div className="border-2 border-gray-200 rounded-2xl p-5 mb-6 bg-gray-50">
        <div className="text-center">
          <h3 className="text-lg font-bold text-gray-900 mb-2">
            {data.what}
          </h3>
          
          <div className="text-gray-700 mb-1">
            {formatTimeForDisplay(data.when)}
          </div>
          
          {data.where && (
            <div className="text-gray-600 mb-1">
              📍 {data.where}
            </div>
          )}
          
          {data.note && (
            <div className="text-gray-600 italic mt-2 text-sm">
              &quot;{data.note}&quot;
            </div>
          )}

          <div className="mt-4 py-3 px-4 bg-purple-100 text-purple-700 rounded-xl text-sm font-medium">
            i&rsquo;m interested! ✨
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        <button
          onClick={handleConfirm}
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-5 px-6 rounded-2xl text-lg font-bold hover:from-purple-600 hover:to-pink-600 focus:outline-none focus:ring-4 focus:ring-purple-200 disabled:opacity-50 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
        >
          {isLoading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Creating...
            </span>
          ) : (
            'create & share link ✨'
          )}
        </button>

        <button
          onClick={onBack}
          disabled={isLoading}
          className="w-full bg-gray-100 text-gray-700 py-4 px-6 rounded-2xl font-bold hover:bg-gray-200 transition-all"
        >
          go back and edit
        </button>
      </div>
    </div>
  );
}