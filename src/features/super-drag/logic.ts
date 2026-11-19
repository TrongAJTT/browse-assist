/**
 * Super Drag - Content Script Logic
 * Intercepts dragstart, dragover, and dragend events to trigger directional actions:
 * Supports 4 directions (up, down, left, right) configurable per target (text, link, image).
 */

import { escapeHtml } from "~core/escapeHtml"
import { t } from "~core/i18n"
import { MESSAGE_TYPES, sendToBackground } from "~core/messaging"
import { createShadowHost } from "~core/shadowHost"
import {
  DEFAULT_SUPER_DRAG_CONFIG,
  type SuperDragAction,
  type SuperDragConfig
} from "~core/types"
import {
  cleanUrl,
  copyToClipboard,
  extractAnchorText,
  showCopiedFeedback
} from "~core/linkUtils"
import {
  MAX_DRAG_DISTANCE,
  MIN_DRAG_DISTANCE,
  RADIAL_BG_DISABLED,
  RADIAL_BG_IDLE,
  RADIAL_CENTER,
  RADIAL_CENTER_BG,
  RADIAL_CENTER_STROKE,
  RADIAL_DEADZONE_BG,
  RADIAL_DEADZONE_STROKE,
  RADIAL_GAP_DEGREES,
  RADIAL_INNER_RADIUS,
  RADIAL_OUTER_RADIUS,
  RADIAL_SECTOR_INNER_RADIUS,
  RADIAL_STROKE_DISABLED,
  RADIAL_STROKE_IDLE,
  RADIAL_STROKE_WIDTH_ACTIVE,
  RADIAL_STROKE_WIDTH_IDLE,
  RADIAL_THEME_PALETTE,
  type RadialTheme
} from "./constants"

export {
  MIN_DRAG_DISTANCE,
  MAX_DRAG_DISTANCE,
  RADIAL_INNER_RADIUS,
  RADIAL_OUTER_RADIUS,
  RADIAL_OPACITY_IDLE,
  RADIAL_OPACITY_ACTIVE
} from "./constants"

let isActive = false
let currentConfig: SuperDragConfig = { ...DEFAULT_SUPER_DRAG_CONFIG }

export type DragDirection = "up" | "down" | "left" | "right"

interface DragSession {
  startX: number
  startY: number
  type: "text" | "link" | "image"
  payload: string
  extraText?: string
}

let activeSession: DragSession | null = null
let superDragHost: HTMLDivElement | null = null
let superDragShadow: ShadowRoot | null = null
let indicatorElement: HTMLDivElement | null = null
let indicatorTimeoutId: number | null = null

let radialElement: HTMLDivElement | null = null
let radialTimeoutId: number | null = null
let currentRadialDirection: DragDirection | null = null

function ensureSuperDragShadow(): ShadowRoot {
  if (
    superDragHost &&
    superDragShadow &&
    document.documentElement.contains(superDragHost)
  ) {
    return superDragShadow
  }
  if (superDragHost && superDragHost.parentNode) {
    superDragHost.parentNode.removeChild(superDragHost)
  }
  const { host, shadow } = createShadowHost("browse-assist-super-drag-host")
  superDragHost = host
  superDragShadow = shadow
  indicatorElement = null
  radialElement = null
  return shadow
}

/**
 * Creates SVG path for an annular sector (pie slice/donut wedge).
 */
function createAnnularSectorPath(
  cx: number,
  cy: number,
  r: number,
  R: number,
  startDeg: number,
  endDeg: number,
  gapDeg = RADIAL_GAP_DEGREES
): string {
  const toRad = Math.PI / 180
  const a1 = (startDeg + gapDeg) * toRad
  const a2 = (endDeg - gapDeg) * toRad

  const p1x = cx + r * Math.cos(a1)
  const p1y = cy + r * Math.sin(a1)

  const p2x = cx + R * Math.cos(a1)
  const p2y = cy + R * Math.sin(a1)

  const p3x = cx + R * Math.cos(a2)
  const p3y = cy + R * Math.sin(a2)

  const p4x = cx + r * Math.cos(a2)
  const p4y = cy + r * Math.sin(a2)

  return `M ${p1x.toFixed(2)} ${p1y.toFixed(2)} L ${p2x.toFixed(2)} ${p2y.toFixed(2)} A ${R} ${R} 0 0 1 ${p3x.toFixed(2)} ${p3y.toFixed(2)} L ${p4x.toFixed(2)} ${p4y.toFixed(2)} A ${r} ${r} 0 0 0 ${p1x.toFixed(2)} ${p1y.toFixed(2)} Z`
}

const RADIAL_PATHS: Record<DragDirection, string> = {
  up: createAnnularSectorPath(
    RADIAL_CENTER,
    RADIAL_CENTER,
    RADIAL_SECTOR_INNER_RADIUS,
    RADIAL_OUTER_RADIUS,
    -135,
    -45,
    RADIAL_GAP_DEGREES
  ),
  right: createAnnularSectorPath(
    RADIAL_CENTER,
    RADIAL_CENTER,
    RADIAL_SECTOR_INNER_RADIUS,
    RADIAL_OUTER_RADIUS,
    -45,
    45,
    RADIAL_GAP_DEGREES
  ),
  down: createAnnularSectorPath(
    RADIAL_CENTER,
    RADIAL_CENTER,
    RADIAL_SECTOR_INNER_RADIUS,
    RADIAL_OUTER_RADIUS,
    45,
    135,
    RADIAL_GAP_DEGREES
  ),
  left: createAnnularSectorPath(
    RADIAL_CENTER,
    RADIAL_CENTER,
    RADIAL_SECTOR_INNER_RADIUS,
    RADIAL_OUTER_RADIUS,
    135,
    225,
    RADIAL_GAP_DEGREES
  )
}

const RADIAL_ICON_CENTERS: Record<DragDirection, { x: number; y: number }> = {
  up: { x: RADIAL_CENTER, y: RADIAL_CENTER - 75 },
  right: { x: RADIAL_CENTER + 75, y: RADIAL_CENTER },
  down: { x: RADIAL_CENTER, y: RADIAL_CENTER + 75 },
  left: { x: RADIAL_CENTER - 75, y: RADIAL_CENTER }
}

/**
 * Returns crisp 24x24 Lucide-style SVG path markup for a Super Drag action
 * rendered inside a radial sector.
 */
function getRadialActionGlyph(
  action: SuperDragAction,
  targetType: "text" | "link" | "image"
): string {
  switch (action) {
    case "open_bg_tab":
      return `<path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>`
    case "open_active_tab":
      return targetType === "text"
        ? `<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>`
        : `<rect width="18" height="14" x="3" y="5" rx="2"/><path d="M3 10h18"/><path d="M10 5v5"/>`
    case "open_window_active":
      return `<rect width="20" height="16" x="2" y="4" rx="2"/><path d="M10 4v4"/><path d="M2 8h20"/>`
    case "open_incognito_active":
      return `<path d="M2 12a5 5 0 0 0 5 5 8 8 0 0 1 5 2 8 8 0 0 1 5-2 5 5 0 0 0 5-5"/><path d="M3 7h18"/><circle cx="7" cy="14" r="2"/><circle cx="17" cy="14" r="2"/>`
    case "copy_to_clipboard":
      return `<rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>`
    case "copy_link_text":
      return `<polyline points="4 7 4 4 20 4 20 7"/><line x1="9" y1="20" x2="15" y2="20"/><line x1="12" y1="4" x2="12" y2="20"/>`
    case "copy_markdown":
      return `<polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>`
    case "search_image":
      return `<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>`
    case "none":
    default:
      return `<line x1="6" y1="12" x2="18" y2="12"/>`
  }
}

/**
 * Gets or lazily creates the floating indicator badge element.
 */
function getOrCreateIndicator(): HTMLDivElement {
  const shadow = ensureSuperDragShadow()
  if (!indicatorElement || !shadow.contains(indicatorElement)) {
    indicatorElement = document.createElement("div")
    indicatorElement.id = "browse-assist-drag-indicator"
    indicatorElement.style.cssText = `
      position: fixed;
      z-index: 2147483647;
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 7px 14px;
      border-radius: 9999px;
      background: #0f172a;
      color: #f8fafc;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      font-size: 12px;
      font-weight: 600;
      letter-spacing: 0.02em;
      border: 1px solid rgba(148, 163, 184, 0.25);
      box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.4), 0 8px 10px -6px rgba(0, 0, 0, 0.3);
      backdrop-filter: blur(8px);
      pointer-events: none;
      user-select: none;
      opacity: 0;
      transform: translate3d(-50%, -100%, 0) scale(0.92);
      transition: opacity 0.15s ease-out, transform 0.15s cubic-bezier(0.16, 1, 0.3, 1), background-color 0.2s ease;
      white-space: nowrap;
    `
    shadow.appendChild(indicatorElement)
  }
  return indicatorElement
}

/**
 * Gets or lazily creates the Circular Segment Selection (Radial Pie) indicator element.
 */
function getOrCreateRadialIndicator(): HTMLDivElement {
  const shadow = ensureSuperDragShadow()
  if (!radialElement || !shadow.contains(radialElement)) {
    radialElement = document.createElement("div")
    radialElement.id = "browse-assist-radial-indicator"
    radialElement.style.cssText = `
      position: fixed;
      z-index: 2147483647;
      width: 220px;
      height: 220px;
      pointer-events: none;
      user-select: none;
      opacity: 0;
      transform: translate3d(-50%, -50%, 0) scale(0.9);
      transition: opacity 0.16s ease-out, transform 0.16s cubic-bezier(0.16, 1, 0.3, 1);
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    `
    shadow.appendChild(radialElement)
  }
  return radialElement
}

/**
 * Inline SVGs for indicator icons.
 */
const ICONS = {
  tabBackground: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#818cf8" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/></svg>`,
  tabForeground: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>`,
  windowActive: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="M10 4v4"/><path d="M2 8h20"/></svg>`,
  windowBg: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#818cf8" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="M2 8h20"/></svg>`,
  incognito: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12a5 5 0 0 0 5 5 8 8 0 0 1 5 2 8 8 0 0 1 5-2 5 5 0 0 0 5-5"/><path d="M3 7h18"/><circle cx="7" cy="14" r="2"/><circle cx="17" cy="14" r="2"/></svg>`,
  copy: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#34d399" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>`,
  copyText: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7V4h16v3"/><path d="M9 20h6"/><path d="M12 4v16"/></svg>`,
  search: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#818cf8" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>`,
  none: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m4.9 4.9 14.2 14.2"/></svg>`
}

/**
 * Resolves action display config: text label, icon, and border color theme.
 */
function getActionDisplay(
  action: SuperDragAction,
  targetType: "text" | "link" | "image"
): {
  label: string
  shortLabel: string
  icon: string
  theme: "indigo" | "emerald" | "amber" | "sky" | "violet"
} {
  const typeLabel =
    targetType === "text"
      ? t("features.superDrag.logic.types.search")
      : targetType === "image"
        ? t("features.superDrag.logic.types.image")
        : t("features.superDrag.logic.types.link")

  switch (action) {
    case "open_bg_tab":
      return {
        label: t("features.superDrag.logic.dropOpenBackground", {
          type: typeLabel
        }),
        shortLabel: t("features.superDrag.logic.shortOpenBackground", {
          type: typeLabel
        }),
        icon: ICONS.tabBackground,
        theme: "indigo"
      }
    case "open_active_tab":
      return {
        label: t("features.superDrag.logic.dropOpenActive", {
          type: typeLabel
        }),
        shortLabel: t("features.superDrag.logic.shortOpenActive", {
          type: typeLabel
        }),
        icon: ICONS.tabForeground,
        theme: "sky"
      }
    case "open_window_active":
      return {
        label: t("features.superDrag.logic.dropOpenWindow", {
          type: typeLabel
        }),
        shortLabel: t("features.superDrag.logic.shortOpenWindow", {
          type: typeLabel
        }),
        icon: ICONS.windowActive,
        theme: "sky"
      }
    case "open_incognito_active":
      return {
        label: t("features.superDrag.logic.dropOpenIncognito", {
          type: typeLabel
        }),
        shortLabel: t("features.superDrag.logic.shortOpenIncognito", {
          type: typeLabel
        }),
        icon: ICONS.incognito,
        theme: "amber"
      }
    case "copy_link_text":
      return {
        label: t("features.superDrag.logic.dropCopyLinkText"),
        shortLabel: t("features.superDrag.logic.shortCopyLinkText"),
        icon: ICONS.copyText,
        theme: "sky"
      }
    case "copy_markdown":
      return {
        label: t("features.superDrag.logic.dropCopyMarkdown"),
        shortLabel: t("features.superDrag.logic.shortCopyMarkdown"),
        icon: ICONS.copyText,
        theme: "sky"
      }
    case "search_image":
      return {
        label: t("features.superDrag.logic.dropSearchImage"),
        shortLabel: t("features.superDrag.logic.shortSearchImage"),
        icon: ICONS.search,
        theme: "indigo"
      }
    case "copy_to_clipboard":
      return {
        label:
          targetType === "text"
            ? t("features.superDrag.logic.dropCopyText")
            : targetType === "image"
              ? t("features.superDrag.logic.dropCopyImageLink")
              : t("features.superDrag.logic.dropCopyLinkUrl"),
        shortLabel:
          targetType === "text"
            ? t("features.superDrag.logic.shortCopyText")
            : targetType === "image"
              ? t("features.superDrag.logic.shortCopyImageLink")
              : t("features.superDrag.logic.shortCopyLinkUrl"),
        icon: ICONS.copy,
        theme: "emerald"
      }
    case "none":
    default:
      return {
        label: t("features.superDrag.logic.noAction"),
        shortLabel: t("features.superDrag.logic.noAction"),
        icon: ICONS.none,
        theme: "indigo"
      }
  }
}

/**
 * Updates or shows the live floating drag badge at the cursor.
 */
function updateBadgeIndicator(
  clientX: number,
  clientY: number,
  text: string,
  iconSvg: string,
  badgeTheme: "indigo" | "emerald" | "amber" | "sky" | "violet" = "indigo"
): void {
  const el = getOrCreateIndicator()
  if (indicatorTimeoutId !== null) {
    window.clearTimeout(indicatorTimeoutId)
    indicatorTimeoutId = null
  }

  const themeBorder =
    badgeTheme === "emerald"
      ? "rgba(52, 211, 153, 0.4)"
      : badgeTheme === "amber"
        ? "rgba(251, 191, 36, 0.4)"
        : badgeTheme === "sky"
          ? "rgba(56, 189, 248, 0.4)"
          : badgeTheme === "violet"
            ? "rgba(167, 139, 250, 0.4)"
            : "rgba(129, 140, 248, 0.4)"

  el.style.borderColor = themeBorder
  el.innerHTML = `
    <span style="display:flex;align-items:center;justify-content:center;width:16px;height:16px;flex-shrink:0;">
      ${iconSvg}
    </span>
    <span>${text}</span>
  `

  el.style.left = `${clientX}px`
  el.style.top = `${clientY - 20}px`
  el.style.opacity = String(
    currentConfig.indicatorOpacity ??
      DEFAULT_SUPER_DRAG_CONFIG.indicatorOpacity ??
      1
  )
  el.style.transform = "translate3d(-50%, -100%, 0) scale(1)"
}

/**
 * Updates or shows the Circular Segment Selection (Radial Pie Menu).
 * Inner circle radius is locked to MIN_DRAG_DISTANCE (deadzone).
 * Only activates when distance is between MIN_DRAG_DISTANCE and MAX_DRAG_DISTANCE.
 */
function updateRadialIndicator(
  startX: number,
  startY: number,
  activeDirection: DragDirection | null,
  targetType: "text" | "link" | "image",
  isExceeded = false
): void {
  const el = getOrCreateRadialIndicator()
  if (radialTimeoutId !== null) {
    window.clearTimeout(radialTimeoutId)
    radialTimeoutId = null
  }

  // Constrain position within viewport to avoid clipping (radial width is 220px)
  const safeX = Math.max(115, Math.min(window.innerWidth - 115, startX))
  const safeY = Math.max(115, Math.min(window.innerHeight - 115, startY))

  currentRadialDirection = activeDirection

  const isDeadzone = activeDirection === null && !isExceeded
  const activeAction = activeDirection
    ? getTargetAction(targetType, activeDirection)
    : "none"
  const activeDisplay = activeDirection
    ? getActionDisplay(activeAction, targetType)
    : null
  const activeTheme: RadialTheme =
    !activeDirection || activeAction === "none"
      ? "muted"
      : activeDisplay?.theme ?? "indigo"
  const activePalette = RADIAL_THEME_PALETTE[activeTheme]

  // Crisp 24x24 Lucide-style target icon for center hub (centered at 110, 110)
  const centerGlyph =
    isDeadzone || isExceeded
      ? `<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>`
      : targetType === "text"
        ? `<polyline points="4 7 4 4 20 4 20 7"/><line x1="9" y1="20" x2="15" y2="20"/><line x1="12" y1="4" x2="12" y2="20"/>`
        : targetType === "link"
          ? `<path d="M9 17H7A5 5 0 0 1 7 7h2"/><path d="M15 7h2a5 5 0 1 1 0 10h-2"/><line x1="8" y1="12" x2="16" y2="12"/>`
          : `<rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>`

  const centerIconColor =
    isDeadzone || isExceeded ? "#f87171" : activePalette.iconColor

  const renderSector = (dir: DragDirection) => {
    const dirAction = getTargetAction(targetType, dir)
    const isDisabled = dirAction === "none"
    const isHovered = activeDirection === dir
    const dirDisplay = getActionDisplay(dirAction, targetType)
    const dirTheme: RadialTheme = isDisabled ? "muted" : dirDisplay.theme
    const palette = RADIAL_THEME_PALETTE[dirTheme]

    const fill = isHovered
      ? palette.fill
      : isDisabled
        ? RADIAL_BG_DISABLED
        : RADIAL_BG_IDLE
    const stroke = isHovered
      ? palette.stroke
      : isDisabled
        ? RADIAL_STROKE_DISABLED
        : RADIAL_STROKE_IDLE
    const strokeWidth = isHovered
      ? RADIAL_STROKE_WIDTH_ACTIVE
      : RADIAL_STROKE_WIDTH_IDLE
    const filter =
      isHovered && palette.glow !== "none" ? `filter="${palette.glow}"` : ""

    const { x, y } = RADIAL_ICON_CENTERS[dir]
    const iconColor = isHovered
      ? "#ffffff"
      : isDisabled
        ? "rgba(148, 163, 184, 0.35)"
        : "rgba(226, 232, 240, 0.85)"
    const iconStrokeWidth = isHovered ? "2.4" : "2.1"

    return `
      <g>
        <path d="${RADIAL_PATHS[dir]}" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" stroke-linejoin="round" ${filter} style="transition: fill 0.12s ease, stroke 0.12s ease;"/>
        <g transform="translate(${x - 9}, ${y - 9}) scale(0.75)" fill="none" stroke="${iconColor}" stroke-width="${iconStrokeWidth}" stroke-linecap="round" stroke-linejoin="round">
          ${getRadialActionGlyph(dirAction, targetType)}
        </g>
      </g>
    `
  }

  const centerStroke =
    isDeadzone || isExceeded
      ? RADIAL_DEADZONE_STROKE
      : activeDirection && activeAction !== "none"
        ? activePalette.pillBorder
        : RADIAL_CENTER_STROKE

  const pillBorder =
    isDeadzone || isExceeded
      ? "rgba(248, 113, 113, 0.5)"
      : activePalette.pillBorder

  el.innerHTML = `
    <svg width="220" height="220" viewBox="0 0 220 220" style="overflow:visible; filter: drop-shadow(0 14px 28px rgba(0,0,0,0.5));">
      <!-- 4 Action Sectors -->
      ${renderSector("up")}
      ${renderSector("right")}
      ${renderSector("down")}
      ${renderSector("left")}

      <!-- Center Hub (Deadzone / Cancel Hub) -->
      <circle cx="${RADIAL_CENTER}" cy="${RADIAL_CENTER}" r="${RADIAL_INNER_RADIUS - 3}"
        fill="${isDeadzone || isExceeded ? RADIAL_DEADZONE_BG : RADIAL_CENTER_BG}"
        stroke="${centerStroke}"
        stroke-width="${isDeadzone || isExceeded ? "1.6" : "1.4"}"
        stroke-dasharray="${isDeadzone || isExceeded ? "4 3" : "none"}"
        style="transition: all 0.15s ease;"
      />
      <g transform="translate(100, 100) scale(0.8333)" fill="none" stroke="${centerIconColor}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
        ${centerGlyph}
      </g>
    </svg>

    <!-- Floating Action Pill Tooltip -->
    <div style="
      position: absolute;
      bottom: -34px;
      left: 50%;
      transform: translateX(-50%);
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 5px 12px;
      border-radius: 9999px;
      background: #0f172a;
      color: #f8fafc;
      font-size: 11.5px;
      font-weight: 600;
      letter-spacing: 0.01em;
      white-space: nowrap;
      border: 1px solid ${pillBorder};
      box-shadow: 0 10px 22px rgba(0, 0, 0, 0.48);
      transition: all 0.15s ease;
    ">
      ${isExceeded
      ? `<span style="color:#fca5a5;">${escapeHtml(t("features.superDrag.logic.exceededMax"))}</span>`
      : isDeadzone
        ? `<span style="color:#fca5a5;">${escapeHtml(t("features.superDrag.logic.releaseToCancel"))}</span>`
        : `<span style="display:inline-flex;align-items:center;justify-content:center;width:14px;height:14px;flex-shrink:0;">${activeDisplay?.icon ?? ""}</span><span>${escapeHtml(activeDisplay?.shortLabel ?? "")}</span>`
    }
    </div>
  `

  el.style.left = `${safeX}px`
  el.style.top = `${safeY}px`
  el.style.opacity = String(
    currentConfig.indicatorOpacity ??
      DEFAULT_SUPER_DRAG_CONFIG.indicatorOpacity ??
      1
  )
  el.style.transform = "translate3d(-50%, -50%, 0) scale(1)"
}

/**
 * Hides all active drag indicators (badge and radial).
 */
function hideIndicator(immediately = false): void {
  // 1. Hide badge indicator
  if (indicatorElement) {
    if (immediately) {
      indicatorElement.style.opacity = "0"
      indicatorElement.style.transform = "translate3d(-50%, -100%, 0) scale(0.92)"
    } else {
      if (indicatorTimeoutId !== null) window.clearTimeout(indicatorTimeoutId)
      indicatorTimeoutId = window.setTimeout(() => {
        if (indicatorElement) {
          indicatorElement.style.opacity = "0"
          indicatorElement.style.transform =
            "translate3d(-50%, -100%, 0) scale(0.92)"
        }
        indicatorTimeoutId = null
      }, 180)
    }
  }

  // 2. Hide radial indicator
  if (radialElement) {
    currentRadialDirection = null
    if (immediately) {
      radialElement.style.opacity = "0"
      radialElement.style.transform = "translate3d(-50%, -50%, 0) scale(0.88)"
    } else {
      if (radialTimeoutId !== null) window.clearTimeout(radialTimeoutId)
      radialTimeoutId = window.setTimeout(() => {
        if (radialElement) {
          radialElement.style.opacity = "0"
          radialElement.style.transform =
            "translate3d(-50%, -50%, 0) scale(0.88)"
        }
        radialTimeoutId = null
      }, 180)
    }
  }
}


/**
 * Determines primary drag direction based on displacement angles.
 */
function getDragDirection(deltaX: number, deltaY: number): DragDirection {
  if (Math.abs(deltaX) > Math.abs(deltaY)) {
    return deltaX > 0 ? "right" : "left"
  } else {
    return deltaY > 0 ? "down" : "up"
  }
}

/**
 * Retrieves configured action for current target type and direction.
 */
function getTargetAction(
  targetType: "text" | "link" | "image",
  direction: DragDirection
): SuperDragAction {
  if (targetType === "text") {
    return currentConfig.textActions?.[direction] ?? "open_bg_tab"
  }
  if (targetType === "link") {
    return currentConfig.linkActions?.[direction] ?? "open_bg_tab"
  }
  return currentConfig.imageActions?.[direction] ?? "open_bg_tab"
}

/**
 * Checks if target is an editable form element where native drag must not be hijacked.
 */
function isEditableElement(target: EventTarget | null): boolean {
  if (!target || !(target instanceof HTMLElement)) return false

  const tagName = target.tagName.toUpperCase()
  if (tagName === "INPUT" || tagName === "TEXTAREA") return true
  if (target.isContentEditable) return true
  if (target.closest("[contenteditable='true']")) return true

  return false
}

/**
 * Captures drag start coordinates and extracts link, image, or selected text.
 */
function onDragStart(event: DragEvent): void {
  if (!isActive) return

  if (isEditableElement(event.target)) {
    activeSession = null
    return
  }

  const target = event.target as HTMLElement | null

  // 1. Check if dragging an image element (<img>)
  if (currentConfig.openImages) {
    const img =
      target instanceof HTMLImageElement
        ? target
        : target?.querySelector?.("img")
    const imgSrc = img?.currentSrc || img?.src
    if (
      imgSrc &&
      (imgSrc.startsWith("http://") ||
        imgSrc.startsWith("https://") ||
        imgSrc.startsWith("data:") ||
        imgSrc.startsWith("blob:"))
    ) {
      activeSession = {
        startX: event.clientX,
        startY: event.clientY,
        type: "image",
        payload: imgSrc
      }
      return
    }
  }

  // 2. Check if dragging a hyperlink (<a>)
  const anchor = target?.closest?.("a")
  if (currentConfig.openHyperlinks && anchor && anchor.href) {
    activeSession = {
      startX: event.clientX,
      startY: event.clientY,
      type: "link",
      payload: anchor.href,
      extraText: extractAnchorText(anchor, anchor.href)
    }
    return
  }

  // 3. Check if dragging highlighted text
  if (currentConfig.searchSelectedText) {
    const selectedText = window.getSelection()?.toString().trim()
    if (selectedText) {
      activeSession = {
        startX: event.clientX,
        startY: event.clientY,
        type: "text",
        payload: selectedText
      }
      return
    }
  }

  activeSession = null
}

/**
 * Updates live indicator on drag.
 */
function onDragOver(event: DragEvent): void {
  if (!isActive || !activeSession) return
  event.preventDefault()
  if (event.dataTransfer) {
    event.dataTransfer.dropEffect = "copy"
  }

  const indicatorStyle =
    currentConfig.indicatorStyle ??
    (currentConfig.showIndicator ? "radial" : "none")

  const deltaX = event.clientX - activeSession.startX
  const deltaY = event.clientY - activeSession.startY
  const distance = Math.hypot(deltaX, deltaY)

  if (indicatorStyle === "radial") {
    let activeDirection: DragDirection | null = null
    let isExceeded = false

    if (distance > MAX_DRAG_DISTANCE) {
      isExceeded = true
    } else if (distance >= MIN_DRAG_DISTANCE) {
      const angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI)
      if (angle >= -135 && angle < -45) {
        activeDirection = "up"
      } else if (angle >= -45 && angle < 45) {
        activeDirection = "right"
      } else if (angle >= 45 && angle < 135) {
        activeDirection = "down"
      } else {
        activeDirection = "left"
      }
    }

    updateRadialIndicator(
      activeSession.startX,
      activeSession.startY,
      activeDirection,
      activeSession.type,
      isExceeded
    )
  } else if (indicatorStyle === "badge") {
    if (distance >= MIN_DRAG_DISTANCE && distance <= MAX_DRAG_DISTANCE) {
      const direction = getDragDirection(deltaX, deltaY)
      const action = getTargetAction(activeSession.type, direction)

      if (action === "none") {
        hideIndicator(true)
        return
      }

      const { label, icon, theme } = getActionDisplay(action, activeSession.type)
      updateBadgeIndicator(event.clientX, event.clientY, label, icon, theme)
    } else {
      hideIndicator(true)
    }
  } else {
    // "none" indicator style: suppress visuals completely
    hideIndicator(true)
  }
}

/**
 * Calculates vector distance, determines direction, and dispatches configured action.
 */
async function onDragEnd(event: DragEvent): Promise<void> {
  const chosenRadialDirection = currentRadialDirection
  hideIndicator(true)
  if (!isActive || !activeSession) return

  const deltaX = event.clientX - activeSession.startX
  const deltaY = event.clientY - activeSession.startY
  const distance = Math.hypot(deltaX, deltaY)

  const indicatorStyle =
    currentConfig.indicatorStyle ??
    (currentConfig.showIndicator ? "radial" : "none")

  let directionToExecute: DragDirection | null = null

  if (indicatorStyle === "radial") {
    if (distance >= MIN_DRAG_DISTANCE && distance <= MAX_DRAG_DISTANCE) {
      if (chosenRadialDirection !== null) {
        directionToExecute = chosenRadialDirection
      } else {
        const angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI)
        if (angle >= -135 && angle < -45) {
          directionToExecute = "up"
        } else if (angle >= -45 && angle < 45) {
          directionToExecute = "right"
        } else if (angle >= 45 && angle < 135) {
          directionToExecute = "down"
        } else {
          directionToExecute = "left"
        }
      }
    } else {
      directionToExecute = null
    }
  } else {
    if (distance >= MIN_DRAG_DISTANCE && distance <= MAX_DRAG_DISTANCE) {
      directionToExecute = getDragDirection(deltaX, deltaY)
    }
  }

  if (directionToExecute) {
    const action = getTargetAction(activeSession.type, directionToExecute)

    if (action === "copy_link_text") {
      const textToCopy = activeSession.extraText || activeSession.payload
      const success = await copyToClipboard(textToCopy)
      if (success) {
        showCopiedFeedback(t("content.copied.linkText"), textToCopy)
      }
    } else if (action === "copy_markdown") {
      const cleaned = cleanUrl(activeSession.payload)
      const title = (activeSession.extraText || cleaned).replace(/\[|\]/g, "")
      const markdown = `[${title}](${cleaned})`
      const success = await copyToClipboard(markdown)
      if (success) {
        showCopiedFeedback(t("content.copied.markdown"), markdown)
      }
    } else if (action === "copy_to_clipboard") {
      const payload =
        activeSession.type === "text"
          ? activeSession.payload
          : cleanUrl(activeSession.payload)
      const success = await copyToClipboard(payload)
      if (success) {
        const label =
          activeSession.type === "text"
            ? t("content.copied.text")
            : activeSession.type === "image"
              ? t("content.copied.imageLink")
              : t("content.copied.linkUrl")
        showCopiedFeedback(label, payload)
      }
    } else if (action !== "none") {
      sendToBackground(MESSAGE_TYPES.SUPER_DRAG_EXECUTE_ACTION, {
        action,
        targetType: activeSession.type,
        payload: activeSession.payload
      }).catch(() => { })
    }
  }

  activeSession = null
}

/**
 * Hot updates runtime Super Drag config.
 */
export function updateSuperDragConfig(config?: Partial<SuperDragConfig>): void {
  if (!config) return
  currentConfig = { ...currentConfig, ...config }
}

/**
 * Activates the Super Drag event listeners.
 */
export function activate(config?: SuperDragConfig): void {
  if (config) {
    updateSuperDragConfig(config)
  }

  if (isActive || typeof window === "undefined") return
  isActive = true

  window.addEventListener("dragstart", onDragStart, true)
  window.addEventListener("dragover", onDragOver, true)
  window.addEventListener("dragend", onDragEnd, true)
}

/**
 * Deactivates the Super Drag event listeners and cleans up session state.
 */
export function deactivate(): void {
  if (!isActive || typeof window === "undefined") return
  isActive = false

  window.removeEventListener("dragstart", onDragStart, true)
  window.removeEventListener("dragover", onDragOver, true)
  window.removeEventListener("dragend", onDragEnd, true)

  if (superDragHost && superDragHost.parentNode) {
    superDragHost.parentNode.removeChild(superDragHost)
  }
  superDragHost = null
  superDragShadow = null
  indicatorElement = null
  if (indicatorTimeoutId !== null) {
    window.clearTimeout(indicatorTimeoutId)
    indicatorTimeoutId = null
  }

  radialElement = null
  if (radialTimeoutId !== null) {
    window.clearTimeout(radialTimeoutId)
    radialTimeoutId = null
  }

  currentRadialDirection = null
  activeSession = null
}
