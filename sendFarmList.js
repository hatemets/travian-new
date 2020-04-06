module.exports = async page => {
        await page.goto(`${base}build.php?newdid=1994&id=39&tt=99`, waitNav);
        await page.click('#raidListMarkAll421');
        // await page.click('') // SUBMIT
}