import mergeOverlappingIntervals from "../mergeOverlappingIntervals"
import type { DateTimeInterval } from "../../types"

describe("mergeOverlappingIntervals", () => {
  test("should handle an empty array", () => {
    const intervals: DateTimeInterval[] = []
    const result = mergeOverlappingIntervals(intervals)

    expect(result).toStrictEqual([])
  })

  test("should merge overlapping intervals correctly", () => {
    const intervals = [
      {
        start: new Date("2023-03-14T09:00:00"),
        end: new Date("2023-03-14T12:00:00"),
      },
      {
        start: new Date("2023-03-14T11:00:00"),
        end: new Date("2023-03-14T14:00:00"),
      },
      {
        start: new Date("2023-03-14T16:00:00"),
        end: new Date("2023-03-14T18:00:00"),
      },
    ]

    const result = mergeOverlappingIntervals(intervals)

    expect(result).toStrictEqual([
      {
        start: new Date("2023-03-14T09:00:00"),
        end: new Date("2023-03-14T14:00:00"),
      },
      {
        start: new Date("2023-03-14T16:00:00"),
        end: new Date("2023-03-14T18:00:00"),
      },
    ])
  })

  test("should not modify non-overlapping intervals", () => {
    const input = [
      {
        start: new Date("2023-03-14T09:00:00"),
        end: new Date("2023-03-14T10:00:00"),
      },
      {
        start: new Date("2023-03-14T11:00:00"),
        end: new Date("2023-03-14T12:00:00"),
      },
    ]
    const expected = input
    const result = mergeOverlappingIntervals(input)

    expect(result).toStrictEqual(expected)
  })

  test("should merge overlapping intervals", () => {
    const input = [
      {
        start: new Date("2023-03-14T09:00:00"),
        end: new Date("2023-03-14T11:00:00"),
      },
      {
        start: new Date("2023-03-14T10:00:00"),
        end: new Date("2023-03-14T12:00:00"),
      },
    ]
    const expected = [
      {
        start: new Date("2023-03-14T09:00:00"),
        end: new Date("2023-03-14T12:00:00"),
      },
    ]
    const result = mergeOverlappingIntervals(input)

    expect(result).toStrictEqual(expected)
  })

  test("should merge multiple overlapping intervals", () => {
    const input = [
      {
        start: new Date("2023-03-14T09:00:00"),
        end: new Date("2023-03-14T10:30:00"),
      },
      {
        start: new Date("2023-03-14T10:00:00"),
        end: new Date("2023-03-14T11:30:00"),
      },
      {
        start: new Date("2023-03-14T11:00:00"),
        end: new Date("2023-03-14T12:00:00"),
      },
    ]
    const expected = [
      {
        start: new Date("2023-03-14T09:00:00"),
        end: new Date("2023-03-14T12:00:00"),
      },
    ]
    const result = mergeOverlappingIntervals(input)

    expect(result).toStrictEqual(expected)
  })

  test("should handle a mix of overlapping and non-overlapping intervals", () => {
    const input = [
      {
        start: new Date("2023-03-14T09:00:00"),
        end: new Date("2023-03-14T10:30:00"),
      },
      {
        start: new Date("2023-03-14T10:00:00"),
        end: new Date("2023-03-14T11:30:00"),
      },
      {
        start: new Date("2023-03-14T12:00:00"),
        end: new Date("2023-03-14T13:00:00"),
      },
      {
        start: new Date("2023-03-14T14:00:00"),
        end: new Date("2023-03-14T15:00:00"),
      },
      {
        start: new Date("2023-03-14T14:30:00"),
        end: new Date("2023-03-14T16:00:00"),
      },
    ]
    const expected = [
      {
        start: new Date("2023-03-14T09:00:00"),
        end: new Date("2023-03-14T11:30:00"),
      },
      {
        start: new Date("2023-03-14T12:00:00"),
        end: new Date("2023-03-14T13:00:00"),
      },
      {
        start: new Date("2023-03-14T14:00:00"),
        end: new Date("2023-03-14T16:00:00"),
      },
    ]
    const result = mergeOverlappingIntervals(input)

    expect(result).toStrictEqual(expected)
  })
})
