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

      // If no token, redirect to login instead of throwing error
      if (!token || token === 'undefined' || token === 'null') {
        console.warn('⚠️ No authentication token - redirecting to login');
        logout();
        window.location.href = '/admin/login';
        throw new Error('No authentication token available');
      }

      const isFormData = options.body instanceof FormData;

      const headers: HeadersInit = {
        ...(options.headers || {}),
        Authorization: `Bearer ${token}`,
        ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
      };

      try {
        const finalUrl = /^https?:\/\//i.test(url) ? url : `${apiURL}${url}`;

        console.log('📤 Making authenticated request:', {
          url: finalUrl,
          method: options.method || 'GET',
          hasToken: !!token,
          tokenLength: token?.length,
        });

        let response = await fetch(finalUrl, {
          ...options,
          headers,
          credentials: 'include',
        });

        console.log('📥 Response:', {
          status: response.status,
          statusText: response.statusText,
          ok: response.ok,
        });

        if (response.status === 403) {
          console.log('🔄 Token expired (403), attempting refresh...');

          try {
            const newTokens = await refreshToken();
            token = newTokens?.accessToken;

            if (!token) {
              throw new Error('Token refresh returned no token');
            }

            console.log('✅ Token refreshed, retrying request...');

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

            console.log('📥 Retry response:', response.status);
          } catch (refreshErr) {
            console.error('❌ Token refresh failed, logging out:', refreshErr);
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
