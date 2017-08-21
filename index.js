const puppeteer = require('puppeteer');
const $ = require('cheerio');
const fs = require('fs');
const os = require('os');
const credentials = require('./credentials');

(async () => {
  const browser = await puppeteer.launch({headless: false});
  const page = await browser.newPage();

  async function login() {
    await page.goto('http://www.providencepoweryoga.com/');
    await page.focus('[name="email"]');
    await page.type(credentials.email);
    await page.focus('[name="password"]');
    await page.type(credentials.password);
    await page.click('#login_submit');
    await page.waitFor('.myschedtable');
    return page.click('#client-account-past-visits');
  }

  async function scrapePage() {
    return page.evaluate(() => {
      return Array.from(document.querySelectorAll('.myaccount_row')).map(row => {
        let arrRow = Array.from(row.children);
        let split = arrRow[2].innerText.replace(/  +/g, ' ').replace(/\n\s*\n/g, '\n').split('\n');
        let name = split[0].trim();
        let location = split[1].indexOf('Annex') ? 'annex' : 'main';
        return {
          'date': new Date(arrRow[0].innerText).toString(),
          'location': location,
          'name': name,
          'teacher': arrRow[3].innerText,
          'time': arrRow[1].innerText,
        };
      });
    });
  }
  await login();
  let data = await scrapePage();
  fs.writeFileSync('./data', JSON.stringify(data, null, 2));
  // browser.close();
})();