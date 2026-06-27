/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        green: {
          DEFAULT: 'rgb(var(--color-green) / <alpha-value>)',
          deep: 'rgb(var(--color-green-deep) / <alpha-value>)',
        },
        amber: 'rgb(var(--color-amber) / <alpha-value>)',
        seafoam: 'rgb(var(--color-seafoam) / <alpha-value>)',
        muted: 'rgb(var(--color-muted) / <alpha-value>)',
        white: 'rgb(var(--color-white) / <alpha-value>)',
        /* semantic aliases */
        forest: 'rgb(var(--color-forest) / <alpha-value>)',
        cream: 'rgb(var(--color-cream) / <alpha-value>)',
        accent: 'rgb(var(--color-accent) / <alpha-value>)',
        border: 'rgb(var(--color-border) / <alpha-value>)',
        ink: 'rgb(var(--color-ink) / <alpha-value>)',
      },
      fontFamily: {
        display: ['var(--font-display)'],
        sans: ['var(--font-sans)'],
        util: ['var(--font-util)'],
      },
      borderRadius: {
        ui: '12px',
      },
      transitionTimingFunction: {
        smooth: 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
    },
  },
  plugins: [],
}
