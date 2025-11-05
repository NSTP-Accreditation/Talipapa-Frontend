/**
 * Format currency values
 * @param amount - The amount to format
 * @param currency - Currency code (default: 'PHP')
 * @param locale - Locale for formatting (default: 'en-PH')
 * @returns Formatted currency string
 */
export const formatCurrency = (
  amount: number,
  currency: string = 'PHP',
  locale: string = 'en-PH'
): string => {
  if (typeof amount !== 'number' || isNaN(amount)) {
    return '₱0.00';
  }

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(amount);
};

/**
 * Parse currency string to number
 * @param currencyString - Currency string to parse
 * @returns Parsed number or 0 if invalid
 */
export const parseCurrency = (currencyString: string): number => {
  if (typeof currencyString !== 'string') {
    return 0;
  }

  const cleanString = currencyString.replace(/[₱,\s]/g, '');
  const parsed = parseFloat(cleanString);

  return isNaN(parsed) ? 0 : parsed;
};
