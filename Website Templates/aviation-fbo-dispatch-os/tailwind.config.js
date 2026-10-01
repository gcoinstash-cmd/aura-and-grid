/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        obsidian: '#0A0C12',
        'ramp-blue': '#3B82F6',
        'fuel-amber': '#F59E0B',
        'status-green': '#22C55E',
        'alert-red': '#EF4444',
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Courier New', 'monospace'],
      },
    },
  },
  plugins: [],
}
