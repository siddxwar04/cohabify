/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        paper: 'rgb(var(--c-paper) / <alpha-value>)',
        cream: 'rgb(var(--c-cream) / <alpha-value>)',
        linen: 'rgb(var(--c-linen) / <alpha-value>)',
        espresso: 'rgb(var(--c-espresso) / <alpha-value>)',
        bark: 'rgb(var(--c-bark) / <alpha-value>)',
        stone: 'rgb(var(--c-stone) / <alpha-value>)',
        mist: 'rgb(var(--c-mist) / <alpha-value>)',
        forest: {
          DEFAULT: 'rgb(var(--c-forest) / <alpha-value>)',
          dim: 'rgb(var(--c-forest-dim) / <alpha-value>)',
          soft: 'rgb(var(--c-forest-soft) / <alpha-value>)',
        },
        clay: {
          DEFAULT: 'rgb(var(--c-clay) / <alpha-value>)',
          soft: 'rgb(var(--c-clay-soft) / <alpha-value>)',
        },
        champagne: 'rgb(var(--c-champagne) / <alpha-value>)',
        night: 'rgb(var(--c-night) / <alpha-value>)',
        day: 'rgb(var(--c-day) / <alpha-value>)',
      },
      fontFamily: {
        display: ['Instrument Serif', 'Georgia', 'serif'],
        sans: ['Outfit', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: 'var(--shadow-card)',
        lift: 'var(--shadow-lift)',
        inset: 'inset 0 1px 0 rgba(255,255,255,0.7)',
      },
      borderRadius: {
        '2xl': '1.25rem',
        '3xl': '1.75rem',
      },
    },
  },
  plugins: [],
}
