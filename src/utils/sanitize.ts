/**
 * HTML Sanitization Utility
 *
 * Protects against XSS attacks by sanitizing user-generated HTML content
 * before rendering it in the application.
 *
 * @critical - Always use this when rendering HTML from untrusted sources
 */

import DOMPurify, { type Config as DOMPurifyConfig } from 'dompurify';
import { logger } from './logger';

/**
 * Default configuration for HTML sanitization
 * These settings allow common formatting while blocking dangerous elements
 */
const DEFAULT_CONFIG: DOMPurifyConfig = {
  // Allowed tags - common formatting and structure
  ALLOWED_TAGS: [
    'p',
    'br',
    'strong',
    'em',
    'u',
    'h1',
    'h2',
    'h3',
    'h4',
    'h5',
    'h6',
    'ul',
    'ol',
    'li',
    'a',
    'blockquote',
    'code',
    'pre',
    'hr',
    'div',
    'span',
    'table',
    'thead',
    'tbody',
    'tr',
    'th',
    'td',
    'img',
  ],

  // Allowed attributes per tag
  ALLOWED_ATTR: ['href', 'title', 'alt', 'src', 'class', 'id', 'target', 'rel'],

  // Allowed URI schemes for links and images
  ALLOWED_URI_REGEXP:
    /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp|data):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i,

  // Keep HTML structure
  KEEP_CONTENT: true,

  // Return a DOM element instead of a string for better performance
  RETURN_DOM: false,

  // Return as a string
  RETURN_DOM_FRAGMENT: false,
};

/**
 * Strict configuration for highly sensitive content
 * Allows only basic text formatting
 */
const STRICT_CONFIG: DOMPurifyConfig = {
  ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u'],
  ALLOWED_ATTR: [],
  KEEP_CONTENT: true,
};

/**
 * Permissive configuration for rich content like news articles
 * Allows more tags but still blocks scripts and dangerous elements
 */
const PERMISSIVE_CONFIG: DOMPurifyConfig = {
  ...DEFAULT_CONFIG,
  ALLOWED_TAGS: [
    ...DEFAULT_CONFIG.ALLOWED_TAGS!,
    'article',
    'section',
    'header',
    'footer',
    'nav',
    'aside',
    'figure',
    'figcaption',
    'time',
    'mark',
    'small',
    'del',
    'ins',
  ],
  ALLOWED_ATTR: [
    ...DEFAULT_CONFIG.ALLOWED_ATTR!,
    'style',
    'width',
    'height',
    'align',
    'datetime',
  ],
};

/**
 * Sanitize HTML content using DOMPurify
 *
 * @param html - The HTML string to sanitize
 * @param config - Optional DOMPurify configuration (uses DEFAULT_CONFIG if not provided)
 * @returns Sanitized HTML string safe for rendering
 *
 * @example
 * // Basic usage
 * const safeHTML = sanitizeHtml('<p>Hello <script>alert("XSS")</script></p>');
 * // Returns: '<p>Hello </p>'
 *
 * @example
 * // With custom config
 * const safeHTML = sanitizeHtml(userContent, { ALLOWED_TAGS: ['p', 'br'] });
 */
export function sanitizeHtml(
  html: string,
  config: DOMPurifyConfig = DEFAULT_CONFIG
): string {
  if (!html || typeof html !== 'string') {
    logger.warn('sanitizeHtml: Invalid input, returning empty string', {
      html,
    });
    return '';
  }

  try {
    // Sanitize the HTML - returns string when RETURN_DOM is false
    const clean = DOMPurify.sanitize(html, config) as string;

    // Log if anything was removed (development only)
    if (clean !== html && import.meta.env.DEV) {
      logger.debug(
        'HTML was sanitized - potentially dangerous content removed'
      );
    }

    return clean;
  } catch (error) {
    logger.error('Failed to sanitize HTML:', error);
    // Return empty string on error to prevent rendering potentially dangerous content
    return '';
  }
}

/**
 * Sanitize HTML with strict settings - only basic formatting allowed
 * Use this for user comments, descriptions, or any untrusted input
 *
 * @param html - The HTML string to sanitize
 * @returns Sanitized HTML with only basic formatting
 *
 * @example
 * const safeComment = sanitizeHtmlStrict(userComment);
 */
export function sanitizeHtmlStrict(html: string): string {
  return sanitizeHtml(html, STRICT_CONFIG);
}

/**
 * Sanitize HTML with permissive settings - allows rich content
 * Use this for admin-created content like news articles or guidelines
 *
 * @param html - The HTML string to sanitize
 * @returns Sanitized HTML with rich formatting allowed
 *
 * @example
 * const safeArticle = sanitizeHtmlPermissive(newsArticle);
 */
export function sanitizeHtmlPermissive(html: string): string {
  return sanitizeHtml(html, PERMISSIVE_CONFIG);
}

/**
 * Sanitize and return props for React's dangerouslySetInnerHTML
 * This is a convenience function to make the code more explicit
 *
 * @param html - The HTML string to sanitize
 * @param config - Optional DOMPurify configuration
 * @returns Object with __html property for dangerouslySetInnerHTML
 *
 * @example
 * // Before: <div dangerouslySetInnerHTML={{ __html: unsafeHTML }} />
 * // After:  <div dangerouslySetInnerHTML={createSafeHtml(unsafeHTML)} />
 * <div dangerouslySetInnerHTML={createSafeHtml(content)} />
 */
export function createSafeHtml(
  html: string,
  config?: DOMPurifyConfig
): { __html: string } {
  return {
    __html: sanitizeHtml(html, config),
  };
}

/**
 * Sanitize HTML for use in React components (alias for convenience)
 */
export const sanitize = {
  /** Default sanitization - balanced security and formatting */
  html: sanitizeHtml,

  /** Strict sanitization - maximum security, minimal formatting */
  strict: sanitizeHtmlStrict,

  /** Permissive sanitization - rich content with security */
  permissive: sanitizeHtmlPermissive,

  /** Create props for dangerouslySetInnerHTML */
  toProps: createSafeHtml,
};

// Export default for convenience
export default sanitize;
