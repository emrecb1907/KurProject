import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Client-side rate limiter for UX improvements and reducing unnecessary server calls.
 * Uses a combination of in-memory caching (fastest) and AsyncStorage (persistence).
 */
class EconomicRateLimiter {
  private memoryCache: Map<string, { count: number; windowStart: number }> = new Map();

  /**
   * Checks if an action can proceed based on rate limits.
   * @param userId - The user's ID
   * @param action - The action name (e.g., 'xp_update', 'login')
   * @param maxRequests - Maximum number of requests allowed in the window
   * @param windowMs - Time window in milliseconds
   * @returns Promise<boolean> - True if allowed, False if rate limited
   */
  async canProceed(
    userId: string,
    action: string,
    maxRequests: number,
    windowMs: number
  ): Promise<boolean> {
    const key = `${userId}_${action}`;
    const now = Date.now();

    // 1. Check memory cache first (fastest)
    let cached = this.memoryCache.get(key);

    // 2. If not in memory, try to get from AsyncStorage
    if (!cached) {
      try {
        const stored = await AsyncStorage.getItem(`rate_${key}`);
        if (stored) {
          cached = JSON.parse(stored);
          // Sync back to memory
          if (cached) {
            this.memoryCache.set(key, cached);
          }
        }
      } catch (error) {
        console.warn('RateLimiter: Failed to read from storage', error);
        // Fail open (allow request) if storage fails, to not block user
      }
    }

    // First request ever
    if (!cached) {
      const newData = { count: 1, windowStart: now };
      this.updateCache(key, newData);
      return true;
    }

    // Check if window has expired (reset counter)
    if (now - cached.windowStart > windowMs) {
      const newData = { count: 1, windowStart: now };
      this.updateCache(key, newData);
      return true;
    }

    // Check limit
    if (cached.count >= maxRequests) {
      return false;
    }

    // Increment counter
    cached.count++;
    this.updateCache(key, cached);
    return true;
  }

  /**
   * Helper to update both memory and storage
   */
  private updateCache(key: string, data: { count: number; windowStart: number }) {
    this.memoryCache.set(key, data);
    // Fire and forget storage update to not block UI
    AsyncStorage.setItem(`rate_${key}`, JSON.stringify(data)).catch(err => 
      console.warn('RateLimiter: Failed to write to storage', err)
    );
  }

  /**
   * Manually reset a limit (e.g. after successful login or admin action)
   */
  async reset(userId: string, action: string) {
    const key = `${userId}_${action}`;
    this.memoryCache.delete(key);
    await AsyncStorage.removeItem(`rate_${key}`);
  }
}

export const rateLimiter = new EconomicRateLimiter();

// Pre-defined limits for consistency across the app
export const RATE_LIMITS = {
  XP_UPDATE: {
    maxRequests: 20,
    windowMs: 60 * 1000, // 1 minute
  },
  GAME_COMPLETE: {
    maxRequests: 10,
    windowMs: 60 * 1000, // 1 minute
  },
  LOGIN_ATTEMPT: {
    maxRequests: 5,
    windowMs: 5 * 60 * 1000, // 5 minutes
  }
} as const;
