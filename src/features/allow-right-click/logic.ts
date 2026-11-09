/**
 * Allow Right Click - Core Logic
 * Restores right-click context menus, text selection, and clipboard operations
 * on websites that attempt to disable or restrict them via JavaScript or CSS.
 */

import { showContentToast } from "~core/toast"

let isActive = false
let styleElement: HTMLStyleElement | null = null

// Events commonly intercepted by websites to block right-click and selection
const RESTRICTED_EVENTS = [
  "contextmenu",
  "copy",
  "cut",
  "paste",
  "selectstart",
  "dragstart",
  "mousedown",
  "mouseup"
] as const

/**
 * Capture-phase event handler to stop malicious web scripts from blocking user actions.
 */
function handleRestrictedEvent(event: Event): void {
  // Only stop propagation for contextmenu, selectstart, copy, cut, dragstart unconditionally
  if (
    event.type === "contextmenu" ||
    event.type === "selectstart" ||
    event.type === "copy" ||
    event.type === "cut" ||
    event.type === "dragstart"
  ) {
    event.stopPropagation()
  }

  // For mouse buttons, only intervene if right mouse button (button === 2)
  if (event instanceof MouseEvent && event.button === 2) {
    event.stopPropagation()
  }
}

/**
 * Injects CSS rules to override user-select and pointer-events restrictions.
 */
function injectSelectionStyles(): void {
  if (styleElement || typeof document === "undefined") return

  styleElement = document.createElement("style")
  styleElement.id = "browse-assist-allow-right-click-styles"
  styleElement.textContent = `
    *, *::before, *::after {
      -webkit-user-select: auto !important;
      -moz-user-select: auto !important;
      -ms-user-select: auto !important;
      user-select: auto !important;
    }
  `
  ;(document.head || document.documentElement).appendChild(styleElement)
}

/**
 * Removes previously injected override styles.
 */
function removeSelectionStyles(): void {
  if (styleElement && styleElement.parentNode) {
    styleElement.parentNode.removeChild(styleElement)
    styleElement = null
  }
}

/**
 * Clears inline event handlers often assigned directly on DOM elements.
 */
function clearInlineHandlers(): void {
  try {
    document.oncontextmenu = null
    document.onselectstart = null
    document.ondragstart = null
    document.oncopy = null
    document.oncut = null

    if (document.body) {
      document.body.oncontextmenu = null
      document.body.onselectstart = null
      document.body.ondragstart = null
      document.body.oncopy = null
      document.body.oncut = null
    }
  } catch {
    // Ignore restricted cross-origin frames or read-only documents
  }
}

/**
 * Activates the Allow Right Click feature.
 */
export function activate(): void {
  if (isActive || typeof window === "undefined") return
  isActive = true

  // Register listeners in the capture phase to intercept before page scripts
  RESTRICTED_EVENTS.forEach((eventType) => {
    window.addEventListener(eventType, handleRestrictedEvent, true)
  })

  injectSelectionStyles()
  clearInlineHandlers()
}

/**
 * Deactivates the Allow Right Click feature and cleans up listeners and styles.
 */
export function deactivate(): void {
  if (!isActive || typeof window === "undefined") return
  isActive = false

  RESTRICTED_EVENTS.forEach((eventType) => {
    window.removeEventListener(eventType, handleRestrictedEvent, true)
  })

  removeSelectionStyles()
}

const RIGHT_CLICK_ICON_SVG = `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 3 7.07 16.97 2.51-7.39 7.39-2.51L3 3z"/><path d="m13 13 6 6"/></svg>`

/**
 * Returns current activation status in the current tab session.
 */
export function isRightClickActive(): boolean {
  return isActive
}

/**
 * Toggles Allow Right Click on demand and displays a feedback toast.
 */
export function toggleRightClick(showFeedback = true): boolean {
  if (isActive) {
    deactivate()
    if (showFeedback) {
      showContentToast({
        message: "Right Click Disabled",
        detail: "Current Tab",
        type: "info",
        iconSvg: RIGHT_CLICK_ICON_SVG,
        position: "bottom-right",
        duration: 1600
      })
    }
  } else {
    activate()
    if (showFeedback) {
      showContentToast({
        message: "Right Click Enabled",
        detail: "Current Tab",
        type: "success",
        iconSvg: RIGHT_CLICK_ICON_SVG,
        position: "bottom-right",
        duration: 1800
      })
    }
  }
  return isActive
}
