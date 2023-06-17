import { add, areIntervalsOverlapping, sub } from "date-fns"

import type { DateTimeInterval } from "../../types"
import getAvailability from "../getAvailability"

describe("getAvailability", () => {
  it("returns empty array if potential or busy is undefined", () => {
    expect(getAvailability({})).toStrictEqual([])
    expect(
      getAvailability({ potential: undefined, busy: undefined })
    ).toStrictEqual([])
    expect(getAvailability({ potential: [], busy: undefined })).toStrictEqual(
      []
    )
    expect(getAvailability({ potential: undefined, busy: [] })).toStrictEqual(
      []
    )
  })

  //getAvailability() uses now() to compare against potential slots
  //so we need to make sure that the potential slots are in the future
  
  const nextYear = new Date().getFullYear() + 1

  it("returns available slots correctly", () => {
    const potential: DateTimeInterval[] = [
      {
        start: new Date(`${nextYear}-10-28T08:00:00.000Z`),
        end: new Date(`${nextYear}-10-28T09:00:00.000Z`),
      },
      {
        start: new Date(`${nextYear}-10-28T10:00:00.000Z`),
        end: new Date(`${nextYear}-10-28T11:00:00.000Z`),
      },
      {
        start: new Date(`${nextYear}-10-28T12:00:00.000Z`),
        end: new Date(`${nextYear}-10-28T13:00:00.000Z`),
      },
    ]

    const busy: DateTimeInterval[] = [
      {
        start: new Date(`${nextYear}-10-28T08:30:00.000Z`),
        end: new Date(`${nextYear}-10-28T09:30:00.000Z`),
      },
      {
        start: new Date(`${nextYear}-10-28T11:30:00.000Z`),
        end: new Date(`${nextYear}-10-28T12:30:00.000Z`),
      },
    ]

    const availableSlots = getAvailability({ potential, busy })

    expect(availableSlots).toHaveLength(1)
    expect(availableSlots[0]).toStrictEqual({
      start: new Date(`${nextYear}-10-28T10:00:00.000Z`),
      end: new Date(`${nextYear}-10-28T11:00:00.000Z`),
    })
  })

  it("respects padding when determining availability", () => {
    const potential: DateTimeInterval[] = [
      {
        start: new Date(`${nextYear}-10-28T08:00:00.000Z`),
        end: new Date(`${nextYear}-10-28T09:00:00.000Z`),
      },
    ]

    const busy: DateTimeInterval[] = [
      {
        start: new Date(`${nextYear}-10-28T09:00:00.000Z`),
        end: new Date(`${nextYear}-10-28T10:00:00.000Z`),
      },
    ]

    const availableSlotsWithNoPadding = getAvailability({
      potential,
      busy,
      padding: 0,
    })

    expect(availableSlotsWithNoPadding).toHaveLength(1)

    const availableSlotsWithSomePadding = getAvailability({
      potential,
      busy,
      padding: 30,
    })

    expect(availableSlotsWithSomePadding).toHaveLength(0)
  })

  it("respects lead time when determining availability", () => {
    const now = new Date()

    const potential: DateTimeInterval[] = [
      {
        start: add(now, { minutes: 1 }),
        end:   add(now, { hours: 1, minutes: 1 }),
      },
    ]

    const busy: DateTimeInterval[] = []

    const slotsWithLeadTimeConflict = getAvailability({
      potential,
      busy,
      leadTime: 0
    })
    expect(slotsWithLeadTimeConflict.length).toBe(1)

    const availableSlotsWithSomePadding = getAvailability({
      potential,
      busy,
      leadTime: 15,
    })

    expect(availableSlotsWithSomePadding).toHaveLength(0)
  })
})
