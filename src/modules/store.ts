import { Log } from './log.js';
const log = new Log('store');

export interface StoredTab {
  id: number;
  title: string;
  url: string;
  pendingUrl: string | null;
}

interface Store {
  activeTab: StoredTab;
  intervalId: number;
  acceptedSites: string[];
  enabled: boolean;
}

// const main = async () => {
//   const setResult = await chrome.storage.sync.set({ activeTab: null });
//   log.log('setResult', setResult);
//   const getResult = await chrome.storage.sync.get('activeTab');
//   log.log('getResult', getResult);
// };
//
// main();

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
export const getEnabled = async (): Promise<Store['enabled']> => (await chrome.storage.sync.get('enabled')).enabled;