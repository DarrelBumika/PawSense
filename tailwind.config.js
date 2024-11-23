/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./templates/*.html"],
  theme: {
    extend: {
      colors: {
        primary: '#FFAA00',
        secondary: '#FFF1A6',
        third: '#124C5F',
        background: '#FFF2B3',
        footer: '#F9F9F9',
        gray: '#6B7280',
        pink: '#FF6E9F',
        purple: '#D9A6FF',
        lightGray: '#F9F9F9'
      }
    },
    fontFamily: {
      sans: ['Poppins', 'sans-serif'],
    }
  },
  plugins: [],
}