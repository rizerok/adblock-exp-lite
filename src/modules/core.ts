import RuleActionType = chrome.declarativeNetRequest.RuleActionType;
import { CanceledRequest, getIframeDeleteBlocks, StoredTab } from './store';
import { Log } from './log';
import * as store from './store';

const log = new Log('core');

export function removeAllFixedOverlays () {
  // browser context
  const $allFixedEls = document.querySelectorAll('[style*="fixed"]');
  $allFixedEls.forEach((el) => {
    el.parentElement?.removeChild(el);
  });
  console.log('removeAllFixedOverlays', $allFixedEls);
}

const checkAcceptedSites = async (url: string) => {
  const acceptedSites = await store.getAcceptedSites();
  return acceptedSites.some(sitesUrl => url.includes(sitesUrl));
};

export const removeFixedOverlays = async (tab: StoredTab) => {
  if ((await store.getEnabled()) && (await checkAcceptedSites(tab.url))) {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: removeAllFixedOverlays,
    });
  }
};

export async function acceptChromeRequestsRules (canceledReqs: CanceledRequest[]) {
  const oldRules = await chrome.declarativeNetRequest.getDynamicRules();
  log.log(' remove all old dynamic rules', oldRules);
  await chrome.declarativeNetRequest.updateDynamicRules({
    removeRuleIds: oldRules.map(or => or.id),
  });

  for (const cr of canceledReqs) {
    if (cr.enable) {
      const rule: chrome.declarativeNetRequest.Rule = {
        id: cr.id,
        condition: {},
        action: {
          type: RuleActionType.BLOCK,
        },
      };

      if (cr.site !== '') {
        rule.condition.initiatorDomains = [cr.site];
      }
      if (cr.reqs?.length) {
        rule.condition.regexFilter =  cr.reqs.join('|');
      }

      log.log('rule for add', rule);

      await  chrome.declarativeNetRequest.updateDynamicRules({
        addRules: [rule],
      });

      log.log('initialized rule', rule);
    }
  }
}

export function removeAllIframesBrowser (iframesSelectors: string[]) {
  // TODO refactor core
  // browser context
  const $allIframeEls = document.querySelectorAll(`iframe`);
  const $iframesForRemove = Array.from($allIframeEls).filter(el => iframesSelectors.find(iframeSelector => el.src.includes(iframeSelector)));
  console.log('removeAllIframesBrowser', $iframesForRemove);
  $iframesForRemove.forEach((el) => {
    el.parentElement?.removeChild(el);
  });
}

export async function removeAllIframes (tab: StoredTab) {
  const iframes = await store.getIframeDeleteBlocks();
  console.log('iframes', iframes);
  console.log('tab.url', tab.url);
  const currentIframeBlock = iframes.find(iframe => iframe.site && tab.url.includes(iframe.site));
  if (currentIframeBlock && currentIframeBlock.enable) {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: removeAllIframesBrowser,
      args: [currentIframeBlock.iframeUrls]
    });
  }
}

