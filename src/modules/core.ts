import RuleActionType = chrome.declarativeNetRequest.RuleActionType;
import { CanceledRequest } from './store';
import { Log } from './log';

const log = new Log('core');

export function removeAllFixedOverlays () {
  // browser context
  const $allFixedEls = document.querySelectorAll('[style*="fixed"]');
  $allFixedEls.forEach((el) => {
    el.parentElement?.removeChild(el);
  });
  console.log('removeAllFixedOverlays', $allFixedEls);
}

export async function acceptChromeRequestsRules (canceledReqs: CanceledRequest[]) {
  const oldRules = await chrome.declarativeNetRequest.getDynamicRules();
  log.log(' remove all old dynamic rules', oldRules);
  await chrome.declarativeNetRequest.updateDynamicRules({
    removeRuleIds: oldRules.map(or => or.id),
  });

  for (const cr of canceledReqs) {
    if (cr.enable) {
      const RULE: chrome.declarativeNetRequest.Rule = {
        id: cr.id,
        condition: {
          initiatorDomains: [cr.site],
          regexFilter: cr.reqs.join('|')
        },
        action: {
          type: RuleActionType.BLOCK,
        },
      };

      log.log('rule for add', RULE);

      await  chrome.declarativeNetRequest.updateDynamicRules({
        addRules: [RULE],
      });

      log.log('initialized rule', RULE);
    }
  }
}
