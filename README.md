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
- [ ] bug with null
- [ ] e2e puppeteer tests
- [ ] request handling
- [ ] iframe cleaner
