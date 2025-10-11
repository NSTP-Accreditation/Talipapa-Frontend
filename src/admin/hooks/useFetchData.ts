import { useState, useEffect, useCallback } from "react";
import { useAuthFetch } from './useAuthFetch';

// Types
interface FetchDataResponse<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<T | null>;
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

  const fetchData = useCallback(async (): Promise<T | null> => {
    if (!url) {
      setLoading(false);
      return null;
    }

    try {
      setLoading(true);
      setError(null);
      const result = await authFetch<T>(url, options);
      setData(result as T);
      return result as T;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred";
      setData(null);
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [url, authFetch, JSON.stringify(options)]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
};

export default useFetchData;