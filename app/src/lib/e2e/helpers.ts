import type { Page, Locator } from "@playwright/test";

/**
 * Clicks on the first event link on the page.
 * This function works with both EventCard and EventListItem components.
 */
export async function clickFirstEvent(page: Page): Promise<void> {
  await page.locator("a[href^='/event/']").first().click();
}

/**
 * Returns a locator for all event links on the page.
 * This function works with both EventCard and EventListItem components.
 */
export function getEventCards(page: Page): Locator {
  return page.locator("a[href^='/event/']");
}
