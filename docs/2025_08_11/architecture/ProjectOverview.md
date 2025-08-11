# Ambient - Project Architecture Overview

## Project Philosophy

Ambient is a zero-friction intention broadcasting system that transforms social coordination from a request-response obligation into an open declaration of availability. The core philosophy emphasizes:

- **Zero Authentication Threshold**: Every feature works without signup
- **Semantic Transformation**: Changes requests into declarations
- **Respect Existing Channels**: Enhances, doesn't replace current messaging
- **Progressive Disclosure**: Information reveals based on context/proximity
- **Ambient, Not Alerting**: Creates awareness without notification burden

## Technology Stack

### Core Framework
- **Next.js 14** with App Router
- **TypeScript** for type safety
- **React 19.1.0** with hooks-based components
- **Tailwind CSS 4** for styling

### Key Dependencies
- `@vercel/og` - Open Graph image generation
- `crypto-js` - Encoding/decoding utilities (currently unused)
- Geist fonts (Sans & Mono) for typography

### Deployment
- **Render.com** for hosting
- Automatic deployments from GitHub main branch
- Environment variables for configuration

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   │   └── og/           # Open Graph image generation
│   ├── i/[payload]/      # Dynamic intention display pages
│   ├── globals.css       # Global styles
│   ├── layout.tsx        # Root layout component
│   └── page.tsx          # Home page
├── components/            # React components
│   ├── ConfirmationScreen.tsx
│   ├── IntentionDisplay.tsx
│   └── IntentionForm.tsx
└── lib/                  # Utility libraries
    └── intention.ts      # Core business logic
```

## Architecture Patterns

### URL-Based State Management
- URLs serve as the primary source of truth
- Intention data encoded in URL parameters
- No authentication or user sessions required

### Client-Side Storage
- `localStorage` for tracking user interactions
- Temporary storage for created links (24h retention)
- No server-side database required

### Component Architecture
- Functional components with React hooks
- Props-based data flow
- Minimal state management with useState/useEffect

### Mobile-First Design
- Responsive design with Tailwind CSS
- Touch-friendly interactions
- Progressive enhancement for larger screens

## Data Flow

### Intention Creation
1. User fills form (`IntentionForm`)
2. Data preview in confirmation screen (`ConfirmationScreen`)
3. Intention encoded into URL-safe payload
4. Shareable link generated and copied to clipboard

### Intention Viewing
1. User visits `/i/[payload]` URL
2. Payload decoded to intention data
3. Progressive disclosure of location based on timing
4. Social proof through interaction counters
5. Local storage tracks user interactions

### Open Graph Generation
1. Dynamic OG images generated via `/api/og`
2. Intention data embedded in rich previews
3. Platform-optimized sharing across social media

## Security & Privacy

### Data Protection
- No server-side data storage
- Intention data encoded (not encrypted) in URLs
- Automatic link expiration (2 hours after event)
- No personal information collected

### Client-Side Only
- All state management happens in browser
- No user tracking or analytics
- Privacy-by-design architecture

## Performance Characteristics

### Optimization Features
- Static generation where possible
- Minimal JavaScript bundle
- Efficient CSS with Tailwind
- Optimized font loading with Geist

### Scalability
- Stateless architecture
- CDN-friendly static assets
- No database bottlenecks
- Horizontal scaling capabilities

## Key Design Decisions

### Encoding Strategy
- Base64 URL-safe encoding for intentions
- No encryption to maintain simplicity
- Payload includes all necessary context

### Time-Based Features
- Progressive location disclosure
- Automatic link expiration
- Smart time presets (now, 30min, tonight)

### Social Mechanics
- No pressure messaging
- Ambient awareness over notifications
- Community-driven interaction counters

This architecture supports the project's goal of frictionless social coordination while maintaining privacy, simplicity, and scalability.