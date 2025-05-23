/**
 * Utilities for card operations and display
 */

/**
 * Get the display label for a condition value
 * @param {number|string} conditionValue - The condition value (6-10)
 * @returns {string} The formatted condition label
 */
export const getConditionLabel = (conditionValue) => {
  const value = typeof conditionValue === 'string' ? parseInt(conditionValue, 10) : conditionValue;
  
  switch (value) {
    case 10:
      return 'Gem Mint - 10';
    case 9:
      return 'Mint - 9';
    case 8:
      return 'NM - 8';
    case 7:
      return 'Lightly Played - 7';
    case 6:
      return 'Heavily Played - 6';
    default:
      return `Unknown (${conditionValue})`;
  }
};

/**
 * Get an array of all available condition options
 * @returns {Array} Array of condition option objects with value and label
 */
export const getConditionOptions = () => [
  { value: '10', label: 'Gem Mint - 10' },
  { value: '9', label: 'Mint - 9' },
  { value: '8', label: 'NM - 8' },
  { value: '7', label: 'Lightly Played - 7' },
  { value: '6', label: 'Heavily Played - 6' },
];

/**
 * Format price for display with rupee symbol
 * @param {number|string} price - The price value
 * @returns {string} Formatted price with currency symbol
 */
export const formatPrice = (price) => {
  if (price === null || price === undefined) return 'N/A';
  
  const numericPrice = typeof price === 'string' ? parseFloat(price) : price;
  return `₹${numericPrice.toFixed(2)}`;
}; 