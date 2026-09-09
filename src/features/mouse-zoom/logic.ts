import { removeContentToast, showContentToast } from "~core/toast"
import { DEFAULT_MOUSE_ZOOM_CONFIG, type MouseZoomConfig } from "~core/types"
import {
  registerWheelSubscriber,
  unregisterWheelSubscriber
} from "~core/wheelDispatcher"

let isActive = false
let currentConfig: MouseZoomConfig = { ...DEFAULT_MOUSE_ZOOM_CONFIG }

// Zoom parameters limits
const MIN_ZOOM = 0.5 // 50%
const MAX_ZOOM = 3.0 // 300%

let currentZoom = 1.0

let isLeftMouseDown = false
let isRightMouseDown = false
let suppressNextContextMenu = false
let didZoomWhileRightDown = false

/**
 * Checks if the configured modifier (key or mouse button) is pressed.
 */
function isModifierPressed(event: WheelEvent): boolean {
  switch (currentConfig.modifier) {
    case "shift":
      return event.shiftKey
    case "left-click":
      // Check event.buttons (1: primary/left) or mouse tracker
      return (event.buttons & 1) === 1 || isLeftMouseDown
    case "right-click":
      // Check event.buttons (2: secondary/right) or mouse tracker
      return (event.buttons & 2) === 2 || isRightMouseDown
    case "alt":
    default:
      return event.altKey
  }
}

const ZOOM_ICON_SVG = `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg>`

/**
 * Creates or updates a floating badge indicating the current zoom percentage.
 */
function showZoomToast(zoomLevel: number): void {
  if (!currentConfig.showToast) return

  const percent = Math.round(zoomLevel * 100)
  showContentToast({
    message: "Page Zoom",
    detail: `${percent}%`,
    type: "info",
    iconSvg: ZOOM_ICON_SVG,
    position: "top-right",
    duration: 1200
  })
}

/**
 * Applies the calculated zoom to the document body.
 */
function applyZoom(newZoom: number): void {
  currentZoom = Math.max(
    MIN_ZOOM,
    Math.min(MAX_ZOOM, Number(newZoom.toFixed(2)))
  )

  if (document.body) {
    if (currentConfig.smooth) {
      document.body.style.transition = "zoom 0.1s ease-out"
    } else {
      document.body.style.transition = "none"
    }

    if (currentZoom === 1.0) {
      document.body.style.removeProperty("zoom")
    } else {
      ;(document.body.style as unknown as { zoom: string }).zoom =
        currentZoom.toString()
    }
  }

  showZoomToast(currentZoom)
}

/**
 * Resets the zoom back to 100%.
 */
export function resetZoom(): void {
  currentZoom = 1.0
  if (document.body) {
    document.body.style.removeProperty("zoom")
    document.body.style.removeProperty("transition")
  }
  showZoomToast(1.0)
}

/**
 * Mouse button tracking to support Left Click & Right Click as zoom modifiers.
 */
function onMouseDown(event: MouseEvent): void {
  if (event.button === 0) {
    isLeftMouseDown = true
  } else if (event.button === 2) {
    isRightMouseDown = true
    didZoomWhileRightDown = false
  }
}

function onMouseUp(event: MouseEvent): void {
  if (event.button === 0) {
    isLeftMouseDown = false
  } else if (event.button === 2) {
    isRightMouseDown = false
    if (didZoomWhileRightDown) {
      suppressNextContextMenu = true
      // Reset suppress flag after short delay to not permanently block right clicks
      setTimeout(() => {
        suppressNextContextMenu = false
        didZoomWhileRightDown = false
      }, 50)
    }
  }
}

function onContextMenu(event: MouseEvent): void {
  if (suppressNextContextMenu || didZoomWhileRightDown) {
    event.preventDefault()
    event.stopPropagation()
    suppressNextContextMenu = false
    didZoomWhileRightDown = false
  }
}

/**
 * Wheel event handler for Modifier + Wheel zoom.
 * Returns true if the wheel event was consumed (modifier pressed), false otherwise.
 */
function onWheelDecision(event: WheelEvent): boolean {
  if (!isModifierPressed(event)) {
    return false
  }

  if (currentConfig.modifier === "right-click") {
    didZoomWhileRightDown = true
    suppressNextContextMenu = true
  }

  let direction = event.deltaY < 0 ? 1 : -1
  if (currentConfig.invertDirection) {
    direction = -direction
  }

  const nextZoom = currentZoom + direction * currentConfig.stepSize
  applyZoom(nextZoom)
  return true
}

/**
 * Hot updates runtime zoom config without reattaching listeners.
 */
export function updateMouseZoomConfig(config?: Partial<MouseZoomConfig>): void {
  if (!config) return
  currentConfig = { ...currentConfig, ...config }
}

/**
 * Activates the Mouse Pin-to-Zoom feature with optional custom configuration.
 */
export function activate(config?: MouseZoomConfig): void {
  if (config) {
    updateMouseZoomConfig(config)
  }

  if (isActive || typeof window === "undefined") return
  isActive = true

  registerWheelSubscriber({
    id: "mouse-zoom",
    priority: 50,
    handler: onWheelDecision
  })
  window.addEventListener("mousedown", onMouseDown, { capture: true })
  window.addEventListener("mouseup", onMouseUp, { capture: true })
  window.addEventListener("contextmenu", onContextMenu, { capture: true })
}

/**
 * Deactivates the Mouse Pin-to-Zoom feature, resets zoom, and cleans up elements.
 */
export function deactivate(): void {
  if (!isActive || typeof window === "undefined") return
  isActive = false

  unregisterWheelSubscriber("mouse-zoom")
  window.removeEventListener("mousedown", onMouseDown, true)
  window.removeEventListener("mouseup", onMouseUp, true)
  window.removeEventListener("contextmenu", onContextMenu, true)

  isLeftMouseDown = false
  isRightMouseDown = false
  suppressNextContextMenu = false
  didZoomWhileRightDown = false

  // Reset zoom back to normal
  if (document.body) {
    document.body.style.removeProperty("zoom")
    document.body.style.removeProperty("transition")
  }
  currentZoom = 1.0

  removeContentToast()
}
