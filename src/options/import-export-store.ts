import { querySelector } from '../modules/utils';
import * as store from '../modules/store';

const $exportSettingsButton = querySelector('#exportSettings');
const $importSettingsButton = querySelector('#importSettings');
const $importSettingsInput = querySelector<HTMLInputElement>('#importSettingsInput');
$importSettingsInput.addEventListener("change", store.importSettings);
$exportSettingsButton.addEventListener('click', async () => {
  await store.exportSettings();
});
$importSettingsButton.addEventListener('click', async () => {
  $importSettingsInput.click();
});
