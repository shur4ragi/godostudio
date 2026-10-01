import { chromium } from 'playwright';
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const OUTPUT_DIR = path.join(process.cwd(), 'public', 'screenshots');

async function createPlaceholder() {
  console.log('Creating placeholder for Galvão Tattoo...');

  const browser = await chromium.launch({ headless: true });

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #1a1a1a 0%, #0d0d0d 100%);
          font-family: 'Segoe UI', sans-serif;
          color: white;
          text-align: center;
          padding: 40px;
        }
        .icon {
          font-size: 48px;
          margin-bottom: 20px;
          opacity: 0.8;
        }
        h1 {
          font-size: 28px;
          font-weight: 600;
          margin-bottom: 12px;
        }
        p {
          font-size: 16px;
          color: rgba(255,255,255,0.6);
        }
      </style>
    </head>
    <body>
      <div class="icon">🎨</div>
      <h1>Galvão Tattoo</h1>
      <p>Projeto em desenvolvimento</p>
    </body>
    </html>
  `;

  const desktopContext = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2,
  });
  const desktopPage = await desktopContext.newPage();
  await desktopPage.setContent(html);
  const desktopPng = path.join(OUTPUT_DIR, 'galvao-desktop.png');
  await desktopPage.screenshot({ path: desktopPng });
  await desktopContext.close();

  const mobileContext = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    isMobile: true,
  });
  const mobilePage = await mobileContext.newPage();
  await mobilePage.setContent(html);
  const mobilePng = path.join(OUTPUT_DIR, 'galvao-mobile.png');
  await mobilePage.screenshot({ path: mobilePng });
  await mobileContext.close();

  await browser.close();

  execSync(`cwebp -q 85 "${desktopPng}" -o "${path.join(OUTPUT_DIR, 'galvao-desktop.webp')}"`, { stdio: 'pipe' });
  execSync(`cwebp -q 85 "${mobilePng}" -o "${path.join(OUTPUT_DIR, 'galvao-mobile.webp')}"`, { stdio: 'pipe' });
  fs.unlinkSync(desktopPng);
  fs.unlinkSync(mobilePng);

  console.log('✓ Created Galvão Tattoo placeholder screenshots');
}

createPlaceholder().catch(console.error);
