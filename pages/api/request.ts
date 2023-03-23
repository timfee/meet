import LRUCache from "lru-cache"
import type { NextApiRequest, NextApiResponse } from "next"
import { z } from "zod"

import { OWNER_TIMEZONE } from "@/config"
import { formatLocalDate, formatLocalTime } from "@/lib/availability/helpers"
import sendMail from "@/lib/email"
import ApprovalEmail from "@/lib/email/messages/Approval"
import ConfirmationEmail from "@/lib/email/messages/Confirmation"
import getHash from "@/lib/hash"
import type { DateTimeIntervalWithTimezone } from "@/lib/types"

// Define the rate limiter
const rateLimitLRU = new LRUCache({
  max: 500,
  ttl: 60_000, // 60_000 milliseconds = 1 minute
})
const REQUESTS_PER_IP_PER_MINUTE_LIMIT = 5

// Define the schema for the request body
const AppointmentRequestSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  start: z.string().refine((value) => !Number.isNaN(Date.parse(value)), {
    message: "Start must be a valid date.",
  }),
  end: z.string().refine((value) => !Number.isNaN(Date.parse(value)), {
    message: "End must be a valid date.",
  }),
  timeZone: z.string(),
  location: z.enum(["meet", "phone"]),
  duration: z
    .string()
    .refine((value) => !Number.isNaN(Number.parseInt(value)), {
      message: "Duration must be a valid integer.",
    }),
})

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" })
    return
  }

  // Apply rate limiting using the client's IP address

  const limitReached = checkRateLimit()

  if (limitReached) {
    res.status(429).json({ error: "Rate limit exceeded" })
    return
  }

  // Validate and parse the request body using Zod
  const validationResult = AppointmentRequestSchema.safeParse(req.body)

  if (!validationResult.success) {
    res.status(400).json({ error: validationResult.error.message })
    return
  }
  const { data } = validationResult

  const start = new Date(data.start)
  const end = new Date(data.end)

  const approveUrl = `${
    req.headers.origin ?? "?"
  }/api/confirm/?data=${encodeURIComponent(JSON.stringify(data))}&key=${getHash(
    JSON.stringify(data)
  )}`

  // Generate and send the approval email
  const approveEmail = ApprovalEmail({
    ...data,
    approveUrl,
    dateSummary: intervalToHumanString({
      start,
      end,
      timeZone: OWNER_TIMEZONE,
    }),
  })
  await sendMail({
    to: process.env.OWNER_EMAIL ?? "",
    subject: approveEmail.subject,
    body: approveEmail.body,
  })

  // Generate and send the confirmation email
  const confirmationEmail = ConfirmationEmail({
    dateSummary: intervalToHumanString({
      start,
      end,
      timeZone: data.timeZone,
    }),
  })
  await sendMail({
    to: data.email,
    subject: confirmationEmail.subject,
    body: confirmationEmail.body,
  })

  res.status(200).json({ success: true })

  /**
   * Checks the rate limit for the current IP address.
   *
   * @return {boolean} Whether the rate limit has been reached.
   */
  function checkRateLimit(): boolean {
    const forwarded = req.headers["x-forwarded-for"]
    const ip =
      (Array.isArray(forwarded) ? forwarded[0] : forwarded) ??
      req.socket.remoteAddress ??
      "127.0.0.1"

    const tokenCount = (rateLimitLRU.get(ip) as number[]) || [0]
    if (tokenCount[0] === 0) {
      rateLimitLRU.set(ip, tokenCount)
    }
    tokenCount[0] += 1
    const currentUsage = tokenCount[0]
    return currentUsage >= REQUESTS_PER_IP_PER_MINUTE_LIMIT
  }
}

/**
 * Converts a date-time interval to a human-readable string.
 *
 * This function takes a date-time interval with start and end times,
 * and a time zone.
 *
 * It returns a formatted string representing the interval, including
 * the start and end times, and the time zone.
 *
 * @function
 * @param {Object} DateTimeIntervalWithTimezone An object containing the
 * start, end, and time zone of the interval.
 *
 * @param {string} interval.start The start time of the interval
 * as a string or Date object.
 *
 * @param {string} interval.end The end time of the interval as
 * a string or Date object.
 *
 * @param {string} interval.timeZone The time zone used to format
 * the date and time.
 *
 * @returns {string} A human-readable string representation
 * of the date-time interval.
 */
function intervalToHumanString({
  start,
  end,
  timeZone,
}: DateTimeIntervalWithTimezone): string {
  return `${formatLocalDate(start, {
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    weekday: "long",
    timeZone,
  })} – ${formatLocalTime(end, {
    hour: "numeric",
    minute: "numeric",
    timeZone,
    timeZoneName: "longGeneric",
  })}`
}
