import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import { DEFAULT_QUICK_SCROLL_CONFIG } from "~core/types"
import { activate, deactivate } from "../logic"

describe("quick-scroll content logic", () => {
  let capturedShadowRoot: ShadowRoot | null = null
  let scrollToMock: ReturnType<typeof vi.fn>

  function setPageMetrics({
    scrollY = 0,
    innerHeight = 800,
    scrollHeight = 3000
  }: {
    scrollY?: number
    innerHeight?: number
    scrollHeight?: number
  }) {
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
    Object.defineProperty(document.documentElement, "clientHeight", {
      value: innerHeight,
      configurable: true
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
    vi.useFakeTimers()
    vi.clearAllMocks()
    capturedShadowRoot = null
    document.body.innerHTML = ""

    scrollToMock = vi.fn()
    window.scrollTo = scrollToMock

    const originalAttachShadow = Element.prototype.attachShadow
    vi.spyOn(Element.prototype, "attachShadow").mockImplementation(function (
      this: Element,
      init: ShadowRootInit
    ) {
      const root = originalAttachShadow.call(this, init)
      capturedShadowRoot = root
      return root
    })

    setPageMetrics({ scrollY: 0, innerHeight: 800, scrollHeight: 3000 })
  })

  afterEach(() => {
    deactivate()
    vi.restoreAllMocks()
    vi.useRealTimers()
  })

  it("mounts Shadow DOM host on activate and removes it on deactivate", () => {
    activate(DEFAULT_QUICK_SCROLL_CONFIG, "dark")

    const host = document.getElementById("browse-assist-quick-scroll-host")
    expect(host).not.toBeNull()
    expect(capturedShadowRoot).not.toBeNull()

    deactivate()
    expect(document.getElementById("browse-assist-quick-scroll-host")).toBeNull()
  })

  it("hides container when page is not tall enough or at the very top", () => {
    setPageMetrics({ scrollY: 0, innerHeight: 800, scrollHeight: 1000 })
    activate(DEFAULT_QUICK_SCROLL_CONFIG)

    const container = capturedShadowRoot!.querySelector(".qs-container")!
    expect(container.classList.contains("qs-hidden")).toBe(true)

    // Tall page, still at scrollY = 0
    setPageMetrics({ scrollY: 0, innerHeight: 800, scrollHeight: 3000 })
    activate(DEFAULT_QUICK_SCROLL_CONFIG)
    expect(container.classList.contains("qs-hidden")).toBe(true)
  })

  it("shows top & bottom buttons mid-page in both mode, and hides bottom in top-only mode", () => {
    setPageMetrics({ scrollY: 600, innerHeight: 800, scrollHeight: 3000 })
    activate({ ...DEFAULT_QUICK_SCROLL_CONFIG, buttonsMode: "both" })

    const container = capturedShadowRoot!.querySelector(".qs-container")!
    const [topBtn, bottomBtn] = Array.from(
      capturedShadowRoot!.querySelectorAll(".qs-button")
    )

    expect(container.classList.contains("qs-hidden")).toBe(false)
    expect(topBtn.classList.contains("qs-hidden")).toBe(false)
    expect(bottomBtn.classList.contains("qs-hidden")).toBe(false)

    // Switch to top-only
    activate({ ...DEFAULT_QUICK_SCROLL_CONFIG, buttonsMode: "top-only" })
    expect(topBtn.classList.contains("qs-hidden")).toBe(false)
    expect(bottomBtn.classList.contains("qs-hidden")).toBe(true)
  })

  it("applies and updates data-shape attribute for circle, capsule, and rounded styles", () => {
    setPageMetrics({ scrollY: 600, innerHeight: 800, scrollHeight: 3000 })
    activate({ ...DEFAULT_QUICK_SCROLL_CONFIG, buttonShape: "capsule" })

    const container = capturedShadowRoot!.querySelector(".qs-container")!
    expect(container.getAttribute("data-shape")).toBe("capsule")

    activate({ ...DEFAULT_QUICK_SCROLL_CONFIG, buttonShape: "rounded" })
    expect(container.getAttribute("data-shape")).toBe("rounded")
  })

  it("auto-dims on idle when autoHide is true and cancels pending timer when disabled", () => {
    setPageMetrics({ scrollY: 600, innerHeight: 800, scrollHeight: 3000 })
    activate({ ...DEFAULT_QUICK_SCROLL_CONFIG, autoHide: true })

    const container = capturedShadowRoot!.querySelector(".qs-container")!
    expect(container.classList.contains("qs-dimmed")).toBe(false)

    // Disable autoHide before 2400ms elapses
    activate({ ...DEFAULT_QUICK_SCROLL_CONFIG, autoHide: false })
    vi.advanceTimersByTime(3000)
    expect(container.classList.contains("qs-dimmed")).toBe(false)

    // Re-enable autoHide and verify dimming after 2400ms
    activate({ ...DEFAULT_QUICK_SCROLL_CONFIG, autoHide: true })
    vi.advanceTimersByTime(2500)
    expect(container.classList.contains("qs-dimmed")).toBe(true)
  })

  it("saves scroll position and returns on second click when enableReturnMemory is true", () => {
    setPageMetrics({ scrollY: 950, innerHeight: 800, scrollHeight: 3000 })
    activate({ ...DEFAULT_QUICK_SCROLL_CONFIG, enableReturnMemory: true })

    const topBtn = capturedShadowRoot!.querySelectorAll(
      ".qs-button"
    )[0] as HTMLButtonElement

    // First click: scroll to top and store memory (950)
    topBtn.click()
    expect(scrollToMock).toHaveBeenCalledWith({ top: 0, behavior: "smooth" })

    // Second click: return to saved 950
    topBtn.click()
    expect(scrollToMock).toHaveBeenLastCalledWith({
      top: 950,
      behavior: "smooth"
    })
  })

  it("applies custom opacity CSS variable on container", () => {
    setPageMetrics({ scrollY: 600, innerHeight: 800, scrollHeight: 3000 })
    activate({ ...DEFAULT_QUICK_SCROLL_CONFIG, opacity: 0.7 })

    const container = capturedShadowRoot!.querySelector(
      ".qs-container"
    ) as HTMLElement
    expect(container.style.getPropertyValue("--qs-opacity")).toBe("0.7")
  })

  it("hides container when hideOnNativeButton is enabled and page has a fixed scroll-to-top button", () => {
    setPageMetrics({ scrollY: 600, innerHeight: 800, scrollHeight: 3000 })

    const nativeBtn = document.createElement("button")
    nativeBtn.className = "back-to-top"
    nativeBtn.style.position = "fixed"
    nativeBtn.getBoundingClientRect = () =>
      ({
        width: 40,
        height: 40,
        top: 700,
        left: 900,
        right: 940,
        bottom: 740,
        x: 900,
        y: 700,
        toJSON: () => ({})
      }) as DOMRect
    document.body.appendChild(nativeBtn)

    activate({ ...DEFAULT_QUICK_SCROLL_CONFIG, hideOnNativeButton: true })

    const container = capturedShadowRoot!.querySelector(".qs-container")!
    expect(container.classList.contains("qs-hidden")).toBe(true)

    // Disabling hideOnNativeButton reveals Quick Scroll again
    activate({ ...DEFAULT_QUICK_SCROLL_CONFIG, hideOnNativeButton: false })
    expect(container.classList.contains("qs-hidden")).toBe(false)
  })
})
