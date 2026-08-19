/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        paper: '#F3EEE4',
        cream: '#FBF7F0',
        linen: '#E9E1D4',
        espresso: '#1C1917',
        bark: '#3F3832',
        stone: '#6F675E',
        mist: '#A39B90',
        forest: {
          DEFAULT: '#1F6B4A',
          dim: '#16553A',
          soft: '#E6F3EC',
        },
        clay: {
          DEFAULT: '#C45D26',
          soft: '#F8E8DC',
        },
        champagne: '#C4A574',
      },
      fontFamily: {
        display: ['Instrument Serif', 'Georgia', 'serif'],
        sans: ['Outfit', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 1px rgba(28,25,23,0.04), 0 18px 40px -18px rgba(28,25,23,0.18)',
        lift: '0 24px 50px -20px rgba(28,25,23,0.22)',
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
