/**
 * Shared Video Element Detection Utilities
 * Provides resilient, multi-layered DOM penetration to detect video elements under cursor
 * across complex players (YouTube, Facebook, X/Twitter, TikTok, Netflix, custom web players).
 */

let lastKnownHoveredVideo: HTMLVideoElement | null = null

/**
 * Common selectors for player containers that wrap `<video>` elements.
 */
const PLAYER_CONTAINER_SELECTORS = [
  ".html5-video-player",
  ".video-player",
  "[data-player]",
  ".player-container",
  "video-player",
  "[data-testid*='video']",
  "[aria-label*='video']",
  "div[role='region']"
].join(", ")

export interface FindVideoOptions {
  clientX: number
  clientY: number
  target?: EventTarget | null
  minWidth?: number
  minHeight?: number
}

/**
 * Finds the target HTMLVideoElement under the cursor using a 6-step penetration strategy.
 *
 * Strategy:
 * 1. Direct `<video>` element target.
 * 2. Child `<video>` within event target.
 * 3. Nearest player container or parent tree lookup.
 * 4. Multi-layer depth scan via `document.elementsFromPoint` (bypasses transparent click-shields).
 * 5. Bounding-rect hit testing across all `<video>` elements currently on the page.
 * 6. Last-known hovered video fallback if cursor remains within its bounding-box.
 */
export function findVideoAtCoordinates({
  clientX,
  clientY,
  target,
  minWidth = 0,
  minHeight = 0
}: FindVideoOptions): HTMLVideoElement | null {
  const htmlTarget = target as HTMLElement | null

  // 1. Direct <video> tag
  if (htmlTarget && htmlTarget.tagName.toLowerCase() === "video") {
    const v = htmlTarget as HTMLVideoElement
    if (isVisibleAndValidSize(v, minWidth, minHeight) && isPointInsideElement(clientX, clientY, v)) {
      lastKnownHoveredVideo = v
      return v
    }
  }

  // 2. Child <video> inside target
  if (htmlTarget) {
    const directChild = htmlTarget.querySelector("video")
    if (
      directChild &&
      isVisibleAndValidSize(directChild, minWidth, minHeight) &&
      isPointInsideElement(clientX, clientY, directChild)
    ) {
      lastKnownHoveredVideo = directChild
      return directChild
    }

    // 3. Look up video in common player containers or parent tree
    const container = htmlTarget.closest(PLAYER_CONTAINER_SELECTORS)
    if (container) {
      const video = container.querySelector("video")
      if (
        video &&
        isVisibleAndValidSize(video, minWidth, minHeight) &&
        isPointInsideElement(clientX, clientY, video)
      ) {
        lastKnownHoveredVideo = video
        return video
      }
    }
  }

  // 4. Multi-layer depth scan via elementsFromPoint
  // Facebook, X (Twitter), and TikTok place transparent click-interception layers on top
  if (typeof document.elementsFromPoint === "function") {
    const elements = document.elementsFromPoint(clientX, clientY)
    for (const el of elements) {
      if (el.tagName.toLowerCase() === "video") {
        const v = el as HTMLVideoElement
        if (isVisibleAndValidSize(v, minWidth, minHeight)) {
          lastKnownHoveredVideo = v
          return v
        }
      }
      const video = el.querySelector("video")
      if (video && isVisibleAndValidSize(video, minWidth, minHeight) && isPointInsideElement(clientX, clientY, video)) {
        lastKnownHoveredVideo = video
        return video
      }
    }
  }

  // 5. Fallback only if elementsFromPoint hit a container of a video AND point is inside that video
  if (htmlTarget) {
    const container = htmlTarget.closest(PLAYER_CONTAINER_SELECTORS)
    if (container) {
      const video = container.querySelector("video")
      if (
        video &&
        isVisibleAndValidSize(video, minWidth, minHeight) &&
        isPointInsideElement(clientX, clientY, video)
      ) {
        lastKnownHoveredVideo = video
        return video
      }
    }
  }

  return null
}

/**
 * Checks if a video meets the minimum dimension requirements and is truly visible.
 */
function isVisibleAndValidSize(
  video: HTMLVideoElement,
  minWidth: number,
  minHeight: number
): boolean {
  const rect = video.getBoundingClientRect()
  if (rect.width <= 0 || rect.height <= 0) return false
  if (minWidth > 0 && rect.width < minWidth) return false
  if (minHeight > 0 && rect.height < minHeight) return false

  // Ensure video is not completely outside viewport
  if (
    rect.bottom <= 0 ||
    rect.top >= window.innerHeight ||
    rect.right <= 0 ||
    rect.left >= window.innerWidth
  ) {
    return false
  }

  const style = window.getComputedStyle(video)
  if (style.display === "none" || style.visibility === "hidden" || style.opacity === "0") {
    return false
  }

  return true
}

/**
 * Checks if client coordinates (x, y) fall within an element's bounding rect.
 */
function isPointInsideElement(x: number, y: number, element: Element): boolean {
  const rect = element.getBoundingClientRect()
  return x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom
}

/**
 * Resets the cached last known hovered video.
 */
export function clearLastKnownHoveredVideo(): void {
  lastKnownHoveredVideo = null
}

/**
 * Returns the cached last known hovered video if still connected to DOM.
 */
export function getLastKnownHoveredVideo(): HTMLVideoElement | null {
  if (lastKnownHoveredVideo && document.contains(lastKnownHoveredVideo)) {
    return lastKnownHoveredVideo
  }
  return null
}
