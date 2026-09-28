/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        cream: {
          50:  '#FBF7F1',
          100: '#F6EFE3',
          200: '#EFE4D0',
        },
        ink: {
          900: '#1F1410',
          700: '#3A2A21',
          500: '#6B5446',
          400: '#8C7666',
        },
        maroon: {
          50:  '#F8ECEE',
          100: '#EAC9CE',
          400: '#A33645',
          500: '#8B2434',
          600: '#7B1F2C',
          700: '#5E1521',
          800: '#430F18',
        },
        gold: {
          50:  '#FBF3DD',
          100: '#F2E2B0',
          300: '#E0C271',
          400: '#D4B05F',
          500: '#C8A55B',
          600: '#A8873F',
          700: '#7E632B',
        },
        sage: { 500: '#6F7B5A' },
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', '"Playfair Display"', 'Georgia', 'serif'],
        display: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['"Inter"', '"Helvetica Neue"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        'card':       '0 1px 2px rgba(67,15,24,0.04), 0 8px 24px rgba(67,15,24,0.06)',
        'card-hover': '0 2px 4px rgba(67,15,24,0.06), 0 16px 40px rgba(67,15,24,0.10)',
        'inset-soft': 'inset 0 1px 0 rgba(255,255,255,0.6), inset 0 -1px 0 rgba(67,15,24,0.04)',
      },
      borderRadius: {
        'xl2': '1.25rem',
      },
      letterSpacing: {
        'wider2': '0.18em',
      }
    },
  },
  plugins: [],
}
