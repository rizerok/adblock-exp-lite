import * as store from '../modules/store'
import { Log } from '../modules/log';
import { acceptChromeRequestsRules } from '../modules/core';

const log = new Log('bg-sw canceling-requests');

// LOADING FROM STORE
chrome.runtime.onInstalled.addListener(async () => {
  const canceledReqs = await store.getCanceledRequests();

  log.log('current dynamic rules', await chrome.declarativeNetRequest.getDynamicRules());

  await acceptChromeRequestsRules(canceledReqs);
});

if (process.env.NODE_ENV === 'development') {
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
}


