import puppeteer from 'puppeteer';

(async () => {
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();
    
    page.on('console', msg => console.log('CONSOLE:', msg.text()));
    page.on('response', resp => {
        if (resp.status() >= 400) {
            console.log(`HTTP ${resp.status()} for ${resp.url()}`);
        }
    });

    console.log('Going to /library');
    await page.goto('http://localhost:5173/library');
    
    console.log('Clicking KILL CHAIN');
    // Using evaluate to find and click the exact link
    await page.evaluate(() => {
        const links = Array.from(document.querySelectorAll('a'));
        const killChainLink = links.find(a => a.textContent.includes('KILL CHAIN'));
        if (killChainLink) {
            killChainLink.click();
        }
    });

    await new Promise(r => setTimeout(r, 2000));
    console.log('Current URL:', page.url());
    
    const rootHtml = await page.evaluate(() => document.body.innerHTML.substring(0, 200));
    console.log('HTML after click:', rootHtml);

    await browser.close();
})();
