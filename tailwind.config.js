/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        wedding: {
          ivory: '#FDFBF7',
          champagne: '#F8F4EB',
          sand: '#EFE8DC',
          gold: {
            DEFAULT: '#D4AF37',
            light: '#F5E6BE',
            dark: '#AA820A'
          },
          saffron: {
            DEFAULT: '#E65100',
            light: '#FF9800',
            soft: '#FFF3E0'
          },
          maroon: {
            DEFAULT: '#7B1113',
            dark: '#540809',
            light: '#9E2A2B'
          },
          emerald: '#1B4931',
          slate: '#2C3E50',
          dark: '#1E1B18'
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        cormorant: ['"Cormorant Garamond"', 'serif']
      }
    },
  },
  plugins: [],
}
