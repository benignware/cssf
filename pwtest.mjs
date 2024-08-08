import { chromium } from 'playwright';

console.log('PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH:', process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH);

(async () => {
  const browser = await chromium.launch({
    executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH
  });
  const page = await browser.newPage();
  await page.goto('https://example.com');
  console.log('Page title:', await page.title());
  await browser.close();
})();
