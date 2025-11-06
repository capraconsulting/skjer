/// <reference types="vitest/config" />
import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [sveltekit()],
  test: {
    exclude: [
      "**/node_modules/**",
      "**/.git/**",
      "**/e2e/**", // Vitest fails when trying to run our Playwright tests
    ],
  },
});
