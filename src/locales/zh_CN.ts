import type { TranslationDict } from "./en"

export const zh_CN: TranslationDict = {
  common: {
    appName: "Browse Assist",
    appSlogan: "全面提升你的网页浏览体验",
    appDescription:
      "轻量、模块化的浏览器效率工具集，全面提升网页浏览体验。",
    enabled: "已启用",
    disabled: "已禁用",
    reset: "重置",
    clear: "清除",
    cancel: "取消",
    gotIt: "知道了",
    viewportScreen: "视口屏幕",
    unassigned: "未分配",
    launch: "启动",
    all: "全部",
    none: "无",
    customizeShortcuts: "在浏览器快捷键设置中自定义",
    shortcutNotAssignedTip: "未分配快捷键，点击在浏览器设置中配置",
    customizeShortcutTip: "点击在浏览器设置中自定义快捷键",
    backTip: "返回 (退格键或 `)",
    toggleFeatureAria: "切换 {{feature}}",
    resetOrder: "重置顺序",
    show: "显示",
    hide: "隐藏",
    center: "居中",
    left: "左",
    right: "右",
    top: "上",
    bottom: "下",
    unstable: "不稳定",
    screenPosition: "屏幕位置",
    buttonOpacity: "按钮不透明度",
    buttonShape: "按钮形状",
    shapes: {
      circle: "圆形",
      capsule: "胶囊形",
      rounded: "圆角矩形",
      pill: "药丸形"
    },
    modifiers: {
      alt: "Alt",
      shift: "Shift",
      ctrl: "Ctrl",
      altKey: "Alt 键",
      shiftKey: "Shift 键",
      rightClick: "鼠标右键",
      leftClick: "鼠标左键"
    }
  },
  popup: {
    searchPlaceholder: "搜索工具...",
    noResults: "没有匹配的工具。",
    resetFilters: "重置筛选",
    switchToList: "切换为列表视图",
    switchToGrid: "切换为紧凑网格",
    pipBannerTitle: "视频画中画播放中",
    pipExit: "退出画中画",
    supportTitle: "支持本项目",
    categories: {
      all: "全部",
      interaction: "鼠标",
      navigation: "滚动",
      media: "媒体",
      tools: "工具"
    },
    tooltips: {
      preferencesAndTheme: "偏好设置与主题",
      about: "关于 Browse Assist",
      supportDonate: "支持与捐赠",
      jumpToVideoTab: "点击跳转到此视频标签页",
      exitPipWindow: "退出画中画窗口"
    }
  },
  preferences: {
    title: "偏好设置",
    appearance: "外观",
    themeMode: "主题模式",
    themeModeDesc: "浅色、深色或跟随系统主题。",
    themeDark: "深色",
    themeLight: "浅色",
    themeSystem: "跟随系统",
    viewMode: "视图模式",
    viewModeDesc: "详细列表或紧凑磁贴网格。",
    viewModeList: "列表",
    viewModeGrid: "网格",
    language: "语言",
    languageDesc: "选择界面语言或跟随浏览器。",
    languageAuto: "自动 (浏览器)",
    navigation: "导航",
    searchAndFilter: "搜索与分类筛选",
    searchAndFilterDesc: "在弹窗顶部显示搜索栏和分类标签。",
    rememberLastView: "记住上次视图",
    rememberLastViewDesc: "重新打开弹窗时回到上次浏览的设置页面。",
    sessionTimeout: "会话超时",
    minutesShort: "{{count}} 分钟",
    tickOneMin: "1 分钟",
    tickTenMinDefault: "10 分钟 (默认)",
    tickSixtyMin: "60 分钟",
    customizeMenu: "自定义菜单",
    customizeMenuDesc: "拖动以重新排序，或切换功能在弹窗中的显示状态。",
    presets: "预设方案",
    presetReading: "阅读与导航",
    presetReadingDesc: "滚动、拖拽与阅读",
    presetDesigner: "设计与开发",
    presetDesignerDesc: "取色、检查与编辑",
    presetEssential: "仅保留核心",
    presetEssentialDesc: "精简而专注",
    other: "其他",
    optionsPage: "扩展选项页面",
    optionsPageDesc: "完整设置面板与快捷键指南"
  },
  donate: {
    buyMeACoffeeDesc: "买杯咖啡支持项目持续维护",
    githubSponsorsDesc: "通过 GitHub 按月或单次赞助",
    vietqrDesc: "通过 VietQR 即时银行转账 (越南)",
    authorDonateLabel: "作者捐赠页面",
    authorDonateDesc: "直接向作者捐赠"
  },
  dialogs: {
    firefoxGuide: {
      title: "Firefox 快捷键配置指南",
      intro: "您可以直接在浏览器的扩展设置中自定义快捷键：",
      step1Prefix: "在 Firefox 中打开新标签页并访问",
      copyUrlTip: "点击复制网址",
      step2Prefix: "点击附加组件管理器右上角的",
      step2Target: "齿轮图标 ⚙",
      step2Suffix: "。",
      step3Prefix: "在下拉菜单中选择",
      step3Target: "“管理扩展快捷键”",
      step3Suffix: "。",
      step4Prefix: "找到",
      step4Suffix: "并为每项命令分配您喜欢的快捷键。"
    }
  },
  options: {
    title: "Browse Assist 设置",
    subtitle: "配置您的浏览器效率工具集与快捷键",
    openPopup: "打开弹窗",
    openPopupTip: "打开扩展弹窗",
    preferences: "偏好设置",
    preferencesTip: "在弹窗中打开偏好设置",
    about: "关于",
    aboutTip: "在弹窗中打开关于信息",
    activeModules: "已启用模块",
    configureInPopup: "在弹窗中配置 {{feature}}",
    shortcutsTitle: "键盘与鼠标快捷键参考",
    shortcutsSubtitle: "实时浏览器热键与交互手势触发器",
    customizeShortcuts: "自定义快捷键",
    table: {
      action: "操作",
      shortcut: "快捷键 / 触发器",
      description: "说明"
    },
    triggers: {
      mouseWheel: "{{modifier}} + 鼠标滚轮",
      mouseDrag: "鼠标拖拽",
      doubleClickMargin: "双击页面边缘",
      rightClickLink: "右键点击链接"
    },
    shortcuts: {
      pip: {
        name: "通用画中画 (PiP)",
        desc: "将当前播放的视频分离为悬浮画中画窗口"
      },
      allowRightClick: {
        name: "允许右键",
        desc: "在当前标签页解锁右键菜单与文本复制"
      },
      elementToys: {
        name: "元素工具",
        desc: "启用点选定位，移除、编辑、隐藏或移动页面元素"
      },
      colorPicker: {
        name: "屏幕取色器",
        desc: "启动屏幕像素放大镜以拾取并复制颜色代码"
      },
      quickHub: {
        name: "快捷中心 快捷键",
        desc: "通过键盘切换屏幕上的 快捷中心 悬浮菜单"
      },
      volume: {
        name: "视频音量控制",
        desc: "悬停视频滚动调节音量；按住修饰键点击静音"
      },
      speed: {
        name: "视频倍速控制",
        desc: "悬停视频平滑调节播放速度；点击切换全屏"
      },
      seek: {
        name: "视频快进与逐帧步进",
        desc: "快进/快退；视频暂停时支持逐帧微调"
      },
      boost: {
        name: "视频倍速加速",
        desc: "在视频上按住 X 键临时以 {{speed}}x 倍速播放"
      },
      mouseZoom: {
        name: "鼠标定点缩放",
        desc: "以鼠标光标位置为中心平滑缩放页面"
      },
      superDrag: {
        name: "超级拖拽",
        desc: "拖拽文字在新标签页搜索；拖拽链接在后台标签页打开"
      },
      quickScroll: {
        name: "快速滚动",
        desc: "双击屏幕边缘或点击悬浮按钮跳转至顶部或底部"
      },
      smoothScroll: {
        name: "平滑滚动",
        desc: "在所有可滚动容器中应用惯性物理插值"
      },
      cleanLink: {
        name: "复制纯净链接",
        desc: "去除追踪参数 (utm_*, fbclid) 并复制纯净或 Markdown 链接"
      },
      quickHubZone: {
        name: "快捷中心 触发区",
        desc: "鼠标悬停屏幕角落触发区以展开快捷工具"
      }
    },
    storage: {
      title: "扩展存储与数据",
      desc: "永久清除 Browse Assist 在浏览器中保存的所有数据与设置，包括自定义配置、快捷键偏好、快捷中心 排序及取色记录。",
      clearAll: "清除所有数据...",
      cleared: "所有扩展数据已清除并恢复为出厂默认设置。",
      footer:
        "Browse Assist • Manifest V3 • 基于 Plasmo、React 与 Tailwind CSS 构建"
    },
    modal: {
      title: "清除所有扩展数据？",
      body: "这将永久删除 Browse Assist 在您浏览器配置文件中存储的所有数据。",
      listHeader: "以下内容将被删除：",
      item1: "所有功能开关状态及子配置",
      item2: "快捷中心 排序、置顶操作及隐藏模块",
      item3: "取色器中的颜色历史记录",
      item4: "主题偏好与弹窗导航记忆",
      warning: "⚠️ 此操作不可撤销。所有设置将立即恢复为默认状态。",
      clearing: "正在清除数据...",
      confirm: "确认删除全部数据"
    }
  },
  content: {
    copied: {
      linkText: "已复制链接文本",
      cleanLink: "已复制纯净链接",
      markdown: "已复制 Markdown",
      cleanPageUrl: "已复制纯净页面 URL",
      pageMarkdown: "已复制页面 Markdown",
      quote: "已复制引用",
      text: "已复制文本",
      imageLink: "已复制图片链接",
      linkUrl: "已复制链接 URL"
    },
    fabMenu: {
      movePosition: "移动位置",
      openSettings: "打开设置",
      hideOnTab: "在当前标签页隐藏",
      disableFeature: "关闭{{feature}}",
      disablePipHoverButton: "关闭 PiP 悬浮按钮",
      dragHint: "移动至边缘并点击放置 • 按 Esc 取消",
      quickDragHint: "拖至边缘并松开右键放置 • 按 Esc 取消",
      positionSaved: "位置已保存",
      hiddenOnTab: "已在当前标签页隐藏{{feature}}"
    }
  },
  about: {
    title: "关于",
    projectAndLegal: "项目与法律信息",
    homePage: "主页",
    terms: "条款",
    policy: "隐私政策",
    openSourceLibraries: "开源库",
    declaredPermissions: "已声明权限",
    permissionNames: {
      storage: "存储",
      contextMenus: "右键菜单",
      clipboardWrite: "剪贴板",
      search: "搜索"
    },
    permissions: {
      storage: "在本地持久化保存自定义设置与功能偏好。",
      contextMenus: "在右键菜单中提供快捷操作（如复制纯净链接）。",
      clipboardWrite: "将拾取的颜色代码和 Markdown 链接复制到剪贴板。",
      search: "在 超级拖拽 时使用默认搜索引擎搜索选中文本。"
    }
  },
  features: {
    allowRightClick: {
      title: "允许右键",
      description: "在限制右键的网站上恢复右键菜单、文本选择与复制功能。",
      popupDesc: "在当前标签页启用右键菜单和复制，不影响其他应用。",
      toastEnabled: "已启用右键",
      toastDisabled: "已禁用右键",
      currentTab: "当前标签页"
    },
    contextMenuActions: {
      title: "右键菜单操作",
      description: "自定义右键菜单操作，用于复制纯净链接或 Markdown 格式。",
      activeCount: "{{count}}/6 已启用",
      copyLinkText: "复制链接文本",
      cleanLinkCopy: "复制纯净链接",
      markdownLinkCopy: "复制为 Markdown 链接",
      copyCleanPageUrl: "复制纯净页面 URL",
      copyPageMarkdown: "复制页面为 Markdown",
      copySelectionQuote: "复制选中内容为引用",
      settings: {
        sectionTitle: "右键菜单项",
        sectionDesc: "拖动以调整顺序，或切换在右键菜单中的可见性。",
        badges: {
          textOnly: "仅文本",
          antiTracking: "防追踪",
          markdown: "[文本](URL)",
          page: "页面",
          selection: "选区"
        },
        descriptions: {
          copyLinkText: "仅提取并复制链接的锚文本，不包含 URL。",
          cleanLinkCopy: "复制前自动移除追踪参数 (utm_*, fbclid, si)。",
          markdownLinkCopy:
            "复制格式化 Markdown 超链接，适合 Obsidian、Notion 和 GitHub。",
          copyCleanPageUrl:
            "在页面任意处右键即可复制无追踪参数的页面 URL。",
          copyPageMarkdown:
            "将当前页面标题和纯净 URL 复制为 [标题](URL)。",
          copySelectionQuote:
            "将高亮文本复制为带来源链接的 Markdown 引用块。"
        }
      }
    },
    superDrag: {
      title: "超级拖拽",
      description: "拖拽选中文本即可搜索，拖拽链接即可在新标签页打开。",
      settings: {
        dragTargets: "拖拽目标",
        tabs: {
          text: "文本",
          link: "链接",
          image: "图片"
        },
        searchText: "搜索高亮文本",
        searchTextDesc: "向 4 个方向拖拽选中文本以搜索、打开窗口或复制。",
        textDisabled: "当前已禁用高亮文本拖拽。",
        openLinks: "打开超链接",
        openLinksDesc: "拖拽超链接以在标签页、新窗口打开或复制链接/文本。",
        linksDisabled: "当前已禁用超链接拖拽。",
        dragImages: "拖拽图片",
        dragImagesDesc: "拖拽图片以在标签页、新窗口查看或复制图片直链。",
        imagesDisabled: "当前已禁用图片拖拽。",
        displayFeedback: "显示与反馈",
        dragIndicator: "拖拽视觉指示器",
        dragIndicatorDesc: "选择拖拽元素时显示的视觉反馈样式。",
        indicatorOpacity: "指示器不透明度",
        indicatorOpacityDesc: "调整拖拽时显示的指示器透明度。",
        indicatorStyles: {
          none: "禁用",
          badge: "悬浮徽章",
          radial: "圆形扇区"
        },
        directionalGestures: "方向手势",
        actions: {
          open_bg_tab: "后台标签页",
          open_active_tab: "前台新标签页",
          open_window_active: "新窗口",
          open_incognito_active: "无痕窗口",
          none: "无（不执行操作）",
          copy_to_clipboard: "复制",
          copy_link_text: "复制链接文本",
          copy_link_url: "复制链接 URL",
          copy_markdown: "复制 Markdown",
          copy_image_link: "复制图片链接",
          search_image: "搜索图片"
        }
      },
      logic: {
        types: {
          search: "搜索",
          image: "图片",
          link: "链接"
        },
        dropOpenBackground: "松开以在后台打开{{type}}",
        shortOpenBackground: "{{type}} (后台)",
        dropOpenActive: "松开以在新标签页打开{{type}}",
        shortOpenActive: "{{type}} (新标签页)",
        dropOpenWindow: "松开以在新窗口打开{{type}}",
        shortOpenWindow: "{{type}} (新窗口)",
        dropOpenIncognito: "松开以在无痕窗口打开{{type}}",
        shortOpenIncognito: "{{type}} (无痕)",
        dropCopyLinkText: "松开以复制链接文本",
        shortCopyLinkText: "复制文本",
        dropCopyMarkdown: "松开以复制 Markdown",
        shortCopyMarkdown: "复制 Markdown",
        dropSearchImage: "松开以搜索图片",
        shortSearchImage: "搜索图片",
        dropCopyText: "松开以复制文本",
        shortCopyText: "复制文本",
        dropCopyImageLink: "松开以复制图片链接",
        shortCopyImageLink: "复制图片链接",
        dropCopyLinkUrl: "松开以复制链接 URL",
        shortCopyLinkUrl: "复制链接",
        noAction: "无操作",
        releaseToCancel: "松开取消",
        exceededMax: "超出最大距离 (松开取消)"
      }
    },
    quickScroll: {
      title: "快速滚动按钮",
      description: "智能悬浮按钮，平滑快速跳转至页面顶部或底部。",
      settings: {
        buttonPlacement: "按钮位置",
        buttonPlacementDesc: "沿着屏幕左/右边缘拖动或点击以锚定滚动按钮。",
        controlsStyle: "控制与样式",
        buttonSelection: "按钮选择",
        buttonSelectionDesc: "同时显示顶部和底部按钮，或仅显示顶部按钮。",
        modes: {
          both: "顶部和底部",
          topOnly: "仅顶部"
        },
        buttonShapeDesc: "选择圆形、一体胶囊形或圆角方形。",
        buttonOpacityDesc: "调整未悬停时的透明度。",
        behaviorIntel: "行为与智能特性",
        autoDim: "空闲时自动变暗",
        autoDimDesc: "停止滚动时淡化按钮透明度；悬停时立即恢复。",
        scrollMemory: "滚动位置记忆",
        scrollMemoryDesc: "跳转时保存当前阅读位置，支持一键返回原处。",
        hideOnNative: "网页自带按钮时隐藏",
        hideOnNativeDesc: "当网页已提供固定回到顶部按钮时自动隐藏。"
      },
      logic: {
        scrollToTop: "滚动到顶部",
        scrollToBottom: "滚动到底部",
        returnToPrevious: "返回之前的位置"
      }
    },
    smoothScroll: {
      title: "平滑滚动",
      description: "基于插值物理效果的丝滑页面滚动。",
      settings: {
        profiles: "预设方案",
        presetBalanced: "均衡",
        presetUltra: "极柔",
        presetSnappy: "利落",
        presetCustom: "自定义",
        fineTuning: "参数微调",
        scrollDistance: "滚动距离",
        glidingDuration: "滑行时长",
        ignoreTouchpad: "忽略触控板",
        ignoreTouchpadDesc: "跳过微小滚轮事件，保留系统触控板原生惯性。",
        keyboardScroll: "键盘平滑滚动",
        keyboardScrollDesc:
          "为方向键、PageUp/Down 和空格键提供平滑插值滚动。",
        aggressiveMode: "强力拦截模式",
        aggressiveModeDesc:
          "在所有网站强制启用平滑滚动。建议关闭以保护画布及 Web 应用（如 Konva、Figma、地图）。"
      }
    },
    mouseZoom: {
      title: "鼠标定点缩放",
      description: "按住修饰键并滚动滚轮，以鼠标光标为中心缩放页面。",
      settings: {
        resetZoomTooltip: "将当前标签页缩放重置为 100%",
        triggerModifier: "触发修饰键",
        zoomSensitivity: "缩放灵敏度",
        stepIncrement: "步进幅度",
        tickFine: "4% (精细)",
        tickDefault: "10% (默认)",
        tickFast: "25% (快速)",
        behaviorDisplay: "行为与显示",
        smoothAnimation: "平滑动画",
        smoothAnimationDesc: "对缩放过渡进行平滑插值，体验更流畅。",
        invertDirection: "反转方向",
        invertDirectionDesc: "向下滚动放大，向上滚动缩小。",
        showZoomToast: "显示缩放提示",
        showZoomToastDesc: "在页面右上角显示悬浮缩放百分比徽章。"
      },
      logic: {
        pageZoom: "页面缩放"
      }
    },
    pictureInPicture: {
      title: "通用画中画 (PiP)",
      description: "使用可自定义快捷键切换视频悬浮画中画窗口。",
      settings: {
        shortTitle: "Picture-in-Picture",
        globalShortcut: "全局快捷键",
        globalShortcutDesc: "切换视频悬浮窗口",
        displayFeedback: "显示与反馈",
        extensionBadge: "扩展图标徽章",
        extensionBadgeDesc: "视频处于画中画时在扩展图标上显示“PiP”标记。",
        actionToast: "操作提示通知",
        actionToastDesc: "进入或退出画中画时显示简短确认提示。",
        autoPauseOnExit: "退出画中画时自动暂停",
        autoPauseOnExitDesc: "关闭画中画窗口时自动暂停视频播放。",
        hoverButton: "视频悬停 PiP 按钮",
        hoverButtonDesc:
          "在播放中的视频内显示悬浮 PiP 按钮。部分自定义播放器上可能不稳定。",
        buttonPosition: "按钮位置",
        edgeAlignment: "边缘与对齐",
        edgeAlignmentDesc: "沿着视频边缘拖动或点击以锚定悬浮 PiP 按钮。",
        buttonOpacityDesc: "调整未聚焦时悬停按钮的透明度。"
      },
      logic: {
        watchInPip: "在画中画中观看",
        exitedPip: "已退出画中画",
        enteredPip: "已进入画中画",
        notSupported: "当前浏览器不支持画中画",
        cannotEnter: "无法进入画中画",
        noVideoFound: "页面上未找到视频"
      },
      background: {
        playing: "画中画播放中: {{title}}",
        untitledVideo: "视频"
      }
    },
    videoWheelControl: {
      title: "视频滚轮控制",
      description: "使用鼠标滚轮平滑调节视频音量、倍速和进度。",
      settings: {
        tabs: {
          volume: "音量",
          speed: "倍速",
          seek: "快进",
          extra: "扩展"
        },
        conflictTitle: "检测到修饰键冲突",
        conflictDesc:
          "两个或以上启用的控制项共用了同一修饰键（优先级：快进 > 倍速 > 音量），请分配不同按键。",
        modifierKey: "修饰键",
        modifierKeyDesc: "按住按键 + 在视频上滚动滚轮",
        volumeControl: "音量控制",
        volumeStep: "音量步进",
        clickToMute: "点击静音",
        clickToMuteDesc: "按住 {{key}} 点击视频即可切换静音。",
        invertVolume: "反转音量滚轮",
        invertVolumeDesc: "调节音量时反转滚轮方向。",
        speedControl: "倍速控制",
        speedStep: "倍速步进",
        holdXBoost: "按住 'X' 加速 (2.0x)",
        holdXBoostDesc: "观看视频时按住 'X' 键可临时以 2.0x 倍速播放。",
        clickToFullscreen: "点击全屏",
        clickToFullscreenDesc: "按住 {{key}} 点击视频即可切换全屏。",
        invertSpeed: "反转倍速滚轮",
        invertSpeedDesc: "调节播放速度时反转滚轮方向。",
        seekControl: "进度快进控制",
        seekStep: "快进步长 (秒)",
        frameStepper: "逐帧步进",
        frameStepperDesc: "视频暂停时，滚动滚轮可逐帧微调 (~1/30 秒)。",
        invertSeek: "反转快进滚轮",
        invertSeekDesc: "快进快退时反转滚轮方向。",
        screenshot: "视频截图 (Shift+Alt+点击)",
        screenshotDesc: "将当前视频帧直接以 PNG 格式复制到剪贴板。",
        osd: "屏幕显示 (OSD)",
        osdDesc: "为音量、倍速、进度和加速显示悬浮 HUD 徽章。",
        osdOpacity: "OSD 不透明度",
        osdOpacityDesc: "调整悬浮 OSD 徽章的透明度。",
        noticeTitle: "兼容性与状态说明",
        noticeBody1: "此功能直接与底层 HTML5 媒体元素 (<video>) 交互。",
        noticeBody2:
          "在大型视频网站上，播放器状态管理器可能会在循环播放、切换清晰度或自动连播时重置倍速或静音状态。"
      },
      logic: {
        muted: "已静音",
        fullscreen: "全屏",
        exitFullscreen: "退出全屏",
        frameCopied: "已复制帧画面！",
        captureFailed: "截图失败",
        clipboardDenied: "剪贴板权限被拒",
        corsProtected: "受 CORS 保护",
        frameStep: "帧 {{sign}} ({{time}})",
        boost: "⚡ {{rate}}x 加速"
      }
    },
    colorPicker: {
      title: "屏幕取色器",
      description: "拾取屏幕任意像素颜色并支持多格式即时复制。",
      settings: {
        shortcutTitle: "取色器快捷键",
        shortcutDesc: "快速启动屏幕取色器",
        recentColors: "最近拾取的颜色",
        clearHistoryTooltip: "清除所有历史颜色记录",
        clickToCopy: "点击复制 {{value}}",
        noRecentColors: "暂无最近拾取的颜色。请使用上方快捷键或按钮。",
        defaultFormat: "默认复制格式",
        clipboardFormat: "剪贴板颜色格式",
        clipboardFormatDesc: "取色时自动复制到剪贴板的颜色标准。",
        behaviorFeedback: "行为与反馈",
        autoCopy: "自动复制到剪贴板",
        autoCopyDesc: "取色后立即自动复制所选颜色值",
        showPalette: "显示悬浮调色板",
        showPaletteDesc: "取色后显示交互式 HEX / RGB / HSL 调色板弹窗",
        feedbackNotification: "反馈通知",
        feedbackDisabledDesc: "启用悬浮调色板时已禁用",
        feedbackEnabledDesc: "取色成功后显示确认提示"
      },
      logic: {
        copiedColor: "已复制颜色",
        notSupported: "当前页面或浏览器不支持 EyeDropper",
        pickedAndCopied: "已拾取并复制颜色",
        picked: "已拾取颜色",
        couldNotOpen: "无法打开取色器",
        permissionRequired: "需要用户交互或未获得权限",
        palette: {
          pickedColor: "已拾取颜色",
          close: "关闭",
          copyHex: "复制 HEX",
          copyRgb: "复制 RGB",
          copyHsl: "复制 HSL"
        }
      }
    },
    elementToys: {
      title: "元素工具",
      description: "在任意网页上检查、移除、编辑文本或重新定位页面元素。",
      settings: {
        launchTooltip: "在当前页面启动 元素工具",
        shortcutTitle: "激活快捷键",
        shortcutDesc: "在当前页面打开 元素工具 悬浮工具栏",
        inspectorBadge: "元素检查器徽章",
        showDimensions: "显示元素尺寸",
        showDimensionsDesc: "在悬停徽章上测量并显示 宽 × 高 (px)",
        showTags: "显示标签与类名",
        showTagsDesc: "显示 HTML 标签名及 CSS 类选择器（如 div.banner#hero）",
        behaviorSection: "元素工具 行为",
        defaultTool: "启动时默认工具",
        defaultToolDesc: "激活 元素工具 时默认选中的工具",
        modes: {
          zap: "移除 (Zap)",
          edit: "编辑",
          move: "移动",
          hide: "隐藏"
        },
        continuousSession: "连续操作模式",
        continuousSessionDesc: "每次操作后保持工具激活，直到按 Esc 或退出",
        autoUnfreeze: "自动解锁页面滚动",
        autoUnfreezeDesc:
          "如果移除的元素是锁定滚动的遮罩层，自动恢复滚动 (overflow: auto)",
        showToast: "显示悬浮提示",
        showToastDesc: "执行操作时在页面上显示确认横幅",
        howToUse: "如何使用 元素工具",
        tipShortcutPrefix: "按",
        tipShortcutSuffix: "在页面内打开悬浮 HUD 工具栏。",
        tipNoShortcutPrefix: "在上方设置快捷键或点击",
        tipNoShortcutSuffix: "在页面内打开悬浮 HUD 工具栏。",
        tipZapDesc: "点击任意横幅、遮罩层或挂件将其从 DOM 中移除。",
        tipEditDesc:
          "点击任意文本即可实时内联编辑（键盘输入与原网页完全隔离）。",
        tipMoveDesc:
          "拖动以重新定位元素。可在工具栏直接切换 Flow/Free 模式，按 + / - 扩大或缩小选中范围。",
        tipHideDesc: "点击即可隐藏元素，同时不破坏页面原有流式布局。",
        tipUndoPrefix: "按",
        tipUndoMiddle: "撤销任意操作，或点击工具栏上的",
        tipUndoSettings: "设置",
        tipUndoSuffix: "按钮配置更多选项。"
      },
      toolbar: {
        title: "元素工具",
        zap: "移除",
        zapTip: "移除：点击从 DOM 中删除元素",
        edit: "编辑",
        editTip: "编辑文本：点击任意文字即可内联编辑",
        move: "移动",
        moveActiveTip: "移动工具已激活 (按 +/- 调整父级范围)",
        moveTip: "移动：点击启用移动模式 (Flow / Free)",
        moveLabel: "移动 ({{mode}})",
        flow: "Flow",
        flowTip: "Flow 模式：在 DOM 布局中重排并推动其他元素",
        free: "Free",
        freeTip: "Free 模式：自由变换位置，不改变原有布局",
        hide: "隐藏",
        hideTip: "隐藏：点击软隐藏元素，不影响页面排版",
        undo: "撤销",
        undoTip: "撤销上一步操作 (Ctrl+Z)",
        settings: "设置",
        settingsTip: "打开元素工具设置",
        exit: "退出",
        exitTip: "退出元素工具 (Esc)"
      },
      overlay: {
        clickToZap: "点击移除",
        clickToEdit: "点击编辑文本",
        dragBody: "拖动主体以{{type}} • 拖动边角以调整大小",
        clickToHide: "点击隐藏"
      },
      logic: {
        zapped: "已移除元素！",
        hidden: "已隐藏元素",
        resized: "已调整元素大小",
        textUpdated: "文本已更新",
        undone: "操作已撤销",
        undoneDetail: "已撤销 {{action}}",
        closed: "已关闭元素工具",
        active: "元素工具已启用",
        activeDetail: "从顶部工具栏选择工具 • 按 Esc 退出",
        scope: "范围: <{{tag}}>",
        scopeDetail: "层级 +{{depth}} (按 - 缩小)",
        scrollUnfrozen: "已解锁页面滚动",
        scrollUnfrozenDetail: "已恢复 overflow: auto"
      }
    },
    quickHub: {
      title: "快捷中心",
      description: "屏幕快捷工具中心，支持角落悬停智能唤醒。",
      settings: {
        floatingPlacement: "悬浮按钮位置",
        floatingPlacementDesc:
          "沿着屏幕边缘拖动或点击，将 快捷中心 触发按钮锚定到任意位置。",
        buttonShapeDesc: "自定义悬浮触发按钮的形状。",
        buttonOpacityDesc: "调整悬浮触发按钮的透明度。",
        customizeMenu: "自定义菜单",
        customizeMenuDesc:
          "拖动项目以调整 快捷中心 中的顺序，或切换隐藏不常用的工具。",
        behaviorProximity: "行为与唤醒感应",
        hoverProximity: "靠近角落时显现",
        hoverProximityDesc:
          "仅当光标靠近角落时显示悬浮按钮。关闭后按钮将保持 30% 不透明度常驻显示。",
        keyboardShortcut: "键盘快捷键",
        globalHotkey: "全局热键 (可选)",
        globalHotkeyDesc: "在当前网页切换 快捷中心 菜单。",
        disabledInSettings: "{{feature}} 已在扩展设置中禁用",
        hiddenInMenu: "{{feature}} 已在弹窗菜单中隐藏",
        quickScrollTopOnly: "Quick Scroll 已设置为“仅顶部”模式",
        actions: {
          pipTitle: "在画中画中观看视频",
          pipDesc: "在悬浮画中画窗口中观看视频",
          colorPickerTitle: "从屏幕拾取颜色",
          colorPickerDesc: "像素放大镜取色并即时复制 HEX",
          elementToysTitle: "元素工具",
          elementToysDesc: "检查、移除、编辑文本或移动页面元素",
          scrollTopTitle: "滚动到顶部",
          scrollTopDesc: "平滑跳转至页面顶部",
          scrollBottomTitle: "滚动到底部",
          scrollBottomDesc: "平滑跳转至页面底部",
          resetZoomTitle: "重置页面缩放",
          resetZoomDesc: "恢复 100% 视口缩放比例",
          cleanUrlTitle: "复制纯净 URL",
          cleanUrlDesc: "复制移除追踪参数 (utm_*, fbclid) 后的链接",
          allowRightClickTitle: "允许右键",
          allowRightClickDesc: "在当前标签页切换解除右键与复制限制",
          copyMarkdownTitle: "复制页面 Markdown",
          copyMarkdownDesc: "以 [标题](URL) 格式复制纯净页面链接",
          videoScreenshotTitle: "截取视频画面",
          videoScreenshotDesc: "将当前视频的 PNG 截图复制到剪贴板"
        }
      },
      logic: {
        noToolsActive: "暂无可用工具，请在 Browse Assist 弹窗中启用功能。",
        triggerTooltip: "快捷中心 (快捷工具)",
        triggerAria: "快捷中心",
        cleanUrlCopied: "已复制纯净 URL",
        markdownCopied: "已复制页面 Markdown",
        noVideoFound: "当前页面未找到可截取的视频"
      }
    },
    imageHoverPreview: {
      title: "图片悬停预览",
      description: "悬停在图片或图片链接上即可预览原图尺寸。",
      settings: {
        activation: "激活方式",
        triggerModifier: "触发修饰键",
        triggerModifierDesc: "悬停图片时按住此键即可触发预览。",
        hoverDelay: "悬停延迟",
        hoverDelayDesc: "打开预览卡片前的等待时间。",
        instant: "即时",
        displaySize: "显示尺寸",
        maxViewportSize: "最大视口占比",
        behavior: "行为",
        previewImageLinks: "预览图片链接",
        previewImageLinksDesc: "悬停指向图片文件的超链接时也显示图片预览。",
        showDimensions: "显示尺寸徽章",
        showDimensionsDesc: "在预览角落显示原始 宽 × 高 (px)。"
      }
    }
  }
}
