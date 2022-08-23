import ResourceType = chrome.declarativeNetRequest.ResourceType;
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

  // const RULE2: chrome.declarativeNetRequest.Rule = {
  //   id: getId(canceledReqs.id),
  //   condition: {
  //     initiatorDomains: ['southpark.cc-fan.tv'],
  //     // requestDomains: ['mc.yandex.ru'],
  //     // resourceTypes: [ResourceType.XMLHTTPREQUEST],
  //     regexFilter: 'yandex|acint.net|sape.ru|yadro.ru|vak345.com'
  //   },
  //   action: {
  //     type: RuleActionType.BLOCK,
  //   },
  // };

  // chrome.declarativeNetRequest.updateDynamicRules({
  //   removeRuleIds: [RULE2.id],
  //   addRules: [RULE2],
  // });
}
