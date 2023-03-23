const LINE_PREFIX = `<div class="gmail_default" style="font-family:arial,sans-serif">`
const LINE_SUFFIX = `</div>`

export default function ApprovalEmail({
  email,
  name,
  location,
  dateSummary,
  approveUrl,
  timeZone,
}: {
  dateSummary: string
  email: string
  name: string
  location: string
  approveUrl: string
  timeZone: string
}) {
  const SUBJECT = `${name} wants to meet with you`

  const declineUrl = `mailto:${encodeURI(email)}?subject=${encodeURIComponent(
    `Re: Your meeting request`
  )}&body=${encodeURIComponent(
    `Hi there,

I just checked my calendar and it looks like ${dateSummary} won't work.

Would you be able to meet at a different time?`
  )}`

  let body = `<div dir="ltr">`
  body += [
    `<b>${name}</b> has requested a meeting on <b>${dateSummary}</b>, via <b>${location}</b>`,
    `<br>`,
    `Their local timezone is ${timeZone}`,
    `<br>`,
    `<br>`,
    `<b><a href=${approveUrl}>Accept the meeting</a></b>`,
    `<br>`,
    `<b><a href=${declineUrl}>Decline the meeting</a></b>`,
  ]
    .map((line) => `${LINE_PREFIX}${line}${LINE_SUFFIX}`)
    .join("")

  body += `</div>`

  return { subject: SUBJECT, body }
}
