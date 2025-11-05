import { useState, useEffect, useCallback } from 'react';
import { useAuthFetch } from './useAuthFetch';
import { useAuth } from '../../contexts/AuthContext';

// Types
interface FetchDataResponse<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: (fetchUrl?: string) => Promise<T | null>;
}

interface FetchOptions extends RequestInit {}

const useFetchData = <T = any>(
  url: string | null,
  options: FetchOptions = {}
): FetchDataResponse<T> => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const authFetch = useAuthFetch();
  const { isAuthenticated, loading: authLoading } = useAuth();

  const fetchData = useCallback(
    async (fetchUrl?: string): Promise<T | null> => {
      const urlToFetch = fetchUrl || url;

      // Don't fetch if no URL
      if (!urlToFetch) {
        setLoading(false);
        return null;
      }

      // Don't fetch if not authenticated
      if (!isAuthenticated) {
        setLoading(false);
        setError('Not authenticated');
        return null;
      }

      try {
        setLoading(true);
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setError(null);
        const result = await authFetch<T>(urlToFetch, options);
        setData(result as T);
        return result as T;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'An error occurred';
        setData(null);
        setError(errorMessage);

        // Don't re-throw authentication errors - they're handled by authFetch
        if (errorMessage === 'No authentication token available') {
          return null;
        }

        throw err;
      } finally {
        setLoading(false);
      }
    },
    [url, authFetch, isAuthenticated, JSON.stringify(options)]
  );

  useEffect(() => {
    // Only fetch if auth is loaded and user is authenticated
    if (!authLoading && isAuthenticated) {
      fetchData();
    } else if (!authLoading && !isAuthenticated) {
      // Auth loaded but not authenticated - stop loading
      setLoading(false);
    }
  }, [fetchData, authLoading, isAuthenticated]);

  return { data, loading, error, refetch: fetchData };
};

export default useFetchData;
