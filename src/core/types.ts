/**
 * Feature identifiers supported by Browse Assist.
 */
export type FeatureKey =
  | "allowRightClick"
  | "contextMenuActions"
  | "superDrag"
  | "smoothScroll"
  | "mouseZoom"

export type ContextMenuActionId =
  | "copyLinkText"
  | "cleanLinkCopy"
  | "markdownLinkCopy"

/**
 * Context Menu Actions sub-configuration with custom ordering and toggle states.
 */
export interface ContextMenuActionsConfig {
  copyLinkText: boolean // Copy plain anchor text
  cleanLinkCopy: boolean // Copy URL stripped of tracking parameters
  markdownLinkCopy: boolean // Copy formatted as [Anchor Text](Clean URL)
  order: ContextMenuActionId[] // Display and menu registration order
}

export const DEFAULT_CONTEXT_MENU_ACTIONS_CONFIG: ContextMenuActionsConfig = {
  copyLinkText: true,
  cleanLinkCopy: true,
  markdownLinkCopy: true,
  order: ["copyLinkText", "cleanLinkCopy", "markdownLinkCopy"]
}

/**
 * Super Drag sub-configuration.
 */
export interface SuperDragConfig {
  openInBackground: boolean // Open tab silently in the background
  openNextToActive: boolean // Open adjacent to current tab
  searchSelectedText: boolean // Dragging highlighted text executes search
  openHyperlinks: boolean // Dragging a link opens URL
}

export const DEFAULT_SUPER_DRAG_CONFIG: SuperDragConfig = {
  openInBackground: true,
  openNextToActive: true,
  searchSelectedText: true,
  openHyperlinks: true
}

/**
 * Smooth Scrolling preset options.
 */
export type SmoothScrollPreset = "balanced" | "ultra" | "snappy" | "custom"

export interface SmoothScrollConfig {
  preset: SmoothScrollPreset
  stepSize: number // Wheel multiplier (e.g. 1.0)
  smoothness: number // Easing factor (e.g. 0.18)
  interceptionMode?: "smart" | "aggressive" // 'smart' (bubble + respect apps) vs 'aggressive' (capture phase)
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
 * Mouse Pin-to-Zoom trigger modifier options (Alt, Shift, Left Mouse Button, Right Mouse Button).
 */
export type MouseZoomModifier = "alt" | "shift" | "right-click" | "left-click"

export interface MouseZoomConfig {
  modifier: MouseZoomModifier
  stepSize: number // e.g. 0.1 (10%)
  invertDirection: boolean
  smooth: boolean
  showToast: boolean
}

export const DEFAULT_MOUSE_ZOOM_CONFIG: MouseZoomConfig = {
  modifier: "alt",
  stepSize: 0.1,
  invertDirection: false,
  smooth: true,
  showToast: true
}

/**
 * Settings map tracking the enabled state of each feature and sub-configurations.
 */
export interface FeatureSettings {
  allowRightClick: boolean
  contextMenuActions: boolean
  superDrag: boolean
  smoothScroll: boolean
  mouseZoom: boolean
  contextMenuActionsConfig: ContextMenuActionsConfig
  superDragConfig: SuperDragConfig
  smoothScrollConfig: SmoothScrollConfig
  mouseZoomConfig: MouseZoomConfig
}

/**
 * Default feature configuration.
 * All features are enabled by default upon installation.
 */
export const DEFAULT_SETTINGS: FeatureSettings = {
  allowRightClick: true,
  contextMenuActions: true,
  superDrag: true,
  smoothScroll: true,
  mouseZoom: true,
  contextMenuActionsConfig: DEFAULT_CONTEXT_MENU_ACTIONS_CONFIG,
  superDragConfig: DEFAULT_SUPER_DRAG_CONFIG,
  smoothScrollConfig: {
    ...SMOOTH_SCROLL_PRESETS.balanced,
    interceptionMode: "smart"
  },
  mouseZoomConfig: DEFAULT_MOUSE_ZOOM_CONFIG
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
    key: "contextMenuActions",
    title: "Context Menu Actions",
    description:
      "Custom right-click menu actions for copying clean, formatted links.",
    icon: "📋",
    hasSettings: true
  },
  {
    key: "superDrag",
    title: "Super Drag",
    description:
      "Drag selected text to search or drag hyperlinks to open in new tabs.",
    icon: "👆",
    hasSettings: true
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
      "Hold modifier key and scroll mouse wheel to zoom into cursor position.",
    icon: "🔍",
    hasSettings: true
  }
]
