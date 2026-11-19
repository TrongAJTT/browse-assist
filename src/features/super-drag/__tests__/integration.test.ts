import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

const { mockExtensionStorage } = vi.hoisted(() => ({
  mockExtensionStorage: {
    get: vi.fn()
  }
}))

vi.mock("~core/storage", () => ({
  extensionStorage: mockExtensionStorage
}))

import { DEFAULT_SETTINGS } from "~core/types"
import { initSuperDragBackground } from "../background"
import { activate, deactivate } from "../logic"

describe("super-drag integration (content drag -> background execution)", () => {
  let bgMessageListener:
    | ((
        msg: unknown,
        sender: chrome.runtime.MessageSender,
        sendResponse: (res?: unknown) => void
      ) => boolean | void)
    | null = null
  let tabsCreateMock: ReturnType<typeof vi.fn>

  beforeEach(async () => {
    vi.clearAllMocks()
    bgMessageListener = null
    tabsCreateMock = vi.fn()

    mockExtensionStorage.get.mockResolvedValue({
      ...DEFAULT_SETTINGS,
      superDrag: true
    })

    const globalObj = globalThis as unknown as Record<string, unknown>
    globalObj.chrome = {
      runtime: {
        sendMessage: vi.fn((message: unknown, cb?: (res?: unknown) => void) => {
          if (bgMessageListener) {
            bgMessageListener(
              message,
              { tab: { id: 5, index: 1 } as chrome.tabs.Tab },
              (res) => cb?.(res)
            )
          }
          return Promise.resolve({ success: true })
        }),
        onMessage: {
          hasListener: vi.fn(() => bgMessageListener !== null),
          addListener: vi.fn((fn) => {
            bgMessageListener = fn
          })
        }
      },
      tabs: {
        create: tabsCreateMock,
        update: vi.fn().mockResolvedValue(undefined)
      }
    }

    await initSuperDragBackground()
    activate({
      ...DEFAULT_SETTINGS.superDragConfig,
      indicatorStyle: "none"
    })
  })

  afterEach(() => {
    deactivate()
  })

  it("cleans dragged link URL and opens it in a background tab next to sender tab", async () => {
    document.body.innerHTML = `<a id="link" href="https://example.com/news?utm_source=fb&fbclid=xyz">News</a>`
    const link = document.getElementById("link")!

    const dragStart = new Event("dragstart", { bubbles: true }) as Event & {
      clientX: number
      clientY: number
    }
    dragStart.clientX = 100
    dragStart.clientY = 100
    link.dispatchEvent(dragStart)

    const dragEnd = new Event("dragend", { bubbles: true }) as Event & {
      clientX: number
      clientY: number
    }
    dragEnd.clientX = 190
    dragEnd.clientY = 100
    window.dispatchEvent(dragEnd)

    await vi.waitFor(() => {
      expect(tabsCreateMock).toHaveBeenCalledWith({
        url: "https://example.com/news",
        active: false,
        index: 2
      })
    })
  })
})
