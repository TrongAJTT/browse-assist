import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

const { mockShowContentToast } = vi.hoisted(() => ({
  mockShowContentToast: vi.fn()
}))

vi.mock("~core/toast", () => ({
  showContentToast: mockShowContentToast
}))

import {
  activate,
  deactivate,
  isRightClickActive,
  toggleRightClick
} from "../logic"

describe("allow-right-click content logic", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    document.head.innerHTML = ""
    document.body.innerHTML = ""
    deactivate()
  })

  afterEach(() => {
    deactivate()
  })

  it("injects user-select override styles on activate and removes on deactivate", () => {
    expect(isRightClickActive()).toBe(false)

    activate()
    expect(isRightClickActive()).toBe(true)
    const styleEl = document.getElementById(
      "browse-assist-allow-right-click-styles"
    )
    expect(styleEl).not.toBeNull()
    expect(styleEl?.textContent).toContain("user-select: auto !important")

    deactivate()
    expect(isRightClickActive()).toBe(false)
    expect(
      document.getElementById("browse-assist-allow-right-click-styles")
    ).toBeNull()
  })

  it("stops propagation for restricted events including paste in capture phase", () => {
    const child = document.createElement("div")
    document.body.appendChild(child)

    const bubbleContextMenu = vi.fn()
    const bubblePaste = vi.fn()
    const bubbleCopy = vi.fn()
    child.addEventListener("contextmenu", bubbleContextMenu)
    child.addEventListener("paste", bubblePaste)
    child.addEventListener("copy", bubbleCopy)

    activate()

    child.dispatchEvent(new MouseEvent("contextmenu", { bubbles: true }))
    child.dispatchEvent(new Event("paste", { bubbles: true }))
    child.dispatchEvent(new Event("copy", { bubbles: true }))

    expect(bubbleContextMenu).not.toHaveBeenCalled()
    expect(bubblePaste).not.toHaveBeenCalled()
    expect(bubbleCopy).not.toHaveBeenCalled()
  })

  it("blocks mousedown propagation only for right button (button === 2)", () => {
    const child = document.createElement("button")
    document.body.appendChild(child)

    const onMouseDown = vi.fn()
    child.addEventListener("mousedown", onMouseDown)

    activate()

    child.dispatchEvent(new MouseEvent("mousedown", { bubbles: true, button: 0 }))
    expect(onMouseDown).toHaveBeenCalledTimes(1)

    child.dispatchEvent(new MouseEvent("mousedown", { bubbles: true, button: 2 }))
    expect(onMouseDown).toHaveBeenCalledTimes(1)
  })

  it("clears inline handlers on document and body", () => {
    document.oncontextmenu = () => false
    document.onpaste = () => false
    document.body.oncontextmenu = () => false
    document.body.oncopy = () => false
    document.body.onpaste = () => false

    activate()

    expect(document.oncontextmenu).toBeNull()
    expect(document.onpaste).toBeNull()
    expect(document.body.oncontextmenu).toBeNull()
    expect(document.body.oncopy).toBeNull()
    expect(document.body.onpaste).toBeNull()
  })

  it("toggles state and shows feedback toast", () => {
    expect(toggleRightClick(true)).toBe(true)
    expect(mockShowContentToast).toHaveBeenCalledWith(
      expect.objectContaining({
        message: "Right Click Enabled",
        type: "success"
      })
    )

    expect(toggleRightClick(true)).toBe(false)
    expect(mockShowContentToast).toHaveBeenCalledWith(
      expect.objectContaining({
        message: "Right Click Disabled",
        type: "info"
      })
    )
  })
})
