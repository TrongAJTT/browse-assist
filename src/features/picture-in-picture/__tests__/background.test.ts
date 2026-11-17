import { beforeEach, describe, expect, it, vi } from "vitest"

const { mockExtensionStorage } = vi.hoisted(() => ({
  mockExtensionStorage: {
    get: vi.fn(),
    watch: vi.fn()
  }
}))

vi.mock("~core/storage", () => ({
  extensionStorage: mockExtensionStorage
}))

import { MESSAGE_TYPES } from "~core/messaging"
import { DEFAULT_SETTINGS } from "~core/types"
import { initPictureInPictureBackground } from "../background"

describe("picture-in-picture background", () => {
  let onMessageListener:
    | ((
        msg: unknown,
        sender: chrome.runtime.MessageSender,
        sendResponse: (res?: unknown) => void
      ) => boolean | void)
    | null = null
  let onTabRemovedListener: ((tabId: number) => void) | null = null
  let setBadgeTextMock: ReturnType<typeof vi.fn>
  let setTitleMock: ReturnType<typeof vi.fn>

  beforeEach(async () => {
    vi.clearAllMocks()
    onMessageListener = null
    onTabRemovedListener = null
    setBadgeTextMock = vi.fn().mockResolvedValue(undefined)
    setTitleMock = vi.fn().mockResolvedValue(undefined)

    mockExtensionStorage.get.mockResolvedValue({
      ...DEFAULT_SETTINGS,
      pictureInPicture: true,
      pictureInPictureConfig: {
        ...DEFAULT_SETTINGS.pictureInPictureConfig,
        showBadge: true
      }
    })

    const globalObj = globalThis as unknown as Record<string, unknown>
    globalObj.chrome = {
      action: {
        setBadgeText: setBadgeTextMock,
        setBadgeBackgroundColor: vi.fn().mockResolvedValue(undefined),
        setTitle: setTitleMock
      },
      runtime: {
        onMessage: {
          addListener: vi.fn((fn) => {
            onMessageListener = fn
          })
        }
      },
      tabs: {
        onRemoved: {
          addListener: vi.fn((fn) => {
            onTabRemovedListener = fn
          })
        },
        get: vi.fn(),
        update: vi.fn()
      },
      commands: {
        onCommand: {
          addListener: vi.fn()
        }
      }
    }

    await initPictureInPictureBackground()
  })

  it("tracks active PiP session, updates badge, and clears when tab is removed", async () => {
    onMessageListener!(
      { type: MESSAGE_TYPES.PIP_STATUS_CHANGED, isPip: true, title: "Demo Video" },
      { tab: { id: 88, title: "Demo Video" } as chrome.tabs.Tab } as chrome.runtime.MessageSender,
      vi.fn()
    )

    await vi.waitFor(() => {
      expect(setBadgeTextMock).toHaveBeenCalledWith({ text: "PiP" })
    })

    const sessionRes = await new Promise<unknown>((resolve) => {
      onMessageListener!(
        { type: MESSAGE_TYPES.GET_ACTIVE_PIP_SESSION },
        {} as chrome.runtime.MessageSender,
        resolve
      )
    })
    expect(sessionRes).toEqual({ session: { tabId: 88, title: "Demo Video" } })

    onTabRemovedListener!(88)
    await vi.waitFor(() => {
      expect(setBadgeTextMock).toHaveBeenLastCalledWith({ text: "" })
    })
  })
})
