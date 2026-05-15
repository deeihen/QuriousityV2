/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#4a7c59",
        background: "#faf6f0",
        surface: "#faf6f0",
        secondary: "#6b6358",
        tertiary: "#705c30",
        error: "#b83230",
        "on-primary": "#ffffff",
        "on-background": "#2e3230",
        "surface-variant": "#e4e0d8",
        "on-surface-variant": "#4a4e4a",
        "primary-container": "#78a886",
        "surface-container-lowest": "#ffffff",
        "surface-container": "#f0ece4",
        "inverse-primary": "#8ecf9e",
      },
      fontFamily: {
        heading: ["Literata", "serif"],
        body: ["Nunito Sans", "sans-serif"],
      },
      spacing: {
        'margin-desktop': '40px',
        'margin-mobile': '16px',
        'gutter': '24px',
      },
      maxWidth: {
        'container-max': '1200px',
      }
    },
  },
  plugins: [],
}
