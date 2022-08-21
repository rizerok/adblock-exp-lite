import { querySelector } from '../modules/utils';
import * as store from '../modules/store';
import { Log } from '../modules/log';

const log = new Log('options');
log.log('Options');

const $sitesTextArea = querySelector<HTMLInputElement>('#removeFixedOverlaysTextarea');
const $removeFixedOverlaysCheckbox = querySelector<HTMLInputElement>('#removeFixedOverlaysCheckbox');

const main = async () => {
  const sitesForAccept = await store.getAcceptedSites();
  const alwaysAccept = await store.getEnabled();

  $sitesTextArea.value = sitesForAccept ? sitesForAccept.join('\n') : '';
  $removeFixedOverlaysCheckbox.checked = alwaysAccept;
};

main();




