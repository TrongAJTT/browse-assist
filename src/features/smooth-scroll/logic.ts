/**
 * Smooth Scrolling - Core Logic
 * Intercepts wheel events and smoothly interpolates scroll offsets using requestAnimationFrame
 * to deliver fluid, natural scrolling across web pages.
 */

import { SMOOTH_SCROLL_PRESETS, type SmoothScrollConfig } from "~core/types"

let isActive = false

// Animation & state tracking
let animationFrameId: number | null = null
let currentTargetElement: Element | Window = window
let targetScrollY = 0
let currentScrollY = 0

// Dynamic physics parameters
let activeConfig: SmoothScrollConfig = { ...SMOOTH_SCROLL_PRESETS.balanced }
const EPSILON = 0.5 // Threshold to stop animation loop

/**
 * Finds the nearest scrollable element under the cursor or defaults to window.
 */
function getScrollableContainer(target: EventTarget | null): Element | Window {
  if (!(target instanceof Element)) {
    return window
  }

  let node: Element | null = target
  while (node && node !== document.body && node !== document.documentElement) {
    const style = window.getComputedStyle(node)
    const overflowY = style.overflowY
    const canScroll =
      (overflowY === "auto" ||
        overflowY === "scroll" ||
        overflowY === "overlay") &&
      node.scrollHeight > node.clientHeight

    if (canScroll) {
      return node
    }
    node = node.parentElement
  }

  return window
}

/**
 * Retrieves the current vertical scroll position of a container.
 */
function getScrollPosition(target: Element | Window): number {
  if (target === window) {
    return (
      window.scrollY ||
      document.documentElement.scrollTop ||
      document.body.scrollTop ||
      0
    )
  }
  return (target as Element).scrollTop
}

/**
 * Retrieves the maximum scrollable vertical boundary of a container.
 */
function getMaxScrollPosition(target: Element | Window): number {
  if (target === window) {
    const doc = document.documentElement
    const body = document.body
    return Math.max(
      doc.scrollHeight - window.innerHeight,
      body ? body.scrollHeight - window.innerHeight : 0,
      0
    )
  }
  const el = target as Element
  return Math.max(el.scrollHeight - el.clientHeight, 0)
}

/**
 * Sets the vertical scroll position of a container.
 */
function setScrollPosition(target: Element | Window, y: number): void {
  if (target === window) {
    window.scrollTo({ top: y, behavior: "instant" as ScrollBehavior })
  } else {
    ;(target as Element).scrollTop = y
  }
}

/**
 * Animation loop applying easing interpolation.
 */
function updateScroll(): void {
  const diff = targetScrollY - currentScrollY

  if (Math.abs(diff) > EPSILON) {
    currentScrollY += diff * activeConfig.smoothness
    setScrollPosition(currentTargetElement, currentScrollY)
    animationFrameId = window.requestAnimationFrame(updateScroll)
  } else {
    // Snap to exact target and stop
    currentScrollY = targetScrollY
    setScrollPosition(currentTargetElement, currentScrollY)
    animationFrameId = null
  }
}

/**
 * Checks if the target element or its ancestors are interactive surfaces
 * (e.g. Canvas, Konva, SVG interactive viewports, code editors, maps).
 *
 * Relies on CSS heuristics rather than event.defaultPrevented because React synthetic
 * onWheel does NOT propagate preventDefault() to the underlying native DOM event.
 */
function isInteractiveSurface(target: EventTarget | null): boolean {
  if (!(target instanceof Element)) {
    return false
  }

  // 1. Tag / class name selector check for well-known frameworks
  const interactiveSelector = [
    "canvas",
    "[role='application']",
    ".konvajs-content",
    ".konvajs-content *",
    ".monaco-editor",
    ".CodeMirror",
    ".leaflet-container",
    "[data-canvas]",
    "[data-interactive-scroll]"
  ].join(",")

  if (target.closest(interactiveSelector) !== null) {
    return true
  }

  // 2. CSS cursor heuristic: design tools / canvas apps set cursor to crosshair, grab, zoom, etc.
  //    Walk up the DOM until we find a meaningful cursor or hit body.
  const interactiveCursors = new Set([
    "crosshair",
    "move",
    "grab",
    "grabbing",
    "zoom-in",
    "zoom-out",
    "cell",
    "copy",
    "none" // Some canvas apps hide cursor during interaction
  ])

  let node: Element | null = target
  while (node && node !== document.body && node !== document.documentElement) {
    const style = window.getComputedStyle(node)

    // Cursor style signals interactive drawing/design surface
    if (interactiveCursors.has(style.cursor)) {
      return true
    }

    // touch-action != 'auto' means the element explicitly manages its own scroll/pan behavior
    if (style.touchAction !== "auto" && style.touchAction !== "manipulation") {
      return true
    }

    node = node.parentElement
  }

  return false
}

/**
 * Wheel event listener.
 */
function onWheel(event: WheelEvent): void {
  // In smart mode, respect website's own default-prevention
  if (
    activeConfig.interceptionMode !== "aggressive" &&
    event.defaultPrevented
  ) {
    return
  }

  // Do not intercept if modifier keys are pressed (let mouse-zoom or browser pinch-zoom handle it)
  if (event.ctrlKey || event.altKey || event.shiftKey) {
    return
  }

  // In smart mode, skip canvases / interactive graphic applications (Konva, Figma, Maps, Code editors)
  if (
    activeConfig.interceptionMode !== "aggressive" &&
    isInteractiveSurface(event.target)
  ) {
    return
  }

  // Only handle pure vertical scrolling
  if (Math.abs(event.deltaX) > Math.abs(event.deltaY)) {
    return
  }

  const container = getScrollableContainer(event.target)
  const currentPos = getScrollPosition(container)
  const maxPos = getMaxScrollPosition(container)

  // If container cannot be scrolled, allow default
  if (maxPos <= 0) {
    return
  }

  const delta = event.deltaY * activeConfig.stepSize

  // If user scrolls up at top boundary or down at bottom boundary, don't hijack
  if ((currentPos <= 0 && delta < 0) || (currentPos >= maxPos && delta > 0)) {
    return
  }

  event.preventDefault()

  // If switching containers mid-scroll, reset current position
  if (container !== currentTargetElement || animationFrameId === null) {
    currentTargetElement = container
    currentScrollY = currentPos
    targetScrollY = currentPos
  }

  // Accumulate target scroll and clamp within bounds
  targetScrollY = Math.max(0, Math.min(maxPos, targetScrollY + delta))

  if (animationFrameId === null) {
    animationFrameId = window.requestAnimationFrame(updateScroll)
  }
}

/**
 * Cancels ongoing animation when user interacts directly (e.g. mousedown, keydown).
 */
function cancelAnimation(): void {
  if (animationFrameId !== null) {
    window.cancelAnimationFrame(animationFrameId)
    animationFrameId = null
  }
}

let registeredCapture = false

function attachWheelListener(useCapture: boolean): void {
  if (typeof window === "undefined") return
  if (registeredCapture !== useCapture) {
    window.removeEventListener("wheel", onWheel, registeredCapture)
  }
  registeredCapture = useCapture
  window.addEventListener("wheel", onWheel, {
    passive: false,
    capture: useCapture
  })
}

/**
 * Updates physics tuning on the fly.
 */
export function updateSmoothScrollConfig(
  config?: Partial<SmoothScrollConfig>
): void {
  if (config) {
    const prevMode = activeConfig.interceptionMode
    activeConfig = {
      ...activeConfig,
      ...config
    }

    if (
      isActive &&
      config.interceptionMode &&
      config.interceptionMode !== prevMode
    ) {
      attachWheelListener(config.interceptionMode === "aggressive")
    }
  }
}

/**
 * Activates the Smooth Scroll feature with optional initial config.
 */
export function activate(config?: SmoothScrollConfig): void {
  if (config) {
    updateSmoothScrollConfig(config)
  }

  if (isActive || typeof window === "undefined") return
  isActive = true

  const useCapture = activeConfig.interceptionMode === "aggressive"
  attachWheelListener(useCapture)

  window.addEventListener("mousedown", cancelAnimation, { passive: true })
  window.addEventListener("keydown", cancelAnimation, { passive: true })
  window.addEventListener("touchstart", cancelAnimation, { passive: true })
}

/**
 * Deactivates the Smooth Scroll feature and cleans up listeners and frames.
 */
export function deactivate(): void {
  if (!isActive || typeof window === "undefined") return
  isActive = false

  cancelAnimation()
  window.removeEventListener("wheel", onWheel, registeredCapture)
  window.removeEventListener("mousedown", cancelAnimation)
  window.removeEventListener("keydown", cancelAnimation)
  window.removeEventListener("touchstart", cancelAnimation)
}
