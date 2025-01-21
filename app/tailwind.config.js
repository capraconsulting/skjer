import flowbite from "flowbite/plugin";

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{html,js,svelte,ts}",
    "./node_modules/flowbite-svelte/**/*.{html,js,svelte,ts}",
  ],
  theme: {
    fontFamily: {
      sans: [
        "Inter",
        "ui-sans-serif",
        "system-ui",
        "sans-serif",
        "Apple Color Emoji",
        "Segoe UI Emoji",
        "Segoe UI Symbol",
        "Noto Color Emoji",
      ],
    },
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
        frydeRed: "#d0000b",
        frydeLightMode: "#fff9e5",
        lifligDarkMode: "#220038",
        purple: "#4a11b7",
        pink: "#bb5ce9",
        pinkSpark: "#ffa2ff",
        lifligLightMode: "#ffe8fe",
        ireneGreen: "#C3E7C3",
      },
    },
    darkMode: "class",
  },
  plugins: [flowbite],
};
