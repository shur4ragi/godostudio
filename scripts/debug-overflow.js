import { chromium } from 'playwright';

const BASE_URL = 'http://localhost:5173';

async function debugOverflow() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true,
  });
  const page = await context.newPage();

  await page.goto(BASE_URL, { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(4000);

  const result = await page.evaluate(() => {
    const docWidth = document.documentElement.clientWidth;
    const scrollWidth = document.documentElement.scrollWidth;
    const overflow = scrollWidth > docWidth;
    
    const overflowingElements = [];
    
    document.querySelectorAll('*').forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.right > docWidth + 5 || rect.left < -5) {
        overflowingElements.push({
          tag: el.tagName,
          className: el.className,
          id: el.id,
          left: rect.left,
          right: rect.right,
          width: rect.width,
        });
      }
    });

    return {
      docWidth,
      scrollWidth,
      overflow,
      overflowingElements: overflowingElements.slice(0, 10),
    };
  });

  console.log('Document width:', result.docWidth);
  console.log('Scroll width:', result.scrollWidth);
  console.log('Has overflow:', result.overflow);
  console.log('Overflowing elements:', JSON.stringify(result.overflowingElements, null, 2));

  await browser.close();
}

debugOverflow().catch(console.error);
