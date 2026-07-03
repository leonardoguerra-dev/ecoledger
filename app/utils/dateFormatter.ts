/**
 * Formats an ISO date string into a user-friendly relative string (Today, Yesterday)
 * or a localized short date format (e.g., "Jun 30").
 * @param dateString - The ISO date string to format (e.g., "2026-07-02")
 * @returns A formatted friendly string
 */
export const formatTransactionDate = (dateString: string): string => {
  const today = new Date();
  const targetDate = new Date(dateString);
  
  // Reset hours, minutes, seconds to accurately compare days only
  const todayDateOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const targetDateOnly = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate());
  
  const diffTime = todayDateOnly.getTime() - targetDateOnly.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  
  return targetDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};