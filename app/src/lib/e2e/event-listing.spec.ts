import { test, expect } from "@playwright/test";

test("event listing page displays events", async ({ page }) => {
  // Navigate to the home page which should display event listings
  await page.goto("/");

  // Check that the event list container exists
  await expect(page.locator(".event-list, [data-testid='event-list']")).toBeVisible();

  // Check that at least one event card is displayed
  await expect(page.locator(".event-card, [data-testid='event-card']")).toBeVisible();

  // Check that event cards contain expected elements
  const eventCard = page.locator(".event-card, [data-testid='event-card']").first();
  await expect(eventCard.locator(".event-title, [data-testid='event-title']")).toBeVisible();
  await expect(eventCard.locator(".event-date, [data-testid='event-date']")).toBeVisible();
});

test("event filtering works", async ({ page }) => {
  // Navigate to the home page
  await page.goto("/");

  // Check that the filter component exists
  await expect(page.locator(".event-filter, [data-testid='event-filter']")).toBeVisible();

  // Click on a filter option (assuming there's a filter for the event type)
  await page.locator(".filter-option, [data-testid='filter-option']").first().click();

  // Wait for the page to update with filtered results
  await page.waitForLoadState("networkidle");

  // Verify that the event list has been updated
  await expect(page.locator(".event-list, [data-testid='event-list']")).toBeVisible();
});

test("event search works", async ({ page }) => {
  // Navigate to the home page
  await page.goto("/");

  // Check that search input exists
  const searchInput = page.locator("input[type='search'], [data-testid='search-input']");
  await expect(searchInput).toBeVisible();

  // Enter a search term
  await searchInput.fill("workshop");
  await searchInput.press("Enter");

  // Wait for the page to update with search results
  await page.waitForLoadState("networkidle");

  // Verify that the event list has been updated
  await expect(page.locator(".event-list, [data-testid='event-list']")).toBeVisible();
});
