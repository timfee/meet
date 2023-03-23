import type { SendMailOptions, Transporter } from "nodemailer"
import { createTransport } from "nodemailer"

type SendMailParams = {
  to: string
  subject: string
  body: string
}

/**
 * Configure the mail transporter using OAuth2 authentication.
 * @returns {Transporter} The configured mail transporter object.
 */
function configureTransporter(): Transporter {
  return createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      type: "OAuth2",
      clientId: process.env.GOOGLE_OAUTH_CLIENT_ID,
      clientSecret: process.env.GOOGLE_OAUTH_SECRET,
    },
  })
}

/**
 * Sends an email using the nodemailer package with OAuth2 authentication.
 *
 * @param {SendMailParams} options An object containing the recipient's
 * email address, email subject, and email body.
 *
 * @returns {Promise<void>} A promise that resolves when the
 * email is sent successfully.
 */
async function sendMail({ to, subject, body }: SendMailParams): Promise<void> {
  const transporter = configureTransporter()

  await transporter.sendMail({
    from: {
      address: process.env.OWNER_EMAIL,
      name: process.env.OWNER_NAME,
    },
    to,
    subject,
    html: body,
    auth: {
      user: process.env.OWNER_EMAIL,
      refreshToken: process.env.GOOGLE_OAUTH_REFRESH,
    },
  } as SendMailOptions & { auth: { user: string; refreshToken: string; accessToken?: string } })
}

export default sendMail
