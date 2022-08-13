import * as core from './modules/core.js';
import * as store from './modules/store.js';
import * as utils from './modules/utils.js';
import * as config from './modules/config.js';
import * as converters from './modules/converters.js';
import { Log } from './modules/log.js';

const log = new Log('background-sw');

log.log('chrome', chrome);

chrome.runtime.onInstalled.addListener(async () => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  await store.setCurrentTab(converters.tabToStoredTab(tab));
});

const executeScriptOnActiveTab = (tabId) => {
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
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  const newStoredTab = converters.tabToStoredTab(tab);
  const oldStoredTab = await store.getCurrentTab();
  log.logCloneObject('oldStoredTab', oldStoredTab);
  // old tab
  if (checkChromeDomains(oldStoredTab) && await checkAcceptedSites(oldStoredTab)) {
    await executeScriptOnDeActiveTab();
  }
  log.log('tab', tab);
  // new tab [here sometimes we get a bug, why tab is null?]
  if (checkChromeDomains(newStoredTab) && await checkAcceptedSites(newStoredTab)) {
    await executeScriptOnActiveTab(newStoredTab.id);
  }
  log.logCloneObject(tab);
  await store.setCurrentTab(newStoredTab);
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
