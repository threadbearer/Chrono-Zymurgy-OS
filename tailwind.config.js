/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        zymo: {
          dark: '#080c14',
          card: '#0e1626',
          panel: '#131e33',
          border: '#1f2e4d',
          accent: '#06b6d4',      // Cyan bioluminescence
          amber: '#f59e0b',       // Malty gold
          copper: '#ea580c',      // Rich copper
          emerald: '#10b981',     // Living yeast
          yeast: '#fde047',       // Creamy yeast yellow
          purple: '#8b5cf6',      // Terpene aroma
          rose: '#f43f5e',        // Valve alert red
          muted: '#8192b0',
        }
      },
      fontFamily: {
        display: ['Space Grotesk', 'sans-serif'],
        sans: ['Plus Jakarta Sans', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      boxShadow: {
        'glow-cyan': '0 0 20px -3px rgba(6, 182, 212, 0.35)',
        'glow-amber': '0 0 20px -3px rgba(245, 158, 11, 0.35)',
        'glow-rose': '0 0 20px -3px rgba(244, 63, 94, 0.45)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bubble-float': 'float 4s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        }
      }
    },
  },
  plugins: [],
}
