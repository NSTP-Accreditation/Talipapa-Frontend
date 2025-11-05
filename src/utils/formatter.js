/**
 * Formats a record object into a full name string
 *
 * @param {Object} record - The record object containing name fields
 * @param {string} record.firstName - The first name
 * @param {string} record.lastName - The last name
 * @returns {string} The formatted full name
 *
 * @example
 * const name = formatName({ firstName: 'Juan', lastName: 'Dela Cruz' });
 * // Returns: 'Juan Dela Cruz'
 */
export const formatName = (record) => `${record.firstName} ${record.lastName}`;

/**
 * Formats a numeric points value to 2 decimal places
 *
 * @param {number} points - The points value to format
 * @returns {string} The formatted points value with 2 decimal places
 *
 * @example
 * const formatted = formatPoints(123.456);
 * // Returns: '123.46'
 *
 * @example
 * const formatted = formatPoints(100);
 * // Returns: '100.00'
 */
export const formatPoints = (points) => points.toFixed(2);
