import * as puppeteer from 'puppeteer';

export const EXTENSION_PATH = './dist';
export const EXTENSION_ID =  'ikdpbmdgmoigpihmknlmnnbcajohappj'

export const bootstrap = async (appUr?: string) => {
  const browser = await puppeteer.launch({
    headless: false,
    devtools: true,
    args: [
      `--disable-extensions-except=${EXTENSION_PATH}`,
      `--load-extension=${EXTENSION_PATH}`,
    ],
  });

  // const appPage = await browser.newPage();
  // await appPage.goto(appUrl, { waitUntil: 'load' });
  const page = (await browser.pages())[0];
  await page.goto('chrome://extensions/', { waitUntil: 'load' });

  const targets = await browser.targets();

  // console.log('targets', targets)
  //
  // console.log('extensionTarget', targets.map(t => t.type()));
  //
  // const extBackgroundTarget = await browser.waitForTarget(t => t.type() === 'service_worker');
  // const extWorker = await extBackgroundTarget.worker();
  // console.log('extWorker', extWorker);

  return {
    browser,
    page
  };
};

// bootstrap('asdf');
