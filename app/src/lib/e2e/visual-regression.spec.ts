import { test, expect } from "@playwright/test";
import { clickFirstEvent } from "./helpers";

// Note: To use these tests, you'll need to configure Playwright for visual comparisons
// See: https://playwright.dev/docs/test-snapshots

// Note: To update the baseline screenshots, run:
// pnpm playwright test --update-snapshots

test("home page visual regression", async ({ page }) => {
  // Navigate to the home page
  await page.goto("/");

  // Wait for all images to load
  await page.waitForLoadState("networkidle");

  // Add a small delay to ensure the page is fully rendered and stable
  await page.waitForTimeout(1000);

  // Take a screenshot of the entire page
  // Adding a threshold to allow for minor visual differences
  // Adding maxDiffPixelRatio to allow for small differences between consecutive screenshots
  // Increasing timeout to allow more time for stable screenshots
  await expect(page).toHaveScreenshot("home-page.png", {
    threshold: 0.02,
    maxDiffPixelRatio: 0.02,
    timeout: 10000
  });
});

test("event detail page visual regression", async ({ page }) => {
  // Navigate to the home page first
  await page.goto("/");

  // Click on the first event to navigate to the event detail page
  await clickFirstEvent(page);

  // Wait for all images to load
  await page.waitForLoadState("networkidle");

  // Add a small delay to ensure the page is fully rendered and stable
  await page.waitForTimeout(1000);

  // Take a screenshot of the entire page
  // Adding a threshold to allow for minor visual differences
  // Adding maxDiffPixelRatio to allow for small differences between consecutive screenshots
  // Increasing timeout to allow more time for stable screenshots
  await expect(page).toHaveScreenshot("event-detail-page.png", {
    threshold: 0.02,
    maxDiffPixelRatio: 0.02,
    timeout: 10000
  });
});

test("privacy policy page visual regression", async ({ page }) => {
  // Navigate to the privacy policy page
  await page.goto("/personvern");

  // Wait for all images to load
  await page.waitForLoadState("networkidle");

  // Add a small delay to ensure the page is fully rendered and stable
  await page.waitForTimeout(1000);

  // Take a screenshot of the entire page
  // Adding a threshold to allow for minor visual differences
  // Adding maxDiffPixelRatio to allow for small differences between consecutive screenshots
  // Increasing timeout to allow more time for stable screenshots
  await expect(page).toHaveScreenshot("privacy-policy-page.png", {
    threshold: 0.02,
    maxDiffPixelRatio: 0.02,
    timeout: 10000
  });
});

test("error page visual regression", async ({ page }) => {
  // Navigate to a non-existent page
  await page.goto("/non-existent-page");

  // Wait for all images to load
  await page.waitForLoadState("networkidle");

  // Add a small delay to ensure the page is fully rendered and stable
  await page.waitForTimeout(1000);

  // Take a screenshot of the entire page
  // Adding a threshold to allow for minor visual differences
  // Adding maxDiffPixelRatio to allow for small differences between consecutive screenshots
  // Increasing timeout to allow more time for stable screenshots
  await expect(page).toHaveScreenshot("error-page.png", {
    threshold: 0.02,
    maxDiffPixelRatio: 0.02,
    timeout: 10000
  });
});

test("mobile view visual regression", async ({ page }) => {
  // Set viewport to mobile size
  await page.setViewportSize({ width: 375, height: 667 });

  // Navigate to the home page
  await page.goto("/");

  // Wait for all images to load
  await page.waitForLoadState("networkidle");

  // Add a small delay to ensure the page is fully rendered and stable
  await page.waitForTimeout(1000);

  // Take a screenshot of the entire page
  // Adding a threshold to allow for minor visual differences
  // Adding maxDiffPixelRatio to allow for small differences between consecutive screenshots
  // Increasing timeout to allow more time for stable screenshots
  await expect(page).toHaveScreenshot("home-page-mobile.png", {
    threshold: 0.02,
    maxDiffPixelRatio: 0.02,
    timeout: 10000
  });
});

test("tablet view visual regression", async ({ page }) => {
  // Set the viewport to tablet size
  await page.setViewportSize({ width: 768, height: 1024 });

  // Navigate to the home page
  await page.goto("/");

  // Wait for all images to load
  await page.waitForLoadState("networkidle");

  // Add a small delay to ensure the page is fully rendered and stable
  await page.waitForTimeout(1000);

  // Take a screenshot of the entire page
  // Adding a threshold to allow for minor visual differences
  // Adding maxDiffPixelRatio to allow for small differences between consecutive screenshots
  // Increasing timeout to allow more time for stable screenshots
  await expect(page).toHaveScreenshot("home-page-tablet.png", {
    threshold: 0.02,
    maxDiffPixelRatio: 0.02,
    timeout: 10000
  });
});

test("dark mode visual regression", async ({ page }) => {
  // Test dark mode
  await page.emulateMedia({ colorScheme: 'dark' });
  await page.goto("/");

  await expect(page).toHaveScreenshot("home-page-dark.png", {
    threshold: 0.02,
    maxDiffPixelRatio: 0.02
  });
});

