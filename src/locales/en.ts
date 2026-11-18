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
    none: "None"
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
      copySelectionQuote: "Copy Selection as Quote"
    },
    superDrag: {
      title: "Super Drag",
      description:
        "Drag selected text to search or drag hyperlinks to open in new tabs."
    },
    quickScroll: {
      title: "Quick Scroll Buttons",
      description:
        "Floating smart buttons to smoothly jump to page top or bottom."
    },
    smoothScroll: {
      title: "Smooth Scrolling",
      description: "Enhanced, fluid page scrolling with interpolated physics."
    },
    mouseZoom: {
      title: "Mouse Pin-to-Zoom",
      description:
        "Hold modifier key and scroll mouse wheel to zoom into cursor position."
    },
    pictureInPicture: {
      title: "Universal Picture-in-Picture",
      description: "Toggle floating video window using customizable shortcut."
    },
    videoWheelControl: {
      title: "Video Wheel Control",
      description:
        "Adjust video volume and playback speed smoothly using the mouse wheel."
    },
    colorPicker: {
      title: "Color Picker",
      description:
        "Pick any pixel color from the screen with instant multi-format copy."
    },
    elementToys: {
      title: "Element Toys",
      description:
        "Inspect, zap, edit text, or reposition elements on any web page."
    },
    quickHub: {
      title: "Quick Hub",
      description:
        "On-screen quick utility hub with smart corner hover activation."
    },
    imageHoverPreview: {
      title: "Image Hover Preview",
      description:
        "Hover over images or image links to preview them in full size."
    }
  }
} as const

export type TranslationDict = DeepString<typeof en>
