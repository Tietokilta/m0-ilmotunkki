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
      dynamic: {
        100: `var(--color-dynamic-100,${colors.emerald["100"]})`,
        200: `var(--color-dynamic-200,${colors.emerald["200"]})`,
        300: `var(--color-dynamic-300,${colors.emerald["300"]})`,
        400: `var(--color-dynamic-400,${colors.emerald["400"]})`,
        500: `var(--color-dynamic-500,${colors.emerald["500"]})`,
        600: `var(--color-dynamic-600,${colors.emerald["600"]})`,
        700: `var(--color-dynamic-700,${colors.emerald["700"]})`,
        800: `var(--color-dynamic-800,${colors.emerald["800"]})`,
        900: `var(--color-dynamic-900,${colors.emerald["900"]})`,
      },
      primary: colors.red,
      secondary: colors.neutral,
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

