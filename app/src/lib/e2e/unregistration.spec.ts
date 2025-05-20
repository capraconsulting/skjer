import { test, expect } from "@playwright/test";

test("unregistration page shows error with invalid token", async ({ page }) => {
  // Navigate to the unregistration page with an invalid token
  await page.goto("/event/unregistration/invalid-token");

  // Check that an error message is displayed
  await expect(page.locator(".error-message, [data-testid='error-message']")).toBeVisible();
});
