import { beforeEach, describe, expect, it, vi } from "vitest"

const { mockExtensionStorage } = vi.hoisted(() => ({
  mockExtensionStorage: {
    get: vi.fn()
  }
}))

vi.mock("~core/storage", () => ({
  extensionStorage: mockExtensionStorage
}))

import { MESSAGE_TYPES } from "~core/messaging"
import { DEFAULT_SETTINGS } from "~core/types"
import { initSuperDragBackground } from "../background"

describe("super-drag background", () => {
  let messageListener:
    | ((
        msg: unknown,
        sender: chrome.runtime.MessageSender,
        sendResponse: (res?: unknown) => void
      ) => boolean | void)
    | null = null

  let tabsCreateMock: ReturnType<typeof vi.fn>
  let tabsUpdateMock: ReturnType<typeof vi.fn>
  let searchQueryMock: ReturnType<typeof vi.fn>
  let isAllowedIncognitoMock: ReturnType<typeof vi.fn>

  beforeEach(async () => {
    vi.clearAllMocks()
    messageListener = null

    tabsCreateMock = vi.fn()
    tabsUpdateMock = vi.fn().mockResolvedValue(undefined)
    searchQueryMock = vi.fn().mockResolvedValue(undefined)
    isAllowedIncognitoMock = vi.fn((cb) => cb(false))

    mockExtensionStorage.get.mockResolvedValue({
      ...DEFAULT_SETTINGS,
      superDrag: true
    })

    const globalObj = globalThis as unknown as Record<string, unknown>
    globalObj.chrome = {
      runtime: {
        onMessage: {
          hasListener: vi.fn(() => messageListener !== null),
          addListener: vi.fn((fn) => {
            messageListener = fn
          })
        }
      },
      tabs: {
        create: tabsCreateMock,
        update: tabsUpdateMock
      },
      search: {
        query: searchQueryMock
      },
      extension: {
        isAllowedIncognitoAccess: isAllowedIncognitoMock
      },
      windows: {
        create: vi.fn().mockResolvedValue(undefined)
      }
    }

    await initSuperDragBackground()
  })

  async function sendAction(
    msg: Record<string, unknown>,
    senderTab: Partial<chrome.tabs.Tab> = { id: 10, index: 2 }
  ) {
    return new Promise<unknown>((resolve) => {
      messageListener!(
        msg,
        { tab: senderTab as chrome.tabs.Tab } as chrome.runtime.MessageSender,
        resolve
      )
    })
  }

  it("returns disabled reason when superDrag master toggle is off", async () => {
    mockExtensionStorage.get.mockResolvedValue({
      ...DEFAULT_SETTINGS,
      superDrag: false
    })

    const res = await sendAction({
      type: MESSAGE_TYPES.SUPER_DRAG_EXECUTE_ACTION,
      action: "open_bg_tab",
      targetType: "link",
      payload: "https://example.com"
    })

    expect(res).toEqual({ success: false, reason: "disabled" })
    expect(tabsCreateMock).not.toHaveBeenCalled()
  })

  it("uses chrome.search.query for text drag and restores sender tab focus on open_bg_tab", async () => {
    const res = await sendAction({
      type: MESSAGE_TYPES.SUPER_DRAG_EXECUTE_ACTION,
      action: "open_bg_tab",
      targetType: "text",
      payload: "plasmo vitest"
    })

    expect(res).toEqual({ success: true })
    expect(searchQueryMock).toHaveBeenCalledWith({
      text: "plasmo vitest",
      disposition: "NEW_TAB"
    })
    expect(tabsUpdateMock).toHaveBeenCalledWith(10, { active: true })
  })

  it("falls back to Google search URL when chrome.search.query rejects", async () => {
    searchQueryMock.mockRejectedValueOnce(new Error("Search API unavailable"))

    await sendAction({
      type: MESSAGE_TYPES.SUPER_DRAG_EXECUTE_ACTION,
      action: "open_active_tab",
      targetType: "text",
      payload: "hello world"
    })

    expect(tabsCreateMock).toHaveBeenCalledWith({
      url: "https://www.google.com/search?q=hello%20world",
      active: true,
      index: 3
    })
  })

  it("opens Google Lens URL for search_image action", async () => {
    await sendAction({
      type: MESSAGE_TYPES.SUPER_DRAG_EXECUTE_ACTION,
      action: "search_image",
      targetType: "image",
      payload: "https://example.com/pic.png?utm_source=ig"
    })

    expect(tabsCreateMock).toHaveBeenCalledWith({
      url: "https://lens.google.com/uploadbyurl?url=https%3A%2F%2Fexample.com%2Fpic.png",
      active: true,
      index: 3
    })
  })

  it("falls back to normal tab when incognito access is not granted", async () => {
    await sendAction({
      type: MESSAGE_TYPES.SUPER_DRAG_EXECUTE_ACTION,
      action: "open_incognito_active",
      targetType: "link",
      payload: "https://example.com/private"
    })

    expect(isAllowedIncognitoMock).toHaveBeenCalled()
    expect(tabsCreateMock).toHaveBeenCalledWith({
      url: "https://example.com/private",
      active: true
    })
  })
})
