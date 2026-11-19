import { beforeEach, describe, expect, it, vi } from "vitest"

import {
  DEFAULT_CONTEXT_MENU_ACTIONS_CONFIG,
  type ContextMenuActionsConfig
} from "~core/types"

const mockExtensionStorage = vi.hoisted(() => ({
  get: vi.fn(),
  watch: vi.fn()
}))

vi.mock("~core/storage", () => ({
  extensionStorage: mockExtensionStorage
}))

import {
  MENU_ITEMS,
  handleContextMenuClick,
  updateContextMenus
} from "../background"

describe("context-menu-actions background", () => {
  let removeAllMock: ReturnType<typeof vi.fn>
  let createMock: ReturnType<typeof vi.fn>
  let sendMessageMock: ReturnType<typeof vi.fn>

  beforeEach(() => {
    vi.clearAllMocks()

    removeAllMock = vi.fn((cb?: () => void) => {
      cb?.()
    })
    createMock = vi.fn((_props, cb?: () => void) => {
      cb?.()
    })
    sendMessageMock = vi.fn().mockResolvedValue(undefined)

    const globalObj = globalThis as unknown as Record<string, unknown>
    delete globalObj.browser
    globalObj.chrome = {
      contextMenus: {
        removeAll: removeAllMock,
        create: createMock,
        onClicked: {
          hasListener: vi.fn(() => false),
          addListener: vi.fn()
        }
      },
      runtime: {
        lastError: undefined,
        onInstalled: { hasListener: vi.fn(() => false), addListener: vi.fn() },
        onStartup: { hasListener: vi.fn(() => false), addListener: vi.fn() }
      },
      tabs: {
        sendMessage: sendMessageMock
      }
    }
  })

  it("removes all menus and creates none when master toggle is disabled", async () => {
    await updateContextMenus(false, DEFAULT_CONTEXT_MENU_ACTIONS_CONFIG)

    expect(removeAllMock).toHaveBeenCalledTimes(1)
    expect(createMock).not.toHaveBeenCalled()
  })

  it("registers enabled menu items in configured order with proper contexts", async () => {
    const config: ContextMenuActionsConfig = {
      copyLinkText: true,
      cleanLinkCopy: false,
      markdownLinkCopy: true,
      copyCleanPageUrl: true,
      copyPageMarkdown: true,
      copySelectionQuote: true,
      order: [
        "copySelectionQuote",
        "markdownLinkCopy",
        "copyLinkText",
        "cleanLinkCopy",
        "copyCleanPageUrl",
        "copyPageMarkdown"
      ]
    }

    await updateContextMenus(true, config)

    expect(removeAllMock).toHaveBeenCalledTimes(1)
    expect(createMock).toHaveBeenCalledTimes(5)

    const createdCalls = createMock.mock.calls.map((c) => c[0])
    expect(createdCalls).toEqual([
      {
        id: MENU_ITEMS.COPY_SELECTION_QUOTE,
        title: "Copy Selection as Quote",
        contexts: ["selection"]
      },
      {
        id: MENU_ITEMS.MARKDOWN_LINK_COPY,
        title: "Copy Link as Markdown",
        contexts: ["link"]
      },
      {
        id: MENU_ITEMS.COPY_LINK_TEXT,
        title: "Copy Link Text",
        contexts: ["link"]
      },
      {
        id: MENU_ITEMS.COPY_CLEAN_PAGE_URL,
        title: "Copy Clean Page URL",
        contexts: ["page"]
      },
      {
        id: MENU_ITEMS.COPY_PAGE_MARKDOWN,
        title: "Copy Page as Markdown",
        contexts: ["page"]
      }
    ])
  })

  it("normalizes legacy order arrays by appending missing new action IDs", async () => {
    const legacyConfig = {
      copyLinkText: true,
      cleanLinkCopy: true,
      markdownLinkCopy: true,
      order: ["markdownLinkCopy", "copyLinkText", "cleanLinkCopy"]
    } as ContextMenuActionsConfig

    await updateContextMenus(true, legacyConfig)

    const createdIds = createMock.mock.calls.map((c) => c[0].id)
    expect(createdIds).toEqual([
      MENU_ITEMS.MARKDOWN_LINK_COPY,
      MENU_ITEMS.COPY_LINK_TEXT,
      MENU_ITEMS.CLEAN_LINK_COPY,
      MENU_ITEMS.COPY_CLEAN_PAGE_URL,
      MENU_ITEMS.COPY_SELECTION_QUOTE
    ])
  })

  it("supports Firefox browser.menus API when chrome.contextMenus is absent", async () => {
    const ffRemoveAll = vi.fn().mockResolvedValue(undefined)
    const ffCreate = vi.fn((_props, cb?: () => void) => cb?.())
    const globalObj = globalThis as unknown as Record<string, unknown>
    delete globalObj.chrome
    globalObj.browser = {
      menus: {
        removeAll: ffRemoveAll,
        create: ffCreate
      }
    }

    await updateContextMenus(true, DEFAULT_CONTEXT_MENU_ACTIONS_CONFIG)

    expect(ffRemoveAll).toHaveBeenCalledTimes(1)
    expect(ffCreate).toHaveBeenCalledTimes(5)
  })

  it("coalesces concurrent updateContextMenus calls via mutex lock", async () => {
    let releaseFirstRemove!: () => void
    removeAllMock
      .mockImplementationOnce(
        () =>
          new Promise<void>((resolve) => {
            releaseFirstRemove = resolve
          })
      )
      .mockImplementation((cb?: () => void) => cb?.())

    const first = updateContextMenus(true, DEFAULT_CONTEXT_MENU_ACTIONS_CONFIG)
    const second = updateContextMenus(false, DEFAULT_CONTEXT_MENU_ACTIONS_CONFIG)

    releaseFirstRemove()
    await Promise.all([first, second])

    // First call ran with true, then coalesced pending call ran with false
    expect(removeAllMock).toHaveBeenCalledTimes(2)
  })

  it("dispatches valid menu clicks to the active tab and ignores unknown IDs", () => {
    handleContextMenuClick(
      { menuItemId: "unknown_menu_id" } as chrome.contextMenus.OnClickData,
      { id: 42 } as chrome.tabs.Tab
    )
    expect(sendMessageMock).not.toHaveBeenCalled()

    handleContextMenuClick(
      {
        menuItemId: MENU_ITEMS.COPY_SELECTION_QUOTE,
        linkUrl: "",
        pageUrl: "https://example.com/post?utm_source=x",
        selectionText: "Quoted text"
      } as chrome.contextMenus.OnClickData,
      { id: 42 } as chrome.tabs.Tab
    )

    expect(sendMessageMock).toHaveBeenCalledWith(42, {
      action: MENU_ITEMS.COPY_SELECTION_QUOTE,
      linkUrl: "",
      pageUrl: "https://example.com/post?utm_source=x",
      selectionText: "Quoted text"
    })
  })
})
