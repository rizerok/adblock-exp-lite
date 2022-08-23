import * as store from '../modules/store'
import { Log } from '../modules/log';
import { acceptChromeRequestsRules } from '../modules/core';

const log = new Log('bg-sw canceling-requests');

// LOADING FROM STORE
chrome.runtime.onInstalled.addListener(async () => {
  const canceledReqs = await store.getCanceledRequests();

  console.log('getAvailableStaticRuleCount', await chrome.declarativeNetRequest.getAvailableStaticRuleCount());
  console.log('getDynamicRules', await chrome.declarativeNetRequest.getDynamicRules());
  console.log('getEnabledRulesets', await chrome.declarativeNetRequest.getEnabledRulesets());

  await acceptChromeRequestsRules(canceledReqs);
});

chrome.declarativeNetRequest.onRuleMatchedDebug.addListener((info) => {
  log.log('info', info);
})

chrome.webRequest.onBeforeRequest.addListener(
  function(details) {
    log.log('details', details);
    return {cancel: details.url.indexOf("://www.evil.com/") != -1};
  },
  { urls: ["<all_urls>"] },
  []
);
