# Browse Assist — Project Rules & Guidelines

Browse Assist là tiện ích mở rộng trình duyệt (Manifest V3) tổng hợp 4 tính năng Quality of Life (QoL) duyệt web:
1. **Allow Right Click**: Khôi phục context menu và hành động copy trên các trang web bị chặn.
2. **Copy Link Text**: Chuột phải vào link để sao chép nhanh văn bản của liên kết.
3. **Smooth Scrolling**: Cuộn trang mượt mà bằng việc nội suy sự kiện cuộn.
4. **Mouse Pin-to-Zoom**: Phóng to / thu nhỏ vùng trang web quanh con trỏ chuột bằng Alt + Scroll.

---

## 1. Tech Stack Constraints

- **Framework**: [Plasmo Framework](https://docs.plasmo.com/) (Manifest V3).
- **Language**: TypeScript (Strict mode, tuyệt đối không dùng `any` bừa bãi, khai báo type rõ ràng trong `src/core/types.ts`).
- **UI**: React 18 + Tailwind CSS v3. Không cài thêm các thư viện UI component nặng (như MUI, AntD, Chakra) để giữ dung lượng extension gọn nhẹ nhất có thể.
- **Styling**: Utility classes của Tailwind CSS. Popup chạy trong sandbox riêng biệt nên class Tailwind không bị xung đột với trang web gốc.
- **Package Manager**: PNPM. Luôn dùng `pnpm` để cài đặt và quản lý dependencies.

---

## 2. Architecture & Code Conventions

### Feature-First Structure
Mỗi tính năng được đóng gói độc lập trong `src/features/<feature-name>/`:

```text
src/
├── core/                        # Types, storage wrapper, core utilities dùng chung
│   ├── storage.ts
│   └── types.ts
├── features/
│   ├── allow-right-click/
│   │   ├── logic.ts             # DOM listeners, export activate() / deactivate()
│   │   └── Toggle.tsx           # Switch UI component cho popup
│   ├── copy-link-text/
│   │   ├── background.ts        # chrome.contextMenus registration & handler
│   │   └── Toggle.tsx
│   ├── smooth-scroll/
│   │   ├── logic.ts             # Wheel listener & rAF interpolation
│   │   └── Toggle.tsx
│   └── mouse-zoom/
│       ├── logic.ts             # Alt + Wheel listener & zoom transform
│       └── Toggle.tsx
└── style.css                    # Tailwind CSS entry
```

### Script Isolation
- **Content Scripts (`content.ts`)**: Tuyệt đối **không** import React components, hooks từ UI (`popup.tsx`, `Toggle.tsx`). Chỉ import logic thuần từ `src/features/*/logic.ts` và `src/core/storage.ts`.
- **Background Service Worker (`background.ts`)**: Không thao tác DOM (`window`, `document`). Chỉ import logic service worker từ `src/features/*/background.ts`.
- **Popup (`popup.tsx`)**: Import `Toggle.tsx` từ các features và `useStorage` để bind state.

### Module Interface Contract
Mỗi module chạy trong content script (`logic.ts`) **phải** tuân theo interface:
```ts
export function activate(): void;
export function deactivate(): void;
```
Điều này đảm bảo khi người dùng gạt tắt/bật tính năng trong popup, content script có thể gọi `deactivate()` để gỡ sạch event listeners ngay lập tức mà không cần người dùng F5 tải lại trang.

### Path Alias
Sử dụng `~` làm alias cho source root:
- `~core/storage`
- `~features/allow-right-click/logic`
- `~style.css`

---

## 3. State Management Rules

Hệ thống quản lý trạng thái tuân theo mô hình 2 tầng nghiêm ngặt:

### Tầng 1: Persistent State — `@plasmohq/storage`
- Dùng cho mọi cài đặt cần lưu trữ và đồng bộ giữa **Popup ↔ Content Scripts ↔ Background Service Worker**.
- Khóa lưu trữ mặc định: `"browse_assist_settings"`.
- Tất cả schema và giá trị mặc định (`DEFAULT_SETTINGS`) phải được định nghĩa trong `src/core/types.ts`.
- **Trong React (Popup)**: Dùng hook `useStorage` từ `@plasmohq/storage/hook`.
- **Trong Content Script & Background**: Dùng instance `Storage` từ `@plasmohq/storage` và method `watch()` để lắng nghe thay đổi real-time.

### Tầng 2: Local UI State — React `useState` / `useReducer`
- Chỉ dùng cho trạng thái cục bộ, tạm thời của giao diện (ví dụ: tab đang chọn, hover state, animation state, toast notification).
- **Không dùng Zustand / Redux / Jotai** ở phiên bản hiện tại để tránh cồng kềnh và phân mảnh nguồn dữ liệu (single source of truth là `@plasmohq/storage`).

---

## 4. Skills & Runbooks

Khi thực hiện các thao tác cụ thể, tham khảo các skills trong `.agents/skills/`:
- `.agents/skills/add-feature/SKILL.md`: Quy trình chuẩn khi thêm tính năng mới.
- `.agents/skills/debug-extension/SKILL.md`: Cẩm nang debug extension trong môi trường Chrome MV3.
- `.agents/skills/plasmo-storage-patterns/SKILL.md`: Mẫu code chuẩn tương tác với storage ở từng context.
