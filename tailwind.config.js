/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{html,ts}"], // adjust for your project
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        green: {
          60: "#00f9a6",
        },
      },
    },
  },
  plugins: [],
};
