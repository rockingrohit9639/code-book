/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#E57C23',
        secondary: '#025464',
        background: '#F8F1F1',
      },
    },
  },
  plugins: [],
}
