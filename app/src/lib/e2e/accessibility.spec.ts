import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("home page should not have any automatically detectable accessibility issues", async ({ page }) => {
  await page.goto("/");

  const accessibilityScanResults = await new AxeBuilder({ page }).analyze();

  expect(accessibilityScanResults.violations).toEqual([]);
});

test("event detail page should not have any automatically detectable accessibility issues", async ({ page }) => {
  // Navigate to the home page first
  await page.goto("/");

  // Click on the first event card to navigate to the event detail page
  await page.locator(".event-card, [data-testid='event-card']").first().click();

  // Run accessibility scan
  const accessibilityScanResults = await new AxeBuilder({ page }).analyze();

  expect(accessibilityScanResults.violations).toEqual([]);
});

test("privacy policy page should not have any automatically detectable accessibility issues", async ({ page }) => {
  await page.goto("/personvern");

  const accessibilityScanResults = await new AxeBuilder({ page }).analyze();

  expect(accessibilityScanResults.violations).toEqual([]);
});

test("unregistration page should not have any automatically detectable accessibility issues", async ({ page }) => {
  // Note: This test assumes a valid unregistration token is available
  const mockToken = "valid-token-123";

  await page.goto(`/event/unregistration/${mockToken}`);

  const accessibilityScanResults = await new AxeBuilder({ page }).analyze();

  expect(accessibilityScanResults.violations).toEqual([]);
});

// Note: To use these tests, you'll need to install the axe-core/playwright package:
// pnpm add -D @axe-core/playwright
