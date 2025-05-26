/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      screens: {
     
        '3xl': '1920px',
        '4xl': '2560px',
        '5xl': '2880px',
      },
      fontSize: {
        'xs-sm': '0.7rem',
        'base-lg': '1.15rem',
      }
    },
  },
  plugins: [],
};
