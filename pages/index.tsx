import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next"
import { useEffect } from "react"
import { z } from "zod"

import Template from "@/components/Template"
import AvailabilityPicker from "@/components/availability/AvailabilityPicker"
import {
  ALLOWED_DURATIONS,
  DEFAULT_DURATION,
  OWNER_AVAILABILITY,
} from "@/config"
import { useProvider, withProvider } from "@/context/AvailabilityContext"
import getAvailability from "@/lib/availability/getAvailability"
import getBusyTimes from "@/lib/availability/getBusyTimes"
import getPotentialTimes from "@/lib/availability/getPotentialTimes"
import {
  getDateRangeInterval,
  mapDatesToStrings,
  mapStringsToDates,
} from "@/lib/availability/helpers"
import Day from "@/lib/day"

export type PageProps = InferGetServerSidePropsType<typeof getServerSideProps>

function Page({
  start,
  end,
  busy,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const {
    state: { duration, selectedDate },
    dispatch,
  } = useProvider()

  const startDay = Day.dayFromString(start)
  const endDay = Day.dayFromString(end)

  const potential = getPotentialTimes({
    start: startDay,
    end: endDay,
    duration,
    availabilitySlots: OWNER_AVAILABILITY,
  })

  const offers = getAvailability({
    busy: mapStringsToDates(busy),
    potential,
  })

  const slots = offers.filter((slot) => {
    return (
      slot.start >= startDay.toInterval("Etc/GMT").start &&
      slot.end <= endDay.toInterval("Etc/GMT").end
    )
  })

  // If we got this far and there's no selectedDate, set it to the first date
  // with some availability.
  useEffect(() => {
    if (!selectedDate && slots.length > 0) {
      dispatch({
        type: "SET_SELECTED_DATE",
        payload: Day.dayFromDate(slots[0].start),
      })
    }
    // Run once, on initial render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <main className="max-w-2xl sm:mx-auto mx-4 pb-24">
      <Template />
      <AvailabilityPicker slots={slots} />
    </main>
  )
}

export async function getServerSideProps({ query }: GetServerSidePropsContext) {
  const schema = z.object({
    duration: z
      .enum([...(ALLOWED_DURATIONS.map(String) as [string, ...string[]])])
      .optional()
      .default(String(DEFAULT_DURATION))
      .transform(Number),
    timeZone: z.string().optional(),
    selectedDate: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/u)
      .optional(),
  })

  const { duration, timeZone, selectedDate } = schema.parse(query)

  // Offer two weeks of availability.
  const start = Day.todayWithOffset(0)
  const end = Day.todayWithOffset(14)

  const busy = await getBusyTimes(
    getDateRangeInterval({
      start,
      end,
      timeZone,
    })
  )

  return {
    props: {
      start: start.toString(),
      end: end.toString(),
      busy: mapDatesToStrings(busy),
      duration,
      ...(timeZone && { timeZone }),
      ...(selectedDate && { selectedDate }),
    },
  }
}

export default withProvider(Page)
