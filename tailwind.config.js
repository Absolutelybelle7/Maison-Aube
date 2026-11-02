/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Playfair Display"', 'Georgia', 'serif'],
      },
      colors: {
        primary: {
          50: '#F7F4F0',
          100: '#EDE7DF',
          200: '#DCD2C4',
          300: '#C4B7A4',
          400: '#A8977F',
          500: '#8C7A63',
          600: '#6E5F4D',
          700: '#54483A',
          800: '#3A3229',
          900: '#1F1B18',
        },
        secondary: {
          50: '#FBF9F6',
          100: '#F5F1EA',
          200: '#EBE4D8',
          300: '#DDD2C2',
          500: '#9C8F7E',
          700: '#5E554A',
          900: '#2B2620',
        },
        accent: {
          50: '#FBF3EE',
          100: '#F4E1D5',
          300: '#DDAA8C',
          500: '#B7714C',
          700: '#8A4E30',
          900: '#4E2B19',
        },
        success: {
          50: '#F1F5F0',
          100: '#DCE7D8',
          500: '#5D7A57',
          700: '#3F5A3C',
        },
        warning: {
          50: '#FDF8EC',
          100: '#F8EBC8',
          500: '#B7871F',
          700: '#7F5E12',
        },
        error: {
          50: '#FCF1EF',
          100: '#F5D9D4',
          500: '#B0493A',
          700: '#7E2F24',
        },
      },
      keyframes: {
        'slow-zoom': {
          '0%': { transform: 'scale(1.08)' },
          '100%': { transform: 'scale(1)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      animation: {
        'slow-zoom': 'slow-zoom 9s ease-out forwards',
        'fade-in': 'fade-in 700ms ease-out both',
      },
    },
  },
  plugins: [],
};
