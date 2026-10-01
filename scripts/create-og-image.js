import { chromium } from 'playwright';
import path from 'path';

const OUTPUT_DIR = path.join(process.cwd(), 'public');

async function createOGImage() {
  console.log('Creating OG image...');

  const browser = await chromium.launch({ headless: true });

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
          width: 1200px;
          height: 630px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #0a0a0b 0%, #121214 50%, #0d0d10 100%);
          font-family: 'Inter', sans-serif;
          color: white;
          text-align: center;
          padding: 60px;
          position: relative;
          overflow: hidden;
        }
        .glow {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 800px;
          height: 800px;
          background: radial-gradient(ellipse at center, rgba(99, 102, 241, 0.15) 0%, transparent 60%);
          pointer-events: none;
        }
        .content {
          position: relative;
          z-index: 1;
        }
        .logo {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 16px;
          margin-bottom: 40px;
        }
        .logo-icon {
          width: 64px;
          height: 64px;
          background: linear-gradient(135deg, #6366f1, #4f46e5);
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 32px;
          font-weight: 700;
        }
        .logo-text {
          font-size: 40px;
          font-weight: 700;
        }
        h1 {
          font-size: 56px;
          font-weight: 700;
          line-height: 1.2;
          margin-bottom: 24px;
          letter-spacing: -0.02em;
        }
        h1 span {
          background: linear-gradient(135deg, #6366f1, #818cf8);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        p {
          font-size: 24px;
          color: rgba(255,255,255,0.7);
          max-width: 700px;
        }
      </style>
    </head>
    <body>
      <div class="glow"></div>
      <div class="content">
        <div class="logo">
          <div class="logo-icon">G</div>
          <span class="logo-text">GodoStudio</span>
        </div>
        <h1>Seu negócio online.<br><span>Simples assim.</span></h1>
        <p>Sites profissionais para negócios locais em Taubaté.<br>A partir de R$ 100/mês.</p>
      </div>
    </body>
    </html>
  `;

  const context = await browser.newContext({
    viewport: { width: 1200, height: 630 },
    deviceScaleFactor: 2,
  });
  const page = await context.newPage();
  await page.setContent(html);
  await page.waitForTimeout(500);
  
  await page.screenshot({ 
    path: path.join(OUTPUT_DIR, 'og-image.png'),
    type: 'png'
  });

  await browser.close();
  console.log('✓ Created og-image.png');
}

createOGImage().catch(console.error);
