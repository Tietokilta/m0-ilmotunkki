/** @type {import('tailwindcss').Config} */
import colors from "tailwindcss/colors";


const configuration = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class", // class/media
  theme: {
    colors: {
      primary: {
        50: "#5c533b",
        100: '#e6c46a',
        200: '#F7D57B',
        300: '#5c533b',
        400: '#00FF00',
        500: '#e6c46a',
        600: '#f7d57b',
        700: '#7b0b06',
        750: '#ae3e39',
        800: '#0088FF',
        900: '#7b0b06',
      },
      secondary: {
        50: "#F7D57B",
        100: '#FFFF88',
        200: '#FFFF00',
        300: '#5c533b',
        400: '#FF00FF',
        500: '#88FFFF',
        600: '#00FFFF',
        700: '#5c533b',
        800: '#290200',
        900: '#f7d57b',
      },
      transparent: colors.transparent,
      success: colors.green,
      danger: colors.red,
    },
    extend: {
      fontFamily: {
        raleway: ["Raleway", "sans-serif"],
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};

export default configuration;
