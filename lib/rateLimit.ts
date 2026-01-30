// Simple in-memory rate limiter
// Note: In production with multiple serverless instances, use Vercel KV or Upstash Redis

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

const DAILY_LIMIT = 10;
const MINUTE_LIMIT = 1;
const DAY_MS = 24 * 60 * 60 * 1000;
const MINUTE_MS = 60 * 1000;

export function checkRateLimit(ip: string): { allowed: boolean; error?: string } {
  const now = Date.now();
  const dailyKey = `daily:${ip}`;
  const minuteKey = `minute:${ip}`;

  // Check minute limit
  const minuteEntry = rateLimitStore.get(minuteKey);
  if (minuteEntry) {
    if (now < minuteEntry.resetTime) {
      if (minuteEntry.count >= MINUTE_LIMIT) {
        return { allowed: false, error: 'Please wait a moment before trying again.' };
      }
    } else {
      rateLimitStore.delete(minuteKey);
    }
  }

  // Check daily limit
  const dailyEntry = rateLimitStore.get(dailyKey);
  if (dailyEntry) {
    if (now < dailyEntry.resetTime) {
      if (dailyEntry.count >= DAILY_LIMIT) {
        return { allowed: false, error: 'Daily usage limit reached. Try again tomorrow.' };
      }
    } else {
      rateLimitStore.delete(dailyKey);
    }
  }

  return { allowed: true };
}

export function incrementRateLimit(ip: string): void {
  const now = Date.now();
  const dailyKey = `daily:${ip}`;
  const minuteKey = `minute:${ip}`;

  // Increment minute counter
  const minuteEntry = rateLimitStore.get(minuteKey);
  if (minuteEntry && now < minuteEntry.resetTime) {
    minuteEntry.count++;
  } else {
    rateLimitStore.set(minuteKey, { count: 1, resetTime: now + MINUTE_MS });
  }

  // Increment daily counter
  const dailyEntry = rateLimitStore.get(dailyKey);
  if (dailyEntry && now < dailyEntry.resetTime) {
    dailyEntry.count++;
  } else {
    rateLimitStore.set(dailyKey, { count: 1, resetTime: now + DAY_MS });
  }
}

// Cleanup old entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of rateLimitStore.entries()) {
    if (now >= entry.resetTime) {
      rateLimitStore.delete(key);
    }
  }
}, 60 * 1000);
