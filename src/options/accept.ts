import { querySelector, getAttribute } from '../modules/utils';
import { Log } from '../modules/log';
import * as store from '../modules/store';
import { cancelingReqUiIdToIntId } from '../modules/converters';
import { acceptChromeRequestsRules } from '../modules/core';

const log = new Log('options/accept');

const $acceptButton = querySelector('#accept');

const $sitesTextArea = querySelector<HTMLInputElement>('#removeFixedOverlaysTextarea');
const $removeFixedOverlaysCheckbox = querySelector<HTMLInputElement>('#removeFixedOverlaysCheckbox');
const $cancelRequest = querySelector('#cancelRequest');
const $iframeCleaner = querySelector('#iframeCleaner');

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

  const $iframesForDelete = $iframeCleaner.querySelectorAll('.action-group[id^="id"]');
  log.log('$siteReqs', $siteReqs);

  const canceledRequests = Array.from($siteReqs).map(req => {
    return {
      id: cancelingReqUiIdToIntId(getAttribute('id', req)),
      site: querySelector<HTMLInputElement>('.canceledSitesUrl', req).value,
      reqs: querySelector<HTMLInputElement>('.canceledRequestsUrls', req).value.split(/\s/g).filter(site => site),
      enable: querySelector<HTMLInputElement>('.canceledRequestsEnable', req).checked
    };
  });

  const iframesForDelete = Array.from($iframesForDelete).map(iframe => {
    return {
      // TODO rename converter
      id: cancelingReqUiIdToIntId(getAttribute('id', iframe)),
      site: querySelector<HTMLInputElement>('.iframesSitesUrl', iframe).value,
      iframeUrls: querySelector<HTMLInputElement>('.iframesUrls', iframe).value.split(/\s/g).filter(site => site),
      enable: querySelector<HTMLInputElement>('.iframeCleanerEnable', iframe).checked
    };
  });

  log.log('canceledRequests', canceledRequests);
  log.log('iframesForDelete', iframesForDelete);

  await store.setCanceledRequests(canceledRequests);
  await acceptChromeRequestsRules(canceledRequests);
  await store.setIframeDeleteBlocks(iframesForDelete);
  log.log('Accepted!!!');
});
