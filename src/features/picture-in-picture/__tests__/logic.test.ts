import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

const { mockSendToBackground, mockShowContentToast, mockRemoveContentToast } =
  vi.hoisted(() => ({
    mockSendToBackground: vi.fn().mockResolvedValue(undefined),
    mockShowContentToast: vi.fn(),
    mockRemoveContentToast: vi.fn()
  }))

vi.mock("~core/messaging", async () => {
  const actual =
    await vi.importActual<typeof import("~core/messaging")>("~core/messaging")
  return {
    ...actual,
    sendToBackground: mockSendToBackground
  }
})

vi.mock("~core/toast", () => ({
  showContentToast: mockShowContentToast,
  removeContentToast: mockRemoveContentToast
}))

import { DEFAULT_PICTURE_IN_PICTURE_CONFIG } from "~core/types"
import {
  activate,
  deactivate,
  togglePictureInPicture,
  updatePictureInPictureConfig
} from "../logic"

describe("picture-in-picture content logic", () => {
  let pipElement: Element | null = null

  beforeEach(() => {
    vi.clearAllMocks()
    mockSendToBackground.mockResolvedValue(undefined)
    pipElement = null
    document.body.innerHTML = ""

    Object.defineProperty(document, "pictureInPictureElement", {
      get: () => pipElement,
      configurable: true
    })
    ;(
      document as unknown as {
        exitPictureInPicture: () => Promise<void>
      }
    ).exitPictureInPicture = vi.fn(async () => {
      pipElement = null
    })

    const globalObj = globalThis as unknown as Record<string, unknown>
    globalObj.chrome = {
      runtime: {
        onMessage: {
          addListener: vi.fn(),
          removeListener: vi.fn()
        }
      }
    }
  })

  afterEach(() => {
    deactivate()
    vi.restoreAllMocks()
  })

  it("strips disablepictureinpicture and enters PiP on best candidate video", async () => {
    const video = document.createElement("video")
    video.setAttribute("disablepictureinpicture", "")
    video.disablePictureInPicture = true
    Object.defineProperty(video, "readyState", { value: 4, configurable: true })
    Object.defineProperty(video, "paused", { value: false, configurable: true })
    video.getBoundingClientRect = () =>
      ({ width: 640, height: 360, top: 0, left: 0, right: 640, bottom: 360 }) as DOMRect
    video.requestPictureInPicture = vi.fn(async () => {
      pipElement = video
      return {} as PictureInPictureWindow
    })
    document.body.appendChild(video)

    activate(DEFAULT_PICTURE_IN_PICTURE_CONFIG)
    await togglePictureInPicture()

    expect(video.hasAttribute("disablepictureinpicture")).toBe(false)
    expect(video.disablePictureInPicture).toBe(false)
    expect(video.requestPictureInPicture).toHaveBeenCalledTimes(1)
    expect(mockShowContentToast).toHaveBeenCalledWith(
      expect.objectContaining({ message: "Entered Picture-in-Picture" })
    )
  })

  it("shows unsupported toast when requestPictureInPicture is unavailable", async () => {
    const video = document.createElement("video")
    Object.defineProperty(video, "readyState", { value: 4, configurable: true })
    Object.defineProperty(video, "paused", { value: false, configurable: true })
    video.getBoundingClientRect = () =>
      ({ width: 640, height: 360, top: 0, left: 0, right: 640, bottom: 360 }) as DOMRect
    ;(video as unknown as { requestPictureInPicture: undefined }).requestPictureInPicture =
      undefined
    document.body.appendChild(video)

    activate(DEFAULT_PICTURE_IN_PICTURE_CONFIG)
    await togglePictureInPicture()

    expect(mockShowContentToast).toHaveBeenCalledWith(
      expect.objectContaining({
        message: "PiP is not supported in this browser",
        type: "error"
      })
    )
  })

  it("attaches pointermove listener only when hoverButton is enabled", () => {
    const addSpy = vi.spyOn(window, "addEventListener")
    const removeSpy = vi.spyOn(window, "removeEventListener")

    activate({ ...DEFAULT_PICTURE_IN_PICTURE_CONFIG, hoverButton: false })
    expect(addSpy).not.toHaveBeenCalledWith(
      "pointermove",
      expect.any(Function),
      expect.anything()
    )

    updatePictureInPictureConfig({ hoverButton: true })
    expect(addSpy).toHaveBeenCalledWith(
      "pointermove",
      expect.any(Function),
      expect.objectContaining({ capture: true })
    )

    updatePictureInPictureConfig({ hoverButton: false })
    expect(removeSpy).toHaveBeenCalledWith(
      "pointermove",
      expect.any(Function),
      expect.objectContaining({ capture: true })
    )
  })

  it("pauses playing video on leavepictureinpicture when autoPauseOnExit is enabled", () => {
    const video = document.createElement("video")
    Object.defineProperty(video, "paused", { value: false, configurable: true })
    video.pause = vi.fn()
    document.body.appendChild(video)

    activate({ ...DEFAULT_PICTURE_IN_PICTURE_CONFIG, autoPauseOnExit: true })
    video.dispatchEvent(new Event("leavepictureinpicture", { bubbles: true }))

    expect(video.pause).toHaveBeenCalledTimes(1)
  })
})
