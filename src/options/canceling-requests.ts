import { querySelector, randomInt } from '../modules/utils';
import { Log } from '../modules/log';
import * as store from '../modules/store';
import { CanceledRequest } from '../modules/store';
import { cancelingReqIntIdToUiId } from '../modules/converters';

const log = new Log('canceling requests');

const $cancelRequest = querySelector('#cancelRequest');
const $addButton = querySelector('#canceledRequestsAddButton');
const $cancelRequestAction = querySelector('.action', $cancelRequest);

const addFilter = ({ site, reqs, enable, id }: CanceledRequest) => {
  const $actionGroup = document.createElement('div');
  $actionGroup.classList.add('action-group');
  $actionGroup.setAttribute('id', cancelingReqIntIdToUiId(id));

  const $actionBlocks = Array(4).fill(null).map(() => document.createElement('div'));
  $actionBlocks.forEach(($ab) => {
    $ab.classList.add('actionBlock');
  });
  // first block
  const $titleSiteUrl = document.createElement('p');
  $titleSiteUrl.classList.add('actionBlockTitle');
  $titleSiteUrl.textContent = 'site url';
  const $canceledSitesUrlInput = document.createElement('input');
  $canceledSitesUrlInput.classList.add('canceledSitesUrl');
  $canceledSitesUrlInput.value = site;

  $actionBlocks[0].appendChild($titleSiteUrl);
  $actionBlocks[0].appendChild($canceledSitesUrlInput);

  // second block
  const $canceledRequestUrls = document.createElement('p');
  $canceledRequestUrls.textContent = 'canceled requests urls';
  const $requestTextarea = document.createElement('textarea');
  $requestTextarea.classList.add('canceledRequestsUrls');
  $requestTextarea.value = reqs.join('\n');

  $actionBlocks[1].appendChild($canceledRequestUrls);
  $actionBlocks[1].appendChild($requestTextarea);

  // thirty block
  const $cancelRequestEnableLabel = document.createElement('label');
  $cancelRequestEnableLabel.textContent = 'Enable';
  const $canceledRequestsEnableCheckbox = document.createElement('input');
  $canceledRequestsEnableCheckbox.setAttribute('type', 'checkbox');
  $canceledRequestsEnableCheckbox.classList.add('canceledRequestsEnable');
  $canceledRequestsEnableCheckbox.checked = enable;

  $actionBlocks[2].appendChild($cancelRequestEnableLabel);
  $actionBlocks[2].appendChild($canceledRequestsEnableCheckbox);

  // delete button
  function deleteAction() {
    $actionGroup.parentNode?.removeChild($actionGroup);
  }
  const $deleteButton = document.createElement('button');
  $deleteButton.textContent = 'Delete';
  $deleteButton.addEventListener('click', deleteAction);
  $actionBlocks[3].appendChild($deleteButton);

  $actionBlocks.forEach(($ab) => {
    $actionGroup.appendChild($ab);
  });
  $cancelRequestAction.appendChild($actionGroup);
}

const drawFromStore = async () => {
  $addButton.addEventListener('click', () => addFilter({
    site: '',
    reqs: [],
    enable: false,
    id: randomInt(8)
  }));

  const canceledRequests = await store.getCanceledRequests();
  log.log('canceledRequests', canceledRequests);

  canceledRequests.forEach(addFilter);
};

drawFromStore();
