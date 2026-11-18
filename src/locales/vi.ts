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
    none: "Không",
    customizeShortcuts: "Tùy chỉnh trong cài đặt phím tắt trình duyệt",
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
      title: "Super Drag",
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
          open_active_tab: "Tab hiện tại",
          open_window_active: "Cửa sổ mới",
          open_incognito_active: "Cửa sổ ẩn danh",
          none: "Không làm gì",
          copy_to_clipboard: "Sao chép",
          copy_link_text: "Sao chép chữ liên kết",
          copy_link_url: "Sao chép URL liên kết",
          copy_markdown: "Sao chép Markdown",
          copy_image_link: "Sao chép link ảnh",
          search_image: "Tìm kiếm hình ảnh"
        }
      }
    },
    quickScroll: {
      title: "Quick Scroll Buttons",
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
      title: "Smooth Scrolling",
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
      title: "Mouse Pin-to-Zoom",
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
      }
    },
    pictureInPicture: {
      title: "Universal Picture-in-Picture",
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
      }
    },
    videoWheelControl: {
      title: "Video Wheel Control",
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
      }
    },
    colorPicker: {
      title: "Color Picker",
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
        permissionRequired: "Cần tương tác người dùng hoặc không được cấp phép"
      }
    },
    elementToys: {
      title: "Element Toys",
      description:
        "Kiểm tra, xóa, sửa chữ hoặc di chuyển phần tử trực tiếp trên trang web.",
      settings: {
        launchTooltip: "Khởi chạy Element Toys trên trang",
        shortcutTitle: "Phím tắt kích hoạt",
        shortcutDesc: "Mở thanh công cụ Element Toys nổi trên trang hiện tại",
        inspectorBadge: "Nhãn kiểm tra phần tử",
        showDimensions: "Hiện kích thước phần tử",
        showDimensionsDesc:
          "Đo và hiển thị chiều rộng × chiều cao (px) trên nhãn di chuột",
        showTags: "Hiện tên thẻ & Class",
        showTagsDesc:
          "Hiển thị tên thẻ HTML và bộ chọn CSS class (ví dụ div.banner#hero)",
        behaviorSection: "Hành vi Element Toys",
        defaultTool: "Công cụ mặc định khi mở",
        defaultToolDesc: "Công cụ được chọn sẵn khi kích hoạt Element Toys",
        modes: {
          zap: "Xóa (Zap)",
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
        howToUse: "Hướng dẫn sử dụng Element Toys",
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
      }
    },
    quickHub: {
      title: "Quick Hub",
      description:
        "Bảng truy cập nhanh các công cụ ngay trên trang khi rê chuột vào cạnh.",
      settings: {
        floatingPlacement: "Vị trí nút nổi",
        floatingPlacementDesc:
          "Kéo hoặc nhấp dọc theo các cạnh màn hình để neo nút kích hoạt Quick Hub.",
        buttonShapeDesc: "Tùy chỉnh hình dạng của nút kích hoạt nổi.",
        buttonOpacityDesc: "Điều chỉnh độ trong suốt của nút kích hoạt nổi.",
        customizeMenu: "Tùy chỉnh Menu",
        customizeMenuDesc:
          "Kéo để sắp xếp lại thứ tự trong Quick Hub, hoặc bật/tắt để ẩn các công cụ ít dùng.",
        behaviorProximity: "Hành vi & Vùng nhận diện",
        hoverProximity: "Hiện khi di chuột gần góc",
        hoverProximityDesc:
          "Chỉ hiện nút nổi khi đưa chuột lại gần góc màn hình. Khi tắt, nút luôn hiện ở độ mờ 30%.",
        keyboardShortcut: "Phím tắt bàn phím",
        globalHotkey: "Phím tắt toàn cục (Tùy chọn)",
        globalHotkeyDesc: "Bật/tắt bảng Quick Hub trên trang web hiện tại.",
        disabledInSettings: "{{feature}} đang bị tắt trong cài đặt tiện ích",
        hiddenInMenu: "{{feature}} đang bị ẩn trong menu popup",
        quickScrollTopOnly: "Quick Scroll đang đặt ở chế độ 'Chỉ lên đầu'",
        actions: {
          pipTitle: "Xem Video ở chế độ PiP",
          pipDesc: "Mở video trong cửa sổ nổi picture-in-picture",
          colorPickerTitle: "Chấm màu màn hình",
          colorPickerDesc: "Kính lúp chấm màu pixel và sao chép mã màu nhanh",
          elementToysTitle: "Element Toys",
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
        triggerTooltip: "Quick Hub (Công cụ nhanh)",
        cleanUrlCopied: "Đã sao chép URL sạch"
      }
    },
    imageHoverPreview: {
      title: "Image Hover Preview",
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
