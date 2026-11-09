<div align="center">

  <img src="assets/icon.png" width="96" height="96" alt="Browse Assist Logo" />

  # Browse Assist

  ### *The Open-Source "PowerToys" for Web Browsing*

  [![License](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](LICENSE)
  [![Manifest V3](https://img.shields.io/badge/Manifest-V3-success.svg)](https://developer.chrome.com/docs/extensions/mv3/intro/)
  [![Framework](https://img.shields.io/badge/Framework-Plasmo-purple.svg)](https://docs.plasmo.com/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-Strict-3178C6.svg)](https://www.typescriptlang.org/)
  [![Privacy](https://img.shields.io/badge/Privacy-100%25_Local--First-brightgreen.svg)](#-privacy--permission-transparency)

  <p align="center">
    A lightweight, modular collection of quality-of-life tools designed to elevate your browsing flow.<br />
    Reclaim context menus, navigate with fluid physics, control media effortlessly, and trigger on-screen shortcuts — without slowing down your browser.
  </p>

  <p align="center">
    <a href="https://www.trongajtt.com/apps/browse-assist"><strong>Website</strong></a> •
    <a href="https://www.trongajtt.com/apps/browse-assist/policy"><strong>Privacy Policy</strong></a> •
    <a href="https://www.trongajtt.com/apps/browse-assist/terms"><strong>Terms of Service</strong></a> •
    <a href="docs/features-catalog.md"><strong>Feature Catalog</strong></a> •
    <a href="docs/architecture.md"><strong>Architecture</strong></a>
  </p>

</div>

---

<div align="center">
  <img src="assets/my-assets/marquee_promo_tile_1400x560.png" width="100%" alt="Browse Assist Banner" />
</div>

---

## ⚡ Core Philosophy

Traditional extension suites often inject bloated multi-megabyte frameworks into every tab, draining battery and tracking user telemetry. **Browse Assist** takes the opposite approach inspired by the **Microsoft PowerToys** philosophy:

1. **⚡ Native-Speed & Zero Bloat**: Content scripts remain dormant until invoked by hotkeys or gestures. Package size is **< 450 KB**.
2. **🛡️ 100% Local-First & Zero Telemetry**: Zero remote servers, zero analytics SDKs, and zero tracking cookies. All user preferences persist strictly inside your browser's sandboxed `chrome.storage.local`.
3. **🧩 Modular Customization**: Turn off any tool you don't need. Reorder popup cards with drag-and-drop, toggle between Grid and List views, or customize on-screen trigger docks.
4. **🔒 Isolated UI (Shadow DOM)**: In-page overlays (Quick Hub, Quick Scroll, Element Toys) render within closed Shadow DOMs (`mode: "closed"`), preventing any CSS conflicts with host websites.

---

## ✨ Features at a Glance

| # | Feature | Trigger / Shortcut | Description |
|---|:---|:---:|:---|
| 1 | **Allow Right Click** | `Alt + R` | Restores context menus, text selection, and copy operations on restrictive websites that block them. |
| 2 | **Context Menu Actions** | Right-click menu | Smart utilities: **Clean Link on Copy** (strips `utm_*`, `fbclid` trackers), **Copy Link Text**, and **Markdown Link Copy** (`[Title](URL)`). |
| 3 | **Super Drag** | Mouse drag | Highlight text and drag in 4 configurable directions to search in a new tab; drag hyperlinks to open them in background tabs. |
| 4 | **Smooth Scrolling** | Mouse wheel | Interpolates wheel physics via `requestAnimationFrame`. Presets: *Balanced*, *Ultra*, *Snappy*, and *Custom*. |
| 5 | **Universal PiP** | `Alt + P` | Forces any playing HTML5 video into floating Picture-in-Picture mode, even on sites that block native PiP. |
| 6 | **Video Wheel Control** | `Shift` / `Alt` + Wheel | Hover over video players to adjust volume and playback speed with a smooth On-Screen Display (OSD) HUD. |
| 7 | **On-Screen Quick Hub** | Dock / Shortcut | Floating radial/grid launcher for fast access to your favorite utilities and page controls anywhere on screen. |
| 8 | **Quick Scroll Buttons** | Edge double-click | Floating circular buttons with smart auto-dim on idle to jump swiftly to the top or bottom of long pages. |
| 9 | **Color Picker** | Popup / Quick Hub | Magnifier eyedropper zooming into cursor pixels to copy HEX, RGB, or HSL color codes (Chromium engines). |
| 10 | **Element Toys** | `Alt + Shift + Z` | Point-and-click targeting mode: **Zap** (DOM removal with scroll unfreeze), **Edit** (live text), **Move** (reposition elements), and **Hide**. |
| 11 | **Mouse Pin-to-Zoom** | `Alt` + Wheel | Smoothly zooms in/out of exact page areas centered directly under the cursor. |

---

## 📸 Screenshots

<div align="center">
  <img src="assets/my-assets/screenshot_1_1200x800.png" width="48%" alt="Popup Dashboard" />
  <img src="assets/my-assets/screenshot_2_1200x800.png" width="48%" alt="Super Drag & Quick Actions" />
</div>

<div align="center" style="margin-top: 10px;">
  <img src="assets/my-assets/screenshot_3_1200x800.png" width="48%" alt="Smart Video & PiP Controls" />
  <img src="assets/my-assets/screenshot_4_1200x800.png" width="48%" alt="Quick Scroll Floating Buttons" />
</div>

<div align="center" style="margin-top: 10px;">
  <img src="assets/my-assets/screenshot_5_1200x800.png" width="60%" alt="Customizable Quick Hub" />
</div>

---

## 🛠️ Tech Stack & Architecture

- **Core Framework**: [Plasmo Framework](https://docs.plasmo.com/) (Manifest V3)
- **Language**: TypeScript (Strict mode enabled)
- **UI & Styling**: React 18 + Tailwind CSS + Lucide Icons
- **Storage Layer**: `@plasmohq/storage` with live cross-context synchronization (`useStorage` & `watch`)
- **Isolation Pattern**: Closed Shadow DOM (`attachShadow({ mode: "closed" })`) for zero-bleed UI injection
- **Package Manager**: PNPM

### Project Structure

```text
src/
├── components/                  # Shared UI components (Switch, Slider, Modal, Views)
├── core/                        # Storage schemas, type registry, and messaging broker
│   ├── storage.ts
│   ├── messaging.ts
│   └── types.ts
├── features/                    # Modular feature implementations (Feature-First)
│   ├── <feature-name>/
│   │   ├── logic.ts             # Content script lifecycle: activate() / deactivate()
│   │   ├── background.ts        # (Optional) Service worker handlers & context menus
│   │   ├── Toggle.tsx           # Switch UI & quick config
│   │   └── SettingsView.tsx     # Dedicated sub-settings view
├── background.ts                # Service worker entry point
├── content.ts                   # Content script orchestrator
├── popup.tsx                    # Extension popup UI
└── style.css                    # Tailwind tokens & dark/light theme variables
```

---

## ⌨️ Default Keyboard Shortcuts

| Shortcut | Action | Scope |
|---|---|---|
| `Alt + R` | Toggle Allow Right Click | Active Tab |
| `Alt + P` | Toggle Universal Picture-in-Picture | Active Video |
| `Alt + Shift + Z` | Activate Element Toys Toolbar | In-Page Overlay |
| `Alt + Shift + C` | Pick Color from Screen (EyeDropper) | Screen |
| `Shift` + Mouse Wheel | Adjust Video Volume on Hover | Video Element |
| `Alt` + Mouse Wheel | Zoom In/Out Centered at Cursor | Webpage |

> **Note:** All keyboard shortcuts can be customized at any time via your browser's native manager (`chrome://extensions/shortcuts` or `edge://extensions/shortcuts`).

---

## 🛡️ Privacy & Permission Transparency

Browse Assist strictly complies with the **Least Privilege Principle** and the **Chrome Web Store Limited Use Policy**:

| Permission | Real-World Application | External Transmission |
|---|---|:---:|
| `storage` | Stores your preferences, presets, and toggle states locally. | **0 KB** |
| `contextMenus` / `menus` | Registers clean link and markdown copy options in the right-click menu. | **None** |
| `clipboardWrite` | Writes clean URLs, markdown links, or colors to clipboard **only on click**. | **None** |
| `search` | Triggers default search provider queries when using Super Drag gestures. | **None** |

- **No Remote Tracking:** Browse Assist does **NOT** use Google Analytics, Sentry, Mixpanel, or any tracking beacons.
- **No Sensitive Permissions:** We do **NOT** request `<all_urls>` background tracking permissions, browsing history (`history`), or identity access.

---

## 🚀 Getting Started (Developers)

### Prerequisites

- [Node.js](https://nodejs.org/) (v18.x or v20.x recommended)
- [PNPM](https://pnpm.io/) (v8.x or newer)

### Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/TrongAJTT/browse-assist.git
cd browse-assist
pnpm install
```

### Development Mode

Run the local development server with hot-reload:

```bash
# Chromium (Chrome, Edge, Brave, Opera)
pnpm dev

# Mozilla Firefox
pnpm dev:firefox
```

1. Open `chrome://extensions` in your browser.
2. Enable **Developer mode** (top-right toggle).
3. Click **Load unpacked** and select the output folder: `build/chrome-mv3-dev`.

### Code Verification

Ensure strict type safety and code style compliance:

```bash
# Linting checks
pnpm lint

# TypeScript verification
pnpm typecheck
```

### Production Packaging

Generate production builds and zipped release packages:

```bash
# Package for Chrome Web Store
pnpm package:chrome

# Package for Firefox Add-ons (AMO)
pnpm package:firefox

# Package for Microsoft Edge Add-ons
pnpm package:edge
```

Production zip archives will be output to `build/<target>-prod.zip`.

---

## 📜 Documentation

- [Detailed Features Catalog](docs/features-catalog.md)
- [Architecture & Design Principles](docs/architecture.md)
- [Website Wireframe & Visuals Specification](docs/internal/web/HOMEPAGE_LAYOUT.md)
- [Privacy Policy](docs/internal/POLICY.md)
- [Terms of Service](docs/internal/TERMS.md)

---

## 📄 License

Browse Assist is open-source software licensed under the **Apache License, Version 2.0**.  
See the [LICENSE](LICENSE) file for the full license text.

```text
Copyright 2026 TrongAJTT

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0
```

---

<div align="center">
  <sub>Designed with ❤️ by <a href="https://github.com/TrongAJTT">TrongAJTT</a>. "PowerToys" is an inspirational homage to modular utility design.</sub>
</div>
