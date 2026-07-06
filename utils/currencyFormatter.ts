/**
 * Standard Enterprise currency formatter.
 * Uses a deterministic regular expression to safely split thousands 
 * avoiding SSR/Hydration locale mismatches between Node.js and the browser.
 */
export const euroFormatter = {
  format: (value: number): string => {
    const isNegative = value < 0;
    // Force absolute value and convert to string for thousand grouping
    const stringValue = Math.floor(Math.abs(value))
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, "."); // Pure regex for dot separation
    
    return `${isNegative ? '-' : ''}€ ${stringValue}`;
  }
};