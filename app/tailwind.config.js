/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{html,js,svelte,ts}",
    "./node_modules/flowbite-svelte/**/*.{html,js,svelte,ts}",
  ],
  theme: {
    extend: {
      colors: {
        capraDarkMode: "#0c1c35",
        warmBlue: "#004c61",
        freshGreen: "#00ca97",
        spark: "#86ffd9",
        capraLightMode: "#defcf5",
        deepRed: "#371420",
        orange: "#ffb74b",
        yellowSpark: "#ffeb4d",
        frydeLightMode: "#fff9e5",
        lifligDarkMode: "#220038",
        purple: "#4a11b7",
        pink: "#bb5ce9",
        pinkSpark: "#ffa2ff",
        lifligLightMode: "#ffe8fe",
      },
    },
    darkMode: "class",
  },
  plugins: [require("flowbite/plugin")],
};
