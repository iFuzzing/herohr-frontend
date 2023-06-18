/** @type {import('tailwindcss').Config} */

export default {
  content: ["./index.html","./src/**/*.{ts,js,jsx,tsx}",],
  theme: {
    extend: {
      fontFamily:{
        'Kanit':['Kanit'],
        'Roboto':['Roboto'],
        'Righteous':['Righteous'],
      },
      colors:{
        'app-base-primary':'#27C3C3',
        'alert':'#E25E5E',
        'active-primary':'#00FFFF',
        'blue-gradient-value':'#001AFF',
        'title-primary':'#1F5155',
        'label-primary':'#494949',
        'label-secondary':'#636363',
        'label-tertiary':'#D7D7D7',
        'link-primary':'#0161FF',
      },
      screens: {
        'tall': { 'raw': '(min-height: 764px) and (max-width: 640px)' },
        's320': {'raw': '(min-width: 320px) and (max-width: 400px)'},
        's400': {'raw': '(min-width: 400px) and (max-width: 700px)'},
      },
      animation: {
        'pulsein':'pulse 1s ease-in'
      }
    },
  },
  plugins: [],
}

