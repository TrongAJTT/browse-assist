import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import { DEFAULT_IMAGE_HOVER_PREVIEW_CONFIG } from "~core/types"
import { activate, deactivate } from "../logic"

describe("image-hover-preview content logic", () => {
  let capturedShadowRoot: ShadowRoot | null = null

  beforeEach(() => {
    vi.useFakeTimers()
    vi.clearAllMocks()
    capturedShadowRoot = null
    document.body.innerHTML = ""

    const originalAttachShadow = Element.prototype.attachShadow
    vi.spyOn(Element.prototype, "attachShadow").mockImplementation(function (
      this: Element,
      init: ShadowRootInit
    ) {
      const root = originalAttachShadow.call(this, init)
      capturedShadowRoot = root
      return root
    })
  })

  afterEach(() => {
    deactivate()
    vi.restoreAllMocks()
    vi.useRealTimers()
  })

  it("shows preview card with dimensions badge after hover delay on thumbnail <img>", () => {
    document.body.innerHTML = `<img id="thumb" src="https://example.com/photo.jpg" />`
    const thumb = document.getElementById("thumb") as HTMLImageElement
    thumb.getBoundingClientRect = () =>
      ({ width: 100, height: 80, top: 20, left: 20 }) as DOMRect

    activate({
      ...DEFAULT_IMAGE_HOVER_PREVIEW_CONFIG,
      delayMs: 200,
      showDimensions: true
    })

    thumb.dispatchEvent(
      new MouseEvent("mouseover", {
        bubbles: true,
        shiftKey: true,
        clientX: 50,
        clientY: 50
      })
    )

    // Not shown before delay
    expect(document.getElementById("browse-assist-image-preview-host")).toBeNull()

    vi.advanceTimersByTime(200)

    expect(
      document.getElementById("browse-assist-image-preview-host")
    ).not.toBeNull()
    const previewImg = capturedShadowRoot!.querySelector(
      ".ihp-img"
    ) as HTMLImageElement
    const card = capturedShadowRoot!.querySelector(".ihp-card")!
    const badge = capturedShadowRoot!.querySelector(".ihp-badge")!

    expect(previewImg.src).toBe("https://example.com/photo.jpg")

    // Simulate image load with larger natural size
    Object.defineProperty(previewImg, "naturalWidth", {
      value: 1200,
      configurable: true
    })
    Object.defineProperty(previewImg, "naturalHeight", {
      value: 800,
      configurable: true
    })
    previewImg.onload?.(new Event("load"))

    expect(card.classList.contains("ihp-visible")).toBe(true)
    expect(badge.textContent).toBe("1200 × 800")
  })

  it("respects triggerModifier and previews image links when enabled", () => {
    document.body.innerHTML = `<a id="imglink" href="https://example.com/wall.webp">Wallpaper</a>`
    const link = document.getElementById("imglink")!

    activate({
      ...DEFAULT_IMAGE_HOVER_PREVIEW_CONFIG,
      triggerModifier: "shift",
      delayMs: 0,
      previewImageLinks: true
    })

    // Without Shift: should not trigger
    link.dispatchEvent(
      new MouseEvent("mouseover", { bubbles: true, shiftKey: false })
    )
    expect(document.getElementById("browse-assist-image-preview-host")).toBeNull()

    // With Shift: triggers immediately (delayMs: 0)
    link.dispatchEvent(
      new MouseEvent("mouseover", { bubbles: true, shiftKey: true })
    )
    const previewImg = capturedShadowRoot!.querySelector(
      ".ihp-img"
    ) as HTMLImageElement
    expect(previewImg.src).toBe("https://example.com/wall.webp")

    // Scroll hides preview
    Object.defineProperty(previewImg, "naturalWidth", {
      value: 800,
      configurable: true
    })
    Object.defineProperty(previewImg, "naturalHeight", {
      value: 600,
      configurable: true
    })
    previewImg.onload?.(new Event("load"))
    const card = capturedShadowRoot!.querySelector(".ihp-card")!
    expect(card.classList.contains("ihp-visible")).toBe(true)

    window.dispatchEvent(new Event("scroll"))
    expect(card.classList.contains("ihp-visible")).toBe(false)
  })

  it("triggers preview when pressing modifier key while already hovering and hides on keyup", () => {
    document.body.innerHTML = `<img id="thumb" src="https://example.com/pic.png" />`
    const thumb = document.getElementById("thumb") as HTMLImageElement
    thumb.getBoundingClientRect = () =>
      ({ width: 100, height: 80, top: 20, left: 20 }) as DOMRect

    activate({
      ...DEFAULT_IMAGE_HOVER_PREVIEW_CONFIG,
      triggerModifier: "shift",
      delayMs: 0
    })

    // Hover without Shift first: no preview
    thumb.dispatchEvent(
      new MouseEvent("mouseover", { bubbles: true, shiftKey: false })
    )
    expect(document.getElementById("browse-assist-image-preview-host")).toBeNull()

    // Press Shift while cursor is already on the image
    window.dispatchEvent(
      new KeyboardEvent("keydown", { key: "Shift", shiftKey: true, bubbles: true })
    )
    const previewImg = capturedShadowRoot!.querySelector(
      ".ihp-img"
    ) as HTMLImageElement
    Object.defineProperty(previewImg, "naturalWidth", {
      value: 1000,
      configurable: true
    })
    Object.defineProperty(previewImg, "naturalHeight", {
      value: 800,
      configurable: true
    })
    previewImg.onload?.(new Event("load"))

    const card = capturedShadowRoot!.querySelector(".ihp-card")!
    expect(card.classList.contains("ihp-visible")).toBe(true)

    // Release Shift: hides preview
    window.dispatchEvent(
      new KeyboardEvent("keyup", { key: "Shift", shiftKey: false, bubbles: true })
    )
    expect(card.classList.contains("ihp-visible")).toBe(false)
  })

  it("applies configured entrance animation to the preview card", () => {
    document.body.innerHTML = `<img id="thumb" src="https://example.com/anim.jpg" />`
    const thumb = document.getElementById("thumb") as HTMLImageElement
    thumb.getBoundingClientRect = () =>
      ({ width: 80, height: 80, top: 10, left: 10 }) as DOMRect

    activate({
      ...DEFAULT_IMAGE_HOVER_PREVIEW_CONFIG,
      delayMs: 0,
      animation: "slide"
    })

    thumb.dispatchEvent(
      new MouseEvent("mouseover", { bubbles: true, shiftKey: true })
    )

    const previewImg = capturedShadowRoot!.querySelector(
      ".ihp-img"
    ) as HTMLImageElement
    Object.defineProperty(previewImg, "naturalWidth", {
      value: 600,
      configurable: true
    })
    Object.defineProperty(previewImg, "naturalHeight", {
      value: 400,
      configurable: true
    })
    previewImg.onload?.(new Event("load"))

    const card = capturedShadowRoot!.querySelector(".ihp-card") as HTMLElement
    const style = capturedShadowRoot!.querySelector("style")!
    expect(card.classList.contains("ihp-visible")).toBe(true)
    expect(card.dataset.animation).toBe("slide")
    expect(style.textContent).toContain("@keyframes ihp-zoom-in")
    expect(style.textContent).toContain("@keyframes ihp-fade-in")
    expect(style.textContent).toContain("@keyframes ihp-slide-in")
    expect(style.textContent).toContain("prefers-reduced-motion: reduce")
  })
})
