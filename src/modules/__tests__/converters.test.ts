import { tabToStoredTab } from '../converters';

const defaultTabMock: chrome.tabs.Tab = {
  active: true,
  audible: false,
  autoDiscardable: true,
  discarded: false,
  favIconUrl: "https://github.githubassets.com/favicons/favicon-dark.svg",
  groupId: -1,
  height: 971,
  highlighted: true,
  id: 5035,
  incognito: false,
  index: 18,
  mutedInfo: { muted: false },
  openerTabId: 4891,
  pinned: false,
  selected: true,
  status: 'complete',
  title: 'Test',
  url: 'https://github.com/rizerok/adblock-exp-lite',
  width: 1680,
  windowId: 3258,
}

describe('converters', () => {
  let tabMock: chrome.tabs.Tab;
  beforeEach(() => {
    tabMock = {...defaultTabMock};
  });
  test('must return StoredTab from chrome.tabs.Tab', () => {
    expect(tabToStoredTab(tabMock)).toEqual({
      id: 5035,
      title: 'Test',
      url: 'https://github.com/rizerok/adblock-exp-lite',
      pendingUrl: null
    });
  });
  test('must return StoredTab with pendingUrl equal null if pendingUrl is undefined', () => {
    expect(tabToStoredTab(tabMock)).toEqual({
      id: 5035,
      title: 'Test',
      url: 'https://github.com/rizerok/adblock-exp-lite',
      pendingUrl: null
    });
    tabMock.pendingUrl = 'pendingUrl';
    expect(tabToStoredTab(tabMock)).toEqual({
      id: 5035,
      title: 'Test',
      url: 'https://github.com/rizerok/adblock-exp-lite',
      pendingUrl: 'pendingUrl'
    });
  });
  test('must throw errors if not enough tab', () => {
    expect(() => tabToStoredTab(null)).toThrowError('tab must be exist');
  });
  test('must throw errors if not enough id', () => {
    tabMock.id = undefined;
    expect(() => tabToStoredTab(tabMock)).toThrowError('"id" must be exist');
  });
  test('must throw errors if not enough title', () => {
    tabMock.title = undefined;
    expect(() => tabToStoredTab(tabMock)).toThrowError('"title" must be exist');
  });
  test('must throw errors if not enough url', () => {
    tabMock.url = undefined;
    expect(() => tabToStoredTab(tabMock)).toThrowError('"url" must be exist');
  });
});


