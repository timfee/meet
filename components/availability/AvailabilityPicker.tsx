import { utcToZonedTime } from "date-fns-tz"
import dynamic from "next/dynamic"

import BookingForm from "../booking/BookingForm"
import DurationPicker from "./controls/DurationPicker"
import TimezonePicker from "./controls/TimezonePicker"
import { useProvider } from "@/context/AvailabilityContext"
import type { DateTimeInterval } from "@/lib/types"
import format from "date-fns-tz/format"

// Load these dynamically, without SSR, to avoid hydration issues
// that arise with timezone differences.
const Calendar = dynamic(() => import("./date/Calendar"), { ssr: false })
const TimeList = dynamic(() => import("./time/TimeList"), { ssr: false })

type AvailabilityPickerProps = {
  slots: DateTimeInterval[]
}
export default function AvailabilityPicker({ slots }: AvailabilityPickerProps) {
  const {
    state: { selectedDate, timeZone },
  } = useProvider()

  let maximumAvailability = 0
  const availabilityByDate = slots.reduce<Record<string, DateTimeInterval[]>>(
    (acc, slot) => {
      // Gives us the same YYYY-MM-DD format as Day.toString()
      const date = format(slot.start, "yyyy-MM-dd", { timeZone })

      console.log(slot.start, utcToZonedTime(slot.start, timeZone))
      if (!acc[date]) {
        acc[date] = []
      }
      acc[date].push(slot)

      if (acc[date].length > maximumAvailability) {
        maximumAvailability = acc[date].length
      }
      return acc
    },
    {}
  )
  console.log(availabilityByDate)
  const availability = selectedDate
    ? availabilityByDate[selectedDate.toString()]
    : []

  return (
    <div className="flex flex-col space-y-8">
      <div className="flex space-x-6">
        <DurationPicker />
        <TimezonePicker />
      </div>
      <BookingForm />
      <Calendar
        offers={availabilityByDate}
        maximumAvailability={maximumAvailability}
      />
      <TimeList availability={availability} />
    </div>
  )
}
