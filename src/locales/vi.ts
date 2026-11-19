import type { TranslationDict } from "./en"

export const vi: TranslationDict = {
  common: {
    appName: "Browse Assist",
    appSlogan: "Tăng tốc trải nghiệm duyệt web của bạn",
    appDescription:
      "Bộ công cụ tiện ích nhẹ, mô-đun hóa giúp tăng năng suất và nâng tầm trải nghiệm duyệt web.",
    enabled: "Đang bật",
    disabled: "Đang tắt",
    reset: "Đặt lại",
    clear: "Xóa",
    cancel: "Hủy",
    gotIt: "Đã hiểu",
    viewportScreen: "Màn hình hiển thị",
    unassigned: "Chưa gán",
    launch: "Khởi chạy",
    all: "Tất cả",
    none: "Không",
    customizeShortcuts: "Tùy chỉnh trong cài đặt phím tắt trình duyệt",
    shortcutNotAssignedTip:
      "Chưa gán phím tắt. Nhấp để cài đặt trong trình duyệt",
    customizeShortcutTip: "Nhấp để tùy chỉnh phím tắt trong cài đặt trình duyệt",
    backTip: "Quay lại (Backspace hoặc `)",
    toggleFeatureAria: "Bật/tắt {{feature}}",
    resetOrder: "Đặt lại thứ tự",
    show: "Hiện",
    hide: "Ẩn",
    center: "Giữa",
    left: "Trái",
    right: "Phải",
    top: "Trên",
    bottom: "Dưới",
    unstable: "Thử nghiệm",
    screenPosition: "Vị trí trên màn hình",
    buttonOpacity: "Độ mờ nút",
    buttonShape: "Hình dạng nút",
    shapes: {
      circle: "Hình tròn",
      capsule: "Viên nhộng",
      rounded: "Bo góc",
      pill: "Viên thuốc"
    },
    modifiers: {
      alt: "Alt",
      shift: "Shift",
      ctrl: "Ctrl",
      altKey: "Phím Alt",
      shiftKey: "Phím Shift",
      rightClick: "Chuột phải",
      leftClick: "Chuột trái"
    }
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
    },
    tooltips: {
      preferencesAndTheme: "Tùy chọn & Giao diện",
      about: "Giới thiệu Browse Assist",
      supportDonate: "Ủng hộ dự án",
      jumpToVideoTab: "Nhấp để chuyển tới tab video này",
      exitPipWindow: "Thoát cửa sổ Picture-in-Picture"
    }
  },
  preferences: {
    title: "Tùy chọn",
    appearance: "Giao diện",
    themeMode: "Chế độ màu",
    themeModeDesc: "Sáng, tối hoặc đồng bộ theo hệ điều hành.",
    themeDark: "Tối",
    themeLight: "Sáng",
    themeSystem: "Hệ thống",
    viewMode: "Kiểu hiển thị",
    viewModeDesc: "Danh sách chi tiết hoặc lưới ô gọn.",
    viewModeList: "Danh sách",
    viewModeGrid: "Lưới",
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
    minutesShort: "{{count}} phút",
    tickOneMin: "1 phút",
    tickTenMinDefault: "10 phút (Mặc định)",
    tickSixtyMin: "60 phút",
    customizeMenu: "Tùy chỉnh Menu",
    customizeMenuDesc:
      "Kéo thả để sắp xếp thứ tự hiển thị hoặc ẩn/hiện các tính năng.",
    presets: "Mẫu sẵn",
    presetReading: "Đọc & Điều hướng",
    presetReadingDesc: "Cuộn, kéo & đọc",
    presetDesigner: "Thiết kế & Lập trình",
    presetDesignerDesc: "Màu sắc, kiểm tra & sửa",
    presetEssential: "Cơ bản tối giản",
    presetEssentialDesc: "Gọn nhẹ & tập trung",
    other: "Khác",
    optionsPage: "Trang Tùy chọn Mở rộng",
    optionsPageDesc: "Bảng cài đặt đầy đủ & hướng dẫn phím tắt"
  },
  donate: {
    buyMeACoffeeDesc: "Ủng hộ duy trì dự án bằng một ly cà phê",
    githubSponsorsDesc: "Tài trợ qua GitHub theo tháng hoặc một lần",
    vietqrDesc: "Chuyển khoản ngân hàng nhanh qua VietQR (Việt Nam)",
    authorDonateLabel: "Trang ủng hộ tác giả",
    authorDonateDesc: "Ủng hộ trực tiếp cho tác giả"
  },
  dialogs: {
    firefoxGuide: {
      title: "Hướng dẫn cài đặt phím tắt Firefox",
      intro:
        "Phím tắt có thể được tùy chỉnh trực tiếp trong phần cài đặt tiện ích của trình duyệt:",
      step1Prefix: "Mở tab mới trong Firefox và truy cập",
      copyUrlTip: "Nhấp để sao chép URL",
      step2Prefix: "Nhấp vào",
      step2Target: "Biểu tượng bánh răng ⚙",
      step2Suffix: "ở góc trên bên phải của trang Quản lý Tiện ích.",
      step3Prefix: "Chọn",
      step3Target: "'Quản lý phím tắt tiện ích'",
      step3Suffix: "từ menu thả xuống.",
      step4Prefix: "Tìm",
      step4Suffix: "và gán phím tắt bạn muốn cho từng lệnh."
    }
  },
  options: {
    title: "Cài đặt Browse Assist",
    subtitle: "Cấu hình bộ công cụ tiện ích duyệt web và phím tắt của bạn",
    openPopup: "Mở Popup",
    openPopupTip: "Mở popup tiện ích",
    preferences: "Tùy chọn",
    preferencesTip: "Mở trang tùy chọn trong popup",
    about: "Giới thiệu",
    aboutTip: "Mở thông tin giới thiệu trong popup",
    activeModules: "Các mô-đun đang hoạt động",
    configureInPopup: "Cấu hình {{feature}} trong popup",
    shortcutsTitle: "Bảng tham chiếu Phím tắt & Thao tác chuột",
    shortcutsSubtitle:
      "Phím tắt trình duyệt theo thời gian thực và cử chỉ tương tác",
    customizeShortcuts: "Tùy chỉnh phím tắt",
    table: {
      action: "Tác vụ",
      shortcut: "Phím tắt / Kích hoạt",
      description: "Mô tả"
    },
    triggers: {
      mouseWheel: "{{modifier}} + Con lăn chuột",
      mouseDrag: "Kéo chuột",
      doubleClickMargin: "Nhấp đúp lề màn hình",
      rightClickLink: "Chuột phải vào liên kết"
    },
    shortcuts: {
      pip: {
        name: "Hình trong hình (PiP)",
        desc: "Tách video đang phát ra cửa sổ PiP nổi"
      },
      allowRightClick: {
        name: "Cho phép chuột phải",
        desc: "Bật/tắt mở khóa menu chuột phải và sao chép trên tab hiện tại"
      },
      elementToys: {
        name: "Công cụ phần tử",
        desc: "Kích hoạt chế độ trỏ-nhấp để xóa, sửa, ẩn hoặc di chuyển phần tử"
      },
      colorPicker: {
        name: "Chấm màu",
        desc: "Bật kính lúp chấm màu màn hình để kiểm tra và sao chép mã màu"
      },
      quickHub: {
        name: "Phím tắt Trung tâm nhanh",
        desc: "Bật/tắt bảng công cụ nổi Trung tâm nhanh bằng bàn phím"
      },
      volume: {
        name: "Điều chỉnh âm lượng video",
        desc: "Di chuột lên video để chỉnh âm lượng; giữ phím và nhấp để tắt tiếng"
      },
      speed: {
        name: "Điều chỉnh tốc độ video",
        desc: "Di chuột lên video để chỉnh tốc độ phát mượt mà; nhấp để toàn màn hình"
      },
      seek: {
        name: "Tua video & Từng khung hình",
        desc: "Tua tiến/lùi; tua từng khung hình khi video đang tạm dừng"
      },
      boost: {
        name: "Tăng tốc video",
        desc: "Giữ phím X trên video để tạm thời tăng tốc lên {{speed}}x"
      },
      mouseZoom: {
        name: "Thu phóng theo con trỏ",
        desc: "Thu phóng trang mượt mà lấy tâm ngay tại vị trí con trỏ chuột"
      },
      superDrag: {
        name: "Siêu kéo thả",
        desc: "Kéo văn bản để tìm kiếm trong tab mới; kéo liên kết để mở tab nền"
      },
      quickScroll: {
        name: "Nút cuộn nhanh",
        desc: "Nhấp đúp lề màn hình hoặc bấm nút nổi để nhảy lên đầu/cuối trang"
      },
      smoothScroll: {
        name: "Cuộn mượt",
        desc: "Nội suy vật lý có quán tính trên mọi vùng chứa có thanh cuộn"
      },
      cleanLink: {
        name: "Sao chép liên kết sạch",
        desc: "Loại bỏ tham số theo dõi (utm_*, fbclid) và sao chép liên kết sạch/Markdown"
      },
      quickHubZone: {
        name: "Vùng kích hoạt Trung tâm nhanh",
        desc: "Đưa chuột vào vùng góc màn hình để mở bảng công cụ nhanh"
      }
    },
    storage: {
      title: "Bộ nhớ & Dữ liệu Tiện ích",
      desc: "Xóa vĩnh viễn mọi dữ liệu và cài đặt của Browse Assist đã lưu trong trình duyệt. Thao tác này sẽ xóa cấu hình tùy chỉnh, phím tắt, thứ tự Trung tâm nhanh và lịch sử chấm màu.",
      clearAll: "Xóa toàn bộ dữ liệu...",
      cleared:
        "Toàn bộ dữ liệu tiện ích đã được xóa và khôi phục về mặc định.",
      footer:
        "Browse Assist • Manifest V3 • Xây dựng với Plasmo, React & Tailwind CSS"
    },
    modal: {
      title: "Xóa toàn bộ dữ liệu tiện ích?",
      body: "Thao tác này sẽ xóa vĩnh viễn mọi dữ liệu của Browse Assist trên hồ sơ trình duyệt của bạn.",
      listHeader: "Những mục sau sẽ bị xóa:",
      item1: "Trạng thái bật/tắt của tất cả tính năng & cấu hình con",
      item2: "Thứ tự Trung tâm nhanh, tác vụ ghim & mô-đun đang ẩn",
      item3: "Lịch sử màu trong công cụ Chấm màu",
      item4: "Tùy chọn giao diện và bộ nhớ điều hướng popup",
      warning:
        "⚠️ Không thể hoàn tác thao tác này. Mọi cài đặt sẽ quay về mặc định ngay lập tức.",
      clearing: "Đang xóa dữ liệu...",
      confirm: "Có, xóa toàn bộ dữ liệu"
    }
  },
  content: {
    copied: {
      linkText: "Đã sao chép chữ liên kết",
      cleanLink: "Đã sao chép liên kết sạch",
      markdown: "Đã sao chép Markdown",
      cleanPageUrl: "Đã sao chép URL trang sạch",
      pageMarkdown: "Đã sao chép trang Markdown",
      quote: "Đã sao chép trích dẫn",
      text: "Đã sao chép văn bản",
      imageLink: "Đã sao chép liên kết ảnh",
      linkUrl: "Đã sao chép URL liên kết"
    },
    fabMenu: {
      movePosition: "Di chuyển vị trí",
      hideOnTab: "Ẩn trên tab này",
      disableFeature: "Tắt {{feature}}",
      disablePipHoverButton: "Tắt nút PiP khi di chuột",
      dragHint: "Di chuyển chuột tới cạnh & nhấp để đặt • Esc để hủy",
      positionSaved: "Đã lưu vị trí",
      hiddenOnTab: "Đã ẩn {{feature}} trên tab này"
    }
  },
  about: {
    title: "Giới thiệu",
    projectAndLegal: "Dự án & Pháp lý",
    homePage: "Trang chủ",
    terms: "Điều khoản",
    policy: "Chính sách",
    openSourceLibraries: "Thư viện mã nguồn mở",
    declaredPermissions: "Quyền đã khai báo",
    permissionNames: {
      storage: "Lưu trữ",
      contextMenus: "Menu ngữ cảnh",
      clipboardWrite: "Bảng nhớ tạm",
      search: "Tìm kiếm"
    },
    permissions: {
      storage: "Lưu trữ cài đặt và tùy chọn cá nhân cục bộ trên thiết bị.",
      contextMenus:
        "Cung cấp các tác vụ chuột phải nhanh như sao chép liên kết sạch.",
      clipboardWrite:
        "Sao chép mã màu đã chọn và liên kết định dạng Markdown.",
      search:
        "Tìm kiếm văn bản đã chọn bằng công cụ tìm kiếm mặc định khi dùng Siêu kéo thả."
    }
  },
  features: {
    allowRightClick: {
      title: "Cho phép chuột phải",
      description:
        "Mở khóa chuột phải, bôi đen và sao chép trên các trang web hạn chế.",
      popupDesc:
        "Bật menu chuột phải và sao chép trên tab hiện tại mà không ảnh hưởng tab khác.",
      toastEnabled: "Đã bật Chuột phải",
      toastDisabled: "Đã tắt Chuột phải",
      currentTab: "Tab hiện tại"
    },
    contextMenuActions: {
      title: "Tác vụ chuột phải",
      description:
        "Thêm các tác vụ chuột phải hữu ích như sao chép liên kết sạch hoặc Markdown.",
      activeCount: "{{count}}/6 Đang bật",
      copyLinkText: "Sao chép chữ liên kết",
      cleanLinkCopy: "Sao chép liên kết sạch",
      markdownLinkCopy: "Sao chép liên kết Markdown",
      copyCleanPageUrl: "Sao chép URL trang sạch",
      copyPageMarkdown: "Sao chép trang dạng Markdown",
      copySelectionQuote: "Sao chép đoạn chọn dạng Trích dẫn",
      settings: {
        sectionTitle: "Các mục menu chuột phải",
        sectionDesc:
          "Kéo để sắp xếp lại thứ tự hoặc bật/tắt hiển thị trong menu chuột phải.",
        badges: {
          textOnly: "Chỉ chữ",
          antiTracking: "Chống theo dõi",
          markdown: "[Chữ](URL)",
          page: "Trang",
          selection: "Vùng chọn"
        },
        descriptions: {
          copyLinkText:
            "Trích xuất và sao chép chữ hiển thị của liên kết mà không kèm URL.",
          cleanLinkCopy:
            "Loại bỏ tham số theo dõi (utm_*, fbclid, si) trước khi sao chép.",
          markdownLinkCopy:
            "Sao chép liên kết định dạng Markdown, lý tưởng cho Obsidian, Notion & GitHub.",
          copyCleanPageUrl:
            "Chuột phải bất kỳ đâu trên trang để sao chép URL đã làm sạch tham số theo dõi.",
          copyPageMarkdown:
            "Sao chép tiêu đề trang hiện tại và URL sạch dạng [Tiêu đề](URL).",
          copySelectionQuote:
            "Sao chép văn bản đang chọn thành khối trích dẫn Markdown kèm liên kết nguồn."
        }
      }
    },
    superDrag: {
      title: "Siêu kéo thả",
      description:
        "Kéo văn bản để tìm kiếm nhanh hoặc kéo liên kết để mở trong tab mới.",
      settings: {
        dragTargets: "Đối tượng kéo",
        tabs: {
          text: "Văn bản",
          link: "Liên kết",
          image: "Hình ảnh"
        },
        searchText: "Tìm kiếm văn bản đã chọn",
        searchTextDesc:
          "Kéo văn bản đã bôi đen theo 4 hướng để tìm kiếm, mở cửa sổ hoặc sao chép.",
        textDisabled: "Tính năng kéo văn bản hiện đang tắt.",
        openLinks: "Mở siêu liên kết",
        openLinksDesc:
          "Kéo liên kết để mở trong tab, cửa sổ mới hoặc sao chép URL/chữ liên kết.",
        linksDisabled: "Tính năng kéo liên kết hiện đang tắt.",
        dragImages: "Kéo hình ảnh",
        dragImagesDesc:
          "Kéo hình ảnh để xem trong tab, cửa sổ mới hoặc sao chép URL ảnh trực tiếp.",
        imagesDisabled: "Tính năng kéo hình ảnh hiện đang tắt.",
        displayFeedback: "Hiển thị & Phản hồi",
        dragIndicator: "Chỉ báo trực quan khi kéo",
        dragIndicatorDesc:
          "Chọn kiểu hiển thị phản hồi trực quan trong lúc kéo phần tử.",
        indicatorStyles: {
          none: "Tắt",
          badge: "Nhãn nổi",
          radial: "Vòng tròn hướng"
        },
        directionalGestures: "Cử chỉ theo hướng",
        actions: {
          open_bg_tab: "Tab nền",
          open_active_tab: "Tab mới (chuyển tới)",
          open_window_active: "Cửa sổ mới",
          open_incognito_active: "Cửa sổ ẩn danh",
          none: "Không làm gì",
          copy_to_clipboard: "Sao chép",
          copy_link_text: "Sao chép chữ liên kết",
          copy_link_url: "Sao chép URL liên kết",
          copy_markdown: "Sao chép Markdown",
          copy_image_link: "Sao chép liên kết ảnh",
          search_image: "Tìm kiếm hình ảnh"
        }
      },
      logic: {
        types: {
          search: "Tìm kiếm",
          image: "Hình ảnh",
          link: "Liên kết"
        },
        dropOpenBackground: "Thả để mở {{type}} (Tab nền)",
        shortOpenBackground: "{{type}} (Tab nền)",
        dropOpenActive: "Thả để mở {{type}} (Tab mới)",
        shortOpenActive: "{{type}} (Tab mới)",
        dropOpenWindow: "Thả để mở {{type}} (Cửa sổ mới)",
        shortOpenWindow: "{{type}} (Cửa sổ mới)",
        dropOpenIncognito: "Thả để mở {{type}} (Ẩn danh)",
        shortOpenIncognito: "{{type}} (Ẩn danh)",
        dropCopyLinkText: "Thả để sao chép chữ liên kết",
        shortCopyLinkText: "Sao chép chữ liên kết",
        dropCopyMarkdown: "Thả để sao chép Markdown",
        shortCopyMarkdown: "Sao chép Markdown",
        dropSearchImage: "Thả để tìm kiếm hình ảnh",
        shortSearchImage: "Tìm kiếm hình ảnh",
        dropCopyText: "Thả để sao chép văn bản",
        shortCopyText: "Sao chép văn bản",
        dropCopyImageLink: "Thả để sao chép liên kết ảnh",
        shortCopyImageLink: "Sao chép liên kết ảnh",
        dropCopyLinkUrl: "Thả để sao chép URL liên kết",
        shortCopyLinkUrl: "Sao chép URL liên kết",
        noAction: "Không có hành động",
        releaseToCancel: "Thả ra để hủy",
        exceededMax: "Vượt quá khoảng cách tối đa (Thả để hủy)"
      }
    },
    quickScroll: {
      title: "Nút cuộn nhanh",
      description:
        "Các nút nổi thông minh giúp cuộn mượt lên đầu hoặc xuống cuối trang.",
      settings: {
        buttonPlacement: "Vị trí đặt nút",
        buttonPlacementDesc:
          "Kéo hoặc nhấp dọc theo cạnh trái/phải để neo các nút cuộn nổi.",
        controlsStyle: "Điều khiển & Kiểu dáng",
        buttonSelection: "Lựa chọn nút",
        buttonSelectionDesc: "Hiện cả hai nút lên/xuống hoặc chỉ nút lên đầu trang.",
        modes: {
          both: "Đầu & Cuối",
          topOnly: "Chỉ lên đầu"
        },
        buttonShapeDesc: "Chọn hình tròn, viên nhộng gộp hoặc vuông bo góc.",
        buttonOpacityDesc: "Điều chỉnh độ trong suốt khi không di chuột vào.",
        behaviorIntel: "Hành vi & Thông minh",
        autoDim: "Tự làm mờ khi nghỉ",
        autoDimDesc:
          "Làm mờ nút khi bạn ngừng cuộn; hiện rõ ngay khi di chuột vào.",
        scrollMemory: "Nhớ vị trí cuộn",
        scrollMemoryDesc:
          "Lưu vị trí đang đọc trước khi nhảy trang, cho phép quay lại chỉ với 1 nhấp.",
        hideOnNative: "Ẩn nếu trang có nút cuộn sẵn",
        hideOnNativeDesc:
          "Tự động ẩn khi trang web đã có sẵn nút cuộn lên đầu trang cố định."
      },
      logic: {
        scrollToTop: "Cuộn lên đầu trang",
        scrollToBottom: "Cuộn xuống cuối trang",
        returnToPrevious: "Quay lại vị trí trước đó"
      }
    },
    smoothScroll: {
      title: "Cuộn mượt",
      description:
        "Cuộn trang mượt mà, tự nhiên với thuật toán nội suy vật lý.",
      settings: {
        profiles: "Cấu hình có sẵn",
        presetBalanced: "Cân bằng",
        presetUltra: "Siêu mượt",
        presetSnappy: "Nhanh nhạy",
        presetCustom: "Tùy chỉnh",
        fineTuning: "Tinh chỉnh chi tiết",
        scrollDistance: "Quãng đường cuộn",
        glidingDuration: "Thời gian lướt",
        ignoreTouchpad: "Bỏ qua Touchpad",
        ignoreTouchpadDesc:
          "Giữ nguyên quán tính tự nhiên của trackpad hệ điều hành bằng cách bỏ qua cuộn bước nhỏ.",
        keyboardScroll: "Cuộn mượt bằng bàn phím",
        keyboardScrollDesc:
          "Nội suy cuộn mượt mà cho các phím Mũi tên, PageUp/Down và Space.",
        aggressiveMode: "Can thiệp mạnh (Aggressive)",
        aggressiveModeDesc:
          "Ép buộc cuộn mượt trên mọi trang web. Hãy tắt để bảo vệ các ứng dụng canvas/web (như Konva, Figma, Maps)."
      }
    },
    mouseZoom: {
      title: "Thu phóng theo con trỏ",
      description:
        "Giữ phím bổ trợ và cuộn chuột để phóng to/thu nhỏ ngay tại vị trí con trỏ.",
      settings: {
        resetZoomTooltip: "Đặt lại thu phóng về 100% trên tab hiện tại",
        triggerModifier: "Phím bổ trợ kích hoạt",
        zoomSensitivity: "Độ nhạy thu phóng",
        stepIncrement: "Bước nhảy thu phóng",
        tickFine: "4% (Mịn)",
        tickDefault: "10% (Mặc định)",
        tickFast: "25% (Nhanh)",
        behaviorDisplay: "Hành vi & Hiển thị",
        smoothAnimation: "Hiệu ứng mượt mà",
        smoothAnimationDesc:
          "Nội suy chuyển động thu phóng mượt mà để cảm giác tự nhiên hơn.",
        invertDirection: "Đảo chiều cuộn",
        invertDirectionDesc: "Cuộn xuống để phóng to, cuộn lên để thu nhỏ.",
        showZoomToast: "Hiện nhãn phần trăm",
        showZoomToastDesc:
          "Hiển thị nhãn phần trăm thu phóng nổi ở góc trên bên phải trang."
      },
      logic: {
        pageZoom: "Thu phóng trang"
      }
    },
    pictureInPicture: {
      title: "Hình trong hình (PiP)",
      description:
        "Bật/tắt cửa sổ video nổi bằng phím tắt hoặc nút di chuột trên video.",
      settings: {
        shortTitle: "Picture-in-Picture",
        globalShortcut: "Phím tắt toàn cục",
        globalShortcutDesc: "Bật/tắt cửa sổ video nổi",
        displayFeedback: "Hiển thị & Phản hồi",
        extensionBadge: "Nhãn trạng thái trên biểu tượng",
        extensionBadgeDesc:
          "Hiện chữ “PiP” trên biểu tượng tiện ích khi có video đang phát ở chế độ PiP.",
        actionToast: "Thông báo hành động",
        actionToastDesc:
          "Hiện thông báo ngắn xác nhận khi bật hoặc thoát chế độ PiP.",
        autoPauseOnExit: "Tự tạm dừng khi thoát PiP",
        autoPauseOnExitDesc:
          "Tự động tạm dừng video khi đóng cửa sổ Picture-in-Picture.",
        hoverButton: "Nút PiP khi di chuột lên video",
        hoverButtonDesc:
          "Hiện nút kích hoạt PiP nổi bên trong video đang phát. Có thể không ổn định trên một số trình phát tùy chỉnh.",
        buttonPosition: "Vị trí nút",
        edgeAlignment: "Cạnh & Căn lề",
        edgeAlignmentDesc:
          "Kéo hoặc nhấp dọc theo các cạnh để neo nút PiP nổi bên trong khung hình video.",
        buttonOpacityDesc: "Điều chỉnh độ mờ của nút khi không di chuột vào."
      },
      logic: {
        watchInPip: "Xem ở chế độ Picture-in-Picture",
        exitedPip: "Đã thoát Picture-in-Picture",
        enteredPip: "Đã bật Picture-in-Picture",
        notSupported: "Trình duyệt này không hỗ trợ PiP",
        cannotEnter: "Không thể bật Picture-in-Picture",
        noVideoFound: "Không tìm thấy video trên trang"
      },
      background: {
        playing: "Đang phát trong PiP: {{title}}",
        untitledVideo: "Video"
      }
    },
    videoWheelControl: {
      title: "Điều khiển video bằng cuộn",
      description:
        "Điều chỉnh âm lượng, tốc độ phát và tua video bằng con lăn chuột.",
      settings: {
        tabs: {
          volume: "Âm lượng",
          speed: "Tốc độ",
          seek: "Tua video",
          extra: "Mở rộng"
        },
        conflictTitle: "Phát hiện trùng phím bổ trợ",
        conflictDesc:
          "Có từ hai điều khiển đang bật trở lên dùng chung phím bổ trợ (ưu tiên Tua > Tốc độ > Âm lượng). Hãy chọn phím khác nhau để tránh xung đột.",
        modifierKey: "Phím bổ trợ",
        modifierKeyDesc: "Giữ phím + cuộn chuột trên video",
        volumeControl: "Điều chỉnh âm lượng",
        volumeStep: "Bước chỉnh âm lượng",
        clickToMute: "Nhấp để tắt/bật tiếng",
        clickToMuteDesc: "Nhấp vào video khi đang giữ {{key}} để tắt/bật tiếng.",
        invertVolume: "Đảo chiều cuộn âm lượng",
        invertVolumeDesc: "Đảo ngược hướng cuộn chuột khi chỉnh âm lượng.",
        speedControl: "Điều chỉnh tốc độ",
        speedStep: "Bước chỉnh tốc độ",
        holdXBoost: "Giữ 'X' để tăng tốc (2.0x)",
        holdXBoostDesc:
          "Giữ phím 'X' khi đang xem video để tăng tốc tạm thời lên 2.0x.",
        clickToFullscreen: "Nhấp để toàn màn hình",
        clickToFullscreenDesc:
          "Nhấp vào video khi đang giữ {{key}} để bật/tắt toàn màn hình.",
        invertSpeed: "Đảo chiều cuộn tốc độ",
        invertSpeedDesc: "Đảo ngược hướng cuộn chuột khi chỉnh tốc độ phát.",
        seekControl: "Tua video",
        seekStep: "Bước tua (Giây)",
        frameStepper: "Tua từng khung hình (Frame)",
        frameStepperDesc:
          "Khi video đang tạm dừng, cuộn chuột sẽ tua từng khung hình (~1/30 giây).",
        invertSeek: "Đảo chiều cuộn tua",
        invertSeekDesc: "Đảo ngược hướng cuộn chuột khi tua video.",
        screenshot: "Chụp ảnh video (Shift+Alt+Click)",
        screenshotDesc:
          "Chụp khung hình video hiện tại trực tiếp vào clipboard dưới dạng PNG.",
        osd: "Hiển thị trên màn hình (OSD)",
        osdDesc:
          "Hiện nhãn HUD nổi gọn gàng cho âm lượng, tốc độ, tua và tăng tốc.",
        osdOpacity: "Độ mờ OSD",
        osdOpacityDesc: "Điều chỉnh độ trong suốt của nhãn OSD nổi.",
        noticeTitle: "Lưu ý tương thích & Trạng thái",
        noticeBody1:
          "Tính năng này tương tác trực tiếp với thẻ media HTML5 (<video>).",
        noticeBody2:
          "Trên một số nền tảng web lớn, trình quản lý trạng thái riêng của trang có thể đặt lại tốc độ phát hoặc trạng thái tắt tiếng khi video lặp lại, đổi độ phân giải hoặc tự chuyển bài."
      },
      logic: {
        muted: "Đã tắt tiếng",
        fullscreen: "Toàn màn hình",
        exitFullscreen: "Thoát toàn màn hình",
        frameCopied: "Đã sao chép khung hình!",
        captureFailed: "Chụp ảnh thất bại",
        clipboardDenied: "Clipboard bị từ chối",
        corsProtected: "Bị chặn bởi CORS",
        frameStep: "Khung {{sign}} ({{time}})",
        boost: "⚡ Tăng tốc {{rate}}x"
      }
    },
    colorPicker: {
      title: "Chấm màu",
      description:
        "Chấm màu từng pixel trên màn hình và sao chép nhanh nhiều định dạng.",
      settings: {
        shortcutTitle: "Phím tắt chấm màu",
        shortcutDesc: "Kích hoạt nhanh công cụ chấm màu màn hình",
        recentColors: "Màu đã chấm gần đây",
        clearHistoryTooltip: "Xóa toàn bộ lịch sử màu gần đây",
        clickToCopy: "Nhấp để sao chép {{value}}",
        noRecentColors:
          "Chưa có màu nào được chấm gần đây. Hãy dùng phím tắt hoặc nút Khởi chạy ở trên.",
        defaultFormat: "Định dạng sao chép mặc định",
        clipboardFormat: "Định dạng mã màu Clipboard",
        clipboardFormatDesc:
          "Chuẩn mã màu tự động được sao chép khi chấm màu.",
        behaviorFeedback: "Hành vi & Phản hồi",
        autoCopy: "Tự động sao chép vào Clipboard",
        autoCopyDesc:
          "Tự động sao chép giá trị màu vừa chọn ngay sau khi chấm",
        showPalette: "Hiện bảng màu nổi",
        showPaletteDesc:
          "Hiện hộp thoại bảng màu HEX / RGB / HSL tương tác sau khi chấm",
        feedbackNotification: "Thông báo phản hồi",
        feedbackDisabledDesc: "Bị tắt khi Bảng màu nổi đang hoạt động",
        feedbackEnabledDesc: "Hiện thông báo xác nhận khi chấm màu thành công"
      },
      logic: {
        copiedColor: "Đã sao chép mã màu",
        notSupported: "Trang hoặc trình duyệt này không hỗ trợ EyeDropper",
        pickedAndCopied: "Đã chấm & sao chép màu",
        picked: "Đã chấm màu",
        couldNotOpen: "Không thể mở công cụ chấm màu",
        permissionRequired: "Cần tương tác người dùng hoặc không được cấp phép",
        palette: {
          pickedColor: "Màu đã chấm",
          close: "Đóng",
          copyHex: "Sao chép HEX",
          copyRgb: "Sao chép RGB",
          copyHsl: "Sao chép HSL"
        }
      }
    },
    elementToys: {
      title: "Công cụ phần tử",
      description:
        "Kiểm tra, xóa, sửa chữ hoặc di chuyển phần tử trực tiếp trên trang web.",
      settings: {
        launchTooltip: "Khởi chạy Công cụ phần tử trên trang",
        shortcutTitle: "Phím tắt kích hoạt",
        shortcutDesc: "Mở thanh công cụ Công cụ phần tử nổi trên trang hiện tại",
        inspectorBadge: "Nhãn kiểm tra phần tử",
        showDimensions: "Hiện kích thước phần tử",
        showDimensionsDesc:
          "Đo và hiển thị chiều rộng × chiều cao (px) trên nhãn di chuột",
        showTags: "Hiện tên thẻ & Class",
        showTagsDesc:
          "Hiển thị tên thẻ HTML và bộ chọn CSS class (ví dụ div.banner#hero)",
        behaviorSection: "Hành vi Công cụ phần tử",
        defaultTool: "Công cụ mặc định khi mở",
        defaultToolDesc: "Công cụ được chọn sẵn khi kích hoạt Công cụ phần tử",
        modes: {
          zap: "Loại bỏ (Zap)",
          edit: "Sửa chữ",
          move: "Di chuyển",
          hide: "Ẩn"
        },
        continuousSession: "Phiên làm việc liên tục",
        continuousSessionDesc:
          "Giữ công cụ hoạt động sau mỗi thao tác cho đến khi nhấn Esc hoặc Thoát",
        autoUnfreeze: "Tự mở khóa cuộn trang",
        autoUnfreezeDesc:
          "Khôi phục khả năng cuộn (overflow: auto) nếu phần tử bị xóa là lớp phủ khóa cuộn",
        showToast: "Hiện thông báo nổi",
        showToastDesc:
          "Hiển thị biểu ngữ xác nhận trên trang khi thực hiện thao tác",
        howToUse: "Hướng dẫn sử dụng Công cụ phần tử",
        tipShortcutPrefix: "Nhấn",
        tipShortcutSuffix: "để mở thanh công cụ HUD nổi ngay trên trang.",
        tipNoShortcutPrefix: "Gán phím tắt ở trên hoặc nhấp",
        tipNoShortcutSuffix: "để mở thanh công cụ HUD nổi ngay trên trang.",
        tipZapDesc:
          "Nhấp vào bất kỳ biểu ngữ, lớp phủ hoặc widget nào để xóa khỏi DOM.",
        tipEditDesc:
          "Nhấp vào bất kỳ đoạn văn bản nào để sửa trực tiếp (phím gõ được cách ly hoàn toàn khỏi trang).",
        tipMoveDesc:
          "Kéo để đổi vị trí phần tử trên bố cục trang. Chuyển chế độ Flow & Free ngay trên thanh công cụ, và nhấn + / - để mở rộng hoặc thu hẹp vùng chọn.",
        tipHideDesc:
          "Nhấp để ẩn phần tử mà không làm vỡ bố cục dòng chảy của trang.",
        tipUndoPrefix: "Nhấn",
        tipUndoMiddle: "để hoàn tác thao tác, hoặc nhấp nút",
        tipUndoSettings: "Cài đặt",
        tipUndoSuffix: "trên thanh công cụ để tùy chỉnh thêm."
      },
      toolbar: {
        title: "Công cụ phần tử",
        zap: "Loại bỏ",
        zapTip: "Xóa: Nhấp để loại bỏ phần tử khỏi DOM",
        edit: "Sửa chữ",
        editTip: "Sửa chữ: Nhấp vào văn bản bất kỳ để sửa trực tiếp",
        move: "Di chuyển",
        moveActiveTip: "Đang bật Di chuyển (Nhấn +/- để đổi vùng chọn cha)",
        moveTip: "Di chuyển: Nhấp để bật chế độ Di chuyển (Flow / Free)",
        moveLabel: "Di chuyển ({{mode}})",
        flow: "Flow",
        flowTip:
          "Chế độ Flow: Sắp xếp lại trong bố cục DOM và đẩy các phần tử khác",
        free: "Free",
        freeTip: "Chế độ Free: Dịch chuyển tự do mà không làm thay đổi bố cục",
        hide: "Ẩn",
        hideTip: "Ẩn: Nhấp để ẩn phần tử mà không làm xô lệch trang",
        undo: "Hoàn tác",
        undoTip: "Hoàn tác thao tác cuối (Ctrl+Z)",
        settings: "Cài đặt",
        settingsTip: "Mở cài đặt Công cụ phần tử",
        exit: "Thoát",
        exitTip: "Thoát Công cụ phần tử (Esc)"
      },
      overlay: {
        clickToZap: "Nhấp để xóa",
        clickToEdit: "Nhấp để sửa chữ",
        dragBody: "Kéo thân để {{type}} • Kéo góc để đổi kích thước",
        clickToHide: "Nhấp để ẩn"
      },
      logic: {
        zapped: "Đã xóa phần tử!",
        hidden: "Đã ẩn phần tử",
        resized: "Đã đổi kích thước phần tử",
        textUpdated: "Đã cập nhật văn bản",
        undone: "Đã hoàn tác",
        undoneDetail: "Đã hoàn tác {{action}}",
        closed: "Đã đóng Công cụ phần tử",
        active: "Công cụ phần tử đang bật",
        activeDetail: "Chọn công cụ trên thanh công cụ • Esc để thoát",
        scope: "Phạm vi: <{{tag}}>",
        scopeDetail: "Cấp +{{depth}} (Nhấn - để thu hẹp)",
        scrollUnfrozen: "Đã mở khóa cuộn trang",
        scrollUnfrozenDetail: "Đã khôi phục overflow: auto"
      }
    },
    quickHub: {
      title: "Trung tâm nhanh",
      description:
        "Bảng truy cập nhanh các công cụ ngay trên trang khi rê chuột vào cạnh.",
      settings: {
        floatingPlacement: "Vị trí nút nổi",
        floatingPlacementDesc:
          "Kéo hoặc nhấp dọc theo các cạnh màn hình để neo nút kích hoạt Trung tâm nhanh.",
        buttonShapeDesc: "Tùy chỉnh hình dạng của nút kích hoạt nổi.",
        buttonOpacityDesc: "Điều chỉnh độ trong suốt của nút kích hoạt nổi.",
        customizeMenu: "Tùy chỉnh Menu",
        customizeMenuDesc:
          "Kéo để sắp xếp lại thứ tự trong Trung tâm nhanh, hoặc bật/tắt để ẩn các công cụ ít dùng.",
        behaviorProximity: "Hành vi & Vùng nhận diện",
        hoverProximity: "Hiện khi di chuột gần góc",
        hoverProximityDesc:
          "Chỉ hiện nút nổi khi đưa chuột lại gần góc màn hình. Khi tắt, nút luôn hiện ở độ mờ 30%.",
        keyboardShortcut: "Phím tắt bàn phím",
        globalHotkey: "Phím tắt toàn cục (Tùy chọn)",
        globalHotkeyDesc: "Bật/tắt bảng Trung tâm nhanh trên trang web hiện tại.",
        disabledInSettings: "{{feature}} đang bị tắt trong cài đặt tiện ích",
        hiddenInMenu: "{{feature}} đang bị ẩn trong menu popup",
        quickScrollTopOnly: "Quick Scroll đang đặt ở chế độ 'Chỉ lên đầu'",
        actions: {
          pipTitle: "Xem Video ở chế độ PiP",
          pipDesc: "Mở video trong cửa sổ nổi picture-in-picture",
          colorPickerTitle: "Chấm màu màn hình",
          colorPickerDesc: "Kính lúp chấm màu pixel và sao chép mã màu nhanh",
          elementToysTitle: "Công cụ phần tử",
          elementToysDesc: "Kiểm tra, xóa, sửa chữ hoặc di chuyển phần tử",
          scrollTopTitle: "Cuộn lên đầu trang",
          scrollTopDesc: "Nhảy mượt mà lên đầu trang web",
          scrollBottomTitle: "Cuộn xuống cuối trang",
          scrollBottomDesc: "Nhảy mượt mà xuống cuối trang web",
          resetZoomTitle: "Đặt lại thu phóng trang",
          resetZoomDesc: "Khôi phục tỷ lệ hiển thị 100%",
          cleanUrlTitle: "Sao chép URL sạch",
          cleanUrlDesc: "Sao chép liên kết đã bỏ tham số theo dõi (utm_*, fbclid)"
        }
      },
      logic: {
        noToolsActive:
          "Chưa có công cụ nào bật. Hãy bật tính năng trong popup Browse Assist.",
        triggerTooltip: "Trung tâm nhanh (Công cụ tức thì)",
        triggerAria: "Trung tâm nhanh",
        cleanUrlCopied: "Đã sao chép URL sạch"
      }
    },
    imageHoverPreview: {
      title: "Xem trước ảnh khi di chuột",
      description:
        "Di chuột lên ảnh thu nhỏ hoặc liên kết ảnh để xem trước kích thước lớn.",
      settings: {
        activation: "Kích hoạt",
        triggerModifier: "Phím bổ trợ kích hoạt",
        triggerModifierDesc: "Giữ phím này khi di chuột lên ảnh để xem trước.",
        hoverDelay: "Độ trễ khi di chuột",
        hoverDelayDesc: "Thời gian chờ trước khi mở khung xem trước.",
        instant: "Tức thì",
        displaySize: "Kích thước hiển thị",
        maxViewportSize: "Kích thước tối đa theo màn hình",
        behavior: "Hành vi",
        previewImageLinks: "Xem trước liên kết ảnh",
        previewImageLinksDesc:
          "Hiện ảnh xem trước khi di chuột lên siêu liên kết trỏ tới tệp ảnh.",
        showDimensions: "Hiện nhãn kích thước",
        showDimensionsDesc:
          "Hiển thị chiều rộng × chiều cao gốc (px) ở góc khung xem trước."
      }
    }
  }
}
