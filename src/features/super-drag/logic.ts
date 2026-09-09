/**
 * Super Drag - Content Script Logic
 * Intercepts dragstart, dragover, and dragend events to trigger directional actions:
 * Supports 4 directions (up, down, left, right) configurable per target (text, link, image).
 */

import { MESSAGE_TYPES, sendToBackground } from "~core/messaging"
import {
  DEFAULT_SUPER_DRAG_CONFIG,
  type SuperDragAction,
  type SuperDragConfig
} from "~core/types"
import { cleanUrl } from "~features/context-menu-actions/cleanUrl"

let isActive = false
let currentConfig: SuperDragConfig = { ...DEFAULT_SUPER_DRAG_CONFIG }

// Minimum distance threshold in pixels to distinguish deliberate drag from text selection
const MIN_DRAG_DISTANCE = 50
// Maximum distance threshold in pixels to prevent stray cross-screen drags from executing
const MAX_DRAG_DISTANCE = 220

export type DragDirection = "up" | "down" | "left" | "right"

interface DragSession {
  startX: number
  startY: number
  type: "text" | "link" | "image"
  payload: string
}

let activeSession: DragSession | null = null
let indicatorElement: HTMLDivElement | null = null
let indicatorTimeoutId: number | null = null

/**
 * Gets or lazily creates the floating indicator badge element.
 */
function getOrCreateIndicator(): HTMLDivElement {
  if (
    !indicatorElement ||
    !document.documentElement.contains(indicatorElement)
  ) {
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
      background: rgba(15, 23, 42, 0.94);
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
    document.documentElement.appendChild(indicatorElement)
  }
  return indicatorElement
}

/**
 * Inline SVGs for indicator icons.
 */
const ICONS = {
  tabBackground: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#818cf8" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/></svg>`,
  tabForeground: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>`,
  splitView: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M12 3v18"/></svg>`,
  windowActive: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="M10 4v4"/><path d="M2 8h20"/></svg>`,
  windowBg: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#818cf8" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="M2 8h20"/></svg>`,
  incognito: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12a5 5 0 0 0 5 5 8 8 0 0 1 5 2 8 8 0 0 1 5-2 5 5 0 0 0 5-5"/><path d="M3 7h18"/><circle cx="7" cy="14" r="2"/><circle cx="17" cy="14" r="2"/></svg>`,
  copy: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#34d399" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>`,
  none: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m4.9 4.9 14.2 14.2"/></svg>`
}

/**
 * Resolves action display config: text label, icon, and border color theme.
 */
function getActionDisplay(
  action: SuperDragAction,
  targetType: "text" | "link" | "image"
): { label: string; icon: string; theme: "indigo" | "emerald" | "amber" | "sky" | "violet" } {
  const typeLabel =
    targetType === "text"
      ? "Search"
      : targetType === "image"
        ? "Image"
        : "Link"

  switch (action) {
    case "open_bg_tab":
      return {
        label: `Drop to Open ${typeLabel} (Background)`,
        icon: ICONS.tabBackground,
        theme: "indigo"
      }
    case "open_active_tab":
      return {
        label: `Drop to Open ${typeLabel} (New Tab)`,
        icon: ICONS.tabForeground,
        theme: "sky"
      }
    case "open_split_view":
      return {
        label: `Drop to Open ${typeLabel} (Split View)`,
        icon: ICONS.splitView,
        theme: "violet"
      }
    case "open_window_active":
      return {
        label: `Drop to Open ${typeLabel} (New Window)`,
        icon: ICONS.windowActive,
        theme: "sky"
      }
    case "open_window_bg":
      return {
        label: `Drop to Open ${typeLabel} (Window Background)`,
        icon: ICONS.windowBg,
        theme: "indigo"
      }
    case "open_incognito_active":
      return {
        label: `Drop to Open ${typeLabel} (Incognito)`,
        icon: ICONS.incognito,
        theme: "amber"
      }
    case "open_incognito_bg":
      return {
        label: `Drop to Open ${typeLabel} (Incognito Background)`,
        icon: ICONS.incognito,
        theme: "amber"
      }
    case "copy_to_clipboard":
      return {
        label:
          targetType === "text"
            ? "Drop to Copy Text"
            : targetType === "image"
              ? "Drop to Copy Image Link"
              : "Drop to Copy Link",
        icon: ICONS.copy,
        theme: "emerald"
      }
    case "none":
    default:
      return {
        label: "No action",
        icon: ICONS.none,
        theme: "indigo"
      }
  }
}

/**
 * Updates or shows the live floating drag indicator at the cursor.
 */
function updateIndicator(
  clientX: number,
  clientY: number,
  text: string,
  iconSvg: string,
  badgeTheme: "indigo" | "emerald" | "amber" | "sky" | "violet" = "indigo"
): void {
  if (!currentConfig.showIndicator || typeof document === "undefined") return

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
  el.style.opacity = "1"
  el.style.transform = "translate3d(-50%, -100%, 0) scale(1)"
}

/**
 * Hides the floating drag indicator.
 */
function hideIndicator(immediately = false): void {
  if (!indicatorElement) return

  if (immediately) {
    indicatorElement.style.opacity = "0"
    indicatorElement.style.transform = "translate3d(-50%, -100%, 0) scale(0.92)"
    return
  }

  if (indicatorTimeoutId !== null) {
    window.clearTimeout(indicatorTimeoutId)
  }

  indicatorTimeoutId = window.setTimeout(() => {
    if (indicatorElement) {
      indicatorElement.style.opacity = "0"
      indicatorElement.style.transform =
        "translate3d(-50%, -100%, 0) scale(0.92)"
    }
    indicatorTimeoutId = null
  }, 180)
}

/**
 * Copies text to clipboard with fallback.
 */
async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    try {
      const textarea = document.createElement("textarea")
      textarea.value = text
      textarea.style.position = "fixed"
      textarea.style.opacity = "0"
      document.body.appendChild(textarea)
      textarea.select()
      const successful = document.execCommand("copy")
      document.body.removeChild(textarea)
      return successful
    } catch {
      return false
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
      payload: anchor.href
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

  const deltaX = event.clientX - activeSession.startX
  const deltaY = event.clientY - activeSession.startY
  const distance = Math.hypot(deltaX, deltaY)

  if (distance >= MIN_DRAG_DISTANCE && distance <= MAX_DRAG_DISTANCE) {
    const direction = getDragDirection(deltaX, deltaY)
    const action = getTargetAction(activeSession.type, direction)

    if (action === "none") {
      hideIndicator(true)
      return
    }

    const { label, icon, theme } = getActionDisplay(action, activeSession.type)
    updateIndicator(event.clientX, event.clientY, label, icon, theme)
  } else {
    hideIndicator(true)
  }
}

/**
 * Calculates vector distance, determines direction, and dispatches configured action.
 */
async function onDragEnd(event: DragEvent): Promise<void> {
  hideIndicator(true)
  if (!isActive || !activeSession) return

  const deltaX = event.clientX - activeSession.startX
  const deltaY = event.clientY - activeSession.startY
  const distance = Math.hypot(deltaX, deltaY)

  if (distance >= MIN_DRAG_DISTANCE && distance <= MAX_DRAG_DISTANCE) {
    const direction = getDragDirection(deltaX, deltaY)
    const action = getTargetAction(activeSession.type, direction)

    if (action === "copy_to_clipboard") {
      const payload =
        activeSession.type === "text"
          ? activeSession.payload
          : cleanUrl(activeSession.payload)
      await copyToClipboard(payload)
    } else if (action !== "none") {
      sendToBackground(MESSAGE_TYPES.SUPER_DRAG_EXECUTE_ACTION, {
        action,
        targetType: activeSession.type,
        payload: activeSession.payload
      }).catch(() => {})
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

  if (indicatorElement && indicatorElement.parentNode) {
    indicatorElement.parentNode.removeChild(indicatorElement)
    indicatorElement = null
  }
  if (indicatorTimeoutId !== null) {
    window.clearTimeout(indicatorTimeoutId)
    indicatorTimeoutId = null
  }

  activeSession = null
}
