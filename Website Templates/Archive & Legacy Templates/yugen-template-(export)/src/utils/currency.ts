/**
 * DEVELOPER CONFIGURATION HOOK // GLOBAL CURRENCY & LOCALE MATRIX
 * 
 * To modify the currency or locale throughout the entire application,
 * simply adjust the parameters below. 
 * 
 * Changing these variables will automatically repaint all numeric formatting,
 * currency symbols, and grouping structures in under 30 seconds.
 * 
 * E.g., for Japan (Japanese Yen): locale = 'ja-JP', currency = 'JPY'
 * E.g., for Europe (Euro):       locale = 'fr-FR', currency = 'EUR'
 * E.g., for UK (British Pound):  locale = 'en-GB', currency = 'GBP'
 */
export const CURRENCY_CONFIG = {
  locale: 'en-US',
  currency: 'USD',
};

/**
 * Centered formatting engine using standard ECMA Internationalization API.
 */
const currencyFormatter = new Intl.NumberFormat(CURRENCY_CONFIG.locale, {
  style: 'currency',
  currency: CURRENCY_CONFIG.currency,
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

/**
 * Formats a numeric amount into a styled locale-authentic currency string.
 * @param amount The numeric price value
 * @param options Styling directives (e.g., forcing a leading "+" sign)
 */
export function formatCurrency(
  amount: number,
  options: { includeSign?: boolean } = {}
): string {
  const formatted = currencyFormatter.format(Math.abs(amount));
  if (options.includeSign) {
    return `${amount >= 0 ? '+' : '-'}${formatted}`;
  }
  return formatted;
}
