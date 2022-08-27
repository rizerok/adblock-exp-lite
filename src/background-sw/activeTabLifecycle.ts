import { Log } from '../modules/log';
import * as store from '../modules/store';
import * as converters from '../modules/converters';
import * as config from '../modules/config';
import * as utils from '../modules/utils';
import { removeAllIframes, removeFixedOverlays } from '../modules/core';
import { StoredTab } from '../modules/store';
// remove fixed overlays
const log = new Log('active tab lifecycle');

chrome.runtime.onInstalled.addListener(async () => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  await store.setCurrentTab(converters.tabToStoredTab(tab));
});

const executeScriptOnActiveTab = (tab: StoredTab) => {
  log.log('executeScriptOnActiveTab');
  const intervalId = setInterval(() => {
    log.log('inside setInterval');
    removeFixedOverlays(tab);
    removeAllIframes(tab);
  }, config.executionScriptIntervalTime);
  store.setIntervalId(intervalId);
  log.log('+intervalId', intervalId);
};
const executeScriptOnDeActiveTab = async (tab: StoredTab) => {
  log.log('executeScriptOnDeActiveTab');
  const intervalId = await store.getIntervalId();
  log.log('-intervalId', intervalId);
  clearInterval(intervalId);
};

const checkChromeDomains = (url: string) => config.chromeDomains.every(chd => url.indexOf(chd) === -1);

const updateTabLifecycle = async () => {
  log.log('updateTabLifecycle');
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  log.log('tab', tab);
  // new tab [here sometimes we get a null, why tab is null?], just continue
  if (tab !== null) {
    const newStoredTab = converters.tabToStoredTab(tab);
    const oldStoredTab = await store.getCurrentTab();
    log.logCloneObject('oldStoredTab', oldStoredTab);
    // old tab
    if (checkChromeDomains(oldStoredTab.url)) {
      await executeScriptOnDeActiveTab(oldStoredTab);
    }
    log.log('tab', tab);
    if (checkChromeDomains(newStoredTab.url)) {
      await executeScriptOnActiveTab(newStoredTab);
    }
    log.logCloneObject(tab);
    await store.setCurrentTab(newStoredTab);
  }
}

// onUpdatedTab execute more than one time
const throttledUpdateLifeCycle = utils.throttle(updateTabLifecycle, config.throttledUpdateLifeCycleTime);

chrome.tabs.onActivated.addListener(async () => {
  await updateTabLifecycle();
});
chrome.tabs.onCreated.addListener(() => {
  log.log('onCreatedTab');
});
chrome.tabs.onUpdated.addListener(async () => {
  // RELOAD
  log.log('onUpdatedTab');
  if (await store.getEnabled()) {
    await throttledUpdateLifeCycle();
  }
});
