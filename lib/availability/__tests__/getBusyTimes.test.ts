import type { DateTimeInterval } from "../../types"
import getAccessToken from "../getAccessToken"
import getBusyTimes from "../getBusyTimes"

jest.mock("../getAccessToken")

const originalFetch = global.fetch

describe("getBusyTimes", () => {
  beforeEach(() => {
    jest.spyOn(global, "fetch").mockImplementation()
  })

  afterEach(() => {
    global.fetch = originalFetch
  })

  it("returns busy times correctly", async () => {
    const start = new Date("2023-04-01T00:00:00.000Z")
    const end = new Date("2023-04-01T23:59:59.999Z")

    const dateTimeInterval: DateTimeInterval = {
      start,
      end,
    }

    const accessToken = "test_access_token"
    ;(
      getAccessToken as jest.MockedFunction<typeof getAccessToken>
    ).mockResolvedValueOnce(accessToken)

    const mockBusyData = {
      calendars: {
        "calendar1@example.com": {
          busy: [
            {
              start: "2023-04-01T10:00:00.000Z",
              end: "2023-04-01T11:00:00.000Z",
            },
          ],
        },
        "calendar2@example.com": {
          busy: [
            {
              start: "2023-04-01T12:00:00.000Z",
              end: "2023-04-01T13:00:00.000Z",
            },
          ],
        },
      },
    }

    const mockResponse = new Response(JSON.stringify(mockBusyData), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    })

    ;(fetch as jest.MockedFunction<typeof fetch>).mockResolvedValueOnce(
      mockResponse
    )

    const busyTimes = await getBusyTimes(dateTimeInterval)

    expect(busyTimes).toHaveLength(2)
    expect(busyTimes[0]).toStrictEqual({
      start: new Date("2023-04-01T10:00:00.000Z"),
      end: new Date("2023-04-01T11:00:00.000Z"),
    })
    expect(busyTimes[1]).toStrictEqual({
      start: new Date("2023-04-01T12:00:00.000Z"),
      end: new Date("2023-04-01T13:00:00.000Z"),
    })
  })
})
