/** @type {import('tailwindcss').Config} */
// 1st inject link in index.html. As Tailwind CSS automatically injects "sans-font" so we can overwrite that font-family for whole project.

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    fontFamily: {
      sans: ['Roboto Mono , monospace']
    },
    // extend this "colors" NOT overwrite in the entire-theme AS then other colors WILL also be overwritten (NOT-WORK). Can give any color like --> colors { pizza: '#f5f5f4' } ; "vh" on MOBILES is NOT 100% so used "dynamic-vh" more modern way.
    extend: {
      // fontSize: {
      //   huge: ['80rem', { lineHeight: '1' }]
      // }
      height: {
        screen: '100dvh'
      }
    },
  },
  plugins: [],
}

