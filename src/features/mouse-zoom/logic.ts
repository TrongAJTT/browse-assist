/**
 * Mouse Pin-to-Zoom - Core Logic
 * Allows users to effortlessly zoom in and out of the webpage around the cursor position
 * by holding the Alt key and rotating the mouse wheel.
 */

let isActive = false

// Zoom parameters
const MIN_ZOOM = 0.5 // 50%
const MAX_ZOOM = 3.0 // 300%
const ZOOM_STEP = 0.1 // 10% step

let currentZoom = 1.0
let toastElement: HTMLDivElement | null = null
let toastTimeoutId: number | null = null

/**
 * Creates or updates a floating badge indicating the current zoom percentage.
 */
function showZoomToast(zoomLevel: number): void {
  if (typeof document === "undefined") return

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
  }
  showZoomToast(1.0)
}

/**
 * Wheel event handler for Alt + Wheel zoom.
 */
function onWheel(event: WheelEvent): void {
  // Only trigger when Alt key is held
  if (!event.altKey) {
    return
  }

  event.preventDefault()
  event.stopPropagation()

  const direction = event.deltaY < 0 ? 1 : -1
  const nextZoom = currentZoom + direction * ZOOM_STEP

  applyZoom(nextZoom)
}

/**
 * Keyboard shortcuts to reset zoom (Alt + 0).
 */
function onKeyDown(event: KeyboardEvent): void {
  if (event.altKey && (event.key === "0" || event.code === "Digit0")) {
    event.preventDefault()
    resetZoom()
  }
}

/**
 * Activates the Mouse Pin-to-Zoom feature.
 */
export function activate(): void {
  if (isActive || typeof window === "undefined") return
  isActive = true

  window.addEventListener("wheel", onWheel, { passive: false, capture: true })
  window.addEventListener("keydown", onKeyDown, { capture: true })
}

/**
 * Deactivates the Mouse Pin-to-Zoom feature, resets zoom, and cleans up elements.
 */
export function deactivate(): void {
  if (!isActive || typeof window === "undefined") return
  isActive = false

  window.removeEventListener("wheel", onWheel, true)
  window.removeEventListener("keydown", onKeyDown, true)

  // Reset zoom back to normal
  if (document.body) {
    document.body.style.removeProperty("zoom")
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
