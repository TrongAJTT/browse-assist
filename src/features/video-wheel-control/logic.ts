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

/**
 * Checks if the configured modifier key is pressed.
 */
function isModifierActive(
  modifier: VideoWheelModifier,
  event: WheelEvent
): boolean {
  switch (modifier) {
    case "none":
      return true
    case "alt":
      return event.altKey
    case "ctrl":
      return event.ctrlKey
    case "shift":
      return event.shiftKey
    default:
      return false
  }
}

/**
 * Finds the target HTMLVideoElement under the cursor.
 * Handles overlay player divs (e.g. YouTube, Twitter, Facebook, TikTok).
 */
function findVideoUnderCursor(event: WheelEvent): HTMLVideoElement | null {
  const target = event.target as HTMLElement | null
  if (!target) return null

  // 1. Direct video tag
  if (target.tagName.toLowerCase() === "video") {
    return target as HTMLVideoElement
  }

  // 2. Child video element
  const directChild = target.querySelector("video")
  if (directChild) {
    return directChild as HTMLVideoElement
  }

  // 3. Look up video in player container
  const container = target.closest(
    ".html5-video-player, .video-player, [data-player], .player-container, video-player"
  )
  if (container) {
    const video = container.querySelector("video")
    if (video) return video as HTMLVideoElement
  }

  // 4. Element from point check
  const elementUnderPoint = document.elementFromPoint(
    event.clientX,
    event.clientY
  )
  if (elementUnderPoint && elementUnderPoint !== target) {
    if (elementUnderPoint.tagName.toLowerCase() === "video") {
      return elementUnderPoint as HTMLVideoElement
    }
    const candidate =
      elementUnderPoint.querySelector("video") ||
      elementUnderPoint
        .closest(".html5-video-player, .video-player, [data-player]")
        ?.querySelector("video")
    if (candidate) return candidate as HTMLVideoElement
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
 * Displays an on-screen display (OSD) feedback badge centered over the target video.
 */
function showOsd(
  video: HTMLVideoElement,
  type: "volume" | "speed" | "mute",
  valueText: string,
  percent = 1
): void {
  if (!currentConfig.showOsd || typeof window === "undefined") return

  const osd = ensureOsdElement()
  const rect = video.getBoundingClientRect()

  // Center OSD horizontally and place around 35% from top of video
  const osdWidth = 130
  const targetX = Math.max(
    16,
    Math.min(
      window.innerWidth - osdWidth - 16,
      rect.left + rect.width / 2 - osdWidth / 2
    )
  )
  const targetY = Math.max(
    16,
    Math.min(window.innerHeight - 60, rect.top + rect.height * 0.35)
  )

  osd.style.left = `${targetX}px`
  osd.style.top = `${targetY}px`

  // Icons
  let iconSvg = ""
  let barColor = "#818cf8"

  if (type === "mute") {
    iconSvg = `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#f87171" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><line x1="22" y1="9" x2="16" y2="15"/><line x1="16" y1="9" x2="22" y2="15"/></svg>`
    barColor = "#f87171"
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
  // If user explicitly specified modifiers and both match, prefer Speed if speedModifier is not 'none'
  if (isSpeedMatch && currentConfig.speedModifier !== "none") {
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
 * Handles middle-click (auxclick with button 1) on videos to toggle mute.
 */
function onAuxClick(event: MouseEvent): void {
  if (!isActive || !currentConfig.middleClickToMute || event.button !== 1) {
    return
  }

  const target = event.target as HTMLElement | null
  if (!target) return

  let video: HTMLVideoElement | null = null
  if (target.tagName.toLowerCase() === "video") {
    video = target as HTMLVideoElement
  } else {
    video =
      target.querySelector("video") ||
      target
        .closest(".html5-video-player, .video-player, [data-player]")
        ?.querySelector("video") ||
      null
  }

  if (video) {
    event.preventDefault()
    event.stopPropagation()
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

  window.addEventListener("auxclick", onAuxClick, { capture: true })
}

/**
 * Deactivates Video Wheel Control and cleans up all DOM elements.
 */
export function deactivate(): void {
  if (!isActive || typeof window === "undefined") return
  isActive = false

  unregisterWheelSubscriber("video-wheel-control")
  window.removeEventListener("auxclick", onAuxClick, { capture: true })

  if (osdHideTimeout) {
    clearTimeout(osdHideTimeout)
    osdHideTimeout = null
  }

  if (osdElement && osdElement.parentNode) {
    osdElement.parentNode.removeChild(osdElement)
    osdElement = null
  }
}
