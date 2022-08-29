import type { StoredTab } from './store'
import { Log } from './log';

const log = new Log('converters');

export const tabToStoredTab = (tab: chrome.tabs.Tab | null): StoredTab  => {
  if (!tab) {
    console.log(new Error().stack)
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

export const cancelingReqIntIdToUiId = (intId: number): string => {
  if (String(intId).length !== 8) {
    throw Error('id must be 8 symbols');
  }
  return `id${intId}`;
}

export const cancelingReqUiIdToIntId = (uiId: string): number => {
  const intId = uiId.replace('id', '');
  if (intId.length !== 8) {
    throw Error('id must be 8 symbols');
  }
  return Number(intId);
}
