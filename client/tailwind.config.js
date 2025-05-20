/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./pages/**/*.{js,ts,jsx,tsx}", // include all page files
      "./components/**/*.{js,ts,jsx,tsx}", // include all components
      "./app/**/*.{js,ts,jsx,tsx}", // if you're using the app directory
    ],
    theme: {
      extend: {
        // Your custom colors, spacing, fonts, etc.
      },
    },
    plugins: [],
  };
  