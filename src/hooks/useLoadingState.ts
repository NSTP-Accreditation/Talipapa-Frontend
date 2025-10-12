import { useState, useEffect } from 'react';

/**
 * Custom hook for simulating loading states with minimum display time
 * Ensures loading screen is visible for at least the minimum duration
 * 
 * @param minDisplayTime - Minimum time to show loading (default: 1500ms)
 * @returns isLoading state and setter
 */
export const useLoadingState = (minDisplayTime: number = 1000) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Ensure loading shows for at least minDisplayTime
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, minDisplayTime);

    return () => clearTimeout(timer);
  }, [minDisplayTime]);

  return { isLoading, setIsLoading };
};

/**
 * Hook for managing async operations with minimum loading display time
 * Ensures loading indicator is visible for at least minDisplayTime
 */
export const useMinimumLoadingTime = () => {
  const [isLoading, setIsLoading] = useState(false);

  const executeWithMinLoading = async <T,>(
    asyncFn: () => Promise<T>,
    minDisplayTime: number = 1000
  ): Promise<T> => {
    setIsLoading(true);
    
    const startTime = Date.now();
    
    try {
      const result = await asyncFn();
      const elapsedTime = Date.now() - startTime;
      
      // If operation finished too quickly, wait for remaining time
      if (elapsedTime < minDisplayTime) {
        await new Promise(resolve => 
          setTimeout(resolve, minDisplayTime - elapsedTime)
        );
      }
      
      return result;
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, executeWithMinLoading };
};

/**
 * Custom hook for data fetching with loading state
 */
export const useDataFetch = <T,>(
  fetchFn: () => Promise<T>,
  deps: any[] = []
) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let mounted = true;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await fetchFn();
        if (mounted) {
          setData(result);
        }
      } catch (err) {
        if (mounted) {
          setError(err as Error);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      mounted = false;
    };
  }, deps);

  return { data, loading, error, refetch: () => setLoading(true) };
};
