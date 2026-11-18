import type { TranslationDict } from "./en"

export const vi: TranslationDict = {
  common: {
    enabled: "Đang bật",
    disabled: "Đang tắt",
    on: "Bật",
    off: "Tắt",
    reset: "Đặt lại",
    clear: "Xóa",
    cancel: "Hủy",
    save: "Lưu",
    back: "Quay lại",
    unassigned: "Chưa gán",
    notConfigured: "Chưa thiết lập",
    configure: "Cấu hình",
    launch: "Khởi chạy",
    all: "Tất cả",
    none: "Không"
  },
  popup: {
    searchPlaceholder: "Tìm tiện ích...",
    noResults: "Không có tiện ích nào khớp bộ lọc.",
    resetFilters: "Đặt lại bộ lọc",
    switchToList: "Chuyển sang giao diện Danh sách",
    switchToGrid: "Chuyển sang giao diện Ô gọn",
    pipBannerTitle: "Video đang ở chế độ PiP",
    pipExit: "Thoát PiP",
    supportTitle: "Ủng hộ dự án",
    categories: {
      all: "Tất cả",
      interaction: "Chuột",
      navigation: "Cuộn trang",
      media: "Đa phương tiện",
      tools: "Công cụ"
    }
  },
  preferences: {
    title: "Tùy chọn",
    appearance: "Giao diện",
    themeMode: "Chế độ màu",
    themeModeDesc: "Sáng, tối hoặc đồng bộ theo hệ điều hành.",
    viewMode: "Kiểu hiển thị",
    viewModeDesc: "Danh sách chi tiết hoặc lưới ô gọn.",
    language: "Ngôn ngữ",
    languageDesc: "Chọn ngôn ngữ giao diện hoặc theo trình duyệt.",
    languageAuto: "Tự động (Trình duyệt)",
    navigation: "Điều hướng",
    searchAndFilter: "Thanh tìm kiếm & Lọc nhóm",
    searchAndFilterDesc:
      "Hiển thị thanh tìm kiếm và các nút lọc nhóm ở đầu popup chính.",
    rememberLastView: "Nhớ trang cài đặt cuối",
    rememberLastViewDesc:
      "Mở lại popup tại trang cài đặt bạn đang xem trước đó.",
    sessionTimeout: "Thời gian lưu phiên",
    customizeMenu: "Tùy chỉnh Menu",
    customizeMenuDesc:
      "Kéo thả để sắp xếp thứ tự hiển thị hoặc ẩn/hiện các tính năng."
  },
  about: {
    title: "Giới thiệu",
    projectAndLegal: "Dự án & Pháp lý",
    homePage: "Trang chủ",
    terms: "Điều khoản",
    policy: "Chính sách",
    openSourceLibraries: "Thư viện mã nguồn mở",
    declaredPermissions: "Quyền đã khai báo",
    permissions: {
      storage: "Lưu trữ cài đặt và tùy chọn cá nhân cục bộ trên thiết bị.",
      contextMenus:
        "Cung cấp các tác vụ chuột phải nhanh như sao chép liên kết sạch.",
      clipboardWrite:
        "Sao chép mã màu đã chọn và liên kết định dạng Markdown.",
      search:
        "Tìm kiếm văn bản đã chọn bằng công cụ tìm kiếm mặc định khi dùng Super Drag."
    }
  },
  features: {
    allowRightClick: {
      title: "Allow Right Click",
      description:
        "Mở khóa chuột phải, bôi đen và sao chép trên các trang web hạn chế.",
      popupDesc:
        "Bật menu chuột phải và sao chép trên tab hiện tại mà không ảnh hưởng tab khác.",
      toastEnabled: "Đã bật Chuột phải",
      toastDisabled: "Đã tắt Chuột phải",
      currentTab: "Tab hiện tại"
    },
    contextMenuActions: {
      title: "Context Menu Actions",
      description:
        "Thêm các tác vụ chuột phải hữu ích như sao chép liên kết sạch hoặc Markdown.",
      activeCount: "{{count}}/6 Đang bật",
      copyLinkText: "Sao chép chữ liên kết",
      cleanLinkCopy: "Sao chép liên kết sạch",
      markdownLinkCopy: "Sao chép liên kết Markdown",
      copyCleanPageUrl: "Sao chép URL trang sạch",
      copyPageMarkdown: "Sao chép trang dạng Markdown",
      copySelectionQuote: "Sao chép đoạn chọn dạng Trích dẫn"
    },
    superDrag: {
      title: "Super Drag",
      description:
        "Kéo văn bản để tìm kiếm nhanh hoặc kéo liên kết để mở trong tab mới."
    },
    quickScroll: {
      title: "Quick Scroll Buttons",
      description:
        "Các nút nổi thông minh giúp cuộn mượt lên đầu hoặc xuống cuối trang."
    },
    smoothScroll: {
      title: "Smooth Scrolling",
      description:
        "Cuộn trang mượt mà, tự nhiên với thuật toán nội suy vật lý."
    },
    mouseZoom: {
      title: "Mouse Pin-to-Zoom",
      description:
        "Giữ phím bổ trợ và cuộn chuột để phóng to/thu nhỏ ngay tại vị trí con trỏ."
    },
    pictureInPicture: {
      title: "Universal Picture-in-Picture",
      description:
        "Bật/tắt cửa sổ video nổi bằng phím tắt hoặc nút di chuột trên video."
    },
    videoWheelControl: {
      title: "Video Wheel Control",
      description:
        "Điều chỉnh âm lượng, tốc độ phát và tua video bằng con lăn chuột."
    },
    colorPicker: {
      title: "Color Picker",
      description:
        "Chấm màu từng pixel trên màn hình và sao chép nhanh nhiều định dạng."
    },
    elementToys: {
      title: "Element Toys",
      description:
        "Kiểm tra, xóa, sửa chữ hoặc di chuyển phần tử trực tiếp trên trang web."
    },
    quickHub: {
      title: "Quick Hub",
      description:
        "Bảng truy cập nhanh các công cụ ngay trên trang khi rê chuột vào cạnh."
    },
    imageHoverPreview: {
      title: "Image Hover Preview",
      description:
        "Di chuột lên ảnh thu nhỏ hoặc liên kết ảnh để xem trước kích thước lớn."
    }
  }
}
