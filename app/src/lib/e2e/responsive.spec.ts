import { test, expect } from "@playwright/test";
import { getEventCards } from "./helpers";

// Test for mobile viewport
test.describe("Mobile viewport", () => {
  test.use({ viewport: { width: 375, height: 667 } }); // iPhone SE size


});

// Test for tablet viewport
test.describe("Tablet viewport", () => {
  test.use({ viewport: { width: 768, height: 1024 } }); // iPad size

  test("home page renders correctly on tablet", async ({ page }) => {
    await page.goto("/");

    // Check that event cards are displayed in a grid
    const eventCards = getEventCards(page);
    const firstCard = eventCards.first();
    const secondCard = eventCards.nth(1);

    // Get bounding boxes to check layout
    const firstCardBox = await firstCard.boundingBox();
    const secondCardBox = await secondCard.boundingBox();

    // On the tablet, cards might be side by side or stacked depending on the design
    // This is a simplified check - adjust it based on your actual design
    if (
      secondCardBox &&
      firstCardBox &&
      secondCardBox.x !== undefined &&
      firstCardBox.x !== undefined &&
      firstCardBox.width !== undefined &&
      secondCardBox.x > firstCardBox.x + firstCardBox.width
    ) {
      // Cards are side by side
      expect(secondCardBox?.x).toBeGreaterThan(firstCardBox?.x + firstCardBox?.width);
    } else {
      // Cards are stacked
      expect(secondCardBox!.y).toBeGreaterThan(firstCardBox!.y + firstCardBox!.height);
    }
  });
});

// Test for desktop viewport
test.describe("Desktop viewport", () => {
  test.use({ viewport: { width: 1280, height: 800 } }); // Standard desktop size

});
