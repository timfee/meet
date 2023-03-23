import { add, areIntervalsOverlapping, sub } from "date-fns"

import type { DateTimeInterval } from "../types"
import { SLOT_PADDING } from "../../config"

/**
 * Takes an array of potential slots and an array of busy slots and returns
 * an array of available slots.
 *
 * @param {Object} obj - An object containing potential slots,
 *  busy slots, and padding.
 *
 * @param {DateTimeInterval[]} obj.potential - Potential slots.
 * @param {DateTimeInterval[]} obj.busy - Busy slots.
 * @param {number} [obj.padding] - Padding to apply to busy slots.
 *
 * @returns {DateTimeInterval[]} An array of available slots.
 */
export default function getAvailability({
  potential: potentialParam,
  busy,
  padding = SLOT_PADDING,
}: {
  potential?: DateTimeInterval[]
  busy?: DateTimeInterval[]
  padding?: number
}): DateTimeInterval[] {
  // Our final array of available slots
  const openSlots: DateTimeInterval[] = []

  if (potentialParam === undefined || busy === undefined) {
    return []
  }
  const now = new Date()
  const potential = potentialParam.filter((slot) => {
    return slot.start > now
  })

  // Make a deep copy of the potential array
  const remainingSlots = [...potential]

  for (let i = 0; i < potential.length; i++) {
    const freeSlot = potential[i]

    // Check if the free slot overlaps with any busy slot
    let isFree = true
    for (let j = 0; j < busy.length; j++) {
      const busySlot = busy[j]
      const busyStart = sub(busySlot.start, { minutes: padding })
      const busyEnd = add(busySlot.end, { minutes: padding })
      if (
        areIntervalsOverlapping(freeSlot, { start: busyStart, end: busyEnd })
      ) {
        isFree = false
        break
      }
    }

    // If the free slot is not booked, add it to the result
    if (isFree) {
      openSlots.push(freeSlot)
    }

    // Remove the free slot from the remainingSlots array
    const index = remainingSlots.indexOf(freeSlot)
    if (index !== -1) {
      remainingSlots.splice(index, 1)
    }
  }

  return openSlots
}
