import { Log } from './log';
const log = new Log('store');

export interface StoredTab {
  id: number;
  title: string;
  url: string;
  pendingUrl: string | null;
}

export interface CanceledRequest {
  id: number;
  site: string;
  reqs: string[];
  enable: boolean;
}

export interface IframeDeleteBlock {
  id: number;
  site: string;
  iframeUrls: string[];
  enable: boolean;
}

interface Store {
  activeTab: StoredTab;
  intervalId: ReturnType<typeof setInterval>;
  acceptedSites: string[];
  enabled: boolean;
  canceledRequests: CanceledRequest[];
  iframeDeleteBlocks: IframeDeleteBlock[];
}

const storeKeys: (keyof Store)[] = [
  'activeTab',
  'intervalId',
  'acceptedSites',
  'enabled',
  'canceledRequests',
  'iframeDeleteBlocks'
];

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
  await chrome.storage.sync.set({ canceledRequests: newCanceledRequest });
}
export const getCanceledRequests = async (): Promise<Store['canceledRequests']> => {
  const canceledRequests = (await chrome.storage.sync.get('canceledRequests')).canceledRequests;
  if (!canceledRequests) {
    return [];
  }
  return canceledRequests;
};

export const setIframeDeleteBlocks = async (newCanceledRequest: Store['iframeDeleteBlocks']) => {
  await chrome.storage.sync.set({ iframeDeleteBlocks: newCanceledRequest });
}
export const getIframeDeleteBlocks = async (): Promise<Store['iframeDeleteBlocks']> => {
  const iframeDeleteBlocks = (await chrome.storage.sync.get('iframeDeleteBlocks')).iframeDeleteBlocks;
  if (!iframeDeleteBlocks) {
    return [];
  }
  return iframeDeleteBlocks;
};

export const exportSettings = async () => {
  const json: Partial<Store> = {};
  for (const key of storeKeys) {
    if (!['activeTab', 'intervalId'].includes(key)) {
      json[key] = (await chrome.storage.sync.get(key))[key];
    }
  }
  const jsonString = JSON.stringify(json, null, 2);

  const a = document.createElement("a");
  const file = new Blob([jsonString], { type: 'text' });
  const url = URL.createObjectURL(file);
  a.href = url;
  a.download = 'addblock-exp-lite.settings.json';
  a.click();
  setTimeout(function() {
    window.URL.revokeObjectURL(url);
  }, 0);
}

function fileToString(file: File) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsText(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

const validateJSONSettings = (settings: any) => {
  for (const key in settings) {
    if (!storeKeys.includes(key as (keyof Store))) {
      return false;
    }
  }
  return true;
}

export async function importSettings(this: HTMLInputElement) {
  const fileList = this.files;
  if (fileList && fileList[0]) {
    const fileString = await fileToString(fileList[0]);
    if (typeof fileString === 'string') {
      const store = JSON.parse(fileString);
      if (validateJSONSettings(store)) {
        for (const key in store) {
          await chrome.storage.sync.set({ [key]: store[key] });
        }
        location.reload();
      } else {
        throw Error('incorrect settings file');
      }
    }
  }
}
