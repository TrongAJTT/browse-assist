/**
 * Feature identifiers supported by Browse Assist.
 */
export type FeatureKey =
  | "allowRightClick"
  | "copyLinkText"
  | "smoothScroll"
  | "mouseZoom"

/**
 * Smooth Scrolling preset options.
 */
export type SmoothScrollPreset = "balanced" | "ultra" | "snappy" | "custom"

export interface SmoothScrollConfig {
  preset: SmoothScrollPreset
  stepSize: number // Wheel multiplier (e.g. 1.0)
  smoothness: number // Easing factor (e.g. 0.18)
}

export const SMOOTH_SCROLL_PRESETS: Record<
  Exclude<SmoothScrollPreset, "custom">,
  SmoothScrollConfig
> = {
  balanced: {
    preset: "balanced",
    stepSize: 1.0,
    smoothness: 0.18
  },
  ultra: {
    preset: "ultra",
    stepSize: 1.2,
    smoothness: 0.1
  },
  snappy: {
    preset: "snappy",
    stepSize: 0.9,
    smoothness: 0.3
  }
}

/**
 * Settings map tracking the enabled state of each feature and sub-configurations.
 */
export interface FeatureSettings {
  allowRightClick: boolean
  copyLinkText: boolean
  smoothScroll: boolean
  mouseZoom: boolean
  smoothScrollConfig: SmoothScrollConfig
}

/**
 * Default feature configuration.
 * All features are enabled by default upon installation.
 */
export const DEFAULT_SETTINGS: FeatureSettings = {
  allowRightClick: true,
  copyLinkText: true,
  smoothScroll: true,
  mouseZoom: true,
  smoothScrollConfig: SMOOTH_SCROLL_PRESETS.balanced
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
  hasSettings?: boolean
}

/**
 * Registered list of all features with their presentation metadata.
 */
export const FEATURES_LIST: FeatureMeta[] = [
  {
    key: "allowRightClick",
    title: "Allow Right Click",
    description:
      "Re-enable context menu, selection, and copy on restricted websites.",
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
    icon: "📜",
    hasSettings: true
  },
  {
    key: "mouseZoom",
    title: "Mouse Pin-to-Zoom",
    description:
      "Hold Alt and scroll mouse wheel to zoom into cursor position.",
    icon: "🔍"
  }
]
