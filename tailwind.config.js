/** @type {import('tailwindcss').Config} */
const colors = require('tailwindcss/colors');

module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    colors: {
      primary: colors.red,
      secondary: colors.stone,
      transparent: colors.transparent,
    },
    extend: {
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}

