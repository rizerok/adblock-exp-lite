import { bootstrap, EXTENSION_ID } from './bootstrap';
import { Browser, Page } from 'puppeteer';

const HTML_FILE = 'site-with-overlay.html'

describe('remove overlay', () => {
  jest.setTimeout(60000);
  let browser: Browser;
  let page: Page;
  beforeEach(async () => {
    const res = await bootstrap();
    browser = res.browser;
    page = res.page;
  });
  afterEach(async () => {
    await browser.close();
  });
  test('remove overlay if options enable and url is suitable', async () => {
    await page.goto(`file://${__dirname}/example-html/${HTML_FILE}`, { waitUntil: 'load' });

    const optionsPage = await browser.newPage();
    await optionsPage.goto(`chrome-extension://${EXTENSION_ID}/options.html`, { waitUntil: 'load' });

    await optionsPage.click('#removeFixedOverlaysTextarea');
    const $textArea = await optionsPage.$('#removeFixedOverlaysTextarea');
    if ($textArea === null) {
      throw Error('text area not found');
    }
    await $textArea.type(HTML_FILE);

    await optionsPage.click('#removeFixedOverlaysCheckbox');
    await optionsPage.click('#accept');

    await (new Promise((res) => setTimeout(res, 1000)));
    await page.bringToFront();

    await page.waitForSelector('[style*="fixed"]', { hidden: true });

    expect(await page.$('[style*="fixed"]')).toBe(null);
  });

  test('should not remove overlay if options disable', async () => {
    await page.goto(`file://${__dirname}/example-html/${HTML_FILE}`, { waitUntil: 'load' });

    const optionsPage = await browser.newPage();
    await optionsPage.goto(`chrome-extension://${EXTENSION_ID}/options.html`, { waitUntil: 'load' });

    await optionsPage.click('#removeFixedOverlaysTextarea');
    const $textArea = await optionsPage.$('#removeFixedOverlaysTextarea');
    if ($textArea === null) {
      throw Error('text area not found');
    }
    await $textArea.type(HTML_FILE);

    await optionsPage.click('#accept');

    await (new Promise((res) => setTimeout(res, 1000)));
    await page.bringToFront();

    await (new Promise((res) => setTimeout(res, 3000)));

    expect(await page.$('[style*="fixed"]')).not.toBe(null);
  });

  test('should not remove overlay if url is not suitable', async () => {
    await page.goto(`file://${__dirname}/example-html/${HTML_FILE}`, { waitUntil: 'load' });

    const optionsPage = await browser.newPage();
    await optionsPage.goto(`chrome-extension://${EXTENSION_ID}/options.html`, { waitUntil: 'load' });

    await optionsPage.click('#removeFixedOverlaysTextarea');
    const $textArea = await optionsPage.$('#removeFixedOverlaysTextarea');
    if ($textArea === null) {
      throw Error('text area not found');
    }
    await $textArea.type('someurl');
    await optionsPage.click('#removeFixedOverlaysCheckbox');
    await optionsPage.click('#accept');

    await (new Promise((res) => setTimeout(res, 500)));
    await page.bringToFront();

    await (new Promise((res) => setTimeout(res, 3000)));

    expect(await page.$('[style*="fixed"]')).not.toBe(null);
  });

  test('check removing new overlay', async () => {
    // go to html for test
    await page.goto(`file://${__dirname}/example-html/${HTML_FILE}`, { waitUntil: 'load' });

    // open extension option page
    const optionsPage = await browser.newPage();
    await optionsPage.goto(`chrome-extension://${EXTENSION_ID}/options.html`, { waitUntil: 'load' });

    // options settings
    await optionsPage.click('#removeFixedOverlaysTextarea');
    const $textArea = await optionsPage.$('#removeFixedOverlaysTextarea');
    if ($textArea === null) {
      throw Error('text area not found');
    }
    await $textArea.type(HTML_FILE);

    await optionsPage.click('#removeFixedOverlaysCheckbox');
    await optionsPage.click('#accept');

    // wait for tab switch
    await (new Promise((res) => setTimeout(res, 500)));
    await page.bringToFront();

    // wait and check overlays deleting
    await page.waitForSelector('[style*="fixed"]', { hidden: true });
    expect(await page.$('[style*="fixed"]')).toBe(null);

    const addNewOverlay = () => {
      const div = document.createElement('div');
      div.setAttribute('style', 'fixed');
      document.body.appendChild(div);
    };

    // new overlay
    await page.evaluate(addNewOverlay);
    await (new Promise((res) => setTimeout(res, 1500)));
    expect(await page.$('[style*="fixed"]')).toBe(null);

    // new 3 overlays
    await page.evaluate(addNewOverlay);
    await page.evaluate(addNewOverlay);
    await page.evaluate(addNewOverlay);
    await (new Promise((res) => setTimeout(res, 1500)));
    expect(await page.$('[style*="fixed"]')).toBe(null);
  });

  test('check removing on new tab', async () => {
    // go to html for test
    await page.goto(`file://${__dirname}/example-html/${HTML_FILE}`, { waitUntil: 'load' });

    // open extension option page
    const optionsPage = await browser.newPage();
    await optionsPage.goto(`chrome-extension://${EXTENSION_ID}/options.html`, { waitUntil: 'load' });

    // options settings
    await optionsPage.click('#removeFixedOverlaysTextarea');
    const $textArea = await optionsPage.$('#removeFixedOverlaysTextarea');
    if ($textArea === null) {
      throw Error('text area not found');
    }
    await $textArea.type(HTML_FILE);

    await optionsPage.click('#removeFixedOverlaysCheckbox');
    await optionsPage.click('#accept');

    // wait for tab switch
    await (new Promise((res) => setTimeout(res, 1000)));
    await page.bringToFront();

    // wait and check overlays deleting
    await page.waitForSelector('[style*="fixed"]', { hidden: true });
    expect(await page.$('[style*="fixed"]')).toBe(null);

    // create tab2
    const page2 = await browser.newPage();
    // wait when new tab open (throttle in extension)
    await (new Promise((res) => setTimeout(res, 1000)));
    await page2.goto(`file://${__dirname}/example-html/${HTML_FILE}`, { waitUntil: 'load' });
    // wait and check overlays deleting on tab2
    await page2.waitForSelector('[style*="fixed"]', { hidden: true });
    expect(await page2.$('[style*="fixed"]')).toBe(null);

    // back on tab1
    await (new Promise((res) => setTimeout(res, 1000)));
    await page.bringToFront();
    // wait and check overlays deleting on tab2
    expect(await page.$('[style*="fixed"]')).toBe(null);
  });
});
