import { defineConfig } from 'vitest/config';
import { sveltekit } from '@sveltejs/kit/vite';
import path from 'path';

export default defineConfig({
  plugins: [sveltekit()],
  test: {
    include: ['src/**/*.{test,spec}.{js,ts}'],
    exclude: ['src/lib/e2e/**'],
    environment: 'node',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    alias: {
      $lib: path.resolve('./src/lib'),
      $models: path.resolve('./src/models'),
      $app: path.resolve('./node_modules/@sveltejs/kit/src/runtime/app')
    }
  }
});
