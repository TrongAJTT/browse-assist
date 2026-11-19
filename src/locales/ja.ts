import type { TranslationDict } from "./en"

export const ja: TranslationDict = {
  common: {
    appName: "Browse Assist",
    appSlogan: "ブラウジング体験をパワーアップ",
    appDescription:
      "ブラウジングの快適さと生産性を高める、軽量でモジュラーな便利ツール集。",
    enabled: "有効",
    disabled: "無効",
    reset: "リセット",
    clear: "クリア",
    cancel: "キャンセル",
    gotIt: "了解",
    viewportScreen: "表示画面",
    unassigned: "未割り当て",
    launch: "起動",
    all: "すべて",
    none: "なし",
    customizeShortcuts: "ブラウザのショートカット設定で変更",
    shortcutNotAssignedTip:
      "ショートカット未設定。クリックしてブラウザ設定で割り当て",
    customizeShortcutTip: "クリックしてブラウザのショートカットを変更",
    backTip: "戻る (Backspace または `)",
    toggleFeatureAria: "{{feature}} を切り替え",
    resetOrder: "順序をリセット",
    show: "表示",
    hide: "非表示",
    center: "中央",
    left: "左",
    right: "右",
    top: "上",
    bottom: "下",
    unstable: "不安定",
    screenPosition: "画面位置",
    buttonOpacity: "ボタンの不透明度",
    buttonShape: "ボタンの形状",
    shapes: {
      circle: "円形",
      capsule: "カプセル",
      rounded: "角丸",
      pill: "ピル型"
    },
    modifiers: {
      alt: "Alt",
      shift: "Shift",
      ctrl: "Ctrl",
      altKey: "Alt キー",
      shiftKey: "Shift キー",
      rightClick: "右クリック",
      leftClick: "左クリック"
    }
  },
  popup: {
    searchPlaceholder: "機能を検索...",
    noResults: "一致する機能が見つかりません。",
    resetFilters: "フィルターをリセット",
    switchToList: "リスト表示に切り替え",
    switchToGrid: "コンパクトグリッドに切り替え",
    pipBannerTitle: "PiP モードで再生中",
    pipExit: "PiP を終了",
    supportTitle: "プロジェクトを支援",
    categories: {
      all: "すべて",
      interaction: "マウス",
      navigation: "スクロール",
      media: "メディア",
      tools: "ツール"
    },
    tooltips: {
      preferencesAndTheme: "環境設定とテーマ",
      about: "Browse Assist について",
      supportDonate: "プロジェクトを支援",
      jumpToVideoTab: "クリックしてこの動画タブへ移動",
      exitPipWindow: "Picture-in-Picture ウィンドウを閉じる"
    }
  },
  preferences: {
    title: "環境設定",
    appearance: "外観",
    themeMode: "テーマモード",
    themeModeDesc: "ライト、ダーク、またはシステムテーマに合わせます。",
    themeDark: "ダーク",
    themeLight: "ライト",
    themeSystem: "システム",
    viewMode: "表示モード",
    viewModeDesc: "詳細リストまたはコンパクトタイル表示。",
    viewModeList: "リスト",
    viewModeGrid: "グリッド",
    language: "言語",
    languageDesc: "表示言語を選択するかブラウザ設定に従います。",
    languageAuto: "自動 (ブラウザ)",
    navigation: "ナビゲーション",
    searchAndFilter: "検索とカテゴリフィルター",
    searchAndFilterDesc:
      "ポップアップ上部に検索バーとカテゴリタブを表示します。",
    rememberLastView: "前回の画面を記憶",
    rememberLastViewDesc:
      "前回開いていた設定ページからポップアップを再開します。",
    sessionTimeout: "セッション有効期限",
    minutesShort: "{{count}} 分",
    tickOneMin: "1 分",
    tickTenMinDefault: "10 分 (既定)",
    tickSixtyMin: "60 分",
    customizeMenu: "メニューのカスタマイズ",
    customizeMenuDesc:
      "ドラッグで並び替え、アイコンでポップアップ内の表示/非表示を切り替えます。",
    presets: "プリセット",
    presetReading: "読書とナビゲーション",
    presetReadingDesc: "スクロール、ドラッグ、閲覧",
    presetDesigner: "デザイン・開発",
    presetDesignerDesc: "カラー、要素検査と操作",
    presetEssential: "必須機能のみ",
    presetEssentialDesc: "最小限で集中",
    other: "その他",
    optionsPage: "拡張機能オプションページ",
    optionsPageDesc: "すべての設定ダッシュボードとショートカットガイド"
  },
  donate: {
    buyMeACoffeeDesc: "コーヒー1杯でプロジェクトの維持を支援",
    githubSponsorsDesc: "GitHub 経由で毎月または単発でスポンサー",
    vietqrDesc: "VietQR 経由の即時銀行振込 (ベトナム)",
    authorDonateLabel: "作者の寄付ページ",
    authorDonateDesc: "作者への直接寄付"
  },
  dialogs: {
    firefoxGuide: {
      title: "Firefox ショートカット設定ガイド",
      intro:
        "ショートカットキーはブラウザの拡張機能設定から直接カスタマイズできます：",
      step1Prefix: "Firefox で新しいタブを開き、次へ移動します：",
      copyUrlTip: "クリックして URL をコピー",
      step2Prefix: "アドオンマネージャー右上の",
      step2Target: "歯車アイコン ⚙",
      step2Suffix: "をクリックします。",
      step3Prefix: "ドロップダウンメニューから",
      step3Target: "「拡張機能のショートカットを管理」",
      step3Suffix: "を選択します。",
      step4Prefix: "次を見つけて",
      step4Suffix: "各コマンドにお好みのショートカットキーを割り当ててください。"
    }
  },
  options: {
    title: "Browse Assist 設定",
    subtitle: "ブラウジング便利ツールとショートカットを設定します",
    openPopup: "ポップアップを開く",
    openPopupTip: "拡張機能のポップアップを開く",
    preferences: "環境設定",
    preferencesTip: "ポップアップで環境設定を開く",
    about: "情報",
    aboutTip: "ポップアップで詳細情報を開く",
    activeModules: "有効なモジュール",
    configureInPopup: "ポップアップで {{feature}} を設定",
    shortcutsTitle: "キーボード・マウスショートカット一覧",
    shortcutsSubtitle:
      "現在のブラウザホットキーとインタラクティブジェスチャー",
    customizeShortcuts: "ショートカットを変更",
    table: {
      action: "アクション",
      shortcut: "ショートカット / トリガー",
      description: "説明"
    },
    triggers: {
      mouseWheel: "{{modifier}} + マウスホイール",
      mouseDrag: "マウスドラッグ",
      doubleClickMargin: "余白をダブルクリック",
      rightClickLink: "リンクを右クリック"
    },
    shortcuts: {
      pip: {
        name: "ピクチャーインピクチャー (PiP)",
        desc: "再生中の動画をフローティング PiP ウィンドウに分離します"
      },
      allowRightClick: {
        name: "右クリック許可",
        desc: "現在のタブでコンテキストメニューとコピーの制限を解除します"
      },
      elementToys: {
        name: "要素ツール (要素ツール)",
        desc: "ページ要素の削除、編集、非表示、移動を有効にします"
      },
      colorPicker: {
        name: "カラーピッカー",
        desc: "画面スポイト拡大鏡を起動してカラーコードをコピーします"
      },
      quickHub: {
        name: "クイックハブ ショートカット",
        desc: "キーボードで画面上の クイックハブ メニューを切り替えます"
      },
      volume: {
        name: "動画音量コントロール",
        desc: "動画上でスクロールして音量調整、修飾キー+クリックでミュート"
      },
      speed: {
        name: "動画再生速度コントロール",
        desc: "動画上でスクロールして速度調整、クリックで全画面"
      },
      seek: {
        name: "動画シークとコマ送り",
        desc: "早送り/巻き戻し、一時停止中はコマ送り"
      },
      boost: {
        name: "動画倍速ブースト",
        desc: "動画上で X キーを押し続けると一時的に {{speed}}x で再生"
      },
      mouseZoom: {
        name: "カーソル位置ズーム",
        desc: "マウスカーソル位置を中心にページを滑らかに拡大/縮小"
      },
      superDrag: {
        name: "スーパードラッグ",
        desc: "テキストをドラッグして検索、リンクをドラッグして背景タブで開く"
      },
      quickScroll: {
        name: "クイックスクロール",
        desc: "画面端をダブルクリックまたはボタンで先頭/末尾へ移動"
      },
      smoothScroll: {
        name: "滑らかスクロール",
        desc: "すべてのスクロール領域で慣性物理補間を適用"
      },
      cleanLink: {
        name: "クリーンリンクコピー",
        desc: "追跡パラメータ (utm_*, fbclid) を除いてコピーまたは Markdown 化"
      },
      quickHubZone: {
        name: "クイックハブ トリガーゾーン",
        desc: "画面の隅にホバーしてクイックツールランチャーを展開"
      }
    },
    storage: {
      title: "拡張機能のストレージとデータ",
      desc: "ブラウザに保存された Browse Assist のすべてのデータと設定（カスタム設定、ショートカット、クイックハブ の並び順、カラー履歴）を完全に消去します。",
      clearAll: "すべてのデータを消去...",
      cleared:
        "すべての拡張機能データを消去し、初期状態にリセットしました。",
      footer:
        "Browse Assist • Manifest V3 • Plasmo, React & Tailwind CSS で構築"
    },
    modal: {
      title: "すべての拡張機能データを消去しますか？",
      body: "ブラウザプロファイルに保存されている Browse Assist の全データが完全に削除されます。",
      listHeader: "以下が削除されます：",
      item1: "すべての機能の有効/無効状態と詳細設定",
      item2: "クイックハブ の並び順、固定アクション、非表示モジュール",
      item3: "スポイトカラーピッカーの色履歴",
      item4: "テーマ設定とポップアップ画面の記憶",
      warning:
        "⚠️ この操作は取り消せません。すべての設定が即座に初期値に戻ります。",
      clearing: "データを消去中...",
      confirm: "はい、すべて削除します"
    }
  },
  content: {
    copied: {
      linkText: "リンクテキストをコピーしました",
      cleanLink: "クリーンリンクをコピーしました",
      markdown: "Markdown をコピーしました",
      cleanPageUrl: "クリーンなページ URL をコピーしました",
      pageMarkdown: "ページを Markdown でコピーしました",
      quote: "引用をコピーしました",
      text: "テキストをコピーしました",
      imageLink: "画像リンクをコピーしました",
      linkUrl: "リンク URL をコピーしました"
    },
    fabMenu: {
      movePosition: "位置を移動",
      openSettings: "設定を開く",
      hideOnTab: "このタブで非表示",
      disableFeature: "{{feature}}を無効化",
      disablePipHoverButton: "PiP ホバーボタンを無効化",
      dragHint: "端にカーソルを合わせてクリックで配置 • Esc でキャンセル",
      quickDragHint: "端へドラッグして右クリックを離すと配置 • Esc でキャンセル",
      positionSaved: "位置を保存しました",
      hiddenOnTab: "このタブで{{feature}}を非表示にしました"
    }
  },
  about: {
    title: "情報",
    projectAndLegal: "プロジェクトと法的情報",
    homePage: "ホームページ",
    terms: "利用規約",
    policy: "プライバシーポリシー",
    openSourceLibraries: "オープンソースライブラリ",
    declaredPermissions: "宣言された権限",
    permissionNames: {
      storage: "ストレージ",
      contextMenus: "コンテキストメニュー",
      clipboardWrite: "クリップボード",
      search: "検索"
    },
    permissions: {
      storage: "カスタム設定と機能の設定をローカルに保存します。",
      contextMenus:
        "クリーンリンクのコピーなどの右クリックメニュー操作を提供します。",
      clipboardWrite:
        "取得したカラーコードや Markdown リンクをクリップボードにコピーします。",
      search:
        "スーパードラッグ で選択したテキストを既定の検索エンジンで検索します。"
    }
  },
  features: {
    allowRightClick: {
      title: "右クリック許可",
      description:
        "右クリック、テキスト選択、コピーを禁止しているサイトで制限を解除します。",
      popupDesc:
        "他のアプリに影響を与えずに現在のタブで右クリックとコピーを有効化します。",
      toastEnabled: "右クリックを有効にしました",
      toastDisabled: "右クリックを無効にしました",
      currentTab: "現在のタブ"
    },
    contextMenuActions: {
      title: "コンテキストメニュー操作",
      description:
        "追跡パラメータなしのクリーンなリンクや Markdown をコピーする右クリック操作。",
      activeCount: "{{count}}/6 有効",
      copyLinkText: "リンクテキストをコピー",
      cleanLinkCopy: "クリーンリンクをコピー",
      markdownLinkCopy: "Markdown 形式でリンクをコピー",
      copyCleanPageUrl: "クリーンなページ URL をコピー",
      copyPageMarkdown: "ページを Markdown でコピー",
      copySelectionQuote: "選択範囲を引用としてコピー",
      settings: {
        sectionTitle: "右クリックメニュー項目",
        sectionDesc:
          "ドラッグで順序を変更したり、右クリックメニューでの表示/非表示を切り替えます。",
        badges: {
          textOnly: "テキストのみ",
          antiTracking: "トラッキング除去",
          markdown: "[テキスト](URL)",
          page: "ページ",
          selection: "選択範囲"
        },
        descriptions: {
          copyLinkText: "URL を含めずリンクのテキストのみを抽出してコピーします。",
          cleanLinkCopy:
            "コピー前に追跡パラメータ (utm_*, fbclid, si) を除去します。",
          markdownLinkCopy:
            "Obsidian、Notion、GitHub に最適な Markdown リンクをコピーします。",
          copyCleanPageUrl:
            "ページ上のどこでも右クリックして追跡パラメータなしの URL をコピーします。",
          copyPageMarkdown:
            "現在のページタイトルとクリーン URL を [タイトル](URL) 形式でコピーします。",
          copySelectionQuote:
            "選択したテキストをソースリンク付きの Markdown 引用ブロックとしてコピーします。"
        }
      }
    },
    superDrag: {
      title: "スーパードラッグ",
      description:
        "選択テキストをドラッグして検索、またはリンクをドラッグして新しいタブで開きます。",
      settings: {
        dragTargets: "ドラッグ対象",
        tabs: {
          text: "テキスト",
          link: "リンク",
          image: "画像"
        },
        searchText: "選択テキストを検索",
        searchTextDesc:
          "選択したテキストを4方向にドラッグして検索、新規ウィンドウ、コピーを行います。",
        textDisabled: "選択テキストのドラッグは現在無効です。",
        openLinks: "ハイパーリンクを開く",
        openLinksDesc:
          "リンクをドラッグしてタブやウィンドウで開く、または URL・テキストをコピーします。",
        linksDisabled: "ハイパーリンクのドラッグは現在無効です。",
        dragImages: "画像をドラッグ",
        dragImagesDesc:
          "画像をドラッグしてタブやウィンドウで表示、または画像 URL をコピーします。",
        imagesDisabled: "画像のドラッグは現在無効です。",
        displayFeedback: "表示とフィードバック",
        dragIndicator: "ドラッグ視覚インジケーター",
        dragIndicatorDesc:
          "ドラッグ中に表示される視覚フィードバックのスタイルを選択します。",
        indicatorOpacity: "インジケーターの不透明度",
        indicatorOpacityDesc:
          "ドラッグ中に表示されるインジケーターの透明度を調整します。",
        indicatorStyles: {
          none: "無効",
          badge: "フローティングバッジ",
          radial: "円形セグメント"
        },
        directionalGestures: "方向ジェスチャー",
        actions: {
          open_bg_tab: "バックグラウンドタブ",
          open_active_tab: "アクティブタブ",
          open_window_active: "新しいウィンドウ",
          open_incognito_active: "シークレットウィンドウ",
          none: "なし (何もしない)",
          copy_to_clipboard: "コピー",
          copy_link_text: "リンクテキストをコピー",
          copy_link_url: "リンク URL をコピー",
          copy_markdown: "Markdown をコピー",
          copy_image_link: "画像リンクをコピー",
          search_image: "画像を検索"
        }
      },
      logic: {
        types: {
          search: "検索",
          image: "画像",
          link: "リンク"
        },
        dropOpenBackground: "ドロップして {{type}} を背景で開く",
        shortOpenBackground: "{{type}} (背景タブ)",
        dropOpenActive: "ドロップして {{type}} を新しいタブで開く",
        shortOpenActive: "{{type}} (新しいタブ)",
        dropOpenWindow: "ドロップして {{type}} を新規ウィンドウで開く",
        shortOpenWindow: "{{type}} (新規ウィンドウ)",
        dropOpenIncognito: "ドロップして {{type}} をシークレットで開く",
        shortOpenIncognito: "{{type}} (シークレット)",
        dropCopyLinkText: "ドロップしてリンクテキストをコピー",
        shortCopyLinkText: "テキストコピー",
        dropCopyMarkdown: "ドロップして Markdown をコピー",
        shortCopyMarkdown: "Markdown コピー",
        dropSearchImage: "ドロップして画像を検索",
        shortSearchImage: "画像検索",
        dropCopyText: "ドロップしてテキストをコピー",
        shortCopyText: "テキストコピー",
        dropCopyImageLink: "ドロップして画像リンクをコピー",
        shortCopyImageLink: "画像リンクコピー",
        dropCopyLinkUrl: "ドロップしてリンク URL をコピー",
        shortCopyLinkUrl: "URL コピー",
        noAction: "操作なし",
        releaseToCancel: "離してキャンセル",
        exceededMax: "最大距離を超過 (離してキャンセル)"
      }
    },
    quickScroll: {
      title: "クイックスクロールボタン",
      description:
        "ページの先頭・末尾へスムーズに移動できるスマートなフローティングボタン。",
      settings: {
        buttonPlacement: "ボタンの配置",
        buttonPlacementDesc:
          "左右の端に沿ってドラッグまたはクリックし、ボタンを固定します。",
        controlsStyle: "操作とスタイル",
        buttonSelection: "表示するボタン",
        buttonSelectionDesc: "上下両方または上のみを表示します。",
        modes: {
          both: "上と下",
          topOnly: "上のみ"
        },
        buttonShapeDesc: "円形、統合カプセル、または角丸四角形を選択します。",
        buttonOpacityDesc: "非ホバー時の透明度を調整します。",
        behaviorIntel: "動作とスマート機能",
        autoDim: "待機時に自動減光",
        autoDimDesc:
          "スクロール停止時にボタンを薄くし、ホバー時に即座に戻します。",
        scrollMemory: "スクロール位置の記憶",
        scrollMemoryDesc:
          "移動前の閲覧位置を保存し、1クリックで元の場所に戻れます。",
        hideOnNative: "ページ固有ボタンがある場合は隠す",
        hideOnNativeDesc:
          "サイトに固定のトップへ戻るボタンがある場合、自動的に非表示にします。"
      },
      logic: {
        scrollToTop: "先頭へスクロール",
        scrollToBottom: "末尾へスクロール",
        returnToPrevious: "前の位置に戻る"
      }
    },
    smoothScroll: {
      title: "滑らかスクロール",
      description: "物理補間による滑らかで自然なページスクロール。",
      settings: {
        profiles: "プロファイル",
        presetBalanced: "バランス",
        presetUltra: "ウルトラ",
        presetSnappy: "キビキビ",
        presetCustom: "カスタム",
        fineTuning: "詳細調整",
        scrollDistance: "スクロール距離",
        glidingDuration: "滑走時間",
        ignoreTouchpad: "タッチパッドを除外",
        ignoreTouchpadDesc:
          "微小なホイールイベントをバイパスし、OS のトラックパッド慣性を維持します。",
        keyboardScroll: "キーボード滑らかスクロール",
        keyboardScrollDesc:
          "矢印キー、PageUp/Down、Space キーのスクロールを滑らかに補間します。",
        aggressiveMode: "積極的インターセプト",
        aggressiveModeDesc:
          "全サイトで滑らかスクロールを強制します。Canvas/Webアプリ (Figma, Maps) 保護のため通常は無効にしてください。"
      }
    },
    mouseZoom: {
      title: "カーソル位置ズーム",
      description:
        "修飾キーを押しながらホイールを回してカーソル位置を中心に拡大/縮小します。",
      settings: {
        resetZoomTooltip: "現在のタブのズームを 100% にリセット",
        triggerModifier: "トリガー修飾キー",
        zoomSensitivity: "ズーム感度",
        stepIncrement: "ステップ増分",
        tickFine: "4% (精密)",
        tickDefault: "10% (標準)",
        tickFast: "25% (高速)",
        behaviorDisplay: "動作と表示",
        smoothAnimation: "滑らかアニメーション",
        smoothAnimationDesc: "ズーム遷移を滑らかに補間します。",
        invertDirection: "方向を反転",
        invertDirectionDesc: "下に回して拡大、上に回して縮小します。",
        showZoomToast: "ズーム通知を表示",
        showZoomToastDesc: "ページ右上に倍率バッジを浮かべて表示します。"
      },
      logic: {
        pageZoom: "ページズーム"
      }
    },
    pictureInPicture: {
      title: "ピクチャーインピクチャー (PiP)",
      description:
        "カスタム可能なショートカットでフローティング動画ウィンドウを切り替えます。",
      settings: {
        shortTitle: "Picture-in-Picture",
        globalShortcut: "グローバルショートカット",
        globalShortcutDesc: "フローティング動画ウィンドウを切り替え",
        displayFeedback: "表示とフィードバック",
        extensionBadge: "拡張アイコンバッジ",
        extensionBadgeDesc:
          "PiP 再生中に拡張機能アイコンへ「PiP」バッジを表示します。",
        actionToast: "アクション通知",
        actionToastDesc: "PiP の開始・終了時に簡単な確認通知を表示します。",
        autoPauseOnExit: "PiP 終了時に自動一時停止",
        autoPauseOnExitDesc:
          "Picture-in-Picture ウィンドウを閉じたときに動画を自動停止します。",
        hoverButton: "動画ホバー PiP ボタン",
        hoverButtonDesc:
          "再生中の動画内に PiP ボタンを表示します。一部プレイヤーでは不安定な場合があります。",
        buttonPosition: "ボタン位置",
        edgeAlignment: "端と配置",
        edgeAlignmentDesc:
          "端に沿ってドラッグまたはクリックし、動画枠内に PiP ボタンを配置します。",
        buttonOpacityDesc: "非フォーカス時のホバーボタン透明度を調整します。"
      },
      logic: {
        watchInPip: "Picture-in-Picture で視聴",
        exitedPip: "Picture-in-Picture を終了しました",
        enteredPip: "Picture-in-Picture を開始しました",
        notSupported: "このブラウザは PiP に対応していません",
        cannotEnter: "Picture-in-Picture を開始できません",
        noVideoFound: "ページ上に動画が見つかりません"
      },
      background: {
        playing: "PiP で再生中: {{title}}",
        untitledVideo: "動画"
      }
    },
    videoWheelControl: {
      title: "動画ホイール操作",
      description:
        "マウスホイールで動画の音量、再生速度、シークを滑らかに調整します。",
      settings: {
        tabs: {
          volume: "音量",
          speed: "速度",
          seek: "シーク",
          extra: "その他"
        },
        conflictTitle: "修飾キーの競合を検出",
        conflictDesc:
          "2つ以上の有効な操作が同じ修飾キーを使用しています（優先度: シーク > 速度 > 音量）。別々のキーを割り当ててください。",
        modifierKey: "修飾キー",
        modifierKeyDesc: "キーを押しながら動画上でホイール操作",
        volumeControl: "音量コントロール",
        volumeStep: "音量ステップ",
        clickToMute: "クリックでミュート",
        clickToMuteDesc:
          "{{key}} を押しながら動画をクリックしてミュート切り替え。",
        invertVolume: "音量スクロール反転",
        invertVolumeDesc: "音量調整時のホイール方向を反転します。",
        speedControl: "再生速度コントロール",
        speedStep: "速度ステップ",
        holdXBoost: "'X' 長押しで倍速 (2.0x)",
        holdXBoostDesc:
          "動画視聴中に 'X' キーを押し続けると一時的に 2.0x になります。",
        clickToFullscreen: "クリックで全画面",
        clickToFullscreenDesc:
          "{{key}} を押しながら動画をクリックして全画面切り替え。",
        invertSpeed: "速度スクロール反転",
        invertSpeedDesc: "再生速度調整時のホイール方向を反転します。",
        seekControl: "シークコントロール",
        seekStep: "シーク間隔 (秒)",
        frameStepper: "コマ送りステッパー",
        frameStepperDesc:
          "動画の一時停止中、ホイールで1フレーム (~1/30秒) ずつ移動します。",
        invertSeek: "シークスクロール反転",
        invertSeekDesc: "シーク時のホイール方向を反転します。",
        screenshot: "動画スクリーンショット (Shift+Alt+クリック)",
        screenshotDesc:
          "現在の動画フレームを PNG として直接クリップボードにコピーします。",
        osd: "オンスクリーン表示 (OSD)",
        osdDesc:
          "音量・速度・シーク・ブースト用のフローティング HUD バッジを表示します。",
        osdOpacity: "OSD 不透明度",
        osdOpacityDesc: "フローティング OSD バッジの透明度を調整します。",
        noticeTitle: "互換性と状態に関する注意",
        noticeBody1:
          "この機能は HTML5 メディア要素 (<video>) と直接やり取りします。",
        noticeBody2:
          "一部の動画プラットフォームでは、ループ・画質変更・自動再生時にサイト側の制御で速度やミュート状態がリセットされる場合があります。"
      },
      logic: {
        muted: "ミュート",
        fullscreen: "全画面",
        exitFullscreen: "全画面を終了",
        frameCopied: "フレームをコピーしました！",
        captureFailed: "キャプチャ失敗",
        clipboardDenied: "クリップボード拒否",
        corsProtected: "CORS 保護されています",
        frameStep: "フレーム {{sign}} ({{time}})",
        boost: "⚡ {{rate}}x ブースト"
      }
    },
    colorPicker: {
      title: "カラーピッカー",
      description:
        "画面上の任意のピクセルの色を取得し、複数形式で即座にコピーします。",
      settings: {
        shortcutTitle: "スポイトショートカット",
        shortcutDesc: "画面カラーピッカーを素早く起動",
        recentColors: "最近取得した色",
        clearHistoryTooltip: "色の履歴をすべて消去",
        clickToCopy: "クリックして {{value}} をコピー",
        noRecentColors:
          "まだ色が取得されていません。上のショートカットやボタンをお使いください。",
        defaultFormat: "既定のコピー形式",
        clipboardFormat: "クリップボードの色形式",
        clipboardFormatDesc: "色を取得した際に自動でコピーされる形式。",
        behaviorFeedback: "動作とフィードバック",
        autoCopy: "クリップボードへ自動コピー",
        autoCopyDesc: "色を選択すると同時に自動で値をコピーします",
        showPalette: "フローティングパレットを表示",
        showPaletteDesc:
          "取得後に HEX / RGB / HSL の対話型パレットを表示します",
        feedbackNotification: "フィードバック通知",
        feedbackDisabledDesc: "フローティングパレット有効時は無効",
        feedbackEnabledDesc: "色を取得した際に確認通知を表示します"
      },
      logic: {
        copiedColor: "色をコピーしました",
        notSupported: "このページ/ブラウザでは EyeDropper に対応していません",
        pickedAndCopied: "色を取得してコピーしました",
        picked: "色を取得しました",
        couldNotOpen: "カラーピッカーを開けませんでした",
        permissionRequired: "ユーザー操作が必要か許可されていません",
        palette: {
          pickedColor: "取得した色",
          close: "閉じる",
          copyHex: "HEX をコピー",
          copyRgb: "RGB をコピー",
          copyHsl: "HSL をコピー"
        }
      }
    },
    elementToys: {
      title: "要素ツール",
      description:
        "あらゆる Web ページ上の要素を検査、削除、テキスト編集、または再配置します。",
      settings: {
        launchTooltip: "ページ上で 要素ツール を起動",
        shortcutTitle: "起動ショートカット",
        shortcutDesc: "アクティブなページにフローティングツールバーを開く",
        inspectorBadge: "要素インスペクターバッジ",
        showDimensions: "要素のサイズを表示",
        showDimensionsDesc: "ホバー時のバッジに 幅 × 高さ (px) を表示します",
        showTags: "タグ名とクラス名を表示",
        showTagsDesc:
          "HTML タグ名と CSS クラスセレクタ (例: div.banner#hero) を表示します",
        behaviorSection: "要素ツール の動作",
        defaultTool: "起動時の既定ツール",
        defaultToolDesc: "要素ツール 起動時に選択されるツール",
        modes: {
          zap: "削除 (Zap)",
          edit: "編集",
          move: "移動",
          hide: "非表示"
        },
        continuousSession: "連続セッション",
        continuousSessionDesc:
          "Esc または終了を押すまで各操作後もツールを有効なままにします",
        autoUnfreeze: "ページスクロール自動解除",
        autoUnfreezeDesc:
          "スクロールをロックしていたオーバーレイを削除した際にスクロールを復元します",
        showToast: "フローティング通知を表示",
        showToastDesc: "操作の実行時にページ上に確認バナーを表示します",
        howToUse: "要素ツール の使い方",
        tipShortcutPrefix: "押す：",
        tipShortcutSuffix: "でページ内のフローティング HUD バーを開きます。",
        tipNoShortcutPrefix: "上でショートカットを割り当てるか、",
        tipNoShortcutSuffix: "をクリックして HUD バーを開きます。",
        tipZapDesc:
          "バナー、オーバーレイ、ウィジェットをクリックして DOM から削除します。",
        tipEditDesc:
          "テキストをクリックしてその場で直接編集します（キー入力はページから隔離されます）。",
        tipMoveDesc:
          "ドラッグして要素を再配置します。バー上で Flow / Free を切り替え、+ / - で選択範囲を調整できます。",
        tipHideDesc:
          "クリックしてページのレイアウトを崩さずに要素を非表示にします。",
        tipUndoPrefix: "押す：",
        tipUndoMiddle: "で操作を元に戻すか、バー上の",
        tipUndoSettings: "設定",
        tipUndoSuffix: "ボタンで詳細を変更できます。"
      },
      toolbar: {
        title: "要素ツール",
        zap: "削除",
        zapTip: "削除: クリックして要素を DOM から消去",
        edit: "編集",
        editTip: "テキスト編集: クリックしてその場でテキスト編集",
        move: "移動",
        moveActiveTip: "移動ツール有効 (+/- で親要素範囲を調整)",
        moveTip: "移動: クリックして移動モード (Flow / Free) を有効化",
        moveLabel: "移動 ({{mode}})",
        flow: "Flow",
        flowTip: "Flow モード: DOM レイアウト内で並べ替え、他の要素を押し出します",
        free: "Free",
        freeTip: "Free モード: レイアウトを変えずに自由配置します",
        hide: "非表示",
        hideTip: "非表示: クリックしてレイアウトを崩さず隠します",
        undo: "元に戻す",
        undoTip: "直前の操作を元に戻す (Ctrl+Z)",
        settings: "設定",
        settingsTip: "要素ツールの設定を開く",
        exit: "終了",
        exitTip: "要素ツールを終了 (Esc)"
      },
      overlay: {
        clickToZap: "クリックで削除",
        clickToEdit: "クリックでテキスト編集",
        dragBody: "本体ドラッグで{{type}} • 角ドラッグでサイズ変更",
        clickToHide: "クリックで非表示"
      },
      logic: {
        zapped: "要素を削除しました！",
        hidden: "要素を非表示にしました",
        resized: "サイズを変更しました",
        textUpdated: "テキストを更新しました",
        undone: "操作を元に戻しました",
        undoneDetail: "{{action}} を取り消しました",
        closed: "要素ツールを閉じました",
        active: "要素ツール有効",
        activeDetail: "上のツールバーから選択 • Esc で終了",
        scope: "対象: <{{tag}}>",
        scopeDetail: "階層 +{{depth}} (- で縮小)",
        scrollUnfrozen: "ページスクロールを解除しました",
        scrollUnfrozenDetail: "overflow: auto を復元しました"
      }
    },
    quickHub: {
      title: "クイックハブ",
      description:
        "画面の隅にマウスを合わせることで呼び出せるクイックツールハブ。",
      settings: {
        floatingPlacement: "フローティングボタンの配置",
        floatingPlacementDesc:
          "画面端に沿ってドラッグまたはクリックし、クイックハブ ボタンを配置します。",
        buttonShapeDesc: "フローティングボタンの形状をカスタマイズします。",
        buttonOpacityDesc: "フローティングボタンの透明度を調整します。",
        customizeMenu: "メニューのカスタマイズ",
        customizeMenuDesc:
          "ドラッグで クイックハブ の項目順を変更したり、使わない機能を非表示にします。",
        behaviorProximity: "動作と近接表示",
        hoverProximity: "隅へのホバーで表示",
        hoverProximityDesc:
          "カーソルを隅に近づけたときのみボタンを表示します。無効時は 30% の不透明度で常時表示されます。",
        keyboardShortcut: "キーボードショートカット",
        globalHotkey: "グローバルホットキー (任意)",
        globalHotkeyDesc: "アクティブなページで クイックハブ メニューを切り替えます。",
        disabledInSettings: "{{feature}} は拡張機能の設定で無効です",
        hiddenInMenu: "{{feature}} はポップアップメニューで非表示です",
        quickScrollTopOnly: "Quick Scroll が「上のみ」に設定されています",
        actions: {
          pipTitle: "動画を PiP で視聴",
          pipDesc: "フローティング PiP ウィンドウで動画を視聴",
          colorPickerTitle: "画面から色を取得",
          colorPickerDesc: "拡大鏡スポイトと即時 HEX コピー",
          elementToysTitle: "要素ツール",
          elementToysDesc: "要素の検査、削除、編集、または移動",
          scrollTopTitle: "先頭へスクロール",
          scrollTopDesc: "ページの先頭へ滑らかに移動",
          scrollBottomTitle: "末尾へスクロール",
          scrollBottomDesc: "ページの末尾へ滑らかに移動",
          resetZoomTitle: "ページズームをリセット",
          resetZoomDesc: "表示倍率を 100% に戻す",
          cleanUrlTitle: "クリーン URL をコピー",
          cleanUrlDesc: "追跡パラメータ (utm_*, fbclid) を除いてコピー",
          allowRightClickTitle: "右クリック許可",
          allowRightClickDesc: "このタブで右クリックとコピーの制限を解除",
          copyMarkdownTitle: "ページを Markdown でコピー",
          copyMarkdownDesc: "[タイトル](URL) 形式でクリーンなリンクをコピー",
          videoScreenshotTitle: "動画フレームをキャプチャ",
          videoScreenshotDesc: "再生中の動画の PNG スクリーンショットをコピー"
        }
      },
      logic: {
        noToolsActive:
          "有効なツールがありません。Browse Assist ポップアップで有効にしてください。",
        triggerTooltip: "クイックハブ (クイックツール)",
        triggerAria: "クイックハブ",
        cleanUrlCopied: "クリーン URL をコピーしました",
        markdownCopied: "ページの Markdown をコピーしました",
        noVideoFound: "このページに再生可能な動画が見つかりません"
      }
    },
    imageHoverPreview: {
      title: "画像ホバープレビュー",
      description:
        "画像や画像リンクにマウスを合わせると原寸サイズでプレビュー表示します。",
      settings: {
        activation: "起動",
        triggerModifier: "トリガー修飾キー",
        triggerModifierDesc:
          "画像にホバーしている間このキーを押すとプレビューします。",
        hoverDelay: "ホバー遅延",
        hoverDelayDesc: "プレビューカードを開くまでの待機時間。",
        instant: "即時",
        displaySize: "表示サイズ",
        maxViewportSize: "最大ビューポートサイズ",
        behavior: "動作",
        previewImageLinks: "画像リンクをプレビュー",
        previewImageLinksDesc:
          "画像ファイルを指すハイパーリンクにホバーした際もプレビューを表示します。",
        showDimensions: "サイズバッジを表示",
        showDimensionsDesc:
          "プレビューの隅に元の 幅 × 高さ (px) を表示します。"
      }
    }
  }
}
