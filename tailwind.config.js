/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        'garamond': ['EB Garamond', 'serif'],
      },
      colors: {
        'dark-green': '#1a3b1a',
        'darker-green': '#0f2b0f',
        'gold': '#d4af37',
      },
      animation: {
        'pulse': 'pulse 1.5s infinite',
        'fade-in-up': 'fade-in-up 0.3s ease-out forwards',
        'fade-out': 'fade-out 0.5s ease-out forwards',
      },
      keyframes: {
        'fade-in-up': {
          'from': { opacity: '0', transform: 'translateY(20px)' },
          'to': { opacity: '1', transform: 'translateY(0)' }
        },
        'fade-out': {
          'from': { opacity: '1' },
          'to': { opacity: '0' }
        }
      },
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  plugins: [],
}