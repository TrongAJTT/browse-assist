---
name: plasmo-storage-patterns
description: >-
  Mẫu code và quy tắc chuẩn khi sử dụng @plasmohq/storage trong các môi trường khác nhau:
  React Popup, Content Script và Background Service Worker.
---

# Hướng dẫn Mẫu sử dụng `@plasmohq/storage`

Thư viện `@plasmohq/storage` cung cấp giải pháp thống nhất để lưu trữ và đồng bộ dữ liệu qua `chrome.storage.sync` hoặc `chrome.storage.local`.

---

## 1. Trong React UI (`popup.tsx`, `Toggle.tsx`)

Sử dụng hook `useStorage` từ `@plasmohq/storage/hook`:

```tsx
import React from "react";
import { useStorage } from "@plasmohq/storage/hook";
import { STORAGE_KEYS, DEFAULT_SETTINGS, type FeatureSettings } from "~core/types";

export function SettingComponent() {
  // Tự động load từ storage, fallback về DEFAULT_SETTINGS và re-render khi storage thay đổi
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

## 2. Trong Content Script (`content.ts`)

Trong Content Script không sử dụng React, ta sử dụng instance `Storage` trực tiếp:

```ts
import { Storage } from "@plasmohq/storage";
import { STORAGE_KEYS, DEFAULT_SETTINGS, type FeatureSettings } from "~core/types";

const storage = new Storage();

// 1. Đọc cấu hình khi script khởi động
async function init() {
  const currentSettings = await storage.get<FeatureSettings>(STORAGE_KEYS.SETTINGS) ?? DEFAULT_SETTINGS;
  applySettings(currentSettings);
}

// 2. Theo dõi thay đổi real-time từ Popup
storage.watch({
  [STORAGE_KEYS.SETTINGS]: (change) => {
    const newSettings = change.newValue as FeatureSettings;
    applySettings(newSettings ?? DEFAULT_SETTINGS);
  }
});

function applySettings(settings: FeatureSettings) {
  if (settings.allowRightClick) {
    // activate
  } else {
    // deactivate
  }
}

init();
```

---

## 3. Trong Background Service Worker (`background.ts`)

Trong Service Worker, truy cập qua async instance của `Storage`:

```ts
import { Storage } from "@plasmohq/storage";
import { STORAGE_KEYS, DEFAULT_SETTINGS, type FeatureSettings } from "~core/types";

const storage = new Storage();

export async function checkFeatureEnabled(feature: keyof FeatureSettings): Promise<boolean> {
  const settings = await storage.get<FeatureSettings>(STORAGE_KEYS.SETTINGS) ?? DEFAULT_SETTINGS;
  return !!settings[feature];
}

// Lắng nghe thay đổi nếu cần update badge hoặc context menus
storage.watch({
  [STORAGE_KEYS.SETTINGS]: (change) => {
    const newSettings = change.newValue as FeatureSettings;
    // cập nhật trạng thái context menu nếu cần
  }
});
```
