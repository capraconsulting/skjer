import {test, chromium} from '@playwright/test';
import {playAudit} from 'playwright-lighthouse';
import fs from 'fs';
import {createLighthouseConfig} from "./lighthouse-tests-utils";

test.describe('Lighthouse Tests', () => {
  test.beforeEach(({browserName}, testInfo) => {
    const projectName = testInfo.project.name;

    console.log(`\n🔍 Test: ${testInfo.title}`);
    console.log(`📱 Browser: ${browserName}, Project: ${projectName}`);

    if (browserName !== 'chromium' || projectName === 'mobile-chrome') {
      console.log('⏭️  Test skippet - Lighthouse støtter kun desktop Chromium\n');
      test.skip();
    } else {
      console.log('▶️  Kjører test\n');
    }
  });

  test('should pass Lighthouse audit', async ({}, testInfo) => {
    const projectName = testInfo.project.name;
    const isMobile = projectName === 'mobile-chrome';

    const browser = await chromium.launch({
      args: [
        '--remote-debugging-port=9223',
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--disable-gpu',
        '--headless=new',
        '--enable-logging',
        '--v=1'
      ],
      timeout: 60000
    });

    const context = await browser.newContext();
    const page = await context.newPage();

    try {
      await page.goto('http://localhost:5173/');
      await page.waitForLoadState('networkidle');
      await page.waitForLoadState('domcontentloaded');
      await page.waitForLoadState('load');
      await new Promise(resolve => setTimeout(resolve, 3000));

      const homePageResults = await playAudit(createLighthouseConfig(isMobile, 'home', page));
      fs.mkdirSync('src/lib/e2e/test-results/lighthouse', { recursive: true });
      fs.writeFileSync(
        'src/lib/e2e/test-results/lighthouse/home-audit-results.json',
        JSON.stringify(homePageResults, null, 2)
      );

    } catch (error) {
      console.error('Error running Lighthouse audit:', error);
      throw error;
    }

    await context.close();
    await browser.close();
  });
});
