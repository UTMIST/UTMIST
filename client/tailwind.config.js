/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}", // include all page files
    "./components/**/*.{js,ts,jsx,tsx}", // include all components
    "./app/**/*.{js,ts,jsx,tsx}", // if you're using the app directory
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gray1: '#a1a1a1',      // Light grey (nav text default)
        gray2: '#a6a6a6',      // Slightly lighter grey
        gray3: '#d9d9d9',      // Very light grey (borders)
        gray4: '#5c5c5c',      // Medium dark grey
        secondary: '#1e19b1',  // Blue (nav hover)
      },
    },
  },
  plugins: [],
};
