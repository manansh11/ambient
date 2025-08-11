# Ambient - State Management Guide

## State Management Philosophy

Ambient uses a hybrid state management approach that prioritizes simplicity and user privacy:

- **URL as Source of Truth**: Intention data encoded in shareable URLs
- **localStorage for Persistence**: Local-only tracking without server dependencies
- **Component State for UI**: React hooks for immediate user interface needs
- **No Global State**: Each component manages its own required state

## URL-Based State Management

### Core Concept
URLs serve as the primary mechanism for sharing application state across users and sessions.

```typescript
// Intention data is encoded directly into URLs
const intentionUrl = `${origin}/i/${encodedPayload}`;

// Example: /i/eyJ3aGF0IjoiY29mZmVlIn0
// Decodes to: {"what": "coffee", "when": "2025-08-11T14:30:00", ...}
```

### Benefits
- **Shareable State**: URLs contain all necessary context
- **No Authentication**: Zero signup friction
- **Platform Agnostic**: Works across all messaging platforms
- **Stateless Server**: No backend storage requirements

### Implementation Pattern

```typescript
// Encoding intention data into URLs
export function createIntentionUrl(data: IntentionData): string {
  const payload = encodeIntention(data);
  return `${window.location.origin}/i/${payload}`;
}

// URL decoding on page load
export async function generateMetadata({ params }: PageProps) {
  const { payload } = await params;
  const intention = decodeIntention(payload);
  // Use decoded data for page metadata
}
```

## localStorage State Patterns

### Data Categories

Ambient uses localStorage for three distinct types of data:

1. **User's Created Intentions** (`my-vibes`)
2. **Social Interaction Stats** (`ambient_stats_${payload}`)
3. **User Interaction Tracking** (`ambient_user_${payload}`)

### Storage Schema

```typescript
// User's created intentions (24h retention)
interface SavedVibe {
  id: string;        // URL payload
  what: string;      // Activity description
  when: string;      // ISO datetime
  created: number;   // Creation timestamp
  responses?: number; // Interaction count
}

// Social proof statistics
interface IntentionStats {
  interested: number; // "Count me in" clicks
  here: number;      // Reserved for future use
}

// User interaction state
type UserInteraction = 'interested' | 'here';
```

### Storage Implementation

```typescript
class AmbientStorage {
  // Save user's created intention
  static saveVibe(vibe: SavedVibe): void {
    const existing = this.getSavedVibes();
    const filtered = existing.filter(v => 
      Date.now() - v.created < 86400000 // 24h retention
    );
    const updated = [...filtered, vibe];
    localStorage.setItem('my-vibes', JSON.stringify(updated));
  }

  // Get saved intentions
  static getSavedVibes(): SavedVibe[] {
    const stored = localStorage.getItem('my-vibes');
    return stored ? JSON.parse(stored) : [];
  }

  // Update social stats
  static updateStats(payload: string, type: 'interested' | 'here'): IntentionStats {
    const stats = this.getStats(payload);
    stats[type] += 1;
    localStorage.setItem(`ambient_stats_${payload}`, JSON.stringify(stats));
    return stats;
  }

  // Track user interaction
  static markUserInteraction(payload: string, type: UserInteraction): void {
    localStorage.setItem(`ambient_user_${payload}`, type);
  }
}
```

## Component State Management

### React Hooks Patterns

Ambient components use standard React hooks for local state management:

```typescript
// Main page state orchestration
const [createdUrl, setCreatedUrl] = useState<string | null>(null);
const [savedVibes, setSavedVibes] = useState<SavedVibe[]>([]);
const [showMyVibes, setShowMyVibes] = useState(false);
const [confirmationData, setConfirmationData] = useState<IntentionData | null>(null);

// Form state with validation
const [what, setWhat] = useState('');
const [when, setWhen] = useState(() => {
  const now = new Date();
  now.setMinutes(now.getMinutes() + 30);
  return now.toISOString().slice(0, 16);
});
const [errors, setErrors] = useState<{[key: string]: string}>({});

// Interaction state
const [stats, setStats] = useState<IntentionStats>({ interested: 0, here: 0 });
const [hasInteracted, setHasInteracted] = useState<'interested' | 'here' | null>(null);
```

### State Synchronization

Components synchronize with localStorage on mount and updates:

```typescript
useEffect(() => {
  // Load saved data on component mount
  const saved = localStorage.getItem('my-vibes');
  if (saved) {
    setSavedVibes(JSON.parse(saved));
  }
}, []);

useEffect(() => {
  // Sync stats with localStorage
  const initialStats = getIntentionStats(payload);
  setStats(initialStats);
  
  const userInteraction = localStorage.getItem(`ambient_user_${payload}`);
  if (userInteraction) {
    setHasInteracted(userInteraction as 'interested' | 'here');
  }
}, [payload]);
```

## State Flow Patterns

### Intention Creation Flow

```typescript
// 1. Form validation and data preparation
const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  if (!validateForm()) return;
  
  const intentionData: IntentionData = {
    what, when, where, note, createdAt: Date.now()
  };
  onIntentionPreview(intentionData);
};

// 2. Confirmation and URL generation
const handleConfirmAndCreate = (url: string, data: IntentionData) => {
  setCreatedUrl(url);
  
  const vibe: SavedVibe = {
    id: url.split('/').pop() || '',
    what: data.what,
    when: data.when,
    created: Date.now(),
    responses: 0
  };
  
  // Update local state and storage
  const updated = [...existingVibes, vibe];
  setSavedVibes(updated);
  localStorage.setItem('my-vibes', JSON.stringify(updated));
  navigator.clipboard.writeText(url);
};
```

### View State Management

The main page uses conditional rendering based on state:

```typescript
const getCurrentView = () => {
  if (confirmationData) return 'confirmation';
  if (showMyVibes) return 'vibes-list';
  if (createdUrl) return 'success';
  return 'form';
};

// Render logic
{getCurrentView() === 'form' && <IntentionForm onIntentionPreview={setConfirmationData} />}
{getCurrentView() === 'confirmation' && <ConfirmationScreen />}
{getCurrentView() === 'vibes-list' && <MyVibesList />}
{getCurrentView() === 'success' && <SuccessScreen />}
```

## Data Persistence Strategies

### Retention Policies

Different data types have different retention characteristics:

```typescript
// User's created intentions: 24 hour cleanup
const cleanupVibes = (vibes: SavedVibe[]) => {
  const dayAgo = Date.now() - 86400000; // 24 hours
  return vibes.filter(vibe => vibe.created > dayAgo);
};

// Interaction stats: Persistent until manual cleanup
// User interaction flags: Persistent per intention
```

### Error Recovery

localStorage operations include error handling:

```typescript
const safeLocalStorageOperation = <T>(
  key: string, 
  defaultValue: T,
  operation?: (current: T) => T
): T => {
  try {
    const stored = localStorage.getItem(key);
    const current = stored ? JSON.parse(stored) : defaultValue;
    
    if (operation) {
      const updated = operation(current);
      localStorage.setItem(key, JSON.stringify(updated));
      return updated;
    }
    
    return current;
  } catch (error) {
    console.warn(`localStorage operation failed for key: ${key}`, error);
    return defaultValue;
  }
};
```

## State Testing Strategies

### Mocking localStorage

```typescript
// Test helper for localStorage mocking
const mockLocalStorage = () => {
  const store: {[key: string]: string} = {};
  
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => store[key] = value,
    removeItem: (key: string) => delete store[key],
    clear: () => Object.keys(store).forEach(key => delete store[key])
  };
};

// Usage in tests
Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage()
});
```

### State Validation

```typescript
// Type guards for runtime validation
const isValidSavedVibe = (obj: any): obj is SavedVibe => {
  return obj && 
    typeof obj.id === 'string' &&
    typeof obj.what === 'string' &&
    typeof obj.when === 'string' &&
    typeof obj.created === 'number';
};

// Validation in storage operations
const getSavedVibesWithValidation = (): SavedVibe[] => {
  try {
    const stored = localStorage.getItem('my-vibes');
    if (!stored) return [];
    
    const parsed = JSON.parse(stored);
    if (!Array.isArray(parsed)) return [];
    
    return parsed.filter(isValidSavedVibe);
  } catch {
    return [];
  }
};
```

## Performance Considerations

### Batched Updates

Multiple state updates are batched for performance:

```typescript
// React automatically batches these updates
const handleMultipleUpdates = () => {
  setCreatedUrl(url);
  setConfirmationData(null);
  setSavedVibes(updated);
  // All updates happen in single re-render
};
```

### Lazy Loading

State loading happens only when needed:

```typescript
// Load vibes only when viewing the list
const loadVibesLazily = () => {
  if (showMyVibes && savedVibes.length === 0) {
    const stored = localStorage.getItem('my-vibes');
    if (stored) {
      setSavedVibes(JSON.parse(stored));
    }
  }
};
```

This state management approach ensures Ambient remains fast, private, and friction-free while providing rich social coordination features.