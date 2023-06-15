import { addDays, eachDayOfInterval, endOfWeek, startOfWeek } from "date-fns"

import DayButton from "./DayButton"
import { useProvider } from "@/context/AvailabilityContext"
import { getDateRangeInterval } from "@/lib/availability/helpers"
import Day from "@/lib/day"
import type { DateTimeInterval } from "@/lib/types"

export default function Calendar({
  offers,
  maximumAvailability,
}: {
  offers: Record<string, DateTimeInterval[]>
  maximumAvailability: number
}) {
  const weekdays = ["Su", "M", "Tu", "W", "Th", "F", "Sa"]
  const {
    state: { start, end, timeZone },
  } = useProvider()

  const { start: startDate, end: endDate } = getDateRangeInterval({
    start,
    end,
  })

  // Handles when the date changes due to the selected timezone
  const now = Day.todayWithOffset(0)

  const days = eachDayOfInterval({
    start: startOfWeek(startDate),
    // add two extra days in case we end on a weekend to avoid
    // an incomplete row.
    end: endOfWeek(addDays(endDate, 2)),
  }).map((day) => Day.dayFromDate(day))

  // Remove cases where the first week is empty.
  // (Usually timezone changing related)
  const firstWeek = days.at(6)
  if (
    firstWeek &&
    firstWeek.toInterval(timeZone).start < now.toInterval(timeZone).start
  ) {
    days.splice(0, 7)
  }

  // Remove cases where the last week is empty.
  const lastWeek = days.at(-7)
  if (lastWeek && lastWeek.toInterval(timeZone).end >= endDate) {
    days.splice(-7, 7)
  }

  return (
    <div
      className="isolate mt-6 grid grid-cols-7 text-xs leading-6 text-gray-500"
      role="grid"
      aria-label="Calendar">
      {weekdays.map((weekday) => (
        <div
          key={weekday}
          className="justify-center text-slate-500 flex"
          role="columnheader"
          aria-label={weekday}>
          {weekday.charAt(0)}
        </div>
      ))}
      {days.map((day) => {
        const availabilityTest = offers[day.toString()] ?? []
        return (
          <DayButton
            key={day.toString()}
            date={day}
            availabilityScore={availabilityScore({
              openSlots: offers[day.toString()]?.length ?? 0,
              maximumAvailability,
            })}
            hasAvailability={availabilityTest.length > 0}
          />
        )
      })}
    </div>
  )
}

function availabilityScore({
  openSlots,
  maximumAvailability,
}: {
  openSlots: number
  maximumAvailability: number
}) {
  return openSlots === 0
    ? 0
    : openSlots / maximumAvailability <= 1 / 3
    ? 1
    : openSlots / maximumAvailability <= 2 / 3
    ? 2
    : 3
}
