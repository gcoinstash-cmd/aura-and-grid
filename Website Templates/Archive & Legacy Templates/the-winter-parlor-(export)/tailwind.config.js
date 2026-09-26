/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Deep, immersive, warm-toned obsidian and velvety charcoal
        obsidian: {
          950: '#080807', // Velvety dark canvas base
          900: '#111110', // Deep secondary container background
          800: '#1B1B1A', // Rich dark borders / secondary structures
          700: '#272725', // Highlight borders and line separations
        },
        // Luxe, warm alabaster linen and rich cream accents
        cream: {
          50: '#FAF8F5',  // Stark warm chalk
          100: '#FAF5EA', // Linen/Oatmeal backdrop
          200: '#F2ECD9', // Alabaster/Parchment highlight surface
          300: '#E5DDC8', // Muted cream border or tactile split
        },
        // Editorial, low-vibrancy muted grey tones (strictly avoiding any bright colors)
        stone: {
          light: '#BCB9B1', // High contrast secondary text
          muted: '#8A8780', // Understated captions, subtitles, and labels
          dark: '#585651',  // Muted lines or dark structural contrast
        }
      },
      fontFamily: {
        // Highly elegant serif fonts for headings and title displays
        serif: [
          'Cormorant Garamond',
          'Playfair Display',
          'Didot',
          'Georgia',
          'serif'
        ],
        // Crisp, ultra-clean, geometric sans-serif for micro-heads and high-legibility body
        sans: [
          'Inter',
          'Plus Jakarta Sans',
          'Cabinet Grotesk',
          '-apple-system',
          'BlinkMacSystemFont',
          'system-ui',
          'sans-serif'
        ],
        // Monospace for structured booking metadata, tables, tracking, and editorial credits
        mono: [
          'JetBrains Mono',
          'Courier New',
          'monospace'
        ]
      },
      letterSpacing: {
        // Extreme wide tracking for micro-headers and editorial navigation
        tightest: '-0.04em',
        tighter: '-0.02em',
        normal: '0',
        wide: '0.08em',
        wider: '0.15em',
        widest: '0.25em',
        editorial: '0.36em', // Dramatic spacing for premium branding
      },
      spacing: {
        // Additional modular spaces to enable airy, breathing layouts and negative space
        '18': '4.5rem',
        '22': '5.5rem',
        '26': '6.5rem',
        '30': '7.5rem',
        '34': '8.5rem',
        '38': '9.5rem',
        '46': '11.5rem',
        '58': '14.5rem',
        '70': '17.5rem',
        '90': '22.5rem',
      },
      borderWidth: {
        DEFAULT: '1px',
        '0.5': '0.5px', // Ultra-fine, hairline borders reminiscent of print layouts
      },
      // Clean, flat aesthetics: Zero-out soft modern dropshadows and rounded elements
      borderRadius: {
        none: '0',
        DEFAULT: '0',
        sm: '0',
        md: '0',
        lg: '0',
        xl: '0',
        '2xl': '0',
        '3xl': '0',
        full: '9999px', // Standard circles preserved only for pure geometry (geometric indicators)
      },
      boxShadow: {
        none: 'none',
        sm: 'none',
        DEFAULT: 'none',
        md: 'none',
        lg: 'none',
        xl: 'none',
        '2xl': 'none',
        inner: 'none',
      }
    },
  },
  plugins: [],
};
