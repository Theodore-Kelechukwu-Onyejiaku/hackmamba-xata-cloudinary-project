/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "color-dark": "#01110A",
        "color-orange": "#BA2D0B",
        "color-green": "003E1F",
        "color-light-green": "#D5F2E3"
      },
    },
  },
  plugins: [],
}