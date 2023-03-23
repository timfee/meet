import type { AppProps } from "next/app"
import { Public_Sans } from "next/font/google"
import Head from "next/head"

import "../styles/global.css"

const public_sans = Public_Sans({
  subsets: ["latin"],
  display: "swap",
})

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Meet with {process.env.OWNER_NAME ?? "me"}</title>
      </Head>
      <style jsx global>{`
        html {
          font-family: ${public_sans.style.fontFamily};
        }
      `}</style>

      <Component {...pageProps} />
    </>
  )
}
