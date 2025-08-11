# Ambient - Design System & Styling Guide

## Design Philosophy

Ambient's design system emphasizes:
- **Mobile-First**: All designs start with mobile and scale up
- **Lowercase Aesthetic**: Casual, approachable typography
- **Zero-Pressure Interface**: Soft, friendly visual language
- **Gradient-Driven**: Purple-to-pink gradients create warmth
- **Rounded Corners**: Soft, organic shapes throughout

## Typography System

### Font Stack

```css
/* Primary font: Geist Sans */
--font-geist-sans: 'Geist', system-ui, -apple-system, sans-serif;

/* Monospace: Geist Mono */
--font-geist-mono: 'Geist Mono', 'Monaco', 'Cascadia Code', monospace;
```

### Typography Scale

```typescript
// Tailwind classes used throughout
const typographyScale = {
  // Headers
  'text-4xl': '36px',  // Main brand title: "ambient"
  'text-3xl': '30px',  // Page headers  
  'text-2xl': '24px',  // Section titles
  'text-xl': '20px',   // Subsection headers
  
  // Body text
  'text-lg': '18px',   // Large body text, form inputs
  'text-base': '16px', // Default body text
  'text-sm': '14px',   // Secondary text, descriptions
  'text-xs': '12px',   // Fine print, metadata
};
```

### Font Weight System

```css
/* Consistent weight usage */
.font-black    /* 900 - Brand titles */
.font-bold     /* 700 - Action buttons, emphasis */
.font-medium   /* 500 - Form labels, secondary emphasis */
.font-normal   /* 400 - Body text */
```

### Typography Examples

```tsx
// Brand identity
<h1 className="text-4xl font-black text-gray-900 mb-2">
  ambient
</h1>

// Section headers  
<h2 className="text-xl font-bold text-gray-900 mb-4">
  your links
</h2>

// Body text
<p className="text-lg text-gray-700 font-medium">
  do more stuff with your friends
</p>

// Secondary text
<div className="text-sm text-gray-600">
  {new Date(vibe.when).toLocaleString()}
</div>
```

## Color Palette

### Primary Colors

```css
/* Gray scale for text and UI */
--gray-50: #f9fafb;
--gray-100: #f3f4f6;
--gray-200: #e5e7eb;
--gray-600: #6b7280;
--gray-700: #374151;
--gray-900: #111827;

/* Brand gradients */
--purple-500: #8b5cf6;
--purple-600: #7c3aed;
--purple-700: #6d28d9;
--pink-500: #ec4899;
--pink-600: #db2777;

/* Accent colors */
--indigo-50: #eef2ff;
--purple-50: #faf5ff;
--pink-50: #fdf2f8;

/* State colors */
--red-400: #f87171;    /* Errors */
--red-50: #fef2f2;     /* Error backgrounds */
--green-100: #dcfce7;  /* Success states */
--green-700: #15803d;  /* Success text */
--blue-600: #2563eb;   /* Links */
```

### Color Usage Guidelines

```tsx
// Text hierarchy
const textColors = {
  primary: 'text-gray-900',     // Headers, important text
  secondary: 'text-gray-700',   // Body text
  tertiary: 'text-gray-600',    // Metadata, captions
  muted: 'text-gray-500',       // Placeholder, disabled
  accent: 'text-blue-600',      // Links, highlights
  error: 'text-red-500',        // Error messages
  success: 'text-green-700',    // Success states
};
```

## Gradient System

### Primary Gradient

The signature Ambient gradient appears on all CTAs and key interactions:

```css
/* Main action gradient */
.bg-gradient-to-r.from-purple-500.to-pink-500

/* Hover state */
.hover\:from-purple-600.hover\:to-pink-600

/* Background gradients */
.bg-gradient-to-br.from-indigo-50.via-purple-50.to-pink-50
```

### Gradient Applications

```tsx
// Primary actions
<button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white py-5 px-6 rounded-2xl font-bold hover:from-purple-600 hover:to-pink-600 transition-all transform hover:scale-[1.02]">
  create link ✨
</button>

// Background gradients
<div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
```

## Layout & Spacing System

### Container Patterns

```tsx
// Main layout container
<div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
  <div className="max-w-md mx-auto px-4 py-8">
    {/* Content */}
  </div>
</div>

// Card containers
<div className="bg-white rounded-3xl shadow-lg p-6">
  {/* Card content */}
</div>
```

### Spacing Scale

Ambient uses Tailwind's default spacing scale with common patterns:

```css
/* Padding */
.p-6    /* 24px - Card padding */
.p-5    /* 20px - Button padding */
.p-4    /* 16px - Small containers */
.p-3    /* 12px - Compact elements */

/* Margins */
.mb-8   /* 32px - Section spacing */
.mb-6   /* 24px - Component spacing */
.mb-4   /* 16px - Element spacing */
.mb-2   /* 8px - Text spacing */

/* Gap */
.space-y-4  /* 16px vertical spacing */
.space-y-3  /* 12px vertical spacing */
```

## Component Styling Patterns

### Border Radius System

Consistent rounded corners create Ambient's soft aesthetic:

```css
/* Border radius scale */
.rounded-xl   /* 12px - Small elements */
.rounded-2xl  /* 16px - Buttons, inputs, cards */
.rounded-3xl  /* 24px - Main containers */
```

### Shadow System

```css
/* Card shadows */
.shadow-lg    /* Main cards and containers */

/* Interactive shadows for buttons */
.shadow-lg.hover\:shadow-xl
```

### Form Elements

```tsx
// Text inputs
<input className="w-full px-5 py-4 text-lg border-2 border-gray-200 rounded-2xl focus:border-purple-400 focus:outline-none transition-all text-gray-900 placeholder-gray-500 bg-white" />

// Error state
<input className="border-red-400 bg-red-50" />

// Button styles
<button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-5 px-6 rounded-2xl text-lg font-bold hover:from-purple-600 hover:to-pink-600 focus:outline-none focus:ring-4 focus:ring-purple-200 transition-all transform hover:scale-[1.02] active:scale-[0.98]">
```

## Interactive States

### Button Hover Effects

```tsx
// Primary button with scale transform
<button className="
  bg-gradient-to-r from-purple-500 to-pink-500 
  text-white py-5 px-6 rounded-2xl font-bold
  hover:from-purple-600 hover:to-pink-600
  transition-all transform hover:scale-[1.02] active:scale-[0.98]
">

// Secondary button
<button className="
  bg-gray-100 text-gray-700 py-4 px-6 rounded-2xl font-bold
  hover:bg-gray-200 transition-all
">
```

### Focus States

Accessibility-focused outline styles:

```css
/* Focus rings */
.focus\:outline-none.focus\:ring-4.focus\:ring-purple-200

/* Input focus */
.focus\:border-purple-400
```

### Disabled States

```css
.disabled\:opacity-50.disabled\:cursor-not-allowed
```

## Mobile-First Responsive Design

### Breakpoints

```css
/* Mobile first approach */
/* Base styles: 0-640px (mobile) */

/* Tablet: 640px+ */
@media (min-width: 640px) {
  /* sm: styles */
}

/* Desktop: 768px+ */  
@media (min-width: 768px) {
  /* md: styles */
}
```

### Touch Targets

All interactive elements meet minimum 44px touch target requirements:

```tsx
// Button sizing
<button className="py-5 px-6"> {/* Minimum 44px height */}

// Touch-friendly spacing
<div className="space-y-3"> {/* Adequate spacing between elements */}
```

## Animation & Transitions

### Micro-Interactions

```css
/* Standard transitions */
.transition-all

/* Hover transforms */
.transform.hover\:scale-\[1\.02\].active\:scale-\[0\.98\]

/* Loading spinners */
.animate-spin
```

### Animation Examples

```tsx
// Button micro-interaction
<button className="transition-all transform hover:scale-[1.02] active:scale-[0.98]">

// Loading state
<svg className="animate-spin h-5 w-5">
```

## Accessibility Patterns

### Color Contrast

All text meets WCAG 2.1 AA standards:
- Gray-900 on white backgrounds: 21:1 ratio
- Gray-700 on white backgrounds: 12.6:1 ratio
- Gray-600 on white backgrounds: 7:1 ratio

### Focus Indicators

```css
/* Visible focus rings */
.focus\:ring-4.focus\:ring-purple-200

/* High contrast focus for accessibility */
.focus\:outline-none.focus\:ring-offset-2
```

## Icon Usage

### Emoji Integration

Ambient uses emojis for visual interest and universal recognition:

```tsx
// Visual emphasis
<div className="text-6xl mb-4">✨</div>
<div className="text-6xl mb-4">👀</div>
<div className="text-6xl mb-4">⏰</div>

// Inline context
<div className="text-gray-600">📍 {location}</div>
<button>count me in! ✨</button>
```

## CSS Architecture

### Tailwind Configuration

```typescript
// tailwind.config.js key settings
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-geist-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-geist-mono)', 'monospace'],
      },
    },
  },
};
```

### Custom CSS Variables

```css
/* globals.css */
:root {
  --background: #ffffff;
  --foreground: #171717;
}

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --font-sans: var(--font-geist-sans);
  --font-mono: var(--font-geist-mono);
}
```

This design system ensures consistency across all Ambient interfaces while maintaining the casual, approachable aesthetic that supports frictionless social coordination.