/// <reference types="vitest/config" />
import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [sveltekit()],
  // Tests load server code, and some of its packages export for Svelte only.
  ...(process.env.VITEST
    ? { ssr: { resolve: { conditions: ["svelte"], externalConditions: ["svelte"] } } }
    : {}),
  test: {
    exclude: [
      "**/node_modules/**",
      "**/.git/**",
      "**/e2e/**", // Vitest fails when trying to run our Playwright tests
    ],
  },
});
