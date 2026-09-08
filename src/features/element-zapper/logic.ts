/**
 * Element Zapper - Content Script DOM Logic
 * Allows users to hover over unwanted elements with a visible red dashed box and badge,
 * and click to remove the element immediately from the DOM.
 * Also intelligently unfreezes body/html scroll lock if an overlay was removed.
 */

import { showContentToast } from "~core/toast"
import {
  DEFAULT_ELEMENT_ZAPPER_CONFIG,
  type ElementZapperConfig
} from "~core/types"

let isActive = false
let isZappingMode = false
let currentConfig: ElementZapperConfig = DEFAULT_ELEMENT_ZAPPER_CONFIG

// UI Overlay DOM references
let overlayContainer: HTMLDivElement | null = null
let highlightBox: HTMLDivElement | null = null
let tagBadge: HTMLDivElement | null = null
let currentHoveredElement: HTMLElement | null = null

const ZAPPER_CONTAINER_ID = "__browse_assist_zapper_container__"
const ZAP_ICON_SVG = `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>`

/**
 * Creates the non-intrusive highlighter elements in a dedicated overlay container.
 */
function ensureOverlayContainer(): void {
  if (overlayContainer && document.body.contains(overlayContainer)) {
    return
  }

  overlayContainer = document.createElement("div")
  overlayContainer.id = ZAPPER_CONTAINER_ID
  overlayContainer.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    pointer-events: none;
    z-index: 2147483647;
    display: none;
  `

  highlightBox = document.createElement("div")
  highlightBox.style.cssText = `
    position: fixed;
    pointer-events: none;
    border: 2px dashed #ef4444;
    background-color: rgba(239, 68, 68, 0.15);
    box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.3), inset 0 0 12px rgba(239, 68, 68, 0.25);
    border-radius: 4px;
    transition: top 0.06s ease-out, left 0.06s ease-out, width 0.06s ease-out, height 0.06s ease-out;
    box-sizing: border-box;
    display: none;
  `

  tagBadge = document.createElement("div")
  tagBadge.style.cssText = `
    position: absolute;
    top: -24px;
    left: 0;
    background: #18181b;
    color: #ef4444;
    border: 1px solid rgba(239, 68, 68, 0.5);
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
    font-size: 11px;
    font-weight: 600;
    padding: 2px 8px;
    border-radius: 4px;
    white-space: nowrap;
    pointer-events: none;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    gap: 4px;
  `

  highlightBox.appendChild(tagBadge)
  overlayContainer.appendChild(highlightBox)
  document.documentElement.appendChild(overlayContainer)
}

/**
 * Builds a readable descriptor for an element (e.g. "div#cookie-banner.modal").
 */
function getElementDescriptor(el: HTMLElement): string {
  const tagName = el.tagName.toLowerCase()
  const idStr = el.id ? `#${el.id.slice(0, 18)}` : ""
  let classStr = ""
  if (typeof el.className === "string" && el.className.trim()) {
    const firstClass = el.className.trim().split(/\s+/)[0]
    if (firstClass && !firstClass.startsWith("__browse_assist")) {
      classStr = `.${firstClass.slice(0, 18)}`
    }
  }
  return `${tagName}${idStr}${classStr}`
}

/**
 * Updates the highlight box position to tightly wrap the target element.
 */
function updateHighlight(target: HTMLElement | null): void {
  if (!highlightBox || !tagBadge || !overlayContainer) return

  if (
    !target ||
    target === document.body ||
    target === document.documentElement
  ) {
    highlightBox.style.display = "none"
    currentHoveredElement = null
    return
  }

  // Do not target internal extension elements
  if (
    target.id === ZAPPER_CONTAINER_ID ||
    target.closest(`#${ZAPPER_CONTAINER_ID}`) ||
    target.closest("[data-browse-assist-internal]")
  ) {
    highlightBox.style.display = "none"
    currentHoveredElement = null
    return
  }

  currentHoveredElement = target
  const rect = target.getBoundingClientRect()

  // Ensure highlight box is visible and positioned
  highlightBox.style.display = "block"
  highlightBox.style.top = `${rect.top}px`
  highlightBox.style.left = `${rect.left}px`
  highlightBox.style.width = `${Math.max(rect.width, 10)}px`
  highlightBox.style.height = `${Math.max(rect.height, 10)}px`

  // Badge position: show below if near top of window
  if (rect.top < 28) {
    tagBadge.style.top = "auto"
    tagBadge.style.bottom = "-24px"
  } else {
    tagBadge.style.top = "-24px"
    tagBadge.style.bottom = "auto"
  }

  const desc = getElementDescriptor(target)
  tagBadge.textContent = `<${desc}> (Click to zap)`
}

/**
 * Checks and unfreezes body/html scroll lock if an overlay or modal was removed.
 */
function unfreezeScrollLock(): void {
  try {
    const targets = [document.body, document.documentElement]
    let unfrozen = false

    targets.forEach((el) => {
      if (!el) return
      const style = window.getComputedStyle(el)
      if (style.overflow === "hidden" || style.overflowY === "hidden") {
        el.style.setProperty("overflow", "auto", "important")
        el.style.setProperty("overflow-y", "auto", "important")
        unfrozen = true
      }
      if (style.position === "fixed") {
        el.style.setProperty("position", "static", "important")
        unfrozen = true
      }
    })

    if (unfrozen && currentConfig.showToast) {
      showContentToast({
        message: "Page Scroll Unfrozen",
        detail: "overflow: auto restored",
        type: "info",
        duration: 2000
      })
    }
  } catch {
    // Ignore any style reset error
  }
}

/**
 * Handles pointer movement across the page during zapper mode.
 */
function onPointerMove(e: PointerEvent): void {
  if (!isZappingMode) return
  const target = document.elementFromPoint(
    e.clientX,
    e.clientY
  ) as HTMLElement | null
  updateHighlight(target)
}

/**
 * Handles click event to zap the currently hovered element.
 */
function onClickCapture(e: MouseEvent): void {
  if (!isZappingMode) return

  // Prevent following links, submitting forms, or bubbling
  e.preventDefault()
  e.stopPropagation()
  e.stopImmediatePropagation()

  const target = currentHoveredElement
  if (!target) {
    stopZapping(false)
    return
  }

  // Don't zap body or html directly
  if (target === document.body || target === document.documentElement) {
    stopZapping(false)
    return
  }

  const desc = getElementDescriptor(target)
  const isPotentialModal =
    window.getComputedStyle(target).position === "fixed" ||
    window.getComputedStyle(target).position === "absolute"

  try {
    target.remove()
  } catch {
    target.style.display = "none"
  }

  // Automatically unfreeze scroll if enabled and removing modal/fixed element
  if (currentConfig.autoUnfreezeScroll && isPotentialModal) {
    unfreezeScrollLock()
  }

  if (currentConfig.showToast) {
    showContentToast({
      message: "Element Zapped!",
      detail: `<${desc}>`,
      type: "success",
      iconSvg: ZAP_ICON_SVG,
      duration: 2200
    })
  }

  stopZapping(true)
}

/**
 * Handles keyboard cancel (Escape).
 */
function onKeyDown(e: KeyboardEvent): void {
  if (!isZappingMode) return
  if (e.key === "Escape") {
    e.preventDefault()
    e.stopPropagation()
    stopZapping(false)
    if (currentConfig.showToast) {
      showContentToast({
        message: "Zapper Cancelled",
        type: "info",
        duration: 1500
      })
    }
  }
}

/**
 * Handles right-click cancel.
 */
function onContextMenu(e: MouseEvent): void {
  if (!isZappingMode) return
  e.preventDefault()
  e.stopPropagation()
  stopZapping(false)
}

/**
 * Starts the Element Zapper interaction mode on the active page.
 */
export function startZapping(): void {
  if (!isActive || isZappingMode) return
  isZappingMode = true

  ensureOverlayContainer()
  if (overlayContainer) {
    overlayContainer.style.display = "block"
  }

  // Attach high-priority capture listeners
  window.addEventListener("pointermove", onPointerMove, {
    capture: true,
    passive: true
  })
  window.addEventListener("click", onClickCapture, { capture: true })
  window.addEventListener("mousedown", onClickCapture, { capture: true })
  window.addEventListener("keydown", onKeyDown, { capture: true })
  window.addEventListener("contextmenu", onContextMenu, { capture: true })

  // Cursor change for feedback
  document.documentElement.style.cursor = "crosshair"

  if (currentConfig.showToast) {
    showContentToast({
      message: "Element Zapper Active",
      detail: "Click an element to remove • Esc to cancel",
      type: "info",
      iconSvg: ZAP_ICON_SVG,
      duration: 2500
    })
  }
}

/**
 * Stops the Element Zapper mode and restores standard page interaction.
 */
export function stopZapping(_zapped = false): void {
  if (!isZappingMode) return
  isZappingMode = false

  window.removeEventListener("pointermove", onPointerMove, { capture: true })
  window.removeEventListener("click", onClickCapture, { capture: true })
  window.removeEventListener("mousedown", onClickCapture, { capture: true })
  window.removeEventListener("keydown", onKeyDown, { capture: true })
  window.removeEventListener("contextmenu", onContextMenu, { capture: true })

  document.documentElement.style.cursor = ""

  if (highlightBox) {
    highlightBox.style.display = "none"
  }
  if (overlayContainer) {
    overlayContainer.style.display = "none"
  }
  currentHoveredElement = null
}

/**
 * Activates Element Zapper feature listeners.
 */
export function activate(config?: ElementZapperConfig): void {
  if (config) {
    currentConfig = { ...DEFAULT_ELEMENT_ZAPPER_CONFIG, ...config }
  }
  isActive = true
}

/**
 * Deactivates Element Zapper and cleans up all mode state.
 */
export function deactivate(): void {
  isActive = false
  stopZapping(false)

  if (overlayContainer && overlayContainer.parentNode) {
    overlayContainer.parentNode.removeChild(overlayContainer)
    overlayContainer = null
    highlightBox = null
    tagBadge = null
  }
}
