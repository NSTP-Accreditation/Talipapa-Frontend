import { useCallback, useRef, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { requestCache } from '../../utils/requestCache';

// Types
interface AuthResponse {
  accessToken?: string;
}

interface RefreshTokenResponse {
  accessToken: string;
}

interface AuthContextType {
  authResponse: AuthResponse | null;
  refreshToken: () => Promise<RefreshTokenResponse>;
  logout: () => void;
}

interface AuthFetchOptions extends RequestInit {
  body?: any;
}

interface SuccessResponse {
  message: string;
}

export const useAuthFetch = () => {
  const apiURL = import.meta.env.VITE_API_URL as string;
  const { user, refreshToken, logout } = useAuth();

  // Use refs to avoid recreating the callback on every token change
  const userRef = useRef(user);
  const refreshTokenRef = useRef(refreshToken);
  const logoutRef = useRef(logout);

  // Keep refs up to date
  useEffect(() => {
    userRef.current = user;
    refreshTokenRef.current = refreshToken;
    logoutRef.current = logout;
  }, [user, refreshToken, logout]);

  const authFetch = useCallback(
    async <T = any>(
      url: string,
      options: AuthFetchOptions = {}
    ): Promise<T | SuccessResponse> => {
      // Create cache key for GET requests (skip caching for mutations)
      const method = options.method?.toUpperCase() || 'GET';
      const finalUrl = /^https?:\/\//i.test(url) ? url : `${apiURL}${url}`;
      const shouldCache = method === 'GET';
      const cacheKey = shouldCache ? `${method}:${finalUrl}` : '';

      // Wrap the fetch logic in a function for deduplication
      const fetchFunction = async () => {
        // Get token from context OR fallback to localStorage
        let token = userRef.current?.accessToken;

        if (!token) {
          token = localStorage.getItem('accessToken') || undefined;
        }

        // If no token, logout (which will redirect to login)
        if (!token) {
          logoutRef.current();
          return Promise.reject(new Error('Authentication required'));
        }

        const isFormData = options.body instanceof FormData;

        const headers: HeadersInit = {
          ...(options.headers || {}),
          Authorization: `Bearer ${token}`,
          ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
        };

        let response = await fetch(finalUrl, {
          ...options,
          headers,
          credentials: 'include',
        });

        if (response.status === 403) {
          try {
            const newTokens = await refreshTokenRef.current();
            token = newTokens?.accessToken;

            if (!token) {
              throw new Error('Token refresh returned no token');
            }

            const retryHeaders: HeadersInit = {
              ...(options.headers || {}),
              Authorization: `Bearer ${token}`,
              ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
            };

            response = await fetch(finalUrl, {
              ...options,
              headers: retryHeaders,
              credentials: 'include',
            });
          } catch (refreshErr) {
            logoutRef.current();
            throw refreshErr;
          }
        }

        const contentType = response.headers.get('content-type');
        const contentLength = response.headers.get('content-length');

        if (
          response.status === 204 ||
          contentLength === '0' ||
          !contentType?.includes('application/json')
        ) {
          if (!response.ok) {
            throw new Error(`Request failed with status ${response.status}`);
          }

          return { message: 'Success' } as SuccessResponse;
        }

        const data: T = await response.json();

        if (!response.ok) {
          throw new Error(
            (data as any).message ||
              `Request failed with status ${response.status}`
          );
        }

        return data;
      };

      // Use request deduplication for GET requests only
      if (shouldCache) {
        return requestCache.dedupe(cacheKey, fetchFunction);
      }

      // For non-GET requests (POST, PUT, DELETE), execute directly
      return fetchFunction();
    },
    [apiURL] // Only depend on apiURL (which never changes)
  );

  return authFetch;
};
