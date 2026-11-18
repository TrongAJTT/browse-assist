type DeepString<T> = {
  [K in keyof T]: T[K] extends string ? string : DeepString<T[K]>
}

export const en = {
  common: {
    enabled: "Enabled",
    disabled: "Disabled",
    on: "On",
    off: "Off",
    reset: "Reset",
    clear: "Clear",
    cancel: "Cancel",
    save: "Save",
    back: "Back",
    unassigned: "Unassigned",
    notConfigured: "Not configured",
    configure: "Configure",
    launch: "Launch",
    all: "All",
    none: "None",
    customizeShortcuts: "Customize in browser shortcut settings",
    resetOrder: "Reset order",
    show: "Show",
    hide: "Hide",
    center: "Center",
    left: "Left",
    right: "Right",
    top: "Top",
    bottom: "Bottom",
    unstable: "Unstable",
    screenPosition: "Screen Position",
    buttonOpacity: "Button Opacity",
    buttonShape: "Button Shape",
    shapes: {
      circle: "Circle",
      capsule: "Capsule",
      rounded: "Rounded",
      pill: "Pill"
    },
    modifiers: {
      alt: "Alt",
      shift: "Shift",
      ctrl: "Ctrl",
      altKey: "Alt Key",
      shiftKey: "Shift Key",
      rightClick: "Right Click",
      leftClick: "Left Click"
    }
  },
  popup: {
    searchPlaceholder: "Search utilities...",
    noResults: "No utilities match your filter.",
    resetFilters: "Reset filters",
    switchToList: "Switch to List Layout",
    switchToGrid: "Switch to Compact Tile Grid",
    pipBannerTitle: "Video in PiP Mode",
    pipExit: "Exit PiP",
    supportTitle: "Support the Project",
    categories: {
      all: "All",
      interaction: "Mouse",
      navigation: "Scroll",
      media: "Media",
      tools: "Tools"
    }
  },
  preferences: {
    title: "Preferences",
    appearance: "Appearance",
    themeMode: "Theme Mode",
    themeModeDesc: "Light, dark, or match your OS theme.",
    viewMode: "View Mode",
    viewModeDesc: "Detailed list or compact tile grid.",
    language: "Language",
    languageDesc: "Choose interface language or follow browser.",
    languageAuto: "Auto (Browser)",
    navigation: "Navigation",
    searchAndFilter: "Search & Category Filter",
    searchAndFilterDesc:
      "Show search bar and category pills at the top of the main popup.",
    rememberLastView: "Remember Last View",
    rememberLastViewDesc:
      "Reopen the popup on the settings page you were previously browsing.",
    sessionTimeout: "Session Timeout",
    customizeMenu: "Customize Menu",
    customizeMenuDesc:
      "Drag items to reorder them in the popup, or toggle visibility to hide features."
  },
  about: {
    title: "About",
    projectAndLegal: "Project & Legal",
    homePage: "Home page",
    terms: "Terms",
    policy: "Policy",
    openSourceLibraries: "Open Source Libraries",
    declaredPermissions: "Declared Permissions",
    permissions: {
      storage: "Persist custom settings and features preferences locally.",
      contextMenus: "Provide quick actions on right-click like clean link copy.",
      clipboardWrite: "Copy picked color codes and markdown formatted links.",
      search: "Search selected text with default search engine on Super Drag."
    }
  },
  features: {
    allowRightClick: {
      title: "Allow Right Click",
      description:
        "Re-enable context menu, selection, and copy on restricted websites.",
      popupDesc:
        "Enable context menu and copy on the current tab without breaking other apps.",
      toastEnabled: "Right Click Enabled",
      toastDisabled: "Right Click Disabled",
      currentTab: "Current Tab"
    },
    contextMenuActions: {
      title: "Context Menu Actions",
      description:
        "Custom right-click menu actions for copying clean, formatted links.",
      activeCount: "{{count}}/6 Active",
      copyLinkText: "Copy Link Text",
      cleanLinkCopy: "Copy Clean Link",
      markdownLinkCopy: "Copy Link as Markdown",
      copyCleanPageUrl: "Copy Clean Page URL",
      copyPageMarkdown: "Copy Page as Markdown",
      copySelectionQuote: "Copy Selection as Quote",
      settings: {
        sectionTitle: "Right-Click Menu Items",
        sectionDesc:
          "Drag items to reorder or toggle their visibility in your right-click context menu.",
        badges: {
          textOnly: "Text only",
          antiTracking: "Anti-Tracking",
          markdown: "[Text](URL)",
          page: "Page",
          selection: "Selection"
        },
        descriptions: {
          copyLinkText:
            "Extracts and copies the anchor text without copying the URL.",
          cleanLinkCopy:
            "Strips tracking parameters (utm_*, fbclid, si) before copying.",
          markdownLinkCopy:
            "Copies formatted markdown hyperlink, ideal for Obsidian, Notion & GitHub.",
          copyCleanPageUrl:
            "Right-click anywhere on a page to copy its URL without tracking params.",
          copyPageMarkdown:
            "Copies the current page title and clean URL as [Title](URL).",
          copySelectionQuote:
            "Copies highlighted text as a Markdown blockquote with source link."
        }
      }
    },
    superDrag: {
      title: "Super Drag",
      description:
        "Drag selected text to search or drag hyperlinks to open in new tabs.",
      settings: {
        dragTargets: "Drag Targets",
        tabs: {
          text: "Text",
          link: "Links",
          image: "Images"
        },
        searchText: "Search Highlighted Text",
        searchTextDesc:
          "Drag selected text in 4 directions to search, open windows, or copy.",
        textDisabled: "Highlighted text dragging is currently disabled.",
        openLinks: "Open Hyperlinks",
        openLinksDesc:
          "Drag hyperlinks to open in tabs, new windows, or copy link URL or text.",
        linksDisabled: "Hyperlink dragging is currently disabled.",
        dragImages: "Drag Images",
        dragImagesDesc:
          "Drag images to view in tabs, new windows, or copy direct image URLs.",
        imagesDisabled: "Image dragging is currently disabled.",
        displayFeedback: "Display & Feedback",
        dragIndicator: "Drag Visual Indicator",
        dragIndicatorDesc:
          "Choose the visual feedback style displayed while dragging elements.",
        indicatorStyles: {
          none: "Disabled",
          badge: "Floating Badge",
          radial: "Circular Segments"
        },
        directionalGestures: "Directional Gestures",
        actions: {
          open_bg_tab: "Background Tab",
          open_active_tab: "Active Tab",
          open_window_active: "New Window",
          open_incognito_active: "Incognito Window",
          none: "None (Do Nothing)",
          copy_to_clipboard: "Copy",
          copy_link_text: "Copy Link Text",
          copy_link_url: "Copy Link URL",
          copy_markdown: "Copy Markdown",
          copy_image_link: "Copy Image Link",
          search_image: "Search Image"
        }
      }
    },
    quickScroll: {
      title: "Quick Scroll Buttons",
      description:
        "Floating smart buttons to smoothly jump to page top or bottom.",
      settings: {
        buttonPlacement: "Button Placement",
        buttonPlacementDesc:
          "Drag or click along the left or right perimeter to anchor the floating scroll buttons.",
        controlsStyle: "Controls & Style",
        buttonSelection: "Button Selection",
        buttonSelectionDesc: "Show both top & bottom buttons or top only.",
        modes: {
          both: "Top & Bottom",
          topOnly: "Top Only"
        },
        buttonShapeDesc: "Choose circle, unified capsule, or rounded square.",
        buttonOpacityDesc: "Adjust transparency when not hovered.",
        behaviorIntel: "Behavior & Intelligence",
        autoDim: "Auto-Dim on Idle",
        autoDimDesc:
          "Fade buttons to subtle opacity when you pause scrolling; restore instantly on hover.",
        scrollMemory: "Scroll Position Memory",
        scrollMemoryDesc:
          "Save your exact reading spot upon jumping away, allowing 1-click return to where you were.",
        hideOnNative: "Hide on Native Scroll Button",
        hideOnNativeDesc:
          "Automatically hide when the webpage already provides a fixed scroll-to-top button."
      },
      logic: {
        scrollToTop: "Scroll to top",
        scrollToBottom: "Scroll to bottom",
        returnToPrevious: "Return to previous position"
      }
    },
    smoothScroll: {
      title: "Smooth Scrolling",
      description: "Enhanced, fluid page scrolling with interpolated physics.",
      settings: {
        profiles: "Profiles",
        presetBalanced: "Balanced",
        presetUltra: "Ultra",
        presetSnappy: "Snappy",
        presetCustom: "Custom",
        fineTuning: "Fine Tuning",
        scrollDistance: "Scroll Distance",
        glidingDuration: "Gliding Duration",
        ignoreTouchpad: "Ignore Touchpad",
        ignoreTouchpadDesc:
          "Keep native OS trackpad inertia by bypassing small-delta wheel events.",
        keyboardScroll: "Keyboard Smooth Scroll",
        keyboardScrollDesc:
          "Smoothly interpolate scrolling with Arrow, PageUp/Down, and Space keys.",
        aggressiveMode: "Aggressive Interception",
        aggressiveModeDesc:
          "Force smooth scrolling across all sites. Keep disabled to protect canvas & web apps (e.g. Konva, Figma, Maps)."
      }
    },
    mouseZoom: {
      title: "Mouse Pin-to-Zoom",
      description:
        "Hold modifier key and scroll mouse wheel to zoom into cursor position.",
      settings: {
        resetZoomTooltip: "Reset Zoom to 100% on current tab",
        triggerModifier: "Trigger Modifier Key",
        zoomSensitivity: "Zoom Sensitivity",
        stepIncrement: "Step Increment",
        tickFine: "4% (Fine)",
        tickDefault: "10% (Default)",
        tickFast: "25% (Fast)",
        behaviorDisplay: "Behavior & Display",
        smoothAnimation: "Smooth Animation",
        smoothAnimationDesc:
          "Smoothly interpolate zoom transitions for a fluid feel.",
        invertDirection: "Invert Direction",
        invertDirectionDesc: "Scroll down to zoom in, scroll up to zoom out.",
        showZoomToast: "Show Zoom Toast",
        showZoomToastDesc:
          "Display floating percentage badge on the top-right of the page."
      }
    },
    pictureInPicture: {
      title: "Universal Picture-in-Picture",
      description: "Toggle floating video window using customizable shortcut.",
      settings: {
        shortTitle: "Picture-in-Picture",
        globalShortcut: "Global Shortcut",
        globalShortcutDesc: "Toggle floating video window",
        displayFeedback: "Display & Feedback",
        extensionBadge: "Extension Badge Indicator",
        extensionBadgeDesc:
          "Show “PiP” badge on extension icon whenever a video is playing in PiP.",
        actionToast: "Action Toast Notification",
        actionToastDesc:
          "Display brief confirmation toast when entering or exiting PiP.",
        autoPauseOnExit: "Auto-Pause on Exit PiP",
        autoPauseOnExitDesc:
          "Automatically pause the video when closing the Picture-in-Picture window.",
        hoverButton: "Hover Video PiP Button",
        hoverButtonDesc:
          "Show a floating PiP trigger inside playing videos. May be unstable or blocked on some custom web video players.",
        buttonPosition: "Button Position",
        edgeAlignment: "Edge & Alignment",
        edgeAlignmentDesc:
          "Drag or click along the edges to anchor the floating PiP button inside the video frame.",
        buttonOpacityDesc: "Adjust hover button transparency when not focused."
      },
      logic: {
        watchInPip: "Watch in Picture-in-Picture",
        exitedPip: "Exited Picture-in-Picture",
        enteredPip: "Entered Picture-in-Picture",
        notSupported: "PiP is not supported in this browser",
        cannotEnter: "Cannot enter Picture-in-Picture",
        noVideoFound: "No video found on page"
      }
    },
    videoWheelControl: {
      title: "Video Wheel Control",
      description:
        "Adjust video volume and playback speed smoothly using the mouse wheel.",
      settings: {
        tabs: {
          volume: "Volume",
          speed: "Speed",
          seek: "Seek",
          extra: "Extra"
        },
        conflictTitle: "Modifier Key Conflict Detected",
        conflictDesc:
          "Two or more active controls share the same modifier key (Seek > Speed > Volume priority). Please assign unique modifier keys to avoid collisions.",
        modifierKey: "Modifier Key",
        modifierKeyDesc: "Hold key + scroll over video",
        volumeControl: "Volume Control",
        volumeStep: "Volume Step",
        clickToMute: "Click to Mute",
        clickToMuteDesc: "Click video while holding {{key}} to toggle mute.",
        invertVolume: "Invert Volume Scroll",
        invertVolumeDesc:
          "Reverse wheel scroll direction when adjusting volume.",
        speedControl: "Speed Control",
        speedStep: "Speed Step",
        holdXBoost: "Hold 'X' to Boost (2.0x)",
        holdXBoostDesc:
          "Hold the 'X' key while watching a video to temporarily speed it up to 2.0x.",
        clickToFullscreen: "Click to Fullscreen",
        clickToFullscreenDesc:
          "Click video while holding {{key}} to toggle fullscreen.",
        invertSpeed: "Invert Speed Scroll",
        invertSpeedDesc:
          "Reverse wheel scroll direction when adjusting playback speed.",
        seekControl: "Seek Control",
        seekStep: "Seek Step (Seconds)",
        frameStepper: "Frame-by-Frame Stepper",
        frameStepperDesc:
          "When video is paused, wheel scrolling steps frame-by-frame (~1/30s).",
        invertSeek: "Invert Seek Scroll",
        invertSeekDesc: "Reverse wheel scroll direction when seeking video.",
        screenshot: "Video Screenshot (Shift+Alt+Click)",
        screenshotDesc: "Capture current video frame directly to clipboard as PNG.",
        osd: "On-Screen Display (OSD)",
        osdDesc:
          "Show sleek floating HUD badges for volume, speed, seek, and boost.",
        osdOpacity: "OSD Opacity",
        osdOpacityDesc: "Adjust transparency of the floating OSD badge.",
        noticeTitle: "Compatibility & State Notice",
        noticeBody1:
          "This feature interacts directly with the underlying HTML5 media element (<video>).",
        noticeBody2:
          "On advanced web platforms, custom state managers may occasionally reset playback rate or mute status when a video loops, changes stream resolution, or auto-plays the next item."
      }
    },
    colorPicker: {
      title: "Color Picker",
      description:
        "Pick any pixel color from the screen with instant multi-format copy.",
      settings: {
        shortcutTitle: "Eyedropper Shortcut",
        shortcutDesc: "Quickly activate screen color picker",
        recentColors: "Recent Colors",
        clearHistoryTooltip: "Clear all recent color history",
        clickToCopy: "Click to copy {{value}}",
        noRecentColors:
          "No recent colors picked yet. Use shortcut or button above to pick colors.",
        defaultFormat: "Default Copy Format",
        clipboardFormat: "Clipboard Color Format",
        clipboardFormatDesc:
          "Color standard copied automatically when picking.",
        behaviorFeedback: "Behavior & Feedback",
        autoCopy: "Auto-Copy to Clipboard",
        autoCopyDesc:
          "Automatically copy selected color value immediately upon picking",
        showPalette: "Show Floating Palette",
        showPaletteDesc:
          "Show interactive HEX / RGB / HSL palette modal after picking",
        feedbackNotification: "Feedback Notification",
        feedbackDisabledDesc: "Disabled while Floating Palette is active",
        feedbackEnabledDesc: "Display confirmation toast upon picking a color"
      },
      logic: {
        copiedColor: "Copied Color",
        notSupported: "EyeDropper not supported on this page/browser",
        pickedAndCopied: "Color Picked & Copied",
        picked: "Color Picked",
        couldNotOpen: "Could not open Color Picker",
        permissionRequired: "User interaction required or not permitted"
      }
    },
    elementToys: {
      title: "Element Toys",
      description:
        "Inspect, zap, edit text, or reposition elements on any web page.",
      settings: {
        launchTooltip: "Launch Element Toys on Page",
        shortcutTitle: "Activation Shortcut",
        shortcutDesc: "Open floating Element Toys toolbar on active page",
        inspectorBadge: "Element Inspector Badge",
        showDimensions: "Show Element Dimensions",
        showDimensionsDesc:
          "Measure and display width × height (px) on hover badge",
        showTags: "Show Tag & Class Names",
        showTagsDesc:
          "Display HTML tag name and CSS class selectors (e.g. div.banner#hero)",
        behaviorSection: "Element Toys Behavior",
        defaultTool: "Default Tool on Launch",
        defaultToolDesc: "Tool selected when activating Element Toys",
        modes: {
          zap: "Zap",
          edit: "Edit",
          move: "Move",
          hide: "Hide"
        },
        continuousSession: "Continuous Session",
        continuousSessionDesc:
          "Keep tools active after each action until pressing Esc or Exit",
        autoUnfreeze: "Auto Unfreeze Page Scroll",
        autoUnfreezeDesc:
          "Restore scrollability (overflow: auto) if target was a locking modal overlay",
        showToast: "Show Floating Toast",
        showToastDesc:
          "Display confirmation banner on page when actions are executed",
        howToUse: "How to Use Element Toys",
        tipShortcutPrefix: "Press",
        tipShortcutSuffix: "to open the in-page floating HUD toolbar.",
        tipNoShortcutPrefix: "Assign a keyboard shortcut above or click",
        tipNoShortcutSuffix: "to open the in-page floating HUD toolbar.",
        tipZapDesc:
          "Click any banner, overlay, or widget to remove it from the DOM.",
        tipEditDesc:
          "Click any text to edit inline in real-time (keystrokes are completely isolated from the page).",
        tipMoveDesc:
          "Drag to reposition elements across page layouts. Toggle Flow & Free mode directly on the toolbar, and press + / - to expand or shrink element scope.",
        tipHideDesc:
          "Click to make elements invisible without breaking page flow.",
        tipUndoPrefix: "Press",
        tipUndoMiddle: "to undo any action, or click the",
        tipUndoSettings: "Settings",
        tipUndoSuffix: "button on the toolbar to configure options."
      }
    },
    quickHub: {
      title: "Quick Hub",
      description:
        "On-screen quick utility hub with smart corner hover activation.",
      settings: {
        floatingPlacement: "Floating Button Placement",
        floatingPlacementDesc:
          "Drag or click along the perimeter to anchor the Quick Hub trigger anywhere on screen.",
        buttonShapeDesc: "Customize the floating trigger button shape.",
        buttonOpacityDesc: "Adjust transparency of the floating trigger button.",
        customizeMenu: "Customize Menu",
        customizeMenuDesc:
          "Drag items to reorder them in the Quick Hub list, or toggle visibility to hide features you don't use.",
        behaviorProximity: "Behavior & Proximity",
        hoverProximity: "Hover Proximity Reveal",
        hoverProximityDesc:
          "Reveal the floating button only when moving cursor near the corner. When disabled, the button stays visible at 30% idle opacity.",
        keyboardShortcut: "Keyboard Shortcut",
        globalHotkey: "Global Hotkey (Optional)",
        globalHotkeyDesc: "Toggle the Quick Hub menu on active webpage.",
        disabledInSettings: "{{feature}} is disabled in extension settings",
        hiddenInMenu: "{{feature}} is hidden in popup menu",
        quickScrollTopOnly: "Quick Scroll is configured as 'Top-only'",
        actions: {
          pipTitle: "Watch Video in PiP",
          pipDesc: "Watch video in floating picture-in-picture window",
          colorPickerTitle: "Pick Color from Screen",
          colorPickerDesc: "Eyedropper pixel magnifier and instant hex copy",
          elementToysTitle: "Element Toys",
          elementToysDesc: "Inspect, zap, edit text, or reposition elements",
          scrollTopTitle: "Scroll to Top",
          scrollTopDesc: "Smoothly jump to page top",
          scrollBottomTitle: "Scroll to Bottom",
          scrollBottomDesc: "Smoothly jump to page bottom",
          resetZoomTitle: "Reset Page Zoom",
          resetZoomDesc: "Restore 100% viewport zoom",
          cleanUrlTitle: "Copy Clean URL",
          cleanUrlDesc: "Copy link without tracking queries (utm_*, fbclid)"
        }
      },
      logic: {
        noToolsActive:
          "No tools active. Enable features in Browse Assist popup.",
        triggerTooltip: "Quick Hub (Instant Tools)",
        cleanUrlCopied: "Clean URL Copied"
      }
    },
    imageHoverPreview: {
      title: "Image Hover Preview",
      description:
        "Hover over images or image links to preview them in full size.",
      settings: {
        activation: "Activation",
        triggerModifier: "Trigger Modifier",
        triggerModifierDesc: "Hold this key while hovering an image to preview.",
        hoverDelay: "Hover Delay",
        hoverDelayDesc: "Wait time before opening the preview card.",
        instant: "Instant",
        displaySize: "Display Size",
        maxViewportSize: "Max Viewport Size",
        behavior: "Behavior",
        previewImageLinks: "Preview Image Links",
        previewImageLinksDesc:
          "Show image preview when hovering hyperlinks pointing to image files.",
        showDimensions: "Show Dimensions Badge",
        showDimensionsDesc:
          "Display natural width × height (px) on the preview corner."
      }
    }
  }
} as const

export type TranslationDict = DeepString<typeof en>
