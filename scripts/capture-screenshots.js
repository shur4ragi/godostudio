import { chromium } from 'playwright';
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const SITES = [
  {
    id: 'fryda',
    url: 'https://fryda-cafe.vercel.app/',
    name: 'Fryda Café',
  },
  {
    id: 'leyas',
    url: 'https://leyas-cafe.vercel.app/',
    name: "Leya's Café",
  },
  {
    id: 'nanica',
    url: 'https://nanica-ten.vercel.app/',
    name: 'Nanica',
  },
];

const OUTPUT_DIR = path.join(process.cwd(), 'public', 'screenshots');

async function captureScreenshots() {
  console.log('Starting screenshot capture...\n');

  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  const browser = await chromium.launch({ headless: true });

  for (const site of SITES) {
    console.log(`Capturing ${site.name} (${site.url})...`);

    try {
      const desktopContext = await browser.newContext({
        viewport: { width: 1440, height: 900 },
        deviceScaleFactor: 2,
      });
      const desktopPage = await desktopContext.newPage();

      await desktopPage.goto(site.url, { waitUntil: 'networkidle', timeout: 30000 });
      await desktopPage.waitForTimeout(2000);

      const desktopPng = path.join(OUTPUT_DIR, `${site.id}-desktop.png`);
      await desktopPage.screenshot({
        path: desktopPng,
        clip: { x: 0, y: 0, width: 1440, height: 900 },
      });

      await desktopContext.close();

      const mobileContext = await browser.newContext({
        viewport: { width: 390, height: 844 },
        deviceScaleFactor: 2,
        isMobile: true,
      });
      const mobilePage = await mobileContext.newPage();

      await mobilePage.goto(site.url, { waitUntil: 'networkidle', timeout: 30000 });
      await mobilePage.waitForTimeout(2000);

      const mobilePng = path.join(OUTPUT_DIR, `${site.id}-mobile.png`);
      await mobilePage.screenshot({
        path: mobilePng,
        clip: { x: 0, y: 0, width: 390, height: 844 },
      });

      await mobileContext.close();

      const desktopWebp = path.join(OUTPUT_DIR, `${site.id}-desktop.webp`);
      const mobileWebp = path.join(OUTPUT_DIR, `${site.id}-mobile.webp`);

      try {
        execSync(`cwebp -q 85 "${desktopPng}" -o "${desktopWebp}"`, { stdio: 'pipe' });
        execSync(`cwebp -q 85 "${mobilePng}" -o "${mobileWebp}"`, { stdio: 'pipe' });

        fs.unlinkSync(desktopPng);
        fs.unlinkSync(mobilePng);
      } catch {
        console.log(`  Note: cwebp not available, keeping PNG files`);
        fs.renameSync(desktopPng, desktopWebp.replace('.webp', '.png'));
        fs.renameSync(mobilePng, mobileWebp.replace('.webp', '.png'));
      }

      console.log(`  ✓ Captured desktop and mobile screenshots\n`);
    } catch (error) {
      console.error(`  ✗ Failed to capture ${site.name}: ${error.message}\n`);
    }
  }

  await browser.close();
  console.log('Screenshot capture complete!');
}

captureScreenshots().catch(console.error);
