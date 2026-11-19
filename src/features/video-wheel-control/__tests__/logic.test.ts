import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import { DEFAULT_VIDEO_WHEEL_CONTROL_CONFIG } from "~core/types"
import { activate, deactivate } from "../logic"

describe("video-wheel-control content logic", () => {
  function createMockVideo({
    volume = 0.5,
    playbackRate = 1.0,
    currentTime = 30,
    duration = 120
  } = {}) {
    const video = document.createElement("video")
    Object.defineProperty(video, "readyState", { value: 4, configurable: true })
    Object.defineProperty(video, "duration", {
      value: duration,
      configurable: true
    })
    video.volume = volume
    video.playbackRate = playbackRate
    video.currentTime = currentTime
    video.getBoundingClientRect = () =>
      ({
        width: 640,
        height: 360,
        top: 0,
        left: 0,
        right: 640,
        bottom: 360
      }) as DOMRect
    document.body.appendChild(video)

    // Make document.elementsFromPoint return the video when inside its rect
    document.elementsFromPoint = vi.fn((x: number, y: number) => {
      if (x >= 0 && x <= 640 && y >= 0 && y <= 360) return [video]
      return []
    })

    return video
  }

  beforeEach(() => {
    vi.clearAllMocks()
    document.body.innerHTML = ""
  })

  afterEach(() => {
    deactivate()
    vi.restoreAllMocks()
  })

  it("adjusts volume when scrolling over video with Shift held", () => {
    const video = createMockVideo({ volume: 0.5 })
    activate({
      ...DEFAULT_VIDEO_WHEEL_CONTROL_CONFIG,
      enableVolume: true,
      volumeModifier: "shift",
      volumeStep: 0.1,
      invertVolumeScroll: false,
      showOsd: false
    })

    const wheelUp = new WheelEvent("wheel", {
      deltaY: -100,
      shiftKey: true,
      clientX: 100,
      clientY: 100,
      bubbles: true,
      cancelable: true
    })
    video.dispatchEvent(wheelUp)

    expect(wheelUp.defaultPrevented).toBe(true)
    expect(video.volume).toBeCloseTo(0.6, 5)
  })

  it("does not block Shift+Click on links outside video, but blocks over video for clickToMute", () => {
    const video = createMockVideo({ volume: 0.5 })
    const link = document.createElement("a")
    link.href = "https://example.com"
    link.getBoundingClientRect = () =>
      ({
        width: 100,
        height: 20,
        top: 500,
        left: 10,
        right: 110,
        bottom: 520
      }) as DOMRect
    document.body.appendChild(link)

    activate({
      ...DEFAULT_VIDEO_WHEEL_CONTROL_CONFIG,
      enableVolume: true,
      volumeModifier: "shift",
      clickToMute: true,
      showOsd: false
    })

    // Shift+Click outside video (at y=510): should NOT be prevented
    const outsideClick = new MouseEvent("click", {
      button: 0,
      shiftKey: true,
      clientX: 50,
      clientY: 510,
      bubbles: true,
      cancelable: true
    })
    link.dispatchEvent(outsideClick)
    expect(outsideClick.defaultPrevented).toBe(false)

    // Shift+Click over video (at y=100): should be prevented & toggle mute
    const videoMouseDown = new MouseEvent("mousedown", {
      button: 0,
      shiftKey: true,
      clientX: 100,
      clientY: 100,
      bubbles: true,
      cancelable: true
    })
    video.dispatchEvent(videoMouseDown)
    expect(video.muted).toBe(true)

    const videoClick = new MouseEvent("click", {
      button: 0,
      shiftKey: true,
      clientX: 100,
      clientY: 100,
      bubbles: true,
      cancelable: true
    })
    video.dispatchEvent(videoClick)
    expect(videoClick.defaultPrevented).toBe(true)
  })

  it("handles Hold-to-Boost ('X'), ignores Ctrl+X, and restores playbackRate on window blur", () => {
    const video = createMockVideo({ playbackRate: 1.25 })
    activate({
      ...DEFAULT_VIDEO_WHEEL_CONTROL_CONFIG,
      enableHoldToBoost: true,
      boostSpeed: 2.0,
      showOsd: false
    })

    // Ctrl+X should NOT trigger boost
    window.dispatchEvent(
      new KeyboardEvent("keydown", { key: "x", ctrlKey: true, bubbles: true })
    )
    expect(video.playbackRate).toBe(1.25)

    // Plain 'x' triggers boost
    window.dispatchEvent(new KeyboardEvent("keydown", { key: "x", bubbles: true }))
    expect(video.playbackRate).toBe(2.0)

    // Window blur restores original playbackRate
    window.dispatchEvent(new Event("blur"))
    expect(video.playbackRate).toBe(1.25)
  })
})
