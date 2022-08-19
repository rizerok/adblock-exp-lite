# adblock-exp-lite

```json
{
  "name": "adblock-exp-lite",
  "private": true,
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
    "storage",
    "activeTab",
    "scripting",
    "tabs"
  ],
  "host_permissions": [
    "*://*/*"
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
- [ ] e2e puppeteer tests
  - [x] integrate with jest
  - [x] simple test (init)
  - [x] other tests (remove overlay)
    - [x] ~~remove overlay by button~~ (puppeteer cannot get access to extension popup)
    - [x] remove overlay if options enable and url is suitable
    - [x] do not remove overlay if options disable
    - [x] do not remove overlay if url is not suitable
    - [x] check removing new overlay
    - [x] check removing on new tab
  - [ ] split unit and e2e tests
  - [ ] maybe add run lifecycle on onCreated event? 
- [ ] request handling
- [ ] iframe cleaner
