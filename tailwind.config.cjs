/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        'filmImage': "url('/images/filmImage.jpeg')",
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
