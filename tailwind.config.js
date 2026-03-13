/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#FF6B35', // Orange from logo
        accent: '#FF8C5A', // Lighter orange
        deep: '#1A1A1A', // Black like logo text
        background: '#FFFFFF', // Pure white like logo background
        text: '#1A1A1A', // Black text
        muted: '#6B7280', // Gray for secondary text
      },
    },
  },
  plugins: [],
}