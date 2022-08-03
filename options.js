import * as store from './src/store.js';
import { Log } from './src/log.js';

const log = new Log('options');
log.log('Options');

const $sitesTextArea = document.querySelector('#removeFixedOverlaysTextarea');
const $removeFixedOverlaysCheckbox = document.querySelector('#removeFixedOverlaysCheckbox');
const $acceptButton = document.querySelector('#accept');

const main = async () => {
  const sitesForAccept = await store.getAcceptedSites();
  const alwaysAccept = await store.getEnabled();

  $sitesTextArea.value = sitesForAccept ? sitesForAccept.join('\n') : '';
  $removeFixedOverlaysCheckbox.checked = !!alwaysAccept;
};

main();

$acceptButton.addEventListener('click', async () => {
  log.log('$acceptButton');
  const $sitesTextArea = document.querySelector('#removeFixedOverlaysTextarea');
  const $removeFixedOverlaysCheckbox = document.querySelector('#removeFixedOverlaysCheckbox');

  const sitesForAccept = $sitesTextArea.value.split(/\s/g).filter(site => site);
  const alwaysAccept = $removeFixedOverlaysCheckbox.checked;
  log.log('sitesForAccept', sitesForAccept);
  log.log('alwaysAccept', alwaysAccept);
  await store.setAcceptedSites(sitesForAccept);
  await store.setEnabled(alwaysAccept);
});
