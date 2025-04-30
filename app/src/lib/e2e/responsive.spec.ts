import { test, expect } from "@playwright/test";

// Test for mobile viewport
test.describe("Mobile viewport", () => {
  test.use({ viewport: { width: 375, height: 667 } }); // iPhone SE size

  test("home page renders correctly on mobile", async ({ page }) => {
    await page.goto("/");

    // Check that the mobile menu button is visible
    await expect(page.locator(".mobile-menu-button, [data-testid='mobile-menu-button']")).toBeVisible();

    // Check that event cards are stacked vertically (not side by side)
    const eventCards = page.locator(".event-card, [data-testid='event-card']");
    const firstCard = eventCards.first();
    const secondCard = eventCards.nth(1);

    // Get bounding boxes to check layout
    const firstCardBox = await firstCard.boundingBox();
    const secondCardBox = await secondCard.boundingBox();

    // On mobile, cards should be stacked vertically, so the second card should be below the first
    expect(secondCardBox?.y).toBeGreaterThan(firstCardBox?.y + firstCardBox?.height);
  });

  test("event detail page renders correctly on mobile", async ({ page }) => {
    // Navigate to the home page first
    await page.goto("/");

    // Click on the first event card to navigate to the event detail page
    await page.locator(".event-card, [data-testid='event-card']").first().click();

    // Check that the page content is properly sized for mobile
    const contentWidth = await page.evaluate(() => {
      const content = document.querySelector(".event-content, [data-testid='event-content']");
      return content ? content.getBoundingClientRect().width : 0;
    });

    // Content width should not exceed viewport width
    expect(contentWidth).toBeLessThanOrEqual(375);
  });
});

// Test for tablet viewport
test.describe("Tablet viewport", () => {
  test.use({ viewport: { width: 768, height: 1024 } }); // iPad size

  test("home page renders correctly on tablet", async ({ page }) => {
    await page.goto("/");

    // Check that event cards are displayed in a grid
    const eventCards = page.locator(".event-card, [data-testid='event-card']");
    const firstCard = eventCards.first();
    const secondCard = eventCards.nth(1);

    // Get bounding boxes to check layout
    const firstCardBox = await firstCard.boundingBox();
    const secondCardBox = await secondCard.boundingBox();

    // On tablet, cards might be side by side or stacked depending on the design
    // This is a simplified check - adjust based on your actual design
    if (secondCardBox?.x > firstCardBox?.x + firstCardBox?.width) {
      // Cards are side by side
      expect(secondCardBox?.x).toBeGreaterThan(firstCardBox?.x + firstCardBox?.width);
    } else {
      // Cards are stacked
      expect(secondCardBox?.y).toBeGreaterThan(firstCardBox?.y + firstCardBox?.height);
    }
  });
});

// Test for desktop viewport
test.describe("Desktop viewport", () => {
  test.use({ viewport: { width: 1280, height: 800 } }); // Standard desktop size

  test("home page renders correctly on desktop", async ({ page }) => {
    await page.goto("/");

    // Check that the desktop navigation is visible
    await expect(page.locator("nav, .desktop-nav, [data-testid='desktop-nav']")).toBeVisible();

    // Check that event cards are displayed in a grid
    const eventCards = page.locator(".event-card, [data-testid='event-card']");
    const firstCard = eventCards.first();
    const secondCard = eventCards.nth(1);

    // Get bounding boxes to check layout
    const firstCardBox = await firstCard.boundingBox();
    const secondCardBox = await secondCard.boundingBox();

    // On desktop, cards should be side by side
    expect(secondCardBox?.x).toBeGreaterThan(firstCardBox?.x);
  });
});
