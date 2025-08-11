# Ambient - Component Documentation

## Component Architecture Overview

Ambient uses a functional component architecture with React hooks, emphasizing simplicity and mobile-first design. All components are located in `/src/components/` and follow consistent patterns.

## Core Components

### IntentionForm (`IntentionForm.tsx`)
**Purpose**: Main form for creating new intentions with smart time presets

**Props Interface**:
```typescript
interface IntentionFormProps {
  onIntentionPreview: (data: IntentionData) => void;
}
```

**Key Features**:
- Smart time presets (now, 30min, tonight, custom)
- Real-time form validation with error states
- Mobile-optimized input fields with proper accessibility
- Character limit enforcement (50 chars for notes)
- Focus management for error handling

**State Management**:
```typescript
const [what, setWhat] = useState('');
const [timePreset, setTimePreset] = useState('custom');
const [when, setWhen] = useState(() => {
  // Defaults to 30 minutes from now
  const now = new Date();
  now.setMinutes(now.getMinutes() + 30);
  return now.toISOString().slice(0, 16);
});
const [where, setWhere] = useState('');
const [note, setNote] = useState('');
const [errors, setErrors] = useState<{[key: string]: string}>({});
```

**Usage Example**:
```tsx
<IntentionForm 
  onIntentionPreview={(data: IntentionData) => {
    setConfirmationData(data);
  }}
/>
```

### ConfirmationScreen (`ConfirmationScreen.tsx`)
**Purpose**: Preview screen showing how the intention will appear to others

**Props Interface**:
```typescript
interface ConfirmationScreenProps {
  data: IntentionData;
  onConfirm: (url: string, data: IntentionData) => void;
  onBack: () => void;
}
```

**Key Features**:
- Visual preview matching the public intention display
- Loading states during URL generation
- Back navigation to edit form
- Gradient action buttons with hover effects

**Preview Card Structure**:
- Activity title with prominent typography
- Formatted time display
- Location with map pin emoji
- Quote-styled notes
- Mock "interested" button for preview

### IntentionDisplay (`IntentionDisplay.tsx`)
**Purpose**: Public view of shared intentions with interaction capabilities

**Props Interface**:
```typescript
interface IntentionDisplayProps {
  intention: IntentionData;
  payload: string;
}
```

**Key Features**:
- Expiration checking and expired state UI
- Social proof with interest counters
- Progressive location disclosure based on timing
- Single-interaction enforcement per user
- No-pressure messaging about platform philosophy

**State Management**:
```typescript
const [stats, setStats] = useState<IntentionStats>({ interested: 0, here: 0 });
const [hasInteracted, setHasInteracted] = useState<'interested' | 'here' | null>(null);
const [isExpired, setIsExpired] = useState(false);
```

**Interaction Handling**:
```typescript
const handleInteraction = () => {
  if (hasInteracted || isExpired) return;
  
  const newStats = updateIntentionStats(payload, 'interested');
  setStats(newStats);
  setHasInteracted('interested');
  
  localStorage.setItem(`ambient_user_${payload}`, 'interested');
};
```

## Component Patterns

### Mobile-First Design
All components prioritize mobile experience:
- Touch-friendly button sizes (minimum 44px touch targets)
- Optimized form inputs for mobile keyboards
- Swipe and gesture considerations
- Responsive typography and spacing

### Error Handling
Consistent error state management:
- Form validation with real-time feedback
- Accessible error messages with ARIA attributes
- Focus management for accessibility
- Graceful degradation for failed states

### Loading States
User feedback during async operations:
- Button loading indicators with spinners
- Disabled states during processing
- Smooth transitions between states

### Typography Hierarchy
- **Headers**: Bold, lowercase for brand consistency
- **Body text**: Clear hierarchy with proper contrast
- **Interactive elements**: Prominent, action-oriented

## Styling Patterns

### Gradient System
Consistent gradient usage across components:
```css
/* Primary gradient for actions */
bg-gradient-to-r from-purple-500 to-pink-500

/* Background gradients */
bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50
```

### Rounded Corners
Consistent border radius system:
- **Small elements**: `rounded-xl` (12px)
- **Cards and containers**: `rounded-2xl` (16px)  
- **Main containers**: `rounded-3xl` (24px)

### Color Palette
- **Primary**: Purple to pink gradients
- **Text**: Gray-900 for headers, gray-700 for body
- **Interactive states**: Purple-100 backgrounds, purple-700 text
- **Error states**: Red-400 borders, red-50 backgrounds

## Accessibility Features

### Form Accessibility
- Proper label associations with `htmlFor`
- ARIA invalid states for form validation
- Keyboard navigation support
- Screen reader friendly error messages

### Interactive Elements
- Focus indicators with `focus:outline-none focus:ring-4`
- Proper button semantics
- Touch target sizing for mobile accessibility

### Color Contrast
All text meets WCAG 2.1 AA standards:
- High contrast text on backgrounds
- Accessible color combinations for interactive states

## Component Testing Patterns

### Props Validation
Each component includes TypeScript interfaces for type safety:
```typescript
// Example prop validation
interface ComponentProps {
  required: string;
  optional?: number;
  callback: (data: SomeType) => void;
}
```

### Error Boundaries
Components handle errors gracefully:
- Try-catch blocks for data processing
- Fallback UI for failed states
- Console logging for debugging

This component architecture ensures consistency, accessibility, and maintainability while supporting the zero-friction philosophy of Ambient.