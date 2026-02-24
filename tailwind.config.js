/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        zenith: {
          white: '#FAFAFA',
          black: '#0A0A0A',
          crimson: '#DC2626',
        },
        primary: {
          blue: '#1e3a8a',
          yellow: '#f59e0b',
          orange: '#dc2626',
          black: '#111827',
          gray: {
            50: '#f9fafb',
            100: '#f3f4f6',
            200: '#e5e7eb',
            300: '#d1d5db',
            400: '#9ca3af',
            500: '#6b7280',
            600: '#4b5563',
            700: '#374151',
            800: '#1f2937',
            900: '#111827'
          }
        }
      },
      fontFamily: {
        'sans': ['"Exo 2"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        'display': ['Syne', 'Oswald', 'Impact', 'system-ui', 'sans-serif'],
        'body': ['"Exo 2"', 'ui-sans-serif', 'system-ui', 'sans-serif']
      },
      lineHeight: {
        'tight-impact': '0.85',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.6s ease-out',
        'bounce-slow': 'bounce 2s infinite'
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        slideUp: {
          '0%': { transform: 'translateY(30px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        }
      }
    },
  },
  plugins: [],
}
