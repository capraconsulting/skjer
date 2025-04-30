import { test, expect } from "@playwright/test";

test("unregistration page loads with valid token", async ({ page }) => {
  // Note: This test assumes a valid unregistration token is available
  // In a real test, you might need to create a registration first and extract the token
  // For this example, we'll use a placeholder token
  const mockToken = "valid-token-123";

  // Navigate to the unregistration page with the token
  await page.goto(`/event/unregistration/${mockToken}`);

  // Check that the unregistration page loads
  await expect(page.locator(".unregistration-page, [data-testid='unregistration-page']")).toBeVisible();

  // Check that the page contains confirmation elements
  await expect(page.locator(".event-title, [data-testid='event-title']")).toBeVisible();
  await expect(page.locator(".confirmation-button, [data-testid='confirm-button']")).toBeVisible();
});

test("unregistration confirmation works", async ({ page }) => {
  // Note: This test assumes a valid unregistration token is available
  const mockToken = "valid-token-123";

  // Navigate to the unregistration page with the token
  await page.goto(`/event/unregistration/${mockToken}`);

  // Click the confirmation button
  await page.locator(".confirmation-button, [data-testid='confirm-button']").click();

  // Check that a success message is displayed
  await expect(page.locator(".success-message, [data-testid='success-message']")).toBeVisible();
});

test("unregistration page shows error with invalid token", async ({ page }) => {
  // Navigate to the unregistration page with an invalid token
  await page.goto("/event/unregistration/invalid-token");

  // Check that an error message is displayed
  await expect(page.locator(".error-message, [data-testid='error-message']")).toBeVisible();
});

// This test requires setup to create a real registration and token
test.skip("end-to-end unregistration flow", async ({ page }) => {
  // First register for an event
  await page.goto("/");
  await page.locator(".event-card, [data-testid='event-card']").first().click();

  // Fill out the registration form
  await page.locator("input[name='name'], [data-testid='name-input']").fill("Test User");
  await page.locator("input[name='email'], [data-testid='email-input']").fill("test@example.com");

  // Submit the form
  await page.locator("button[type='submit'], [data-testid='submit-button']").click();

  // In a real test, you would need to extract the unregistration token from the email
  // or from the database. For this example, we'll skip this part.

  // Mock getting the token (in a real test, you would get this from the email or database)
  const mockToken = "extracted-token-123";

  // Navigate to the unregistration page with the token
  await page.goto(`/event/unregistration/${mockToken}`);

  // Click the confirmation button
  await page.locator(".confirmation-button, [data-testid='confirm-button']").click();

  // Check that a success message is displayed
  await expect(page.locator(".success-message, [data-testid='success-message']")).toBeVisible();
});
