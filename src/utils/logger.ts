/**
 * Logger Utility
 *
 * Provides safe logging that:
 * - Only logs in development mode
 * - Filters sensitive data from error logs
 * - Can be easily disabled in production
 *
 * Usage:
 * import { logger } from '@/utils/logger';
 *
 * logger.debug('Debug info:', data);
 * logger.info('Info message');
 * logger.warn('Warning:', issue);
 * logger.error('Error occurred:', error);
 */

const isDevelopment = import.meta.env.DEV;

/**
 * Check if a value contains sensitive information
 */
const isSensitive = (value: any): boolean => {
  if (typeof value === 'string') {
    const lowerValue = value.toLowerCase();
    return (
      lowerValue.includes('token') ||
      lowerValue.includes('password') ||
      lowerValue.includes('secret') ||
      lowerValue.includes('key') ||
      lowerValue.includes('authorization')
    );
  }
  return false;
};

/**
 * Filter sensitive data from objects
 */
const filterSensitiveData = (obj: any): any => {
  if (obj === null || obj === undefined) {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(filterSensitiveData);
  }

  if (typeof obj === 'object') {
    const filtered: any = {};
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        if (isSensitive(key)) {
          filtered[key] = '***REDACTED***';
        } else if (typeof obj[key] === 'object') {
          filtered[key] = filterSensitiveData(obj[key]);
        } else {
          filtered[key] = obj[key];
        }
      }
    }
    return filtered;
  }

  return obj;
};

/**
 * Process arguments for logging
 */
const processArgs = (...args: any[]): any[] => {
  return args.map((arg) => {
    if (typeof arg === 'object' && arg !== null) {
      return filterSensitiveData(arg);
    }
    return arg;
  });
};

export const logger = {
  /**
   * Debug logging - only in development
   */
  debug: (...args: any[]) => {
    if (isDevelopment) {
      console.log(...args);
    }
  },

  /**
   * Info logging - only in development
   */
  info: (...args: any[]) => {
    if (isDevelopment) {
      console.info(...args);
    }
  },

  /**
   * Warning logging - only in development
   */
  warn: (...args: any[]) => {
    if (isDevelopment) {
      console.warn(...args);
    }
  },

  /**
   * Error logging - always logs but filters sensitive data
   */
  error: (...args: any[]) => {
    const filtered = processArgs(...args);
    console.error(...filtered);
  },

  /**
   * Group logging - only in development
   */
  group: (label: string) => {
    if (isDevelopment) {
      console.group(label);
    }
  },

  /**
   * Group end - only in development
   */
  groupEnd: () => {
    if (isDevelopment) {
      console.groupEnd();
    }
  },

  /**
   * Table logging - only in development
   */
  table: (data: any) => {
    if (isDevelopment) {
      console.table(data);
    }
  },

  /**
   * Time tracking - only in development
   */
  time: (label: string) => {
    if (isDevelopment) {
      console.time(label);
    }
  },

  /**
   * Time end - only in development
   */
  timeEnd: (label: string) => {
    if (isDevelopment) {
      console.timeEnd(label);
    }
  },
};

// Make logger available globally for debugging in development
if (isDevelopment && typeof window !== 'undefined') {
  (window as any).__logger__ = logger;
}

export default logger;
