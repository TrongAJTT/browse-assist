import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import { DEFAULT_SETTINGS, STORAGE_KEYS } from "~core/types"

const {
  mockCopyToClipboard,
  mockShowCopiedFeedback,
  mockExtensionStorage
} = vi.hoisted(() => ({
  mockCopyToClipboard: vi.fn().mockResolvedValue(true),
  mockShowCopiedFeedback: vi.fn(),
  mockExtensionStorage: {
    get: vi.fn(),
    watch: vi.fn()
  }
}))

vi.mock("~core/linkUtils", async () => {
  const actual =
    await vi.importActual<typeof import("~core/linkUtils")>("~core/linkUtils")
  return {
    ...actual,
    copyToClipboard: mockCopyToClipboard,
    showCopiedFeedback: mockShowCopiedFeedback
  }
})

vi.mock("~core/storage", () => ({
  extensionStorage: mockExtensionStorage
}))

import { initContextMenuActionsBackground } from "../background"
import { activate, deactivate } from "../logic"

describe("context-menu-actions integration (background <-> content)", () => {
  let onMenuClickedHandler:
    | ((
        info: chrome.contextMenus.OnClickData,
        tab?: chrome.tabs.Tab
      ) => void)
    | null = null
  let onRuntimeMessageHandler:
    | ((
        msg: unknown,
        sender: chrome.runtime.MessageSender,
        sendResponse: (res?: unknown) => void
      ) => Promise<void> | void)
    | null = null
  const registeredMenus: chrome.contextMenus.CreateProperties[] = []

  beforeEach(async () => {
    vi.clearAllMocks()
    registeredMenus.length = 0
    onMenuClickedHandler = null
    onRuntimeMessageHandler = null

    document.body.innerHTML = `<a id="target-link" href="https://example.com/guide?utm_source=newsletter">Complete Guide</a>`
    document.title = "Guide Home"

    mockExtensionStorage.get.mockResolvedValue({
      ...DEFAULT_SETTINGS,
      contextMenuActions: true,
      contextMenuActionsConfig: {
        ...DEFAULT_SETTINGS.contextMenuActionsConfig,
        copyPageMarkdown: true
      }
    })

    const globalObj = globalThis as unknown as Record<string, unknown>
    delete globalObj.browser
    globalObj.chrome = {
      contextMenus: {
        removeAll: vi.fn((cb?: () => void) => {
          registeredMenus.length = 0
          cb?.()
        }),
        create: vi.fn((props, cb?: () => void) => {
          registeredMenus.push(props)
          cb?.()
        }),
        onClicked: {
          hasListener: vi.fn(() => onMenuClickedHandler !== null),
          addListener: vi.fn((fn) => {
            onMenuClickedHandler = fn
          })
        }
      },
      runtime: {
        lastError: undefined,
        onInstalled: { hasListener: vi.fn(() => false), addListener: vi.fn() },
        onStartup: { hasListener: vi.fn(() => false), addListener: vi.fn() },
        onMessage: {
          addListener: vi.fn((fn) => {
            onRuntimeMessageHandler = fn
          }),
          removeListener: vi.fn(() => {
            onRuntimeMessageHandler = null
          })
        }
      },
      tabs: {
        sendMessage: vi.fn(async (_tabId: number, message: unknown) => {
          if (onRuntimeMessageHandler) {
            await onRuntimeMessageHandler(
              message,
              {} as chrome.runtime.MessageSender,
              vi.fn()
            )
          }
        })
      }
    }

    await initContextMenuActionsBackground()
    activate()
  })

  afterEach(() => {
    deactivate()
  })

  it("wires storage -> menu registration -> click -> content script clipboard write", async () => {
    expect(registeredMenus.map((m) => m.id)).toContain(
      "browse_assist_markdown_link_copy"
    )
    expect(mockExtensionStorage.watch).toHaveBeenCalledWith(
      expect.objectContaining({ [STORAGE_KEYS.SETTINGS]: expect.any(Function) })
    )

    // Simulate user right-clicking the link, then clicking "Copy Link as Markdown"
    document
      .querySelector("#target-link")!
      .dispatchEvent(new MouseEvent("contextmenu", { bubbles: true }))

    onMenuClickedHandler!(
      {
        menuItemId: "browse_assist_markdown_link_copy",
        linkUrl: "https://example.com/guide?utm_source=newsletter",
        pageUrl: "https://example.com/"
      } as chrome.contextMenus.OnClickData,
      { id: 7 } as chrome.tabs.Tab
    )

    // Wait a microtask for async message handling
    await vi.waitFor(() => {
      expect(mockCopyToClipboard).toHaveBeenCalledWith(
        "[Complete Guide](https://example.com/guide)"
      )
    })
    expect(mockShowCopiedFeedback).toHaveBeenCalledWith(
      "Copied Markdown",
      "[Complete Guide](https://example.com/guide)"
    )
  })
})
