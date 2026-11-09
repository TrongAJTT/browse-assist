---
name: debug-extension
description: >-
  Detailed guide for debugging Chrome Manifest V3 extensions built with Plasmo,
  covering Popup, Content Scripts, Service Worker, and common pitfalls.
---

# Chrome Extension Debugging Guide (Manifest V3)

When developing with Plasmo, the extension builds into:
- Dev build: `build/chrome-mv3-dev`
- Prod build: `build/chrome-mv3-prod`

## 1. Loading the Extension into Chrome

1. Open Google Chrome and navigate to `chrome://extensions/`.
2. Toggle on **Developer mode** in the top right corner.
3. Click the **Load unpacked** button.
4. Select the directory: `g:\BrowserExtensions\browse-assist\build\chrome-mv3-dev`.

---

## 2. Debugging Isolated Contexts

In Manifest V3, the extension operates across 3 isolated execution environments:

### A. Debugging Popup UI
- Right-click the Browse Assist extension icon on the browser toolbar.
- Select **Inspect popup**.
- Dedicated DevTools window will open:
  - **Elements tab**: Inspect DOM nodes and active Tailwind classes.
  - **Console tab**: View React rendering errors and logs.
  - **Application > Storage > Extension Storage**: Directly inspect entries stored in `chrome.storage.local`.

### B. Debugging Content Scripts (Running on web pages)
- Open any web page (e.g. https://example.com).
- Press `F12` or right-click > **Inspect** to open page DevTools.
- Open the **Console tab**:
  - In the context dropdown (defaults to `top`), switch to `Browse Assist (Extension)` to evaluate commands in the extension context, or observe logs produced by `content.ts`.
- Open the **Sources tab**:
  - In the left sidebar, navigate to **Content scripts** > locate the extension to set breakpoints in `content.ts` and feature `logic.ts` files.

### C. Debugging Service Worker (Background)
- Navigate to `chrome://extensions/`.
- Locate the **Browse Assist** card.
- Click the blue link labeled **service worker** (next to "Inspect views").
- The background DevTools window opens for debugging context menus, lifecycle events, and global commands.

---

## 3. Common Issues & Solutions

| Issue | Cause | Resolution |
|---|---|---|
| `Cannot preventDefault inside passive event listener` | Chrome defaults `wheel` listeners to passive | Specify `{ passive: false }` when calling `addEventListener("wheel", fn, { passive: false })`. |
| Storage does not sync between Popup and Content Script | Missing `storage` permission or mismatched key | Verify `"storage"` is listed in `permissions` in `package.json` and ensure identical storage key name is used. |
| Context menus do not appear | Service worker failed to register or update | Visit `chrome://extensions/` and click the circular Reload button on the extension card. |
| Tailwind CSS styles not applying | Missing CSS import or build pipeline misconfiguration | Verify `import "~style.css"` exists in `popup.tsx` and check `postcss.config.js`. |
