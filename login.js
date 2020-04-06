const { base } = require('./config');

module.exports = async page => {
    console.log('Logging in...');
    const waitNav = page.waitForNavigation({ waitUntil: 'domcontentloaded' });
    await page.goto(`${base}login.php`, waitNav);

    await page.type('input[name="name"]', 'ghost');
    await page.type('input[name="password"]', 'Minni123');
    await page.click('#s1');
    
    console.log('Login successful\n');
};