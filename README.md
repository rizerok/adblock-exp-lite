# adblock-exp-lite

zero dependencies

## Motivation
Interest in creating a simplified AdBlock

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

## Install
```bash 
git clone git@github.com:rizerok/adblock-exp-lite.git
npm i
```

## Build
```bash
npm run build:prod
# extension in /dist
```

## Usage
1. Install nodeJS, npm and git
2. Install
3. Build prod
4. Open Chrome
5. Go to chrome://extensions/
6. Turn on Dev mode
7. Load extension (choose "/dist" dir)
8. Change options in extension and use


## Scripts

```json
{
    "build:dev": "node build.js development",
    "build:prod": "node build.js production",
    "test": "jest src",
    "test:watch": "jest src --watch",
    "test:e2e": "jest e2e --runInBand --no-cache",
    "test:e2e:watch": "jest e2e --watch --runInBand --no-cache"
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
- [x] request canceling
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
- [x] iframe cleaner
  - [x] start with tests and e2e tests(e2e doc -> html -> e2e -> code) 
  - [x] options ui
  - [x] add new store and update
  - [x] add new script
  - [x] add script in lifecycle
  - [x] tests
  - [x] e2e
    - [x] start
    - [x] finish
- [ ] check code todos
- [ ] import/export settings
  - [x] import
  - [x] export
  - [x] test for import
  - [ ] test for export
- [x] husky
- [ ] think about react for options.html
- [ ] build watcher
