import { bootstrap, EXTENSION_ID } from './bootstrap';
import { Browser, ElementHandle, Page } from 'puppeteer';

const EXAMPLE_JSON_FILE = 'addblock-exp-lite.settings.json';

describe('import/export settings', () => {
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
  test('should import settings', async () => {
    await page.close();

    const optionsPage = await browser.newPage();
    await optionsPage.goto(`chrome-extension://${EXTENSION_ID}/options.html`, { waitUntil: 'load' });
    await optionsPage.waitForSelector('input[type="file"]');
    const fileInput = await optionsPage.$('input[type="file"]') as ElementHandle<HTMLInputElement>;
    await fileInput.uploadFile(`${__dirname}/example-json/${EXAMPLE_JSON_FILE}`);

    await optionsPage.waitForSelector('.canceledSitesUrl', { visible: true });

    const removeFixedOverlaysTextareaValue = await optionsPage.evaluate((sel) => document.querySelector<HTMLInputElement>(sel)?.value, '#removeFixedOverlaysTextarea');
    const removeFixedOverlaysCheckboxValue = await optionsPage.evaluate((sel) => document.querySelector<HTMLInputElement>(sel)?.checked, '#removeFixedOverlaysCheckbox');

    const canceledSitesUrl1Value = await optionsPage.evaluate((sel) => document.querySelector<HTMLInputElement>(sel)?.value, '#id12207207 .canceledSitesUrl');
    const canceledRequestsUrls1Value = await optionsPage.evaluate((sel) => document.querySelector<HTMLInputElement>(sel)?.value, '#id12207207 .canceledRequestsUrls');
    const canceledRequestsEnable1Value = await optionsPage.evaluate((sel) => document.querySelector<HTMLInputElement>(sel)?.checked, '#id12207207 .canceledRequestsEnable');

    const canceledSitesUrl2Value = await optionsPage.evaluate((sel) => document.querySelector<HTMLInputElement>(sel)?.value, '#id17368420 .canceledSitesUrl');
    const canceledRequestsUrls2Value = await optionsPage.evaluate((sel) => document.querySelector<HTMLInputElement>(sel)?.value, '#id17368420 .canceledRequestsUrls');
    const canceledRequestsEnable2Value = await optionsPage.evaluate((sel) => document.querySelector<HTMLInputElement>(sel)?.checked, '#id17368420 .canceledRequestsEnable');

    const iframesSitesUrlValue = await optionsPage.evaluate((sel) => document.querySelector<HTMLInputElement>(sel)?.value, '#id18562044 .iframesSitesUrl');
    const iframesUrlsValue = await optionsPage.evaluate((sel) => document.querySelector<HTMLInputElement>(sel)?.value, '#id18562044 .iframesUrls');
    const iframeCleanerEnableValue = await optionsPage.evaluate((sel) => document.querySelector<HTMLInputElement>(sel)?.checked, '#id18562044 .iframeCleanerEnable');

    expect(removeFixedOverlaysTextareaValue).toBe('southpark.cc-fan.tv\nlordfilm');
    expect(removeFixedOverlaysCheckboxValue).toBe(true);

    expect(canceledSitesUrl1Value).toBe('southpark.cc-fan.tv');
    expect(canceledRequestsUrls1Value).toBe('vak345\nyandex\nyastatic.net\nacint.net\nsape.ru');
    expect(canceledRequestsEnable1Value).toBe(true);

    expect(canceledSitesUrl2Value).toBe('354so.filmly-hd.one');
    expect(canceledRequestsUrls2Value).toBe('azw.net\ngstatic\nyandex\njazw.net\nyadro.ru');
    expect(canceledRequestsEnable2Value).toBe(false);

    expect(iframesSitesUrlValue).toBe('site-with-iframe.html');
    expect(iframesUrlsValue).toBe('frame1');
    expect(iframeCleanerEnableValue).toBe(true);
  });

  xtest('should export settings', async () => {
    // TODO write
    await page.close();

    const optionsPage = await browser.newPage();
    await optionsPage.goto(`chrome-extension://${EXTENSION_ID}/options.html`, { waitUntil: 'load' });
    const cdpSession = await optionsPage.target().createCDPSession();
    await cdpSession.send('Page.setDownloadBehavior', {behavior: 'allow', downloadPath: `${__dirname}`});

    await optionsPage.click('#exportSettings');

    expect(true).toBe(true);
  });
});
