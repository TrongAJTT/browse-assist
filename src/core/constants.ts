/**
 * External links and donation constant configuration for Browse Assist.
 */

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
  name: "Browse Assist",
  version: "0.0.1",
  author: "TrongAJTT",
  authorUrl: "https://github.com/TrongAJTT",
  repoUrl: "https://github.com/TrongAJTT/browse-assist",
  license: "MIT",
  description:
    "PowerToys for Web Browsing. Lightweight, modular, and privacy-first browser enhancements.",
  libraries: [
    {
      name: "Plasmo Framework",
      version: "0.90.5",
      url: "https://docs.plasmo.com/"
    },
    { name: "React", version: "18.2.0", url: "https://react.dev/" },
    {
      name: "Tailwind CSS",
      version: "3.4.19",
      url: "https://tailwindcss.com/"
    },
    { name: "Lucide React", version: "1.41.0", url: "https://lucide.dev/" },
    {
      name: "@plasmohq/storage",
      version: "1.15.0",
      url: "https://github.com/PlasmoHQ/storage"
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

  // ColorPick Eyedropper
  TRIGGER_COLOR_PICKER: "TRIGGER_COLOR_PICKER",

  // Element Zapper
  TRIGGER_ELEMENT_ZAPPER: "TRIGGER_ELEMENT_ZAPPER"
} as const

export type MessageType = (typeof MESSAGE_TYPES)[keyof typeof MESSAGE_TYPES]
