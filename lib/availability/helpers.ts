import type Day from "../day"
import type { StringInterval, DateTimeInterval } from "../types"
import { LOCAL_DATE_OPTIONS, LOCAL_TIME_OPTIONS } from "@/config"

/**
 * Takes an array of {@link StringInterval} objects and converts them to
 * {@link DateTimeInterval} objects.
 *
 * @param {StringInterval[]} slots - StringInterval[]
 * @returns An array of {@link DateTimeInterval} objects.
 */
export function mapStringsToDates(slots: StringInterval[]): DateTimeInterval[] {
  return slots.map(({ start, end }) => ({
    start: new Date(start),
    end: new Date(end),
  }))
}

/**
 * Takes an array of {@link DateTimeInterval} objects and converts them to
 * {@link StringInterval} objects.
 *
 * @param {DateTimeInterval[]} slots - DateTimeInterval[]
 * @returns An array of {@link StringInterval} objects.
 */
export function mapDatesToStrings(slots: DateTimeInterval[]): StringInterval[] {
  return slots.map(({ start, end }) => ({
    start: start.toISOString(),
    end: end.toISOString(),
  }))
}

/**
 * Convinience function to apply common formatting to a date.
 * 
 * @param {Date | string} date - The date to format.
 * @param {DateTimeFormatOptions} [extraOptions] - Optional extra 
 * options to pass to the toLocaleDateString method.
 
 * @returns {string} A formatted string representation of the date.
 */
export function formatLocalDate(
  date: Date | string,
  extraOptions?: Intl.DateTimeFormatOptions
): string {
  const dateObject = typeof date === "string" ? new Date(date) : date
  return dateObject.toLocaleDateString([], {
    ...LOCAL_DATE_OPTIONS,
    ...extraOptions,
  })
}

/**
 * Convinience function to apply common formatting to a time.
 * 
 * @param {Date | string} date - The date to format.
 * @param {DateTimeFormatOptions} [extraOptions] - Optional extra 
 * options to pass to the toLocaleDateString method.
 
 * @returns {string} A formatted string representation of the time.
 */
export function formatLocalTime(
  date: Date | string,
  extraOptions?: Intl.DateTimeFormatOptions
): string {
  const dateObject = typeof date === "string" ? new Date(date) : date

  return dateObject.toLocaleTimeString([], {
    ...LOCAL_TIME_OPTIONS,
    ...extraOptions,
  })
}

/**
 * Given a start and end date, return the start and end
 * of the interval that contains them.
 *

 * @param {Day} input.start - The start date.
 * @param {Day} input.end - The end date.
 * @param {string} [input.timeZone] - The timezone to use.
 * 
 * @returns {DateTimeInterval} The start and end of the interval.
 */
export function getDateRangeInterval({
  start,
  end,
  timeZone,
}: {
  start: Day
  end: Day
  timeZone?: string
}): DateTimeInterval {
  return {
    start: start.toInterval(timeZone).start,
    end: end.toInterval(timeZone).end,
  }
}
