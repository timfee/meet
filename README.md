## Hello world! 👋

This is my first project. I’m Tim, currently an out-of-work Product Manager. Gotta love 2023. I’ve worked at companies like Google, Meta and Tripadvisor (as a PM), but have always enjoyed hobbyist coding.

For some weird reason, I’ve been interested in a personal self-scheduling solution (like Calendly, Cal.com), but one that's simple, free, and without branding or bloat.

**So, I made my own Calendly alternative, and wanted to share with the world and walk through it.**

![Walkthrough](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/oqdsguqjfg3ky4o8zjb0.gif)

The current solution is intentionally lightweight and opinionated, but hopefully flexible enough should you want to extend it.

* Requires **Google Calendar** and **Gmail** APIs _(sorry, no Outlook, iCloud; but parsing an ICS feed isn't hard to do!)_
* Supports **multiple calendars** for calculating availability.
* Only has **basic availability configuration** built in, e.g. you can specify working hours based on day of week only. 
* Currently optimized for meetings via **phone** or **Google Meet** _(vs. in-person or using resources)._

The workflow is simple enough, and we'll walk through it later, but basically:

1. A user requests an appointment.
2. The system emails you asking you to confirm or deny.
3. Once confirmed, it's emailed to the user and added to both of your calendars. 

As I mentioned, it's opinionated and designed for simple use cases for individuals in mind. 😁

Some technical notes:
* Uses Next.js 13 and Typescript with Tailwind.
* Has (some) testing on the more trickier functions.
* Uses minimal libraries. For instance, I built my own lightweight wrapper to hit Google APIs directly to avoid importing `googleapis`. 
* Probably has some over-engineered bits that feel nice, like `lru-cache` limiting on API endpoints, a more intuitive timezone selection piece, and formatted emails. 

I welcome feedback and suggestions; and have fun!

See related post at https://dev.to/timfee/build-and-host-your-own-calendy-like-scheduling-page-using-nextjs-and-google-apis-5ack
