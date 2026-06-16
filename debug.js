import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('BROWSER CONSOLE:', msg.type(), msg.text()));
  page.on('pageerror', err => console.log('BROWSER PAGE ERROR:', err.toString()));
  page.on('requestfailed', req => console.log('BROWSER NETWORK ERROR:', req.url(), req.failure().errorText));

  console.log('Navigating to http://localhost:5174/tactics...');
  try {
    await page.goto('http://localhost:5174/tactics', { waitUntil: 'networkidle2', timeout: 10000 });
    console.log('Page loaded successfully.');
  } catch (e) {
    console.error('Failed to load page:', e);
  }
  
  await browser.close();
})();
