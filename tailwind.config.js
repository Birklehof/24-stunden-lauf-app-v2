/** @type {import('tailwindcss').Config} */
const { fontFamily } = require("tailwindcss/defaultTheme");

module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  daisyui: {
    themes: [
      {
        mytheme: {
          primary: "#004e47",
          secondary: "#e4f1de",
          accent: "#d9e5ec",
          neutral: "#ffffff",
          "base-100": "#FFFFFF",
          success: "#B7C82C",
        },
      },
    ],
  },
  theme: {
    extend: {
      keyframes: {
        grow: {
          "0%": { transform: "scale(0)", opacity: 0 },
          "5%": { transform: "scale(0.01)", opacity: 1 },
          "25%": { transform: "scale(1)", opacity: 1 },
          "95%": { transform: "scale(1)", opacity: 1 },
          "100%": { transform: "scale(1)", opacity: 0 },
        },
        showText: {
          "0%": { opacity: 0 },
          "20%": { opacity: 0 },
          "25%": { opacity: 1 },
          "100%": { opacity: 1 },
        },
      },
    },
    fontFamily: {
      sans: ["var(--montserrat-font)", ...fontFamily.sans],
    },
  },
  plugins: [require("daisyui")],
};
