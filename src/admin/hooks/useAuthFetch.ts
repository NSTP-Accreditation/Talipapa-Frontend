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
      let token = user?.accessToken;
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

            const retryHeaders: HeadersInit = {
              ...(options.headers || {}),
              Authorization: token ? `Bearer ${token}` : '',
              ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
            };

            response = await fetch(finalUrl, {
              ...options,
              headers: retryHeaders,
              credentials: 'include',
            });
          } catch (refreshErr) {
            const errorMessage =
              refreshErr instanceof Error
                ? refreshErr.message
                : 'Token refresh failed';
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
