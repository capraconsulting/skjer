/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{html,js,svelte,ts}",
    "./node_modules/flowbite-svelte/**/*.{html,js,svelte,ts}",
  ],
  theme: {
    extend: {
      colors: {
        lightGreen: "#E5FFE3",
      },
    },
    darkMode: "class",
  },
  plugins: [require("flowbite/plugin")],
};
