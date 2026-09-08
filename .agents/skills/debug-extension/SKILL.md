---
name: debug-extension
description: >-
  Cẩm nang chi tiết hướng dẫn debug extension Chrome Manifest V3 tạo bởi Plasmo,
  bao gồm kiểm tra Popup, Content Scripts, Service Worker và xử lý lỗi thường gặp.
---

# Cẩm nang Debug Extension Chrome (Manifest V3)

Khi phát triển với Plasmo, extension được build vào thư mục:
- Dev build: `build/chrome-mv3-dev`
- Prod build: `build/chrome-mv3-prod`

## 1. Nạp Extension vào Chrome

1. Mở trình duyệt Chrome và truy cập `chrome://extensions/`.
2. Bật công tắc **Developer mode** ở góc trên cùng bên phải.
3. Nhấp nút **Load unpacked** (Tải tiện ích đã giải nén).
4. Chọn thư mục: `g:\BrowserExtensions\browse-assist\build\chrome-mv3-dev`.

---

## 2. Debug các thành phần độc lập

Trong Manifest V3, extension có 3 môi trường thực thi hoàn toàn tách biệt:

### A. Debug Popup UI
- Click chuột phải vào biểu tượng của Browse Assist trên thanh công cụ trình duyệt.
- Chọn **Inspect popup** (Kiểm tra cửa sổ bật lên).
- Cửa sổ DevTools riêng sẽ mở ra:
  - Tab **Elements**: Xem cấu trúc DOM và class Tailwind CSS.
  - Tab **Console**: Xem log và lỗi React render.
  - Tab **Application > Storage > Extension Storage**: Kiểm tra trực tiếp dữ liệu lưu trong `chrome.storage.local`.

### B. Debug Content Scripts (Chạy trên trang web)
- Mở một trang web bất kỳ (ví dụ: https://example.com).
- Nhấn `F12` hoặc click chuột phải > **Inspect** để mở DevTools của trang.
- Chuyển sang tab **Console**:
  - Tại dropdown context (mặc định là `top`), chuyển sang `Browse Assist (Extension)` để thực thi code trong context của extension, hoặc quan sát các log do `content.ts` xuất ra.
- Chuyển sang tab **Sources**:
  - Ở panel bên trái, mở mục **Content scripts** > tìm tên extension để đặt breakpoint trong code của `content.ts` và các file `logic.ts`.

### C. Debug Service Worker (Background)
- Truy cập `chrome://extensions/`.
- Tìm thẻ của **Browse Assist**.
- Click vào đường link màu xanh **service worker** (bên cạnh dòng "Inspect views").
- Cửa sổ DevTools của background sẽ xuất hiện để debug context menu, lifecycle events và background listeners.

---

## 3. Các lỗi phổ biến & cách khắc phục

| Lỗi | Nguyên nhân | Cách khắc phục |
|---|---|---|
| `Cannot preventDefault inside passive event listener` | Listener `wheel` bị Chrome mặc định là passive | Khai báo tùy chọn `{ passive: false }` khi gọi `addEventListener("wheel", fn, { passive: false })`. |
| Storage không cập nhật giữa Popup và Content Script | Thiếu quyền `storage` hoặc key không khớp | Kiểm tra `"storage"` trong `permissions` của `package.json` và kiểm tra key name. |
| Context menu không xuất hiện | Service worker chưa đăng ký hoặc chưa cập nhật | Mở `chrome://extensions/`, bấm biểu tượng Reload vòng tròn trên card extension. |
| CSS Tailwind không nhận | File CSS chưa được import hoặc chưa qua build | Kiểm tra `import "~style.css"` trong `popup.tsx` và cấu hình `postcss.config.js`. |
