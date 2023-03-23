import { zonedTimeToUtc } from "date-fns-tz"

/**
 * Represents a day with year, month, and day components.
 */
export default class Day {
  public constructor(
    private readonly year: number,
    private readonly month: number,
    private readonly day: number
  ) {
    Day.validateYearMonthDay(year, month, day)
  }

  /**
   * Validates the passed year, month, and day can be
   * used to construct an actual date.
   *
   * @private
   * @static
   * @param {number} year The year.
   * @param {number} month The month.
   * @param {number} day The day.
   *
   * @throws {Error} If the year, month, or day is invalid.
   */
  public static validateYearMonthDay(
    year: number,
    month: number,
    day: number
  ): void {
    if (month === undefined) {
      throw new Error("Missing month")
    }
    if (day === undefined) {
      throw new Error("Missing day")
    }

    if (month < 1 || month > 12) {
      throw new Error(`Invalid month ${month}`)
    }

    const daysInMonth = new Date(year, month, 0).getDate()
    if (day < 1 || day > daysInMonth) {
      throw new Error(`Invalid day ${day} for month ${month}`)
    }
  }

  /**
   * Returns a Day instance representing today, optionally offset by the
   * provided number of days.
   *
   * @static
   * @param {number} [days=0] The number of days to offset today by.
   * @return {Day} A new Day instance.
   */
  public static todayWithOffset(days = 0): Day {
    const today = new Date()
    if (days) {
      today.setDate(today.getDate() + days)
    }

    return new Day(today.getFullYear(), today.getMonth() + 1, today.getDate())
  }

  /**
   * Returns a Day instance from a YYYY-MM-DD input string.
   *
   * @static
   * @param {string} input The date string
   * @return {Day} A new day instance.
   *
   * @throws {TypeError} If the input string is not in the expected format.
   */
  public static dayFromString(input: string): Day {
    const [year, month, day] = input.split("-").map(Number)

    if (Number.isNaN(year) || Number.isNaN(month) || Number.isNaN(day)) {
      throw new TypeError(`Invalid date string: ${input}`)
    }

    Day.validateYearMonthDay(year, month, day)

    return new Day(year, month, day)
  }

  /**
   * Returns a Day instance from a Date object.
   *
   * @param {Date} input The date
   * @returns {Day} A new day instance.
   *
   * @throws {TypeError} If the input is not a Date object.
   */
  public static dayFromDate(input: Date): Day {
    const year = input.getUTCFullYear()
    const month = input.getUTCMonth() + 1
    const day = input.getUTCDate()

    return new Day(year, month, day)
  }

  /**
   * Returns a string representation of the Day instance
   * in 'YYYY-MM-DD' format.
   *
   * @returns {string} The formatted date string.
   */
  public toString(): string {
    const year = this.year.toString().padStart(4, "0")
    const month = this.month.toString().padStart(2, "0")
    const day = this.day.toString().padStart(2, "0")

    return `${year}-${month}-${day}`
  }

  /**
   * Returns a Date object representing the Day instance.
   *
   * @return {{ start: Date; end: Date }}
   * @memberof Day
   */
  public toInterval(timeZone?: string): {
    start: Date
    end: Date
  } {
    const start = new Date(this.year, this.month - 1, this.day, 0, 0, 0, 0)
    const end = new Date(this.year, this.month - 1, this.day, 23, 59, 59, 999)

    return {
      start: timeZone ? zonedTimeToUtc(start, timeZone) : new Date(start),
      end: timeZone ? zonedTimeToUtc(end, timeZone) : new Date(end),
    }
  }

  /**
   * Returns the day.
   *
   * @return {number} The day.
   */
  public getDay(): number {
    return this.day
  }
}
