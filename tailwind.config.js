const plugin = require("tailwindcss/plugin")

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        accent: {
          50: "#f3b8b4",
          100: "#eeb5b4",
          200: "#eba7a3",
          300: "#e48a86",
          400: "#db675c",
          500: "#ce4336",
          600: "#a53331",
          700: "#882525",
          800: "#732123",
          900: "#661e23",
        },
      },
      fontFamily: {
        sans: "var(--font-public-sans), sans-serif",
      },
    },
  },
  plugins: [
    require("@tailwindcss/forms"),
    plugin(({ addVariant }) => {
      addVariant("hocus", ["&:hover", "&:focus"])
    }),
  ],
}
