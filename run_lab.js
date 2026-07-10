import puppeteer from 'puppeteer';

(async () => {
    const browser = await puppeteer.launch({ headless: 'new' });
    try {
        const page = await browser.newPage();
        
        // Capture all console output from the page
        page.on('console', msg => console.log(`[BROWSER CONSOLE] ${msg.type()}: ${msg.text()}`));
            await page.evaluateOnNewDocument(() => {
            window.addEventListener('error', e => {
                if (e.error && e.error.stack) {
                    console.log('STACK_TRACE_START\n' + e.error.stack + '\nSTACK_TRACE_END');
                }
            });
            const originalConsoleError = console.error;
            console.error = function(...args) {
                if (args[0] && args[0].stack) {
                    console.log('STACK_TRACE_START\n' + args[0].stack + '\nSTACK_TRACE_END');
                } else if (args[1] && typeof args[1] === 'string' && args[1].includes('Error:')) {
                    console.log('STACK_TRACE_START\n' + args.join(' ') + '\nSTACK_TRACE_END');
                }
                originalConsoleError.apply(console, args);
            };
        });

        await page.goto('http://localhost:5174/lab', { waitUntil: 'networkidle2' });
        console.log('Navigated to /lab');

        // Fill in a port using Puppeteer's native type so React registers it
        const inputSelector = 'input[placeholder*="22, 80"]';
        await page.waitForSelector(inputSelector);
        await page.type(inputSelector, '80');
        await page.keyboard.press('Enter');
        
        // Wait for port tag to appear to ensure React updated state
        await page.waitForFunction(() => document.body.innerText.includes('80'));

        // Prevent native form submission navigation by changing to type="button"
        await page.evaluate(() => {
            const btn = document.querySelector('button[type="submit"]');
            if (btn) btn.setAttribute('type', 'button');
        });

        // Find the analyze button and click it natively
        const btns = await page.$$('button');
        for (let btn of btns) {
            const text = await page.evaluate(el => el.textContent, btn);
            if (text.includes('ANALYZE THREAT VECTOR')) {
                await btn.click();
                break;
            }
        }

        console.log('Clicked Analyze. Waiting 15 seconds...');
        await new Promise(r => setTimeout(r, 15000));
        
        const innerText = await page.evaluate(() => document.body.innerText);
        console.log('--- PAGE TEXT ---');
        console.log(innerText.substring(0, 500));
        console.log('-----------------');

        const rootHtml = await page.evaluate(() => document.body.innerHTML);
        if (rootHtml.includes('Something blocked the app from loading.')) {
            console.log('[ERROR BOUNDARY TRIGGERED]');
        } else if (rootHtml.includes('ANALYSIS ERROR')) {
            console.log('[ANALYSIS ERROR TRIGGERED]');
            // Extract the error message
            const errorMsg = await page.evaluate(() => {
                const els = Array.from(document.querySelectorAll('p'));
                const errorP = els.find(p => p.textContent.includes('ANALYSIS ERROR'));
                return errorP ? errorP.nextElementSibling.textContent : 'Unknown';
            });
            console.log('Error message:', errorMsg);
        } else {
            console.log('No errors found.');
        }
    } catch (e) {
        console.error('Test script error:', e);
    } finally {
        await browser.close();
    }
})();
