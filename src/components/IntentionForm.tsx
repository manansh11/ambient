'use client';

import { useState } from 'react';
import { IntentionData } from '@/lib/intention';

interface IntentionFormProps {
  onIntentionPreview: (data: IntentionData) => void;
}

export default function IntentionForm({ onIntentionPreview }: IntentionFormProps) {
  const [what, setWhat] = useState('');
  const [timePreset, setTimePreset] = useState('custom');
  const [when, setWhen] = useState(() => {
    const now = new Date();
    now.setMinutes(now.getMinutes() + 30);
    return now.toISOString().slice(0, 16);
  });
  const [where, setWhere] = useState('');
  const [note, setNote] = useState('');
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const getTimeForPreset = (preset: string) => {
    const now = new Date();
    switch (preset) {
      case 'now':
        return now.toISOString().slice(0, 16);
      case '30min':
        now.setMinutes(now.getMinutes() + 30);
        return now.toISOString().slice(0, 16);
      case 'tonight':
        now.setHours(19, 0, 0, 0);
        return now.toISOString().slice(0, 16);
      default:
        return when;
    }
  };

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!what.trim()) {
      newErrors.what = 'What are you up to?';
    }
    if (!when) {
      newErrors.when = 'When?';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    
    if (!validateForm()) {
      // Focus first error field
      setTimeout(() => {
        const firstErrorField = document.querySelector('[aria-invalid="true"]') as HTMLElement;
        firstErrorField?.focus();
      }, 100);
      return;
    }

    const intentionData: IntentionData = {
      what,
      when,
      where: where || undefined,
      note: note || undefined,
      createdAt: Date.now(),
    };

    onIntentionPreview(intentionData);
  };


  return (
    <form 
      onSubmit={handleSubmit} 
      className="space-y-4"
      noValidate
    >
      {/* What */}
      <div>
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
          placeholder="what are you up to?"
          className={`w-full px-5 py-4 text-lg border-2 rounded-2xl focus:outline-none transition-all text-gray-900 placeholder-gray-500 ${
            errors.what 
              ? 'border-red-400 bg-red-50' 
              : 'border-gray-200 focus:border-purple-400 bg-white'
          }`}
          aria-invalid={!!errors.what}
          required
        />
        {errors.what && (
          <div className="text-red-500 text-sm mt-2 px-2">
            {errors.what}
          </div>
        )}
      </div>

      {/* When - Smart Buttons */}
      <div>
        <div className="grid grid-cols-3 gap-2 mb-3">
          <button
            type="button"
            onClick={() => {
              setTimePreset('now');
              setWhen(getTimeForPreset('now'));
            }}
            className={`py-3 px-4 rounded-xl font-medium text-sm transition-all ${
              timePreset === 'now' 
                ? 'bg-purple-100 text-purple-700 border-2 border-purple-300' 
                : 'bg-gray-100 text-gray-700 border-2 border-gray-200'
            }`}
          >
            now
          </button>
          <button
            type="button"
            onClick={() => {
              setTimePreset('30min');
              setWhen(getTimeForPreset('30min'));
            }}
            className={`py-3 px-4 rounded-xl font-medium text-sm transition-all ${
              timePreset === '30min' 
                ? 'bg-purple-100 text-purple-700 border-2 border-purple-300' 
                : 'bg-gray-100 text-gray-700 border-2 border-gray-200'
            }`}
          >
            in 30min
          </button>
          <button
            type="button"
            onClick={() => {
              setTimePreset('tonight');
              setWhen(getTimeForPreset('tonight'));
            }}
            className={`py-3 px-4 rounded-xl font-medium text-sm transition-all ${
              timePreset === 'tonight' 
                ? 'bg-purple-100 text-purple-700 border-2 border-purple-300' 
                : 'bg-gray-100 text-gray-700 border-2 border-gray-200'
            }`}
          >
            tonight
          </button>
        </div>
        
        <button
          type="button"
          onClick={() => setTimePreset('custom')}
          className={`w-full text-left px-5 py-4 border-2 rounded-2xl transition-all ${
            timePreset === 'custom'
              ? 'border-purple-400 bg-white'
              : 'border-gray-200 bg-gray-50 text-gray-600'
          }`}
        >
          {timePreset === 'custom' ? (
            <input
              type="datetime-local"
              value={when}
              onChange={(e) => {
                setWhen(e.target.value);
                if (errors.when) {
                  setErrors(prev => ({ ...prev, when: '' }));
                }
              }}
              className="w-full bg-transparent focus:outline-none text-gray-900 text-lg"
              aria-invalid={!!errors.when}
            />
          ) : (
            <span className="text-gray-500">pick custom time...</span>
          )}
        </button>
        {errors.when && (
          <div className="text-red-500 text-sm mt-2 px-2">
            {errors.when}
          </div>
        )}
      </div>

      {/* Where */}
      <div>
        <input
          type="text"
          id="where"
          value={where}
          onChange={(e) => setWhere(e.target.value)}
          placeholder="where? (optional)"
          className="w-full px-5 py-4 text-lg border-2 border-gray-200 rounded-2xl focus:border-purple-400 focus:outline-none transition-all text-gray-900 placeholder-gray-500 bg-white"
        />
      </div>

      {/* Note */}
      <div>
        <input
          type="text"
          id="note"
          value={note}
          onChange={(e) => setNote(e.target.value.slice(0, 50))}
          placeholder="quick note? (optional)"
          maxLength={50}
          className="w-full px-5 py-4 text-lg border-2 border-gray-200 rounded-2xl focus:border-purple-400 focus:outline-none transition-all text-gray-900 placeholder-gray-500 bg-white"
        />
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={!what.trim()}
        className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-5 px-6 rounded-2xl text-lg font-bold hover:from-purple-600 hover:to-pink-600 focus:outline-none focus:ring-4 focus:ring-purple-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-[1.02] active:scale-[0.98]"
      >
        create link ✨
      </button>
    </form>
  );
}