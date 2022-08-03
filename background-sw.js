import * as core from './src/core.js';
import * as store from './src/store.js';
import * as utils from './src/utils.js';
import * as config from './src/config.js';
import { Log } from './src/log.js';

const log = new Log('background-sw');

log.log('chrome', chrome);

chrome.runtime.onInstalled.addListener(async () => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  await store.setCurrentTab(tab);
});

const executeScriptOnActiveTab = (tabId) => {
  log.log('executeScriptOnActiveTab');
  const intervalId = setInterval(() => {
    log.log('inside setInterval');
    chrome.scripting.executeScript({
      target: { tabId },
      function: core.removeAllFixedOverlays,
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

const checkChromeDomains = ({ url, pendingUrl }) => {
  const checkedUrl = url || pendingUrl;
  return config.chromeDomains.every(chd => checkedUrl.indexOf(chd) === -1);
};

const checkAcceptedSites = async ({ url, pendingUrl }) => {
  const checkedUrl = url || pendingUrl;
  const acceptedSites = await store.getAcceptedSites();
  return acceptedSites.some(sitesUrl => checkedUrl.includes(sitesUrl));
};

const updateTabLifecycle = async () => {
  log.log('updateTabLifecycle');
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  const storeActiveTab = await store.getCurrentTab();
  log.logCloneObject('storeActiveTab', storeActiveTab);
  log.logCloneObject('enabled', await store.getEnabled());
  // // old tab
  if (checkChromeDomains(storeActiveTab) && await checkAcceptedSites(storeActiveTab)) {
    await executeScriptOnDeActiveTab();
  }
  // // new tab
  if (checkChromeDomains(tab) && await checkAcceptedSites(tab)) {
    await executeScriptOnActiveTab(tab.id);
  }
  log.logCloneObject(tab);
  await store.setCurrentTab(tab);
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
