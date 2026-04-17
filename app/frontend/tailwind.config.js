/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        honda: {
          red: '#CC0000',
          'red-dark': '#AA0000',
          black: '#1A1A1A',
          gray: '#767676',
          'light-gray': '#F5F5F5',
        }
      },
      fontFamily: {
        sans: ['Roboto', 'Arial', 'Helvetica', 'sans-serif'],
      }
    }
  },
  plugins: [require('@tailwindcss/forms')],
}
