import { bootstrap, EXTENSION_ID } from './bootstrap';
import { Browser, Page } from 'puppeteer';
import { getElementsByText } from './utils/utils';

const HTML_FILE1 = 'site-with-iframe.html';
const HTML_FILE2 = 'site-with-iframe2.html';

describe('iframe-cleaner', () => {
  jest.setTimeout(70000);
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
  test('"Add Iframe cleaner" button must add new canceling request block', async () => {
    const optionsPage = await browser.newPage();
    await optionsPage.goto(`chrome-extension://${EXTENSION_ID}/options.html`, { waitUntil: 'load' });

    await optionsPage.click('#iframeCleanerAddButton');

    expect(!!await optionsPage.$('.action-group .iframesSitesUrl')).toBe(true);
    expect(!!await optionsPage.$('.action-group .iframesUrls')).toBe(true);
    expect(!!await optionsPage.$('.action-group .iframeCleanerEnable')).toBe(true);
    expect(!!(await getElementsByText(optionsPage, 'Delete', 'button'))[0]).toBe(true);
  });

  test('"Delete" button must delete iframe cleaner block', async () => {
    const optionsPage = await browser.newPage();
    await optionsPage.goto(`chrome-extension://${EXTENSION_ID}/options.html`, { waitUntil: 'load' });

    await optionsPage.click('#iframeCleanerAddButton');
    const $deleteButton = (await getElementsByText(optionsPage, 'Delete', 'button'))[0];
    await $deleteButton.click();

    expect(await optionsPage.$('.action-group .iframesSitesUrl')).toBe(null);
    expect(await optionsPage.$('.action-group .iframesUrls')).toBe(null);
    expect(await optionsPage.$('.action-group .iframeCleanerEnable')).toBe(null);
    expect((await getElementsByText(optionsPage, 'Delete', 'button'))[0]).toBe(undefined);
  });

  test('extension must remove all iframes', async () => {
    const optionsPage = await browser.newPage();
    await optionsPage.goto(`chrome-extension://${EXTENSION_ID}/options.html`, { waitUntil: 'load' });

    await optionsPage.click('#iframeCleanerAddButton');

    const $siteUrlInput = await optionsPage.$('#iframeCleaner .iframesSitesUrl');
    await $siteUrlInput?.type(`file://${__dirname}/example-html/${HTML_FILE1}`);

    const $iframeUrlsTextarea = await optionsPage.$('#iframeCleaner .iframesUrls');
    await $iframeUrlsTextarea?.type(`iframe1 iframe2`);

    await optionsPage.click('#iframeCleaner .iframeCleanerEnable');

    const $acceptButton = await optionsPage.$('#accept');
    await $acceptButton?.click();

    await page.goto(`file://${__dirname}/example-html/${HTML_FILE1}`);
    await page.bringToFront();
    await (new Promise((res) => setTimeout(res, 1500)));

    expect(await page.$('iframe')).toBe(null);
  });
  test('if "iframes urls" is empty should remove all iframes', async () => {
    const optionsPage = await browser.newPage();
    await optionsPage.goto(`chrome-extension://${EXTENSION_ID}/options.html`, { waitUntil: 'load' });

    await optionsPage.click('#iframeCleanerAddButton');

    const $siteUrlInput = await optionsPage.$('#iframeCleaner .iframesSitesUrl');
    await $siteUrlInput?.type(`file://${__dirname}/example-html/${HTML_FILE1}`);

    await optionsPage.click('#iframeCleaner .iframeCleanerEnable');

    const $acceptButton = await optionsPage.$('#accept');
    await $acceptButton?.click();

    await page.goto(`file://${__dirname}/example-html/${HTML_FILE1}`);
    await page.bringToFront();
    await (new Promise((res) => setTimeout(res, 1500)));

    expect((await page.$$('iframe')).length).toBe(2);
  });
  test('if site url is empty iframes not removed', async () => {
    const optionsPage = await browser.newPage();
    await optionsPage.goto(`chrome-extension://${EXTENSION_ID}/options.html`, { waitUntil: 'load' });

    await optionsPage.click('#iframeCleanerAddButton');

    const $iframeUrlsTextarea = await optionsPage.$('#iframeCleaner .iframesUrls');
    await $iframeUrlsTextarea?.type(`iframe1 iframe2`);

    await optionsPage.click('#iframeCleaner .iframeCleanerEnable');

    const $acceptButton = await optionsPage.$('#accept');
    await $acceptButton?.click();

    await page.goto(`file://${__dirname}/example-html/${HTML_FILE1}`);
    await page.bringToFront();
    await (new Promise((res) => setTimeout(res, 1500)));

    expect((await page.$$('iframe')).length).toBe(2);
  });
  test('check iframes removed if site url is suitable', async () => {
    const optionsPage = await browser.newPage();
    await optionsPage.goto(`chrome-extension://${EXTENSION_ID}/options.html`, { waitUntil: 'load' });

    await optionsPage.click('#iframeCleanerAddButton');

    const $siteUrlInput = await optionsPage.$('#iframeCleaner .iframesSitesUrl');
    await $siteUrlInput?.type(`file://${__dirname}/example-html/${HTML_FILE2}`);

    const $iframeUrlsTextarea = await optionsPage.$('#iframeCleaner .iframesUrls');
    await $iframeUrlsTextarea?.type(`iframe1 iframe2`);

    await optionsPage.click('#iframeCleaner .iframeCleanerEnable');

    const $acceptButton = await optionsPage.$('#accept');
    await $acceptButton?.click();

    await page.goto(`file://${__dirname}/example-html/${HTML_FILE1}`);
    await page.bringToFront();
    await (new Promise((res) => setTimeout(res, 1500)));

    const page2 = await browser.newPage();
    await page2.goto(`file://${__dirname}/example-html/${HTML_FILE2}`);
    await page.bringToFront();
    await page2.bringToFront();
    await (new Promise((res) => setTimeout(res, 1500)));

    expect((await page.$$('iframe')).length).toBe(2);
    expect((await page2.$$('iframe')).length).toBe(0);
  });
  test('check iframes removed if iframes urls is suitable', async () => {
    const optionsPage = await browser.newPage();
    await optionsPage.goto(`chrome-extension://${EXTENSION_ID}/options.html`, { waitUntil: 'load' });

    await optionsPage.click('#iframeCleanerAddButton');

    const $siteUrlInput = await optionsPage.$('#iframeCleaner .iframesSitesUrl');
    await $siteUrlInput?.type(`file://${__dirname}/example-html/${HTML_FILE1}`);

    const $iframeUrlsTextarea = await optionsPage.$('#iframeCleaner .iframesUrls');
    await $iframeUrlsTextarea?.type(`iframe1`);

    await optionsPage.click('#iframeCleaner .iframeCleanerEnable');

    const $acceptButton = await optionsPage.$('#accept');
    await $acceptButton?.click();

    await page.goto(`file://${__dirname}/example-html/${HTML_FILE1}`);
    await optionsPage.bringToFront();
    await page.bringToFront();
    await (new Promise((res) => setTimeout(res, 1500)));

    expect((await page.$$('iframe[src="iframe1"]')).length).toBe(0);
    expect((await page.$$('iframe[src="iframe2"]')).length).toBe(1);
  });
  test('iframe cleaner not removed iframes if not enabled', async () => {
    const optionsPage = await browser.newPage();
    await optionsPage.goto(`chrome-extension://${EXTENSION_ID}/options.html`, { waitUntil: 'load' });

    await optionsPage.click('#iframeCleanerAddButton');

    const $siteUrlInput = await optionsPage.$('#iframeCleaner .iframesSitesUrl');
    await $siteUrlInput?.type(`file://${__dirname}/example-html/${HTML_FILE1}`);

    const $iframeUrlsTextarea = await optionsPage.$('#iframeCleaner .iframesUrls');
    await $iframeUrlsTextarea?.type(`iframe1`);

    const $acceptButton = await optionsPage.$('#accept');
    await $acceptButton?.click();

    await page.goto(`file://${__dirname}/example-html/${HTML_FILE1}`);
    await page.bringToFront();
    await (new Promise((res) => setTimeout(res, 1500)));

    expect((await page.$$('iframe')).length).toBe(2);
  });
  test('if iframe cleaner block deleted, extension not removed iframes', async () => {
    const optionsPage = await browser.newPage();
    await optionsPage.goto(`chrome-extension://${EXTENSION_ID}/options.html`, { waitUntil: 'load' });

    await optionsPage.click('#iframeCleanerAddButton');

    const $siteUrlInput = await optionsPage.$('#iframeCleaner .iframesSitesUrl');
    await $siteUrlInput?.type(`file://${__dirname}/example-html/${HTML_FILE1}`);

    const $iframeUrlsTextarea = await optionsPage.$('#iframeCleaner .iframesUrls');
    await $iframeUrlsTextarea?.type(`iframe1 iframe2`);

    await optionsPage.click('#iframeCleaner .iframeCleanerEnable');

    const $acceptButton = await optionsPage.$('#accept');
    await $acceptButton?.click();

    const $deleteButton = (await getElementsByText(optionsPage, 'Delete', 'button'))[0];
    await $deleteButton.click();

    await $acceptButton?.click();

    await page.goto(`file://${__dirname}/example-html/${HTML_FILE1}`);
    await page.bringToFront();
    await (new Promise((res) => setTimeout(res, 1500)));

    expect((await page.$$('iframe')).length).toBe(2);
  });
});
