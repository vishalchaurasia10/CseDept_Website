/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      keyframes: {
        scrolling: {
          '0%': {
            transform: 'translateX(0)',
          },
          '100%': {
            transform: 'translateX(-100%)',
          },
          '110%': {
            transform: 'translateX(0)',
          },
        },
      },
      fontFamily: {
        "jost": ["Jost", "sans-serif"],
        "roboto": ["Roboto", "sans-serif"],
      },
      borderColor: {
        'white': 'rgba(255, 255, 255, 0.2)', // Define the border color
      },
      backgroundColor: {
        'white': 'rgba(255, 255, 255, 0.2)', // Define the border color
        'pureWhite': 'rgba(255, 255, 255)',
      },
      animation: {
        'up-down': 'up-down 1s ease-in-out infinite',
        'scrolling': 'scrolling 30s linear -1s infinite',
        'scrollingMobile': 'scrolling 8s linear -1s infinite',
      },
      backgroundImage: theme => ({
        'hero-gradient': 'radial-gradient(at 54% 40%, hsla(226,72%,93%,1) 0px, transparent 50%), radial-gradient(at 25% 26%, hsla(275,90%,93%,1) 0px, transparent 50%), radial-gradient(at 72% 44%, hsla(183,71%,93%,1) 0px, transparent 50%), radial-gradient(at 87% 59%, hsla(185,61%,93%,1) 0px, transparent 50%), radial-gradient(at 23% 84%, hsla(4,65%,93%,1) 0px, transparent 50%), radial-gradient(at 43% 71%, hsla(321,67%,93%,1) 0px, transparent 50%), radial-gradient(at 91% 4%, hsla(352,77%,93%,1) 0px, transparent 50%)',
      }),
    },
  },
  plugins: [],
}
