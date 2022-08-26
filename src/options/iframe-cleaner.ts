import { CanceledRequest } from '../modules/store';
import { cancelingReqIntIdToUiId } from '../modules/converters';
import { querySelector, randomInt } from '../modules/utils';
import * as store from '../modules/store';

const $iframeCleaner = querySelector('#iframeCleaner');
const $addButton = querySelector('#iframeCleanerAddButton');
const $iframeCleanerActionGroups = querySelector('.action .groupsContainer', $iframeCleaner);

interface IframeBlock {
  site: string;
  iframeUrls: string[];
  enable: boolean;
  id: number;
}

const addFilter = ({ site, iframeUrls, enable, id }: IframeBlock) => {
  const $actionGroup = document.createElement('div');
  $actionGroup.classList.add('action-group');
  // $actionGroup.setAttribute('id', cancelingReqIntIdToUiId(id));

  const $actionBlocks = Array(4).fill(null).map(() => document.createElement('div'));
  $actionBlocks.forEach(($ab) => {
    $ab.classList.add('actionBlock');
  });
  // first block
  const $titleSiteUrl = document.createElement('p');
  $titleSiteUrl.classList.add('actionBlockTitle');
  $titleSiteUrl.textContent = 'site url';
  const $canceledSitesUrlInput = document.createElement('input');
  $canceledSitesUrlInput.classList.add('iframesSitesUrl');
  $canceledSitesUrlInput.value = site;

  $actionBlocks[0].appendChild($titleSiteUrl);
  $actionBlocks[0].appendChild($canceledSitesUrlInput);

  // second block
  const $canceledRequestUrls = document.createElement('p');
  $canceledRequestUrls.textContent = 'iframes urls';
  const $requestTextarea = document.createElement('textarea');
  $requestTextarea.classList.add('iframesUrls');
  $requestTextarea.value = iframeUrls.join('\n');

  $actionBlocks[1].appendChild($canceledRequestUrls);
  $actionBlocks[1].appendChild($requestTextarea);

  // thirty block
  const $cancelRequestEnableLabel = document.createElement('label');
  $cancelRequestEnableLabel.textContent = 'Enable';
  const $canceledRequestsEnableCheckbox = document.createElement('input');
  $canceledRequestsEnableCheckbox.setAttribute('type', 'checkbox');
  $canceledRequestsEnableCheckbox.classList.add('iframeCleanerEnable');
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
  $iframeCleanerActionGroups.appendChild($actionGroup);
}

const drawFromStore = async () => {
  $addButton.addEventListener('click', () => addFilter({
    site: '',
    iframeUrls: [],
    enable: false,
    id: randomInt(8)
  }));

  // const canceledRequests = await store.getCanceledRequests();
  // log.log('canceledRequests', canceledRequests);
  //
  // canceledRequests.forEach(addFilter);
};

drawFromStore();
