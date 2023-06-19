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
      },
      backgroundImage: theme => ({
        'hero-gradient': 'radial-gradient(at 54% 40%, hsla(226,72%,93%,1) 0px, transparent 50%), radial-gradient(at 25% 26%, hsla(275,90%,93%,1) 0px, transparent 50%), radial-gradient(at 72% 44%, hsla(183,71%,93%,1) 0px, transparent 50%), radial-gradient(at 87% 59%, hsla(185,61%,93%,1) 0px, transparent 50%), radial-gradient(at 23% 84%, hsla(4,65%,93%,1) 0px, transparent 50%), radial-gradient(at 43% 71%, hsla(321,67%,93%,1) 0px, transparent 50%), radial-gradient(at 91% 4%, hsla(352,77%,93%,1) 0px, transparent 50%)',
      }),
    },
  },
  plugins: [],
}
