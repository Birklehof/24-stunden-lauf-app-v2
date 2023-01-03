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
    fontFamily: {
      sans: ["var(--montserrat-font)", ...fontFamily.sans],
    },
  },
  plugins: [require("daisyui")],
};
