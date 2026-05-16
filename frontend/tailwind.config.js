/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'dark-bg': '#0B0F19',
        'dark-card': '#111827',
        'neon-cyan': '#00F5FF',
        'neon-purple': '#8B5CF6',
      },
      boxShadow: {
        'neon-cyan': '0 0 10px #00F5FF, 0 0 20px #00F5FF',
        'neon-purple': '0 0 15px #8B5CF6',
      }
    },
  },
  plugins: [],
}