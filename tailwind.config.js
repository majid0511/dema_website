/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50:  '#d8f3dc',
          100: '#b7e4c7',
          200: '#74c69d',
          300: '#52b788',
          400: '#40916c',
          500: '#2d6a4f',
          600: '#1b4332',
          700: '#081c15',
        },
        gold: {
          100: '#fef3c7',
          400: '#d4a017',
          600: '#92400e',
        },
      },
      fontFamily: {
        arabic: ['Amiri', 'serif'],
        body: ['Plus Jakarta Sans', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
