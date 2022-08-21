import { querySelector, getAttribute } from '../modules/utils';
import { Log } from '../modules/log';
import * as store from '../modules/store';

const log = new Log('options/accept');

const $acceptButton = querySelector('#accept');

const $sitesTextArea = querySelector<HTMLInputElement>('#removeFixedOverlaysTextarea');
const $removeFixedOverlaysCheckbox = querySelector<HTMLInputElement>('#removeFixedOverlaysCheckbox');
const $cancelRequest = querySelector('#cancelRequest');

$acceptButton.addEventListener('click', async () => {
  log.log('$acceptButton');

  const sitesForAccept = $sitesTextArea.value.split(/\s/g).filter(site => site);
  const alwaysAccept = $removeFixedOverlaysCheckbox.checked;
  log.log('sitesForAccept', sitesForAccept);
  log.log('alwaysAccept', alwaysAccept);
  await store.setAcceptedSites(sitesForAccept);
  await store.setEnabled(alwaysAccept);

  const $siteReqs = $cancelRequest.querySelectorAll('.action-group[id^="id"]');
  log.log('$siteReqs', $siteReqs);

  const canceledRequests = Array.from($siteReqs).map(req => {
    return {
      id: getAttribute('id', req),
      site: querySelector<HTMLInputElement>('.canceledSitesUrl', req).value,
      reqs: querySelector<HTMLInputElement>('.canceledRequestsUrls', req).value.split(/\s/g).filter(site => site),
      enable: querySelector<HTMLInputElement>('.canceledRequestsEnable', req).checked
    };
  });

  log.log('canceledRequests', canceledRequests);

  await store.setCanceledRequests(canceledRequests);
  log.log('Accepted!!!');
});
