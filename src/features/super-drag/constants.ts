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
export const RADIAL_INNER_RADIUS = MIN_DRAG_DISTANCE // 50px (deadzone boundary)
export const RADIAL_SECTOR_INNER_RADIUS = 54 // 4px breathing gap outside center hub
export const RADIAL_OUTER_RADIUS = 96
export const RADIAL_GAP_DEGREES = 3.2

/**
 * Radial Pie Menu Opacity & Visual Styling Tokens
 * Base surfaces are fully opaque so the user's `indicatorOpacity` setting
 * controls overall transparency cleanly from 35% to 100%.
 */
export const RADIAL_OPACITY_IDLE = 1
export const RADIAL_OPACITY_ACTIVE = 1

export const RADIAL_BG_IDLE = `rgba(30, 41, 59, ${RADIAL_OPACITY_IDLE})`
export const RADIAL_BG_DISABLED = "#161f30"
export const RADIAL_BG_ACTIVE = `rgba(99, 102, 241, ${RADIAL_OPACITY_ACTIVE})`

export const RADIAL_STROKE_IDLE = "rgba(148, 163, 184, 0.22)"
export const RADIAL_STROKE_DISABLED = "rgba(148, 163, 184, 0.10)"
export const RADIAL_STROKE_ACTIVE = "#a5b4fc"

export const RADIAL_STROKE_WIDTH_IDLE = 1.2
export const RADIAL_STROKE_WIDTH_ACTIVE = 1.8

export const RADIAL_GLOW_ACTIVE = "drop-shadow(0 0 12px rgba(99, 102, 241, 0.55))"

export const RADIAL_DEADZONE_BG = "#2b161d"
export const RADIAL_DEADZONE_STROKE = "rgba(248, 113, 113, 0.78)"

export const RADIAL_CENTER_BG = "#0f172a"
export const RADIAL_CENTER_STROKE = "rgba(148, 163, 184, 0.28)"

export type RadialTheme = "indigo" | "emerald" | "amber" | "sky" | "violet" | "muted"

export const RADIAL_THEME_PALETTE: Record<
  RadialTheme,
  {
    fill: string
    stroke: string
    glow: string
    pillBorder: string
    iconColor: string
  }
> = {
  indigo: {
    fill: "#6366f1",
    stroke: "#c7d2fe",
    glow: "drop-shadow(0 0 12px rgba(99, 102, 241, 0.65))",
    pillBorder: "rgba(129, 140, 248, 0.5)",
    iconColor: "#818cf8"
  },
  sky: {
    fill: "#0ea5e9",
    stroke: "#bae6fd",
    glow: "drop-shadow(0 0 12px rgba(14, 165, 233, 0.65))",
    pillBorder: "rgba(56, 189, 248, 0.5)",
    iconColor: "#38bdf8"
  },
  emerald: {
    fill: "#10b981",
    stroke: "#a7f3d0",
    glow: "drop-shadow(0 0 12px rgba(16, 185, 129, 0.65))",
    pillBorder: "rgba(52, 211, 153, 0.5)",
    iconColor: "#34d399"
  },
  amber: {
    fill: "#f59e0b",
    stroke: "#fde68a",
    glow: "drop-shadow(0 0 12px rgba(245, 158, 11, 0.65))",
    pillBorder: "rgba(251, 191, 36, 0.5)",
    iconColor: "#fbbf24"
  },
  violet: {
    fill: "#8b5cf6",
    stroke: "#ddd6fe",
    glow: "drop-shadow(0 0 12px rgba(139, 92, 246, 0.65))",
    pillBorder: "rgba(167, 139, 250, 0.5)",
    iconColor: "#a78bfa"
  },
  muted: {
    fill: "#334155",
    stroke: "#64748b",
    glow: "none",
    pillBorder: "rgba(148, 163, 184, 0.35)",
    iconColor: "#94a3b8"
  }
}

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
