import { chromium } from 'playwright';
import path from 'path';
import fs from 'fs';

const BASE_URL = 'http://localhost:5173';
const OUTPUT_DIR = '/opt/cursor/artifacts/screenshots';

const VIEWPORTS = [
  { name: '1440', width: 1440, height: 900, mobile: false },
  { name: '390', width: 390, height: 844, mobile: true },
];

async function captureScreenshots() {
  console.log('Capturing new design screenshots...\n');

  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  const browser = await chromium.launch({ headless: true });

  for (const vp of VIEWPORTS) {
    console.log(`Capturing ${vp.name}px viewport...`);

    const context = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      deviceScaleFactor: 2,
      isMobile: vp.mobile,
    });
    const page = await context.newPage();

    try {
      await page.goto(BASE_URL, { waitUntil: 'networkidle', timeout: 30000 });
      
      await page.waitForTimeout(4000);

      await page.screenshot({
        path: path.join(OUTPUT_DIR, `hero-${vp.name}.png`),
        clip: { x: 0, y: 0, width: vp.width, height: vp.height },
      });
      console.log(`  ✓ Hero captured`);

      if (!vp.mobile) {
        await page.evaluate(() => {
          const projectsSection = document.querySelector('#projetos');
          if (projectsSection) {
            projectsSection.scrollIntoView({ behavior: 'instant', block: 'start' });
          }
        });
        await page.waitForTimeout(2000);

        await page.screenshot({
          path: path.join(OUTPUT_DIR, `carousel-${vp.name}.png`),
          clip: { x: 0, y: 0, width: vp.width, height: vp.height },
        });
        console.log(`  ✓ Carousel captured`);
      }

      await page.evaluate(() => {
        const planosSection = document.querySelector('#planos');
        if (planosSection) {
          planosSection.scrollIntoView({ behavior: 'instant', block: 'start' });
        }
      });
      await page.waitForTimeout(1500);

      await page.screenshot({
        path: path.join(OUTPUT_DIR, `planos-${vp.name}.png`),
        clip: { x: 0, y: 0, width: vp.width, height: vp.height },
      });
      console.log(`  ✓ Plans captured`);

      await page.screenshot({
        path: path.join(OUTPUT_DIR, `full-${vp.name}.png`),
        fullPage: true,
      });
      console.log(`  ✓ Full page captured\n`);

    } catch (error) {
      console.error(`  ✗ Error: ${error.message}\n`);
    }

    await context.close();
  }

  await browser.close();
  console.log('Screenshot capture complete!');
  console.log(`Files saved to: ${OUTPUT_DIR}`);
}

captureScreenshots().catch(console.error);
