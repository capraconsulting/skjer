import { test, expect } from "@playwright/test";

test("event detail page displays event information", async ({ page }) => {
  // Navigate to the home page first
  await page.goto("/");

  // Click on the first event card to navigate to the event detail page
  await page.locator(".event-card, [data-testid='event-card']").first().click();

  // Check that we're on an event detail page
  await expect(page).toHaveURL(/\/event\/[^/]+/);

  // Check that event details are displayed
  await expect(page.locator(".event-title, [data-testid='event-title']")).toBeVisible();
  await expect(page.locator(".event-description, [data-testid='event-description']")).toBeVisible();
  await expect(page.locator(".event-date, [data-testid='event-date']")).toBeVisible();
  await expect(page.locator(".event-location, [data-testid='event-location']")).toBeVisible();
});

test("event registration form is displayed", async ({ page }) => {
  // Navigate to the home page first
  await page.goto("/");

  // Click on the first event card to navigate to the event detail page
  await page.locator(".event-card, [data-testid='event-card']").first().click();

  // Check that the registration form exists
  await expect(page.locator("form.registration-form, [data-testid='registration-form']")).toBeVisible();

  // Check that the form contains expected fields
  await expect(page.locator("input[name='name'], [data-testid='name-input']")).toBeVisible();
  await expect(page.locator("input[name='email'], [data-testid='email-input']")).toBeVisible();
  await expect(page.locator("button[type='submit'], [data-testid='submit-button']")).toBeVisible();
});

test("event registration form validation works", async ({ page }) => {
  // Navigate to the home page first
  await page.goto("/");

  // Click on the first event card to navigate to the event detail page
  await page.locator(".event-card, [data-testid='event-card']").first().click();

  // Try to submit the form without filling required fields
  await page.locator("button[type='submit'], [data-testid='submit-button']").click();

  // Check that validation error messages are displayed
  await expect(page.locator(".error-message, [data-testid='error-message']")).toBeVisible();
});

test("event registration submission works", async ({ page }) => {
  // Navigate to the home page first
  await page.goto("/");

  // Click on the first event card to navigate to the event detail page
  await page.locator(".event-card, [data-testid='event-card']").first().click();

  // Fill out the registration form
  await page.locator("input[name='name'], [data-testid='name-input']").fill("Test User");
  await page.locator("input[name='email'], [data-testid='email-input']").fill("test@example.com");

  // Submit the form
  await page.locator("button[type='submit'], [data-testid='submit-button']").click();

  // Check that a success message is displayed
  await expect(page.locator(".success-message, [data-testid='success-message']")).toBeVisible();
});
