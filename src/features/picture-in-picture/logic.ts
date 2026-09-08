/**
 * Universal Picture-in-Picture - Content Script Logic
 * Handles finding playing videos, requesting PiP, stripping anti-PiP locks,
 * and dispatching status updates to the background service worker.
 */

import {
  DEFAULT_PICTURE_IN_PICTURE_CONFIG,
  type PictureInPictureConfig
} from "~core/types"

import { removeContentToast, showContentToast } from "~core/toast"

let isActive = false
let currentConfig: PictureInPictureConfig = {
  ...DEFAULT_PICTURE_IN_PICTURE_CONFIG
}

const PIP_ICON_SVG = `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="14" x="2" y="3" rx="2"/><rect width="8" height="5" x="12" y="10" rx="1"/><path d="m2 17 20 0"/></svg>`

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
 * Message listener from background worker (triggered dynamically via chrome.commands).
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

  document.addEventListener("enterpictureinpicture", onEnterPiP, true)
  document.addEventListener("leavepictureinpicture", onLeavePiP, true)
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
  chrome.runtime.onMessage.removeListener(onRuntimeMessage)

  removeContentToast()
}
