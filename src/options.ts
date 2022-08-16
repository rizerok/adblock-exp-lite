import * as store from './modules/store';
import { Log } from './modules/log';

const log = new Log('options');
log.log('Options');

const $sitesTextArea = document.querySelector<HTMLInputElement>('#removeFixedOverlaysTextarea');
const $removeFixedOverlaysCheckbox = document.querySelector<HTMLInputElement>('#removeFixedOverlaysCheckbox');
const $acceptButton = document.querySelector('#accept');
if (!$sitesTextArea) {
  throw Error('$sitesTextArea must be exist');
}
if (!$removeFixedOverlaysCheckbox) {
  throw Error('$removeFixedOverlaysCheckbox must be exist');
}
if (!$acceptButton) {
  throw Error('$acceptButton must be exist');
}


const main = async () => {
  const sitesForAccept = await store.getAcceptedSites();
  const alwaysAccept = await store.getEnabled();

  $sitesTextArea.value = sitesForAccept ? sitesForAccept.join('\n') : '';
  $removeFixedOverlaysCheckbox.checked = alwaysAccept;
};

main();

$acceptButton.addEventListener('click', async () => {
  log.log('$acceptButton');

  const sitesForAccept = $sitesTextArea.value.split(/\s/g).filter(site => site);
  const alwaysAccept = $removeFixedOverlaysCheckbox.checked;
  log.log('sitesForAccept', sitesForAccept);
  log.log('alwaysAccept', alwaysAccept);
  await store.setAcceptedSites(sitesForAccept);
  await store.setEnabled(alwaysAccept);
});
