import * as core from './src/core.js';
// popup logic
const $button = document.getElementById('removeAllFixedOverlays');

$button.addEventListener("click", async () => {
  // current tab
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  // execute script
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: core.removeAllFixedOverlays,
  });
});


