import type { TranslationDict } from "./en"

export const ja: TranslationDict = {
  common: {
    enabled: "有効",
    disabled: "無効",
    on: "オン",
    off: "オフ",
    reset: "リセット",
    clear: "クリア",
    cancel: "キャンセル",
    save: "保存",
    back: "戻る",
    unassigned: "未割り当て",
    notConfigured: "未設定",
    configure: "設定",
    launch: "起動",
    all: "すべて",
    none: "なし",
    customizeShortcuts: "ブラウザのショートカット設定で変更",
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
    }
  },
  preferences: {
    title: "環境設定",
    appearance: "外観",
    themeMode: "テーマモード",
    themeModeDesc: "ライト、ダーク、またはシステムテーマに合わせます。",
    viewMode: "表示モード",
    viewModeDesc: "詳細リストまたはコンパクトタイル表示。",
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
    customizeMenu: "メニューのカスタマイズ",
    customizeMenuDesc:
      "ドラッグで並び替え、アイコンでポップアップ内の表示/非表示を切り替えます。"
  },
  about: {
    title: "情報",
    projectAndLegal: "プロジェクトと法的情報",
    homePage: "ホームページ",
    terms: "利用規約",
    policy: "プライバシーポリシー",
    openSourceLibraries: "オープンソースライブラリ",
    declaredPermissions: "宣言された権限",
    permissions: {
      storage: "カスタム設定と機能の設定をローカルに保存します。",
      contextMenus:
        "クリーンリンクのコピーなどの右クリックメニュー操作を提供します。",
      clipboardWrite:
        "取得したカラーコードや Markdown リンクをクリップボードにコピーします。",
      search:
        "Super Drag で選択したテキストを既定の検索エンジンで検索します。"
    }
  },
  features: {
    allowRightClick: {
      title: "Allow Right Click",
      description:
        "右クリック、テキスト選択、コピーを禁止しているサイトで制限を解除します。",
      popupDesc:
        "他のアプリに影響を与えずに現在のタブで右クリックとコピーを有効化します。",
      toastEnabled: "右クリックを有効にしました",
      toastDisabled: "右クリックを無効にしました",
      currentTab: "現在のタブ"
    },
    contextMenuActions: {
      title: "Context Menu Actions",
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
      title: "Super Drag",
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
      }
    },
    quickScroll: {
      title: "Quick Scroll Buttons",
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
      title: "Smooth Scrolling",
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
      title: "Mouse Pin-to-Zoom",
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
      }
    },
    pictureInPicture: {
      title: "Universal Picture-in-Picture",
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
      }
    },
    videoWheelControl: {
      title: "Video Wheel Control",
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
      }
    },
    colorPicker: {
      title: "Color Picker",
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
        couldNotOpen: "Color Picker を開けませんでした",
        permissionRequired: "ユーザー操作が必要か許可されていません"
      }
    },
    elementToys: {
      title: "Element Toys",
      description:
        "あらゆる Web ページ上の要素を検査、削除、テキスト編集、または再配置します。",
      settings: {
        launchTooltip: "ページ上で Element Toys を起動",
        shortcutTitle: "起動ショートカット",
        shortcutDesc: "アクティブなページにフローティングツールバーを開く",
        inspectorBadge: "要素インスペクターバッジ",
        showDimensions: "要素のサイズを表示",
        showDimensionsDesc: "ホバー時のバッジに 幅 × 高さ (px) を表示します",
        showTags: "タグ名とクラス名を表示",
        showTagsDesc:
          "HTML タグ名と CSS クラスセレクタ (例: div.banner#hero) を表示します",
        behaviorSection: "Element Toys の動作",
        defaultTool: "起動時の既定ツール",
        defaultToolDesc: "Element Toys 起動時に選択されるツール",
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
        howToUse: "Element Toys の使い方",
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
      }
    },
    quickHub: {
      title: "Quick Hub",
      description:
        "画面の隅にマウスを合わせることで呼び出せるクイックツールハブ。",
      settings: {
        floatingPlacement: "フローティングボタンの配置",
        floatingPlacementDesc:
          "画面端に沿ってドラッグまたはクリックし、Quick Hub ボタンを配置します。",
        buttonShapeDesc: "フローティングボタンの形状をカスタマイズします。",
        buttonOpacityDesc: "フローティングボタンの透明度を調整します。",
        customizeMenu: "メニューのカスタマイズ",
        customizeMenuDesc:
          "ドラッグで Quick Hub の項目順を変更したり、使わない機能を非表示にします。",
        behaviorProximity: "動作と近接表示",
        hoverProximity: "隅へのホバーで表示",
        hoverProximityDesc:
          "カーソルを隅に近づけたときのみボタンを表示します。無効時は 30% の不透明度で常時表示されます。",
        keyboardShortcut: "キーボードショートカット",
        globalHotkey: "グローバルホットキー (任意)",
        globalHotkeyDesc: "アクティブなページで Quick Hub メニューを切り替えます。",
        disabledInSettings: "{{feature}} は拡張機能の設定で無効です",
        hiddenInMenu: "{{feature}} はポップアップメニューで非表示です",
        quickScrollTopOnly: "Quick Scroll が「上のみ」に設定されています",
        actions: {
          pipTitle: "動画を PiP で視聴",
          pipDesc: "フローティング PiP ウィンドウで動画を視聴",
          colorPickerTitle: "画面から色を取得",
          colorPickerDesc: "拡大鏡スポイトと即時 HEX コピー",
          elementToysTitle: "Element Toys",
          elementToysDesc: "要素の検査、削除、編集、または移動",
          scrollTopTitle: "先頭へスクロール",
          scrollTopDesc: "ページの先頭へ滑らかに移動",
          scrollBottomTitle: "末尾へスクロール",
          scrollBottomDesc: "ページの末尾へ滑らかに移動",
          resetZoomTitle: "ページズームをリセット",
          resetZoomDesc: "表示倍率を 100% に戻す",
          cleanUrlTitle: "クリーン URL をコピー",
          cleanUrlDesc: "追跡パラメータ (utm_*, fbclid) を除いてコピー"
        }
      },
      logic: {
        noToolsActive:
          "有効なツールがありません。Browse Assist ポップアップで有効にしてください。",
        triggerTooltip: "Quick Hub (クイックツール)",
        cleanUrlCopied: "クリーン URL をコピーしました"
      }
    },
    imageHoverPreview: {
      title: "Image Hover Preview",
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
