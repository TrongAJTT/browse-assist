import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

const { mockSendToBackground, mockCopyToClipboard, mockShowCopiedFeedback } =
  vi.hoisted(() => ({
    mockSendToBackground: vi.fn().mockResolvedValue({ success: true }),
    mockCopyToClipboard: vi.fn().mockResolvedValue(true),
    mockShowCopiedFeedback: vi.fn()
  }))

vi.mock("~core/messaging", async () => {
  const actual =
    await vi.importActual<typeof import("~core/messaging")>("~core/messaging")
  return {
    ...actual,
    sendToBackground: mockSendToBackground
  }
})

vi.mock("~core/linkUtils", async () => {
  const actual =
    await vi.importActual<typeof import("~core/linkUtils")>("~core/linkUtils")
  return {
    ...actual,
    copyToClipboard: mockCopyToClipboard,
    showCopiedFeedback: mockShowCopiedFeedback
  }
})

import { MESSAGE_TYPES } from "~core/messaging"
import { DEFAULT_SUPER_DRAG_CONFIG } from "~core/types"
import {
  MIN_DRAG_DISTANCE,
  activate,
  deactivate,
  updateSuperDragConfig
} from "../logic"

function createDragEvent(
  type: string,
  clientX: number,
  clientY: number
): Event {
  const event = new Event(type, { bubbles: true, cancelable: true }) as Event & {
    clientX: number
    clientY: number
  }
  event.clientX = clientX
  event.clientY = clientY
  return event
}

describe("super-drag content logic", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    document.body.innerHTML = ""
    activate({
      ...DEFAULT_SUPER_DRAG_CONFIG,
      indicatorStyle: "none"
    })
  })

  afterEach(() => {
    deactivate()
  })

  it("ignores drag events originating from editable elements", () => {
    document.body.innerHTML = `<input id="txt" value="hello" />`
    const input = document.getElementById("txt")!

    input.dispatchEvent(createDragEvent("dragstart", 100, 100))
    window.dispatchEvent(createDragEvent("dragend", 200, 100))

    expect(mockSendToBackground).not.toHaveBeenCalled()
    expect(mockCopyToClipboard).not.toHaveBeenCalled()
  })

  it("ignores drags shorter than MIN_DRAG_DISTANCE", () => {
    document.body.innerHTML = `<a id="lnk" href="https://example.com">Link</a>`
    const link = document.getElementById("lnk")!

    link.dispatchEvent(createDragEvent("dragstart", 100, 100))
    window.dispatchEvent(
      createDragEvent("dragend", 100 + MIN_DRAG_DISTANCE - 5, 100)
    )

    expect(mockSendToBackground).not.toHaveBeenCalled()
  })

  it("dispatches background action when dragging a hyperlink", () => {
    document.body.innerHTML = `<a id="lnk" href="https://example.com/docs?utm_source=x">Docs</a>`
    const link = document.getElementById("lnk")!

    link.dispatchEvent(createDragEvent("dragstart", 100, 100))
    window.dispatchEvent(createDragEvent("dragend", 180, 100))

    expect(mockSendToBackground).toHaveBeenCalledWith(
      MESSAGE_TYPES.SUPER_DRAG_EXECUTE_ACTION,
      {
        action: DEFAULT_SUPER_DRAG_CONFIG.linkActions.right,
        targetType: "link",
        payload: "https://example.com/docs?utm_source=x"
      }
    )
  })

  it("executes copy_markdown directly in content script for links", async () => {
    updateSuperDragConfig({
      ...DEFAULT_SUPER_DRAG_CONFIG,
      indicatorStyle: "none",
      linkActions: {
        ...DEFAULT_SUPER_DRAG_CONFIG.linkActions,
        down: "copy_markdown"
      }
    })

    document.body.innerHTML = `<a id="lnk" href="https://example.com/p?fbclid=123">Read [Guide]</a>`
    const link = document.getElementById("lnk")!

    link.dispatchEvent(createDragEvent("dragstart", 100, 100))
    window.dispatchEvent(createDragEvent("dragend", 100, 180))

    await vi.waitFor(() => {
      expect(mockCopyToClipboard).toHaveBeenCalledWith(
        "[Read Guide](https://example.com/p)"
      )
    })
    expect(mockShowCopiedFeedback).toHaveBeenCalledWith(
      "Copied Markdown",
      "[Read Guide](https://example.com/p)"
    )
  })

  it("dispatches search_image action when dragging an image", () => {
    updateSuperDragConfig({
      ...DEFAULT_SUPER_DRAG_CONFIG,
      openImages: true,
      indicatorStyle: "none",
      imageActions: {
        ...DEFAULT_SUPER_DRAG_CONFIG.imageActions,
        up: "search_image"
      }
    })

    document.body.innerHTML = `<img id="pic" src="https://example.com/photo.jpg" />`
    const img = document.getElementById("pic")!

    img.dispatchEvent(createDragEvent("dragstart", 200, 200))
    window.dispatchEvent(createDragEvent("dragend", 200, 130))

    expect(mockSendToBackground).toHaveBeenCalledWith(
      MESSAGE_TYPES.SUPER_DRAG_EXECUTE_ACTION,
      {
        action: "search_image",
        targetType: "image",
        payload: "https://example.com/photo.jpg"
      }
    )
  })
})
