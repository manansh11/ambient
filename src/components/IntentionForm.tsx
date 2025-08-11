'use client';

import { useState } from 'react';
import { IntentionData, createIntentionUrl } from '@/lib/intention';

interface IntentionFormProps {
  onIntentionCreated: (url: string) => void;
}

export default function IntentionForm({ onIntentionCreated }: IntentionFormProps) {
  const [what, setWhat] = useState('');
  const [when, setWhen] = useState(() => {
    const now = new Date();
    now.setMinutes(now.getMinutes() + 30);
    return now.toISOString().slice(0, 16);
  });
  const [where, setWhere] = useState('');
  const [note, setNote] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [submitError, setSubmitError] = useState('');

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!what.trim()) {
      newErrors.what = 'Please describe what you\'re doing';
    }
    if (!when) {
      newErrors.when = 'Please select when you\'ll be doing this';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setSubmitError('');
    
    if (!validateForm()) {
      // Focus first error field
      setTimeout(() => {
        const firstErrorField = document.querySelector('[aria-invalid="true"]') as HTMLElement;
        firstErrorField?.focus();
      }, 100);
      return;
    }

    setIsLoading(true);

    try {
      const intentionData: IntentionData = {
        what,
        when,
        where: where || undefined,
        note: note || undefined,
        createdAt: Date.now(),
      };

      const url = createIntentionUrl(intentionData);
      onIntentionCreated(url);
    } catch (error) {
      console.error('Error creating intention:', error);
      setSubmitError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="w-full max-w-md mx-auto">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Share Your Intention
        </h2>
        <p className="text-sm text-gray-600">
          Put your intentions out there and see what happens naturally.
        </p>
      </div>
      
      <form 
        onSubmit={handleSubmit} 
        className="space-y-8"
        noValidate
        aria-describedby="form-instructions"
      >
        <div id="form-instructions" className="sr-only">
          Share what you&rsquo;re planning to do and when. 
          Fields marked with asterisk are required.
        </div>

        <div>
          <label htmlFor="what" className="block text-sm font-medium text-gray-700 mb-2">
            What are you doing? *
          </label>
          <input
            type="text"
            id="what"
            value={what}
            onChange={(e) => {
              setWhat(e.target.value);
              if (errors.what) {
                setErrors(prev => ({ ...prev, what: '' }));
              }
            }}
            placeholder="Working at coffee shop"
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-offset-2 focus:outline-none transition-colors text-gray-900 placeholder-gray-400 ${
              errors.what 
                ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
                : 'border-gray-300 focus:ring-blue-500 focus:border-transparent'
            }`}
            aria-invalid={!!errors.what}
            aria-describedby={errors.what ? "what-error" : undefined}
            required
          />
          {errors.what && (
            <div id="what-error" role="alert" className="text-red-600 text-sm mt-1">
              {errors.what}
            </div>
          )}
        </div>

        <div>
          <label htmlFor="when" className="block text-sm font-medium text-gray-700 mb-2">
            When? *
          </label>
          <input
            type="datetime-local"
            id="when"
            value={when}
            onChange={(e) => {
              setWhen(e.target.value);
              if (errors.when) {
                setErrors(prev => ({ ...prev, when: '' }));
              }
            }}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-offset-2 focus:outline-none transition-colors text-gray-900 ${
              errors.when 
                ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
                : 'border-gray-300 focus:ring-blue-500 focus:border-transparent'
            }`}
            aria-invalid={!!errors.when}
            aria-describedby={errors.when ? "when-error" : undefined}
            required
          />
          {errors.when && (
            <div id="when-error" role="alert" className="text-red-600 text-sm mt-1">
              {errors.when}
            </div>
          )}
        </div>

        <div>
          <label htmlFor="where" className="block text-sm font-medium text-gray-700 mb-2">
            Where? (optional)
          </label>
          <input
            type="text"
            id="where"
            value={where}
            onChange={(e) => setWhere(e.target.value)}
            placeholder="Blue Bottle Coffee, Mission District"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:outline-none focus:ring-offset-2 transition-colors text-gray-900 placeholder-gray-400"
          />
        </div>

        <div>
          <label htmlFor="note" className="block text-sm font-medium text-gray-700 mb-2">
            Note (optional)
          </label>
          <input
            type="text"
            id="note"
            value={note}
            onChange={(e) => setNote(e.target.value.slice(0, 100))}
            placeholder="Bringing my dog"
            maxLength={100}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:outline-none focus:ring-offset-2 transition-colors text-gray-900 placeholder-gray-400"
            aria-describedby="note-counter"
          />
          <div 
            id="note-counter" 
            className="text-xs text-gray-600 mt-1"
            aria-live="polite"
            aria-label={`${note.length} of 100 characters used`}
          >
            {note.length}/100 characters
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 text-white py-4 px-6 rounded-2xl font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          aria-describedby={submitError ? "submit-error" : undefined}
        >
          <span className="flex items-center justify-center">
            {isLoading && (
              <svg 
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            )}
            {isLoading ? 'Sharing your intention...' : 'Share My Intention'}
          </span>
        </button>

        {submitError && (
          <div id="submit-error" role="alert" className="text-red-600 text-sm mt-2 text-center">
            {submitError}
          </div>
        )}

        {/* Live region for form status */}
        <div aria-live="polite" aria-atomic="true" className="sr-only">
          {isLoading && "Creating your ambient link, please wait..."}
        </div>
      </form>
    </div>
  );
}