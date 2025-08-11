# Ambient - Feature Implementation Guide

## Core Features Overview

This guide explains how Ambient's key features work and how to extend them while maintaining the zero-friction philosophy.

## Smart Time Presets

### Current Implementation

The smart time preset system simplifies intention scheduling:

```typescript
const getTimeForPreset = (preset: string) => {
  const now = new Date();
  switch (preset) {
    case 'now':
      return now.toISOString().slice(0, 16);
    case '30min':
      now.setMinutes(now.getMinutes() + 30);
      return now.toISOString().slice(0, 16);
    case 'tonight':
      now.setHours(19, 0, 0, 0); // 7 PM today
      return now.toISOString().slice(0, 16);
    default:
      return when;
  }
};
```

### Extending Time Presets

To add new presets, modify both the UI and logic:

```typescript
// Add to button array in IntentionForm.tsx
const timePresets = [
  { key: 'now', label: 'now' },
  { key: '30min', label: 'in 30min' },
  { key: 'tonight', label: 'tonight' },
  { key: 'weekend', label: 'this weekend' }, // NEW
];

// Add logic to getTimeForPreset
case 'weekend':
  const today = now.getDay();
  const daysUntilSaturday = (6 - today + 7) % 7 || 7;
  now.setDate(now.getDate() + daysUntilSaturday);
  now.setHours(14, 0, 0, 0); // 2 PM Saturday
  return now.toISOString().slice(0, 16);
```

## Progressive Location Disclosure

### Privacy-by-Design Location Sharing

Location precision changes based on temporal proximity:

```typescript
export function getLocationPrecision(intention: IntentionData): string {
  if (!intention.where) return '';
  
  const eventTime = new Date(intention.when).getTime();
  const now = Date.now();
  const timeDifference = eventTime - now;
  const oneHourInMs = 60 * 60 * 1000;
  
  // If event is more than 1 hour away, reduce location precision
  if (timeDifference > oneHourInMs) {
    const parts = intention.where.split(',');
    if (parts.length > 1) {
      return parts.slice(-2).join(',').trim(); // Last 2 parts (neighborhood, city)
    }
  }
  
  return intention.where;
}
```

### Enhancing Location Features

Add geolocation API integration:

```typescript
// New utility function
export const getCurrentLocation = (): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject('Geolocation not supported');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        
        // Reverse geocoding (requires API key)
        try {
          const response = await fetch(
            `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=${API_KEY}`
          );
          const data = await response.json();
          const address = data.results[0]?.formatted || 'Current location';
          resolve(address);
        } catch {
          resolve(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
        }
      },
      (error) => reject(error.message),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  });
};

// Integrate into IntentionForm
const handleUseCurrentLocation = async () => {
  try {
    const location = await getCurrentLocation();
    setWhere(location);
  } catch (error) {
    console.error('Location error:', error);
    // Graceful fallback - don't block user flow
  }
};
```

## Social Proof System

### Current Interaction Tracking

The social proof system tracks engagement without requiring authentication:

```typescript
export function updateIntentionStats(payload: string, type: 'interested' | 'here'): IntentionStats {
  const stats = getIntentionStats(payload);
  stats[type] += 1;
  
  const key = getStorageKey(payload);
  localStorage.setItem(key, JSON.stringify(stats));
  
  return stats;
}

// Prevent double-counting per user
const handleInteraction = () => {
  if (hasInteracted || isExpired) return;

  const newStats = updateIntentionStats(payload, 'interested');
  setStats(newStats);
  setHasInteracted('interested');
  
  localStorage.setItem(`ambient_user_${payload}`, 'interested');
};
```

### Enhancing Social Features

Add "I'm here" functionality:

```typescript
// Extend IntentionDisplay component
const [showHereButton, setShowHereButton] = useState(false);

useEffect(() => {
  const eventTime = new Date(intention.when).getTime();
  const now = Date.now();
  const thirtyMinutesInMs = 30 * 60 * 1000;
  
  // Show "I'm here" button 30 minutes before event
  setShowHereButton(now >= (eventTime - thirtyMinutesInMs) && !isExpired);
}, [intention.when, isExpired]);

const handleHereInteraction = () => {
  if (hasInteracted) return;
  
  const newStats = updateIntentionStats(payload, 'here');
  setStats(newStats);
  setHasInteracted('here');
  
  localStorage.setItem(`ambient_user_${payload}`, 'here');
};

// UI for "I'm here" button
{showHereButton && (
  <button
    onClick={handleHereInteraction}
    className="w-full mt-3 py-4 px-6 bg-green-500 text-white rounded-2xl font-bold hover:bg-green-600 transition-all"
  >
    I'm here! 📍
  </button>
)}
```

## Automatic Link Expiration

### Current Expiration Logic

Links automatically expire 2 hours after the scheduled time:

```typescript
export function isIntentionExpired(intention: IntentionData): boolean {
  const eventTime = new Date(intention.when).getTime();
  const now = Date.now();
  const twoHoursInMs = 2 * 60 * 60 * 1000;
  
  return now > (eventTime + twoHoursInMs);
}
```

### Customizable Expiration

Add flexible expiration policies:

```typescript
interface ExpirationPolicy {
  beforeEvent: number; // Minutes before event
  afterEvent: number;  // Minutes after event
}

const expirationPolicies: Record<string, ExpirationPolicy> = {
  'immediate': { beforeEvent: 0, afterEvent: 0 },
  'standard': { beforeEvent: 0, afterEvent: 120 }, // Current default
  'extended': { beforeEvent: 0, afterEvent: 360 }, // 6 hours
  'flexible': { beforeEvent: -30, afterEvent: 240 }, // 30min early, 4hr late
};

export function isIntentionExpired(
  intention: IntentionData, 
  policy: ExpirationPolicy = expirationPolicies.standard
): boolean {
  const eventTime = new Date(intention.when).getTime();
  const now = Date.now();
  
  const beforeMs = policy.beforeEvent * 60 * 1000;
  const afterMs = policy.afterEvent * 60 * 1000;
  
  return now < (eventTime - beforeMs) || now > (eventTime + afterMs);
}
```

## Link Tracking & Analytics

### Current Tracking Implementation

Basic tracking with localStorage:

```typescript
interface SavedVibe {
  id: string;
  what: string;
  when: string;
  created: number;
  responses?: number;
}

const handleConfirmAndCreate = (url: string, data: IntentionData) => {
  const vibe: SavedVibe = {
    id: url.split('/').pop() || '',
    what: data.what,
    when: data.when,
    created: Date.now(),
    responses: 0
  };
  
  // 24-hour cleanup policy
  const existing = savedVibes.filter(v => Date.now() - v.created < 86400000);
  const updated = [...existing, vibe];
  setSavedVibes(updated);
  localStorage.setItem('my-vibes', JSON.stringify(updated));
};
```

### Enhanced Analytics

Add privacy-preserving analytics:

```typescript
interface IntentionAnalytics {
  created: number;
  firstView: number | null;
  totalViews: number;
  uniqueVisitors: Set<string>;
  interested: number;
  here: number;
  shareClicks: number;
  platform: Record<string, number>; // Twitter, Facebook, etc.
}

// Privacy-preserving visitor tracking
const generateVisitorId = (): string => {
  // Generate temporary, non-identifiable ID
  return `v_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

const trackView = (payload: string) => {
  const visitorId = sessionStorage.getItem('visitor_id') || generateVisitorId();
  sessionStorage.setItem('visitor_id', visitorId);
  
  const analytics = getIntentionAnalytics(payload);
  
  if (!analytics.firstView) {
    analytics.firstView = Date.now();
  }
  
  analytics.totalViews += 1;
  analytics.uniqueVisitors.add(visitorId);
  
  saveIntentionAnalytics(payload, analytics);
};
```

## Rich Link Previews

### Current Open Graph Implementation

Dynamic OG image generation:

```typescript
// /api/og/route.tsx
return new ImageResponse(
  (
    <div style={{ /* Styled card layout */ }}>
      <h1>{intention.what}</h1>
      <div>{timeDisplay}</div>
      {location && <div>📍 {location}</div>}
      {intention.note && <div>"{intention.note}"</div>}
    </div>
  ),
  { width: 1200, height: 630 }
);
```

### Enhanced Preview Features

Add platform-specific optimizations:

```typescript
// Platform detection from user agent
const detectPlatform = (userAgent: string): string => {
  if (userAgent.includes('facebookexternalhit')) return 'facebook';
  if (userAgent.includes('Twitterbot')) return 'twitter';
  if (userAgent.includes('LinkedInBot')) return 'linkedin';
  if (userAgent.includes('WhatsApp')) return 'whatsapp';
  return 'generic';
};

// Platform-optimized image generation
export async function GET(request: NextRequest) {
  const userAgent = request.headers.get('user-agent') || '';
  const platform = detectPlatform(userAgent);
  
  const intention = decodeIntention(payload);
  
  // Platform-specific styling
  const platformStyles = {
    facebook: { gradient: 'facebook-blue', fontSize: 44 },
    twitter: { gradient: 'twitter-blue', fontSize: 42 },
    whatsapp: { gradient: 'whatsapp-green', fontSize: 40 },
    generic: { gradient: 'ambient-purple', fontSize: 48 }
  };
  
  const style = platformStyles[platform] || platformStyles.generic;
  
  return new ImageResponse(
    <div style={{ /* Apply platform-specific styling */ }} />
  );
}
```

## Accessibility Enhancements

### Current Accessibility Features

- ARIA labels for form validation
- Keyboard navigation support
- High contrast color ratios
- Touch-friendly target sizes

### Advanced Accessibility

Add screen reader support and better keyboard navigation:

```typescript
// Enhanced form component
const IntentionForm = () => {
  const [announcements, setAnnouncements] = useState('');
  
  const announceToScreenReader = (message: string) => {
    setAnnouncements(message);
    setTimeout(() => setAnnouncements(''), 1000);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      announceToScreenReader('Please fix the errors in the form');
      return;
    }
    announceToScreenReader('Creating your intention link');
    onIntentionPreview(intentionData);
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <div 
        role="status" 
        aria-live="polite" 
        className="sr-only"
      >
        {announcements}
      </div>
      
      {/* Form fields with enhanced ARIA */}
      <input
        aria-describedby={errors.what ? 'what-error' : 'what-description'}
        aria-required="true"
        aria-invalid={!!errors.what}
      />
      
      {errors.what && (
        <div id="what-error" role="alert" className="text-red-500">
          {errors.what}
        </div>
      )}
    </form>
  );
};
```

## Testing Strategy Implementation

### Unit Testing Setup

```typescript
// __tests__/intention.test.ts
import { encodeIntention, decodeIntention, isIntentionExpired } from '../src/lib/intention';

describe('Intention encoding/decoding', () => {
  const mockIntention = {
    what: 'coffee meetup',
    when: '2025-08-11T14:30:00',
    where: 'Central Park',
    note: 'bring laptop',
    createdAt: Date.now()
  };

  test('encodes and decodes intention data correctly', () => {
    const encoded = encodeIntention(mockIntention);
    const decoded = decodeIntention(encoded);
    
    expect(decoded.what).toBe(mockIntention.what);
    expect(decoded.when).toBe(mockIntention.when);
    expect(decoded.where).toBe(mockIntention.where);
  });

  test('handles expiration correctly', () => {
    const expiredIntention = {
      ...mockIntention,
      when: '2023-01-01T12:00:00' // Past date
    };
    
    expect(isIntentionExpired(expiredIntention)).toBe(true);
  });
});
```

### Integration Testing

```typescript
// __tests__/integration/intention-flow.test.tsx
import { render, fireEvent, waitFor } from '@testing-library/react';
import IntentionForm from '../src/components/IntentionForm';

describe('Intention creation flow', () => {
  test('creates intention link successfully', async () => {
    const mockOnPreview = jest.fn();
    const { getByPlaceholderText, getByText } = render(
      <IntentionForm onIntentionPreview={mockOnPreview} />
    );
    
    fireEvent.change(getByPlaceholderText('what are you up to?'), {
      target: { value: 'coffee meetup' }
    });
    
    fireEvent.click(getByText('create link ✨'));
    
    await waitFor(() => {
      expect(mockOnPreview).toHaveBeenCalledWith(
        expect.objectContaining({
          what: 'coffee meetup'
        })
      );
    });
  });
});
```

This feature implementation guide provides the foundation for extending Ambient while maintaining its core principles of simplicity, privacy, and zero friction.