# Browse Assist — Project Rules & Guidelines

Browse Assist is a browser extension (Manifest V3) inspired by the "PowerToys for Web Browsing" philosophy, consolidating Quality of Life (QoL) web utilities:
1. **Allow Right Click**: Restore context menus, copying, and selection on restrictive websites (Hotkey `Alt+R`).
2. **Context Menu Actions**: Copy Link Text, Clean Link on Copy (strip tracking queries such as `utm_*`, `fbclid`...), Markdown Link Copy.
3. **Super Drag**: Drag text to search Google in a new tab; drag links to open them in background tabs.
4. **Smooth Scrolling**: Silky smooth scrolling via interpolated wheel events with presets (`balanced`, `ultra`, `snappy`, `custom`).
5. **Mouse Pin-to-Zoom**: Zoom into/out of the page area centered on the mouse cursor using modifier keys (`Alt`, `Shift`...) + wheel scroll.
6. **Universal Picture-in-Picture**: Trigger PiP for currently playing videos via hotkey `Alt+P`.
7. **Quick Scroll**: Double-click edges or floating buttons to jump swiftly to top or bottom.
8. **Color Picker**: Eyedropper magnifier zooming into individual pixels to copy HEX/RGB/HSL color codes instantly.
9. **Element Zapper**: Point-and-click targeting mode to remove annoying overlays/banners from the DOM, with automatic scroll unfreezing.

---

## 1. Tech Stack Constraints

- **Framework**: [Plasmo Framework](https://docs.plasmo.com/) (Manifest V3).
- **Language**: TypeScript (Strict mode, avoid loose `any` types, declare clear schemas in `src/core/types.ts`).
- **UI**: React 18 + Tailwind CSS v3. Do not install heavy component libraries (e.g. MUI, AntD, Chakra) to keep extension bundle size minimal.
- **Styling**: Tailwind CSS utility classes paired with semantic CSS variable tokens defined in `src/style.css`.
- **Package Manager**: PNPM. Always use `pnpm` to install and manage dependencies.

---

## 2. Verification & Testing Rules

When modifying code or refactoring, apply verification steps based on the scope and impact of changes:

1. **Tiny refactor / changes (< 30 lines) OR UI-only edits**:
   - Verification is **not required**. Proceed directly.
2. **Medium refactor / changes (< 1,000 lines)**:
   - Must run and pass:
     - `pnpm lint`
     - `pnpm typecheck`
3. **Large refactor / changes (>= 1,000 lines)**:
   - Must run and pass all three commands:
     - `pnpm lint`
     - `pnpm typecheck`
     - `pnpm build`

---

## 3. Architecture & Code Conventions

### Project & Feature Structure
```text
src/
├── components/                  # Shared UI components for popup (Switch, Slider, Kbd, Card...)
├── core/                        # Shared types, storage wrapper, core utilities
│   ├── storage.ts
│   └── types.ts
├── features/                    # Modular, domain-driven feature implementations
│   ├── <feature-name>/
│   │   ├── logic.ts             # DOM listeners, export activate() / deactivate()
│   │   ├── background.ts        # (Optional) Service worker handler & context menus
│   │   └── Toggle.tsx           # Switch & Settings UI component for popup
├── background.ts                # Background service worker entry
├── content.ts                   # Content script entry
├── popup.tsx                    # Main popup UI
└── style.css                    # Tailwind CSS entry & CSS variable tokens
```

### Script Isolation
- **Content Scripts (`content.ts`)**: **Never** import React components or hooks from UI (`popup.tsx`, `Toggle.tsx`). Only import pure logic from `src/features/*/logic.ts` and `src/core/storage.ts`.
- **Background Service Worker (`background.ts`)**: No DOM manipulation (`window`, `document`). Only import service worker handlers from `src/features/*/background.ts`.
- **Popup (`popup.tsx`)**: Import `Toggle.tsx` from features and `useStorage` to bind states.

### Module Interface Contract
Every module running in content scripts (`logic.ts`) **must** adhere to this interface:
```ts
export function activate(): void;
export function deactivate(): void;
```
This guarantees that when a user turns a feature off in the popup, the content script immediately calls `deactivate()` to clean up all event listeners without requiring a page reload.

### Path Alias
Use `~` as the source root alias:
- `~core/storage`
- `~features/allow-right-click/logic`
- `~style.css`

### Shared UI Components (`src/components/`)
- All reusable UI components in the popup must reside in `src/components/`.
- Always use semantic CSS tokens defined in `tailwind.config.js` (`bg-app`, `bg-app-surface`, `text-content-*`, `border-subtle`, `accent-*`).
- Do not hardcode arbitrary hex colors to ensure seamless Dark Mode and Light Mode support.

---

## 4. State Management Rules

The state management follows a strict 2-tier model:

### Tier 1: Persistent State — `@plasmohq/storage`
- Used for all settings that need to persist and synchronize across **Popup ↔ Content Scripts ↔ Background Service Worker**.
- Default storage key: `"browse_assist_settings"`.
- All schemas and default values (`DEFAULT_SETTINGS`) must be defined in `src/core/types.ts`.
- **In React (Popup)**: Use the `useStorage` hook from `@plasmohq/storage/hook`.
- **In Content Script & Background**: Use the `Storage` instance from `@plasmohq/storage` and listen via `watch()`.

### Tier 2: Local UI State — React `useState` / `useReducer`
- Reserved for temporary local UI states only (e.g. active tab, hover states, animation states, toast notifications).
- **Do not use Zustand / Redux / Jotai** to avoid unnecessary bloat and fragmented sources of truth.

---

## 5. Skills & Runbooks

When performing specific workflows, refer to the skills in `.agents/skills/`:
- `.agents/skills/add-feature/SKILL.md`: Standard procedure for introducing a new feature.
- `.agents/skills/debug-extension/SKILL.md`: Comprehensive debugging guide for Chrome MV3 extensions.
- `.agents/skills/plasmo-storage-patterns/SKILL.md`: Code patterns for `@plasmohq/storage` across contexts.
- `.agents/skills/ui-components/SKILL.md`: Guidelines for creating and using UI components adhering to design tokens.
