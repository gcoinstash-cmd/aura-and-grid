/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        obsidian: '#08090C',
        atelier: '#C5A880',
        'atelier-dark': '#8B6F47',
      },
      fontFamily: {
        serif: ['Bodoni Moda', 'Georgia', 'serif'],
        sans: ['Space Grotesk', 'Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}
