/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./*.html', './build_pages.mjs'],
  theme: {
    container: {
      center: true,
      padding: '22px',
      screens: { DEFAULT: '1140px', '2xl': '1140px' },
    },
    extend: {
      colors: {
        green: {
          900: '#1f3d2b', 700: '#2f5d3f', 500: '#4a7c59', 300: '#8cb89a', 50: '#eef4ef',
        },
        sand: { DEFAULT: '#f6f1e7', dark: '#e7ddc9' },
        accent: { DEFAULT: '#c2703d', dark: '#a85a2c', soft: '#f0c9ac' },
        ink: { DEFAULT: '#232520', soft: '#4c4f47' },
      },
      fontFamily: {
        serif: ['"Iowan Old Style"', '"Palatino Linotype"', 'Palatino', 'Georgia', '"Times New Roman"', 'serif'],
        sans: ['-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'Helvetica', 'Arial', 'sans-serif'],
      },
      borderRadius: { DEFAULT: '14px', card: '14px' },
      boxShadow: {
        soft: '0 6px 24px rgba(31,61,43,.10)',
        lg: '0 14px 40px rgba(31,61,43,.16)',
      },
      maxWidth: { measure: '720px', prose2: '760px' },
    },
  },
  plugins: [],
}
