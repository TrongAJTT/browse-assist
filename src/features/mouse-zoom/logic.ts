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
const ANIMATION_DURATION = 140 // ms for smooth fluid transitions

let currentZoom = 1.0
let targetZoom = 1.0

// Interpolation / RAF state
let animFrameId: number | null = null
let animStartTime = 0
let animStartZoom = 1.0
let anchorContentX = 0
let anchorContentY = 0
let anchorMouseX = 0
let anchorMouseY = 0

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
 * Safely scrolls window to target coordinates without triggering unwanted smooth scroll interference.
 */
function safeScrollTo(x: number, y: number): void {
  try {
    window.scrollTo({
      left: x,
      top: y,
      behavior: "instant"
    })
  } catch {
    window.scrollTo(x, y)
  }
}

/**
 * Applies immediate zoom and scroll compensation pinned to (mouseX, mouseY).
 */
function applyZoomInstant(
  newZoom: number,
  mouseX: number,
  mouseY: number
): void {
  if (animFrameId !== null) {
    cancelAnimationFrame(animFrameId)
    animFrameId = null
  }

  const oldZoom = currentZoom
  const clampedZoom = Math.max(
    MIN_ZOOM,
    Math.min(MAX_ZOOM, Number(newZoom.toFixed(2)))
  )
  if (Math.abs(clampedZoom - oldZoom) < 0.001) return

  const scrollX = window.scrollX ?? window.pageXOffset ?? 0
  const scrollY = window.scrollY ?? window.pageYOffset ?? 0

  // The content coordinate located under the mouse pointer
  const contentX = (scrollX + mouseX) / oldZoom
  const contentY = (scrollY + mouseY) / oldZoom

  currentZoom = clampedZoom
  targetZoom = clampedZoom

  if (document.body) {
    document.body.style.transition = "none"
    if (currentZoom === 1.0) {
      document.body.style.removeProperty("zoom")
    } else {
      ;(document.body.style as unknown as { zoom: string }).zoom =
        currentZoom.toString()
    }
  }

  // Pin point under mouse by compensating scroll offset
  const targetScrollX = Math.max(0, Math.round(contentX * currentZoom - mouseX))
  const targetScrollY = Math.max(0, Math.round(contentY * currentZoom - mouseY))
  safeScrollTo(targetScrollX, targetScrollY)

  showZoomToast(currentZoom)
}

/**
 * RAF step handler for smooth zoom & scroll interpolation.
 */
function stepSmoothAnim(now: number): void {
  const elapsed = now - animStartTime
  const progress = Math.min(1, elapsed / ANIMATION_DURATION)
  // Cubic ease-out for snappy, responsive feel
  const ease = 1 - Math.pow(1 - progress, 3)

  const nextZoom = animStartZoom + (targetZoom - animStartZoom) * ease
  currentZoom = Number(nextZoom.toFixed(3))

  if (document.body) {
    document.body.style.transition = "none"
    if (Math.abs(currentZoom - 1.0) < 0.005 && progress >= 1) {
      document.body.style.removeProperty("zoom")
      currentZoom = 1.0
    } else {
      ;(document.body.style as unknown as { zoom: string }).zoom =
        currentZoom.toString()
    }
  }

  // Scroll compensation in exact sync with current interpolated zoom
  const targetScrollX = Math.max(
    0,
    Math.round(anchorContentX * currentZoom - anchorMouseX)
  )
  const targetScrollY = Math.max(
    0,
    Math.round(anchorContentY * currentZoom - anchorMouseY)
  )
  safeScrollTo(targetScrollX, targetScrollY)

  if (progress < 1) {
    animFrameId = requestAnimationFrame(stepSmoothAnim)
  } else {
    animFrameId = null
    currentZoom = targetZoom
    if (currentZoom === 1.0 && document.body) {
      document.body.style.removeProperty("zoom")
    }
  }
}

/**
 * Initiates or chains smooth zoom interpolation pinned to (mouseX, mouseY).
 */
function applyZoomSmooth(
  nextTargetZoom: number,
  mouseX: number,
  mouseY: number
): void {
  const scrollX = window.scrollX ?? window.pageXOffset ?? 0
  const scrollY = window.scrollY ?? window.pageYOffset ?? 0

  // Anchor content coordinate under mouse cursor at current rendered zoom
  anchorContentX = (scrollX + mouseX) / currentZoom
  anchorContentY = (scrollY + mouseY) / currentZoom
  anchorMouseX = mouseX
  anchorMouseY = mouseY

  animStartZoom = currentZoom
  animStartTime = performance.now()
  targetZoom = Math.max(
    MIN_ZOOM,
    Math.min(MAX_ZOOM, Number(nextTargetZoom.toFixed(2)))
  )

  showZoomToast(targetZoom)

  if (animFrameId === null) {
    animFrameId = requestAnimationFrame(stepSmoothAnim)
  }
}

/**
 * Resets the zoom back to 100%.
 */
export function resetZoom(): void {
  if (animFrameId !== null) {
    cancelAnimationFrame(animFrameId)
    animFrameId = null
  }
  currentZoom = 1.0
  targetZoom = 1.0
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

function onBlur(): void {
  isLeftMouseDown = false
  isRightMouseDown = false
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

  const nextTarget = targetZoom + direction * currentConfig.stepSize

  if (currentConfig.smooth) {
    applyZoomSmooth(nextTarget, event.clientX, event.clientY)
  } else {
    applyZoomInstant(nextTarget, event.clientX, event.clientY)
  }

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
  window.addEventListener("blur", onBlur)
}

/**
 * Deactivates the Mouse Pin-to-Zoom feature, resets zoom, and cleans up elements.
 */
export function deactivate(): void {
  if (!isActive || typeof window === "undefined") return
  isActive = false

  if (animFrameId !== null) {
    cancelAnimationFrame(animFrameId)
    animFrameId = null
  }

  unregisterWheelSubscriber("mouse-zoom")
  window.removeEventListener("mousedown", onMouseDown, true)
  window.removeEventListener("mouseup", onMouseUp, true)
  window.removeEventListener("contextmenu", onContextMenu, true)
  window.removeEventListener("blur", onBlur)

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
  targetZoom = 1.0

  removeContentToast()
}
