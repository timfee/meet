import type { AvailabilitySlotsMap } from "./lib/types"

export const ALLOWED_DURATIONS = [15, 30, 60, 90, 120, 150]

export const DEFAULT_DURATION = 60

export const CALENDARS_TO_CHECK = ["primary"]
export const SLOT_PADDING = 0
export const OWNER_TIMEZONE = "America/Los_Angeles"
export const LEAD_TIME = 15

const DEFAULT_WORKDAY = [
  {
    start: {
      hour: 10,
    },
    end: {
      hour: 23,
    },
  },
]

export const OWNER_AVAILABILITY: AvailabilitySlotsMap = {
  1: DEFAULT_WORKDAY,
  2: DEFAULT_WORKDAY,
  3: DEFAULT_WORKDAY,
  4: DEFAULT_WORKDAY,
  5: DEFAULT_WORKDAY,
}

export const LOCAL_DATE_OPTIONS: Intl.DateTimeFormatOptions = {
  day: "numeric",
  month: "long",
  year: "numeric",
  weekday: "long",
}

export const LOCAL_TIME_OPTIONS: Intl.DateTimeFormatOptions = {
  hour: "numeric",
  minute: "numeric",
}
