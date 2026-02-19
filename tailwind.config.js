/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Custom colors if needed, though user asked for "unique color theme"
        // We can define a primary purple/dark theme here
        primary: {
          DEFAULT: '#8b5cf6', // Violet 500
          foreground: '#ffffff',
        },
        background: '#09090b', // Zinc 950
        surface: '#18181b', // Zinc 900
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
