const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
  const browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 1100, deviceScaleFactor: 2 });
  const url = 'file://' + path.resolve(__dirname, '/tmp/leaseiq-dist/index.html');
  // Vite uses absolute paths in /tmp/leaseiq-dist/index.html; rewrite to relative for file://
  await page.goto(url, { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 800));
  await page.screenshot({ path: '/tmp/intake.png', fullPage: false });

  await browser.close();
  console.log('done');
})();
