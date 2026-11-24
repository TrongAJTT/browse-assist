# Changelog

All notable changes to **Browse Assist** are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.2.0] - 2026-11-24

### Added
- **Per-Site Rules & Exclusions (`src/core/siteRules.ts`)**:
  - Disable all features or specific individual features per website using domain (`figma.com`, `*.figma.com`) or wildcard (`*`) URL patterns (`docs.google.com/spreadsheets/*`).
  - Real-time enforcement across Popup, Options, and Content Scripts via `STORAGE_KEYS.SITE_RULES` (`browse_assist_site_rules`), calling `deactivate()` immediately without page reload and re-evaluating on SPA route changes.
  - Shared responsive `SiteRulesManager` UI accessible from the AppBar **Shield** icon in Popup (`Click`: Popup view, `Shift+Click`: jumps to `#site-rules` in Options) and the `#site-rules` section in Options.
  - Compact List Tile View with a collapsible per-feature exclusion drawer for the active site, unified Add/Edit modal (with active-tab domain auto-fill/quick-fill and duplicate guard), and an inline search bar in the *Saved Rules* header (shown when `>= 6` rules exist).
  - Visual **`Site off`** status badges on excluded feature cards/rows in Popup (`ToggleSwitch`) and disabled **`Site off`** actions in Quick Hub.
- **Quick Hub Site Rules Footer**: Persistent 2-state footer at the bottom of the Quick Hub menu (*Site issue? Add rule* or *Site rules active (N)*) that opens Popup directly to the `Site Rules` view.
- **Image Hover Preview — Entrance Animations**:
  - Added configurable `animation` presets (`zoom`, `morph`, `fade`, `slide`, `none`) using CSS `@keyframes` and Web Animations API (WAAPI) uniform-scale FLIP morphing from source `<img>` bounds, with `zoom` fallback for text links and `prefers-reduced-motion` support.
- **Extension Identity & Manifest**:
  - Updated `extName` to **Browse Assist: Web Interaction** with localized slogans across all 9 locales (`locales/*/messages.json`), and added `"short_name": "Browse Assist"` and `"activeTab"` permission in `package.json`.
- **Automated Tests**: Expanded Vitest suite to **23 test files / 100 passing tests** (including `src/core/__tests__/siteRules.test.ts` and new Quick Hub / Image Hover Preview tests).

### Changed
- **Theme Contrast & Badge Polish**: Added theme-aware `.badge-warning` tokens in `src/style.css` for crisp contrast in both Light Mode and Dark Mode, and applied `.badge-accent` to active-tab rule badges.

### Fixed
- **Localization Interpolation**: Fixed Rosetta `{{count}}` / `{{host}}` double-brace placeholders across all 9 locale dictionaries (`src/locales/*.ts`).

---

## [1.1.0] - 2026-11-19

### Added
- **Image Hover Preview**: New feature to preview `<img>` elements and image links in full size on hover, with configurable modifier key, delay, dimensions badge, settings UI, and unit tests.
- **Full Internationalization (i18n) across 9 Locales**:
  - Added `rosetta` i18n engine, `useI18n` React hook, type-safe `TranslationKey` checking, and `eslint-plugin-i18next` guardrails.
  - Localized Popup, Options, Preferences, About, all feature settings views, content script toasts, and extension manifest metadata (`locales/*/messages.json`) into **English (`en`)**, **Vietnamese (`vi`)**, **German (`de`)**, **Spanish (`es`)**, **French (`fr`)**, **Japanese (`ja`)**, **Korean (`ko`)**, **Simplified Chinese (`zh_CN`)**, and **Traditional Chinese (`zh_TW`)**.
  - Added localization architecture & glossary documentation in `docs/i18n.md`.
- **Shared Floating Action Button (FAB) System (`src/core/fab/`)**:
  - Unified right-click context menu across **Quick Hub**, **Quick Scroll Buttons**, and **PiP Hover Button** with *Move position*, *Open settings*, *Hide on this tab* (ephemeral per-tab dismissal), and *Disable*.
  - Cross-platform right-click hold-and-drag quick repositioning (`> 220ms` hold or `>= 6px` drag) with visual edge preview and `Esc` cancel.
- **Quick Hub Upgrades**:
  - Redesigned left-click menu with adaptive Light/Dark glassmorphism surface and borderless accent icons.
  - Added auto page-theme adaptation, button shape (`circle`, `rounded`, `pill`), and button opacity controls.
  - Added 3 new Quick Hub actions: **Allow Right Click** (with active status indicator), **Copy Page as Markdown** (hidden by default), and **Video Screenshot** (hidden by default).
- **2-Layer `cleanUrl()` Engine**: Upgraded URL cleaner in `src/core/linkUtils.ts` with redirect unwrapping (`google.com/url`, `l.facebook.com`, etc.), Google Search query whitelist, domain-specific parameter stripping, and expanded global tracking parameters.
- **Context Menu Actions**: Added **Copy Clean Page URL**, **Copy Page Markdown**, and **Copy Selection as Quote**.
- **Super Drag Enhancements**:
  - Redesigned **Circular Radial Indicator** with per-action Lucide-style icons, semantic color palette (`RADIAL_THEME_PALETTE`), dimmed `none` sectors, and matching action icon in the floating tooltip pill.
  - Added **Indicator Opacity** setting for both Badge and Radial indicators.
  - Added **Copy Markdown** and **Search Image** directional actions, browser `chrome.search` integration for text drag, and widened D-pad picker.
- **Smooth Scrolling**: Added **Ignore Trackpad** bypass and **Keyboard Scroll** smoothing options.
- **Universal Picture-in-Picture**: Added **Auto-Pause on Exit**, hover button opacity control, and optimized pointer listeners.
- **Video Wheel Control**: Added OSD opacity control and `SelectDropdown` modifier selector.
- **Quick Scroll Buttons**: Added button shape styles, button opacity dropdown, and native scroll button detection (`hideOnNativeButton` enabled by default).
- **Color Picker**: Added `showPaletteModal` toggle and `SelectDropdown` format selector.
- **Popup & Preferences**: Redesigned popup grid into compact tiles, added optional search bar & category filter, and added **VietQR (VN Bank)** donation option.
- **Automated Test Suite**: Added Vitest + JSDOM unit and integration test suites across `src/core/` and `src/features/` (22 test files, 89 passing tests).

### Changed
- **Shadow DOM Isolation (`src/core/shadowHost.ts`)**: Migrated Toast, Element Toys overlay & toolbar, Super Drag indicators, Video Wheel Control OSD, and PiP hover button into isolated Shadow DOM hosts so host page CSS (e.g. global `svg` margin/opacity rules) cannot distort extension UI.
- **Shared UI Polish**: Upgraded `SelectDropdown` with auto-flip positioning and unified trailing dropdowns in Quick Scroll and Preferences settings.
- **Element Toys**: Improved settings layout, unified exit toast, and cleared undo stack on deactivation.

### Fixed
- **Allow Right Click**: Fixed `paste` event interception and cleared inline `onpaste` handlers on restrictive sites.
- **Mouse Pin-to-Zoom**: Suppressed trailing left-click after zoom gestures and added middle-click zoom reset.
- **Video Wheel Control**: Fixed click, volume boost, and modifier edge cases.
- **Color Picker**: Suppressed duplicate toast when floating palette modal is active.
- **Smooth Scrolling**: Fixed *Gliding Duration* slider direction.
- **Dark Mode**: Fixed active tile borders and visibility toggle borders in dark mode.

---

## [1.0.0] - 2026-11-09

### Added
- Initial production release of **Browse Assist** — *The Open-Source "PowerToys" for Web Browsing* built on Plasmo (Manifest V3), React 18, TypeScript (strict mode), Tailwind CSS, and `@plasmohq/storage`.
- **11 Core Browsing Utilities**:
  - **Allow Right Click** (`Alt + R`): Restores right-click context menus, text selection, and copy operations on restrictive websites.
  - **Context Menu Actions**: Right-click menu actions for *Copy Link Text*, *Clean Link on Copy* (strips tracking parameters), and *Markdown Link Copy*, with drag-and-drop ordering.
  - **Super Drag**: Drag selected text, links, or images in 4 configurable directions with Badge or Circular Radial indicators.
  - **Smooth Scrolling**: `requestAnimationFrame` wheel physics interpolation with *Balanced*, *Ultra*, *Snappy*, and *Custom* presets plus smart/aggressive interception modes.
  - **Universal Picture-in-Picture** (`Alt + P`): Activates PiP for playing HTML5 videos (bypassing anti-PiP locks) with a floating hover button and badge indicator.
  - **Video Wheel Control**: Adjust video volume, playback speed, seeking, fullscreen, and screenshots via modifier + mouse wheel with a floating OSD.
  - **On-Screen Quick Hub**: Floating edge dock for instant access to utilities and page actions.
  - **Quick Scroll Buttons**: Floating top/bottom jump buttons with idle auto-dim and reading position memory.
  - **Color Picker** (`Alt + Shift + C`): Chromium EyeDropper integration with HEX/RGB/HSL copying and color history.
  - **Element Toys** (`Alt + Shift + Z`): In-page toolbar for *Zap* (with scroll unfreeze), *Edit*, *Move* (Flow/Free + Resize), and *Hide* with undo support.
  - **Mouse Pin-to-Zoom** (`Alt` + Wheel): Smooth cursor-centered page zooming.
- **Popup, Options & Architecture**:
  - Modular Popup dashboard with Grid/List view toggle, card reordering, Preferences, and About views.
  - Dedicated Options page (`src/options.tsx`) with feature overview, shortcuts guide, and privacy transparency.
  - Cross-browser Manifest V3 support for Chrome, Edge, and Firefox (`package:chrome`, `package:edge`, `package:firefox`) and GitHub Actions release workflow.
