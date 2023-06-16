import { format } from 'date-fns-tz'

/**
 * Returns a string representation of the Date object
 * in 'YYYY-MM-DD' format, respecting the user's timezone.
 *
 * @returns {string} The formatted date string.
 */
export default function localeDayString(date: Date): string {
  const dateOptions: Intl.DateTimeFormatOptions = { 
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone 
  };
  const dateString: string = format( date, 'yyyy-MM-dd', { timeZone: dateOptions.timeZone } )
  return dateString
}
