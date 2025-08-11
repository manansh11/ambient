# Ambient - Detailed Component Reference

## IntentionForm Component

### Smart Time Presets System

The form includes intelligent time selection with three preset options:

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

### Form Validation Logic

Real-time validation with immediate feedback:

```typescript
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
```

### Accessibility Implementation

- **Error States**: `aria-invalid` attributes for screen readers
- **Required Fields**: Proper `required` attribute usage  
- **Focus Management**: Automatic focus on first error field
- **Keyboard Navigation**: Full keyboard accessibility

### Input Field Specifications

| Field | Type | Validation | Max Length | Required |
|-------|------|------------|------------|----------|
| what | text | Non-empty string | None | Yes |
| when | datetime-local | Valid ISO datetime | None | Yes |
| where | text | Any string | None | No |
| note | text | Any string | 50 chars | No |

## ConfirmationScreen Component

### Preview Rendering Logic

The confirmation screen mirrors the public intention display:

```typescript
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
        "{data.note}"
      </div>
    )}

    <div className="mt-4 py-3 px-4 bg-purple-100 text-purple-700 rounded-xl text-sm font-medium">
      i'm interested! ✨
    </div>
  </div>
</div>
```

### Loading State Implementation

Async URL creation with loading feedback:

```typescript
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
```

## IntentionDisplay Component

### Expiration Logic

Intentions expire 2 hours after the event time:

```typescript
useEffect(() => {
  setIsExpired(isIntentionExpired(intention));
}, [payload, intention]);

// In intention.ts
export function isIntentionExpired(intention: IntentionData): boolean {
  const eventTime = new Date(intention.when).getTime();
  const now = Date.now();
  const twoHoursInMs = 2 * 60 * 60 * 1000;
  
  return now > (eventTime + twoHoursInMs);
}
```

### Progressive Location Disclosure

Location precision changes based on timing:

```typescript
export function getLocationPrecision(intention: IntentionData): string {
  if (!intention.where) return '';
  
  const eventTime = new Date(intention.when).getTime();
  const now = Date.now();
  const timeDifference = eventTime - now;
  const oneHourInMs = 60 * 60 * 1000;
  
  // If event is more than 1 hour away, reduce location precision
  if (timeDifference > oneHourInMs) {
    // Extract neighborhood/area from full address
    const parts = intention.where.split(',');
    if (parts.length > 1) {
      return parts.slice(-2).join(',').trim(); // Last 2 parts
    }
  }
  
  return intention.where;
}
```

### Social Proof System

Interest tracking with localStorage persistence:

```typescript
const handleInteraction = () => {
  if (hasInteracted || isExpired) return;

  const newStats = updateIntentionStats(payload, 'interested');
  setStats(newStats);
  setHasInteracted('interested');
  
  localStorage.setItem(`ambient_user_${payload}`, 'interested');
};

// Stats display
{stats.interested > 0 && (
  <div className="mb-6 p-3 bg-purple-50 rounded-2xl">
    <div className="text-xl font-bold text-purple-700">
      {stats.interested} {stats.interested === 1 ? 'person is' : 'people are'} interested
    </div>
  </div>
)}
```

## Main Page Component (`page.tsx`)

### State Flow Management

The home page orchestrates the entire user journey:

```typescript
const [createdUrl, setCreatedUrl] = useState<string | null>(null);
const [savedVibes, setSavedVibes] = useState<SavedVibe[]>([]);
const [showMyVibes, setShowMyVibes] = useState(false);
const [confirmationData, setConfirmationData] = useState<IntentionData | null>(null);
```

### View State Logic

Conditional rendering based on application state:

```typescript
{!createdUrl && !showMyVibes && !confirmationData ? (
  // Main form view
) : confirmationData ? (
  // Confirmation screen
) : showMyVibes ? (
  // My vibes listing
) : (
  // Success/share view
)}
```

### SavedVibes Management

Local storage integration for user's created intentions:

```typescript
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
  
  // Keep only last 24 hours
  const existing = savedVibes.filter(v => Date.now() - v.created < 86400000);
  const updated = [...existing, vibe];
  setSavedVibes(updated);
  localStorage.setItem('my-vibes', JSON.stringify(updated));
  
  // Auto-copy to clipboard
  navigator.clipboard.writeText(url);
};
```

## Layout Component (`layout.tsx`)

### SEO and Metadata

Comprehensive meta tags for social sharing:

```typescript
export const metadata: Metadata = {
  metadataBase: new URL('https://ambient-dz4h85mto-manansh11s-projects.vercel.app'),
  title: "Ambient - Zero-friction intention broadcasting",
  description: "Share intentions, skip negotiations.",
  keywords: ["social coordination", "meetup", "spontaneous", "intention broadcasting"],
  // ... OpenGraph and Twitter card configuration
};
```

### Font Integration

Geist font family setup:

```typescript
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono", 
  subsets: ["latin"],
});
```

This detailed component reference provides implementation specifics for all major UI components in the Ambient application.