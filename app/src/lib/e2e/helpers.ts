import type { Page, Locator } from "@playwright/test";

/**
 * Clicks on the first event link on the page.
 * This function works with both EventCard and EventListItem components.
 * @returns {Promise<boolean>} - Returns true if an event was clicked, false if no events were found
 */
export async function clickFirstEvent(page: Page): Promise<boolean> {
  const eventLinks = page.locator("a[href^='/event/']");
  const count = await eventLinks.count();

  if (count === 0) {
    console.log("No events found on the page to click");
    return false;
  }

  await eventLinks.first().click();
  return true;
}

/**
 * Returns a locator for all event links on the page.
 * This function works with both EventCard and EventListItem components.
 */
export function getEventCards(page: Page): Locator {
  return page.locator("a[href^='/event/']");
}
