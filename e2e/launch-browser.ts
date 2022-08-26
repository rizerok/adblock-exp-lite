import { bootstrap, EXTENSION_ID } from './bootstrap';
import { TargetInterceptor } from './utils/target-interceptor';
/* Script for test puppeteer cases */

const HTML_FILE = 'site-with-evil-reqs.html'

const main = async () => {
  const { browser, page } = await bootstrap();

  // // enable dev mode
  // const $devMode = await page.evaluate((extensionId) => {
  //   const el1 = document.querySelector(`extensions-manager`)?.shadowRoot;
  //   console.log('el1', el1);
  //   const el2 = el1?.querySelector('extensions-toolbar')?.shadowRoot;
  //   console.log('el2', el2);
  //   const el3 = el2?.querySelector('cr-toggle');
  //   // @ts-ignore
  //   el3?.click();
  //   console.log('el3', el3);
  //   return el3;
  // },EXTENSION_ID);
  //
  // // enable extension devTools
  // const $sw = await page.evaluate((extensionId) => {
  //   const el1 = document.querySelector(`extensions-manager`)?.shadowRoot;
  //   console.log('$sw1', el1);
  //   const el2 = el1?.querySelector('extensions-item-list')?.shadowRoot
  //   console.log('$sw2', el2);
  //   const el3 = el2?.querySelector(`#${extensionId}`)?.shadowRoot
  //   console.log('$sw3', el3);
  //   const el4 = el3?.querySelector('[title="service worker"]');
  //   console.log('$sw4', el4);
  //   // @ts-ignore
  //   el4.click();
  //   return el4;
  // },EXTENSION_ID);

  await page.close();

  // const optionsPage = await browser.newPage();
  // await optionsPage.goto(`chrome-extension://${EXTENSION_ID}/options.html`, { waitUntil: 'load' });
  //
  // await optionsPage?.click('#canceledRequestsAddButton');
  //
  // const $canceledSitesUrlInput =  await optionsPage.$('.action-group .canceledSitesUrl')
  // await $canceledSitesUrlInput?.type('');
  //
  // const $canceledRequestsUrlsTextarea =  await optionsPage.$('.action-group .canceledRequestsUrls')
  // await $canceledRequestsUrlsTextarea?.type(`example.json`);
  //
  // const $canceledRequestsEnableCheckbox =  await optionsPage.$('.action-group .canceledRequestsEnable')
  // await $canceledRequestsEnableCheckbox?.click();
  //
  // const $acceptButton =  await optionsPage.$('#accept');
  // await $acceptButton?.click();

  const interceptor = new TargetInterceptor({
    browser,
    targetTypes: ['page'],
    resourceTypesExcludeFilter: ['Other']
  });
  interceptor.run();

  const newPage = await browser.newPage();
  await newPage.goto(`file://${__dirname}/example-html/${HTML_FILE}`, { waitUntil: 'load' });

  await (new Promise((res) => setTimeout(res, 3000)));

  await interceptor.waitLoadingReqs();

  console.log('aaa', interceptor.getAllReqs());

  // await page.goto(`file://${__dirname}/example-html/${HTML_FILE}`, { waitUntil: 'load' });

  // const optionsPage = await browser.newPage();
  // await optionsPage.goto(`chrome-extension://${EXTENSION_ID}/options.html`, { waitUntil: 'load' });
  //
  // await optionsPage.click('#removeFixedOverlaysTextarea');
  // const $textArea = await optionsPage.$('#removeFixedOverlaysTextarea');
  // if ($textArea === null) {
  //   throw Error('text area not found');
  // }
  // await $textArea.type('site-with-overlay.html');
  //
  // await optionsPage.click('#removeFixedOverlaysCheckbox');
  // await optionsPage.click('#accept');
  //
  // await (new Promise((res) => setTimeout(res, 1000)));
  // await page.bringToFront();
  //
  // await (new Promise((res) => setTimeout(res, 10000)));
  // const page2 = await browser.newPage();
  // await (new Promise((res) => setTimeout(res, 1000)));
  // await page2.goto(`file://${__dirname}/example-html/site-with-overlay.html`, { waitUntil: 'load' });
}

main();
