import { rawTimeZones } from "@vvo/tzdb"

export type TimeZoneData = {
  /**
   * A map of display strings to time zone data. The key is a formatted string
   * that represents the time zone offset and alternative name (e.g.,
   * "(GMT+02:00) Central European Time"), and the value is an object containing
   * the IANA time zone name (e.g., "Europe/Berlin") and an array of associated
   * group names.
   */
  timeZoneMap: Map<string, { value: string; group: string[] }>
  /**
   * A map of group names to IANA time zone names. The key is the group name
   * (e.g., "US/Central"), and the value is the corresponding IANA time zone
   * name (e.g., "America/Chicago").
   */
  groupLookupMap: Map<string, string>
}
/**
 * Generates a manageable amount of of display strings (<200) in
 * {@link timeZoneMap}, as well as a {@link groupLookupMap} so we can
 * process any timezone to its corresponding value in the UI.
 */
function getTimezoneData(): TimeZoneData {
  const timeZoneMap = new Map<string, { value: string; group: string[] }>()
  const groupLookupMap = new Map<string, string>()

  // Iterate through the rawTimeZones array
  for (const { rawFormat, name, group } of rawTimeZones) {
    // Add the display string to timeZoneMap if it doesn't exist
    if (!timeZoneMap.has(rawFormat)) {
      timeZoneMap.set(rawFormat, {
        value: name,
        group,
      })
    }

    // Add the time zone name to groupLookupMap for each group in rawTimeZone.group
    for (const tz of group) {
      if (!groupLookupMap.has(tz)) {
        groupLookupMap.set(tz, name)
      }
    }
  }

  return { timeZoneMap, groupLookupMap }
}

export default getTimezoneData
