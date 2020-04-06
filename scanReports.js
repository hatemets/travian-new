const fs = require('fs');
const { base, months, minResources, maxTroops } = require('./config');

const date = new Date();
const filename = `Travian-${date.getHours()}.txt`;

module.exports = async page => {
    await fs.writeFile(filename, `Travian Spy reports @ ${date}\n\n`, err => {
        if (err) console.log(err);
    });
    await page.goto(`${base}/allianz.php?s=3&filter=16&own=1`, { waitUntil: 'domcontentloaded' });
    const total = await page.evaluate(_ => document.querySelector('tbody').childElementCount);
    let i = 1;
    for (i; i < total; i++) {
        console.log(`\nReport #${i}`);
        await page.goto(`${base}/allianz.php?s=3&filter=16&own=1`, { waitUntil: 'domcontentloaded' });
        await page.click(`#offs tr:nth-child(${i}) div > a`);
        await page.waitForSelector('.defender');

        const resources = await getResources(page);
        const { username, village } = await getUserInfo(page);
        const troops = await getTroops(page);

        if (typeof resources === 'number' && resources > minResources && troops < maxTroops) {
            console.log('Adding to file...');
            await fs.appendFile(filename, `Available resources: ${resources}\nUsername: ${username}\nVillage: ${village}\nTroops: ${troops}\n\n${'-'.repeat(15)}\n\n`, err => {
                if (err) console.log(err);
            });
        } else if (resources < minResources) console.log('Too few resources, skipping...');
        else if (troops > maxTroops) console.log('Too many troops, skipping...');
    };
    console.log('All done!');
};

const getResources = async page => {
    const scoutResources = await page.$('.r1');
    if (scoutResources) {
        availableResources = await page.evaluate(_ => {
            let total = 0;
            const resources = document.querySelectorAll('.resources .value');
            for (const resource of resources) {
                const amount = Number(resource.textContent);
                const hidden = Number(document.querySelector('.rArea').textContent);
                total += amount - hidden > 0 ? amount - hidden : 0;
            };
            if (total < 0) total = 0;
            return total;
        });
    } else availableResources = 'Resources were not spied';
    console.log(`Available resources: ${availableResources}`);
    return availableResources;
};

const getUserInfo = async page => {
    try {
        userInfo = await page.evaluate(_ => {
            const username = document.querySelector('.defender .player').textContent;
            const village = document.querySelector('#reportWrapper div.role.defender a.village').textContent;
            console.log(`Username: ${username}\nVillage: ${village}`);
            return { username, village };
        });
        return userInfo;
    } catch (err) {
        return {
            username: 'Deleted',
            village: 'Deleted'
        };
    };
};

const getTroops = async page => {
    const troops = await page.evaluate(_ => {
        const units = document.querySelectorAll('.defender tbody:nth-child(2) tr .unit');
        const existingUnits = Array.from(units).filter(unit => !unit.classList.contains('none'));
        const total = existingUnits.reduce((total, unit) => total + Number(unit.textContent), 0);
        return total;
    });
    console.log(`Total troops: ${troops}`);
    return troops;
};