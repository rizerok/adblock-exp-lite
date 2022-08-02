import * as store from './src/store.js';
console.log('Options');

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
  console.log('$acceptButton');
  const $sitesTextArea = document.querySelector('#removeFixedOverlaysTextarea');
  const $removeFixedOverlaysCheckbox = document.querySelector('#removeFixedOverlaysCheckbox');

  const sitesForAccept = $sitesTextArea.value.split(/\s/g).filter(site => site);
  const alwaysAccept = $removeFixedOverlaysCheckbox.checked;
  console.log('sitesForAccept', sitesForAccept);
  console.log('alwaysAccept', alwaysAccept);
  await store.setAcceptedSites(sitesForAccept);
  await store.setEnabled(alwaysAccept);
});
