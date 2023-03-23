import { compareAsc, max, areIntervalsOverlapping } from "date-fns"

import type { DateTimeInterval } from "../types"

/**
 * Sort the intervals by start time, then iterate through the intervals
 * and merge any overlapping intervals.
 *
 * @param {DateTimeInterval[]} intervals - An array of DateTimeInterval objects
 * @returns An array of DateTimeIntervals
 */
export default function mergeOverlappingIntervals(
  intervals: DateTimeInterval[]
): DateTimeInterval[] {
  if (intervals.length === 0) {
    return []
  }

  // Sort the intervals by start time
  intervals.sort((a, b) => compareAsc(a.start, b.start))

  const mergedSlots: DateTimeInterval[] = []
  let currentInterval = intervals[0]

  for (const nextInterval of intervals.slice(1)) {
    if (areIntervalsOverlapping(currentInterval, nextInterval)) {
      // If intervals overlap, update the end time of the current interval
      currentInterval.end = max([currentInterval.end, nextInterval.end])
    } else {
      // If the intervals do not overlap, add the current interval to the
      // mergedSlots array and advance the current interval.
      mergedSlots.push(currentInterval)
      currentInterval = nextInterval
    }
  }

  // Add the last currentSlot to the mergedSlots array
  mergedSlots.push(currentInterval)

  return mergedSlots
}
