/**
 * Interface for record objects with name fields
 */
export interface NameRecord {
  firstName: string;
  lastName: string;
  middleName?: string;
}

/**
 * Formats a record object into a full name string
 *
 * @param record - The record object containing name fields
 * @returns The formatted full name
 *
 * @example
 * const name = formatName({ firstName: 'Juan', lastName: 'Dela Cruz' });
 * // Returns: 'Juan Dela Cruz'
 */
export const formatName = (record: NameRecord): string =>
  `${record.firstName} ${record.lastName}`;

/**
 * Formats a numeric points value to 2 decimal places
 *
 * @param points - The points value to format
 * @returns The formatted points value with 2 decimal places
 *
 * @example
 * const formatted = formatPoints(123.456);
 * // Returns: '123.46'
 *
 * @example
 * const formatted = formatPoints(100);
 * // Returns: '100.00'
 */
export const formatPoints = (points: number): string => points.toFixed(2);
