/**
 * API Rate Limiter
 *
 * Implements client-side rate limiting to prevent excessive API calls.
 * Uses a sliding window algorithm to track requests per endpoint.
 *
 * @important - Helps prevent API abuse and reduces server load
 */

import { logger } from './logger';

/**
 * Rate limit configuration for an endpoint
 */
interface RateLimitConfig {
  /** Maximum number of requests allowed */
  maxRequests: number;
  /** Time window in milliseconds */
  windowMs: number;
}

/**
 * Rate limit error thrown when limit is exceeded
 */
export class RateLimitError extends Error {
  public retryAfter: number;

  constructor(message: string, retryAfter: number) {
    super(message);
    this.name = 'RateLimitError';
    this.retryAfter = retryAfter;
  }
}

/**
 * Request timestamp tracker
 */
interface RequestTracker {
  timestamps: number[];
  config: RateLimitConfig;
}

/**
 * Rate Limiter Class
 *
 * Manages rate limiting for API requests using a sliding window algorithm.
 * Tracks requests per endpoint and enforces limits.
 *
 * @example
 * const limiter = new RateLimiter({
 *   maxRequests: 10,
 *   windowMs: 60000 // 10 requests per minute
 * });
 *
 * try {
 *   await limiter.checkLimit('/api/users');
 *   // Make API call
 * } catch (error) {
 *   if (error instanceof RateLimitError) {
 *     console.log(`Rate limited. Retry after ${error.retryAfter}ms`);
 *   }
 * }
 */
export class RateLimiter {
  private trackers = new Map<string, RequestTracker>();
  private defaultConfig: RateLimitConfig;

  /**
   * Create a new rate limiter
   *
   * @param defaultConfig - Default rate limit configuration
   */
  constructor(
    defaultConfig: RateLimitConfig = { maxRequests: 60, windowMs: 60000 }
  ) {
    this.defaultConfig = defaultConfig;

    // Clean up old trackers periodically to prevent memory leaks
    setInterval(() => this.cleanup(), defaultConfig.windowMs * 2);
  }

  /**
   * Check if a request to the endpoint is allowed
   *
   * @param endpoint - API endpoint to check
   * @param config - Optional custom rate limit config for this endpoint
   * @throws {RateLimitError} If rate limit is exceeded
   * @returns Promise that resolves if request is allowed
   */
  public async checkLimit(
    endpoint: string,
    config?: RateLimitConfig
  ): Promise<void> {
    const effectiveConfig = config || this.defaultConfig;
    const now = Date.now();

    // Get or create tracker for this endpoint
    let tracker = this.trackers.get(endpoint);
    if (!tracker) {
      tracker = {
        timestamps: [],
        config: effectiveConfig,
      };
      this.trackers.set(endpoint, tracker);
    }

    // Remove timestamps outside the current window
    const windowStart = now - effectiveConfig.windowMs;
    tracker.timestamps = tracker.timestamps.filter((ts) => ts > windowStart);

    // Check if limit is exceeded
    if (tracker.timestamps.length >= effectiveConfig.maxRequests) {
      const oldestTimestamp = tracker.timestamps[0];
      const retryAfter = oldestTimestamp + effectiveConfig.windowMs - now;

      logger.warn(`Rate limit exceeded for ${endpoint}`, {
        current: tracker.timestamps.length,
        max: effectiveConfig.maxRequests,
        retryAfter,
      });

      throw new RateLimitError(
        `Rate limit exceeded for ${endpoint}. Please try again in ${Math.ceil(retryAfter / 1000)}s`,
        retryAfter
      );
    }

    // Record this request
    tracker.timestamps.push(now);

    logger.debug(`Rate limit check passed for ${endpoint}`, {
      current: tracker.timestamps.length,
      max: effectiveConfig.maxRequests,
    });
  }

  /**
   * Get current usage for an endpoint
   *
   * @param endpoint - API endpoint to check
   * @returns Object with current request count and max allowed
   */
  public getUsage(endpoint: string): { current: number; max: number } | null {
    const tracker = this.trackers.get(endpoint);
    if (!tracker) {
      return null;
    }

    const now = Date.now();
    const windowStart = now - tracker.config.windowMs;
    const activeRequests = tracker.timestamps.filter((ts) => ts > windowStart);

    return {
      current: activeRequests.length,
      max: tracker.config.maxRequests,
    };
  }

  /**
   * Reset rate limit for an endpoint
   *
   * @param endpoint - API endpoint to reset (or all if not specified)
   */
  public reset(endpoint?: string): void {
    if (endpoint) {
      this.trackers.delete(endpoint);
      logger.debug(`Rate limit reset for ${endpoint}`);
    } else {
      this.trackers.clear();
      logger.debug('All rate limits reset');
    }
  }

  /**
   * Clean up old trackers to prevent memory leaks
   * Removes trackers that haven't been used in 2x the window time
   */
  private cleanup(): void {
    const now = Date.now();
    const trackersBefore = this.trackers.size;

    for (const [endpoint, tracker] of this.trackers.entries()) {
      const windowStart = now - tracker.config.windowMs * 2;
      tracker.timestamps = tracker.timestamps.filter((ts) => ts > windowStart);

      // Remove tracker if no recent requests
      if (tracker.timestamps.length === 0) {
        this.trackers.delete(endpoint);
      }
    }

    const trackersAfter = this.trackers.size;
    if (trackersBefore > trackersAfter) {
      logger.debug(
        `Rate limiter cleanup: ${trackersBefore - trackersAfter} trackers removed`
      );
    }
  }
}

/**
 * Default rate limiter instance with standard limits
 * - 60 requests per minute per endpoint
 */
export const defaultRateLimiter = new RateLimiter({
  maxRequests: 60,
  windowMs: 60000, // 1 minute
});

/**
 * Strict rate limiter for sensitive operations
 * - 10 requests per minute per endpoint
 */
export const strictRateLimiter = new RateLimiter({
  maxRequests: 10,
  windowMs: 60000, // 1 minute
});

/**
 * Relaxed rate limiter for frequently-used endpoints
 * - 120 requests per minute per endpoint
 */
export const relaxedRateLimiter = new RateLimiter({
  maxRequests: 120,
  windowMs: 60000, // 1 minute
});

/**
 * HOF to wrap fetch calls with rate limiting
 *
 * @param limiter - Rate limiter instance to use
 * @returns Wrapped fetch function with rate limiting
 *
 * @example
 * const rateLimitedFetch = withRateLimit(defaultRateLimiter);
 *
 * try {
 *   const response = await rateLimitedFetch('/api/users', { method: 'GET' });
 * } catch (error) {
 *   if (error instanceof RateLimitError) {
 *     // Handle rate limit error
 *   }
 * }
 */
export function withRateLimit(limiter: RateLimiter = defaultRateLimiter) {
  return async function rateLimitedFetch(
    url: string,
    options?: RequestInit
  ): Promise<Response> {
    // Extract endpoint path for rate limiting
    const endpoint = new URL(url, window.location.origin).pathname;

    // Check rate limit before making request
    await limiter.checkLimit(endpoint);

    // Make the actual fetch request
    return fetch(url, options);
  };
}

/**
 * Usage Examples:
 *
 * // 1. Direct usage with rate limiter
 * import { defaultRateLimiter, RateLimitError } from '@/utils/rateLimiter';
 *
 * try {
 *   await defaultRateLimiter.checkLimit('/api/users');
 *   const response = await fetch('/api/users');
 * } catch (error) {
 *   if (error instanceof RateLimitError) {
 *     alert(`Please wait ${Math.ceil(error.retryAfter / 1000)} seconds`);
 *   }
 * }
 *
 * // 2. Using the wrapped fetch function
 * import { withRateLimit } from '@/utils/rateLimiter';
 *
 * const rateLimitedFetch = withRateLimit();
 * const response = await rateLimitedFetch('/api/users');
 *
 * // 3. Custom rate limit configuration
 * import { RateLimiter } from '@/utils/rateLimiter';
 *
 * const customLimiter = new RateLimiter({
 *   maxRequests: 5,
 *   windowMs: 10000, // 5 requests per 10 seconds
 * });
 *
 * await customLimiter.checkLimit('/api/sensitive-endpoint');
 *
 * // 4. Check current usage
 * const usage = defaultRateLimiter.getUsage('/api/users');
 * console.log(`${usage?.current}/${usage?.max} requests used`);
 *
 * // 5. Reset rate limit (useful for testing)
 * defaultRateLimiter.reset('/api/users');
 */
