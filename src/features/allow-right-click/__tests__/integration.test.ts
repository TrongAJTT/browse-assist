import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

const { mockShowContentToast } = vi.hoisted(() => ({
  mockShowContentToast: vi.fn()
}))

vi.mock("~core/toast", () => ({
  showContentToast: mockShowContentToast
}))

import { MESSAGE_TYPES } from "~core/messaging"
import { initAllowRightClickBackground } from "../background"
import { deactivate, isRightClickActive, toggleRightClick } from "../logic"

describe("allow-right-click integration (background shortcut -> content toggle)", () => {
  let onCommandHandler: ((command: string) => void) | null = null

  beforeEach(async () => {
    vi.clearAllMocks()
    onCommandHandler = null
    document.body.innerHTML = `<div id="protected">Protected Text</div>`
    deactivate()

    const globalObj = globalThis as unknown as Record<string, unknown>
    globalObj.chrome = {
      commands: {
        onCommand: {
          addListener: vi.fn((fn) => {
            onCommandHandler = fn
          })
        }
      },
      tabs: {
        query: vi.fn((_q: unknown, cb: (tabs: chrome.tabs.Tab[]) => void) =>
          cb([{ id: 101 } as chrome.tabs.Tab])
        ),
        sendMessage: vi.fn(async (_tabId: number, msg: { type?: string }) => {
          if (msg.type === MESSAGE_TYPES.TOGGLE_RIGHT_CLICK_SHORTCUT) {
            return { active: toggleRightClick(true) }
          }
          return undefined
        })
      }
    }

    await initAllowRightClickBackground()
  })

  afterEach(() => {
    deactivate()
  })

  it("toggles right click protection on active tab when Alt+R command fires", async () => {
    const protectedEl = document.getElementById("protected")!
    const pageBlocker = vi.fn()
    protectedEl.addEventListener("contextmenu", pageBlocker)

    // Initially inactive: page handler still receives contextmenu
    protectedEl.dispatchEvent(new MouseEvent("contextmenu", { bubbles: true }))
    expect(pageBlocker).toHaveBeenCalledTimes(1)

    // Trigger command from background
    onCommandHandler!("toggle_allow_right_click")

    await vi.waitFor(() => {
      expect(isRightClickActive()).toBe(true)
    })

    // Now protected: page handler is blocked in capture phase
    protectedEl.dispatchEvent(new MouseEvent("contextmenu", { bubbles: true }))
    expect(pageBlocker).toHaveBeenCalledTimes(1)

    // Trigger again to disable
    onCommandHandler!("toggle_allow_right_click")
    await vi.waitFor(() => {
      expect(isRightClickActive()).toBe(false)
    })
  })
})
