/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        "jost": ["Jost", "sans-serif"],
        "roboto": ["Roboto", "sans-serif"],
      },
      borderColor: {
        'white': 'rgba(255, 255, 255, 0.2)', // Define the border color
      },
      backgroundColor: {
        'white': 'rgba(255, 255, 255, 0.2)', // Define the border color
      },
      animation: {
        'up-down': 'up-down 1s ease-in-out infinite',
      }
    },
  },
  plugins: [],
}
