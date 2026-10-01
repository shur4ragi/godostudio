import { chromium } from 'playwright';
import path from 'path';
import fs from 'fs';

const BASE_URL = 'http://localhost:5173';
const OUTPUT_DIR = path.join(process.cwd(), 'test-screenshots');

const VIEWPORTS = [
  { name: '320', width: 320, height: 568, mobile: true },
  { name: '360', width: 360, height: 640, mobile: true },
  { name: '390', width: 390, height: 844, mobile: true },
  { name: '768', width: 768, height: 1024, mobile: false },
  { name: '1024', width: 1024, height: 768, mobile: false },
  { name: '1440', width: 1440, height: 900, mobile: false },
];

async function testResponsiveness() {
  console.log('Testing responsiveness at multiple viewports...\n');

  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  const browser = await chromium.launch({ headless: true });
  let hasOverflow = false;

  for (const vp of VIEWPORTS) {
    console.log(`Testing ${vp.name}px viewport...`);

    const context = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      deviceScaleFactor: 2,
      isMobile: vp.mobile,
    });
    const page = await context.newPage();

    try {
      await page.goto(BASE_URL, { waitUntil: 'networkidle', timeout: 30000 });
      await page.waitForTimeout(1500);

      const overflow = await page.evaluate(() => {
        return document.documentElement.scrollWidth > document.documentElement.clientWidth;
      });

      if (overflow) {
        console.log(`  ⚠ Horizontal overflow detected at ${vp.name}px!`);
        hasOverflow = true;
      } else {
        console.log(`  ✓ No horizontal overflow`);
      }

      await page.screenshot({
        path: path.join(OUTPUT_DIR, `hero-${vp.name}.png`),
        clip: { x: 0, y: 0, width: vp.width, height: vp.height },
      });

      await page.screenshot({
        path: path.join(OUTPUT_DIR, `full-${vp.name}.png`),
        fullPage: true,
      });

      console.log(`  ✓ Screenshots saved\n`);
    } catch (error) {
      console.error(`  ✗ Error: ${error.message}\n`);
    }

    await context.close();
  }

  await browser.close();

  console.log('---');
  if (hasOverflow) {
    console.log('⚠ Some viewports have horizontal overflow issues!');
    process.exit(1);
  } else {
    console.log('✓ All viewports passed! No horizontal overflow detected.');
  }
}

testResponsiveness().catch(console.error);
