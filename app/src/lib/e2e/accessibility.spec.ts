import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { clickFirstEvent } from "./helpers";

test("home page should not have any automatically detectable accessibility issues", async ({ page }) => {
  await page.goto("/");

  const accessibilityScanResults = await new AxeBuilder({ page }).analyze();

  expect(accessibilityScanResults.violations).toEqual([]);
});

test("event detail page should not have any automatically detectable accessibility issues", async ({ page }) => {
  // Navigate to the home page first
  await page.goto("/");

  // Click on the first event to navigate to the event detail page
  await clickFirstEvent(page);

  // Run accessibility scan
  const accessibilityScanResults = await new AxeBuilder({ page }).analyze();

  expect(accessibilityScanResults.violations).toEqual([]);
});

test("privacy policy page should not have any automatically detectable accessibility issues", async ({ page }) => {
  await page.goto("/personvern");

  const accessibilityScanResults = await new AxeBuilder({ page }).analyze();

  expect(accessibilityScanResults.violations).toEqual([]);
});
