/**
 * React Hook for Login Rate Limiting
 *
 * Provides easy-to-use interface for brute force protection
 * with automatic countdown and UI state management
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { getLoginRateLimiter } from '../utils/security/loginRateLimiter';

interface UseLoginRateLimiterReturn {
  // State
  isLocked: boolean;
  remainingAttempts: number;
  lockoutEndTime?: number;
  remainingLockoutSeconds: number;
  attemptCount: number;
  canAttemptLogin: boolean;

  // Actions
  checkCanLogin: (username?: string) => boolean;
  recordLoginAttempt: (username: string, success: boolean) => void;
  resetLockout: (username?: string) => void;

  // UI Helpers
  getLockoutMessage: () => string;
  getRemainingAttemptsMessage: () => string;
  getProgressPercentage: () => number;
}

export function useLoginRateLimiter(): UseLoginRateLimiterReturn {
  const rateLimiter = getLoginRateLimiter();
  const [isLocked, setIsLocked] = useState(false);
  const [remainingAttempts, setRemainingAttempts] = useState(5);
  const [lockoutEndTime, setLockoutEndTime] = useState<number | undefined>();
  const [remainingLockoutSeconds, setRemainingLockoutSeconds] = useState(0);
  const [attemptCount, setAttemptCount] = useState(0);
  const countdownTimerRef = useRef<NodeJS.Timeout | null>(null);

  /**
   * Update state from rate limiter status
   */
  const updateStatus = useCallback(
    (username?: string) => {
      const status = rateLimiter.getStatus(username);

      setIsLocked(status.isLocked);
      setRemainingAttempts(status.remainingAttempts);
      setLockoutEndTime(status.lockedUntil);
      setAttemptCount(status.attemptCount);

      if (status.lockedUntil) {
        const remaining = Math.max(
          0,
          Math.ceil((status.lockedUntil - Date.now()) / 1000)
        );
        setRemainingLockoutSeconds(remaining);
      } else {
        setRemainingLockoutSeconds(0);
      }
    },
    [rateLimiter]
  );

  /**
   * Start countdown timer for lockout
   */
  const startCountdown = useCallback(() => {
    // Clear existing timer
    if (countdownTimerRef.current) {
      clearInterval(countdownTimerRef.current);
    }

    if (!lockoutEndTime) return;

    countdownTimerRef.current = setInterval(() => {
      const now = Date.now();
      const remaining = Math.max(0, Math.ceil((lockoutEndTime - now) / 1000));

      setRemainingLockoutSeconds(remaining);

      if (remaining <= 0) {
        setIsLocked(false);
        setLockoutEndTime(undefined);
        updateStatus();

        if (countdownTimerRef.current) {
          clearInterval(countdownTimerRef.current);
          countdownTimerRef.current = null;
        }
      }
    }, 1000);
  }, [lockoutEndTime, updateStatus]);

  /**
   * Check if login attempt is allowed
   */
  const checkCanLogin = useCallback(
    (username?: string): boolean => {
      const result = rateLimiter.checkAttempt(username);

      if (!result.allowed) {
        if (result.lockedUntil) {
          setIsLocked(true);
          setLockoutEndTime(result.lockedUntil);
          const remaining = Math.max(
            0,
            Math.ceil((result.lockedUntil - Date.now()) / 1000)
          );
          setRemainingLockoutSeconds(remaining);
        }
        updateStatus(username);
        return false;
      }

      updateStatus(username);
      return true;
    },
    [rateLimiter, updateStatus]
  );

  /**
   * Record a login attempt
   */
  const recordLoginAttempt = useCallback(
    (username: string, success: boolean) => {
      rateLimiter.recordAttempt(username, success);
      updateStatus(username);
    },
    [rateLimiter, updateStatus]
  );

  /**
   * Reset lockout (admin function)
   */
  const resetLockout = useCallback(
    (username?: string) => {
      rateLimiter.reset(username);
      updateStatus(username);
      setIsLocked(false);
      setLockoutEndTime(undefined);
      setRemainingLockoutSeconds(0);

      if (countdownTimerRef.current) {
        clearInterval(countdownTimerRef.current);
        countdownTimerRef.current = null;
      }
    },
    [rateLimiter, updateStatus]
  );

  /**
   * Get user-friendly lockout message
   */
  const getLockoutMessage = useCallback((): string => {
    if (!isLocked) return '';

    if (remainingLockoutSeconds > 60) {
      const minutes = Math.ceil(remainingLockoutSeconds / 60);
      return `Too many failed login attempts. Your account is locked for ${minutes} more minute${minutes > 1 ? 's' : ''}.`;
    } else if (remainingLockoutSeconds > 0) {
      return `Too many failed login attempts. Your account is locked for ${remainingLockoutSeconds} more second${remainingLockoutSeconds !== 1 ? 's' : ''}.`;
    } else {
      return `Account lockout expiring. Please wait...`;
    }
  }, [isLocked, remainingLockoutSeconds]);

  /**
   * Get remaining attempts message
   */
  const getRemainingAttemptsMessage = useCallback((): string => {
    if (isLocked) return '';
    if (attemptCount === 0) return '';

    if (remainingAttempts === 1) {
      return `🚨 FINAL ATTEMPT: Your account will be locked for 15 minutes if this attempt fails.`;
    } else if (remainingAttempts === 2) {
      return `⚠️ WARNING: Only ${remainingAttempts} attempts remaining. Account will be locked for 15 minutes after failed attempts.`;
    } else if (remainingAttempts === 3) {
      return `⚠️ CAUTION: ${remainingAttempts} attempts remaining before your account is locked for 15 minutes.`;
    } else {
      return `${remainingAttempts} of 5 attempts remaining before lockout.`;
    }
  }, [isLocked, remainingAttempts, attemptCount]);

  /**
   * Get progress percentage (for UI progress bars)
   */
  const getProgressPercentage = useCallback((): number => {
    const maxAttempts = 5; // Should match config
    return (remainingAttempts / maxAttempts) * 100;
  }, [remainingAttempts]);

  /**
   * Effect: Start countdown timer when locked
   */
  useEffect(() => {
    if (isLocked && lockoutEndTime) {
      startCountdown();
    }

    return () => {
      if (countdownTimerRef.current) {
        clearInterval(countdownTimerRef.current);
      }
    };
  }, [isLocked, lockoutEndTime, startCountdown]);

  /**
   * Effect: Initialize status on mount and check on page load
   */
  useEffect(() => {
    // Check status immediately on mount
    const initialStatus = rateLimiter.getStatus();
    setIsLocked(initialStatus.isLocked);
    setRemainingAttempts(initialStatus.remainingAttempts);
    setLockoutEndTime(initialStatus.lockedUntil);
    setAttemptCount(initialStatus.attemptCount);

    if (initialStatus.lockedUntil) {
      const remaining = Math.max(
        0,
        Math.ceil((initialStatus.lockedUntil - Date.now()) / 1000)
      );
      setRemainingLockoutSeconds(remaining);

      // Start countdown if locked
      if (initialStatus.isLocked) {
        startCountdown();
      }
    }
  }, [rateLimiter, startCountdown]);

  return {
    // State
    isLocked,
    remainingAttempts,
    lockoutEndTime,
    remainingLockoutSeconds,
    attemptCount,
    canAttemptLogin: !isLocked && remainingAttempts > 0,

    // Actions
    checkCanLogin,
    recordLoginAttempt,
    resetLockout,

    // UI Helpers
    getLockoutMessage,
    getRemainingAttemptsMessage,
    getProgressPercentage,
  };
}

export default useLoginRateLimiter;
