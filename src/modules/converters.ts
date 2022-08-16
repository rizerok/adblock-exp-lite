import type { StoredTab } from './store'
import { Log } from './log';

const log = new Log('converters');

export const tabToStoredTab = (tab: chrome.tabs.Tab | null): StoredTab  => {
  if (!tab) {
    throw Error('tab must be exist');
  }

  const { id, title, url, pendingUrl = null } = tab;

  if (id === undefined) {
    log.logCloneObject(tab)
    throw Error('"id" must be exist');
  }

  if (title  === undefined) {
    log.logCloneObject(tab)
    throw Error('"title" must be exist');
  }

  if (url === undefined) {
    log.logCloneObject(tab)
    throw Error('"url" must be exist');
  }

  return {
    id,
    title,
    url,
    pendingUrl
  };
};
