/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        surface: '#0f0f0f',
        panel: '#1a1a1a',
        border: '#2a2a2a',
        accent: '#e8e0d0',
      },
    },
  },
  plugins: [],
}
