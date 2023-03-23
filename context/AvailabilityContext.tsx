import type { Dispatch, FC } from "react"
import { useReducer, useContext, createContext } from "react"

import { ALLOWED_DURATIONS, DEFAULT_DURATION } from "@/config"
import Day from "@/lib/day"
import type { DateTimeInterval } from "@/lib/types"
import type { PageProps } from "@/pages"

type ModalStatus = "open" | "busy" | "error" | "closed"

export type StateType = {
  /** The earliest day we’ll offer appointments */
  start: Day
  /** The latest day we’ll offer appointments */
  end: Day
  /** The day the user selected (if made) */
  selectedDate?: Day
  /** The end user's timezone string */
  timeZone: string
  /** The number of minutes being requested,
   * must be one of the values in {@link ALLOWED_DURATIONS}
   */
  duration: number
  /** Whether the booking modal is open or busy. */
  modal: ModalStatus
  /** The time slot the user selected (if made). */
  selectedTime?: DateTimeInterval
}

export type ActionType =
  | {
      type: "SET_SELECTED_DATE"
      /** Change the selected date. */
      payload: Day
    }
  | {
      type: "SET_TIMEZONE"
      /** Change the timezone. */
      payload: string
    }
  | {
      type: "SET_DURATION"
      /** Change the duration */
      payload: number
    }
  | {
      type: "SET_MODAL"
      /** Set modal status */
      payload: ModalStatus
    }
  | {
      type: "SET_SELECTED_TIME"
      /** Set the selected time interval. */
      payload: DateTimeInterval
    }

const StateSetContext = createContext<Dispatch<ActionType> | undefined>(
  undefined
)
const StateContext = createContext<StateType>({
  duration: ALLOWED_DURATIONS[0],
  start: Day.todayWithOffset(0),
  end: Day.todayWithOffset(14),
  timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  modal: "closed",
})

/**
 * The provider component that wraps the application, providing state and actions.
 *
 * @param {Omit<PageProps, "busy">} props.values - The initial state values.
 * @param {React.ReactNode} props.children - The children components.
 *
 * @returns {JSX.Element} The provider-wrapped application.
 */
export function Provider({
  children,
  values,
}: {
  children: React.ReactNode
  values: Omit<PageProps, "busy">
}): JSX.Element {
  // Get the initial state from the values passed in.
  const initialProps: StateType = getInitialState(values)

  // Create the reducer function.
  const [state, action] = useReducer(reducerFunction, initialProps)

  return (
    <StateContext.Provider value={state}>
      <StateSetContext.Provider value={action}>
        {children}
      </StateSetContext.Provider>
    </StateContext.Provider>
  )
}

/**
 * A higher-order component that wraps a component with the provider.
 * @param {FC<T>} Component - The component to wrap with the provider.
 * @returns {FC<T>} The wrapped component.
 */
export function withProvider<T extends PageProps>(Component: FC<T>): FC<T> {
  return function ProviderContainer(props: T) {
    // Hoist the props that are used in the provider to the top level.
    const providerValues = {
      start: props.start,
      end: props.end,
      selectedDate: props.selectedDate,
      timeZone: props.timeZone,
      duration: props.duration,
    }

    return (
      <Provider values={{ ...providerValues }}>
        <Component {...props} />
      </Provider>
    )
  }
}

/**
 * Return the initial state from the values passed in, applying sensible
 * defaults for values that are missing.
 *
 * @param {Omit<PageProps, "busy">} values The initial values to use.
 * @return {StateType} An object that can be used for the initial state.
 */
function getInitialState(values: Omit<PageProps, "busy">): StateType {
  const timeZone =
    values.timeZone ?? Intl.DateTimeFormat().resolvedOptions().timeZone ?? "UTC"

  return {
    timeZone,
    start: Day.dayFromString(values.start),
    end: Day.dayFromString(values.end),
    selectedDate: values.selectedDate
      ? Day.dayFromString(values.selectedDate)
      : undefined,
    duration:
      values.duration && !Number.isNaN(values.duration)
        ? values.duration
        : DEFAULT_DURATION,
    modal: "closed",
  }
}

/**
 * Returns the state and dispatch from the Provider context.
 *
 * @returns {{state: StateType, dispatch: Dispatch<ActionType>}} - The return
 */
export function useProvider(): {
  state: StateType
  dispatch: Dispatch<ActionType>
} {
  const state = useContext(StateContext)
  const dispatch = useContext(StateSetContext)

  if (!state || !dispatch) {
    throw new Error("Provider not found")
  }

  return { state, dispatch }
}

/**
 * A reducer function that handles state updates.
 * @param {StateType} state - The current state.
 * @param {ActionType} action - The action to apply.
 * @returns {StateType} The updated state.
 */
function reducerFunction(state: StateType, action: ActionType): StateType {
  let newState
  switch (action.type) {
    case "SET_SELECTED_DATE": {
      newState = { ...state, selectedDate: action.payload }
      break
    }
    case "SET_TIMEZONE": {
      newState = { ...state, timeZone: action.payload }
      break
    }
    case "SET_DURATION": {
      newState = { ...state, duration: action.payload }
      break
    }
    case "SET_MODAL": {
      newState = { ...state, modal: action.payload }
      break
    }
    case "SET_SELECTED_TIME": {
      newState = { ...state, selectedTime: action.payload }
      // If we're setting a selected time, assume we want to
      // open the modal to let the user confirm it.
      newState.modal = "open"
      break
    }
    default: {
      newState = state
    }
  }

  // Update the URL with the new state of duration,
  // timeZone and selectedDate (if set).
  const newUrl = new URLSearchParams({
    duration: newState.duration.toString(),
    timeZone: newState.timeZone,
    ...(newState.selectedDate && {
      selectedDate: newState.selectedDate.toString(),
    }),
  })

  // Push to the window.
  window.history.replaceState(null, "", `/?${newUrl.toString()}`)

  return newState
}
