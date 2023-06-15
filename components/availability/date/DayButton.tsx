import clsx from "clsx"
import type { ButtonHTMLAttributes, DetailedHTMLProps } from "react"
import { twMerge } from "tailwind-merge"

import { useProvider } from "@/context/AvailabilityContext"
import Day from "@/lib/day"

type DayProps = {
  date: Day
  availabilityScore: number
  hasAvailability: boolean
} & DetailedHTMLProps<
  ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>

export default function DayButton({
  date,
  availabilityScore,
  hasAvailability,
  ...props
}: DayProps): JSX.Element {
  const {
    state: { start, end, selectedDate },
    dispatch,
  } = useProvider()

  const now = Day.todayWithOffset(0)

  // Facts about the current date used to apply formatting/logic later.

  const isToday = date.toString() === now.toString()

  const isSelected = selectedDate
    ? date.toString() === selectedDate.toString()
    : false

  const isDisabled = !hasAvailability

  return (
    <button
      type="button"
      className={twMerge(
        clsx(
          "p-4 transition-all flex flex-col items-center outline-secondary-600 relative",
          props.className,
          {
            "font-semibold bg-slate-300 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hocus:border-secondary-500 hocus:shadow-sm hocus:shadow-secondary-100 hocus:-mt-0.5 hocus:z-10 hocus:mb-0.5 border border-transparent":
              !isDisabled,
            "bg-white dark:bg-slate-200 text-gray-500 dark:text-gray-500": isDisabled,
            // "bg-secondary-500": isSelected && !isToday,
            // "bg-secondary-600 dark:bg-secondary-600 hover:bg-secondary-500": isSelected && isToday,
            "text-white dark:text-gray-100 bg-secondary-500 dark:bg-secondary-600": isSelected,
          }
        )
      )}
      disabled={isDisabled}
      aria-pressed={isSelected}
      aria-disabled={isDisabled}
      aria-label={`${isToday ? "Today" : ""} ${
        isDisabled ? "Unavailable" : "Available"
      } date ${date.toString()} in calendar`}
      onClick={() => {
        dispatch({
          type: "SET_SELECTED_DATE",
          payload: date,
        })
      }}
      {...props}>
      <div className="flex flex-col items-center justify-between leading-none">
        <p
          className={clsx(
            "font-semibold text-[0.55rem] leading-0 h-3 items-center flex",
            {
              "text-white": isSelected,
              "text-gray-500 dark:text-gray-500": isDisabled && !isSelected,
              "text-secondary-700 dark:text-secondary-600": !isSelected,
            }
          )}>
          {isToday && "TODAY"}
        </p>
        <time className="text-base flex leading-0 items-center">
          {date.getDay()}
        </time>
        <figure
          className="flex items-center space-x-0.5 h-3 justify-center"
          aria-hidden="true">
          {Array.from({ length: isDisabled ? 0 : availabilityScore }).map(
            (_, index) => (
              <div
                key={`availability-bar-${index}`}
                className={clsx("rounded-full w-1 h-1", {
                  "bg-white": isSelected,
                  "bg-green-600": !isSelected,
                })}
              />
            )
          )}
        </figure>
      </div>
    </button>
  )
}
