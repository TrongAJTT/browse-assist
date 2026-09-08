/**
 * Universal Picture-in-Picture - Content Script Logic
 * Handles finding playing videos, requesting PiP, stripping anti-PiP locks,
 * and dispatching status updates to the background service worker.
 */

import {
  DEFAULT_PICTURE_IN_PICTURE_CONFIG,
  type PictureInPictureConfig
} from "~core/types"

let isActive = false
let currentConfig: PictureInPictureConfig = {
  ...DEFAULT_PICTURE_IN_PICTURE_CONFIG
}
let toastElement: HTMLDivElement | null = null
let toastTimeoutId: number | null = null

/**
 * Displays a lightweight feedback toast when PiP is toggled.
 */
function showToast(message: string, isError = false): void {
  if (!currentConfig.showToast || typeof document === "undefined") return

  if (!toastElement || !document.documentElement.contains(toastElement)) {
    toastElement = document.createElement("div")
    toastElement.id = "browse-assist-pip-toast"
    toastElement.style.cssText = `
      position: fixed;
      bottom: 24px;
      right: 24px;
      z-index: 2147483647;
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 16px;
      border-radius: 9999px;
      background: rgba(15, 23, 42, 0.94);
      color: #f8fafc;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      font-size: 12px;
      font-weight: 600;
      letter-spacing: 0.02em;
      box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.4), 0 8px 10px -6px rgba(0, 0, 0, 0.3);
      backdrop-filter: blur(8px);
      pointer-events: none;
      user-select: none;
      opacity: 0;
      transform: translateY(6px);
      transition: opacity 0.2s ease-in-out, transform 0.2s ease-in-out;
      white-space: nowrap;
    `
    document.documentElement.appendChild(toastElement)
  }

  toastElement.style.borderColor = isError
    ? "rgba(248, 113, 113, 0.4)"
    : "rgba(99, 102, 241, 0.4)"
  toastElement.innerHTML = `
    <span style="display:flex;align-items:center;justify-content:center;width:16px;height:16px;flex-shrink:0;">
      ${
        isError
          ? `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#f87171" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`
          : `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#818cf8" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="14" x="2" y="3" rx="2"/><rect width="8" height="5" x="12" y="10" rx="1"/><path d="m2 17 20 0"/></svg>`
      }
    </span>
    <span>${message}</span>
  `

  toastElement.style.opacity = "1"
  toastElement.style.transform = "translateY(0)"

  if (toastTimeoutId !== null) {
    window.clearTimeout(toastTimeoutId)
  }

  toastTimeoutId = window.setTimeout(() => {
    if (toastElement) {
      toastElement.style.opacity = "0"
      toastElement.style.transform = "translateY(6px)"
    }
    toastTimeoutId = null
  }, 1600)
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
  try {
    chrome.runtime.sendMessage({
      action: "PIP_STATUS_CHANGED",
      isPip,
      title: document.title || window.location.hostname
    })
  } catch {
    // Suppress context invalidated errors during reload
  }
}

/**
 * Global enterpictureinpicture event listener.
 */
function onEnterPiP(): void {
  notifyPiPStatus(true)
}

/**
 * Global leavepictureinpicture event listener.
 */
function onLeavePiP(): void {
  notifyPiPStatus(false)
}

/**
 * Keydown handler for fallback in-page hotkey Alt+P
 * (in addition to chrome.commands to ensure immediate responsiveness).
 */
function onKeyDown(event: KeyboardEvent): void {
  if (!isActive) return

  // Alt + P (KeyP)
  if (event.altKey && !event.ctrlKey && !event.metaKey && (event.key === "p" || event.key === "P")) {
    event.preventDefault()
    event.stopPropagation()
    togglePictureInPicture()
  }
}

/**
 * Message listener from background worker (e.g. when shortcut triggered via chrome.commands).
 */
function onRuntimeMessage(
  message: { action: string },
  _sender: chrome.runtime.MessageSender,
  sendResponse: (response?: unknown) => void
): boolean | void {
  if (message?.action === "TOGGLE_PICTURE_IN_PICTURE") {
    togglePictureInPicture()
    sendResponse({ ok: true })
    return true
  }
  if (message?.action === "EXIT_PICTURE_IN_PICTURE") {
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

  window.addEventListener("keydown", onKeyDown, true)
  document.addEventListener("enterpictureinpicture", onEnterPiP, true)
  document.addEventListener("leavepictureinpicture", onLeavePiP, true)
  chrome.runtime.onMessage.addListener(onRuntimeMessage)
}

/**
 * Deactivates Picture-in-Picture listeners and cleans up state.
 */
export function deactivate(): void {
  if (!isActive || typeof window === "undefined") return
  isActive = false

  window.removeEventListener("keydown", onKeyDown, true)
  document.removeEventListener("enterpictureinpicture", onEnterPiP, true)
  document.removeEventListener("leavepictureinpicture", onLeavePiP, true)
  chrome.runtime.onMessage.removeListener(onRuntimeMessage)

  if (toastElement && toastElement.parentNode) {
    toastElement.parentNode.removeChild(toastElement)
    toastElement = null
  }
  if (toastTimeoutId !== null) {
    window.clearTimeout(toastTimeoutId)
    toastTimeoutId = null
  }
}
