/**
 * Universal Picture-in-Picture - Content Script Logic
 * Handles finding playing videos, requesting PiP, stripping anti-PiP locks,
 * and dispatching status updates to the background service worker.
 */

import { MESSAGE_TYPES, sendToBackground } from "~core/messaging"
import { removeContentToast, showContentToast } from "~core/toast"
import {
  DEFAULT_PICTURE_IN_PICTURE_CONFIG,
  type PictureInPictureConfig
} from "~core/types"

let isActive = false
let currentConfig: PictureInPictureConfig = {
  ...DEFAULT_PICTURE_IN_PICTURE_CONFIG
}

const PIP_ICON_SVG = `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="14" x="2" y="3" rx="2"/><rect width="8" height="5" x="12" y="10" rx="1"/><path d="m2 17 20 0"/></svg>`
const PIP_BUTTON_ID = "__browse_assist_pip_hover_btn__"

// Hover PiP Button state
let hoverButtonElement: HTMLButtonElement | null = null
let hoveredVideoElement: HTMLVideoElement | null = null
let hoverHideTimeout: ReturnType<typeof setTimeout> | null = null
let isPointerOverHoverButton = false

/**
 * Creates and mounts the floating PiP button element into the DOM.
 */
function ensureHoverButton(): HTMLButtonElement {
  if (hoverButtonElement && document.documentElement.contains(hoverButtonElement)) {
    return hoverButtonElement
  }

  if (hoverButtonElement && hoverButtonElement.parentNode) {
    hoverButtonElement.parentNode.removeChild(hoverButtonElement)
  }

  const btn = document.createElement("button")
  btn.id = PIP_BUTTON_ID
  btn.setAttribute("data-browse-assist-internal", "true")
  btn.type = "button"
  btn.title = "Watch in Picture-in-Picture"
  btn.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    z-index: 2147483645;
    display: none;
    align-items: center;
    justify-content: center;
    gap: 5px;
    padding: 3px 12px 4px 12px;
    border-radius: 8px 8px 0 0;
    background: rgba(18, 18, 22, 0.92);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border: 1px solid rgba(255, 255, 255, 0.18);
    border-bottom: none;
    box-shadow: 0 -4px 16px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(0, 0, 0, 0.25);
    color: #ffffff;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    font-size: 11px;
    font-weight: 600;
    cursor: pointer;
    user-select: none;
    pointer-events: auto;
    opacity: 0;
    transform: translateY(6px) scale(0.96);
    transition: opacity 0.18s cubic-bezier(0.16, 1, 0.3, 1), transform 0.18s cubic-bezier(0.16, 1, 0.3, 1), background 0.15s ease, border-color 0.15s ease;
  `

  btn.innerHTML = `
    <!-- Left inverted corner curve wing (flares out at bottom onto video border) -->
    <span style="position:absolute;bottom:0;left:-8px;width:8px;height:8px;pointer-events:none;background:radial-gradient(circle at 0 0, transparent 8px, rgba(18, 18, 22, 0.92) 8.5px);"></span>
    <span style="display:flex;align-items:center;color:#818cf8;">${PIP_ICON_SVG}</span>
    <span style="letter-spacing:0.02em;">PiP</span>
    <!-- Right inverted corner curve wing (flares out at bottom onto video border) -->
    <span style="position:absolute;bottom:0;right:-8px;width:8px;height:8px;pointer-events:none;background:radial-gradient(circle at 100% 0, transparent 8px, rgba(18, 18, 22, 0.92) 8.5px);"></span>
  `

  btn.addEventListener("mouseenter", () => {
    isPointerOverHoverButton = true
    btn.style.background = "rgba(30, 27, 75, 0.96)"
    btn.style.borderColor = "rgba(129, 140, 248, 0.5)"
    if (hoverHideTimeout) {
      clearTimeout(hoverHideTimeout)
      hoverHideTimeout = null
    }
  })

  btn.addEventListener("mouseleave", () => {
    isPointerOverHoverButton = false
    btn.style.background = "rgba(18, 18, 22, 0.92)"
    btn.style.borderColor = "rgba(255, 255, 255, 0.18)"
    scheduleHideHoverButton(1000)
  })

  btn.addEventListener("click", async (e) => {
    e.preventDefault()
    e.stopPropagation()
    e.stopImmediatePropagation()

    if (hoveredVideoElement) {
      try {
        prepareVideoForPiP(hoveredVideoElement)
        if (document.pictureInPictureElement === hoveredVideoElement) {
          await document.exitPictureInPicture()
          showToast("Exited Picture-in-Picture")
        } else {
          await hoveredVideoElement.requestPictureInPicture()
          showToast("Entered Picture-in-Picture")
        }
      } catch (err) {
        console.error("[Browse Assist] Failed to toggle PiP on hover:", err)
        showToast("Cannot enter Picture-in-Picture", true)
      }
    }
    hideHoverButtonNow()
  })

  document.documentElement.appendChild(btn)
  hoverButtonElement = btn
  return btn
}

/**
 * Positions and shows the floating PiP hover button protruding outward above the top edge of the video.
 */
function showHoverButtonForVideo(video: HTMLVideoElement): void {
  if (!currentConfig.hoverButton || !isActive) return

  // Do not show button if this video is already in PiP
  if (document.pictureInPictureElement === video) {
    hideHoverButtonNow()
    return
  }

  const rect = video.getBoundingClientRect()
  // Threshold: video must be sufficiently sized and visible on screen
  if (rect.width < 200 || rect.height < 140) {
    hideHoverButtonNow()
    return
  }

  if (rect.bottom < 40 || rect.top > window.innerHeight - 40) {
    hideHoverButtonNow()
    return
  }

  const btn = ensureHoverButton()
  hoveredVideoElement = video

  // Position docked directly on the top border of video bounding rect, protruding outward above it
  const buttonWidth = 62
  const buttonHeight = 24
  const targetX = Math.max(16, Math.min(window.innerWidth - buttonWidth - 16, rect.left + rect.width / 2 - buttonWidth / 2))
  // Protrude upward outside the video; if video is right at top edge of viewport, clamp to 0
  const targetY = rect.top >= buttonHeight ? rect.top - buttonHeight : Math.max(0, rect.top)

  btn.style.top = `${targetY}px`
  btn.style.left = `${targetX}px`
  btn.style.display = "flex"

  // Trigger smooth drop-in
  requestAnimationFrame(() => {
    btn.style.opacity = "1"
    btn.style.transform = "translateY(0) scale(1)"
  })

  // Auto-hide after 2.5s of no pointer motion
  if (hoverHideTimeout) clearTimeout(hoverHideTimeout)
  hoverHideTimeout = setTimeout(() => {
    if (!isPointerOverHoverButton) {
      btn.style.opacity = "0"
      btn.style.transform = "translateY(-4px) scale(0.96)"
    }
  }, 2500)
}

function scheduleHideHoverButton(delay = 300): void {
  if (hoverHideTimeout) clearTimeout(hoverHideTimeout)
  hoverHideTimeout = setTimeout(() => {
    if (!isPointerOverHoverButton) {
      hideHoverButtonNow()
    }
  }, delay)
}

function hideHoverButtonNow(): void {
  if (!hoverButtonElement) return
  hoverButtonElement.style.opacity = "0"
  hoverButtonElement.style.transform = "translateY(-4px) scale(0.96)"
  setTimeout(() => {
    if (hoverButtonElement && hoverButtonElement.style.opacity === "0") {
      hoverButtonElement.style.display = "none"
    }
  }, 180)
  hoveredVideoElement = null
}

/**
 * Window pointermove listener to detect cursor entering video zones.
 */
function onWindowPointerMove(e: PointerEvent): void {
  if (!isActive || !currentConfig.hoverButton) return

  // If pointer is directly interacting with our hover button, keep it
  if (isPointerOverHoverButton) return

  // Check element under point
  const target = document.elementFromPoint(e.clientX, e.clientY) as HTMLElement | null
  if (!target) {
    scheduleHideHoverButton(300)
    return
  }

  // Check if target is a video or inside a video container
  let video: HTMLVideoElement | null = null
  if (target.tagName.toLowerCase() === "video") {
    video = target as HTMLVideoElement
  } else {
    // Many players (e.g. YouTube, Twitter) place an overlay div over the video
    const candidate = target.querySelector("video") || target.closest(".html5-video-player, .video-player, [data-player]")?.querySelector("video")
    if (candidate) {
      video = candidate as HTMLVideoElement
    } else {
      // Check if mouse is within bounding rect of hoveredVideoElement
      if (hoveredVideoElement) {
        const rect = hoveredVideoElement.getBoundingClientRect()
        if (
          e.clientX >= rect.left &&
          e.clientX <= rect.right &&
          e.clientY >= rect.top &&
          e.clientY <= rect.bottom
        ) {
          video = hoveredVideoElement
        }
      }
    }
  }

  if (video && (video.readyState >= 2 || !video.paused)) {
    showHoverButtonForVideo(video)
  } else if (!hoveredVideoElement) {
    scheduleHideHoverButton(300)
  }
}

/**
 * Displays feedback toast when PiP is toggled using standardized toast system.
 */
function showToast(message: string, isError = false, detail?: string): void {
  if (!currentConfig.showToast) return

  showContentToast({
    message,
    detail,
    type: isError ? "error" : "info",
    iconSvg: isError ? undefined : PIP_ICON_SVG,
    position: "bottom-right",
    duration: isError ? 2200 : 1600
  })
}

/**
 * Searches and ranks the best candidate HTMLVideoElement on the current page.
 * Heuristic priority:
 * 1. Currently playing videos (!paused && !ended && readyState > 2)
 * 2. Highest visible viewport surface area
 * 3. Most recently interacted or largest video in DOM
 */
function findBestCandidateVideo(): HTMLVideoElement | null {
  const allVideos = Array.from(document.querySelectorAll("video"))
  if (allVideos.length === 0) return null

  // Filter playing videos
  const playingVideos = allVideos.filter(
    (v) => !v.paused && !v.ended && v.readyState > 2
  )

  const candidatePool = playingVideos.length > 0 ? playingVideos : allVideos

  let bestVideo: HTMLVideoElement | null = null
  let maxArea = -1

  for (const video of candidatePool) {
    const rect = video.getBoundingClientRect()
    // Calculate visible area in viewport
    const visibleWidth = Math.max(
      0,
      Math.min(rect.right, window.innerWidth) - Math.max(rect.left, 0)
    )
    const visibleHeight = Math.max(
      0,
      Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0)
    )
    const area = visibleWidth * visibleHeight

    if (area > maxArea) {
      maxArea = area
      bestVideo = video
    }
  }

  return bestVideo || allVideos[0]
}

/**
 * Strips anti-PiP barriers if a website intentionally tries to block picture-in-picture.
 */
function prepareVideoForPiP(video: HTMLVideoElement): void {
  if (video.hasAttribute("disablepictureinpicture")) {
    video.removeAttribute("disablepictureinpicture")
  }
  video.disablePictureInPicture = false
}

/**
 * Toggles Picture-in-Picture on the best video element.
 */
export async function togglePictureInPicture(): Promise<void> {
  if (!isActive) return

  // 1. If a video is already in PiP mode, exit it
  if (document.pictureInPictureElement) {
    try {
      await document.exitPictureInPicture()
      showToast("Exited Picture-in-Picture")
    } catch (err) {
      console.error("[Browse Assist] Failed to exit PiP:", err)
    }
    return
  }

  // 2. Otherwise, find candidate video
  const video = findBestCandidateVideo()
  if (!video) {
    showToast("No video found on page", true)
    return
  }

  try {
    prepareVideoForPiP(video)
    await video.requestPictureInPicture()
    showToast("Entered Picture-in-Picture")
  } catch (err) {
    console.error("[Browse Assist] Failed to request PiP:", err)
    showToast("Cannot enter Picture-in-Picture", true)
  }
}

/**
 * Notifies background service worker about PiP state change.
 */
function notifyPiPStatus(isPip: boolean): void {
  sendToBackground(MESSAGE_TYPES.PIP_STATUS_CHANGED, {
    isPip,
    title: document.title || window.location.hostname
  }).catch(() => {})
}

/**
 * Global enterpictureinpicture event listener.
 */
function onEnterPiP(): void {
  notifyPiPStatus(true)
  hideHoverButtonNow()
}

/**
 * Global leavepictureinpicture event listener.
 */
function onLeavePiP(): void {
  notifyPiPStatus(false)
}

/**
 * Message listener from background worker (triggered dynamically via chrome.commands).
 */
function onRuntimeMessage(
  message: { action?: string; type?: string },
  _sender: chrome.runtime.MessageSender,
  sendResponse: (response?: unknown) => void
): boolean | void {
  const msgType = message?.type || message?.action

  if (msgType === MESSAGE_TYPES.TOGGLE_PICTURE_IN_PICTURE) {
    togglePictureInPicture()
    sendResponse({ ok: true })
    return true
  }
  if (msgType === MESSAGE_TYPES.EXIT_PICTURE_IN_PICTURE) {
    if (document.pictureInPictureElement) {
      document.exitPictureInPicture().catch(() => {})
    }
    sendResponse({ ok: true })
    return true
  }
}

/**
 * Updates runtime Picture-in-Picture config.
 */
export function updatePictureInPictureConfig(
  config?: Partial<PictureInPictureConfig>
): void {
  if (!config) return
  currentConfig = { ...currentConfig, ...config }

  if (!currentConfig.hoverButton) {
    hideHoverButtonNow()
  }
}

/**
 * Activates Picture-in-Picture listeners and handlers.
 */
export function activate(config?: PictureInPictureConfig): void {
  if (config) {
    updatePictureInPictureConfig(config)
  }

  if (isActive || typeof window === "undefined") return
  isActive = true

  document.addEventListener("enterpictureinpicture", onEnterPiP, true)
  document.addEventListener("leavepictureinpicture", onLeavePiP, true)
  window.addEventListener("pointermove", onWindowPointerMove, { passive: true, capture: true })
  chrome.runtime.onMessage.addListener(onRuntimeMessage)
}

/**
 * Deactivates Picture-in-Picture listeners, exits PiP immediately if active, and cleans up state.
 */
export function deactivate(): void {
  if (!isActive && !document.pictureInPictureElement) return
  isActive = false

  // If a video is currently playing in PiP, immediately exit it upon feature deactivation
  if (document.pictureInPictureElement) {
    document.exitPictureInPicture().catch(() => {})
    notifyPiPStatus(false)
  }

  document.removeEventListener("enterpictureinpicture", onEnterPiP, true)
  document.removeEventListener("leavepictureinpicture", onLeavePiP, true)
  window.removeEventListener("pointermove", onWindowPointerMove, { capture: true })
  chrome.runtime.onMessage.removeListener(onRuntimeMessage)

  hideHoverButtonNow()
  if (hoverButtonElement && hoverButtonElement.parentNode) {
    hoverButtonElement.parentNode.removeChild(hoverButtonElement)
    hoverButtonElement = null
  }
  if (hoverHideTimeout) {
    clearTimeout(hoverHideTimeout)
    hoverHideTimeout = null
  }

  removeContentToast()
}
