import * as core from './src/core.js';
import * as store from './src/store.js';
import * as utils from './src/utils.js';
import * as config from './src/config.js';

console.log('chrome', chrome);

chrome.runtime.onInstalled.addListener(async () => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  await store.setCurrentTab(tab);
});

const executeScriptOnActiveTab = (tabId) => {
  console.log('executeScriptOnActiveTab');
  const intervalId = setInterval(() => {
    console.log('inside setInterval');
    chrome.scripting.executeScript({
      target: { tabId },
      function: core.removeAllFixedOverlays,
    });
  }, config.executionScriptIntervalTime);
  store.setIntervalId(intervalId);
  console.log('+intervalId', intervalId);
};
const executeScriptOnDeActiveTab = async () => {
  console.log('executeScriptOnDeActiveTab');
  const intervalId = await store.getIntervalId();
  console.log('-intervalId', intervalId);
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
  console.log('updateTabLifecycle');
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  const storeActiveTab = await store.getCurrentTab();
  console.log('storeActiveTab', utils.logCloneObject(storeActiveTab));
  // // old tab
  if (checkChromeDomains(storeActiveTab) && await checkAcceptedSites(storeActiveTab)) {
    await executeScriptOnDeActiveTab();
  }
  // // new tab
  if (checkChromeDomains(tab) && await checkAcceptedSites(tab)) {
    await executeScriptOnActiveTab(tab.id);
  }
  console.log('updateTabLifecycle tab', utils.logCloneObject(tab));
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
  console.log('onCreatedTab');
});
chrome.tabs.onUpdated.addListener(async () => {
  // RELOAD
  console.log('onUpdatedTab');
  if (await store.getEnabled()) {
    await throttledUpdateLifeCycle();
  }
});
