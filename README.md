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
- [ ] log
- [ ] webpack
- [ ] typescript
- [ ] tests
- [ ] bug with null
- [ ] request handling

