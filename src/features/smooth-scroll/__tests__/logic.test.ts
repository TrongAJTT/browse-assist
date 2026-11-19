import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import { SMOOTH_SCROLL_PRESETS } from "~core/types"
import { activate, deactivate, updateSmoothScrollConfig } from "../logic"

describe("smooth-scroll content logic", () => {
  let scrollToMock: ReturnType<typeof vi.fn>
  let rafCallback: FrameRequestCallback | null = null

  function setPageScrollMetrics({
    scrollY = 0,
    innerHeight = 800,
    scrollHeight = 3000
  } = {}) {
    Object.defineProperty(window, "scrollY", {
      value: scrollY,
      configurable: true,
      writable: true
    })
    Object.defineProperty(window, "innerHeight", {
      value: innerHeight,
      configurable: true,
      writable: true
    })
    Object.defineProperty(document.documentElement, "scrollHeight", {
      value: scrollHeight,
      configurable: true
    })
    Object.defineProperty(document.body, "scrollHeight", {
      value: scrollHeight,
      configurable: true
    })
  }

  beforeEach(() => {
    vi.clearAllMocks()
    rafCallback = null
    document.body.innerHTML = ""
    setPageScrollMetrics()

    scrollToMock = vi.fn(({ top }: ScrollToOptions) => {
      if (typeof top === "number") {
        Object.defineProperty(window, "scrollY", {
          value: top,
          configurable: true,
          writable: true
        })
      }
    })
    window.scrollTo = scrollToMock

    vi.spyOn(window, "requestAnimationFrame").mockImplementation((cb) => {
      rafCallback = cb
      return 1
    })
    vi.spyOn(window, "cancelAnimationFrame").mockImplementation(() => {
      rafCallback = null
    })
  })

  afterEach(() => {
    deactivate()
    vi.restoreAllMocks()
  })

  it("intercepts vertical wheel events and interpolates scroll position", () => {
    activate({ ...SMOOTH_SCROLL_PRESETS.balanced, interceptionMode: "smart" })

    const wheelEvent = new WheelEvent("wheel", {
      deltaY: 100,
      deltaMode: 0,
      bubbles: true,
      cancelable: true
    })
    window.dispatchEvent(wheelEvent)

    expect(wheelEvent.defaultPrevented).toBe(true)
    expect(rafCallback).not.toBeNull()

    // Execute one animation frame: 0 + 100 * 0.18 = 18
    rafCallback!(16)
    expect(scrollToMock).toHaveBeenCalledWith({
      top: 18,
      behavior: "instant"
    })
  })

  it("does not intercept wheel events when modifier keys are pressed or horizontal", () => {
    activate({ ...SMOOTH_SCROLL_PRESETS.balanced })

    const ctrlWheel = new WheelEvent("wheel", {
      deltaY: 100,
      ctrlKey: true,
      cancelable: true
    })
    window.dispatchEvent(ctrlWheel)
    expect(ctrlWheel.defaultPrevented).toBe(false)

    const horizontalWheel = new WheelEvent("wheel", {
      deltaX: 150,
      deltaY: 20,
      cancelable: true
    })
    window.dispatchEvent(horizontalWheel)
    expect(horizontalWheel.defaultPrevented).toBe(false)
  })

  it("skips interactive surfaces in smart mode but intercepts in aggressive mode", () => {
    document.body.innerHTML = `<canvas id="board"></canvas>`
    const canvas = document.getElementById("board")!

    activate({ ...SMOOTH_SCROLL_PRESETS.balanced, interceptionMode: "smart" })
    const smartEvent = new WheelEvent("wheel", {
      deltaY: 100,
      bubbles: true,
      cancelable: true
    })
    canvas.dispatchEvent(smartEvent)
    expect(smartEvent.defaultPrevented).toBe(false)

    updateSmoothScrollConfig({ interceptionMode: "aggressive" })
    const aggressiveEvent = new WheelEvent("wheel", {
      deltaY: 100,
      bubbles: true,
      cancelable: true
    })
    canvas.dispatchEvent(aggressiveEvent)
    expect(aggressiveEvent.defaultPrevented).toBe(true)
  })

  it("bypasses small-delta touchpad events when ignoreTouchpad is enabled", () => {
    activate({ ...SMOOTH_SCROLL_PRESETS.balanced, ignoreTouchpad: true })

    const touchpadWheel = new WheelEvent("wheel", {
      deltaY: 12,
      deltaMode: 0,
      cancelable: true
    })
    window.dispatchEvent(touchpadWheel)
    expect(touchpadWheel.defaultPrevented).toBe(false)

    const mouseWheel = new WheelEvent("wheel", {
      deltaY: 100,
      deltaMode: 0,
      cancelable: true
    })
    window.dispatchEvent(mouseWheel)
    expect(mouseWheel.defaultPrevented).toBe(true)
  })

  it("smoothly interpolates ArrowDown when keyboardScroll is enabled and ignores inputs", () => {
    activate({ ...SMOOTH_SCROLL_PRESETS.balanced, keyboardScroll: true })

    // Inside input: should not intercept
    document.body.innerHTML = `<input id="search" />`
    const input = document.getElementById("search")!
    const inputKey = new KeyboardEvent("keydown", {
      key: "ArrowDown",
      bubbles: true,
      cancelable: true
    })
    input.dispatchEvent(inputKey)
    expect(inputKey.defaultPrevented).toBe(false)

    // On document body: should intercept and interpolate (+60 * 0.18 = 10.8)
    const bodyKey = new KeyboardEvent("keydown", {
      key: "ArrowDown",
      bubbles: true,
      cancelable: true
    })
    document.body.dispatchEvent(bodyKey)
    expect(bodyKey.defaultPrevented).toBe(true)
    expect(rafCallback).not.toBeNull()

    rafCallback!(16)
    expect(scrollToMock).toHaveBeenCalledWith({
      top: expect.closeTo(10.8, 5),
      behavior: "instant"
    })
  })
})
