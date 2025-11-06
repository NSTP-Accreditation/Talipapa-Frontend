/**
 * Public Data Fetching Hook
 *
 * Fetches data from public API endpoints without authentication.
 * Used for user-facing pages that don't require login.
 *
 * Unlike useAuthFetch/useFetchData, this works without authentication tokens.
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { logger } from '@/utils/logger';

interface FetchDataResponse<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: (fetchUrl?: string) => Promise<T | null>;
}

/**
 * Hook for fetching public data (no authentication required)
 *
 * @param url - API endpoint to fetch from
 * @param options - Fetch options (method, headers, etc.)
 * @returns Object with data, loading state, error, and refetch function
 *
 * @example
 * const { data, loading, error } = usePublicFetch('/officials');
 *
 * @example
 * const { data, loading, error, refetch } = usePublicFetch(`/pageContent/${id}`);
 */
const usePublicFetch = <T = any>(
  url: string | null,
  options: RequestInit = {}
): FetchDataResponse<T> => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const apiURL = import.meta.env.VITE_API_URL as string;

  // Stabilize options object using useMemo (same as useFetchData optimization)
  const stableOptions = useMemo(() => options, [JSON.stringify(options)]);

  const fetchData = useCallback(
    async (fetchUrl?: string): Promise<T | null> => {
      const urlToFetch = fetchUrl || url;

      // Don't fetch if no URL
      if (!urlToFetch) {
        setLoading(false);
        return null;
      }

      try {
        setLoading(true);
        setError(null);

        // Build full URL
        const fullUrl = /^https?:\/\//i.test(urlToFetch)
          ? urlToFetch
          : `${apiURL}${urlToFetch}`;

        logger.debug(`Public fetch: ${fullUrl}`);

        const response = await fetch(fullUrl, {
          ...stableOptions,
          headers: {
            'Content-Type': 'application/json',
            ...stableOptions.headers,
          },
        });

        if (!response.ok) {
          const errorMessage = `Request failed with status ${response.status}`;
          logger.warn(errorMessage, { url: fullUrl, status: response.status });
          throw new Error(errorMessage);
        }

        const contentType = response.headers.get('content-type');

        // Handle empty responses
        if (
          response.status === 204 ||
          !contentType?.includes('application/json')
        ) {
          logger.debug('Empty or non-JSON response');
          return null;
        }

        const result = await response.json();
        setData(result as T);
        logger.debug(`Public fetch successful: ${fullUrl}`);
        return result as T;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'An error occurred';
        setError(errorMessage);
        logger.error('Public fetch error:', err);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [url, apiURL, stableOptions]
  );

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
};

export default usePublicFetch;
