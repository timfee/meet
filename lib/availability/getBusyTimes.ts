import { compareAsc } from "date-fns"

import { CALENDARS_TO_CHECK, OWNER_TIMEZONE } from "../../config"
import type { DateTimeInterval } from "../types"
import getAccessToken from "./getAccessToken"

export default async function getBusyTimes({ start, end }: DateTimeInterval) {
  const response = await fetch(
    "https://www.googleapis.com/calendar/v3/freeBusy",
    {
      cache: "no-cache",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${await getAccessToken()}`,
      },
      body: JSON.stringify({
        timeMin: start.toISOString(),
        timeMax: end.toISOString(),
        timeZone: OWNER_TIMEZONE,
        items: CALENDARS_TO_CHECK.map((id) => ({ id })),
      }),
    }
  )

  const busyData = (await response.json()) as Record<string, unknown>

  return Object.values(busyData.calendars ?? {})
    .flatMap((calendar) => calendar.busy ?? [])
    .sort(compareAsc)
    .map((busy) => ({
      start: new Date(busy.start ?? ""),
      end: new Date(busy.end ?? ""),
    }))
}
