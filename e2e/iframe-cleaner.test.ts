import { bootstrap, EXTENSION_ID } from './bootstrap';
import { Browser, Page } from 'puppeteer';
import { getElementsByText } from './utils/utils';

const HTML_FILE = 'site-with-iframe.html';

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
});
