/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['DM Sans', 'sans-serif'],
        display: ['Manrope', 'sans-serif'],
      },
      colors: {
        deep: '#082f36',
        teal: '#0e7772',
        mint: '#dff5eb',
        sun: '#f5bd54',
        ink: '#183538',
        mist: '#f5f8f6',
      },
      boxShadow: {
        soft: '0 18px 55px rgba(8, 47, 54, 0.10)',
      },
    },
  },
  plugins: [],
}
