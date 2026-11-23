import type { TranslationDict } from "./en"

export const zh_TW: TranslationDict = {
  common: {
    appName: "Browse Assist",
    appSlogan: "全面升級你的網頁瀏覽體驗",
    appDescription:
      "輕量、模組化的瀏覽器效率工具集，全面提升網頁瀏覽體驗。",
    enabled: "已啟用",
    disabled: "已停用",
    reset: "重設",
    clear: "清除",
    cancel: "取消",
    gotIt: "知道了",
    viewportScreen: "可視區域",
    unassigned: "未指定",
    launch: "啟動",
    all: "全部",
    none: "無",
    customizeShortcuts: "在瀏覽器快捷鍵設定中自訂",
    shortcutNotAssignedTip: "未指派快捷鍵，點擊在瀏覽器設定中設定",
    customizeShortcutTip: "點擊在瀏覽器設定中自訂快捷鍵",
    backTip: "返回 (Backspace 鍵或 `)",
    toggleFeatureAria: "切換 {{feature}}",
    resetOrder: "重設順序",
    show: "顯示",
    hide: "隱藏",
    center: "置中",
    left: "左",
    right: "右",
    top: "上",
    bottom: "下",
    unstable: "不穩定",
    screenPosition: "螢幕位置",
    buttonOpacity: "按鈕不透明度",
    buttonShape: "按鈕形狀",
    shapes: {
      circle: "圓形",
      capsule: "膠囊形",
      rounded: "圓角矩形",
      pill: "藥丸形"
    },
    modifiers: {
      alt: "Alt",
      shift: "Shift",
      ctrl: "Ctrl",
      altKey: "Alt 鍵",
      shiftKey: "Shift 鍵",
      rightClick: "滑鼠右鍵",
      leftClick: "滑鼠左鍵"
    }
  },
  popup: {
    searchPlaceholder: "搜尋工具...",
    noResults: "找不到符合的工具。",
    resetFilters: "重設篩選",
    switchToList: "切換為清單檢視",
    switchToGrid: "切換為精簡網格",
    pipBannerTitle: "影片子母畫面播放中",
    pipExit: "結束子母畫面",
    supportTitle: "支持本專案",
    categories: {
      all: "全部",
      interaction: "滑鼠",
      navigation: "捲動",
      media: "媒體",
      tools: "工具"
    },
    tooltips: {
      preferencesAndTheme: "偏好設定與主題",
      about: "關於 Browse Assist",
      supportDonate: "支持與贊助",
      jumpToVideoTab: "點擊跳轉至此影片分頁",
      exitPipWindow: "結束子母畫面視窗"
    }
  },
  preferences: {
    title: "偏好設定",
    appearance: "外觀",
    themeMode: "主題模式",
    themeModeDesc: "淺色、深色或跟隨系統主題。",
    themeDark: "深色",
    themeLight: "淺色",
    themeSystem: "跟隨系統",
    viewMode: "檢視模式",
    viewModeDesc: "詳細清單或精簡磚塊網格。",
    viewModeList: "清單",
    viewModeGrid: "網格",
    language: "語言",
    languageDesc: "選擇介面語言或跟隨瀏覽器。",
    languageAuto: "自動 (瀏覽器)",
    navigation: "導覽",
    searchAndFilter: "搜尋與分類篩選",
    searchAndFilterDesc: "在彈出視窗頂部顯示搜尋列與分類標籤。",
    rememberLastView: "記住上次檢視",
    rememberLastViewDesc: "重新開啟彈出視窗時回到上次瀏覽的設定頁面。",
    sessionTimeout: "工作階段逾時",
    minutesShort: "{{count}} 分鐘",
    tickOneMin: "1 分鐘",
    tickTenMinDefault: "10 分鐘 (預設)",
    tickSixtyMin: "60 分鐘",
    customizeMenu: "自訂選單",
    customizeMenuDesc: "拖曳以重新排序，或切換功能在彈出視窗中的顯示狀態。",
    presets: "預設方案",
    presetReading: "閱讀與導覽",
    presetReadingDesc: "捲動、拖曳與閱讀",
    presetDesigner: "設計與開發",
    presetDesignerDesc: "取色、檢查與編輯",
    presetEssential: "僅保留核心",
    presetEssentialDesc: "精簡而專注",
    other: "其他",
    optionsPage: "擴充功能選項頁面",
    optionsPageDesc: "完整設定面板與快捷鍵指南"
  },
  donate: {
    buyMeACoffeeDesc: "買杯咖啡支持專案持續維護",
    githubSponsorsDesc: "透過 GitHub 按月或單次贊助",
    vietqrDesc: "透過 VietQR 即時銀行轉帳 (越南)",
    authorDonateLabel: "作者贊助頁面",
    authorDonateDesc: "直接向作者贊助"
  },
  dialogs: {
    firefoxGuide: {
      title: "Firefox 快捷鍵設定指南",
      intro: "您可以直接在瀏覽器的擴充功能設定中自訂快捷鍵：",
      step1Prefix: "在 Firefox 中開啟新分頁並前往",
      copyUrlTip: "點擊複製網址",
      step2Prefix: "點擊附加元件管理員右上角的",
      step2Target: "齒輪圖示 ⚙",
      step2Suffix: "。",
      step3Prefix: "在下拉選單中選擇",
      step3Target: "「管理擴充套件快捷鍵」",
      step3Suffix: "。",
      step4Prefix: "找到",
      step4Suffix: "並為每項命令指派您偏好的快捷鍵。"
    }
  },
  options: {
    title: "Browse Assist 設定",
    subtitle: "設定您的瀏覽器效率工具集與快捷鍵",
    openPopup: "開啟彈出視窗",
    openPopupTip: "開啟擴充功能彈出視窗",
    preferences: "偏好設定",
    preferencesTip: "在彈出視窗中開啟偏好設定",
    about: "關於",
    aboutTip: "在彈出視窗中開啟關於資訊",
    activeModules: "已啟用模組",
    configureInPopup: "在彈出視窗中設定 {{feature}}",
    shortcutsTitle: "鍵盤與滑鼠快捷鍵參考",
    shortcutsSubtitle: "即時瀏覽器熱鍵與互動手勢觸發器",
    customizeShortcuts: "自訂快捷鍵",
    table: {
      action: "操作",
      shortcut: "快捷鍵 / 觸發器",
      description: "說明"
    },
    triggers: {
      mouseWheel: "{{modifier}} + 滑鼠滾輪",
      mouseDrag: "滑鼠拖曳",
      doubleClickMargin: "連按兩下頁面邊緣",
      rightClickLink: "右鍵點擊連結"
    },
    shortcuts: {
      pip: {
        name: "通用子母畫面 (PiP)",
        desc: "將目前播放的影片分離為懸浮子母畫面視窗"
      },
      allowRightClick: {
        name: "允許右鍵",
        desc: "在目前分頁解鎖右鍵選單與文字複製"
      },
      elementToys: {
        name: "元素工具",
        desc: "啟用點選定位，移除、編輯、隱藏或移動頁面元素"
      },
      colorPicker: {
        name: "螢幕取色器",
        desc: "啟動螢幕像素放大鏡以擷取並複製色彩代碼"
      },
      quickHub: {
        name: "快捷中心 快捷鍵",
        desc: "透過鍵盤切換螢幕上的 快捷中心 懸浮選單"
      },
      volume: {
        name: "影片音量控制",
        desc: "懸停影片滾動調節音量；按住修飾鍵點擊靜音"
      },
      speed: {
        name: "影片倍速控制",
        desc: "懸停影片平滑調節播放速度；點擊切換全螢幕"
      },
      seek: {
        name: "影片快轉與逐格步進",
        desc: "快轉/倒轉；影片暫停時支援逐格微調"
      },
      boost: {
        name: "影片倍速加速",
        desc: "在影片上按住 X 鍵暫時以 {{speed}}x 倍速播放"
      },
      mouseZoom: {
        name: "滑鼠定點縮放",
        desc: "以滑鼠游標位置為中心平滑縮放頁面"
      },
      superDrag: {
        name: "超級拖曳",
        desc: "拖曳文字在新分頁搜尋；拖曳連結在背景分頁開啟"
      },
      quickScroll: {
        name: "快速捲動",
        desc: "連按兩下螢幕邊緣或點擊懸浮按鈕跳轉至頂部或底部"
      },
      smoothScroll: {
        name: "平滑捲動",
        desc: "在所有可捲動容器中套用慣性物理插值"
      },
      cleanLink: {
        name: "複製純淨連結",
        desc: "移除追蹤參數 (utm_*, fbclid) 並複製純淨或 Markdown 連結"
      },
      quickHubZone: {
        name: "快捷中心 觸發區",
        desc: "滑鼠懸停螢幕角落觸發區以展開快捷工具"
      }
    },
    storage: {
      title: "擴充功能儲存與資料",
      desc: "永久清除 Browse Assist 在瀏覽器中儲存的所有資料與設定，包括自訂設定、快捷鍵偏好、快捷中心 排序及取色紀錄。",
      clearAll: "清除所有資料...",
      cleared: "所有擴充功能資料已清除並恢復為預設值。",
      footer:
        "Browse Assist • Manifest V3 • 基於 Plasmo、React 與 Tailwind CSS 建置"
    },
    modal: {
      title: "清除所有擴充功能資料？",
      body: "這將永久刪除 Browse Assist 在您瀏覽器設定檔中儲存的所有資料。",
      listHeader: "以下內容將被刪除：",
      item1: "所有功能開關狀態及子設定",
      item2: "快捷中心 排序、置頂操作及隱藏模組",
      item3: "取色器中的色彩歷史紀錄",
      item4: "主題偏好與彈出視窗導覽記憶",
      warning: "⚠️ 此操作無法復原。所有設定將立即恢復為預設狀態。",
      clearing: "正在清除資料...",
      confirm: "確認刪除全部資料"
    }
  },
  content: {
    copied: {
      linkText: "已複製連結文字",
      cleanLink: "已複製純淨連結",
      markdown: "已複製 Markdown",
      cleanPageUrl: "已複製純淨頁面 URL",
      pageMarkdown: "已複製頁面 Markdown",
      quote: "已複製引言",
      text: "已複製文字",
      imageLink: "已複製圖片連結",
      linkUrl: "已複製連結 URL"
    },
    fabMenu: {
      movePosition: "移動位置",
      openSettings: "開啟設定",
      hideOnTab: "在目前分頁隱藏",
      disableFeature: "停用{{feature}}",
      disablePipHoverButton: "停用 PiP 懸浮按鈕",
      dragHint: "移至邊緣並點擊放置 • 按 Esc 取消",
      quickDragHint: "拖曳至邊緣並放開右鍵放置 • 按 Esc 取消",
      positionSaved: "位置已儲存",
      hiddenOnTab: "已在目前分頁隱藏{{feature}}"
    }
  },
  about: {
    title: "關於",
    projectAndLegal: "專案與法律資訊",
    homePage: "首頁",
    terms: "條款",
    policy: "隱私權政策",
    openSourceLibraries: "開源函式庫",
    declaredPermissions: "已宣告權限",
    permissionNames: {
      storage: "儲存空間",
      contextMenus: "右鍵選單",
      clipboardWrite: "剪貼簿",
      search: "搜尋"
    },
    permissions: {
      storage: "在本機永久儲存自訂設定與功能偏好。",
      contextMenus: "在右鍵選單中提供快速操作（例如複製純淨連結）。",
      clipboardWrite: "將擷取的色彩代碼與 Markdown 連結複製到剪貼簿。",
      search: "在 超級拖曳 時使用預設搜尋引擎搜尋選取文字。"
    }
  },
  features: {
    allowRightClick: {
      title: "允許右鍵",
      description: "在限制右鍵的網站上恢復右鍵選單、文字選取與複製功能。",
      popupDesc: "在目前分頁啟用右鍵選單與複製，不影響其他應用程式。",
      toastEnabled: "已啟用右鍵",
      toastDisabled: "已停用右鍵",
      currentTab: "目前分頁"
    },
    contextMenuActions: {
      title: "右鍵選單操作",
      description: "自訂右鍵選單操作，用於複製純淨連結或 Markdown 格式。",
      activeCount: "{{count}}/6 已啟用",
      copyLinkText: "複製連結文字",
      cleanLinkCopy: "複製純淨連結",
      markdownLinkCopy: "複製為 Markdown 連結",
      copyCleanPageUrl: "複製純淨頁面 URL",
      copyPageMarkdown: "複製頁面為 Markdown",
      copySelectionQuote: "複製選取內容為引言",
      settings: {
        sectionTitle: "右鍵選單項目",
        sectionDesc: "拖曳以調整順序，或切換在右鍵選單中的可見性。",
        badges: {
          textOnly: "僅文字",
          antiTracking: "防追蹤",
          markdown: "[文字](URL)",
          page: "頁面",
          selection: "選取區"
        },
        descriptions: {
          copyLinkText: "僅擷取並複製連結的錨文字，不包含 URL。",
          cleanLinkCopy: "複製前自動移除追蹤參數 (utm_*, fbclid, si)。",
          markdownLinkCopy:
            "複製格式化 Markdown 超連結，適合 Obsidian、Notion 與 GitHub。",
          copyCleanPageUrl:
            "在頁面任意處按右鍵即可複製無追蹤參數的頁面 URL。",
          copyPageMarkdown:
            "將目前頁面標題與純淨 URL 複製為 [標題](URL)。",
          copySelectionQuote:
            "將反白文字複製為附帶來源連結的 Markdown 引言區塊。"
        }
      }
    },
    superDrag: {
      title: "超級拖曳",
      description: "拖曳選取文字即可搜尋，拖曳連結即可在新分頁開啟。",
      settings: {
        dragTargets: "拖曳目標",
        tabs: {
          text: "文字",
          link: "連結",
          image: "圖片"
        },
        searchText: "搜尋反白文字",
        searchTextDesc: "向 4 個方向拖曳選取文字以搜尋、開啟視窗或複製。",
        textDisabled: "目前已停用反白文字拖曳。",
        openLinks: "開啟超連結",
        openLinksDesc: "拖曳超連結以在分頁、新視窗開啟或複製連結/文字。",
        linksDisabled: "目前已停用超連結拖曳。",
        dragImages: "拖曳圖片",
        dragImagesDesc: "拖曳圖片以在分頁、新視窗檢視或複製圖片直鏈。",
        imagesDisabled: "目前已停用圖片拖曳。",
        displayFeedback: "顯示與回饋",
        dragIndicator: "拖曳視覺指示器",
        dragIndicatorDesc: "選擇拖曳元素時顯示的視覺回饋樣式。",
        indicatorOpacity: "指示器不透明度",
        indicatorOpacityDesc: "調整拖曳時顯示的指示器透明度。",
        indicatorStyles: {
          none: "停用",
          badge: "懸浮徽章",
          radial: "圓形扇區"
        },
        directionalGestures: "方向手勢",
        actions: {
          open_bg_tab: "背景分頁",
          open_active_tab: "前景新分頁",
          open_window_active: "新視窗",
          open_incognito_active: "無痕視窗",
          none: "無（不執行動作）",
          copy_to_clipboard: "複製",
          copy_link_text: "複製連結文字",
          copy_link_url: "複製連結 URL",
          copy_markdown: "複製 Markdown",
          copy_image_link: "複製圖片連結",
          search_image: "搜尋圖片"
        }
      },
      logic: {
        types: {
          search: "搜尋",
          image: "圖片",
          link: "連結"
        },
        dropOpenBackground: "放開以在背景開啟{{type}}",
        shortOpenBackground: "{{type}} (背景)",
        dropOpenActive: "放開以在新分頁開啟{{type}}",
        shortOpenActive: "{{type}} (新分頁)",
        dropOpenWindow: "放開以在新視窗開啟{{type}}",
        shortOpenWindow: "{{type}} (新視窗)",
        dropOpenIncognito: "放開以在無痕視窗開啟{{type}}",
        shortOpenIncognito: "{{type}} (無痕)",
        dropCopyLinkText: "放開以複製連結文字",
        shortCopyLinkText: "複製文字",
        dropCopyMarkdown: "放開以複製 Markdown",
        shortCopyMarkdown: "複製 Markdown",
        dropSearchImage: "放開以搜尋圖片",
        shortSearchImage: "搜尋圖片",
        dropCopyText: "放開以複製文字",
        shortCopyText: "複製文字",
        dropCopyImageLink: "放開以複製圖片連結",
        shortCopyImageLink: "複製圖片連結",
        dropCopyLinkUrl: "放開以複製連結 URL",
        shortCopyLinkUrl: "複製連結",
        noAction: "無動作",
        releaseToCancel: "放開取消",
        exceededMax: "超出最大距離 (放開取消)"
      }
    },
    quickScroll: {
      title: "快速捲動按鈕",
      description: "智慧懸浮按鈕，平滑快速跳轉至頁面頂部或底部。",
      settings: {
        buttonPlacement: "按鈕位置",
        buttonPlacementDesc: "沿著螢幕左/右邊緣拖曳或點擊以錨定捲動按鈕。",
        controlsStyle: "控制與樣式",
        buttonSelection: "按鈕選擇",
        buttonSelectionDesc: "同時顯示頂部與底部按鈕，或僅顯示頂部按鈕。",
        modes: {
          both: "頂部與底部",
          topOnly: "僅頂部"
        },
        buttonShapeDesc: "選擇圓形、一體膠囊形或圓角方形。",
        buttonOpacityDesc: "調整未懸停時的透明度。",
        behaviorIntel: "行為與智慧特性",
        autoDim: "閒置時自動變暗",
        autoDimDesc: "停止捲動時淡化按鈕透明度；懸停時立即恢復。",
        scrollMemory: "捲動位置記憶",
        scrollMemoryDesc: "跳轉時儲存目前閱讀位置，支援一鍵返回原處。",
        hideOnNative: "網頁內建按鈕時隱藏",
        hideOnNativeDesc: "當網頁已提供固定回到頂部按鈕時自動隱藏。"
      },
      logic: {
        scrollToTop: "捲動到頂部",
        scrollToBottom: "捲動到底部",
        returnToPrevious: "返回先前的位置"
      }
    },
    smoothScroll: {
      title: "平滑捲動",
      description: "基於插值物理效果的絲滑頁面捲動。",
      settings: {
        profiles: "預設方案",
        presetBalanced: "均衡",
        presetUltra: "極柔",
        presetSnappy: "俐落",
        presetCustom: "自訂",
        fineTuning: "參數微調",
        scrollDistance: "捲動距離",
        glidingDuration: "滑行時長",
        ignoreTouchpad: "忽略觸控板",
        ignoreTouchpadDesc: "跳過微小滾輪事件，保留系統觸控板原生慣性。",
        keyboardScroll: "鍵盤平滑捲動",
        keyboardScrollDesc:
          "為方向鍵、PageUp/Down 與空白鍵提供平滑插值捲動。",
        aggressiveMode: "強力攔截模式",
        aggressiveModeDesc:
          "在所有網站強制啟用平滑捲動。建議停用以保護畫布與 Web 應用（如 Konva、Figma、地圖）。"
      }
    },
    mouseZoom: {
      title: "滑鼠定點縮放",
      description: "按住修飾鍵並滾動滾輪，以滑鼠游標為中心縮放頁面。",
      settings: {
        resetZoomTooltip: "將目前分頁縮放重設為 100%",
        triggerModifier: "觸發修飾鍵",
        zoomSensitivity: "縮放靈敏度",
        stepIncrement: "步進幅度",
        tickFine: "4% (精細)",
        tickDefault: "10% (預設)",
        tickFast: "25% (快速)",
        behaviorDisplay: "行為與顯示",
        smoothAnimation: "平滑動畫",
        smoothAnimationDesc: "對縮放過渡進行平滑插值，體驗更流暢。",
        invertDirection: "反轉方向",
        invertDirectionDesc: "向下滾動放大，向上滾動縮小。",
        showZoomToast: "顯示縮放提示",
        showZoomToastDesc: "在頁面右上角顯示懸浮縮放百分比徽章。"
      },
      logic: {
        pageZoom: "頁面縮放"
      }
    },
    pictureInPicture: {
      title: "通用子母畫面 (PiP)",
      description: "使用可自訂快捷鍵切換影片懸浮子母畫面視窗。",
      settings: {
        shortTitle: "Picture-in-Picture",
        globalShortcut: "全域快捷鍵",
        globalShortcutDesc: "切換影片懸浮視窗",
        displayFeedback: "顯示與回饋",
        extensionBadge: "擴充功能圖示徽章",
        extensionBadgeDesc: "影片處於子母畫面時在圖示上顯示「PiP」標記。",
        actionToast: "操作提示通知",
        actionToastDesc: "進入或結束子母畫面時顯示簡短確認提示。",
        autoPauseOnExit: "結束子母畫面時自動暫停",
        autoPauseOnExitDesc: "關閉子母畫面視窗時自動暫停影片播放。",
        hoverButton: "影片懸停 PiP 按鈕",
        hoverButtonDesc:
          "在播放中的影片內顯示懸浮 PiP 按鈕。部分自訂播放器上可能不穩定。",
        buttonPosition: "按鈕位置",
        edgeAlignment: "邊緣與對齊",
        edgeAlignmentDesc: "沿著影片邊緣拖曳或點擊以錨定懸浮 PiP 按鈕。",
        buttonOpacityDesc: "調整未聚焦時懸停按鈕的透明度。"
      },
      logic: {
        watchInPip: "在子母畫面中觀看",
        exitedPip: "已結束子母畫面",
        enteredPip: "已進入子母畫面",
        notSupported: "目前瀏覽器不支援子母畫面",
        cannotEnter: "無法進入子母畫面",
        noVideoFound: "頁面上找不到影片"
      },
      background: {
        playing: "子母畫面播放中: {{title}}",
        untitledVideo: "影片"
      }
    },
    videoWheelControl: {
      title: "影片滾輪控制",
      description: "使用滑鼠滾輪平滑調節影片音量、倍速與進度。",
      settings: {
        tabs: {
          volume: "音量",
          speed: "倍速",
          seek: "快轉",
          extra: "擴充"
        },
        conflictTitle: "偵測到修飾鍵衝突",
        conflictDesc:
          "兩個或以上啟用的控制項共用了同一修飾鍵（優先順序：快轉 > 倍速 > 音量），請指定不同按鍵。",
        modifierKey: "修飾鍵",
        modifierKeyDesc: "按住按鍵 + 在影片上滾動滾輪",
        volumeControl: "音量控制",
        volumeStep: "音量步進",
        clickToMute: "點擊靜音",
        clickToMuteDesc: "按住 {{key}} 點擊影片即可切換靜音。",
        invertVolume: "反轉音量滾輪",
        invertVolumeDesc: "調節音量時反轉滾輪方向。",
        speedControl: "倍速控制",
        speedStep: "倍速步進",
        holdXBoost: "按住 'X' 加速 (2.0x)",
        holdXBoostDesc: "觀看影片時按住 'X' 鍵可暫時以 2.0x 倍速播放。",
        clickToFullscreen: "點擊全螢幕",
        clickToFullscreenDesc: "按住 {{key}} 點擊影片即可切換全螢幕。",
        invertSpeed: "反轉倍速滾輪",
        invertSpeedDesc: "調節播放速度時反轉滾輪方向。",
        seekControl: "進度快轉控制",
        seekStep: "快轉步長 (秒)",
        frameStepper: "逐格步進",
        frameStepperDesc: "影片暫停時，滾動滾輪可逐格微調 (~1/30 秒)。",
        invertSeek: "反轉快轉滾輪",
        invertSeekDesc: "快轉倒轉時反轉滾輪方向。",
        screenshot: "影片截圖 (Shift+Alt+點擊)",
        screenshotDesc: "將目前影片畫面直接以 PNG 格式複製到剪貼簿。",
        osd: "螢幕顯示 (OSD)",
        osdDesc: "為音量、倍速、進度與加速顯示懸浮 HUD 徽章。",
        osdOpacity: "OSD 不透明度",
        osdOpacityDesc: "調整懸浮 OSD 徽章的透明度。",
        noticeTitle: "相容性與狀態說明",
        noticeBody1: "此功能直接與底層 HTML5 媒體元素 (<video>) 互動。",
        noticeBody2:
          "在大型影音網站上，播放器狀態管理員可能會在循環播放、切換畫質或自動連播時重設倍速或靜音狀態。"
      },
      logic: {
        muted: "已靜音",
        fullscreen: "全螢幕",
        exitFullscreen: "結束全螢幕",
        frameCopied: "已複製影格畫面！",
        captureFailed: "截圖失敗",
        clipboardDenied: "剪貼簿權限被拒",
        corsProtected: "受 CORS 保護",
        frameStep: "影格 {{sign}} ({{time}})",
        boost: "⚡ {{rate}}x 加速"
      }
    },
    colorPicker: {
      title: "螢幕取色器",
      description: "擷取螢幕任意像素色彩並支援多格式即時複製。",
      settings: {
        shortcutTitle: "滴管快捷鍵",
        shortcutDesc: "快速啟動螢幕取色器",
        recentColors: "最近擷取的色彩",
        clearHistoryTooltip: "清除所有歷史色彩紀錄",
        clickToCopy: "點擊複製 {{value}}",
        noRecentColors: "尚無最近擷取的色彩。請使用上方快捷鍵或按鈕。",
        defaultFormat: "預設複製格式",
        clipboardFormat: "剪貼簿色彩格式",
        clipboardFormatDesc: "取色時自動複製到剪貼簿的色彩標準。",
        behaviorFeedback: "行為與回饋",
        autoCopy: "自動複製到剪貼簿",
        autoCopyDesc: "取色後立即自動複製所選色彩值",
        showPalette: "顯示懸浮調色盤",
        showPaletteDesc: "取色後顯示互動式 HEX / RGB / HSL 調色盤視窗",
        feedbackNotification: "回饋通知",
        feedbackDisabledDesc: "啟用懸浮調色盤時已停用",
        feedbackEnabledDesc: "取色成功後顯示確認提示"
      },
      logic: {
        copiedColor: "已複製色彩",
        notSupported: "目前頁面或瀏覽器不支援 EyeDropper",
        pickedAndCopied: "已擷取並複製色彩",
        picked: "已擷取色彩",
        couldNotOpen: "無法開啟取色器",
        permissionRequired: "需要使用者互動或未取得權限",
        palette: {
          pickedColor: "已擷取色彩",
          close: "關閉",
          copyHex: "複製 HEX",
          copyRgb: "複製 RGB",
          copyHsl: "複製 HSL"
        }
      }
    },
    elementToys: {
      title: "元素工具",
      description: "在任意網頁上檢查、移除、編輯文字或重新定位頁面元素。",
      settings: {
        launchTooltip: "在目前頁面啟動 元素工具",
        shortcutTitle: "啟用快捷鍵",
        shortcutDesc: "在目前頁面開啟 元素工具 懸浮工具列",
        inspectorBadge: "元素檢查器徽章",
        showDimensions: "顯示元素尺寸",
        showDimensionsDesc: "在懸停徽章上測量並顯示 寬 × 高 (px)",
        showTags: "顯示標籤與類別名稱",
        showTagsDesc: "顯示 HTML 標籤名及 CSS 類別選擇器（如 div.banner#hero）",
        behaviorSection: "元素工具 行為",
        defaultTool: "啟動時預設工具",
        defaultToolDesc: "啟用 元素工具 時預設選取的工具",
        modes: {
          zap: "移除 (Zap)",
          edit: "編輯",
          move: "移動",
          hide: "隱藏"
        },
        continuousSession: "連續操作模式",
        continuousSessionDesc: "每次操作後保持工具啟用，直到按 Esc 或結束",
        autoUnfreeze: "自動解鎖頁面捲動",
        autoUnfreezeDesc:
          "如果移除的元素是鎖定捲動的遮罩層，自動恢復捲動 (overflow: auto)",
        showToast: "顯示懸浮提示",
        showToastDesc: "執行操作時在頁面上顯示確認橫幅",
        howToUse: "如何使用 元素工具",
        tipShortcutPrefix: "按",
        tipShortcutSuffix: "在頁面內開啟懸浮 HUD 工具列。",
        tipNoShortcutPrefix: "在上方設定快捷鍵或點擊",
        tipNoShortcutSuffix: "在頁面內開啟懸浮 HUD 工具列。",
        tipZapDesc: "點擊任意橫幅、遮罩層或小工具將其從 DOM 中移除。",
        tipEditDesc:
          "點擊任意文字即可即時內聯編輯（鍵盤輸入與原網頁完全隔離）。",
        tipMoveDesc:
          "拖曳以重新定位元素。可在工具列直接切換 Flow/Free 模式，按 + / - 擴大或縮小選取範圍。",
        tipHideDesc: "點擊即可隱藏元素，同時不破壞頁面原有流式版面。",
        tipUndoPrefix: "按",
        tipUndoMiddle: "復原任意操作，或點擊工具列上的",
        tipUndoSettings: "設定",
        tipUndoSuffix: "按鈕設定更多選項。"
      },
      toolbar: {
        title: "元素工具",
        zap: "移除",
        zapTip: "移除：點擊從 DOM 中刪除元素",
        edit: "編輯",
        editTip: "編輯文字：點擊任意文字即可內聯編輯",
        move: "移動",
        moveActiveTip: "移動工具已啟用 (按 +/- 調整父級範圍)",
        moveTip: "移動：點擊啟用移動模式 (Flow / Free)",
        moveLabel: "移動 ({{mode}})",
        flow: "Flow",
        flowTip: "Flow 模式：在 DOM 版面中重排並推動其他元素",
        free: "Free",
        freeTip: "Free 模式：自由變換位置，不改變原有版面",
        hide: "隱藏",
        hideTip: "隱藏：點擊軟隱藏元素，不影響頁面排版",
        undo: "復原",
        undoTip: "復原上一步操作 (Ctrl+Z)",
        settings: "設定",
        settingsTip: "開啟元素工具設定",
        exit: "離開",
        exitTip: "離開元素工具 (Esc)"
      },
      overlay: {
        clickToZap: "點擊移除",
        clickToEdit: "點擊編輯文字",
        dragBody: "拖曳主體以{{type}} • 拖曳邊角以調整大小",
        clickToHide: "點擊隱藏"
      },
      logic: {
        zapped: "已移除元素！",
        hidden: "已隱藏元素",
        resized: "已調整元素大小",
        textUpdated: "文字已更新",
        undone: "操作已復原",
        undoneDetail: "已復原 {{action}}",
        closed: "已關閉元素工具",
        active: "元素工具已啟用",
        activeDetail: "從頂部工具列選擇工具 • 按 Esc 離開",
        scope: "範圍: <{{tag}}>",
        scopeDetail: "層級 +{{depth}} (按 - 縮小)",
        scrollUnfrozen: "已解鎖頁面捲動",
        scrollUnfrozenDetail: "已恢復 overflow: auto"
      }
    },
    quickHub: {
      title: "快捷中心",
      description: "螢幕快捷工具中心，支援角落懸停智慧喚醒。",
      settings: {
        floatingPlacement: "懸浮按鈕位置",
        floatingPlacementDesc:
          "沿著螢幕邊緣拖曳或點擊，將 快捷中心 觸發按鈕錨定到任意位置。",
        buttonShapeDesc: "自訂懸浮觸發按鈕的形狀。",
        buttonOpacityDesc: "調整懸浮觸發按鈕的透明度。",
        customizeMenu: "自訂選單",
        customizeMenuDesc:
          "拖曳項目以調整 快捷中心 中的順序，或切換隱藏不常用的工具。",
        behaviorProximity: "行為與喚醒感應",
        hoverProximity: "靠近角落時顯示",
        hoverProximityDesc:
          "僅當游標靠近角落時顯示懸浮按鈕。停用後按鈕將保持 30% 不透明度常駐顯示。",
        keyboardShortcut: "鍵盤快捷鍵",
        globalHotkey: "全域熱鍵 (可選)",
        globalHotkeyDesc: "在目前網頁切換 快捷中心 選單。",
        disabledInSettings: "{{feature}} 已在擴充功能設定中停用",
        hiddenInMenu: "{{feature}} 已在彈出選單中隱藏",
        quickScrollTopOnly: "Quick Scroll 已設定為「僅頂部」模式",
        actions: {
          pipTitle: "在子母畫面中觀看影片",
          pipDesc: "在懸浮子母畫面視窗中觀看影片",
          colorPickerTitle: "從螢幕擷取色彩",
          colorPickerDesc: "像素放大鏡取色並即時複製 HEX",
          elementToysTitle: "元素工具",
          elementToysDesc: "檢查、移除、編輯文字或移動頁面元素",
          scrollTopTitle: "捲動到頂部",
          scrollTopDesc: "平滑跳轉至頁面頂部",
          scrollBottomTitle: "捲動到底部",
          scrollBottomDesc: "平滑跳轉至頁面底部",
          resetZoomTitle: "重設頁面縮放",
          resetZoomDesc: "恢復 100% 視口縮放比例",
          cleanUrlTitle: "複製純淨 URL",
          cleanUrlDesc: "複製移除追蹤參數 (utm_*, fbclid) 後的連結",
          allowRightClickTitle: "允許右鍵",
          allowRightClickDesc: "在目前分頁切換解除右鍵與複製限制",
          copyMarkdownTitle: "複製頁面 Markdown",
          copyMarkdownDesc: "以 [標題](URL) 格式複製純淨頁面連結",
          videoScreenshotTitle: "擷取影片畫面",
          videoScreenshotDesc: "將目前影片的 PNG 截圖複製到剪貼簿"
        }
      },
      logic: {
        noToolsActive: "尚無可用工具，請在 Browse Assist 彈出視窗中啟用功能。",
        triggerTooltip: "快捷中心 (快捷工具)",
        triggerAria: "快捷中心",
        cleanUrlCopied: "已複製純淨 URL",
        markdownCopied: "已複製頁面 Markdown",
        noVideoFound: "目前頁面找不到可擷取的影片"
      }
    },
    imageHoverPreview: {
      title: "圖片懸停預覽",
      description: "懸停在圖片或圖片連結上即可預覽原圖尺寸。",
      settings: {
        activation: "啟用方式",
        triggerModifier: "觸發修飾鍵",
        triggerModifierDesc: "懸停圖片時按住此鍵即可觸發預覽。",
        hoverDelay: "懸停延遲",
        hoverDelayDesc: "開啟預覽卡片前的等待時間。",
        instant: "即時",
        displaySize: "顯示尺寸",
        maxViewportSize: "最大視口佔比",
        animation: "進場動畫",
        animationDesc: "預覽卡片出現時的過渡效果。",
        animZoom: "縮放",
        animFade: "淡入",
        animSlide: "滑動",
        animNone: "無",
        behavior: "行為",
        previewImageLinks: "預覽圖片連結",
        previewImageLinksDesc: "懸停指向圖片檔案的超連結時也顯示圖片預覽。",
        showDimensions: "顯示尺寸徽章",
        showDimensionsDesc: "在預覽角落顯示原始 寬 × 高 (px)。"
      }
    }
  }
}
