import { Log } from './log';
const log = new Log('store');

export interface StoredTab {
  id: number;
  title: string;
  url: string;
  pendingUrl: string | null;
}

export interface CanceledRequest {
  id: string;
  site: string;
  reqs: string[];
  enable: boolean;
}

interface Store {
  activeTab: StoredTab;
  intervalId: ReturnType<typeof setInterval>;
  acceptedSites: string[];
  enabled: boolean;
  canceledRequests: CanceledRequest[];
}

chrome.storage.onChanged.addListener((changes) => {
  log.log('changes', changes);
});

export const setCurrentTab = async (tab: Store['activeTab']) => {
  log.log('setCurrentTab', tab);
  await chrome.storage.sync.set({ activeTab: tab });
}

export const getCurrentTab = async (): Promise<Store['activeTab']> => (await chrome.storage.sync.get('activeTab')).activeTab;

export const setIntervalId = (intervalId: Store['intervalId']) => chrome.storage.sync.set({ intervalId });
export const getIntervalId = async (): Promise<Store['intervalId']> => (await chrome.storage.sync.get('intervalId')).intervalId;

export const setAcceptedSites = (acceptedSites: Store['acceptedSites']) => chrome.storage.sync.set({ acceptedSites });
export const getAcceptedSites = async (): Promise<Store['acceptedSites']> => (await chrome.storage.sync.get('acceptedSites')).acceptedSites;

export const setEnabled = (enabled: Store['enabled']) => chrome.storage.sync.set({ enabled });
export const getEnabled = async (): Promise<Store['enabled']> => (await chrome.storage.sync.get('enabled')).enabled!!;

export const setCanceledRequests = async (newCanceledRequest: Store['canceledRequests']) => {
  const canceledRequests = (await chrome.storage.sync.get('canceledRequests')).canceledRequests;
  if (canceledRequests) {
    canceledRequests.push(newCanceledRequest);
    await chrome.storage.sync.set({ canceledRequests });
  } else {
    await chrome.storage.sync.set({ canceledRequests: [newCanceledRequest] });
  }
}
export const getCanceledRequests = async (): Promise<Store['canceledRequests']> => {
  const canceledRequests = (await chrome.storage.sync.get('canceledRequests')).canceledRequests;
  if (!canceledRequests) {
    return [];
  }
  return canceledRequests;
};
