/**
 * Feature identifiers supported by Browse Assist.
 */
export type FeatureKey =
  | "allowRightClick"
  | "copyLinkText"
  | "smoothScroll"
  | "mouseZoom"

/**
 * Settings map tracking the enabled state of each feature.
 */
export interface FeatureSettings {
  allowRightClick: boolean
  copyLinkText: boolean
  smoothScroll: boolean
  mouseZoom: boolean
}

/**
 * Default feature configuration.
 * All features are enabled by default upon installation.
 */
export const DEFAULT_SETTINGS: FeatureSettings = {
  allowRightClick: true,
  copyLinkText: true,
  smoothScroll: true,
  mouseZoom: true
}

/**
 * Storage keys used across extension contexts.
 */
export const STORAGE_KEYS = {
  SETTINGS: "browse_assist_settings"
} as const

/**
 * UI display metadata for each feature.
 */
export interface FeatureMeta {
  key: FeatureKey
  title: string
  description: string
  icon: string
}

/**
 * Registered list of all features with their presentation metadata.
 */
export const FEATURES_LIST: FeatureMeta[] = [
  {
    key: "allowRightClick",
    title: "Allow Right Click",
    description: "Re-enable context menu, selection, and copy on restricted websites.",
    icon: "🖱️"
  },
  {
    key: "copyLinkText",
    title: "Copy Link Text",
    description: "Right-click any hyperlink to quickly copy its display text.",
    icon: "📋"
  },
  {
    key: "smoothScroll",
    title: "Smooth Scrolling",
    description: "Enhanced, fluid page scrolling with interpolated physics.",
    icon: "📜"
  },
  {
    key: "mouseZoom",
    title: "Mouse Pin-to-Zoom",
    description: "Hold Alt and scroll mouse wheel to zoom into cursor position.",
    icon: "🔍"
  }
]
