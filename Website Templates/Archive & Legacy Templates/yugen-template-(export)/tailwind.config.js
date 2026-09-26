/**
 * ============================================================================
 * TAILWIND DESIGN SYSTEM CONFIGURATION (YŪGEN BRAND TOKENS)
 * ============================================================================
 * This file serves as the documentation and design token map for the luxury
 * theme system of Aura & Grid. Under Tailwind CSS v4, these configurations
 * map dynamically to global custom CSS variables.
 */

module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        yugen: {
          bg: "#050505",          // Core luxurious obsidian canvas
          gold: "#C5A880",        // Bespoke metallic champagne gold
          charcoal: "#0F0F0F",    // Volcanic deep warm slate charcoal
          border: "rgba(255, 255, 255, 0.05)", // Ultra-subtle divider tone
        }
      },
      fontFamily: {
        displaySerif: ["Cormorant Garamond", "serif"],
        geometricUi: ["Plus Jakarta Sans", "sans-serif"]
      },
      transitionTimingFunction: {
        editorial: "cubic-bezier(0.16, 1, 0.3, 1)" // High-end editorial curve
      }
    }
  }
};
