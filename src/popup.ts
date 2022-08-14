import * as core from './modules/core.js';
// popup logic
const $button = document.getElementById('removeAllFixedOverlays');

if (!$button) {
  throw Error('$button must be exist');
}

$button.addEventListener("click", async () => {
  // current tab
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab.id) {
    throw Error('tab must be exist');
  }
  // execute script
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: core.removeAllFixedOverlays,
  });
});


