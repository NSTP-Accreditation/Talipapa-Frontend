/**
 * Request Cache Utility
 *
 * Provides request deduplication to prevent multiple identical API calls
 * from being made simultaneously. When multiple components request the same
 * data at the same time, only one actual request is made and the result
 * is shared with all requesters.
 *
 * @example
 * ```typescript
 * // Multiple components calling this simultaneously will share one request
 * const data = await requestCache.dedupe('users', () => fetch('/api/users'));
 * ```
 */

/**
 * Cache for managing in-flight requests to prevent duplicate API calls
 */
class RequestCache {
  private pending = new Map<string, Promise<any>>();

  /**
   * Deduplicate requests by caching in-flight promises
   *
   * If a request with the same key is already pending, returns the existing promise.
   * Otherwise, executes the fetcher function and caches the promise until it resolves.
   *
   * @template T - The expected response type
   * @param key - Unique identifier for the request (e.g., 'GET:/api/users')
   * @param fetcher - Function that performs the actual fetch operation
   * @returns Promise resolving to the fetched data
   *
   * @example
   * ```typescript
   * // In useAuthFetch hook:
   * const cacheKey = `${method}:${url}`;
   * return requestCache.dedupe(cacheKey, () => fetch(url, options));
   * ```
   */
  async dedupe<T>(key: string, fetcher: () => Promise<T>): Promise<T> {
    // If request is already in flight, return existing promise
    if (this.pending.has(key)) {
      return this.pending.get(key);
    }

    // Start new request and cache the promise
    const promise = fetcher().finally(() => {
      // Clean up cache when request completes (success or error)
      this.pending.delete(key);
    });

    this.pending.set(key, promise);
    return promise;
  }

  /**
   * Clear a specific cached request
   *
   * @param key - The cache key to clear
   */
  clear(key: string): void {
    this.pending.delete(key);
  }

  /**
   * Clear all cached requests
   *
   * Useful for cleaning up on logout or when invalidating all caches
   */
  clearAll(): void {
    this.pending.clear();
  }

  /**
   * Get the number of pending requests
   *
   * @returns Number of currently in-flight requests
   */
  getPendingCount(): number {
    return this.pending.size;
  }

  /**
   * Check if a specific request is currently pending
   *
   * @param key - The cache key to check
   * @returns True if the request is pending, false otherwise
   */
  isPending(key: string): boolean {
    return this.pending.has(key);
  }
}

/**
 * Singleton instance of RequestCache
 *
 * Use this instance throughout the application to ensure
 * request deduplication works across all components.
 */
export const requestCache = new RequestCache();
