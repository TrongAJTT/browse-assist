import packageJson from "../../package.json"

export interface DonateOption {
  id: string
  label: string
  url: string
  description?: string
  iconName: "coffee" | "github" | "heart"
}

export const DONATE_OPTIONS: DonateOption[] = [
  {
    id: "buy-me-a-coffee",
    label: "Buy Me a Coffee",
    url: "https://buymeacoffee.com/trongajtt",
    description: "Support project maintenance with a coffee",
    iconName: "coffee"
  },
  {
    id: "github-sponsors",
    label: "GitHub Sponsors",
    url: "https://github.com/sponsors/TrongAJTT",
    description: "Sponsor via GitHub on a monthly or one-off basis",
    iconName: "github"
  },
  {
    id: "author-donate",
    label: "Author Donation Page",
    url: "https://www.trongajtt.com/sponsor",
    description: "Direct donation to the author",
    iconName: "heart"
  }
]

export const APP_INFO = {
  name: packageJson.displayName || "Browse Assist",
  version: packageJson.version,
  slogan:
    (packageJson as { slogan?: string }).slogan || "PowerToys for Web Browsing",
  description: packageJson.description,
  author: packageJson.author?.split("<")[0]?.trim() || "TrongAJTT",
  authorUrl: "https://github.com/TrongAJTT",
  homePageUrl:
    packageJson.homepage || "https://github.com/TrongAJTT/browse-assist",
  termsUrl:
    (packageJson as { termsUrl?: string }).termsUrl ||
    "https://github.com/TrongAJTT/browse-assist/blob/main/TERMS.md",
  privacyPolicyUrl:
    (packageJson as { privacyPolicyUrl?: string }).privacyPolicyUrl ||
    "https://github.com/TrongAJTT/browse-assist/blob/main/PRIVACY.md",
  libraries: [
    {
      name: "Plasmo Framework",
      version:
        packageJson.dependencies?.plasmo?.replace(/[\^~]/g, "") || "0.90.5",
      url: "https://docs.plasmo.com/"
    },
    {
      name: "React",
      version:
        packageJson.dependencies?.react?.replace(/[\^~]/g, "") || "18.2.0",
      url: "https://react.dev/"
    },
    {
      name: "Tailwind CSS",
      version:
        packageJson.devDependencies?.tailwindcss?.replace(/[\^~]/g, "") ||
        "3.4.19",
      url: "https://tailwindcss.com/"
    },
    {
      name: "Lucide React",
      version:
        packageJson.dependencies?.["lucide-react"]?.replace(/[\^~]/g, "") ||
        "1.41.0",
      url: "https://lucide.dev/"
    },
    {
      name: "@plasmohq/storage",
      version:
        packageJson.dependencies?.["@plasmohq/storage"]?.replace(
          /[\^~]/g,
          ""
        ) || "1.15.0",
      url: "https://github.com/PlasmoHQ/storage"
    }
  ],
  permissions: [
    {
      key: "storage",
      name: "Storage",
      description: "Persist custom settings and features preferences locally."
    },
    {
      key: "contextMenus",
      name: "Context Menus",
      description: "Provide quick actions on right-click like clean link copy."
    },
    {
      key: "clipboardWrite",
      name: "Clipboard",
      description: "Copy picked color codes and markdown formatted links."
    },
    {
      key: "search",
      name: "Search",
      description:
        "Search selected text with default search engine on Super Drag."
    }
  ]
}

/**
 * Standardized cross-context message type identifiers.
 * Central single-source-of-truth for all Chrome runtime / tabs messages.
 */
export const MESSAGE_TYPES = {
  // Universal Picture-in-Picture
  FOCUS_PIP_TAB: "FOCUS_PIP_TAB",
  CLOSE_PIP: "CLOSE_PIP",
  GET_ACTIVE_PIP_SESSION: "GET_ACTIVE_PIP_SESSION",
  TOGGLE_PICTURE_IN_PICTURE: "TOGGLE_PICTURE_IN_PICTURE",
  EXIT_PICTURE_IN_PICTURE: "EXIT_PICTURE_IN_PICTURE",
  PIP_STATUS_CHANGED: "PIP_STATUS_CHANGED",

  // Allow Right Click
  GET_RIGHT_CLICK_STATUS: "GET_RIGHT_CLICK_STATUS",
  TOGGLE_RIGHT_CLICK: "TOGGLE_RIGHT_CLICK",
  TOGGLE_RIGHT_CLICK_SHORTCUT: "TOGGLE_RIGHT_CLICK_SHORTCUT",

  // Mouse Pin-to-Zoom
  RESET_MOUSE_ZOOM: "RESET_MOUSE_ZOOM",

  // Super Drag
  SUPER_DRAG_SEARCH: "SUPER_DRAG_SEARCH",
  SUPER_DRAG_OPEN_LINK: "SUPER_DRAG_OPEN_LINK",
  SUPER_DRAG_EXECUTE_ACTION: "SUPER_DRAG_EXECUTE_ACTION",

  // ColorPick Eyedropper
  TRIGGER_COLOR_PICKER: "TRIGGER_COLOR_PICKER",

  // Element Zapper / Toys
  TRIGGER_ELEMENT_ZAPPER: "TRIGGER_ELEMENT_ZAPPER",

  // Navigation & Settings
  OPEN_POPUP: "OPEN_POPUP"
} as const

export type MessageType = (typeof MESSAGE_TYPES)[keyof typeof MESSAGE_TYPES]

// Browser shortcut configuration URLs
export const BROWSER_SHORTCUT_URLS = {
  chrome: "chrome://extensions/shortcuts",
  edge: "edge://extensions/shortcuts",
  brave: "brave://extensions/shortcuts",
  opera: "opera://settings/keyboardShortcuts"
} as const

export type SupportedBrowser =
  | "chrome"
  | "edge"
  | "brave"
  | "opera"
  | "firefox"
  | "unknown"

/**
 * Constants for Video Wheel Control feature.
 */
export const VIDEO_WHEEL_CONSTANTS = {
  MIN_VOLUME: 0,
  MAX_VOLUME: 1,
  DEFAULT_VOLUME_STEP: 0.05, // 5%
  MIN_VOLUME_STEP: 0.01,
  MAX_VOLUME_STEP: 0.2,
  MIN_SPEED: 0.25,
  MAX_SPEED: 4.0,
  DEFAULT_SPEED_STEP: 0.25,
  MIN_SPEED_STEP: 0.05,
  MAX_SPEED_STEP: 0.5,
  OSD_FADE_DURATION_MS: 900
} as const
