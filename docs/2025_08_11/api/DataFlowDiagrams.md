# Ambient - Data Flow Diagrams & Architecture

## System Data Flow Overview

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   User Input    │────│  Form Validation  │────│   Confirmation  │
│  (what/when/    │    │   & Processing    │    │     Preview     │
│  where/note)    │    │                  │    │                 │
└─────────────────┘    └──────────────────┘    └─────────────────┘
                                                         │
                                                         ▼
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│  localStorage   │◄───│  URL Generation  │◄───│ Intention Data  │
│   Tracking      │    │   & Encoding      │    │   Processing    │
└─────────────────┘    └──────────────────┘    └─────────────────┘
                                │
                                ▼
                       ┌─────────────────┐
                       │  Shareable Link │
                       │ /i/{payload}    │
                       └─────────────────┘
```

## Intention Creation Flow

### 1. Form Input Stage
```
User Form Input:
├── what: string (required)
├── when: datetime (smart presets)
├── where: string (optional)
└── note: string (optional, 50 char limit)
```

### 2. Validation & Processing
```typescript
// Validation logic
validateForm() {
  errors = {}
  if (!what.trim()) errors.what = 'What are you up to?'
  if (!when) errors.when = 'When?'
  return Object.keys(errors).length === 0
}

// Data transformation
IntentionData {
  what,
  when: ISO string,
  where?: string,
  note?: string,
  createdAt: timestamp
}
```

### 3. URL Encoding Process
```
IntentionData
    ↓ JSON.stringify()
JSON String
    ↓ Buffer.from().toString('base64')
Base64 String  
    ↓ URL-safe transformation
URL-safe Payload
    ↓ createIntentionUrl()
Shareable URL: /i/{payload}
```

## Intention Viewing Flow

### 1. URL Processing
```
/i/{payload} Request
    ↓ Next.js App Router
Dynamic Route Handler
    ↓ decodeIntention()
IntentionData Object
    ↓ generateMetadata()
Rich Social Preview
```

### 2. Client-Side Interaction Flow
```
IntentionDisplay Component
    ↓ useEffect()
├── Load stats from localStorage
├── Check user interaction state  
├── Validate expiration status
└── Initialize component state

User Interaction
    ↓ handleInteraction()
├── Update localStorage stats
├── Set user interaction flag
└── Trigger UI state update
```

## Social Sharing Architecture

### Open Graph Image Generation
```
Share Link Request
    ↓ Platform crawling
/api/og?payload={encoded}
    ↓ Edge Runtime
├── Decode payload
├── Format intention data
├── Generate dynamic image
└── Return 1200x630 PNG

Platform Integration:
├── Twitter/X: summary_large_image
├── Facebook: og:image preview
├── iMessage: Rich link preview
└── Slack/Discord: Embed card
```

### Metadata Flow
```
generateMetadata()
    ↓ Server-side
├── Decode intention payload
├── Format time display
├── Apply location precision
└── Generate platform tags

Output:
├── <title>: Activity - Ambient
├── <meta og:title>: Activity name
├── <meta og:description>: Time + Location
├── <meta og:image>: /api/og?payload=...
└── <meta twitter:card>: summary_large_image
```

## localStorage Data Architecture

### Storage Keys & Values
```
localStorage Structure:
├── 'my-vibes': SavedVibe[]
│   └── 24h retention policy
├── 'ambient_stats_{payload}': IntentionStats
│   └── Persistent interaction counts
└── 'ambient_user_{payload}': 'interested' | 'here'
    └── One-time interaction tracking
```

### Data Persistence Flow
```
Intention Creation
    ↓ handleConfirmAndCreate()
├── Generate SavedVibe object
├── Filter existing (24h cleanup)
├── Update savedVibes array
└── localStorage.setItem()

Interaction Tracking
    ↓ handleInteraction()
├── Increment stats counter
├── Mark user interaction
└── Persist both states
```

## State Management Patterns

### Component State Flow
```
Home Page State:
├── createdUrl: string | null
├── savedVibes: SavedVibe[]
├── showMyVibes: boolean
└── confirmationData: IntentionData | null

State Transitions:
Form → Confirmation → Success → List
  ↑                               ↓
  └──────── Back Navigation ──────┘
```

### Error State Handling
```
Error Scenarios:
├── Invalid payload → Custom error UI
├── Expired intention → Expiration UI
├── Missing data → Default fallbacks
└── Network errors → Graceful degradation

Error Recovery:
├── "Create new link" actions
├── Back navigation options
└── Clear user messaging
```

## Performance & Caching

### Edge Runtime Optimization
```
/api/og Endpoint:
├── Vercel Edge Runtime
├── Global CDN distribution
├── Automatic caching headers
└── Optimized image generation

Client-Side Caching:
├── localStorage persistence
├── Component state caching
└── Browser-based image caching
```

### Data Transfer Optimization
```
Payload Encoding:
├── JSON → Base64 → URL-safe
├── Minimal data structure
├── No authentication tokens
└── Compact representation

Benefits:
├── Fast URL sharing
├── Reduced server load
├── Offline capability
└── Privacy by design
```

## Security & Privacy Flow

### Data Protection Architecture
```
User Data:
├── No server-side storage
├── URL-based state transfer
├── Local-only persistence
└── Automatic expiration

Privacy Features:
├── Progressive location disclosure
├── No user identification
├── Ephemeral link architecture
└── Client-side only analytics
```

### Expiration Logic
```
Intention Lifecycle:
Create → Share → Active → Expired (2h post-event)
    ↓       ↓       ↓           ↓
  Store   Track  Interact   Cleanup UI
```

This data flow architecture ensures Ambient maintains its zero-friction philosophy while providing rich social coordination features.