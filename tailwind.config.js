const { fontFamily } = require('tailwindcss/defaultTheme');

module.exports = {
  darkMode: ['class', '[data-theme="dark"]'],
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      keyframes: {
        grow: {
          '0%': {
            transform: 'scale(0)',
            opacity: 0,
          },
          '5%': {
            transform: 'scale(0.1)',
            opacity: 1,
          },
          '25%': {
            transform: 'scale(1)',
            opacity: 1,
          },
          '95%': {
            transform: 'scale(1)',
            opacity: 1,
          },
          '100%': {
            transform: 'scale(1)',
            opacity: 0,
          },
        },
        showText: {
          '0%': { opacity: 0 },
          '20%': { opacity: 0 },
          '25%': { opacity: 1 },
          '100%': { opacity: 1 },
        },
        'fade-in': {
          '0%': { backgroundColor: '#A5C12A', transform: 'translateY(-100%)' },
          '100%': {
            backgroundColor: 'transparent',
            transform: 'translateY(0)',
          },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.5s ease-in-out forwards',
      },
      fontFamily: {
        sans: ['var(--montserrat-font)', ...fontFamily.sans],
      },
    },
  },
};
