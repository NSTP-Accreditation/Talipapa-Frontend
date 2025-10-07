/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx,html}'],
  // Ensure these responsive grid classes are always included
  safelist: ['md:grid-cols-2', 'md:grid-cols-3', 'lg:grid-cols-3'],
  theme: {
    extend: {
      colors: {
        // Custom colors from variables.css
        'barangay-green': {
          50: '#f1f8f4',
          100: '#e8f5e9',
          200: '#c8e6c9',
          300: '#a5d6a7',
          400: '#256d3f',
          500: '#1b4c2e',
          600: '#1b4c2e',
          700: '#1b4c2e',
          800: '#143722',
        },
      },
    },
  },
  plugins: [],
};
