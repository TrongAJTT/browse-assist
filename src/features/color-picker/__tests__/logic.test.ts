import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

const { mockCopyToClipboard, mockShowContentToast, mockStorage } = vi.hoisted(
  () => ({
    mockCopyToClipboard: vi.fn().mockResolvedValue(true),
    mockShowContentToast: vi.fn(),
    mockStorage: {
      get: vi.fn().mockResolvedValue([]),
      set: vi.fn().mockResolvedValue(undefined)
    }
  })
)

vi.mock("~core/linkUtils", () => ({
  copyToClipboard: mockCopyToClipboard
}))

vi.mock("~core/toast", () => ({
  showContentToast: mockShowContentToast
}))

vi.mock("~core/storage", () => ({
  extensionStorage: mockStorage
}))

import { MESSAGE_TYPES } from "~core/messaging"
import { DEFAULT_COLOR_PICKER_CONFIG } from "~core/types"
import { activate, deactivate, updateColorPickerConfig } from "../logic"

describe("color-picker content logic", () => {
  let messageListener:
    | ((
        msg: { action?: string; type?: string },
        sender: chrome.runtime.MessageSender,
        sendResponse: (res?: unknown) => void
      ) => boolean | void)
    | null = null

  beforeEach(() => {
    vi.clearAllMocks()
    document.body.innerHTML = ""
    messageListener = null

    mockCopyToClipboard.mockResolvedValue(true)
    mockStorage.get.mockResolvedValue([])
    mockStorage.set.mockResolvedValue(undefined)

    const globalObj = globalThis as unknown as Record<string, unknown>
    globalObj.chrome = {
      runtime: {
        onMessage: {
          addListener: vi.fn((fn) => {
            messageListener = fn
          }),
          removeListener: vi.fn((fn) => {
            if (messageListener === fn) messageListener = null
          })
        }
      }
    }
    ;(window as unknown as { EyeDropper: unknown }).EyeDropper = class {
      async open() {
        return { sRGBHex: "#4f46e5" }
      }
    }
  })

  afterEach(() => {
    deactivate()
    delete (window as unknown as { EyeDropper?: unknown }).EyeDropper
  })

  async function triggerPicker() {
    expect(messageListener).not.toBeNull()
    await new Promise<void>((resolve) => {
      messageListener!(
        { type: MESSAGE_TYPES.TRIGGER_COLOR_PICKER },
        {} as chrome.runtime.MessageSender,
        () => resolve()
      )
    })
  }

  it("picks color, saves history, auto-copies, shows toast, and mounts floating palette modal", async () => {
    activate({
      ...DEFAULT_COLOR_PICKER_CONFIG,
      defaultFormat: "hex",
      autoCopy: true,
      showToast: true,
      showPaletteModal: true
    })

    await triggerPicker()

    expect(mockStorage.set).toHaveBeenCalledTimes(1)
    expect(mockCopyToClipboard).toHaveBeenCalledWith("#4F46E5")
    expect(mockShowContentToast).toHaveBeenCalledWith(
      expect.objectContaining({
        message: "Color Picked & Copied",
        detail: "#4F46E5"
      })
    )
    expect(
      document.getElementById("browse-assist-color-palette-host")
    ).not.toBeNull()

    deactivate()
    expect(
      document.getElementById("browse-assist-color-palette-host")
    ).toBeNull()
  })

  it("skips floating palette modal when showPaletteModal is false", async () => {
    activate({
      ...DEFAULT_COLOR_PICKER_CONFIG,
      showPaletteModal: false
    })
    updateColorPickerConfig({ defaultFormat: "rgb" })

    await triggerPicker()

    expect(mockCopyToClipboard).toHaveBeenCalledWith("rgb(79, 70, 229)")
    expect(
      document.getElementById("browse-assist-color-palette-host")
    ).toBeNull()
  })
})
