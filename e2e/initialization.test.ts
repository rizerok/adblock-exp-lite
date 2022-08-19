import { bootstrap, EXTENSION_ID } from './bootstrap';

describe('Initialization', () => {
  test('extension should be loaded', async () => {
    const { browser, page } = await bootstrap();
    await page.goto('chrome://extensions/', { waitUntil: 'load' });
    const name = await page.evaluate((extensionId) => document
      .querySelector(`extensions-manager`)?.shadowRoot
      ?.querySelector('extensions-item-list')?.shadowRoot
      ?.querySelector(`#${extensionId}`)?.shadowRoot
      ?.querySelector('#name')?.textContent,
      EXTENSION_ID);

    expect(name).toBe('adblock-exp-lite');
    await browser.close();
  });
});
