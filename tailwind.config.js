/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class', // Forzar que solo use la clase 'dark' y no el modo oscuro del sistema
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
