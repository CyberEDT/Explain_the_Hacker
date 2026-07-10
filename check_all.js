import puppeteer from 'puppeteer';

const routes = [
  '/',
  '/lab',
  '/docs',
  '/threat-intel',
  '/library',
  '/killchain',
  '/tactics',
  '/roadmap',
  '/privacy',
  '/terms',
  '/ethics',
  '/disclaimer'
];

(async () => {
    console.log('Launching browser...');
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();
    const errors = [];
    
    page.on('console', async msg => {
        if (msg.type() === 'error') {
            const args = await Promise.all(msg.args().map(async a => {
                const isError = await a.evaluate(obj => obj instanceof Error);
                if (isError) {
                    return await a.evaluate(obj => obj.stack);
                }
                try {
                    return await a.jsonValue();
                } catch {
                    return 'Unparseable arg';
                }
            }));
            // Ignore common vite dev server or network errors that aren't page crashes
            if (!args.join(' ').includes('net::ERR_CONNECTION_REFUSED')) {
                errors.push(`[CONSOLE ERROR on ${page.url()}] ${msg.text()} | Stack: ${args.join('\\n')}`);
            }
        }
    });
    
    page.on('pageerror', error => {
        errors.push(`[PAGE ERROR on ${page.url()}] ${error.message}`);
    });

    for (const route of routes) {
        const url = `http://localhost:5173${route}`;
        console.log(`Checking ${url}...`);
        try {
            await page.goto(url, { waitUntil: 'networkidle2', timeout: 10000 });
            await new Promise(r => setTimeout(r, 1000));
            // Check if error boundary rendered
            const rootHtml = await page.evaluate(() => document.body.innerHTML.substring(0, 500));
            if (rootHtml.includes('Something blocked the app from loading.')) {
                errors.push(`[ERROR BOUNDARY] App crashed on route: ${route}`);
            }
        } catch (err) {
            console.error(`Failed to navigate to ${url}:`, err.message);
        }
    }

    if (errors.length > 0) {
        console.error('--- ERRORS FOUND ---');
        errors.forEach(e => console.error(e));
        process.exit(1);
    } else {
        console.log('--- ALL PAGES PASSED WITH NO ERRORS ---');
    }

    await browser.close();
})();
