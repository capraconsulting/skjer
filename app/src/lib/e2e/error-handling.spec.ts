import { test, expect } from "@playwright/test";

test("handles non-existent event gracefully", async ({ page }) => {
  // Navigate to a non-existent event
  await page.goto("/event/non-existent-event-id");

  // Check that an appropriate error message is displayed
  await expect(page.locator(".error-message, [data-testid='error-message']")).toBeVisible();

  // Check that there's a way to navigate back to the home page
  await expect(page.locator("a[href='/'], [data-testid='home-link']")).toBeVisible();
});

test("handles invalid unregistration token gracefully", async ({ page }) => {
  // Navigate to the unregistration page with an invalid token
  await page.goto("/event/unregistration/invalid-token");

  // Check that an appropriate error message is displayed
  await expect(page.locator(".error-message, [data-testid='error-message']")).toBeVisible();

  // Check that there's a way to navigate back to the home page
  await expect(page.locator("a[href='/'], [data-testid='home-link']")).toBeVisible();
});

test("handles form validation errors gracefully", async ({ page }) => {
  // Navigate to the home page first
  await page.goto("/");

  // Click on the first event card to navigate to the event detail page
  await page.locator(".event-card, [data-testid='event-card']").first().click();

  // Try to submit the form with invalid data
  await page.locator("input[name='email'], [data-testid='email-input']").fill("invalid-email");
  await page.locator("button[type='submit'], [data-testid='submit-button']").click();

  // Check that validation error messages are displayed
  await expect(page.locator(".error-message, [data-testid='error-message']")).toBeVisible();

  // Check that the form is still visible and can be corrected
  await expect(page.locator("form.registration-form, [data-testid='registration-form']")).toBeVisible();
});

test("handles network errors gracefully", async ({ page, context }) => {
  // Set up request interception to simulate a network error
  await context.route("**/api/**", route => route.abort("failed"));

  // Navigate to the home page first
  await page.goto("/");

  // Click on the first event card to navigate to the event detail page
  await page.locator(".event-card, [data-testid='event-card']").first().click();

  // Fill out the registration form
  await page.locator("input[name='name'], [data-testid='name-input']").fill("Test User");
  await page.locator("input[name='email'], [data-testid='email-input']").fill("test@example.com");

  // Submit the form (this should trigger a network request that will fail)
  await page.locator("button[type='submit'], [data-testid='submit-button']").click();

  // Check that an appropriate error message is displayed
  await expect(page.locator(".error-message, [data-testid='error-message']")).toBeVisible();
});

test("handles 404 page gracefully", async ({ page }) => {
  // Navigate to a non-existent page
  await page.goto("/non-existent-page");

  // Check that we get a 404 page
  await expect(page.locator("h1, .error-title, [data-testid='error-title']")).toBeVisible();

  // Check that there's a way to navigate back to the home page
  await expect(page.locator("a[href='/'], [data-testid='home-link']")).toBeVisible();
});
