import { VIDEO_WHEEL_CONSTANTS } from "~core/constants"
import {
  DEFAULT_VIDEO_WHEEL_CONTROL_CONFIG,
  type VideoWheelControlConfig,
  type VideoWheelModifier
} from "~core/types"
import {
  clearLastKnownHoveredVideo,
  findVideoAtCoordinates,
  getLastKnownHoveredVideo
} from "~core/videoDetector"
import {
  registerWheelSubscriber,
  unregisterWheelSubscriber
} from "~core/wheelDispatcher"

let isActive = false
let currentConfig: VideoWheelControlConfig = {
  ...DEFAULT_VIDEO_WHEEL_CONTROL_CONFIG
}

const OSD_ELEMENT_ID = "browse-assist-video-wheel-osd"
let osdElement: HTMLElement | null = null
let osdHideTimeout: NodeJS.Timeout | null = null

/**
 * Checks if the configured modifier key is pressed.
 */
function isModifierActive(
  modifier: VideoWheelModifier,
  event: WheelEvent | MouseEvent
): boolean {
  switch (modifier) {
    case "ctrl+shift":
      return event.ctrlKey && event.shiftKey
    case "ctrl+alt":
      return event.ctrlKey && event.altKey
    case "alt+shift":
      return event.altKey && event.shiftKey && !event.ctrlKey
    case "alt":
      return event.altKey && !event.ctrlKey && !event.shiftKey
    case "ctrl":
      return event.ctrlKey && !event.shiftKey && !event.altKey
    case "shift":
      return event.shiftKey && !event.ctrlKey && !event.altKey
    default:
      return false
  }
}

/**
 * Finds the target HTMLVideoElement under the cursor via shared multi-layer detector.
 */
function findVideoUnderCursor(event: WheelEvent | MouseEvent): HTMLVideoElement | null {
  return findVideoAtCoordinates({
    clientX: event.clientX,
    clientY: event.clientY,
    target: event.target
  })
}

// State for Hold-to-Boost
let originalPlaybackRate: number | null = null
let boostedVideo: HTMLVideoElement | null = null
let isBoostKeyDown = false

/**
 * Format seconds to mm:ss or hh:mm:ss
 */
function formatTime(seconds: number): string {
  if (isNaN(seconds) || seconds < 0) return "00:00"
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = Math.floor(seconds % 60)
  if (h > 0) {
    return `${h}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`
  }
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`
}

/**
 * Ensures the floating glassmorphic OSD badge element is created.
 */
function ensureOsdElement(): HTMLElement {
  if (osdElement && osdElement.parentNode) {
    return osdElement
  }

  const el = document.createElement("div")
  el.id = OSD_ELEMENT_ID
  el.setAttribute("data-browse-assist-internal", "true")
  el.style.cssText = `
    position: fixed;
    z-index: 2147483646;
    pointer-events: none;
    display: none;
    align-items: center;
    gap: 8px;
    padding: 6px 14px;
    border-radius: 9999px;
    background: rgba(18, 18, 22, 0.92);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border: 1px solid rgba(255, 255, 255, 0.18);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(0, 0, 0, 0.2);
    color: #ffffff;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    font-size: 12px;
    font-weight: 600;
    user-select: none;
    opacity: 0;
    transform: scale(0.94);
    transition: opacity 0.12s ease-out, transform 0.12s ease-out;
  `
  document.documentElement.appendChild(el)
  osdElement = el
  return el
}

/**
 * Displays an on-screen display (OSD) feedback badge centered near the top edge of the target video.
 */
function showOsd(
  video: HTMLVideoElement,
  type:
    | "volume"
    | "speed"
    | "mute"
    | "fullscreen"
    | "seek"
    | "frame"
    | "boost"
    | "screenshot",
  valueText: string,
  percent = 1
): void {
  if (!currentConfig.showOsd || typeof window === "undefined") return

  const osd = ensureOsdElement()
  const rect = video.getBoundingClientRect()

  // Center OSD horizontally and position near the top border of the video (approx 20px padding from top)
  const osdWidth = 140
  const targetX = Math.max(
    16,
    Math.min(
      window.innerWidth - osdWidth - 16,
      rect.left + rect.width / 2 - osdWidth / 2
    )
  )
  // Position 20px below video's top edge (or clamp within viewport)
  const targetY = Math.max(16, Math.min(window.innerHeight - 60, rect.top + 24))

  osd.style.left = `${targetX}px`
  osd.style.top = `${targetY}px`

  // Icons
  let iconSvg = ""
  let barColor = "#818cf8"
  let showBar = true

  if (type === "mute") {
    iconSvg = `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#f87171" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><line x1="22" y1="9" x2="16" y2="15"/><line x1="16" y1="9" x2="22" y2="15"/></svg>`
    barColor = "#f87171"
  } else if (type === "fullscreen") {
    iconSvg = `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/></svg>`
    barColor = "#38bdf8"
  } else if (type === "speed") {
    iconSvg = `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`
    barColor = "#a78bfa"
  } else if (type === "seek") {
    iconSvg = `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#34d399" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 19 22 12 13 5 13 19"/><polygon points="2 19 11 12 2 5 2 19"/></svg>`
    barColor = "#34d399"
  } else if (type === "frame") {
    iconSvg = `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"/><line x1="7" y1="2" x2="7" y2="22"/><line x1="17" y1="2" x2="17" y2="22"/><line x1="2" y1="12" x2="22" y2="12"/><line x1="2" y1="7" x2="7" y2="7"/><line x1="2" y1="17" x2="7" y2="17"/><line x1="17" y1="7" x2="22" y2="7"/><line x1="17" y1="17" x2="22" y2="17"/></svg>`
    barColor = "#fbbf24"
  } else if (type === "boost") {
    iconSvg = `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>`
    barColor = "#f59e0b"
  } else if (type === "screenshot") {
    iconSvg = `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#ec4899" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>`
    barColor = "#ec4899"
    showBar = false
  } else {
    // Volume icon
    iconSvg = `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#818cf8" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/></svg>`
  }

  const barPercent = Math.max(0, Math.min(100, Math.round(percent * 100)))

  osd.innerHTML = `
    <span style="display:flex;align-items:center;">${iconSvg}</span>
    <span style="min-width:44px;letter-spacing:0.01em;white-space:nowrap;">${valueText}</span>
    ${
      showBar
        ? `<div style="width:40px;height:4px;background:rgba(255,255,255,0.15);border-radius:9999px;overflow:hidden;flex-shrink:0;">
             <div style="width:${barPercent}%;height:100%;background:${barColor};border-radius:9999px;transition:width 0.08s ease-out;"></div>
           </div>`
        : ""
    }
  `

  osd.style.display = "flex"
  requestAnimationFrame(() => {
    osd.style.opacity = "1"
    osd.style.transform = "scale(1)"
  })

  if (osdHideTimeout) clearTimeout(osdHideTimeout)
  osdHideTimeout = setTimeout(() => {
    osd.style.opacity = "0"
    osd.style.transform = "scale(0.94)"
    setTimeout(() => {
      if (osd.style.opacity === "0") {
        osd.style.display = "none"
      }
    }, 120)
  }, VIDEO_WHEEL_CONSTANTS.OSD_FADE_DURATION_MS)
}

/**
 * Captures video frame to clipboard as PNG
 */
async function captureVideoFrame(video: HTMLVideoElement): Promise<void> {
  try {
    const width = video.videoWidth || video.clientWidth
    const height = video.videoHeight || video.clientHeight
    if (!width || !height) return

    const canvas = document.createElement("canvas")
    canvas.width = width
    canvas.height = height
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    ctx.drawImage(video, 0, 0, width, height)

    canvas.toBlob(async (blob) => {
      if (!blob) {
        showOsd(video, "screenshot", "Failed to capture", 0)
        return
      }
      try {
        await navigator.clipboard.write([
          new ClipboardItem({ "image/png": blob })
        ])
        showOsd(video, "screenshot", "Frame Copied!", 1)
      } catch {
        showOsd(video, "screenshot", "Clipboard Denied", 0)
      }
    }, "image/png")
  } catch {
    // Cross-origin tainted canvas
    showOsd(video, "screenshot", "CORS Protected", 0)
  }
}

/**
 * Wheel Decision Handler registered into WheelDispatcher at priority 100.
 */
function onWheelDecision(event: WheelEvent): boolean {
  if (!isActive) return false

  // Look for target video
  const video = findVideoUnderCursor(event)
  if (!video) return false

  // Check which modifier is pressed
  const isSeekMatch =
    currentConfig.enableSeek &&
    isModifierActive(currentConfig.seekModifier, event)
  const isSpeedMatch =
    currentConfig.enableSpeed &&
    isModifierActive(currentConfig.speedModifier, event)
  const isVolumeMatch =
    currentConfig.enableVolume &&
    isModifierActive(currentConfig.volumeModifier, event)

  // 1. Seek / Frame-by-Frame Control
  if (isSeekMatch) {
    let delta = event.deltaY < 0 ? 1 : -1
    if (currentConfig.invertSeekScroll) delta = -delta

    // If paused and frame-stepping is enabled, step by 1 frame (~1/30s)
    if (video.paused && currentConfig.enableFrameStep) {
      const frameDelta = delta * VIDEO_WHEEL_CONSTANTS.FRAME_DURATION_APPROX
      const targetTime = Math.max(
        0,
        Math.min(video.duration || 99999, video.currentTime + frameDelta)
      )
      video.currentTime = targetTime
      const sign = delta > 0 ? "+1" : "-1"
      const progress = video.duration ? targetTime / video.duration : 0
      showOsd(
        video,
        "frame",
        `Frame ${sign} (${formatTime(targetTime)})`,
        progress
      )
      return true
    }

    // Normal seeking when playing (or if frame step disabled)
    const stepSeconds = currentConfig.seekStep || 5
    const seekDelta = delta * stepSeconds
    const targetTime = Math.max(
      0,
      Math.min(video.duration || 99999, video.currentTime + seekDelta)
    )
    video.currentTime = targetTime
    const progress = video.duration ? targetTime / video.duration : 0
    const sign = delta > 0 ? `+${stepSeconds}s` : `-${stepSeconds}s`
    const durationStr = video.duration ? formatTime(video.duration) : "--:--"
    showOsd(
      video,
      "seek",
      `${sign} (${formatTime(targetTime)} / ${durationStr})`,
      progress
    )
    return true
  }

  // 2. Playback Speed Control
  if (isSpeedMatch) {
    let delta = event.deltaY < 0 ? 1 : -1
    if (currentConfig.invertSpeedScroll) delta = -delta

    const currentSpeed = video.playbackRate || 1.0
    const nextSpeed = Math.max(
      VIDEO_WHEEL_CONSTANTS.MIN_SPEED,
      Math.min(
        VIDEO_WHEEL_CONSTANTS.MAX_SPEED,
        Number((currentSpeed + delta * currentConfig.speedStep).toFixed(2))
      )
    )

    video.playbackRate = nextSpeed
    const speedFraction =
      (nextSpeed - VIDEO_WHEEL_CONSTANTS.MIN_SPEED) /
      (VIDEO_WHEEL_CONSTANTS.MAX_SPEED - VIDEO_WHEEL_CONSTANTS.MIN_SPEED)
    showOsd(video, "speed", `${nextSpeed.toFixed(2)}x`, speedFraction)
    return true
  }

  // 3. Volume Control
  if (isVolumeMatch) {
    let delta = event.deltaY < 0 ? 1 : -1
    if (currentConfig.invertVolumeScroll) delta = -delta

    // If video was muted, unmute on volume scroll up
    if (video.muted && delta > 0) {
      video.muted = false
    }

    const currentVol = video.muted ? 0 : video.volume
    const nextVol = Math.max(
      VIDEO_WHEEL_CONSTANTS.MIN_VOLUME,
      Math.min(
        VIDEO_WHEEL_CONSTANTS.MAX_VOLUME,
        Number((currentVol + delta * currentConfig.volumeStep).toFixed(2))
      )
    )

    video.volume = nextVol
    if (video.muted && nextVol > 0) {
      video.muted = false
    }

    const percent = Math.round(nextVol * 100)
    showOsd(video, "volume", `${percent}%`, nextVol)
    return true
  }

  return false
}

/**
 * Handles left-click (button 0) on videos:
 * - Left Click + Volume Modifier: Toggle mute/unmute
 * - Left Click + Speed Modifier: Toggle fullscreen
 * - Shift + Alt + Click (or Screenshot shortcut): Capture video frame
 */
function handleLeftClick(event: MouseEvent): void {
  if (!isActive || event.button !== 0) {
    return
  }

  const isVolumeModifier =
    currentConfig.enableVolume &&
    isModifierActive(currentConfig.volumeModifier, event)
  const isSpeedModifier =
    currentConfig.enableSpeed &&
    isModifierActive(currentConfig.speedModifier, event)
  // Shift + Alt + Click for instant screenshot
  const wantsScreenshot =
    currentConfig.enableScreenshot && event.shiftKey && event.altKey

  const wantsMute = currentConfig.clickToMute && isVolumeModifier
  const wantsFullscreen = currentConfig.clickToFullscreen && isSpeedModifier

  if (!wantsMute && !wantsFullscreen && !wantsScreenshot) {
    return
  }

  const video = findVideoAtCoordinates({
    clientX: event.clientX,
    clientY: event.clientY,
    target: event.target
  })

  if (!video) return

  // Prevent web video player from triggering Play / Pause on click
  event.preventDefault()
  event.stopPropagation()
  event.stopImmediatePropagation()

  // Screenshot action
  if (wantsScreenshot) {
    captureVideoFrame(video)
    return
  }

  // Fullscreen action takes precedence if requested
  if (wantsFullscreen) {
    if (!document.fullscreenElement) {
      const container =
        video.closest(
          ".html5-video-player, .video-player, [data-player], .player-container, video-player"
        ) || video
      if (container.requestFullscreen) {
        container.requestFullscreen().catch(() => {
          video?.requestFullscreen().catch(() => {})
        })
      } else if (video.requestFullscreen) {
        video.requestFullscreen().catch(() => {})
      }
      showOsd(video, "fullscreen", "Fullscreen", 1)
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {})
      }
      showOsd(video, "fullscreen", "Exit Fullscreen", 0)
    }
    return
  }

  if (wantsMute) {
    video.muted = !video.muted
    if (video.muted) {
      showOsd(video, "mute", "Muted", 0)
    } else {
      const percent = Math.round(video.volume * 100)
      showOsd(video, "volume", `${percent}%`, video.volume)
    }
  }
}

/**
 * Capture phase mousedown to suppress video player play/pause state toggle.
 */
function onMouseDown(event: MouseEvent): void {
  if (event.button === 0) {
    const isVolumeModifier =
      currentConfig.enableVolume &&
      isModifierActive(currentConfig.volumeModifier, event)
    const isSpeedModifier =
      currentConfig.enableSpeed &&
      isModifierActive(currentConfig.speedModifier, event)
    const isScreenshotModifier =
      currentConfig.enableScreenshot && event.shiftKey && event.altKey

    if (
      (currentConfig.clickToMute && isVolumeModifier) ||
      (currentConfig.clickToFullscreen && isSpeedModifier) ||
      isScreenshotModifier
    ) {
      handleLeftClick(event)
    }
  }
}

/**
 * Capture phase click to absorb any trailing click events.
 */
function onClick(event: MouseEvent): void {
  if (event.button === 0) {
    const isVolumeModifier =
      currentConfig.enableVolume &&
      isModifierActive(currentConfig.volumeModifier, event)
    const isSpeedModifier =
      currentConfig.enableSpeed &&
      isModifierActive(currentConfig.speedModifier, event)
    const isScreenshotModifier =
      currentConfig.enableScreenshot && event.shiftKey && event.altKey

    if (
      (currentConfig.clickToMute && isVolumeModifier) ||
      (currentConfig.clickToFullscreen && isSpeedModifier) ||
      isScreenshotModifier
    ) {
      event.preventDefault()
      event.stopPropagation()
      event.stopImmediatePropagation()
    }
  }
}

/**
 * Handles KeyDown for Hold-to-Boost (Hold 'X' key over video)
 */
function onKeyDown(event: KeyboardEvent): void {
  if (!isActive || !currentConfig.enableHoldToBoost || isBoostKeyDown) return
  if (event.key.toLowerCase() !== "x") return

  // Don't boost if user is typing in an input / textarea / contenteditable
  const target = event.target as HTMLElement | null
  if (
    target &&
    (target.tagName === "INPUT" ||
      target.tagName === "TEXTAREA" ||
      target.isContentEditable)
  ) {
    return
  }

  const video = getLastKnownHoveredVideo() || document.querySelector("video")
  if (!video || !document.contains(video)) return

  isBoostKeyDown = true
  boostedVideo = video
  originalPlaybackRate = video.playbackRate || 1.0

  const boostRate = currentConfig.boostSpeed || 2.0
  video.playbackRate = boostRate
  showOsd(video, "boost", `⚡ ${boostRate}x Boost`, 1)
}

/**
 * Handles KeyUp to restore original playback rate after Hold-to-Boost
 */
function onKeyUp(event: KeyboardEvent): void {
  if (!isActive || !isBoostKeyDown) return
  if (event.key.toLowerCase() !== "x") return

  isBoostKeyDown = false
  if (boostedVideo && document.contains(boostedVideo)) {
    const restoreRate = originalPlaybackRate || 1.0
    boostedVideo.playbackRate = restoreRate
    showOsd(boostedVideo, "speed", `${restoreRate}x`, restoreRate / 4.0)
  }
  boostedVideo = null
  originalPlaybackRate = null
}

/**
 * Hot updates runtime config without listener reattachment.
 */
export function updateVideoWheelControlConfig(
  config?: Partial<VideoWheelControlConfig>
): void {
  if (!config) return
  currentConfig = { ...currentConfig, ...config }
}

/**
 * Activates Video Wheel Control feature.
 */
export function activate(config?: VideoWheelControlConfig): void {
  if (config) {
    updateVideoWheelControlConfig(config)
  }

  if (isActive || typeof window === "undefined") return
  isActive = true

  // Register in central dispatcher with high priority (100)
  registerWheelSubscriber({
    id: "video-wheel-control",
    priority: 100,
    handler: onWheelDecision
  })

  window.addEventListener("mousedown", onMouseDown, { capture: true })
  window.addEventListener("click", onClick, { capture: true })
  window.addEventListener("keydown", onKeyDown)
  window.addEventListener("keyup", onKeyUp)
}

/**
 * Deactivates Video Wheel Control and cleans up all DOM elements.
 */
export function deactivate(): void {
  if (!isActive || typeof window === "undefined") return
  isActive = false

  unregisterWheelSubscriber("video-wheel-control")
  window.removeEventListener("mousedown", onMouseDown, { capture: true })
  window.removeEventListener("click", onClick, { capture: true })
  window.removeEventListener("keydown", onKeyDown)
  window.removeEventListener("keyup", onKeyUp)

  if (isBoostKeyDown && boostedVideo && originalPlaybackRate !== null) {
    boostedVideo.playbackRate = originalPlaybackRate
  }
  isBoostKeyDown = false
  boostedVideo = null
  originalPlaybackRate = null

  if (osdHideTimeout) {
    clearTimeout(osdHideTimeout)
    osdHideTimeout = null
  }

  if (osdElement && osdElement.parentNode) {
    osdElement.parentNode.removeChild(osdElement)
    osdElement = null
  }

  clearLastKnownHoveredVideo()
}
