import { useState, useEffect, useCallback, useRef } from 'react';

export interface NominatimSuggestion {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
  address: {
    road?: string;
    suburb?: string;
    city?: string;
    municipality?: string;
    province?: string;
    region?: string;
    postcode?: string;
    country?: string;
  };
}

interface UseNominatimOptions {
  debounceMs?: number;
  minLength?: number;
  countryCode?: string; // e.g., 'ph' for Philippines
  limit?: number;
}

export const useNominatim = (options: UseNominatimOptions = {}) => {
  const {
    debounceMs = 300,
    minLength = 3,
    countryCode = 'ph',
    limit = 5,
  } = options;

  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<NominatimSuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const abortControllerRef = useRef<AbortController | null>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  const fetchSuggestions = useCallback(
    async (searchQuery: string) => {
      if (!searchQuery || searchQuery.length < minLength) {
        setSuggestions([]);
        return;
      }

      // Abort previous request if still pending
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      abortControllerRef.current = new AbortController();
      setLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams({
          q: searchQuery,
          format: 'json',
          addressdetails: '1',
          limit: limit.toString(),
          ...(countryCode && { countrycodes: countryCode }),
        });

        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?${params}`,
          {
            signal: abortControllerRef.current.signal,
            headers: {
              'User-Agent': 'Barangay-Talipapa-App', // Nominatim requires a User-Agent
            },
          }
        );

        if (!response.ok) {
          throw new Error('Failed to fetch suggestions');
        }

        const data: NominatimSuggestion[] = await response.json();
        setSuggestions(data);
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          setError(err.message || 'Failed to fetch address suggestions');
          setSuggestions([]);
        }
      } finally {
        setLoading(false);
      }
    },
    [minLength, limit, countryCode]
  );

  useEffect(() => {
    // Clear previous timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Set new timer
    debounceTimerRef.current = setTimeout(() => {
      fetchSuggestions(query);
    }, debounceMs);

    // Cleanup
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [query, debounceMs, fetchSuggestions]);

  const clearSuggestions = useCallback(() => {
    setSuggestions([]);
    setError(null);
  }, []);

  return {
    query,
    setQuery,
    suggestions,
    loading,
    error,
    clearSuggestions,
  };
};
