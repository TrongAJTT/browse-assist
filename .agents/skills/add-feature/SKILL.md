---
name: add-feature
description: >-
  Hướng dẫn quy trình chuẩn khi thêm một tính năng mới vào Browse Assist extension,
  bao gồm tạo thư mục feature, khai báo type, logic content/background, toggle UI và đăng ký vào orchestrator.
---

# Quy trình thêm Feature mới vào Browse Assist

Mỗi tính năng trong Browse Assist được thiết kế theo tư duy **Feature-First**, hoàn toàn độc lập và có thể bật/tắt động trong runtime.

## Các bước thực hiện

### Bước 1: Khai báo Key và Type
Mở `src/core/types.ts`:
1. Thêm key mới vào union `FeatureKey`:
   ```ts
   export type FeatureKey =
     | "allowRightClick"
     | "copyLinkText"
     | "smoothScroll"
     | "mouseZoom"
     | "yourNewFeature"; // <--- Thêm vào đây
   ```
2. Cập nhật `DEFAULT_SETTINGS` với giá trị mặc định (`true` hoặc `false`).
3. Khai báo metadata (tên hiển thị, icon, mô tả) trong `FEATURE_METADATA`.

### Bước 2: Tạo thư mục Feature
Tạo thư mục `src/features/<tên-feature>/`:

#### Trường hợp A: Can thiệp DOM / Web page (`logic.ts`)
Tạo file `src/features/<tên-feature>/logic.ts`:
```ts
let isActive = false;

function handleEvent(e: Event) {
  // Logic xử lý
}

export function activate(): void {
  if (isActive) return;
  isActive = true;
  window.addEventListener("event", handleEvent, { capture: true });
}

export function deactivate(): void {
  if (!isActive) return;
  isActive = false;
  window.removeEventListener("event", handleEvent, { capture: true });
}
```
*Lưu ý: Luôn dọn dẹp sạch sẽ event listeners trong hàm `deactivate()`.*

#### Trường hợp B: Chạy trong Service Worker (`background.ts`)
Tạo file `src/features/<tên-feature>/background.ts`:
```ts
export function initBackground(): void {
  // Đăng ký context menu, alarms hoặc listeners service worker
}
```

#### Tạo UI Toggle Component (`Toggle.tsx`)
Tạo file `src/features/<tên-feature>/Toggle.tsx`:
```tsx
import React from "react";
import { useStorage } from "@plasmohq/storage/hook";
import { STORAGE_KEYS, DEFAULT_SETTINGS, type FeatureSettings } from "~core/types";

export function YourFeatureToggle() {
  const [settings, setSettings] = useStorage<FeatureSettings>(
    STORAGE_KEYS.SETTINGS,
    DEFAULT_SETTINGS
  );

  const isEnabled = settings?.yourNewFeature ?? true;

  const handleToggle = () => {
    setSettings((prev) => ({
      ...prev,
      yourNewFeature: !isEnabled
    }));
  };

  return (
    // Toggle switch UI với Tailwind CSS
  );
}
```

### Bước 3: Đăng ký vào Orchestrator
1. **Nếu có `logic.ts`**: Import vào `content.ts`, đưa vào handler điều phối `activate()` / `deactivate()` khi storage thay đổi.
2. **Nếu có `background.ts`**: Import và gọi hàm init trong `background.ts`.
3. **Thêm UI vào Popup**: Import `Toggle.tsx` và đặt vào danh sách trong `popup.tsx`.

### Bước 4: Kiểm tra và Build
Chạy:
```bash
pnpm dev
```
Kiểm tra bật/tắt trên trang web mục tiêu và kiểm tra devtools console không có lỗi rò rỉ bộ nhớ.
