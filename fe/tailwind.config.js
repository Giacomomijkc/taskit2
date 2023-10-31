/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}",],
  theme: {
    extend: {
      fontFamily: {
        primary: ['Rubik Mono One', 'monospace'],
        secondary: ['Ubuntu Mono', 'monospace'],
      },
      colors: {
        light: {
          bg: 'green-100',
          text: 'black',
        },
        dark: {
          bg: 'blue-900',
          text: 'white',
        },
      },
      screens: {
        'xs': '320px',
      },
    },
  },
  plugins: [],
}

