/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx}", // include all page files
    "./src/components/**/*.{js,ts,jsx,tsx}", // include all components
    "./src/app/**/*.{js,ts,jsx,tsx}", // if you're using the app directory
  ],
  darkMode: 'class',
  theme: {
    extend: {
      // Your custom colors, spacing, fonts, etc.
    },
  },
  plugins: [],
};
