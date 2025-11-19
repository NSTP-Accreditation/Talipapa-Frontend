/**
 * JWT Token Utility Functions
 *
 * Centralized JWT decoding and validation utilities.
 * This prevents code duplication and ensures consistent token handling.
 */

import { JWTPayload } from '../types/auth.types';

/**
 * Decode a JWT token
 *
 * @param token - JWT token string
 * @returns Decoded token payload or null if invalid
 *
 * @example
 * ```typescript
 * const payload = decodeJWT(user.accessToken);
 * if (payload?.userInfo?.roles) {
 *   // Use roles
 * }
 * ```
 */
export const decodeJWT = (token: string): JWTPayload | null => {
  try {
    if (!token || typeof token !== 'string') {
      console.warn('[JWT] Invalid token format');
      return null;
    }

    const parts = token.split('.');
    if (parts.length !== 3) {
      console.warn('[JWT] Token does not have 3 parts');
      return null;
    }

    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');

    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );

    const decoded = JSON.parse(jsonPayload) as JWTPayload;

    // Validate token expiration
    if (decoded.exp) {
      const expirationTime = decoded.exp * 1000; // Convert to milliseconds
      const now = Date.now();

      if (now >= expirationTime) {
        console.warn('[JWT] Token has expired', {
          expiredAt: new Date(expirationTime).toISOString(),
          now: new Date(now).toISOString(),
        });
        return null;
      }
    }

    return decoded;
  } catch (error) {
    console.error('[JWT] Failed to decode token:', error);
    return null;
  }
};

/**
 * Extract role IDs from JWT token
 *
 * @param token - JWT token string
 * @returns Array of role IDs or empty array
 */
export const getRoleIdsFromToken = (token: string): number[] => {
  const decoded = decodeJWT(token);
  return decoded?.userInfo?.roles || [];
};

/**
 * Check if a JWT token is expired
 *
 * @param token - JWT token string
 * @returns true if token is expired or invalid
 */
export const isTokenExpired = (token: string): boolean => {
  const decoded = decodeJWT(token);

  if (!decoded?.exp) {
    // No expiration means we can't verify, treat as valid
    return false;
  }

  const expirationTime = decoded.exp * 1000;
  return Date.now() >= expirationTime;
};

/**
 * Get token expiration time in milliseconds
 *
 * @param token - JWT token string
 * @returns Expiration timestamp in milliseconds or null
 */
export const getTokenExpiration = (token: string): number | null => {
  const decoded = decodeJWT(token);
  return decoded?.exp ? decoded.exp * 1000 : null;
};
