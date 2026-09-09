import { VIDEO_WHEEL_CONSTANTS } from "~core/constants"
import {
  DEFAULT_VIDEO_WHEEL_CONTROL_CONFIG,
  type VideoWheelControlConfig,
  type VideoWheelModifier
} from "~core/types"
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

let lastKnownHoveredVideo: HTMLVideoElement | null = null

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
 * Finds the target HTMLVideoElement under the cursor.
 * Handles overlay player divs across YouTube, Facebook, X (Twitter), TikTok, and custom web players.
 */
function findVideoUnderCursor(event: WheelEvent): HTMLVideoElement | null {
  const target = event.target as HTMLElement | null

  // 1. Direct video tag
  if (target && target.tagName.toLowerCase() === "video") {
    lastKnownHoveredVideo = target as HTMLVideoElement
    return target as HTMLVideoElement
  }

  // 2. Child video inside target
  if (target) {
    const directChild = target.querySelector("video")
    if (directChild) {
      lastKnownHoveredVideo = directChild as HTMLVideoElement
      return directChild as HTMLVideoElement
    }

    // 3. Look up video in common player containers or parent tree
    const container = target.closest(
      ".html5-video-player, .video-player, [data-player], .player-container, video-player, [data-testid*='video'], [aria-label*='video'], div[role='region']"
    )
    if (container) {
      const video = container.querySelector("video")
      if (video) {
        lastKnownHoveredVideo = video as HTMLVideoElement
        return video as HTMLVideoElement
      }
    }
  }

  // 4. Multi-layer depth scan via elementsFromPoint
  // Facebook, X (Twitter), and TikTok place full transparent click-interception layers on top
  if (typeof document.elementsFromPoint === "function") {
    const elements = document.elementsFromPoint(event.clientX, event.clientY)
    for (const el of elements) {
      if (el.tagName.toLowerCase() === "video") {
        lastKnownHoveredVideo = el as HTMLVideoElement
        return el as HTMLVideoElement
      }
      const video = el.querySelector("video")
      if (video) {
        lastKnownHoveredVideo = video as HTMLVideoElement
        return video as HTMLVideoElement
      }
    }
  }

  // 5. Fallback: check bounding rect of all active playing/ready videos on the page
  const allVideos = document.querySelectorAll("video")
  for (const video of allVideos) {
    const rect = video.getBoundingClientRect()
    if (
      event.clientX >= rect.left &&
      event.clientX <= rect.right &&
      event.clientY >= rect.top &&
      event.clientY <= rect.bottom
    ) {
      lastKnownHoveredVideo = video
      return video
    }
  }

  // 6. Last known hovered video if pointer is still within its bounding rect
  if (lastKnownHoveredVideo && document.contains(lastKnownHoveredVideo)) {
    const rect = lastKnownHoveredVideo.getBoundingClientRect()
    if (
      event.clientX >= rect.left &&
      event.clientX <= rect.right &&
      event.clientY >= rect.top &&
      event.clientY <= rect.bottom
    ) {
      return lastKnownHoveredVideo
    }
  }

  return null
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
  type: "volume" | "speed" | "mute" | "fullscreen",
  valueText: string,
  percent = 1
): void {
  if (!currentConfig.showOsd || typeof window === "undefined") return

  const osd = ensureOsdElement()
  const rect = video.getBoundingClientRect()

  // Center OSD horizontally and position near the top border of the video (approx 20px padding from top)
  const osdWidth = 130
  const targetX = Math.max(
    16,
    Math.min(
      window.innerWidth - osdWidth - 16,
      rect.left + rect.width / 2 - osdWidth / 2
    )
  )
  // Position 20px below video's top edge (or clamp within viewport)
  const targetY = Math.max(
    16,
    Math.min(window.innerHeight - 60, rect.top + 24)
  )

  osd.style.left = `${targetX}px`
  osd.style.top = `${targetY}px`

  // Icons
  let iconSvg = ""
  let barColor = "#818cf8"

  if (type === "mute") {
    iconSvg = `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#f87171" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><line x1="22" y1="9" x2="16" y2="15"/><line x1="16" y1="9" x2="22" y2="15"/></svg>`
    barColor = "#f87171"
  } else if (type === "fullscreen") {
    iconSvg = `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/></svg>`
    barColor = "#38bdf8"
  } else if (type === "speed") {
    iconSvg = `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`
    barColor = "#a78bfa"
  } else {
    // Volume icon
    iconSvg = `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#818cf8" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/></svg>`
  }

  const barPercent = Math.max(0, Math.min(100, Math.round(percent * 100)))

  osd.innerHTML = `
    <span style="display:flex;align-items:center;">${iconSvg}</span>
    <span style="min-width:44px;letter-spacing:0.01em;">${valueText}</span>
    <div style="width:40px;height:4px;background:rgba(255,255,255,0.15);border-radius:9999px;overflow:hidden;">
      <div style="width:${barPercent}%;height:100%;background:${barColor};border-radius:9999px;transition:width 0.08s ease-out;"></div>
    </div>
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
 * Wheel Decision Handler registered into WheelDispatcher at priority 100.
 */
function onWheelDecision(event: WheelEvent): boolean {
  if (!isActive) return false

  // Look for target video
  const video = findVideoUnderCursor(event)
  if (!video) return false

  // Check Speed modifier first (if distinct)
  const isSpeedMatch = isModifierActive(currentConfig.speedModifier, event)
  const isVolumeMatch = isModifierActive(currentConfig.volumeModifier, event)

  // Disambiguate if modifiers collide:
  // Speed control takes precedence when modifiers collide
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
 */
function handleLeftClick(event: MouseEvent): void {
  if (!isActive || event.button !== 0) {
    return
  }

  const isVolumeModifier = isModifierActive(
    currentConfig.volumeModifier,
    event
  )
  const isSpeedModifier = isModifierActive(
    currentConfig.speedModifier,
    event
  )

  const wantsMute = currentConfig.clickToMute && isVolumeModifier
  const wantsFullscreen =
    currentConfig.clickToFullscreen && isSpeedModifier

  if (!wantsMute && !wantsFullscreen) {
    return
  }

  const target = event.target as HTMLElement | null
  let video: HTMLVideoElement | null = null

  // 1. Direct or child video
  if (target) {
    if (target.tagName.toLowerCase() === "video") {
      video = target as HTMLVideoElement
    } else {
      video =
        target.querySelector("video") ||
        target
          .closest(
            ".html5-video-player, .video-player, [data-player], .player-container, video-player"
          )
          ?.querySelector("video") ||
        null
    }
  }

  // 2. Multi-layer depth scan fallback
  if (!video && typeof document.elementsFromPoint === "function") {
    const elements = document.elementsFromPoint(event.clientX, event.clientY)
    for (const el of elements) {
      if (el.tagName.toLowerCase() === "video") {
        video = el as HTMLVideoElement
        break
      }
      const child = el.querySelector("video")
      if (child) {
        video = child as HTMLVideoElement
        break
      }
    }
  }

  // 3. Fallback: check bounding rect of all videos
  if (!video) {
    const allVideos = document.querySelectorAll("video")
    for (const v of allVideos) {
      const rect = v.getBoundingClientRect()
      if (
        event.clientX >= rect.left &&
        event.clientX <= rect.right &&
        event.clientY >= rect.top &&
        event.clientY <= rect.bottom
      ) {
        video = v
        break
      }
    }
  }

  // 4. Fallback to cached video
  if (
    !video &&
    lastKnownHoveredVideo &&
    document.contains(lastKnownHoveredVideo)
  ) {
    const rect = lastKnownHoveredVideo.getBoundingClientRect()
    if (
      event.clientX >= rect.left &&
      event.clientX <= rect.right &&
      event.clientY >= rect.top &&
      event.clientY <= rect.bottom
    ) {
      video = lastKnownHoveredVideo
    }
  }

  if (!video) return

  // Prevent web video player from triggering Play / Pause on click
  event.preventDefault()
  event.stopPropagation()
  event.stopImmediatePropagation()

  // Fullscreen action takes precedence if requested
  if (wantsFullscreen) {
    if (!document.fullscreenElement) {
      // Prefer player container for fullscreen if available, otherwise video itself
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
    const isVolumeModifier = isModifierActive(
      currentConfig.volumeModifier,
      event
    )
    const isSpeedModifier = isModifierActive(
      currentConfig.speedModifier,
      event
    )
    if (
      (currentConfig.clickToMute && isVolumeModifier) ||
      (currentConfig.clickToFullscreen && isSpeedModifier)
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
    const isVolumeModifier = isModifierActive(
      currentConfig.volumeModifier,
      event
    )
    const isSpeedModifier = isModifierActive(
      currentConfig.speedModifier,
      event
    )
    if (
      (currentConfig.clickToMute && isVolumeModifier) ||
      (currentConfig.clickToFullscreen && isSpeedModifier)
    ) {
      event.preventDefault()
      event.stopPropagation()
      event.stopImmediatePropagation()
    }
  }
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

  if (osdHideTimeout) {
    clearTimeout(osdHideTimeout)
    osdHideTimeout = null
  }

  if (osdElement && osdElement.parentNode) {
    osdElement.parentNode.removeChild(osdElement)
    osdElement = null
  }

  lastKnownHoveredVideo = null
}
