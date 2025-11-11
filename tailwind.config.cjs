/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./resources/**/*.blade.php",
    "./resources/**/*.js",
    "./resources/**/*.jsx",
    "./resources/**/*.ts",
    "./resources/**/*.tsx",
  ],
  theme: {
    extend: {
      colors: {
        'theme-color': '#00358D',
        'text-color': '#1F3047',
        'yellow-color': '#FFD613',
        'gray-color': '#272727',
        'light-gray-color': '#7E7E7E',
      },
      boxShadow: {
        'custom3': '0px 1px 35.9px -13px #00358D40',
        'custom4': '0px 0.97px 1.93px 0px #0000000D',
        'custom5': '0px 0 15px 8px #0000000A',
        'custom6': '0px 0px 11.3px 0px #00000026',
      },
    },
  },
  plugins: [],
}