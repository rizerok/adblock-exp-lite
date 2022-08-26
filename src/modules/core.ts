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
      if (cr.reqs.length) {
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
