# Ambient - Comprehensive Documentation

## Overview

This documentation provides a complete technical reference for the Ambient zero-friction intention broadcasting system. All documentation follows the project's conventions and is organized by functional area.

## Documentation Structure

### Architecture Documentation
Located in `/docs/2025_08_11/architecture/`

- **[ProjectOverview.md](./architecture/ProjectOverview.md)** - High-level system architecture, technology stack, and design decisions
- **[DataStructures.md](./architecture/DataStructures.md)** - Core data types, interfaces, and data flow patterns

### Component Documentation  
Located in `/docs/2025_08_11/components/`

- **[ComponentOverview.md](./components/ComponentOverview.md)** - Component architecture, patterns, and styling conventions
- **[ComponentDetails.md](./components/ComponentDetails.md)** - Detailed implementation reference for all React components

### API Documentation
Located in `/docs/2025_08_11/api/`

- **[ApiReference.md](./api/ApiReference.md)** - Complete API endpoint documentation and client-side data flow
- **[DataFlowDiagrams.md](./api/DataFlowDiagrams.md)** - Visual diagrams and architectural flow documentation

### Development Guides
Located in `/docs/2025_08_11/guides/`

- **[StateManagement.md](./guides/StateManagement.md)** - URL-based state, localStorage patterns, and React hooks usage
- **[DesignSystem.md](./guides/DesignSystem.md)** - Typography, colors, gradients, spacing, and mobile-first design patterns
- **[DevelopmentSetup.md](./guides/DevelopmentSetup.md)** - Local setup, development workflow, and deployment instructions
- **[FeatureImplementation.md](./guides/FeatureImplementation.md)** - How to extend and enhance existing features

## Quick Start Guide

### For Developers New to Ambient

1. **Start with [ProjectOverview.md](./architecture/ProjectOverview.md)** to understand the system philosophy and architecture
2. **Review [DevelopmentSetup.md](./guides/DevelopmentSetup.md)** to set up your local environment
3. **Study [ComponentOverview.md](./components/ComponentOverview.md)** to understand the UI architecture
4. **Explore [DataStructures.md](./architecture/DataStructures.md)** to understand data flow and storage patterns

### For Designers

1. **Begin with [DesignSystem.md](./guides/DesignSystem.md)** for typography, colors, and styling patterns
2. **Review [ComponentOverview.md](./components/ComponentOverview.md)** for UI component patterns
3. **Check [ProjectOverview.md](./architecture/ProjectOverview.md)** for design philosophy and principles

### For Product Managers

1. **Start with [ProjectOverview.md](./architecture/ProjectOverview.md)** for business logic and user flows
2. **Review [FeatureImplementation.md](./guides/FeatureImplementation.md)** to understand extension possibilities
3. **Explore [ApiReference.md](./api/ApiReference.md)** for integration capabilities

## Key Concepts

### Zero-Friction Philosophy
- No authentication required
- URL-based state sharing
- Progressive disclosure of information
- Mobile-first design approach

### Technical Architecture
- **Framework**: Next.js 14 with App Router
- **Styling**: Tailwind CSS with mobile-first responsive design
- **State Management**: URL parameters + localStorage
- **Deployment**: Render.com with automatic builds

### Core Features
- Smart time presets (now, 30min, tonight, custom)
- Progressive location disclosure for privacy
- Social proof through interaction counters
- Automatic link expiration (2 hours post-event)
- Rich social media previews via Open Graph

## File Locations Reference

### Source Code Structure
```
src/
├── app/
│   ├── api/og/route.tsx          # Open Graph image generation
│   ├── i/[payload]/page.tsx      # Dynamic intention pages
│   ├── layout.tsx                # Root layout with SEO
│   └── page.tsx                  # Home page component
├── components/
│   ├── ConfirmationScreen.tsx    # Preview before link creation
│   ├── IntentionDisplay.tsx      # Public intention view
│   └── IntentionForm.tsx         # Main form component
└── lib/
    └── intention.ts              # Core business logic utilities
```

### Documentation Structure
```
docs/2025_08_11/
├── README.md                     # This file
├── architecture/
│   ├── ProjectOverview.md
│   └── DataStructures.md
├── components/
│   ├── ComponentOverview.md
│   └── ComponentDetails.md
├── api/
│   ├── ApiReference.md
│   └── DataFlowDiagrams.md
└── guides/
    ├── StateManagement.md
    ├── DesignSystem.md
    ├── DevelopmentSetup.md
    └── FeatureImplementation.md
```

## Implementation Examples

### Creating a New Component

```typescript
// Follow patterns from existing components
import { useState, useEffect } from 'react';
import { IntentionData } from '@/lib/intention';

interface NewComponentProps {
  data: IntentionData;
  onAction: (result: string) => void;
}

export default function NewComponent({ data, onAction }: NewComponentProps) {
  const [state, setState] = useState('initial');
  
  // Mobile-first styling with Tailwind
  return (
    <div className="bg-white rounded-3xl shadow-lg p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">
        {data.what}
      </h2>
      {/* Component content */}
    </div>
  );
}
```

### Adding New API Endpoints

```typescript
// Follow patterns from existing API routes
import { NextRequest } from 'next/server';
import { decodeIntention } from '@/lib/intention';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const payload = searchParams.get('payload');
    
    if (!payload) {
      return new Response('Missing payload', { status: 400 });
    }
    
    const intention = decodeIntention(payload);
    
    return Response.json({ 
      success: true, 
      data: intention 
    });
  } catch (error) {
    return new Response('Invalid payload', { status: 400 });
  }
}
```

## Contributing Guidelines

### Code Standards
- Use TypeScript for all new files
- Follow existing component patterns
- Implement proper error handling
- Maintain mobile-first responsive design
- Add accessibility features (ARIA labels, keyboard navigation)

### Documentation Standards
- Update relevant documentation for any feature changes
- Include code examples in documentation
- Follow the established file organization structure
- Use clear, actionable language

### Testing Requirements
- Test core functionality manually across browsers
- Verify mobile responsiveness
- Test accessibility with keyboard navigation
- Ensure localStorage functionality works correctly

## Support & Resources

### Development Commands
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run lint         # Run code quality checks
npm start            # Start production server
```

### Key Utilities
- **intention.ts**: Core business logic and data transformations
- **localStorage**: Client-side state persistence
- **Tailwind CSS**: Utility-first styling system
- **Next.js App Router**: File-based routing and API routes

### External Resources
- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)
- [React Documentation](https://react.dev)

---

This documentation is maintained alongside the Ambient codebase. For questions or updates, please refer to the individual documentation files or create an issue in the project repository.