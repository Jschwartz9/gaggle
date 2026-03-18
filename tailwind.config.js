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
        primary: '#FF6A2A', // Orange primary color
        accent: '#1C2B4A', // Navy accent color
        deep: '#1C2B4A', // Navy for deep/dark elements
        background: '#FFFFFF', // Pure white like logo background
        text: '#1A1A1A', // Black text
        muted: '#6B7280', // Gray for secondary text
      },
      fontFamily: {
        // Display fonts for headings and branding (Recoleta alternative)
        'display': ['var(--font-playfair-display)', 'Georgia', 'Times New Roman', 'serif'],

        // Editorial fonts for headlines and important content (Editorial New alternative)
        'editorial': ['var(--font-spectral)', 'Georgia', 'Times New Roman', 'serif'],

        // Body fonts for text and UI elements (Ginto alternative)
        'body': ['var(--font-inter)', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],

        // Default sans-serif (same as body for consistency)
        'sans': ['var(--font-inter)', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
      },
      fontSize: {
        // Custom display sizes
        'display-xl': ['4.5rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'display-lg': ['3.75rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'display-md': ['3rem', { lineHeight: '1.2', letterSpacing: '-0.01em' }],
        'display-sm': ['2.25rem', { lineHeight: '1.2', letterSpacing: '-0.01em' }],

        // Custom editorial sizes
        'editorial-xl': ['2.5rem', { lineHeight: '1.2', letterSpacing: '-0.01em' }],
        'editorial-lg': ['2rem', { lineHeight: '1.25', letterSpacing: '-0.005em' }],
        'editorial-md': ['1.5rem', { lineHeight: '1.3', letterSpacing: '0em' }],
      },
      letterSpacing: {
        'tighter': '-0.02em',
        'tight': '-0.01em',
        'normal': '0em',
        'wide': '0.01em',
        'wider': '0.02em',
      },
    },
  },
  plugins: [],
}