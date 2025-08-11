# Ambient - Data Structures & Types

## Core Data Types

### IntentionData Interface
The primary data structure representing a user's intention to do something.

```typescript
export interface IntentionData {
  what: string;      // Activity description (required)
  when: string;      // ISO datetime string (required)
  where?: string;    // Location (optional)
  note?: string;     // Additional context (optional, max 50 chars)
  createdAt: number; // Timestamp of creation
}
```

**Usage Examples:**
```typescript
// Minimal intention
const basicIntention: IntentionData = {
  what: "coffee at the park",
  when: "2025-08-11T14:30:00",
  createdAt: Date.now()
};

// Full intention with location and note
const fullIntention: IntentionData = {
  what: "pickup basketball",
  when: "2025-08-11T18:00:00", 
  where: "Dolores Park, San Francisco",
  note: "bring water!",
  createdAt: Date.now()
};
```

### IntentionStats Interface
Tracks social engagement with intentions.

```typescript
export interface IntentionStats {
  interested: number; // Number of people who clicked "count me in"
  here: number;      // Reserved for future "I'm here" functionality
}
```

### SavedVibe Interface  
Local storage structure for tracking user's created intentions.

```typescript
interface SavedVibe {
  id: string;        // URL payload identifier
  what: string;      // Activity description  
  when: string;      // ISO datetime string
  created: number;   // Creation timestamp
  responses?: number; // Number of interested responses
}
```

## Data Encoding & Decoding

### URL Payload Structure
Intentions are encoded as URL-safe base64 strings for sharing:

```typescript
// Example encoded payload
"eyJ3aGF0IjoiY29mZmVlIGF0IHRoZSBwYXJrIiwid2hlbiI6IjIwMjUtMDgtMTFUMTQ6MzA6MDAiLCJjcmVhdGVkQXQiOjE2OTM4MzYwMDB9"

// Decodes to:
{
  "what": "coffee at the park",
  "when": "2025-08-11T14:30:00", 
  "createdAt": 1693836000
}
```

### Encoding Process
1. Serialize IntentionData to JSON string
2. Base64 encode the JSON
3. Make URL-safe by replacing `+` with `-`, `/` with `_`
4. Remove padding `=` characters

### Decoding Process  
1. Restore URL-safe characters to standard base64
2. Add padding if needed
3. Base64 decode to JSON string
4. Parse JSON to IntentionData object

## Storage Patterns

### localStorage Keys
- `my-vibes`: Array of SavedVibe objects (24h retention)
- `ambient_stats_${payload}`: IntentionStats for specific intention
- `ambient_user_${payload}`: User interaction state ('interested' | 'here')

### Data Retention Policies
- **User's created intentions**: 24 hours automatic cleanup
- **Interaction stats**: Persistent until manually cleared
- **User interaction state**: Persistent per intention

### Storage Utilities
```typescript
// Get intention statistics
function getIntentionStats(payload: string): IntentionStats

// Update statistics 
function updateIntentionStats(payload: string, type: 'interested' | 'here'): IntentionStats

// Generate storage key
function getStorageKey(payload: string): string
```

## Time-Based Logic

### Expiration Rules
- Intentions expire 2 hours after the scheduled event time
- Expired intentions show special UI and block interactions
- No server cleanup needed - handled client-side

### Time Display Formatting
- **Same day**: "Today at 2:30 PM"
- **Different day**: "Aug 11 at 2:30 PM"
- Progressive disclosure based on temporal proximity

### Location Privacy
Location precision varies by time until event:
- **>1 hour away**: Show only neighborhood/city (last 2 address components)
- **<1 hour away**: Show full address for coordination

## Validation Rules

### Form Validation
- `what` field: Required, non-empty string
- `when` field: Required, valid ISO datetime
- `where` field: Optional string
- `note` field: Optional, max 50 characters

### Data Integrity
- Encoding/decoding handles malformed data gracefully
- Invalid payloads return default "safe" intention data
- Type guards ensure runtime type safety

## Error Handling

### Graceful Degradation
```typescript
// Decode with fallback
function decodeIntention(payload: string): IntentionData {
  try {
    // Decoding logic...
  } catch (error) {
    console.error('Error decoding intention:', error);
    throw new Error('Failed to decode intention data');
  }
}
```

### Default States
- Invalid payloads show "invalid link" UI
- Missing localStorage returns empty arrays/default values
- Network errors don't break core functionality

This data architecture ensures reliability while maintaining the zero-friction philosophy of the Ambient platform.