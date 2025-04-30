import { test, expect } from "@playwright/test";

test("privacy policy page loads correctly", async ({ page }) => {
  // Navigate to the privacy policy page
  await page.goto("/personvern");

  // Check that the page title is correct
  await expect(page).toHaveTitle(/Personvern|Privacy Policy/);

  // Check that the page content is displayed
  await expect(page.locator("h1, .page-title, [data-testid='page-title']")).toBeVisible();
  await expect(page.locator(".privacy-content, [data-testid='privacy-content']")).toBeVisible();
});

test("privacy policy page has navigation links", async ({ page }) => {
  // Navigate to the privacy policy page
  await page.goto("/personvern");

  // Check that there's a link back to the home page
  await expect(page.locator("a[href='/'], [data-testid='home-link']")).toBeVisible();
});

test("can navigate to privacy policy from footer", async ({ page }) => {
  // Navigate to the home page
  await page.goto("/");

  // Find and click the privacy policy link in the footer
  await page.locator("footer a[href='/personvern'], [data-testid='privacy-link']").click();

  // Check that we're on the privacy policy page
  await expect(page).toHaveURL("/personvern");

  // Check that the privacy policy content is displayed
  await expect(page.locator(".privacy-content, [data-testid='privacy-content']")).toBeVisible();
});
