# Ambient - API Reference & Data Flow

## API Endpoints Overview

Ambient uses a minimal API surface with Next.js App Router, focusing on static generation and client-side functionality.

## Open Graph API (`/api/og`)

### Endpoint: `GET /api/og`

**Purpose**: Dynamically generates Open Graph images for shared intention links

**Parameters**:
- `payload` (required): URL-encoded intention data

**Response**: 
- **Content-Type**: `image/png`
- **Dimensions**: 1200x630 pixels
- **Format**: PNG image optimized for social sharing

**Example Request**:
```
GET /api/og?payload=eyJ3aGF0IjoiY29mZmVlIGF0IHRoZSBwYXJrIn0
```

**Implementation Details**:

```typescript
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const payload = searchParams.get('payload');

    if (!payload) {
      return new Response('Missing payload parameter', { status: 400 });
    }

    const intention = decodeIntention(payload);
    const location = intention.where || '';
    const timeDisplay = formatTime(intention.when);

    return new ImageResponse(
      // JSX-based image generation...
    );
  } catch (error) {
    console.error('Error generating OG image:', error);
    return new Response('Failed to generate image', { status: 500 });
  }
}
```

### Edge Runtime Compatibility

The OG API runs on Vercel's Edge Runtime with constraints:
- No Node.js APIs available
- Custom decode function using `atob()`
- Simplified error handling with fallbacks

```typescript
// Edge-compatible decode function
function decodeIntention(payload: string) {
  try {
    const base64 = payload
      .replace(/-/g, '+')
      .replace(/_/g, '/')
      .padEnd(payload.length + (4 - payload.length % 4) % 4, '=');
    
    const jsonString = atob(base64); // Edge runtime compatible
    return JSON.parse(jsonString);
  } catch {
    // Return safe default if decode fails
    return {
      what: "Someone's ambient intention",
      when: new Date().toISOString(),
      where: "",
      note: "Join naturally",
      createdAt: Date.now()
    };
  }
}
```

## Dynamic Route Handling

### Intention Pages (`/i/[payload]`)

**Route**: `GET /i/{payload}`

**Purpose**: Displays public intention pages with dynamic metadata

**Metadata Generation**:
```typescript
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  try {
    const { payload } = await params;
    const intention = decodeIntention(payload);
    const location = getLocationPrecision(intention);
    
    return {
      title: `${intention.what} - Ambient`,
      description: `Join me for ${intention.what} ${formatTimeForDisplay(intention.when)}${location ? ` at ${location}` : ''}`,
      openGraph: {
        title: intention.what,
        description: `${formatTimeForDisplay(intention.when)}${location ? ` • ${location}` : ''}${intention.note ? ` • ${intention.note}` : ''}`,
        images: [{
          url: `/api/og?payload=${payload}`,
          width: 1200,
          height: 630,
          alt: `${intention.what} - Ambient intention`,
        }],
      },
      twitter: {
        card: 'summary_large_image',
        title: intention.what,
        description: `${formatTimeForDisplay(intention.when)}${location ? ` • ${location}` : ''}`,
      },
    };
  } catch {
    return {
      title: 'Invalid Intention - Ambient',
      description: 'This ambient link is invalid or expired.',
    };
  }
}
```

**Error Handling**:
- Invalid payloads show custom error UI
- Graceful degradation with "create new link" CTA
- No 500 errors for malformed URLs

## Client-Side Data Flow

### Intention Creation Flow

1. **Form Submission**: User completes `IntentionForm`
2. **Validation**: Client-side validation with immediate feedback
3. **Preview**: Data passed to `ConfirmationScreen` component
4. **URL Generation**: `createIntentionUrl()` encodes data into shareable link
5. **Storage**: Saved to localStorage as `SavedVibe`
6. **Clipboard**: Automatic copy to clipboard

```typescript
// URL generation process
export function createIntentionUrl(data: IntentionData): string {
  const payload = encodeIntention(data);
  return `${window.location.origin}/i/${payload}`;
}

// Encoding process
export function encodeIntention(data: IntentionData): string {
  try {
    const jsonString = JSON.stringify(data);
    return Buffer.from(jsonString).toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');
  } catch (error) {
    console.error('Error encoding intention:', error);
    throw new Error('Failed to encode intention data');
  }
}
```

### Intention Viewing Flow

1. **URL Access**: User visits `/i/{payload}` link
2. **Payload Decode**: Server-side decoding in `generateMetadata()`
3. **Component Render**: `IntentionDisplay` component with decoded data
4. **Stats Loading**: Client-side localStorage stats retrieval
5. **Interaction Tracking**: User engagement updates localStorage

### Social Sharing Integration

**Platform Optimization**:
- **Twitter/X**: Custom card with image and description
- **Facebook**: Open Graph tags with rich preview
- **iMessage**: Automatic link unfurling
- **Slack/Discord**: Rich embed support

**Meta Tags Structure**:
```html
<meta property="og:title" content="coffee at the park" />
<meta property="og:description" content="Today at 2:30 PM • Dolores Park" />
<meta property="og:image" content="/api/og?payload=..." />
<meta property="og:url" content="/i/{payload}" />
<meta name="twitter:card" content="summary_large_image" />
```

## localStorage API Integration

### Storage Schema

```typescript
// User's created intentions
interface SavedVibes {
  [userId: string]: SavedVibe[];
}

// Intention interaction stats  
interface IntentionStats {
  interested: number;
  here: number;
}

// User interaction tracking
interface UserInteractions {
  [payloadId: string]: 'interested' | 'here';
}
```

### Storage Functions

```typescript
// Statistics management
export function getIntentionStats(payload: string): IntentionStats;
export function updateIntentionStats(payload: string, type: 'interested' | 'here'): IntentionStats;

// Key generation
export function getStorageKey(payload: string): string {
  return `ambient_stats_${payload}`;
}
```

## Error Handling & Resilience

### API Error States
- **400 Bad Request**: Missing or invalid parameters
- **500 Internal Server Error**: Image generation failures
- **Graceful Degradation**: Default images for failed OG generation

### Client-Side Error Handling
- **Invalid Payloads**: Custom error UI with recovery options
- **Expired Intentions**: Special expired state with clear messaging
- **Storage Failures**: Non-blocking localStorage errors
- **Network Issues**: Offline-first approach where possible

### Performance Considerations
- **Static Generation**: Pre-generated pages where possible
- **Edge Runtime**: Fast global distribution for OG images
- **Minimal Payload**: Efficient URL encoding
- **Client-Side Storage**: Reduced server load

This API design supports Ambient's zero-friction philosophy while providing rich sharing experiences across platforms.