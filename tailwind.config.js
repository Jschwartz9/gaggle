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
        primary: '#C8F135',
        accent: '#FF6B5B',
        deep: '#1A0A2E',
        background: '#F9F8F4',
        text: '#1A1A1A',
        muted: '#6B7280',
      },
    },
  },
  plugins: [],
}