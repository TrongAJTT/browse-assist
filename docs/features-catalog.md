# Browse Assist — Features Catalog & Roadmap

This document outlines the catalog of active features, default keybindings, execution contexts, and the upcoming development backlog in line with the **PowerToys for Web Browsing** vision.

---

## 1. Active Feature Catalog

| # | Feature | Identifier Key | Context | Default Hotkey / Trigger | Description |
|---|:---|:---|:---|:---|:---|
| 1 | **Allow Right Click** | `allowRightClick` | Content Script | `Alt + R` | Restores context menus (`contextmenu`), selection (`selectstart`), and copy operations on restrictive websites. |
| 2 | **Context Menu Actions** | `contextMenuActions` | Service Worker | Right-click menu | Enhanced context menu options: Copy Link Text, Clean Link on Copy (strips tracking params like `utm_*`, `fbclid`), Markdown Link Copy (`[Title](URL)`). |
| 3 | **Super Drag** | `superDrag` | Content Script | Mouse drag | Drag highlighted text to execute a Google search in a new tab; drag a hyperlink to open it in a background tab. |
| 4 | **Smooth Scrolling** | `smoothScroll` | Content Script | Mouse wheel | Interpolates wheel physics via `requestAnimationFrame`. Presets: `balanced`, `ultra`, `snappy`, and `custom`. |
| 5 | **Mouse Pin-to-Zoom** | `mouseZoom` | Content Script | `Alt` + Mouse wheel | Zoom into/out of the page area centered on the cursor. Configurable modifiers (`Alt`, `Shift`, Left Click, Right Click). |
| 6 | **Universal PiP** | `pictureInPicture` | Content Script | `Alt + P` | Detaches the active video (`<video>`) into Picture-in-Picture floating mode, bypassing website restrictions. |
| 7 | **Quick Scroll** | `quickScroll` | Content Script | Double-click page edge | Double-click configured browser window margins (or floating buttons) to jump quickly to the top or bottom of the page. |
| 8 | **Color Picker** | `colorPicker` | Content Script | Popup Action | Eyedropper magnifier zooming into individual pixels under the cursor; click to copy HEX, RGB, or HSL codes. |
| 9 | **Element Zapper** | `elementZapper` | Content Script | Popup Action | Point-and-click targeting mode to remove sticky banners, popups, and paywall overlays from the DOM; automatically unfreezes locked body scrolling (`overflow: hidden`). |

---

## 2. Upcoming Backlog Roadmap

High-value QoL features scheduled for upcoming milestones based on [SPECIFICATION.md](../SPECIFICATION.md):

- [ ] **Video Wheel Control**: Hover over any `<video>` and scroll to adjust audio volume, or hold `Shift + Scroll` to control playback speed.
- [ ] **Unfreeze Body Scroll Hotkey**: Dedicated shortcut (`Alt + U`) to immediately remove `overflow: hidden !important` on `<body>`/`<html>` caused by modals or paywalls.
- [ ] **Force Paste**: Bypass anti-paste restrictions (`paste` event blockers) on restrictive forms or exams.
- [ ] **Force Text Selection**: Thoroughly remove `user-select: none !important` and `onselectstart` blockers across the document.
- [ ] **Password Revealer**: Hold `Alt` or hover over password input fields (`type="password"`) to temporarily reveal characters instead of `••••`.
- [ ] **Hover-to-Enlarge**: Hover over image thumbnails to preview full-resolution original images directly at the cursor without navigating away.
