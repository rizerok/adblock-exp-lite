// const store = {
//   activeTab: null,
//   intervalId,
//   acceptedSites: [],
//   enabled: false
// };

const main = async () => {
  const setResult = await chrome.storage.sync.set({ activeTab: null });
  console.log('setResult', setResult);
  const getResult = await chrome.storage.sync.get('activeTab');
  console.log('getResult', getResult);
};

main();

export const setCurrentTab = async (tab) => {
  console.log('setCurrentTab', tab);
  await chrome.storage.sync.set({ activeTab: {
      id: tab.id,
      title: tab.title,
      url: tab.url,
      pendingUrl: tab.pendingUrl
    }
  });
};

export const getCurrentTab = async () => (await chrome.storage.sync.get('activeTab')).activeTab;

export const setIntervalId = (intervalId) => chrome.storage.sync.set({ intervalId });
export const getIntervalId = async () => (await chrome.storage.sync.get('intervalId')).intervalId;

export const setAcceptedSites = (acceptedSites) => chrome.storage.sync.set({ acceptedSites });
export const getAcceptedSites = async () => (await chrome.storage.sync.get('acceptedSites')).acceptedSites;

export const setEnabled = (enabled) => chrome.storage.sync.set({ enabled });
export const getEnabled = async () => (await chrome.storage.sync.get('enabled')).enabled;
