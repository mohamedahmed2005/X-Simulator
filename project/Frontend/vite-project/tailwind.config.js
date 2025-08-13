/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'x-black': '#000000',
        'x-dark-gray': '#16181c',
        'x-border': '#2f3336',
        'x-text-gray': '#71767b',
        'x-blue': '#1d9bf0',
        'x-blue-hover': '#1a8cd8',
        'x-pink': '#f91880',
        'x-white': '#ffffff',
        'x-light-gray': '#181818',
        'x-hover-gray': '#d1d9dd',
      },
      fontFamily: {
        'x-system': ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', 'sans-serif'],
      },
      backdropBlur: {
        'xs': '2px',
      }
    },
  },
  plugins: [],
}
