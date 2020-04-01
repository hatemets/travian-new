const puppeteer = require('puppeteer-extra');

const base = 'https://tx3.baltics.travian.com/';

(async _ => {
    const browser = await puppeteer.launch({
        headless: false,
        slowMo: 15,
        args: [
            '--no-sandbox',
        ],
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1920/2, height: 1080 });
    const waitNav = page.waitForNavigation({ waitUntil: 'domcontentloaded' });
    

    await page.goto(`${base}login.php`, waitNav);
    await page.type('input[name="name"]', 'ghost');
    await page.type('input[name="password"]', 'Minni123');
    await page.click('#s1');
    await page.goto(`${base}build.php?newdid=1994&id=39&tt=99`, waitNav);
    await page.click('#raidListMarkAll421');
    // await page.click('')
})();