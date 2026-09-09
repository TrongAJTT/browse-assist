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

// ---------------------------------------------------------------------------
// Caches — WeakMap keys are GC'd automatically when elements are removed from DOM
// ---------------------------------------------------------------------------

/**
 * Cache: element → nearest scrollable ancestor (or window sentinel).
 * Invalidated when the element is first encountered or re-entered after a container switch.
 */
const scrollableContainerCache = new WeakMap<Element, Element | Window>()

/**
 * Cache: element → whether it is an interactive surface that should be ignored.
 * Result is stable for any given element subtree so we never need to re-compute.
 */
const interactiveSurfaceCache = new WeakMap<Element, boolean>()

// ---------------------------------------------------------------------------
// Static constants hoisted out of per-event paths
// ---------------------------------------------------------------------------

const INTERACTIVE_SELECTOR = [
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

const INTERACTIVE_CURSORS = new Set([
  "crosshair",
  "move",
  "grab",
  "grabbing",
  "zoom-in",
  "zoom-out",
  "cell",
  "copy",
  "none"
])

// ---------------------------------------------------------------------------
// Core helpers
// ---------------------------------------------------------------------------

/**
 * Finds the nearest scrollable element under the cursor or defaults to window.
 * Result is cached per element to avoid repeated DOM traversal + getComputedStyle.
 */
function getScrollableContainer(target: EventTarget | null): Element | Window {
  if (!(target instanceof Element)) {
    return window
  }

  const cached = scrollableContainerCache.get(target)
  if (cached !== undefined) return cached

  let node: Element | null = target
  while (node && node !== document.body && node !== document.documentElement) {
    const overflowY = window.getComputedStyle(node).overflowY
    const canScroll =
      (overflowY === "auto" ||
        overflowY === "scroll" ||
        overflowY === "overlay") &&
      node.scrollHeight > node.clientHeight

    if (canScroll) {
      scrollableContainerCache.set(target, node)
      return node
    }
    node = node.parentElement
  }

  scrollableContainerCache.set(target, window)
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
    window.dispatchEvent(new CustomEvent("browse-assist:smooth-scroll-end"))
  }
}

/**
 * Checks if the target element or its ancestors are interactive surfaces
 * (e.g. Canvas, Konva, SVG interactive viewports, code editors, maps).
 *
 * Result is cached per element — the check is structurally stable for any element
 * (moving a canvas around the DOM is not a use case we need to handle).
 *
 * Relies on CSS heuristics rather than event.defaultPrevented because React synthetic
 * onWheel does NOT propagate preventDefault() to the underlying native DOM event.
 */
function isInteractiveSurface(target: EventTarget | null): boolean {
  if (!(target instanceof Element)) {
    return false
  }

  const cached = interactiveSurfaceCache.get(target)
  if (cached !== undefined) return cached

  // 1. Tag / class name selector check for well-known frameworks
  if (target.closest(INTERACTIVE_SELECTOR) !== null) {
    interactiveSurfaceCache.set(target, true)
    return true
  }

  // 2. CSS cursor / touch-action heuristic: walk up DOM once per unique element
  let node: Element | null = target
  while (node && node !== document.body && node !== document.documentElement) {
    const style = window.getComputedStyle(node)

    if (INTERACTIVE_CURSORS.has(style.cursor)) {
      interactiveSurfaceCache.set(target, true)
      return true
    }

    if (style.touchAction !== "auto" && style.touchAction !== "manipulation") {
      interactiveSurfaceCache.set(target, true)
      return true
    }

    node = node.parentElement
  }

  interactiveSurfaceCache.set(target, false)
  return false
}

// ---------------------------------------------------------------------------
// Wheel event handler
// ---------------------------------------------------------------------------

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

  // Only handle pure vertical scrolling
  if (Math.abs(event.deltaX) > Math.abs(event.deltaY)) {
    return
  }

  // In smart mode, skip canvases / interactive graphic applications (Konva, Figma, Maps, Code editors)
  // NOTE: moved after deltaX guard to avoid running expensive DOM check on horizontal scrolls
  if (
    activeConfig.interceptionMode !== "aggressive" &&
    isInteractiveSurface(event.target)
  ) {
    return
  }

  const container = getScrollableContainer(event.target)
  const currentPos = getScrollPosition(container)
  const maxPos = getMaxScrollPosition(container)

  // If container cannot be scrolled, allow default
  if (maxPos <= 0) {
    return
  }

  // Normalize deltaY: LINE mode (deltaMode=1) → multiply by ~20px; PAGE mode (2) → viewport height
  let rawDelta = event.deltaY
  if (event.deltaMode === 1) {
    rawDelta *= 20
  } else if (event.deltaMode === 2) {
    rawDelta *= window.innerHeight
  }

  const delta = rawDelta * activeConfig.stepSize

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
    window.dispatchEvent(new CustomEvent("browse-assist:smooth-scroll-start"))
    animationFrameId = window.requestAnimationFrame(updateScroll)
  }
}

// ---------------------------------------------------------------------------
// Animation control
// ---------------------------------------------------------------------------

/**
 * Cancels ongoing animation when user interacts directly (e.g. mousedown, keydown).
 */
function cancelAnimation(): void {
  if (animationFrameId !== null) {
    window.cancelAnimationFrame(animationFrameId)
    animationFrameId = null
    window.dispatchEvent(new CustomEvent("browse-assist:smooth-scroll-end"))
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

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

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
  window.addEventListener("browse-assist:cancel-scroll", cancelAnimation)
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
  window.removeEventListener("browse-assist:cancel-scroll", cancelAnimation)
}
