const puppeteer = require('puppeteer');
const fs = require('fs');
const login = require('./login');
const sendFarmList = require('./sendFarmList');
const scanReports = require('./scanReports');

(async _ => {
    const browser = await puppeteer.launch({
        // headless: false,
        slowMo: 15,
        args: [
            '--no-sandbox',
        ],
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1920/2, height: 1080 });
    await page.setDefaultNavigationTimeout(5000);
    await page.setRequestInterception(true);
    
    page.on('request', req => {
        if(req.resourceType() === 'image' || req.resourceType() === 'stylesheet' || req.resourceType() === 'font') req.abort();
        else req.continue();
    });
    
    await login(page);
    await scanReports(page);
    await browser.close();
})();