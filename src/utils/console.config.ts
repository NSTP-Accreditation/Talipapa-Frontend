/**
 * Production Console Configuration
 *
 * This file disables console logs in production to prevent
 * sensitive information from being exposed in the browser console.
 *
 * SECURITY: Never log sensitive data like tokens, passwords, or user details
 */

// Disable console logs in production
if (import.meta.env.PROD) {
  // Override console methods to no-op in production
  console.log = () => {};
  console.warn = () => {};
  console.info = () => {};
  console.debug = () => {};

  // Keep error logging for critical issues only
  const originalError = console.error;
  console.error = (...args: any[]) => {
    // Filter out sensitive error messages
    const message = args[0]?.toString() || '';
    if (
      message.includes('token') ||
      message.includes('password') ||
      message.includes('auth') ||
      message.includes('user')
    ) {
      // Don't log sensitive errors
      return;
    }
    originalError.apply(console, args);
  };
}

// Development mode: Enable selective logging
if (import.meta.env.DEV) {
  // Only show logs when explicitly enabled
  if (!(window as any).__DEV_MODE__) {
    console.log = () => {};
    console.info = () => {};
    console.debug = () => {};
  }

  // Always allow warnings and errors in development
}

/**
 * Enable debug mode in development:
 * Open browser console and run: window.__DEV_MODE__ = true
 * Then refresh the page to see detailed logs
 */

export {};
