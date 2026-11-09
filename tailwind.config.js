/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        edenCanvas: '#F8F6F0',       // Primary Canvas / Ivory Marble
        edenText: '#0F2E1E',         // Primary Brand Text / Deep Forest Green
        edenGold: {
          DEFAULT: '#C59B27',        // Luxury Accent Gold / Warm Metallic Gold
          hover: '#DFB847',          // Gold Hover Highlight / Antique Gold
          dark: '#9A771C',
          light: '#E5C467',
        },
        edenObsidian: '#0A1C13',     // Dark Theme / Footer Containers / Obsidian Evergreen
        edenLeaf: '#4B6E4A',         // Botanical Accent / Leaf Green
      },
      fontFamily: {
        cinzel: ['"Cinzel"', 'serif'],
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        'glow-gold': '0 0 25px rgba(197, 155, 39, 0.35)',
        'glow-gold-lg': '0 0 45px rgba(197, 155, 39, 0.45)',
        'marble-card': '0 10px 30px -5px rgba(15, 46, 30, 0.08), 0 0 1px 1px rgba(197, 155, 39, 0.15)',
        'obsidian-card': '0 15px 35px -5px rgba(0, 0, 0, 0.5), 0 0 20px rgba(197, 155, 39, 0.2)',
      },
      animation: {
        'float-slow': 'float 6s ease-in-out infinite',
        'pulse-subtle': 'pulseGlow 4s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '0.8' },
        }
      }
    },
  },
  plugins: [],
}
