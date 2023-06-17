import { addMinutes, eachDayOfInterval, set } from "date-fns"

import type Day from "../day"
import type { AvailabilitySlotsMap, DateTimeInterval } from "../types"
import mergeOverlappingIntervals from "./mergeOverlappingIntervals"

export default function getPotentialTimes({
  start,
  end,
  duration,
  availabilitySlots,
}: {
  start: Day
  end: Day
  duration: number
  availabilitySlots: AvailabilitySlotsMap
}): DateTimeInterval[] {
  const intervals: DateTimeInterval[] = []

  if (start >= end || duration <= 0) {
    return intervals
  }

  // Sort the slots by start time
  const days = eachDayOfInterval({
    start: start.toInterval("Etc/GMT").start,
    end: end.toInterval("Etc/GMT").end,
  })
  days.forEach((day) => {
    const dayOfWeek = day.getDay()

    const slotsForDay = availabilitySlots[dayOfWeek] ?? []

    for (const slot of slotsForDay) {
      const slotStart = set(day, {
        hours: slot.start.hour,
        minutes: slot.start.minute,
      })

      const slotEnd = set(day, {
        hours: slot.end.hour,
        minutes: slot.end.minute,
      })

      let currentIntervalStart = slotStart

      while (
        currentIntervalStart < slotEnd &&
        addMinutes(currentIntervalStart, duration) <= slotEnd
      ) {
        const currentIntervalEnd = addMinutes(currentIntervalStart, duration)

        intervals.push({
          start: currentIntervalStart,
          end: currentIntervalEnd,
        })

        currentIntervalStart = currentIntervalEnd
      }
    }
  })

  return mergeOverlappingIntervals(intervals)
}
