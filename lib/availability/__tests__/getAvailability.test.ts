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

  it("returns available slots correctly", () => {
    const potential: DateTimeInterval[] = [
      {
        start: new Date("2023-04-01T08:00:00.000Z"),
        end: new Date("2023-04-01T09:00:00.000Z"),
      },
      {
        start: new Date("2023-04-01T10:00:00.000Z"),
        end: new Date("2023-04-01T11:00:00.000Z"),
      },
      {
        start: new Date("2023-04-01T12:00:00.000Z"),
        end: new Date("2023-04-01T13:00:00.000Z"),
      },
    ]

    const busy: DateTimeInterval[] = [
      {
        start: new Date("2023-04-01T08:30:00.000Z"),
        end: new Date("2023-04-01T09:30:00.000Z"),
      },
      {
        start: new Date("2023-04-01T11:30:00.000Z"),
        end: new Date("2023-04-01T12:30:00.000Z"),
      },
    ]

    const availableSlots = getAvailability({ potential, busy })

    expect(availableSlots).toHaveLength(1)
    expect(availableSlots[0]).toStrictEqual({
      start: new Date("2023-04-01T10:00:00.000Z"),
      end: new Date("2023-04-01T11:00:00.000Z"),
    })
  })

  it("respects padding when determining availability", () => {
    const potential: DateTimeInterval[] = [
      {
        start: new Date("2023-04-01T08:00:00.000Z"),
        end: new Date("2023-04-01T09:00:00.000Z"),
      },
    ]

    const busy: DateTimeInterval[] = [
      {
        start: new Date("2023-04-01T09:00:00.000Z"),
        end: new Date("2023-04-01T10:00:00.000Z"),
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
})
