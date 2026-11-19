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
 * Base surfaces are fully opaque so the user's `indicatorOpacity` setting
 * controls overall transparency cleanly from 35% to 100%.
 */
export const RADIAL_OPACITY_IDLE = 1
export const RADIAL_OPACITY_ACTIVE = 1

export const RADIAL_BG_IDLE = `rgba(30, 41, 59, ${RADIAL_OPACITY_IDLE})`
export const RADIAL_BG_ACTIVE = `rgba(56, 189, 248, ${RADIAL_OPACITY_ACTIVE})`

export const RADIAL_STROKE_IDLE = "rgba(148, 163, 184, 0.35)"
export const RADIAL_STROKE_ACTIVE = "#ffffff"

export const RADIAL_STROKE_WIDTH_IDLE = 1.2
export const RADIAL_STROKE_WIDTH_ACTIVE = 2.0

export const RADIAL_GLOW_ACTIVE = "drop-shadow(0 0 10px rgba(56, 189, 248, 0.80))"

export const RADIAL_DEADZONE_BG = "#2b161d"
export const RADIAL_DEADZONE_STROKE = "rgba(239, 68, 68, 0.75)"

export const RADIAL_CENTER_BG = "#0f172a"
export const RADIAL_CENTER_STROKE = "rgba(56, 189, 248, 0.55)"

/**
 * Super Drag Available Action Options for Settings Dropdown
 */
export interface SuperDragActionOption {
  id: SuperDragAction
  requiresIncognito?: boolean
}

const COMMON_OPEN_ACTIONS: SuperDragActionOption[] = [
  { id: "open_bg_tab" },
  { id: "open_active_tab" },
  { id: "open_window_active" },
  { id: "open_incognito_active", requiresIncognito: true }
]

const NONE_ACTION: SuperDragActionOption = {
  id: "none"
}

export const SUPER_DRAG_ACTION_OPTIONS: SuperDragActionOption[] = [
  ...COMMON_OPEN_ACTIONS,
  { id: "copy_to_clipboard" },
  { id: "copy_link_text" },
  NONE_ACTION
]

/**
 * Resolves context-aware action options tailored to the specific drag target type.
 */
export function getSuperDragActionOptions(
  targetType: "text" | "link" | "image" = "text"
): SuperDragActionOption[] {
  if (targetType === "link") {
    return [
      ...COMMON_OPEN_ACTIONS,
      { id: "copy_to_clipboard" },
      { id: "copy_link_text" },
      { id: "copy_markdown" },
      NONE_ACTION
    ]
  }

  if (targetType === "image") {
    return [
      ...COMMON_OPEN_ACTIONS,
      { id: "copy_to_clipboard" },
      { id: "search_image" },
      NONE_ACTION
    ]
  }

  return [
    ...COMMON_OPEN_ACTIONS,
    { id: "copy_to_clipboard" },
    NONE_ACTION
  ]
}
