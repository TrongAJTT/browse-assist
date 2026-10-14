/**
 * Super Drag - Constants and Configuration Tokens
 */

import type { SuperDragAction } from "~core/types"

/**
 * Drag distance thresholds (in pixels).
 * MIN_DRAG_DISTANCE distinguishes deliberate drag gestures from regular text selection,
 * and defines the inner cancel radius (deadzone) of the circular segment indicator.
 */
export const MIN_DRAG_DISTANCE = 50
export const MAX_DRAG_DISTANCE = 220

/**
 * Radial Pie Menu Geometry Tokens
 */
export const RADIAL_VIEWBOX_SIZE = 220
export const RADIAL_CENTER = 110 // (cx, cy)
export const RADIAL_INNER_RADIUS = MIN_DRAG_DISTANCE // 50px
export const RADIAL_OUTER_RADIUS = 98
export const RADIAL_GAP_DEGREES = 2.5

/**
 * Radial Pie Menu Opacity & Visual Styling Tokens
 */
export const RADIAL_OPACITY_IDLE = 0.65
export const RADIAL_OPACITY_ACTIVE = 0.90

export const RADIAL_BG_IDLE = `rgba(30, 41, 59, ${RADIAL_OPACITY_IDLE})`
export const RADIAL_BG_ACTIVE = `rgba(56, 189, 248, ${RADIAL_OPACITY_ACTIVE})`

export const RADIAL_STROKE_IDLE = "rgba(148, 163, 184, 0.28)"
export const RADIAL_STROKE_ACTIVE = "#ffffff"

export const RADIAL_STROKE_WIDTH_IDLE = 1.2
export const RADIAL_STROKE_WIDTH_ACTIVE = 2.0

export const RADIAL_GLOW_ACTIVE = "drop-shadow(0 0 10px rgba(56, 189, 248, 0.80))"

export const RADIAL_DEADZONE_BG = "rgba(239, 68, 68, 0.18)"
export const RADIAL_DEADZONE_STROKE = "rgba(239, 68, 68, 0.70)"

export const RADIAL_CENTER_BG = "rgba(15, 23, 42, 0.94)"
export const RADIAL_CENTER_STROKE = "rgba(56, 189, 248, 0.50)"

/**
 * Super Drag Available Action Options for Settings Dropdown
 */
export interface SuperDragActionOption {
  id: SuperDragAction
  label: string
  requiresIncognito?: boolean
}

export const SUPER_DRAG_ACTION_OPTIONS: SuperDragActionOption[] = [
  { id: "open_bg_tab", label: "Background Tab" },
  { id: "open_active_tab", label: "Active Tab" },
  { id: "open_window_active", label: "New Window" },
  { id: "open_incognito_active", label: "Incognito Window", requiresIncognito: true },
  { id: "copy_to_clipboard", label: "Copy to Clipboard" },
  { id: "copy_link_text", label: "Copy Link Text" },
  { id: "none", label: "None (Do Nothing)" }
]

/**
 * Resolves context-aware action options tailored to the specific drag target type.
 */
export function getSuperDragActionOptions(
  targetType: "text" | "link" | "image" = "text"
): SuperDragActionOption[] {
  if (targetType === "link") {
    return [
      { id: "open_bg_tab", label: "Background Tab" },
      { id: "open_active_tab", label: "Active Tab" },
      { id: "open_window_active", label: "New Window" },
      { id: "open_incognito_active", label: "Incognito Window", requiresIncognito: true },
      { id: "copy_to_clipboard", label: "Copy Link URL" },
      { id: "copy_link_text", label: "Copy Link Text" },
      { id: "none", label: "None (Do Nothing)" }
    ]
  }

  if (targetType === "image") {
    return [
      { id: "open_bg_tab", label: "Background Tab" },
      { id: "open_active_tab", label: "Active Tab" },
      { id: "open_window_active", label: "New Window" },
      { id: "open_incognito_active", label: "Incognito Window", requiresIncognito: true },
      { id: "copy_to_clipboard", label: "Copy Image Link" },
      { id: "none", label: "None (Do Nothing)" }
    ]
  }

  return [
    { id: "open_bg_tab", label: "Background Tab" },
    { id: "open_active_tab", label: "Active Tab" },
    { id: "open_window_active", label: "New Window" },
    { id: "open_incognito_active", label: "Incognito Window", requiresIncognito: true },
    { id: "copy_to_clipboard", label: "Copy to Clipboard" },
    { id: "none", label: "None (Do Nothing)" }
  ]
}
