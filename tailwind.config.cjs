/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx,html}',
  ],
  // Ensure these responsive grid classes are always included
  safelist: [
    'md:grid-cols-2',
    'md:grid-cols-3',
    'lg:grid-cols-3'
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
