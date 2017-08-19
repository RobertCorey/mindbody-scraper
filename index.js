const puppeteer = require('puppeteer');

const credentials = {

};

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('http://www.providencepoweryoga.com/');
  await page.screenshot({path: 'example.png'});

  browser.close();
})();