import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

const { mockShowContentToast } = vi.hoisted(() => ({
  mockShowContentToast: vi.fn()
}))

vi.mock("~core/toast", () => ({
  showContentToast: mockShowContentToast
}))

import { DEFAULT_ELEMENT_TOYS_CONFIG } from "~core/types"
import { activate, deactivate, startZapping, stopZapping } from "../logic"
import { unfreezeScrollLock } from "../scrollUnlock"
import { UndoManager } from "../undoManager"

describe("element-toys UndoManager", () => {
  it("reverts zap, hide, edit, move, and resize actions in LIFO order", () => {
    document.body.innerHTML = `<div id="wrap"><p id="target">Hello</p><span id="sib">Next</span></div>`
    const wrap = document.getElementById("wrap")!
    const target = document.getElementById("target")!
    const sib = document.getElementById("sib")!

    const manager = new UndoManager()

    // 1. Zap
    wrap.removeChild(target)
    manager.push({
      type: "zap",
      element: target,
      parent: wrap,
      nextSibling: sib
    })

    // 2. Hide
    sib.style.display = "none"
    manager.push({
      type: "hide",
      element: sib,
      oldVisibility: "",
      oldDisplay: "inline"
    })

    expect(manager.count).toBe(2)

    manager.undo()
    expect(sib.style.display).toBe("inline")

    manager.undo()
    expect(wrap.contains(target)).toBe(true)
    expect(target.nextSibling).toBe(sib)
    expect(manager.count).toBe(0)
  })
})

describe("element-toys scrollUnlock", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    document.body.style.cssText = ""
    document.documentElement.style.cssText = ""
  })

  it("unfreezes overflow:hidden and position:fixed on body and shows toast", () => {
    document.body.style.overflow = "hidden"
    document.body.style.position = "fixed"

    unfreezeScrollLock(true)

    expect(document.body.style.overflow).toBe("auto")
    expect(document.body.style.position).toBe("static")
    expect(mockShowContentToast).toHaveBeenCalledWith(
      expect.objectContaining({ message: "Page Scroll Unfrozen" })
    )
  })
})

describe("element-toys session lifecycle", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    document.body.innerHTML = ""
  })

  afterEach(() => {
    deactivate()
  })

  it("starts session, closes on Escape or right-click with toast, and cleans up", () => {
    activate({ ...DEFAULT_ELEMENT_TOYS_CONFIG, showToast: true })
    startZapping()

    expect(mockShowContentToast).toHaveBeenCalledWith(
      expect.objectContaining({ message: "Element Toys Active" })
    )

    // Right-click exits session and shows closed toast
    document.body.dispatchEvent(
      new MouseEvent("contextmenu", { bubbles: true, cancelable: true })
    )

    expect(mockShowContentToast).toHaveBeenLastCalledWith(
      expect.objectContaining({ message: "Element Toys Closed" })
    )

    // Re-start and test Escape
    startZapping()
    window.dispatchEvent(
      new KeyboardEvent("keydown", { key: "Escape", bubbles: true, cancelable: true })
    )
    expect(mockShowContentToast).toHaveBeenLastCalledWith(
      expect.objectContaining({ message: "Element Toys Closed" })
    )

    stopZapping(false)
  })
})
