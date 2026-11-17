import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

const { mockCopyToClipboard, mockShowCopiedFeedback } = vi.hoisted(() => ({
  mockCopyToClipboard: vi.fn().mockResolvedValue(true),
  mockShowCopiedFeedback: vi.fn()
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

import { activate, deactivate } from "../logic"

describe("context-menu-actions content logic", () => {
  let messageListener:
    | ((
        msg: {
          action?: string
          linkUrl?: string
          pageUrl?: string
          selectionText?: string
        },
        sender: chrome.runtime.MessageSender,
        sendResponse: (res?: unknown) => void
      ) => Promise<void>)
    | null = null

  beforeEach(() => {
    vi.clearAllMocks()
    document.body.innerHTML = ""
    document.title = "Example [Docs] Page"
    messageListener = null

    // Polyfill CSS.escape if jsdom lacks it
    if (typeof CSS === "undefined" || !CSS.escape) {
      ;(globalThis as unknown as { CSS: { escape: (s: string) => string } }).CSS =
        {
          escape: (s: string) => s.replace(/["\\]/g, "\\$&")
        }
    }

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

    activate()
  })

  afterEach(() => {
    deactivate()
  })

  async function dispatchAction(msg: {
    action: string
    linkUrl?: string
    pageUrl?: string
    selectionText?: string
  }) {
    expect(messageListener).not.toBeNull()
    await messageListener!(msg, {} as chrome.runtime.MessageSender, vi.fn())
  }

  it("extracts anchor text from right-clicked element for copy_link_text", async () => {
    document.body.innerHTML = `<a id="link" href="https://example.com/a?utm_source=1"><span>Read [More]</span></a>`
    const span = document.querySelector("#link span")!
    span.dispatchEvent(new MouseEvent("contextmenu", { bubbles: true }))

    await dispatchAction({
      action: "browse_assist_copy_link_text",
      linkUrl: "https://example.com/a?utm_source=1"
    })

    expect(mockCopyToClipboard).toHaveBeenCalledWith("Read [More]")
    expect(mockShowCopiedFeedback).toHaveBeenCalledWith(
      "Copied Link Text",
      "Read [More]"
    )
  })

  it("strips tracking parameters for clean_link_copy", async () => {
    await dispatchAction({
      action: "browse_assist_clean_link_copy",
      linkUrl: "https://example.com/article?id=42&utm_source=twitter&fbclid=abc"
    })

    expect(mockCopyToClipboard).toHaveBeenCalledWith(
      "https://example.com/article?id=42"
    )
    expect(mockShowCopiedFeedback).toHaveBeenCalledWith(
      "Copied Clean Link",
      "https://example.com/article?id=42"
    )
  })

  it("strips brackets from link text and cleans URL for markdown_link_copy", async () => {
    document.body.innerHTML = `<a href="https://example.com/p?si=999">Click [Here]</a>`
    const anchor = document.querySelector("a")!
    anchor.dispatchEvent(new MouseEvent("contextmenu", { bubbles: true }))

    await dispatchAction({
      action: "browse_assist_markdown_link_copy",
      linkUrl: "https://example.com/p?si=999"
    })

    expect(mockCopyToClipboard).toHaveBeenCalledWith(
      "[Click Here](https://example.com/p)"
    )
    expect(mockShowCopiedFeedback).toHaveBeenCalledWith(
      "Copied Markdown",
      "[Click Here](https://example.com/p)"
    )
  })

  it("copies cleaned current page URL for copy_clean_page_url", async () => {
    await dispatchAction({
      action: "browse_assist_copy_clean_page_url",
      pageUrl: "https://example.com/home?utm_medium=email&tab=2"
    })

    expect(mockCopyToClipboard).toHaveBeenCalledWith(
      "https://example.com/home?tab=2"
    )
    expect(mockShowCopiedFeedback).toHaveBeenCalledWith(
      "Copied Clean Page URL",
      "https://example.com/home?tab=2"
    )
  })

  it("formats page title and clean URL for copy_page_markdown", async () => {
    await dispatchAction({
      action: "browse_assist_copy_page_markdown",
      pageUrl: "https://example.com/docs?ref=nav"
    })

    expect(mockCopyToClipboard).toHaveBeenCalledWith(
      "[Example Docs Page](https://example.com/docs)"
    )
    expect(mockShowCopiedFeedback).toHaveBeenCalledWith(
      "Copied Page Markdown",
      "[Example Docs Page](https://example.com/docs)"
    )
  })

  it("formats multi-line selection as Markdown blockquote with source for copy_selection_quote", async () => {
    await dispatchAction({
      action: "browse_assist_copy_selection_quote",
      pageUrl: "https://example.com/post?utm_campaign=launch",
      selectionText: "Line one\nLine two"
    })

    expect(mockCopyToClipboard).toHaveBeenCalledWith(
      "> Line one\n> Line two\n— [Example Docs Page](https://example.com/post)"
    )
    expect(mockShowCopiedFeedback).toHaveBeenCalledWith(
      "Copied Quote",
      "Line one\nLine two"
    )
  })

  it("clears lastContextMenuTarget and removes message listener on deactivate", async () => {
    document.body.innerHTML = `<a id="old" href="https://old.example.com">Old Title</a>`
    document
      .querySelector("#old")!
      .dispatchEvent(new MouseEvent("contextmenu", { bubbles: true }))

    deactivate()
    expect(messageListener).toBeNull()

    // Re-activate without a new contextmenu event: old DOM target should not be reused
    activate()
    document.body.innerHTML = ""
    await dispatchAction({
      action: "browse_assist_copy_link_text",
      linkUrl: "https://new.example.com"
    })

    expect(mockCopyToClipboard).toHaveBeenCalledWith("https://new.example.com")
  })
})
