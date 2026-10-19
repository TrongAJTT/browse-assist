/**
 * Feature identifiers supported by Browse Assist.
 */
export type FeatureKey =
  | "allowRightClick"
  | "contextMenuActions"
  | "superDrag"
  | "smoothScroll"
  | "mouseZoom"
  | "pictureInPicture"
  | "videoWheelControl"
  | "quickScroll"
  | "colorPicker"
  | "elementZapper"
  | "quickHub"

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
 * Supported Super Drag actions for directional gestures.
 */
export type SuperDragAction =
  | "open_bg_tab"
  | "open_active_tab"
  | "open_window_active"
  | "open_incognito_active"
  | "copy_to_clipboard"
  | "copy_link_text"
  | "none"

export interface DirectionalActions {
  up: SuperDragAction
  down: SuperDragAction
  left: SuperDragAction
  right: SuperDragAction
}

export const DEFAULT_DIRECTIONAL_ACTIONS: DirectionalActions = {
  up: "open_bg_tab",
  right: "open_bg_tab",
  left: "open_active_tab",
  down: "copy_to_clipboard"
}

/**
 * Visual Drag Indicator presentation styles.
 */
export type DragIndicatorStyle = "none" | "badge" | "radial"

/**
 * Super Drag sub-configuration.
 */
export interface SuperDragConfig {
  searchSelectedText: boolean // Dragging highlighted text executes search
  openHyperlinks: boolean // Dragging a link opens URL
  openImages: boolean // Dragging an image opens URL or copies image link
  showIndicator: boolean // Display live floating indicator during drag
  indicatorStyle: DragIndicatorStyle // Indicator style: "none", "badge", or "radial"
  textActions: DirectionalActions
  linkActions: DirectionalActions
  imageActions: DirectionalActions
}

export const DEFAULT_SUPER_DRAG_CONFIG: SuperDragConfig = {
  searchSelectedText: true,
  openHyperlinks: true,
  openImages: false,
  showIndicator: true,
  indicatorStyle: "badge",
  textActions: { ...DEFAULT_DIRECTIONAL_ACTIONS },
  linkActions: { ...DEFAULT_DIRECTIONAL_ACTIONS },
  imageActions: { ...DEFAULT_DIRECTIONAL_ACTIONS }
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
 * Screen or container boundary edge identifier.
 */
export type ScreenEdge = "left" | "right" | "top" | "bottom"

/**
 * Universal position along a container's perimeter edge.
 */
export interface EdgePlacement {
  edge: ScreenEdge
  offsetPercent: number // 0 to 100 percentage along the specified edge
}

/**
 * Safely normalizes legacy position string presets or partial EdgePlacement objects.
 */
export function normalizeEdgePlacement(
  raw: unknown,
  fallback: EdgePlacement
): EdgePlacement {
  if (!raw) return fallback

  // Already an EdgePlacement object
  if (typeof raw === "object" && raw !== null && "edge" in raw) {
    const p = raw as Partial<EdgePlacement>
    const validEdges: ScreenEdge[] = ["left", "right", "top", "bottom"]
    const edge = validEdges.includes(p.edge as ScreenEdge)
      ? (p.edge as ScreenEdge)
      : fallback.edge
    const offset =
      typeof p.offsetPercent === "number" && !isNaN(p.offsetPercent)
        ? Math.max(0, Math.min(100, Math.round(p.offsetPercent)))
        : fallback.offsetPercent
    return { edge, offsetPercent: offset }
  }

  // Legacy preset string conversions
  if (typeof raw === "string") {
    switch (raw) {
      case "top-left":
        return { edge: "left", offsetPercent: 0 }
      case "center-left":
        return { edge: "left", offsetPercent: 50 }
      case "bottom-left":
        return { edge: "left", offsetPercent: 100 }
      case "top-right":
        return { edge: "right", offsetPercent: 0 }
      case "center-right":
        return { edge: "right", offsetPercent: 50 }
      case "bottom-right":
        return { edge: "right", offsetPercent: 100 }
      default:
        return fallback
    }
  }

  return fallback
}

/**
 * Corner position for the floating Video PiP button (legacy).
 */
export type PipButtonPosition =
  | "top-left"
  | "top-right"
  | "bottom-left"
  | "bottom-right"

/**
 * Universal Picture-in-Picture configuration.
 */
export interface PictureInPictureConfig {
  showBadge: boolean // Show "PiP" badge on extension icon when video is in PiP
  showToast: boolean // Show floating feedback notification on toggle
  hoverButton: boolean // Show a sleek floating PiP button when hovering over playing videos
  placement: EdgePlacement // Edge position inside the video frame
  buttonPosition?: PipButtonPosition // Legacy fallback
}

export const DEFAULT_PICTURE_IN_PICTURE_CONFIG: PictureInPictureConfig = {
  showBadge: true,
  showToast: true,
  hoverButton: true,
  placement: { edge: "right", offsetPercent: 0 },
  buttonPosition: "top-right"
}

/**
 * Modifier keys for Video Wheel Control.
 */
export type VideoWheelModifier =
  | "shift"
  | "alt"
  | "ctrl"
  | "ctrl+shift"
  | "ctrl+alt"
  | "alt+shift"

/**
 * Video Wheel Control configuration.
 */
export interface VideoWheelControlConfig {
  enableVolume: boolean // Enable/disable volume wheel control and click-to-mute
  volumeModifier: VideoWheelModifier // Key to hold while adjusting volume (default: "shift")
  volumeStep: number // Volume delta per wheel step (e.g. 0.05 for 5%)
  clickToMute: boolean // Left click + volume modifier on video toggles mute
  invertVolumeScroll: boolean // Invert volume scroll direction

  enableSpeed: boolean // Enable/disable playback speed wheel control and fullscreen
  speedModifier: VideoWheelModifier // Key to hold while adjusting playback speed (default: "alt")
  speedStep: number // Playback speed delta per wheel step (e.g. 0.25)
  clickToFullscreen: boolean // Left click + speed modifier on video toggles fullscreen
  invertSpeedScroll: boolean // Invert speed scroll direction

  enableSeek: boolean // Enable/disable wheel seeking & frame-by-frame stepper
  seekModifier: VideoWheelModifier // Key to hold while seeking (default: "ctrl")
  seekStep: number // Seek delta in seconds per wheel step (default: 5)
  enableFrameStep: boolean // Step frame-by-frame (~1/30s) when video is paused
  invertSeekScroll: boolean // Invert seek scroll direction

  enableHoldToBoost: boolean // Hold 'X' key over video to temporarily boost playback speed
  boostSpeed: number // Boost playback speed multiplier (default: 2.0x)

  enableScreenshot: boolean // Capture video frame to clipboard via Ctrl+Shift+Click or button
  showOsd: boolean // Display on-screen volume / speed / seek indicator HUD
}

export const DEFAULT_VIDEO_WHEEL_CONTROL_CONFIG: VideoWheelControlConfig = {
  enableVolume: true,
  volumeModifier: "shift",
  volumeStep: 0.05,
  clickToMute: true,
  invertVolumeScroll: false,

  enableSpeed: true,
  speedModifier: "alt",
  speedStep: 0.25,
  clickToFullscreen: true,
  invertSpeedScroll: false,

  enableSeek: true,
  seekModifier: "ctrl",
  seekStep: 5,
  enableFrameStep: true,
  invertSeekScroll: false,

  enableHoldToBoost: true,
  boostSpeed: 2.0,

  enableScreenshot: true,
  showOsd: true
}

/**
 * Quick Scroll Buttons sub-configuration.
 */
export type QuickScrollPosition =
  | "top-left"
  | "top-right"
  | "center-left"
  | "center-right"
  | "bottom-left"
  | "bottom-right"
export type QuickScrollButtonsMode = "both" | "top-only"

export interface QuickScrollConfig {
  placement: EdgePlacement
  buttonsMode: QuickScrollButtonsMode
  autoHide: boolean // Dim buttons when user stops scrolling
  enableReturnMemory: boolean // Remember previous scroll position and allow return for both top and bottom
  position?: QuickScrollPosition // Legacy fallback
}

export const DEFAULT_QUICK_SCROLL_CONFIG: QuickScrollConfig = {
  placement: { edge: "right", offsetPercent: 100 },
  buttonsMode: "both",
  autoHide: true,
  enableReturnMemory: false,
  position: "bottom-right"
}

/**
 * Color format options for ColorPick Eyedropper.
 */
export type ColorFormat = "hex" | "rgb" | "hsl"

export interface ColorHistoryItem {
  hex: string
  rgb: string
  hsl: string
  timestamp: number
}

export interface ColorPickerConfig {
  defaultFormat: ColorFormat // Default format copied on pick
  autoCopy: boolean // Automatically copy default format to clipboard immediately upon picking
  showToast: boolean // Show notification toast upon picking
}

export const DEFAULT_COLOR_PICKER_CONFIG: ColorPickerConfig = {
  defaultFormat: "hex",
  autoCopy: true,
  showToast: true
}

/**
 * Interactive action modes for Element Toys.
 */
export type ZapperMode = "zap" | "edit" | "move" | "hide"

/**
 * Move behavior mode:
 * - "relative": In-layout DOM flow reorder, respecting layout and pushing other components
 * - "absolute": Freeform transform translate3d without altering layout flow
 */
export type ElementMoveType = "relative" | "absolute"

/**
 * Element Toys configuration.
 */
export interface ElementZapperConfig {
  autoUnfreezeScroll: boolean // Automatically remove overflow:hidden on body/html when an overlay is zapped
  showToast: boolean // Show feedback toast when an action is executed or mode cancelled
  continuousMode: boolean // Stay in Element Toys mode until Esc or Exit button
  showDimensions: boolean // Display width × height in the hover badge
  showTagDescriptor: boolean // Display HTML tag & class/id in badge
  defaultMode: ZapperMode // Initial tool mode when activated
  moveType: ElementMoveType // "relative" (layout flow / push components) or "absolute" (freeform)
}

export const DEFAULT_ELEMENT_ZAPPER_CONFIG: ElementZapperConfig = {
  autoUnfreezeScroll: true,
  showToast: true,
  continuousMode: true,
  showDimensions: true,
  showTagDescriptor: true,
  defaultMode: "zap",
  moveType: "relative"
}

/**
 * Screen corner position for Quick Hub trigger.
 */
export type QuickHubCorner =
  | "top-right"
  | "top-left"
  | "bottom-right"
  | "bottom-left"

/**
 * Action identifiers for Quick Hub in-page tools.
 */
export type QuickHubActionId =
  | "pip"
  | "colorPicker"
  | "elementZapper"
  | "scrollTop"
  | "scrollBottom"
  | "resetZoom"
  | "cleanUrl"

export const DEFAULT_QUICK_HUB_ACTION_ORDER: QuickHubActionId[] = [
  "pip",
  "colorPicker",
  "elementZapper",
  "scrollTop",
  "scrollBottom",
  "resetZoom",
  "cleanUrl"
]

/**
 * Quick Hub configuration.
 */
export interface QuickHubConfig {
  placement: EdgePlacement
  hoverToReveal: boolean
  corner?: QuickHubCorner // Legacy fallback
  actionOrder?: QuickHubActionId[]
  hiddenActions?: QuickHubActionId[]
}

export const DEFAULT_QUICK_HUB_CONFIG: QuickHubConfig = {
  placement: { edge: "right", offsetPercent: 0 },
  hoverToReveal: true,
  corner: "top-right",
  actionOrder: [...DEFAULT_QUICK_HUB_ACTION_ORDER],
  hiddenActions: []
}

/**
 * Appearance theme options: "dark" | "light" | "system".
 */
export type ThemeMode = "dark" | "light" | "system"

/**
 * Popup display layout mode: "list" (detailed) or "grid" (compact).
 */
export type ViewMode = "list" | "grid"

/**
 * Settings map tracking the enabled state of each feature and sub-configurations.
 */
export interface FeatureSettings {
  theme: ThemeMode
  viewMode?: ViewMode
  allowRightClick: boolean
  contextMenuActions: boolean
  superDrag: boolean
  smoothScroll: boolean
  mouseZoom: boolean
  pictureInPicture: boolean
  videoWheelControl: boolean
  quickScroll: boolean
  colorPicker: boolean
  elementZapper: boolean
  quickHub: boolean
  featureLayout: FeatureLayoutConfig
  popupNavigation: PopupNavigationConfig
  contextMenuActionsConfig: ContextMenuActionsConfig
  superDragConfig: SuperDragConfig
  smoothScrollConfig: SmoothScrollConfig
  mouseZoomConfig: MouseZoomConfig
  pictureInPictureConfig: PictureInPictureConfig
  videoWheelControlConfig: VideoWheelControlConfig
  quickScrollConfig: QuickScrollConfig
  colorPickerConfig: ColorPickerConfig
  elementZapperConfig: ElementZapperConfig
  quickHubConfig: QuickHubConfig
}

/**
 * Feature layout configuration for popup menu customization.
 */
export interface FeatureLayoutConfig {
  order: FeatureKey[]
  hidden: FeatureKey[]
}

export const DEFAULT_FEATURE_LAYOUT_CONFIG: FeatureLayoutConfig = {
  order: [
    "allowRightClick",
    "superDrag",
    "contextMenuActions",
    "quickScroll",
    "smoothScroll",
    "pictureInPicture",
    "videoWheelControl",
    "mouseZoom",
    "colorPicker",
    "elementZapper",
    "quickHub"
  ],
  hidden: []
}

/**
 * Navigation preferences for popup memory.
 */
export interface PopupNavigationConfig {
  rememberLastView: boolean
  sessionTimeoutMinutes: number
}

export const DEFAULT_POPUP_NAVIGATION_CONFIG: PopupNavigationConfig = {
  rememberLastView: true,
  sessionTimeoutMinutes: 10
}

/**
 * Default feature configuration.
 * All features are enabled by default upon installation.
 */
export const DEFAULT_SETTINGS: FeatureSettings = {
  theme: "system",
  viewMode: "list",
  allowRightClick: true,
  contextMenuActions: true,
  superDrag: true,
  smoothScroll: true,
  mouseZoom: true,
  pictureInPicture: true,
  videoWheelControl: true,
  quickScroll: true,
  colorPicker: true,
  elementZapper: true,
  quickHub: true,
  featureLayout: DEFAULT_FEATURE_LAYOUT_CONFIG,
  popupNavigation: DEFAULT_POPUP_NAVIGATION_CONFIG,
  contextMenuActionsConfig: DEFAULT_CONTEXT_MENU_ACTIONS_CONFIG,
  superDragConfig: DEFAULT_SUPER_DRAG_CONFIG,
  smoothScrollConfig: {
    ...SMOOTH_SCROLL_PRESETS.balanced,
    interceptionMode: "smart"
  },
  mouseZoomConfig: DEFAULT_MOUSE_ZOOM_CONFIG,
  pictureInPictureConfig: DEFAULT_PICTURE_IN_PICTURE_CONFIG,
  videoWheelControlConfig: DEFAULT_VIDEO_WHEEL_CONTROL_CONFIG,
  quickScrollConfig: DEFAULT_QUICK_SCROLL_CONFIG,
  colorPickerConfig: DEFAULT_COLOR_PICKER_CONFIG,
  elementZapperConfig: DEFAULT_ELEMENT_ZAPPER_CONFIG,
  quickHubConfig: DEFAULT_QUICK_HUB_CONFIG
}

/**
 * Storage keys used across extension contexts.
 */
export const STORAGE_KEYS = {
  SETTINGS: "browse_assist_settings",
  COLOR_HISTORY: "browse_assist_color_history",
  LAST_VIEW: "browse_assist_last_view"
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
    key: "quickScroll",
    title: "Quick Scroll Buttons",
    description:
      "Floating smart buttons to smoothly jump to page top or bottom.",
    icon: "🧭",
    hasSettings: true
  },
  {
    key: "pictureInPicture",
    title: "Universal Picture-in-Picture",
    description: "Toggle floating video window using customizable shortcut.",
    icon: "📺",
    hasSettings: true
  },
  {
    key: "videoWheelControl",
    title: "Video Wheel Control",
    description:
      "Adjust video volume and playback speed smoothly using the mouse wheel.",
    icon: "🔊",
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
  },
  {
    key: "colorPicker",
    title: "Color Picker",
    description:
      "Pick any pixel color from the screen with instant multi-format copy.",
    icon: "🎨",
    hasSettings: true
  },
  {
    key: "elementZapper",
    title: "Element Toys",
    description:
      "Inspect, zap, edit text, or reposition elements on any web page.",
    icon: "⚡",
    hasSettings: true
  },
  {
    key: "quickHub",
    title: "Quick Hub",
    description:
      "On-screen quick utility hub with smart corner hover activation.",
    icon: "✨",
    hasSettings: true
  }
]
