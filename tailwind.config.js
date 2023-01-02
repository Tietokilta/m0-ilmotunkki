/** @type {import('tailwindcss').Config} */
const colors = require('tailwindcss/colors');

module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // class/media
  theme: {
    colors: {
      primary: colors.emerald,
      secondary: colors.stone,
      transparent: colors.transparent,
      success: colors.green,
      danger: colors.red,
    },
    extend: {
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}

