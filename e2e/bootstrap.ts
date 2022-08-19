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

  const page = (await browser.pages())[0];
  await page.goto('chrome://extensions/', { waitUntil: 'load' });

  return {
    browser,
    page
  };
};
