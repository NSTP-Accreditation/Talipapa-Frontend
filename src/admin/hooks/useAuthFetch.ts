import { useCallback } from 'react';
import { useAuth } from '../../contexts/AuthContext';

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

  const authFetch = useCallback(
    async <T = any>(
      url: string,
      options: AuthFetchOptions = {}
    ): Promise<T | SuccessResponse> => {
      // Get token from context OR fallback to localStorage
      let token = user?.accessToken;

      if (!token) {
        token = localStorage.getItem('accessToken') || undefined;
      }

      // If no token, logout (which will redirect to login)
      if (!token) {
        logout();
        return Promise.reject(new Error('Authentication required'));
      }

      const isFormData = options.body instanceof FormData;

      const headers: HeadersInit = {
        ...(options.headers || {}),
        Authorization: `Bearer ${token}`,
        ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
      };

      try {
        const finalUrl = /^https?:\/\//i.test(url) ? url : `${apiURL}${url}`;

        let response = await fetch(finalUrl, {
          ...options,
          headers,
          credentials: 'include',
        });

        if (response.status === 403) {
          try {
            const newTokens = await refreshToken();
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
            logout();
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
      } catch (error) {
        throw error;
      }
    },
    [apiURL, user?.accessToken, refreshToken, logout]
  );

  return authFetch;
};
