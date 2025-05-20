/**
 * Lighthouse audit thresholds
 *
 * These thresholds define the minimum acceptable scores for each category.
 * Adjust these values based on your project's requirements.
 */
import type {Page} from "@playwright/test";
import type {playwrightLighthouseConfig} from "playwright-lighthouse";

export const thresholds = {
  // Performance score threshold (0-1)
  // Lowered for development environment
  performance: 0.9,  // Set to 0 to pass the test with any score

  // Accessibility score threshold (0-1)
  accessibility: 0.9,

  // Best practices score threshold (0-1)
  // Lowered for development environment
  'best-practices': 0.9,  // Set to 0 to pass the test with any score

  // SEO score threshold (0-1)
  seo: 0.9,

  // Progressive Web App score threshold (0-1)
  pwa: 0.5,
};

// You can also define specific metric thresholds if needed
export const metricThresholds = {
  // Time to first byte (in milliseconds)
  'server-response-time': 600,

  // First Contentful Paint (in milliseconds)
  'first-contentful-paint': 1800,

  // Largest Contentful Paint (in milliseconds)
  'largest-contentful-paint': 2500,

  // Time to Interactive (in milliseconds)
  interactive: 3800,

  // Total Blocking Time (in milliseconds)
  'total-blocking-time': 200,

  // Cumulative Layout Shift (unitless)
  'cumulative-layout-shift': 0.1,
};

export const createLighthouseConfig = (isMobile: boolean, pageName: string, page: Page): playwrightLighthouseConfig => ({
  page,
  thresholds: {...thresholds, ...metricThresholds},
  port: 9223,
  reports: {
    formats: {
      html: true,
      json: true,
    },
    name: isMobile ? `lighthouse-report-${pageName}-mobile` : `lighthouse-report-${pageName}`,
    directory: 'src/lib/e2e/test-results/lighthouse',
  },
  opts: {
    onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo', 'pwa'],
    disableStorageReset: true,
    disableFullPageScreenshot: true,
  },
  config: {
    extends: 'lighthouse:default',
    settings: {
      formFactor: isMobile ? 'mobile' : 'desktop',
      screenEmulation: isMobile ? {
        mobile: true,
        width: 412,
        height: 823,
        deviceScaleFactor: 2.6,
        disabled: false,
      } : {
        mobile: false,
        width: 1350,
        height: 940,
        deviceScaleFactor: 1,
        disabled: false,
      },
      throttling: {
        rttMs: isMobile ? 150 : 0,
        throughputKbps: isMobile ? 1600 : 0,
        cpuSlowdownMultiplier: isMobile ? 2 : 1,
        requestLatencyMs: 0,
        downloadThroughputKbps: isMobile ? 1600 : 0,
        uploadThroughputKbps: isMobile ? 750 : 0
      },
      throttlingMethod: isMobile ? 'simulate' : 'provided',
      skipAudits: [
        'uses-http2',
        'uses-long-cache-ttl',
        'uses-optimized-images',
        'uses-text-compression',
        'third-party-summary',
        'third-party-facades',
        'legacy-javascript',
        'render-blocking-resources'
      ],
      maxWaitForLoad: 60000,
      output: 'json' as const,
      onlyAudits: null,
      channel: 'devtools',
    },
  },
});
