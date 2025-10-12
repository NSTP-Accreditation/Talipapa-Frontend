/**
 * Format currency values
 * @param {number} amount - The amount to format
 * @param {string} currency - Currency code (default: 'PHP')
 * @param {string} locale - Locale for formatting (default: 'en-PH')
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (amount, currency = 'PHP', locale = 'en-PH') => {
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
 * @param {string} currencyString - Currency string to parse
 * @returns {number} Parsed number or 0 if invalid
 */
export const parseCurrency = (currencyString) => {
  if (typeof currencyString !== 'string') {
    return 0;
  }

  const cleanString = currencyString.replace(/[₱,\s]/g, '');
  const parsed = parseFloat(cleanString);

  return isNaN(parsed) ? 0 : parsed;
};
