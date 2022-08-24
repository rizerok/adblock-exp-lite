import { bootstrap, EXTENSION_ID } from './bootstrap';
import { Browser, Page } from 'puppeteer';
import { getElementsByText } from './utils';

const HTML_FILE = 'site-with-evil-reqs.html'

describe('canceling requests', () => {
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
  test('"Add canceling" button must add new canceling request block', async () => {
    await page.goto(`file://${__dirname}/example-html/${HTML_FILE}`, { waitUntil: 'load' });

    const optionsPage = await browser.newPage();
    await optionsPage.goto(`chrome-extension://${EXTENSION_ID}/options.html`, { waitUntil: 'load' });

    await optionsPage.click('#canceledRequestsAddButton');

    expect(!!await optionsPage.$('.action-group .canceledSitesUrl')).toBe(true);
    expect(!!await optionsPage.$('.action-group .canceledRequestsUrls')).toBe(true);
    expect(!!await optionsPage.$('.action-group .canceledRequestsEnable')).toBe(true);
    expect(!!(await getElementsByText(optionsPage, 'Delete', 'button'))[0]).toBe(true);
  });

  test('"Delete" button must delete canceling request block', async () => {
    await page.goto(`file://${__dirname}/example-html/${HTML_FILE}`, { waitUntil: 'load' });

    const optionsPage = await browser.newPage();
    await optionsPage.goto(`chrome-extension://${EXTENSION_ID}/options.html`, { waitUntil: 'load' });

    await optionsPage.click('#canceledRequestsAddButton');
    const $deleteButton = (await getElementsByText(optionsPage, 'Delete', 'button'))[0];
    await $deleteButton.click();

    expect(await optionsPage.$('.action-group .canceledSitesUrl')).toBe(null);
    expect(await optionsPage.$('.action-group .canceledRequestsUrls')).toBe(null);
    expect(await optionsPage.$('.action-group .canceledRequestsEnable')).toBe(null);
    expect((await getElementsByText(optionsPage, 'Delete', 'button'))[0]).toBe(undefined);
  });
});
