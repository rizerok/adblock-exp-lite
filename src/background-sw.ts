import * as core from './modules/core';
import * as store from './modules/store';
import * as utils from './modules/utils';
import * as config from './modules/config';
import * as converters from './modules/converters';
import { Log } from './modules/log';

const log = new Log('background-sw');

log.log('chrome', chrome);

chrome.runtime.onInstalled.addListener(async () => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  await store.setCurrentTab(converters.tabToStoredTab(tab));
});

const executeScriptOnActiveTab = (tabId: number) => {
  log.log('executeScriptOnActiveTab');
  const intervalId = setInterval(() => {
    log.log('inside setInterval');
    chrome.scripting.executeScript({
      target: { tabId },
      func: core.removeAllFixedOverlays,
    });
  }, config.executionScriptIntervalTime);
  store.setIntervalId(intervalId);
  log.log('+intervalId', intervalId);
};
const executeScriptOnDeActiveTab = async () => {
  log.log('executeScriptOnDeActiveTab');
  const intervalId = await store.getIntervalId();
  log.log('-intervalId', intervalId);
  clearInterval(intervalId);
};

const checkChromeDomains = (url: string) => config.chromeDomains.every(chd => url.indexOf(chd) === -1);

const checkAcceptedSites = async (url: string) => {
  const acceptedSites = await store.getAcceptedSites();
  return acceptedSites.some(sitesUrl => url.includes(sitesUrl));
};

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
    if (checkChromeDomains(oldStoredTab.url) && await checkAcceptedSites(oldStoredTab.url)) {
      await executeScriptOnDeActiveTab();
    }
    log.log('tab', tab);
    if (checkChromeDomains(newStoredTab.url) && await checkAcceptedSites(newStoredTab.url)) {
      await executeScriptOnActiveTab(newStoredTab.id);
    }
    log.logCloneObject(tab);
    await store.setCurrentTab(newStoredTab);
  }
}

// onUpdatedTab execute more than one time
const throttledUpdateLifeCycle = utils.throttle(updateTabLifecycle, config.throttledUpdateLifeCycleTime);

chrome.tabs.onActivated.addListener(async () => {
  if (await store.getEnabled()) {
    await updateTabLifecycle();
  }
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
