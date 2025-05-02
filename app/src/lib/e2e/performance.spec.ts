import { test, expect } from "@playwright/test";
import { clickFirstEvent } from "./helpers";

test("home page loads within acceptable time", async ({ page }) => {
  // Start measuring performance
  const startTime = Date.now();

  // Navigate to the home page
  await page.goto("/");

  // Wait for the page to be fully loaded
  await page.waitForLoadState("networkidle");

  // Calculate load time
  const loadTime = Date.now() - startTime;

  // Check that the page loads within an acceptable time (e.g., 3 seconds)
  // Adjust this threshold based on your performance requirements
  expect(loadTime).toBeLessThan(3000);

  console.log(`Home page load time: ${loadTime}ms`);
});

test("event detail page loads within acceptable time", async ({ page }) => {
  // Navigate to the home page first
  await page.goto("/");

  // Start measuring performance
  const startTime = Date.now();

  // Click on the first event to navigate to the event detail page
  await clickFirstEvent(page);

  // Wait for the page to be fully loaded
  await page.waitForLoadState("networkidle");

  // Calculate load time
  const loadTime = Date.now() - startTime;

  // Check that the page loads within an acceptable time (e.g., 3 seconds)
  // Adjust this threshold based on your performance requirements
  expect(loadTime).toBeLessThan(3000);

  console.log(`Event detail page load time: ${loadTime}ms`);
});

test("privacy policy page loads within acceptable time", async ({ page }) => {
  // Start measuring performance
  const startTime = Date.now();

  // Navigate to the privacy policy page
  await page.goto("/personvern");

  // Wait for the page to be fully loaded
  await page.waitForLoadState("networkidle");

  // Calculate load time
  const loadTime = Date.now() - startTime;

  // Check that the page loads within an acceptable time (e.g., 2 seconds)
  // Adjust this threshold based on your performance requirements
  expect(loadTime).toBeLessThan(3000);

  console.log(`Privacy policy page load time: ${loadTime}ms`);
});

test("check Largest Contentful Paint (LCP) timing", async ({ page }) => {
  // Navigate to the home page
  await page.goto("/");

  // Measure LCP using Performance API
  const lcpTime = await page.evaluate<number>(() => {
    return new Promise((resolve) => {
      // Create a PerformanceObserver to observe LCP
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        // Get the latest LCP entry
        const lcpEntry = entries[entries.length - 1];
        resolve(lcpEntry.startTime);
      });

      // Start observing LCP
      observer.observe({ type: 'largest-contentful-paint', buffered: true });

      // Fallback in case LCP doesn't fire
      setTimeout(() => resolve(0), 5000);
    });
  });

  // Check that LCP is within an acceptable time (e.g., 2.5 seconds)
  // Google recommends LCP to be under 2.5 seconds for a good user experience
  expect(lcpTime).toBeLessThan(2500);

  console.log(`Largest Contentful Paint time: ${lcpTime}ms`);
});
