/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        'light': '#fdf0d5',
        'night': '#191716',
        'blue': '#1e6ba5',
        'red': '#db2b39'
      },
    },
  },
  plugins: [],
}