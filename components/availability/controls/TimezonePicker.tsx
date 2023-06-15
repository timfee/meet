import { useProvider } from "@/context/AvailabilityContext"
import getTimezoneData from "@/lib/timezones"

const { groupLookupMap, timeZoneMap } = getTimezoneData()

export default function TimezonePicker() {
  const {
    state: { timeZone },
    dispatch,
  } = useProvider()

  // In the case we resolve to a timezone that isn’t the representative
  // timezone used in the dropdown box, "snap" the selected timezone to
  // the best candidate invisibly.
  const selectedTimeZoneValue = groupLookupMap.get(timeZone)

  return (
    <div className="flex-grow">
      <label
        htmlFor="location"
        className="block text-sm font-medium leading-0 text-gray-900 dark:text-gray-100">
        Timezone
      </label>

      <select
        value={selectedTimeZoneValue}
        id="location"
        name="location"
        className="mt-1 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 dark:text-gray-100 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-secondary-600 sm:text-sm sm:leading-6 overflow-x-clip"
        onChange={(e) => {
          dispatch({
            type: "SET_TIMEZONE",
            payload: e.currentTarget.value,
          })
        }}>
        {[...timeZoneMap].map(([display, { value }]) => (
          <option key={display} value={value}>
            {`GMT${display}`}
          </option>
        ))}
      </select>
    </div>
  )
}
