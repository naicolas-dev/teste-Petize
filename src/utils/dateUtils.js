/**
 * formatRelativeDate - Formats an ISO date string into a localized "time ago" string.
 * Accurate transitions: minutes (if < 60m), hours (if < 24h), days (if 24h-7d), weeks (if 7d-30d), etc.
 *
 * @param {string|Date} dateValue - The date to format
 * @param {Function} t - The i18next translation function
 * @returns {string} - Formatted relative date
 */
export function formatRelativeDate(dateValue, t) {
  if (!dateValue) return '';

  const date = new Date(dateValue);
  if (isNaN(date.getTime())) return '';

  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  
  // Basic units in ms
  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;
  const week = 7 * day;
  const month = 30 * day;
  const year = 365 * day;

  // Very recent (less than 1 minute)
  if (diffInMs < minute) {
    return t('repo.updatedJustNow');
  }

  // Less than 60 minutes
  if (diffInMs < hour) {
    const minutes = Math.floor(diffInMs / minute);
    return t('repo.updatedMinutesAgo', { count: minutes });
  }

  // Less than 24 hours
  if (diffInMs < day) {
    const hours = Math.floor(diffInMs / hour);
    return t('repo.updatedHoursAgo', { count: hours });
  }

  // From 24 hours to 7 days
  if (diffInMs < week) {
    const days = Math.floor(diffInMs / day);
    return t('repo.updatedDaysAgo', { count: days });
  }

  // From 7 days to 30 days
  if (diffInMs < month) {
    const weeks = Math.floor(diffInMs / week);
    return t('repo.updatedWeeksAgo', { count: weeks });
  }

  // From 30 days to 365 days
  if (diffInMs < year) {
    const months = Math.floor(diffInMs / month);
    return t('repo.updatedMonthsAgo', { count: months });
  }

  // More than 1 year
  const years = Math.floor(diffInMs / year);
  return t('repo.updatedYearsAgo', { count: years });
}
