/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#5701ff',
        secondary: '#025464',
        background: '#f3f5f8',
      },
    },
  },
  plugins: [],
}
