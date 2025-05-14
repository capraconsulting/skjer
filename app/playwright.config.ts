
import { defineConfig, devices } from "@playwright/test";

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  retries: 4, // To rerun "flaky" tests"
  testDir: "./src/lib/e2e",
  timeout: 60000, // Økt timeout til 60 sekunder
  fullyParallel: true,

  // Legg til konfigurasjon for test-resultater
  outputDir: 'src/lib/e2e/test-results',

  use: {
    baseURL: "http://localhost:5173/",
    navigationTimeout: 60000, // Økt navigasjons-timeout
    actionTimeout: 60000, // Økt handlings-timeout
    screenshot: 'only-on-failure',
  },

  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },

    {
      name: "firefox",
      use: {
        ...devices["Desktop Firefox"],
        launchOptions: {
          slowMo: 100, // Legger til litt forsinkelse for å øke stabilitet
        },
      },
    },

    {
      name: "webkit",
      use: { ...devices["Desktop Safari"] },
    },
  ],
  webServer: {
    command: 'pnpm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: true,
  },
});
