# Security Policy

Please get in touch and open an issue if there’s something awry.

You need to be **VERY** careful with your OAuth and Refresh Token values. Don't commit them to Github directly, or send them to anyone. This allows programmatic access to read and write email and calendar events.

Because we're using nodemailer to send emails using XOAUTH2, we need the entire Gmail scope. In a future version, I’ll work to reduce the privileges needed.

I’ve made sure that the `.gitignore` file in my repo ignores `.env.local` but always give a double check to your commits to make sure you don’t accidentally commit your secrets.

**If you accidentally share these secrets, you should:**

1. **Immediately revoke token access.** Visit https://myaccount.google.com/permissions and look for the name of your app. then click "Remove Access"

2. **Generate a new Web Client Secret.** Go to https://console.cloud.google.com/apis/credentials and click click the pencil icon next to your Web Client. On the next screen, click "Add Secret" to add a new secret. Then trash the old one. 
