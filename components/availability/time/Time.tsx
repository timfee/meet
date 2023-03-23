import clsx from "clsx"
import type { DetailedHTMLProps, HTMLAttributes } from "react"

import { useProvider } from "@/context/AvailabilityContext"
import { formatLocalTime } from "@/lib/availability/helpers"
import type { DateTimeInterval } from "@/lib/types"

type TimeProps = {
  time: DateTimeInterval
} & DetailedHTMLProps<HTMLAttributes<HTMLButtonElement>, HTMLButtonElement>

export default function Time({ time: { start, end }, ...props }: TimeProps) {
  const {
    state: { timeZone },
    dispatch,
  } = useProvider()
  return (
    <button
      type="button"
      className={clsx(
        "rounded-md border-slate-300 border bg-white py-2 px-3 shadow-sm transition-all",
        "text-sm font-semibold text-gray-900",
        "hocus:bg-accent-50/20 hocus:shadow-sm hocus:shadow-accent-100 hocus:-mt-0.5 hocus:mb-0.5 hocus:border-accent-500",
        "active:mt-0.5 active:-mb-0.5  outline-accent-600"
      )}
      onClick={() => {
        dispatch({
          type: "SET_SELECTED_TIME",
          payload: { start, end },
        })
      }}
      {...props}>
      {formatLocalTime(start, { timeZone })} –{" "}
      {formatLocalTime(end, { timeZone })}
    </button>
  )
}
