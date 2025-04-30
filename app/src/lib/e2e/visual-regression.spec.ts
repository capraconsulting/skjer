import { test, expect } from "@playwright/test";

// Note: To use these tests, you'll need to configure Playwright for visual comparisons
// See: https://playwright.dev/docs/test-snapshots

test("home page visual regression", async ({ page }) => {
  // Navigate to the home page
  await page.goto("/");

  // Wait for all images to load
  await page.waitForLoadState("networkidle");

  // Take a screenshot of the entire page
  await expect(page).toHaveScreenshot("home-page.png");
});

test("event detail page visual regression", async ({ page }) => {
  // Navigate to the home page first
  await page.goto("/");

  // Click on the first event card to navigate to the event detail page
  await page.locator(".event-card, [data-testid='event-card']").first().click();

  // Wait for all images to load
  await page.waitForLoadState("networkidle");

  // Take a screenshot of the entire page
  await expect(page).toHaveScreenshot("event-detail-page.png");
});

test("privacy policy page visual regression", async ({ page }) => {
  // Navigate to the privacy policy page
  await page.goto("/personvern");

  // Wait for all images to load
  await page.waitForLoadState("networkidle");

  // Take a screenshot of the entire page
  await expect(page).toHaveScreenshot("privacy-policy-page.png");
});

test("unregistration page visual regression", async ({ page }) => {
  // Note: This test assumes a valid unregistration token is available
  const mockToken = "valid-token-123";

  // Navigate to the unregistration page with the token
  await page.goto(`/event/unregistration/${mockToken}`);

  // Wait for all images to load
  await page.waitForLoadState("networkidle");

  // Take a screenshot of the entire page
  await expect(page).toHaveScreenshot("unregistration-page.png");
});

test("error page visual regression", async ({ page }) => {
  // Navigate to a non-existent page
  await page.goto("/non-existent-page");

  // Wait for all images to load
  await page.waitForLoadState("networkidle");

  // Take a screenshot of the entire page
  await expect(page).toHaveScreenshot("error-page.png");
});

test("mobile view visual regression", async ({ page }) => {
  // Set viewport to mobile size
  await page.setViewportSize({ width: 375, height: 667 });

  // Navigate to the home page
  await page.goto("/");

  // Wait for all images to load
  await page.waitForLoadState("networkidle");

  // Take a screenshot of the entire page
  await expect(page).toHaveScreenshot("home-page-mobile.png");
});

test("tablet view visual regression", async ({ page }) => {
  // Set viewport to tablet size
  await page.setViewportSize({ width: 768, height: 1024 });

  // Navigate to the home page
  await page.goto("/");

  // Wait for all images to load
  await page.waitForLoadState("networkidle");

  // Take a screenshot of the entire page
  await expect(page).toHaveScreenshot("home-page-tablet.png");
});

// Note: To update the baseline screenshots, run:
// pnpm playwright test --update-snapshots
