import { test, expect } from "@playwright/test";

test("home page has proper SEO metadata", async ({ page }) => {
  // Navigate to the home page
  await page.goto("/");

  // Check that the page has a title
  await expect(page).toHaveTitle(/Skjer/);

  // Check that the page has a meta description
  const metaDescription = await page.locator("meta[name='description']").getAttribute("content");
  expect(metaDescription).toBeTruthy();
  expect(metaDescription.length).toBeGreaterThan(50); // Good descriptions are typically 50-160 characters

  // Check that the page has proper Open Graph tags
  await expect(page.locator("meta[property='og:title']")).toBeAttached();
  await expect(page.locator("meta[property='og:description']")).toBeAttached();
  await expect(page.locator("meta[property='og:image']")).toBeAttached();
  await expect(page.locator("meta[property='og:url']")).toBeAttached();

  // Check that the page has proper Twitter Card tags
  await expect(page.locator("meta[name='twitter:card']")).toBeAttached();

  // Check that the page has a canonical URL
  await expect(page.locator("link[rel='canonical']")).toBeAttached();
});

test("event detail page has proper SEO metadata", async ({ page }) => {
  // Navigate to the home page first
  await page.goto("/");

  // Click on the first event card to navigate to the event detail page
  await page.locator(".event-card, [data-testid='event-card']").first().click();

  // Check that the page has a title that includes the event name
  await expect(page).toHaveTitle(/./); // Any title is fine for now

  // Check that the page has a meta description
  const metaDescription = await page.locator("meta[name='description']").getAttribute("content");
  expect(metaDescription).toBeTruthy();
  expect(metaDescription.length).toBeGreaterThan(50);

  // Check that the page has proper Open Graph tags specific to the event
  await expect(page.locator("meta[property='og:title']")).toBeAttached();
  await expect(page.locator("meta[property='og:description']")).toBeAttached();
  await expect(page.locator("meta[property='og:image']")).toBeAttached();
  await expect(page.locator("meta[property='og:url']")).toBeAttached();

  // Check that the page has a canonical URL
  const canonicalUrl = await page.locator("link[rel='canonical']").getAttribute("href");
  expect(canonicalUrl).toContain("/event/");
});

test("privacy policy page has proper SEO metadata", async ({ page }) => {
  // Navigate to the privacy policy page
  await page.goto("/personvern");

  // Check that the page has a title related to privacy policy
  await expect(page).toHaveTitle(/Personvern|Privacy Policy/);

  // Check that the page has a meta description
  const metaDescription = await page.locator("meta[name='description']").getAttribute("content");
  expect(metaDescription).toBeTruthy();

  // Check that the page has a canonical URL
  const canonicalUrl = await page.locator("link[rel='canonical']").getAttribute("href");
  expect(canonicalUrl).toContain("/personvern");
});

test("pages have proper heading structure", async ({ page }) => {
  // Navigate to the home page
  await page.goto("/");

  // Check that the page has an h1 heading
  await expect(page.locator("h1")).toBeVisible();

  // Check that there's only one h1 heading (SEO best practice)
  const h1Count = await page.locator("h1").count();
  expect(h1Count).toBe(1);

  // Navigate to an event detail page
  await page.locator(".event-card, [data-testid='event-card']").first().click();

  // Check that the event detail page has an h1 heading
  await expect(page.locator("h1")).toBeVisible();

  // Check that there's only one h1 heading
  const eventH1Count = await page.locator("h1").count();
  expect(eventH1Count).toBe(1);
});

test("images have alt text", async ({ page }) => {
  // Navigate to the home page
  await page.goto("/");

  // Get all images
  const images = page.locator("img");
  const count = await images.count();

  // Check each image for alt text
  for (let i = 0; i < count; i++) {
    const alt = await images.nth(i).getAttribute("alt");
    expect(alt).toBeTruthy();
  }
});

test("links have descriptive text", async ({ page }) => {
  // Navigate to the home page
  await page.goto("/");

  // Get all links
  const links = page.locator("a");
  const count = await links.count();

  // Check each link for descriptive text
  for (let i = 0; i < count; i++) {
    const linkText = await links.nth(i).textContent();
    // Skip empty links (might be icon links) and links with just "Read more"
    if (linkText && linkText.trim() !== "" && !linkText.match(/^(Read more|Les mer)$/i)) {
      expect(linkText.trim().length).toBeGreaterThan(1);
    }
  }
});
