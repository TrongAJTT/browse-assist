import {
  DEFAULT_MOUSE_ZOOM_CONFIG,
  type MouseZoomConfig
} from "~core/types"

let isActive = false
let currentConfig: MouseZoomConfig = { ...DEFAULT_MOUSE_ZOOM_CONFIG }

// Zoom parameters limits
const MIN_ZOOM = 0.5 // 50%
const MAX_ZOOM = 3.0 // 300%

let currentZoom = 1.0
let toastElement: HTMLDivElement | null = null
let toastTimeoutId: number | null = null

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

/**
 * Creates or updates a floating badge indicating the current zoom percentage.
 */
function showZoomToast(zoomLevel: number): void {
  if (!currentConfig.showToast || typeof document === "undefined") return

  if (!toastElement) {
    toastElement = document.createElement("div")
    toastElement.id = "browse-assist-zoom-toast"
    toastElement.style.cssText = `
      position: fixed;
      top: 24px;
      right: 24px;
      z-index: 2147483647;
      background: rgba(15, 23, 42, 0.88);
      color: #f8fafc;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      font-size: 13px;
      font-weight: 600;
      padding: 6px 14px;
      border-radius: 9999px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
      border: 1px solid rgba(255, 255, 255, 0.15);
      pointer-events: none;
      transition: opacity 0.2s ease-in-out, transform 0.2s ease-in-out;
      opacity: 0;
      transform: translateY(-4px);
    `
    document.documentElement.appendChild(toastElement)
  }

  const percent = Math.round(zoomLevel * 100)
  toastElement.textContent = `Zoom: ${percent}%`
  toastElement.style.opacity = "1"
  toastElement.style.transform = "translateY(0)"

  if (toastTimeoutId !== null) {
    window.clearTimeout(toastTimeoutId)
  }

  toastTimeoutId = window.setTimeout(() => {
    if (toastElement) {
      toastElement.style.opacity = "0"
      toastElement.style.transform = "translateY(-4px)"
    }
    toastTimeoutId = null
  }, 1200)
}

/**
 * Applies the calculated zoom to the document body.
 */
function applyZoom(newZoom: number): void {
  currentZoom = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, Number(newZoom.toFixed(2))))

  if (document.body) {
    if (currentConfig.smooth) {
      document.body.style.transition = "zoom 0.1s ease-out"
    } else {
      document.body.style.transition = "none"
    }

    if (currentZoom === 1.0) {
      document.body.style.removeProperty("zoom")
    } else {
      ;(document.body.style as unknown as { zoom: string }).zoom = currentZoom.toString()
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
 */
function onWheel(event: WheelEvent): void {
  if (!isModifierPressed(event)) {
    return
  }

  // Prevent default scroll behavior and text selection during zoom
  event.preventDefault()
  event.stopPropagation()

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
}

/**
 * Keyboard shortcuts to reset zoom.
 * Alt + 0 or Shift + 0 depending on key modifier, or universally Alt + 0.
 */
function onKeyDown(event: KeyboardEvent): void {
  if (event.key === "0" || event.code === "Digit0") {
    const isModifier =
      (currentConfig.modifier === "shift" && event.shiftKey) ||
      event.altKey // Always allow Alt + 0 as fallback reset
    if (isModifier) {
      event.preventDefault()
      resetZoom()
    }
  }
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

  window.addEventListener("wheel", onWheel, { passive: false, capture: true })
  window.addEventListener("keydown", onKeyDown, { capture: true })
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

  window.removeEventListener("wheel", onWheel, true)
  window.removeEventListener("keydown", onKeyDown, true)
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

  if (toastElement && toastElement.parentNode) {
    toastElement.parentNode.removeChild(toastElement)
    toastElement = null
  }
  if (toastTimeoutId !== null) {
    window.clearTimeout(toastTimeoutId)
    toastTimeoutId = null
  }
}

