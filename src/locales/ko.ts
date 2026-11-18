import type { TranslationDict } from "./en"

export const ko: TranslationDict = {
  common: {
    enabled: "사용",
    disabled: "사용 안 함",
    on: "켜짐",
    off: "꺼짐",
    reset: "초기화",
    clear: "지우기",
    cancel: "취소",
    save: "저장",
    back: "뒤로",
    unassigned: "지정되지 않음",
    notConfigured: "설정되지 않음",
    configure: "설정",
    launch: "실행",
    all: "전체",
    none: "없음",
    customizeShortcuts: "브라우저 단축키 설정에서 변경",
    resetOrder: "순서 초기화",
    show: "표시",
    hide: "숨기기",
    center: "가운데",
    left: "왼쪽",
    right: "오른쪽",
    top: "위",
    bottom: "아래",
    unstable: "불안정",
    screenPosition: "화면 위치",
    buttonOpacity: "버튼 불투명도",
    buttonShape: "버튼 모양",
    shapes: {
      circle: "원형",
      capsule: "캡슐",
      rounded: "둥근 사각형",
      pill: "알약형"
    },
    modifiers: {
      alt: "Alt",
      shift: "Shift",
      ctrl: "Ctrl",
      altKey: "Alt 키",
      shiftKey: "Shift 키",
      rightClick: "우클릭",
      leftClick: "좌클릭"
    }
  },
  popup: {
    searchPlaceholder: "기능 검색...",
    noResults: "일치하는 기능이 없습니다.",
    resetFilters: "필터 초기화",
    switchToList: "목록 보기로 전환",
    switchToGrid: "컴팩트 그리드로 전환",
    pipBannerTitle: "PiP 모드 재생 중",
    pipExit: "PiP 종료",
    supportTitle: "프로젝트 후원",
    categories: {
      all: "전체",
      interaction: "마우스",
      navigation: "스크롤",
      media: "미디어",
      tools: "도구"
    }
  },
  preferences: {
    title: "환경설정",
    appearance: "모양",
    themeMode: "테마 모드",
    themeModeDesc: "라이트, 다크 또는 시스템 테마를 따릅니다.",
    viewMode: "보기 모드",
    viewModeDesc: "자세한 목록 또는 컴팩트 타일 그리드.",
    language: "언어",
    languageDesc: "인터페이스 언어를 선택하거나 브라우저 설정을 따릅니다.",
    languageAuto: "자동 (브라우저)",
    navigation: "탐색",
    searchAndFilter: "검색 및 카테고리 필터",
    searchAndFilterDesc: "팝업 상단에 검색창과 카테고리 탭을 표시합니다.",
    rememberLastView: "마지막 화면 기억",
    rememberLastViewDesc: "이전에 보던 설정 페이지에서 팝업을 다시 엽니다.",
    sessionTimeout: "세션 시간 제한",
    customizeMenu: "메뉴 사용자 지정",
    customizeMenuDesc:
      "드래그하여 순서를 바꾸거나 팝업에서 표시 여부를 전환합니다."
  },
  about: {
    title: "정보",
    projectAndLegal: "프로젝트 및 법적 고지",
    homePage: "홈페이지",
    terms: "이용약관",
    policy: "개인정보처리방침",
    openSourceLibraries: "오픈 소스 라이브러리",
    declaredPermissions: "선언된 권한",
    permissions: {
      storage: "사용자 설정과 기능 환경설정을 로컬에 저장합니다.",
      contextMenus: "깔끔한 링크 복사 등 빠른 우클릭 메뉴 작업을 제공합니다.",
      clipboardWrite: "추출한 색상 코드와 마크다운 링크를 클립보드에 복사합니다.",
      search: "Super Drag 시 선택한 텍스트를 기본 검색 엔진으로 검색합니다."
    }
  },
  features: {
    allowRightClick: {
      title: "Allow Right Click",
      description:
        "제한된 웹사이트에서 우클릭 메뉴, 텍스트 선택 및 복사를 복원합니다.",
      popupDesc:
        "다른 앱에 영향을 주지 않고 현재 탭에서 우클릭과 복사를 허용합니다.",
      toastEnabled: "우클릭 활성화됨",
      toastDisabled: "우클릭 비활성화됨",
      currentTab: "현재 탭"
    },
    contextMenuActions: {
      title: "Context Menu Actions",
      description:
        "추적 매개변수가 제거된 깔끔한 링크와 마크다운 복사를 위한 우클릭 작업.",
      activeCount: "{{count}}/6 활성",
      copyLinkText: "링크 텍스트 복사",
      cleanLinkCopy: "깔끔한 링크 복사",
      markdownLinkCopy: "마크다운으로 링크 복사",
      copyCleanPageUrl: "깔끔한 페이지 URL 복사",
      copyPageMarkdown: "페이지를 마크다운으로 복사",
      copySelectionQuote: "선택 영역을 인용구로 복사",
      settings: {
        sectionTitle: "우클릭 메뉴 항목",
        sectionDesc:
          "드래그하여 순서를 변경하거나 우클릭 메뉴에서 표시 여부를 전환하세요.",
        badges: {
          textOnly: "텍스트만",
          antiTracking: "추적 방지",
          markdown: "[텍스트](URL)",
          page: "페이지",
          selection: "선택 영역"
        },
        descriptions: {
          copyLinkText: "URL을 제외하고 링크 텍스트만 추출하여 복사합니다.",
          cleanLinkCopy:
            "복사하기 전에 추적 매개변수(utm_*, fbclid, si)를 제거합니다.",
          markdownLinkCopy:
            "Obsidian, Notion, GitHub에 적합한 마크다운 하이퍼링크를 복사합니다.",
          copyCleanPageUrl:
            "페이지 어디서나 우클릭하여 추적 매개변수 없는 URL을 복사합니다.",
          copyPageMarkdown:
            "현재 페이지 제목과 깔끔한 URL을 [제목](URL) 형식으로 복사합니다.",
          copySelectionQuote:
            "선택한 텍스트를 출처 링크가 포함된 마크다운 인용구로 복사합니다."
        }
      }
    },
    superDrag: {
      title: "Super Drag",
      description:
        "선택한 텍스트를 드래그하여 검색하거나 링크를 드래그하여 새 탭에서 엽니다.",
      settings: {
        dragTargets: "드래그 대상",
        tabs: {
          text: "텍스트",
          link: "링크",
          image: "이미지"
        },
        searchText: "강조된 텍스트 검색",
        searchTextDesc:
          "선택한 텍스트를 4방향으로 드래그하여 검색, 새 창 열기 또는 복사합니다.",
        textDisabled: "텍스트 드래그가 현재 비활성화되어 있습니다.",
        openLinks: "하이퍼링크 열기",
        openLinksDesc:
          "링크를 드래그하여 탭/창에서 열거나 URL 또는 텍스트를 복사합니다.",
        linksDisabled: "하이퍼링크 드래그가 현재 비활성화되어 있습니다.",
        dragImages: "이미지 드래그",
        dragImagesDesc:
          "이미지를 드래그하여 탭/창에서 보거나 직접 이미지 URL을 복사합니다.",
        imagesDisabled: "이미지 드래그가 현재 비활성화되어 있습니다.",
        displayFeedback: "표시 및 피드백",
        dragIndicator: "드래그 시각 표시기",
        dragIndicatorDesc:
          "요소를 드래그하는 동안 표시할 시각적 피드백 스타일을 선택합니다.",
        indicatorStyles: {
          none: "사용 안 함",
          badge: "플로팅 배지",
          radial: "원형 세그먼트"
        },
        directionalGestures: "방향 제스처",
        actions: {
          open_bg_tab: "백그라운드 탭",
          open_active_tab: "활성 탭",
          open_window_active: "새 창",
          open_incognito_active: "시크릿 창",
          none: "없음 (동작 안 함)",
          copy_to_clipboard: "복사",
          copy_link_text: "링크 텍스트 복사",
          copy_link_url: "링크 URL 복사",
          copy_markdown: "마크다운 복사",
          copy_image_link: "이미지 링크 복사",
          search_image: "이미지 검색"
        }
      }
    },
    quickScroll: {
      title: "Quick Scroll Buttons",
      description:
        "페이지 맨 위나 아래로 부드럽게 이동하는 스마트 플로팅 버튼.",
      settings: {
        buttonPlacement: "버튼 위치",
        buttonPlacementDesc:
          "왼쪽 또는 오른쪽 가장자리를 따라 드래그하거나 클릭하여 버튼을 고정합니다.",
        controlsStyle: "제어 및 스타일",
        buttonSelection: "버튼 선택",
        buttonSelectionDesc: "위/아래 버튼 모두 또는 위 버튼만 표시합니다.",
        modes: {
          both: "위 및 아래",
          topOnly: "위만"
        },
        buttonShapeDesc: "원형, 통합 캡슐 또는 둥근 사각형을 선택하세요.",
        buttonOpacityDesc: "마우스를 올리지 않았을 때의 투명도를 조정합니다.",
        behaviorIntel: "동작 및 스마트 기능",
        autoDim: "유휴 시 자동 흐리게",
        autoDimDesc:
          "스크롤을 멈추면 버튼을 흐리게 하고 마우스를 올리면 즉시 복원합니다.",
        scrollMemory: "스크롤 위치 기억",
        scrollMemoryDesc:
          "이동 전 읽던 위치를 저장하여 클릭 한 번으로 돌아갈 수 있습니다.",
        hideOnNative: "자체 스크롤 버튼이 있으면 숨기기",
        hideOnNativeDesc:
          "웹페이지에 고정된 맨 위로 버튼이 이미 있으면 자동으로 숨깁니다."
      },
      logic: {
        scrollToTop: "맨 위로 스크롤",
        scrollToBottom: "맨 아래로 스크롤",
        returnToPrevious: "이전 위치로 돌아가기"
      }
    },
    smoothScroll: {
      title: "Smooth Scrolling",
      description: "보간 물리를 적용한 매끄럽고 자연스러운 페이지 스크롤.",
      settings: {
        profiles: "프로필",
        presetBalanced: "균형",
        presetUltra: "울트라",
        presetSnappy: "경쾌함",
        presetCustom: "사용자 지정",
        fineTuning: "세부 조정",
        scrollDistance: "스크롤 거리",
        glidingDuration: "활강 시간",
        ignoreTouchpad: "터치패드 무시",
        ignoreTouchpadDesc:
          "작은 휠 이벤트를 건너뛰어 OS 기본 트랙패드 관성을 유지합니다.",
        keyboardScroll: "키보드 부드러운 스크롤",
        keyboardScrollDesc:
          "화살표, PageUp/Down 및 Space 키 스크롤을 부드럽게 보간합니다.",
        aggressiveMode: "강력 가로채기",
        aggressiveModeDesc:
          "모든 사이트에서 부드러운 스크롤을 강제합니다. Canvas/웹 앱(Figma, Maps) 보호를 위해 꺼 두세요."
      }
    },
    mouseZoom: {
      title: "Mouse Pin-to-Zoom",
      description:
        "보조 키를 누른 채 마우스 휠을 돌려 커서 위치를 확대/축소합니다.",
      settings: {
        resetZoomTooltip: "현재 탭의 확대/축소를 100%로 초기화",
        triggerModifier: "트리거 보조 키",
        zoomSensitivity: "확대/축소 감도",
        stepIncrement: "단계 증가량",
        tickFine: "4% (세밀)",
        tickDefault: "10% (기본)",
        tickFast: "25% (빠름)",
        behaviorDisplay: "동작 및 표시",
        smoothAnimation: "부드러운 애니메이션",
        smoothAnimationDesc: "확대/축소 전환을 부드럽게 보간합니다.",
        invertDirection: "방향 반전",
        invertDirectionDesc: "아래로 스크롤하여 확대, 위로 스크롤하여 축소합니다.",
        showZoomToast: "확대/축소 알림 표시",
        showZoomToastDesc: "페이지 오른쪽 상단에 플로팅 배율 배지를 표시합니다."
      }
    },
    pictureInPicture: {
      title: "Universal Picture-in-Picture",
      description: "사용자 지정 단축키로 플로팅 비디오 창을 전환합니다.",
      settings: {
        shortTitle: "Picture-in-Picture",
        globalShortcut: "전역 단축키",
        globalShortcutDesc: "플로팅 비디오 창 전환",
        displayFeedback: "표시 및 피드백",
        extensionBadge: "확장 프로그램 배지 표시",
        extensionBadgeDesc:
          "동영상이 PiP로 재생 중일 때 확장 아이콘에 “PiP” 배지를 표시합니다.",
        actionToast: "동작 알림",
        actionToastDesc: "PiP 시작 또는 종료 시 간단한 확인 알림을 표시합니다.",
        autoPauseOnExit: "PiP 종료 시 자동 일시정지",
        autoPauseOnExitDesc:
          "Picture-in-Picture 창을 닫을 때 동영상을 자동으로 일시정지합니다.",
        hoverButton: "동영상 호버 PiP 버튼",
        hoverButtonDesc:
          "재생 중인 동영상 내부에 PiP 버튼을 표시합니다. 일부 플레이어에서는 불안정할 수 있습니다.",
        buttonPosition: "버튼 위치",
        edgeAlignment: "가장자리 및 정렬",
        edgeAlignmentDesc:
          "가장자리를 따라 드래그하거나 클릭하여 동영상 프레임 안에 PiP 버튼을 고정합니다.",
        buttonOpacityDesc: "포커스가 없을 때 호버 버튼의 투명도를 조정합니다."
      },
      logic: {
        watchInPip: "Picture-in-Picture로 보기",
        exitedPip: "Picture-in-Picture 종료됨",
        enteredPip: "Picture-in-Picture 시작됨",
        notSupported: "이 브라우저에서는 PiP가 지원되지 않습니다",
        cannotEnter: "Picture-in-Picture를 시작할 수 없습니다",
        noVideoFound: "페이지에서 동영상을 찾을 수 없습니다"
      }
    },
    videoWheelControl: {
      title: "Video Wheel Control",
      description:
        "마우스 휠을 사용하여 동영상 볼륨, 재생 속도 및 탐색을 부드럽게 조절합니다.",
      settings: {
        tabs: {
          volume: "볼륨",
          speed: "속도",
          seek: "탐색",
          extra: "추가"
        },
        conflictTitle: "보조 키 충돌 감지됨",
        conflictDesc:
          "둘 이상의 활성 제어가 같은 보조 키를 공유합니다(우선순위: 탐색 > 속도 > 볼륨). 고유한 키를 지정하세요.",
        modifierKey: "보조 키",
        modifierKeyDesc: "키를 누른 상태에서 동영상 위에서 스크롤",
        volumeControl: "볼륨 제어",
        volumeStep: "볼륨 단계",
        clickToMute: "클릭하여 음소거",
        clickToMuteDesc: "{{key}} 키를 누른 채 동영상을 클릭하여 음소거 전환.",
        invertVolume: "볼륨 스크롤 반전",
        invertVolumeDesc: "볼륨 조절 시 휠 스크롤 방향을 반전합니다.",
        speedControl: "재생 속도 제어",
        speedStep: "속도 단계",
        holdXBoost: "'X' 길게 눌러 배속 (2.0x)",
        holdXBoostDesc:
          "동영상 시청 중 'X' 키를 누르고 있으면 일시적으로 2.0x 속도가 됩니다.",
        clickToFullscreen: "클릭하여 전체 화면",
        clickToFullscreenDesc:
          "{{key}} 키를 누른 채 동영상을 클릭하여 전체 화면 전환.",
        invertSpeed: "속도 스크롤 반전",
        invertSpeedDesc: "재생 속도 조절 시 휠 스크롤 방향을 반전합니다.",
        seekControl: "탐색 제어",
        seekStep: "탐색 간격 (초)",
        frameStepper: "프레임 단위 이동",
        frameStepperDesc:
          "동영상이 일시정지된 상태에서 휠을 돌리면 프레임(~1/30초) 단위로 이동합니다.",
        invertSeek: "탐색 스크롤 반전",
        invertSeekDesc: "동영상 탐색 시 휠 스크롤 방향을 반전합니다.",
        screenshot: "동영상 스크린샷 (Shift+Alt+클릭)",
        screenshotDesc:
          "현재 동영상 프레임을 PNG로 클립보드에 바로 복사합니다.",
        osd: "화면 표시 (OSD)",
        osdDesc: "볼륨, 속도, 탐색, 부스트용 플로팅 HUD 배지를 표시합니다.",
        osdOpacity: "OSD 불투명도",
        osdOpacityDesc: "플로팅 OSD 배지의 투명도를 조정합니다.",
        noticeTitle: "호환성 및 상태 안내",
        noticeBody1:
          "이 기능은 HTML5 미디어 요소(<video>)와 직접 상호작용합니다.",
        noticeBody2:
          "일부 대형 플랫폼에서는 반복, 해상도 변경 또는 자동 재생 시 자체 상태 관리자가 속도나 음소거를 초기화할 수 있습니다."
      }
    },
    colorPicker: {
      title: "Color Picker",
      description:
        "화면의 모든 픽셀 색상을 추출하고 다양한 형식으로 즉시 복사합니다.",
      settings: {
        shortcutTitle: "스포이드 단축키",
        shortcutDesc: "화면 색상 추출기 빠르게 실행",
        recentColors: "최근 색상",
        clearHistoryTooltip: "모든 최근 색상 기록 지우기",
        clickToCopy: "클릭하여 {{value}} 복사",
        noRecentColors:
          "최근에 추출한 색상이 없습니다. 위의 단축키나 버튼을 사용하세요.",
        defaultFormat: "기본 복사 형식",
        clipboardFormat: "클립보드 색상 형식",
        clipboardFormatDesc: "색상 추출 시 자동으로 복사되는 색상 표준입니다.",
        behaviorFeedback: "동작 및 피드백",
        autoCopy: "클립보드에 자동 복사",
        autoCopyDesc: "색상 추출 즉시 선택한 색상 값을 자동으로 복사합니다",
        showPalette: "플로팅 팔레트 표시",
        showPaletteDesc:
          "추출 후 대화형 HEX / RGB / HSL 팔레트 창을 표시합니다",
        feedbackNotification: "피드백 알림",
        feedbackDisabledDesc: "플로팅 팔레트가 활성화된 동안 비활성화됨",
        feedbackEnabledDesc: "색상을 추출할 때 확인 알림을 표시합니다"
      },
      logic: {
        copiedColor: "색상 복사됨",
        notSupported: "이 페이지/브라우저에서는 EyeDropper가 지원되지 않습니다",
        pickedAndCopied: "색상 추출 및 복사됨",
        picked: "색상 추출됨",
        couldNotOpen: "Color Picker를 열 수 없습니다",
        permissionRequired: "사용자 상호작용이 필요하거나 허용되지 않았습니다"
      }
    },
    elementToys: {
      title: "Element Toys",
      description:
        "모든 웹페이지에서 요소를 검사, 제거, 텍스트 편집 또는 재배치합니다.",
      settings: {
        launchTooltip: "페이지에서 Element Toys 실행",
        shortcutTitle: "실행 단축키",
        shortcutDesc: "활성 페이지에서 플로팅 Element Toys 도구 모음 열기",
        inspectorBadge: "요소 검사기 배지",
        showDimensions: "요소 크기 표시",
        showDimensionsDesc: "호버 배지에 너비 × 높이(px)를 측정하여 표시합니다",
        showTags: "태그 및 클래스 이름 표시",
        showTagsDesc:
          "HTML 태그 이름과 CSS 클래스 선택자(예: div.banner#hero)를 표시합니다",
        behaviorSection: "Element Toys 동작",
        defaultTool: "실행 시 기본 도구",
        defaultToolDesc: "Element Toys 활성화 시 선택되는 도구",
        modes: {
          zap: "제거 (Zap)",
          edit: "편집",
          move: "이동",
          hide: "숨기기"
        },
        continuousSession: "연속 세션",
        continuousSessionDesc:
          "Esc 또는 종료를 누를 때까지 각 작업 후에도 도구를 활성 상태로 유지합니다",
        autoUnfreeze: "페이지 스크롤 자동 잠금 해제",
        autoUnfreezeDesc:
          "스크롤을 잠그던 모달 오버레이를 제거하면 스크롤(overflow: auto)을 복원합니다",
        showToast: "플로팅 알림 표시",
        showToastDesc: "작업이 실행될 때 페이지에 확인 배너를 표시합니다",
        howToUse: "Element Toys 사용 방법",
        tipShortcutPrefix: "누르기:",
        tipShortcutSuffix: "키를 눌러 페이지 내 플로팅 HUD 도구 모음을 엽니다.",
        tipNoShortcutPrefix: "위에서 단축키를 지정하거나",
        tipNoShortcutSuffix: "버튼을 클릭하여 HUD 도구 모음을 엽니다.",
        tipZapDesc:
          "배너, 오버레이 또는 위젯을 클릭하여 DOM에서 즉시 제거합니다.",
        tipEditDesc:
          "텍스트를 클릭하여 실시간으로 인라인 편집합니다(키 입력이 페이지와 완전히 격리됨).",
        tipMoveDesc:
          "드래그하여 요소를 재배치합니다. 도구 모음에서 Flow 및 Free 모드를 전환하고 + / - 로 범위를 조절하세요.",
        tipHideDesc:
          "클릭하여 페이지 흐름을 깨뜨리지 않고 요소를 숨깁니다.",
        tipUndoPrefix: "누르기:",
        tipUndoMiddle: "키로 작업을 실행 취소하거나 도구 모음의",
        tipUndoSettings: "설정",
        tipUndoSuffix: "버튼을 클릭해 옵션을 구성하세요."
      }
    },
    quickHub: {
      title: "Quick Hub",
      description: "화면 모서리 호버로 활성화되는 빠른 유틸리티 허브.",
      settings: {
        floatingPlacement: "플로팅 버튼 위치",
        floatingPlacementDesc:
          "화면 가장자리를 따라 드래그하거나 클릭하여 Quick Hub 트리거를 고정합니다.",
        buttonShapeDesc: "플로팅 트리거 버튼 모양을 사용자 지정합니다.",
        buttonOpacityDesc: "플로팅 트리거 버튼의 투명도를 조정합니다.",
        customizeMenu: "메뉴 사용자 지정",
        customizeMenuDesc:
          "항목을 드래그하여 순서를 바꾸거나 사용하지 않는 기능을 숨깁니다.",
        behaviorProximity: "동작 및 근접 감지",
        hoverProximity: "모서리 근접 시 표시",
        hoverProximityDesc:
          "커서를 모서리 근처로 옮길 때만 버튼을 표시합니다. 끄면 30% 투명도로 계속 표시됩니다.",
        keyboardShortcut: "키보드 단축키",
        globalHotkey: "전역 단축키 (선택 사항)",
        globalHotkeyDesc: "활성 웹페이지에서 Quick Hub 메뉴를 전환합니다.",
        disabledInSettings: "{{feature}} 기능이 확장 설정에서 비활성화되었습니다",
        hiddenInMenu: "{{feature}} 기능이 팝업 메뉴에서 숨겨져 있습니다",
        quickScrollTopOnly: "Quick Scroll이 '위만' 모드로 설정되어 있습니다",
        actions: {
          pipTitle: "PiP로 동영상 보기",
          pipDesc: "플로팅 Picture-in-Picture 창에서 동영상 보기",
          colorPickerTitle: "화면에서 색상 추출",
          colorPickerDesc: "스포이드 픽셀 돋보기 및 즉시 HEX 복사",
          elementToysTitle: "Element Toys",
          elementToysDesc: "요소 검사, 제거, 텍스트 편집 또는 이동",
          scrollTopTitle: "맨 위로 스크롤",
          scrollTopDesc: "페이지 맨 위로 부드럽게 이동",
          scrollBottomTitle: "맨 아래로 스크롤",
          scrollBottomDesc: "페이지 맨 아래로 부드럽게 이동",
          resetZoomTitle: "페이지 확대/축소 초기화",
          resetZoomDesc: "화면 배율 100%로 복원",
          cleanUrlTitle: "깔끔한 URL 복사",
          cleanUrlDesc: "추적 매개변수(utm_*, fbclid) 없이 링크 복사"
        }
      },
      logic: {
        noToolsActive:
          "활성화된 도구가 없습니다. Browse Assist 팝업에서 기능을 켜세요.",
        triggerTooltip: "Quick Hub (빠른 도구)",
        cleanUrlCopied: "깔끔한 URL 복사됨"
      }
    },
    imageHoverPreview: {
      title: "Image Hover Preview",
      description:
        "이미지나 이미지 링크 위에 마우스를 올리면 전체 크기로 미리 봅니다.",
      settings: {
        activation: "활성화",
        triggerModifier: "트리거 보조 키",
        triggerModifierDesc:
          "이미지 위에 마우스를 올릴 때 이 키를 누르고 있으면 미리 봅니다.",
        hoverDelay: "호버 지연 시간",
        hoverDelayDesc: "미리보기 카드를 열기 전 대기 시간.",
        instant: "즉시",
        displaySize: "표시 크기",
        maxViewportSize: "최대 뷰포트 크기",
        behavior: "동작",
        previewImageLinks: "이미지 링크 미리보기",
        previewImageLinksDesc:
          "이미지 파일을 가리키는 하이퍼링크 위에 마우스를 올릴 때도 미리보기를 표시합니다.",
        showDimensions: "크기 배지 표시",
        showDimensionsDesc: "미리보기 모서리에 원본 너비 × 높이(px)를 표시합니다."
      }
    }
  }
}
