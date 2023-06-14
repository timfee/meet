/**
 * Returns a string representation of the Date object
 * in 'YYYY-MM-DD' format, respecting the user's timezone.
 *
 * @returns {string} The formatted date string.
 */
export default function localeDayString(date: Date): string {
  const dateOptions: Intl.DateTimeFormatOptions = { 
    year: 'numeric', 
    month: '2-digit', 
    day: '2-digit', 
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone 
  };
  const dateString: string = date.toLocaleString('en-ca', dateOptions).replace(/\//g, '-');
  return dateString
}
