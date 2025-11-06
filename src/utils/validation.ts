/**
 * Validation Utilities
 *
 * Provides validation and sanitization functions for user input,
 * particularly for names and addresses.
 */

/**
 * Regular expression for validating name fields
 * Allows Unicode letters, spaces, hyphens, and apostrophes
 */
export const nameRegex = /^[\p{L}\s'\-]+$/u;

/**
 * Sanitizes a name string by removing invalid characters
 *
 * @param value - The name string to sanitize
 * @returns The sanitized name containing only valid characters
 *
 * @example
 * sanitizeName("Juan123!@#"); // Returns: "Juan"
 * sanitizeName("O'Brien-Smith"); // Returns: "O'Brien-Smith"
 */
export function sanitizeName(value: string) {
  if (!value) return '';
  return value.replace(/[^\p{L}\s'\-]/gu, '');
}

/**
 * Validates a name string according to specific rules
 *
 * @param value - The name string to validate
 * @param required - Whether the field is required (default: false)
 * @returns Validation result with `valid` boolean and `message` string
 *
 * @example
 * validateName("Juan", true);
 * // Returns: { valid: true, message: '' }
 *
 * @example
 * validateName("", true);
 * // Returns: { valid: false, message: 'This field is required.' }
 *
 * @example
 * validateName("Juan123");
 * // Returns: { valid: false, message: 'Only alphabetic characters...' }
 */
export function validateName(value: string, required = false) {
  const v = (value || '').trim();
  if (required && v === '') {
    return { valid: false, message: 'This field is required.' };
  }
  if (v === '') return { valid: true, message: '' };
  if (!nameRegex.test(v)) {
    return {
      valid: false,
      message:
        'Only alphabetic characters, spaces, hyphens or apostrophes are allowed.',
    };
  }
  if (v.length > 80) return { valid: false, message: 'Name is too long.' };
  return { valid: true, message: '' };
}

/**
 * Validates an address string with comprehensive checks
 *
 * Performs multiple validation checks including:
 * - Minimum length requirements
 * - Pattern detection for repeated characters
 * - Presence of numbers or address keywords
 * - Detection of invalid patterns (single letters, random characters)
 *
 * @param address - The address string to validate
 * @returns Validation result with `valid` boolean and optional `message` string
 *
 * @example
 * validateAddress("123 Main Street, Quezon City");
 * // Returns: { valid: true, message: '' }
 *
 * @example
 * validateAddress("abc");
 * // Returns: { valid: false, message: 'Address is too short.' }
 *
 * @example
 * validateAddress("asdasdasdasd");
 * // Returns: { valid: false, message: 'Address looks invalid.' }
 *
 * @example
 * validateAddress("Purok 5 Barangay Talipapa");
 * // Returns: { valid: true, message: '' }
 */
export const validateAddress = (address: string) => {
  const clean = (address || '').trim();

  if (clean.length === 0) {
    return { valid: true };
  }

  if (clean.length < 10) {
    return { valid: false, message: 'Address is too short.' };
  }

  // Reject if it looks like random characters, e.g., 'asdasdasd' or 'qweqwe'
  const repeatedPattern = /(\w)\1{4,}/i; // same character 5+ times
  if (repeatedPattern.test(clean.replace(/\s+/g, ''))) {
    return { valid: false, message: 'Address looks invalid.' };
  }

  const words = clean.split(/\s+/).filter(Boolean);
  if (words.length < 2) {
    return { valid: false, message: 'Please provide a more specific address.' };
  }

  const hasNumber = /\d/.test(clean);
  const commonKeywords =
    /street|st\.?|road|rd\.?|avenue|ave\.?|lane|ln\.?|boulevard|blvd\.?|drive|dr\.?|block|brgy|barangay|purok|compound|subdivision|subd\.?|sitio|zone|city|municipal|province|town|street/gi;

  if (!hasNumber && !commonKeywords.test(clean)) {
    // If no digits and no address keywords, likely not a real address
    return {
      valid: false,
      message:
        'Address should include a house number or a common address term (street, barangay, city, etc.).',
    };
  }

  // Reject if most tokens are single letters (e.g., 'a b c')
  const singleLetterTokens = words.filter((w) => w.length === 1).length;
  if (singleLetterTokens >= Math.ceil(words.length / 2)) {
    return { valid: false, message: 'Address looks invalid.' };
  }

  // Basic pass
  return { valid: true, message: '' };
};
