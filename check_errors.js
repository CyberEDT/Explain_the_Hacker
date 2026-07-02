import puppeteer from 'puppeteer';

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
                return await a.jsonValue();
            }));
            errors.push(`[CONSOLE ERROR] ${msg.text()} | Stack: ${args.join('\\n')}`);
        }
    });
    page.on('pageerror', error => {
        errors.push(`[PAGE ERROR] ${error.message}`);
    });

    console.log('Navigating to http://localhost:5173/lab ...');
    try {
        await page.goto('http://localhost:5173/lab', { waitUntil: 'networkidle2', timeout: 10000 });
        console.log('Page loaded. Waiting for 2 seconds to capture any async errors...');
        await new Promise(resolve => setTimeout(resolve, 2000));
    } catch (err) {
        console.error('Failed to navigate:', err.message);
    }

    if (errors.length > 0) {
        console.error('--- ERRORS FOUND ---');
        errors.forEach(e => console.error(e));
    } else {
        console.log('No console errors found!');
    }

    await browser.close();
})();
