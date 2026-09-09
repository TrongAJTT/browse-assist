---
name: plasmo-storage-patterns
description: >-
  Standard code patterns and conventions when working with @plasmohq/storage across environments:
  React Popup, Content Script, and Background Service Worker.
---

# Guide & Code Patterns for `@plasmohq/storage`

The `@plasmohq/storage` library provides a unified interface for persisting and synchronizing data via `chrome.storage.sync` or `chrome.storage.local`.

---

## 1. In React UI (`popup.tsx`, `Toggle.tsx`)

Use the `useStorage` hook from `@plasmohq/storage/hook`:

```tsx
import React from "react";
import { useStorage } from "@plasmohq/storage/hook";
import { STORAGE_KEYS, DEFAULT_SETTINGS, type FeatureSettings } from "~core/types";

export function SettingComponent() {
  // Automatically loads from storage, falls back to DEFAULT_SETTINGS, and re-renders on change
  const [settings, setSettings] = useStorage<FeatureSettings>(
    STORAGE_KEYS.SETTINGS,
    DEFAULT_SETTINGS
  );

  const toggleFeature = (key: keyof FeatureSettings) => {
    setSettings((prev) => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <button onClick={() => toggleFeature("allowRightClick")}>
      {settings.allowRightClick ? "Enabled" : "Disabled"}
    </button>
  );
}
```

---

## 2. In Content Scripts (`content.ts`)

Content scripts do not run React; use the `Storage` instance directly:

```ts
import { Storage } from "@plasmohq/storage";
import { STORAGE_KEYS, DEFAULT_SETTINGS, type FeatureSettings } from "~core/types";

const storage = new Storage();

// 1. Read configuration during initial injection
async function init() {
  const currentSettings = (await storage.get<FeatureSettings>(STORAGE_KEYS.SETTINGS)) ?? DEFAULT_SETTINGS;
  applySettings(currentSettings);
}

// 2. Watch for real-time changes
storage.watch({
  [STORAGE_KEYS.SETTINGS]: (change) => {
    const newSettings = change.newValue as FeatureSettings;
    applySettings(newSettings);
  }
});
```

---

## 3. In Background Service Worker (`background.ts`)

In the Service Worker, storage can be used for persistent state across browser sessions:

```ts
import { Storage } from "@plasmohq/storage";
import { STORAGE_KEYS, DEFAULT_SETTINGS, type FeatureSettings } from "~core/types";

const storage = new Storage();

export async function checkFeatureState(key: keyof FeatureSettings): Promise<boolean> {
  const settings = (await storage.get<FeatureSettings>(STORAGE_KEYS.SETTINGS)) ?? DEFAULT_SETTINGS;
  return Boolean(settings[key]);
}
```

---

## 4. Best Practices & Rules

1. **Always provide fallback defaults**:
   Storage reads may return `undefined` on the very first install before initialization. Always fallback using `?? DEFAULT_SETTINGS`.

2. **Unified Storage Key**:
   Consolidate all general extension configuration within `STORAGE_KEYS.SETTINGS` (`"browse_assist_settings"`) to prevent fragmented keys and ensure atomic updates.

3. **Storage Change Handler Guard**:
   In `storage.watch`, always check `if (!change.newValue) return;` to avoid handling deletion events unexpectedly.
