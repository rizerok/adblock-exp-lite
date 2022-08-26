# adblock-exp-lite

```json
{
  "name": "adblock-exp-lite",
  "description": "Extension for remove fixed overlays and cancel requests",
  "version": "1.0",
  "manifest_version": 3,
  "background": {
    "service_worker": "background-sw.js",
    "type": "module"
  },
  "action": {
    "default_popup": "popup.html"
  },
  "permissions": [
    "webRequest",
    "declarativeNetRequest",
    "declarativeNetRequestWithHostAccess",
    "declarativeNetRequestFeedback",
    "storage",
    "activeTab",
    "scripting",
    "tabs"
  ],
  "host_permissions": [
    "*://*/*",
    "file://*/*"
  ],
  "options_page": "options.html"
}

```

## Todos
- [x] log
- [x] ~~webpack~~ build script
  - [x] run tsc 
  - [x] copy html, css and manifest
  - [x] dev and prod mode
  - [x] definePlugin (babel)
  - [x] minification (babel)
- [x] typescript
- [x] strict typescript
- [x] tests
  - [x] install packages
  - [x] simple test
  - [x] test with imports
  - [x] exclude test files from build
  - [x] test directories
  - [x] other tests
- [x] bug with null
- [x] e2e puppeteer tests
  - [x] integrate with jest
  - [x] simple test (init)
  - [x] other tests (remove overlay)
    - [x] ~~remove overlay by button~~ (puppeteer cannot get access to extension popup)
    - [x] remove overlay if options enable and url is suitable
    - [x] do not remove overlay if options disable
    - [x] do not remove overlay if url is not suitable
    - [x] check removing new overlay
    - [x] check removing on new tab
  - [x] split unit and e2e tests
  - [x] maybe add run lifecycle on onCreated event? (all ok, just add delay in test)
- [ ] request canceling
  - [x] options ui (all controls)
  - [x] add new store and update
    - [x] get requests
    - [x] set requests on "accept" button
  - [x] add new script
  - [x] ~~add script in lifecycle~~
  - [x] tests
  - [x] refactor background-sw
  - [x] e2e
      - [x] start
      - [x] "Add canceling" button
      - [x] "Delete" button
      - [x] add requests
      - [x] detect requests with puppeteer
      - [x] check block request
      - [x] check block requests with different fields
      - [x] ~~try block requests with different domains and names~~ (only with different urlFilter)
- [ ] iframe cleaner
  - [ ] start with tests and e2e tests(e2e doc -> html -> e2e -> code) 
  - [ ] options ui
  - [ ] add new store and update
  - [ ] add new script
  - [ ] add script in lifecycle
  - [ ] tests
  - [ ] e2e
    - [x] start
- [ ] import/export settings 
- [ ] husky
- [ ] think about react for options.html
