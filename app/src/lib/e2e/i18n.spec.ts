import { test, expect } from "@playwright/test";

test("default language is Norwegian", async ({ page }) => {
  // Navigate to the home page
  await page.goto("/");

  // Check that the page contains Norwegian text
  // Look for common Norwegian words or phrases that would be on the page
  const pageContent = await page.textContent("body");
  expect(pageContent).toContain("Arrangementer"); // "Events" in Norwegian
});

test("can switch to English", async ({ page }) => {
  // Navigate to the home page
  await page.goto("/");

  // Find and click the language switcher
  await page.locator(".language-switcher, [data-testid='language-switcher']").click();
  await page.locator(".language-option, [data-testid='language-en']").click();

  // Check that the page now contains English text
  const pageContent = await page.textContent("body");
  expect(pageContent).toContain("Events");
});

test("language preference is remembered", async ({ page }) => {
  // Navigate to the home page
  await page.goto("/");

  // Find and click the language switcher to change to English
  await page.locator(".language-switcher, [data-testid='language-switcher']").click();
  await page.locator(".language-option, [data-testid='language-en']").click();

  // Navigate to another page
  await page.locator(".event-card, [data-testid='event-card']").first().click();

  // Check that the language is still English
  const pageContent = await page.textContent("body");
  expect(pageContent).toContain("Register"); // "Register" in English
});

test("form validation messages are translated", async ({ page }) => {
  // Navigate to the home page
  await page.goto("/");

  // Find and click the language switcher to change to English
  await page.locator(".language-switcher, [data-testid='language-switcher']").click();
  await page.locator(".language-option, [data-testid='language-en']").click();

  // Navigate to an event detail page
  await page.locator(".event-card, [data-testid='event-card']").first().click();

  // Try to submit the form without filling required fields
  await page.locator("button[type='submit'], [data-testid='submit-button']").click();

  // Check that validation error messages are in English
  const errorMessage = await page.textContent(".error-message, [data-testid='error-message']");
  expect(errorMessage).toContain("required"); // English error message

  // Switch back to Norwegian
  await page.locator(".language-switcher, [data-testid='language-switcher']").click();
  await page.locator(".language-option, [data-testid='language-no']").click();

  // Try to submit the form again
  await page.locator("button[type='submit'], [data-testid='submit-button']").click();

  // Check that validation error messages are in Norwegian
  const norwegianErrorMessage = await page.textContent(".error-message, [data-testid='error-message']");
  expect(norwegianErrorMessage).toContain("påkrevd"); // Norwegian error message
});

test("date formats are localized", async ({ page }) => {
  // Navigate to the home page
  await page.goto("/");

  // Get the date format in Norwegian
  const norwegianDateText = await page.locator(".event-date, [data-testid='event-date']").first().textContent();

  // Find and click the language switcher to change to English
  await page.locator(".language-switcher, [data-testid='language-switcher']").click();
  await page.locator(".language-option, [data-testid='language-en']").click();

  // Get the date format in English
  const englishDateText = await page.locator(".event-date, [data-testid='event-date']").first().textContent();

  // Check that the date formats are different
  expect(norwegianDateText).not.toEqual(englishDateText);
});
