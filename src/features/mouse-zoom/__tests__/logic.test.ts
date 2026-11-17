import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

const { mockShowContentToast, mockRemoveContentToast } = vi.hoisted(() => ({
  mockShowContentToast: vi.fn(),
  mockRemoveContentToast: vi.fn()
}))

vi.mock("~core/toast", () => ({
  showContentToast: mockShowContentToast,
  removeContentToast: mockRemoveContentToast
}))

import { DEFAULT_MOUSE_ZOOM_CONFIG } from "~core/types"
import { activate, deactivate, resetZoom } from "../logic"

describe("mouse-zoom content logic", () => {
  let scrollToMock: ReturnType<typeof vi.fn>

  beforeEach(() => {
    vi.clearAllMocks()
    document.body.innerHTML = ""
    document.body.style.removeProperty("zoom")

    scrollToMock = vi.fn()
    window.scrollTo = scrollToMock
  })

  afterEach(() => {
    deactivate()
    vi.restoreAllMocks()
  })

  it("zooms in/out with instant mode when Alt+Wheel is triggered and compensates scroll", () => {
    activate({
      ...DEFAULT_MOUSE_ZOOM_CONFIG,
      modifier: "alt",
      stepSize: 0.2,
      smooth: false,
      showToast: true
    })

    const wheelUp = new WheelEvent("wheel", {
      deltaY: -100,
      altKey: true,
      clientX: 200,
      clientY: 150,
      bubbles: true,
      cancelable: true
    })
    window.dispatchEvent(wheelUp)

    expect(wheelUp.defaultPrevented).toBe(true)
    expect((document.body.style as unknown as { zoom: string }).zoom).toBe("1.2")
    expect(scrollToMock).toHaveBeenCalledWith({
      left: 40,
      top: 30,
      behavior: "instant"
    })
    expect(mockShowContentToast).toHaveBeenCalledWith(
      expect.objectContaining({ message: "Page Zoom", detail: "120%" })
    )
  })

  it("resets zoom to 100% on Modifier + Middle Click", () => {
    activate({
      ...DEFAULT_MOUSE_ZOOM_CONFIG,
      modifier: "alt",
      stepSize: 0.25,
      smooth: false,
      showToast: true
    })

    window.dispatchEvent(
      new WheelEvent("wheel", {
        deltaY: -100,
        altKey: true,
        clientX: 100,
        clientY: 100,
        bubbles: true,
        cancelable: true
      })
    )
    expect((document.body.style as unknown as { zoom: string }).zoom).toBe("1.25")

    const middleClick = new MouseEvent("mousedown", {
      button: 1,
      altKey: true,
      bubbles: true,
      cancelable: true
    })
    window.dispatchEvent(middleClick)

    expect(middleClick.defaultPrevented).toBe(true)
    expect((document.body.style as unknown as { zoom: string }).zoom).toBe("")
    expect(mockShowContentToast).toHaveBeenLastCalledWith(
      expect.objectContaining({ detail: "100%" })
    )
  })

  it("suppresses trailing click after zooming with left-click modifier", () => {
    document.body.innerHTML = `<a id="lnk" href="https://example.com">Go</a>`
    const link = document.getElementById("lnk")!

    activate({
      ...DEFAULT_MOUSE_ZOOM_CONFIG,
      modifier: "left-click",
      stepSize: 0.1,
      smooth: false,
      showToast: false
    })

    link.dispatchEvent(
      new MouseEvent("mousedown", { button: 0, bubbles: true, cancelable: true })
    )
    window.dispatchEvent(
      new WheelEvent("wheel", {
        deltaY: -100,
        buttons: 1,
        clientX: 50,
        clientY: 50,
        bubbles: true,
        cancelable: true
      })
    )
    link.dispatchEvent(
      new MouseEvent("mouseup", { button: 0, bubbles: true, cancelable: true })
    )

    const trailingClick = new MouseEvent("click", {
      button: 0,
      bubbles: true,
      cancelable: true
    })
    link.dispatchEvent(trailingClick)

    expect(trailingClick.defaultPrevented).toBe(true)

    resetZoom()
    expect((document.body.style as unknown as { zoom: string }).zoom).toBe("")
  })
})
