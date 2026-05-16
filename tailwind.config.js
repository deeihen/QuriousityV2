/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "var(--primary)",
        background: "var(--background)",
        surface: "var(--surface)",
        secondary: "var(--secondary)",
        tertiary: "var(--tertiary)",
        error: "var(--error)",
        "on-primary": "var(--on-primary)",
        "on-background": "var(--on-background)",
        "surface-variant": "var(--surface-variant)",
        "on-surface-variant": "var(--on-surface-variant)",
        "primary-container": "var(--primary-container)",
        "surface-container-lowest": "var(--surface-container-lowest)",
        "surface-container": "var(--surface-container)",
        "inverse-primary": "var(--inverse-primary)",
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
