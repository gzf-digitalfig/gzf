/**
 * Zakat Calculator Helper Functions
 */

/**
 * Sanitizes input value to a number
 * @param {string|number} value - The input value
 * @param {number} min - Minimum allowed value (default 0)
 * @param {number} max - Maximum allowed value (default Infinity)
 * @returns {number} - The sanitized number
 */
export const sanitizeNumber = (value, min = 0, max = Infinity) => {
    const num = parseFloat(value);
    if (isNaN(num) || num < min || num > max) return 0;
    return num;
};

/**
 * Formats a number as a currency string
 * @param {number} amount - The amount to format
 * @param {string} currency - The currency code (default GBP)
 * @returns {string} - Formatted currency string
 */
export const formatCurrency = (amount, currency = 'GBP') => {
    try {
        return new Intl.NumberFormat('en-GB', {
            style: 'currency',
            currency: currency,
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(amount);
    } catch (error) {
        // Fallback for invalid currencies
        return `${currency} ${amount.toFixed(2)}`;
    }
};

/**
 * Converts value to GBP
 * @param {number} amount - The amount in source currency
 * @param {string} currency - The source currency code
 * @param {object} exchangeRates - Map of exchange rates (Base GBP = 1)
 * @returns {number} - Amount in GBP
 */
export const convertToGBP = (amount, currency, exchangeRates) => {
    if (currency === 'GBP') return amount;
    const rate = exchangeRates[currency] || 1;
    return amount / rate;
};

/**
 * Converts GBP value to target currency
 * @param {number} amountGBP - The amount in GBP
 * @param {string} currency - The target currency code
 * @param {object} exchangeRates - Map of exchange rates (Base GBP = 1)
 * @returns {number} - Amount in target currency
 */
export const convertFromGBP = (amountGBP, currency, exchangeRates) => {
    if (currency === 'GBP') return amountGBP;
    const rate = exchangeRates[currency] || 1;
    return amountGBP * rate;
};


// Fallback Data
export const FALLBACK_CURRENCIES = [
    { code: 'GBP', name: 'British Pound' },
    { code: 'USD', name: 'US Dollar' },
    { code: 'EUR', name: 'Euro' },
    { code: 'CAD', name: 'Canadian Dollar' },
    { code: 'AUD', name: 'Australian Dollar' },
    { code: 'SAR', name: 'Saudi Riyal' },
    { code: 'AED', name: 'UAE Dirham' },
    { code: 'PKR', name: 'Pakistani Rupee' },
    { code: 'INR', name: 'Indian Rupee' },
    { code: 'BDT', name: 'Bangladeshi Taka' }
];

export const FALLBACK_RATES = {
    'GBP': 1,
    'USD': 1.27,
    'EUR': 1.17,
    'CAD': 1.78,
    'AUD': 1.98,
    'SAR': 4.76,
    'AED': 4.66,
    'PKR': 353,
    'INR': 107,
    'BDT': 156
};

// Gold Carat Multipliers
export const CARAT_MULTIPLIERS = {
    '24K': 1,
    '22K': 0.916,
    '21K': 0.875,
    '18K': 0.75,
    '14K': 0.583,
    '9K': 0.375
};
