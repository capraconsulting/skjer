import { test, expect } from '@playwright/test';
import { AxeBuilder } from '@axe-core/playwright';
import fs from "fs";

/**
 * E2E tests for accessibility
 *
 * These tests verify that the website is accessible,
 * following WCAG 2.1 AA guidelines.
 */

test.describe('Accessibility Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the application before each test
    await page.goto('/');
  });

  test('home page should have no accessibility violations', async ({ page }) => {
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();

    fs.mkdirSync('src/lib/e2e/test-results/axe', { recursive: true });
    fs.writeFileSync(
      'src/lib/e2e/test-results/axe/axe-audit-results.json',
      JSON.stringify(accessibilityScanResults, null, 2)
    );

    expect(accessibilityScanResults.violations).toEqual([]);
  });

});
