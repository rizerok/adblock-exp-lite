import { bootstrap, EXTENSION_ID } from './bootstrap';
import { Browser, Page } from 'puppeteer';
import { getElementsByText } from './utils/utils';
import { TargetInterceptor } from './utils/target-interceptor';

const HTML_FILE = 'site-with-evil-reqs.html'
const waitRequestsDelay = 2000;

describe('canceling requests', () => {
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
  test('"Add canceling" button must add new canceling request block', async () => {
    const optionsPage = await browser.newPage();
    await optionsPage.goto(`chrome-extension://${EXTENSION_ID}/options.html`, { waitUntil: 'load' });

    await optionsPage.click('#canceledRequestsAddButton');

    expect(!!await optionsPage.$('.action-group .canceledSitesUrl')).toBe(true);
    expect(!!await optionsPage.$('.action-group .canceledRequestsUrls')).toBe(true);
    expect(!!await optionsPage.$('.action-group .canceledRequestsEnable')).toBe(true);
    expect(!!(await getElementsByText(optionsPage, 'Delete', 'button'))[0]).toBe(true);
  });

  test('"Delete" button must delete canceling request block', async () => {
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

  test('check what all requests is available', async () => {
    const interceptor = new TargetInterceptor({
      browser, targetTypes: ['page'], resourceTypesExcludeFilter: ['Other']
    });
    interceptor.run();

    const newPage = await browser.newPage();
    await newPage.goto(`file://${__dirname}/example-html/${HTML_FILE}`, { waitUntil: 'load' });

    await (new Promise((res) => setTimeout(res, waitRequestsDelay)));

    await interceptor.waitLoadingReqs();
    expect(interceptor.getAllReqs().length).toBe(2);
    expect(!!interceptor.getAllReqs().find(r => r.url === 'http://example.com/example.json')).toBe(true);
  });

  test('check request is cancel', async () => {
    await page.close();

    const optionsPage = await browser.newPage();
    await optionsPage.goto(`chrome-extension://${EXTENSION_ID}/options.html`, { waitUntil: 'load' });

    await optionsPage?.click('#canceledRequestsAddButton');

    const $canceledRequestsUrlsTextarea =  await optionsPage.$('.action-group .canceledRequestsUrls')
    await $canceledRequestsUrlsTextarea?.type(`example.json`);

    const $canceledRequestsEnableCheckbox =  await optionsPage.$('.action-group .canceledRequestsEnable')
    await $canceledRequestsEnableCheckbox?.click();

    const $acceptButton =  await optionsPage.$('#accept');
    await $acceptButton?.click();
    await (new Promise((res) => setTimeout(res, waitRequestsDelay)));

    const interceptor = new TargetInterceptor({
      browser, targetTypes: ['page'], resourceTypesExcludeFilter: ['Other']
    });
    interceptor.run();
    const newPage = await browser.newPage();
    await newPage.goto(`file://${__dirname}/example-html/${HTML_FILE}`, { waitUntil: 'load' });

    await (new Promise((res) => setTimeout(res, waitRequestsDelay)));

    await interceptor.waitLoadingReqs();

    expect(interceptor.getAllReqs().find(r => r.url === 'http://example.com/example.json')).toBe(undefined);
  });

  test('if "canceled requests urls" textarea is empty - all request must be blocked', async () => {
    await page.close();

    const optionsPage = await browser.newPage();
    await optionsPage.goto(`chrome-extension://${EXTENSION_ID}/options.html`, { waitUntil: 'load' });

    await optionsPage?.click('#canceledRequestsAddButton');

    const $canceledRequestsUrlsTextarea =  await optionsPage.$('.action-group .canceledRequestsUrls')
    await $canceledRequestsUrlsTextarea?.type(``);

    const $canceledRequestsEnableCheckbox =  await optionsPage.$('.action-group .canceledRequestsEnable')
    await $canceledRequestsEnableCheckbox?.click();

    const $acceptButton =  await optionsPage.$('#accept');
    await $acceptButton?.click();

    const interceptor = new TargetInterceptor({
      browser, targetTypes: ['page'], resourceTypesExcludeFilter: ['Other']
    });
    interceptor.run();
    const newPage = await browser.newPage();
    await newPage.goto(`file://${__dirname}/example-html/${HTML_FILE}`, { waitUntil: 'load' });

    await (new Promise((res) => setTimeout(res, waitRequestsDelay)));

    await interceptor.waitLoadingReqs();

    expect(interceptor.getAllReqs().length).toBe(1);
    expect(interceptor.getAllReqs().find(r => r.url === 'http://example.com/example.json')).toBe(undefined);
  });

  test('if "Enable" is not checked all request must be available', async () => {
    await page.close();

    const optionsPage = await browser.newPage();
    await optionsPage.goto(`chrome-extension://${EXTENSION_ID}/options.html`, { waitUntil: 'load' });

    await optionsPage?.click('#canceledRequestsAddButton');

    const $canceledRequestsUrlsTextarea =  await optionsPage.$('.action-group .canceledRequestsUrls')
    await $canceledRequestsUrlsTextarea?.type(`example.json`);

    const $acceptButton =  await optionsPage.$('#accept');
    await $acceptButton?.click();

    const interceptor = new TargetInterceptor({
      browser, targetTypes: ['page'], resourceTypesExcludeFilter: ['Other']
    });
    interceptor.run();

    const newPage = await browser.newPage();
    await newPage.goto(`file://${__dirname}/example-html/${HTML_FILE}`, { waitUntil: 'load' });

    await (new Promise((res) => setTimeout(res, waitRequestsDelay)));

    await interceptor.waitLoadingReqs();

    expect(interceptor.getAllReqs().length).toBe(2);
    expect(!!interceptor.getAllReqs().find(r => r.url === 'http://example.com/example.json')).toBe(true);
  });

  test('check with different urlFilter', async () => {
    await page.close();

    const optionsPage = await browser.newPage();
    await optionsPage.goto(`chrome-extension://${EXTENSION_ID}/options.html`, { waitUntil: 'load' });

    await optionsPage?.click('#canceledRequestsAddButton');

    const $canceledRequestsUrlsTextarea =  await optionsPage.$('.action-group .canceledRequestsUrls')
    if (!$canceledRequestsUrlsTextarea) {
      throw Error('$canceledRequestsUrlsTextarea not found');
    }
    await $canceledRequestsUrlsTextarea?.type(`example.json`);

    const $canceledRequestsEnableCheckbox =  await optionsPage.$('.action-group .canceledRequestsEnable')
    await $canceledRequestsEnableCheckbox?.click();

    const $acceptButton =  await optionsPage.$('#accept');
    await $acceptButton?.click();
    await (new Promise((res) => setTimeout(res, waitRequestsDelay)));

    const interceptor = new TargetInterceptor({
      browser, targetTypes: ['page'], resourceTypesExcludeFilter: ['Other']
    });
    interceptor.run();

    const newPage = await browser.newPage();
    await newPage.goto(`file://${__dirname}/example-html/${HTML_FILE}`, { waitUntil: 'load' });
    await (new Promise((res) => setTimeout(res, waitRequestsDelay)));
    await interceptor.waitLoadingReqs();

    expect(interceptor.getAllReqs().length).toBe(1);
    expect(interceptor.getAllReqs().find(r => r.url === 'http://example.com/example.json')).toBe(undefined);
    interceptor.clearRequests();

    optionsPage.evaluate((el) => { (el as HTMLInputElement).value = '' }, $canceledRequestsUrlsTextarea);
    await $canceledRequestsUrlsTextarea?.type(`.json`);
    await $acceptButton?.click();
    await (new Promise((res) => setTimeout(res, waitRequestsDelay)));
    await newPage.goto(`file://${__dirname}/example-html/${HTML_FILE}`, { waitUntil: 'load' });
    await (new Promise((res) => setTimeout(res, waitRequestsDelay)));
    await interceptor.waitLoadingReqs();

    expect(interceptor.getAllReqs().length).toBe(1);
    expect(interceptor.getAllReqs().find(r => r.url === 'http://example.com/example.json')).toBe(undefined);
    interceptor.clearRequests();

    optionsPage.evaluate((el) => { (el as HTMLInputElement).value = '' }, $canceledRequestsUrlsTextarea);
    await $acceptButton?.click();
    await (new Promise((res) => setTimeout(res, waitRequestsDelay)));

    await newPage.goto(`file://${__dirname}/example-html/${HTML_FILE}`, { waitUntil: 'load' });
    await (new Promise((res) => setTimeout(res, waitRequestsDelay)));
    await interceptor.waitLoadingReqs();

    expect(interceptor.getAllReqs().length).toBe(1);
    expect(interceptor.getAllReqs().find(r => r.url === 'http://example.com/example.json')).toBe(undefined);
    interceptor.clearRequests();

    const $deleteButton = (await getElementsByText(optionsPage, 'Delete', 'button'))[0];
    await $deleteButton.click();
    await $acceptButton?.click();
    await (new Promise((res) => setTimeout(res, waitRequestsDelay)));

    await newPage.goto(`file://${__dirname}/example-html/${HTML_FILE}`, { waitUntil: 'load' });
    await (new Promise((res) => setTimeout(res, waitRequestsDelay)));
    await interceptor.waitLoadingReqs();

    expect(interceptor.getAllReqs().length).toBe(2);
    expect(!!interceptor.getAllReqs().find(r => r.url === 'http://example.com/example.json')).toBe(true);
  });
});
