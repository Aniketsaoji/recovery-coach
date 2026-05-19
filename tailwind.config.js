/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'bg-dark': '#060b14',
        'card-dark': '#0d1b2e',
        'border-blue': '#1e3a5f',
        'electric-blue': '#3b82f6',
        'cyan-accent': '#06b6d4',
        'pain-red': '#ef4444',
        'recovery-green': '#10b981',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bubble-in': 'bubble-in 0.25s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
        'slide-in-right': 'slide-in-right 0.4s ease-out forwards',
        'glow': 'glow 2s ease-in-out infinite',
      },
      keyframes: {
        'bubble-in': {
          'from': { transform: 'scale(0.85) translateY(8px)', opacity: '0' },
          'to': { transform: 'scale(1) translateY(0)', opacity: '1' },
        },
        'slide-in-right': {
          'from': { transform: 'translateX(100%)', opacity: '0' },
          'to': { transform: 'translateX(0)', opacity: '1' },
        },
        'glow': {
          '0%, 100%': { boxShadow: '0 0 8px rgba(59, 130, 246, 0.5)' },
          '50%': { boxShadow: '0 0 24px rgba(59, 130, 246, 0.9)' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}
