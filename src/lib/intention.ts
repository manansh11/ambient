export interface IntentionData {
  what: string;
  when: string;
  where?: string;
  note?: string;
  createdAt: number;
}

export interface IntentionStats {
  interested: number;
  here: number;
}

export function encodeIntention(data: IntentionData): string {
  try {
    const jsonString = JSON.stringify(data);
    // Simplified encoding without encryption for compatibility
    return Buffer.from(jsonString).toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');
  } catch (error) {
    console.error('Error encoding intention:', error);
    throw new Error('Failed to encode intention data');
  }
}

export function decodeIntention(payload: string): IntentionData {
  try {
    // Convert URL-safe base64 back to regular base64
    const base64 = payload
      .replace(/-/g, '+')
      .replace(/_/g, '/')
      .padEnd(payload.length + (4 - payload.length % 4) % 4, '=');
    
    // Simplified decoding without decryption for compatibility
    const jsonString = Buffer.from(base64, 'base64').toString();
    
    if (!jsonString) {
      throw new Error('Invalid payload');
    }
    
    return JSON.parse(jsonString) as IntentionData;
  } catch (error) {
    console.error('Error decoding intention:', error);
    throw new Error('Failed to decode intention data');
  }
}

export function isIntentionExpired(intention: IntentionData): boolean {
  const eventTime = new Date(intention.when).getTime();
  const now = Date.now();
  const twoHoursInMs = 2 * 60 * 60 * 1000;
  
  return now > (eventTime + twoHoursInMs);
}

export function formatTimeForDisplay(dateTime: string): string {
  const date = new Date(dateTime);
  const now = new Date();
  
  if (date.toDateString() === now.toDateString()) {
    return `Today at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  } else {
    return date.toLocaleString([], {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}

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
      return parts.slice(-2).join(',').trim(); // Last 2 parts (neighborhood, city)
    }
  }
  
  return intention.where;
}

export function createIntentionUrl(data: IntentionData): string {
  const payload = encodeIntention(data);
  return `${window.location.origin}/i/${payload}`;
}

export function getStorageKey(payload: string): string {
  return `ambient_stats_${payload}`;
}

export function getIntentionStats(payload: string): IntentionStats {
  if (typeof window === 'undefined') {
    return { interested: 0, here: 0 };
  }
  
  const key = getStorageKey(payload);
  const stored = localStorage.getItem(key);
  
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return { interested: 0, here: 0 };
    }
  }
  
  return { interested: 0, here: 0 };
}

export function updateIntentionStats(payload: string, type: 'interested' | 'here'): IntentionStats {
  const stats = getIntentionStats(payload);
  stats[type] += 1;
  
  const key = getStorageKey(payload);
  localStorage.setItem(key, JSON.stringify(stats));
  
  return stats;
}