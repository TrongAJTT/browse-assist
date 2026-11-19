import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

const { mockGetStoredSettings, mockSubscribeToSettings } = vi.hoisted(() => ({
  mockGetStoredSettings: vi.fn(),
  mockSubscribeToSettings: vi.fn(() => () => {})
}))

vi.mock("~core/storage", () => ({
  getStoredSettings: mockGetStoredSettings,
  subscribeToSettings: mockSubscribeToSettings
}))

vi.mock("~core/browserDetect", () => ({
  isColorPickerSupported: true
}))

import { DEFAULT_QUICK_HUB_CONFIG, DEFAULT_SETTINGS } from "~core/types"
import {
  activate,
  deactivate,
  toggleQuickHubMenu,
  updateQuickHubConfig
} from "../logic"

describe("quick-hub content logic", () => {
  let capturedShadowRoot: ShadowRoot | null = null

  beforeEach(() => {
    vi.clearAllMocks()
    capturedShadowRoot = null
    document.body.innerHTML = ""
    document.documentElement.removeAttribute("data-theme")

    mockGetStoredSettings.mockResolvedValue({
      ...DEFAULT_SETTINGS,
      quickHub: true,
      quickHubConfig: DEFAULT_QUICK_HUB_CONFIG
    })

    const originalAttachShadow = Element.prototype.attachShadow
    vi.spyOn(Element.prototype, "attachShadow").mockImplementation(function (
      this: Element,
      init: ShadowRootInit
    ) {
      const root = originalAttachShadow.call(this, init)
      capturedShadowRoot = root
      return root
    })
  })

  afterEach(() => {
    deactivate()
    vi.restoreAllMocks()
  })

  it("mounts Shadow DOM host after hydrating settings and removes it on deactivate", async () => {
    activate(DEFAULT_QUICK_HUB_CONFIG)

    await vi.waitFor(() => {
      expect(document.getElementById("browse-assist-quick-hub-host")).not.toBeNull()
    })
    expect(capturedShadowRoot).not.toBeNull()

    deactivate()
    expect(document.getElementById("browse-assist-quick-hub-host")).toBeNull()
  })

  it("adapts trigger styles to detected page theme and applies buttonShape & buttonOpacity", async () => {
    document.documentElement.setAttribute("data-theme", "light")
    mockGetStoredSettings.mockResolvedValue({
      ...DEFAULT_SETTINGS,
      quickHub: true,
      quickHubConfig: {
        ...DEFAULT_QUICK_HUB_CONFIG,
        buttonShape: "pill",
        buttonOpacity: 0.7
      }
    })

    activate({
      ...DEFAULT_QUICK_HUB_CONFIG,
      buttonShape: "pill",
      buttonOpacity: 0.7
    })

    await vi.waitFor(() => {
      expect(capturedShadowRoot?.querySelector("style")).not.toBeNull()
    })

    const styleText = capturedShadowRoot!.querySelector("style")!.textContent || ""
    expect(styleText).toContain("rgba(255, 255, 255, 0.88)")
    expect(styleText).toContain("width: 44px; height: 32px; border-radius: 9999px;")
    expect(styleText).toContain("opacity: 0.7;")

    // Switch to dark theme and circle shape dynamically
    document.documentElement.setAttribute("data-theme", "dark")
    updateQuickHubConfig({ buttonShape: "circle" })
    const updatedStyle =
      capturedShadowRoot!.querySelector("style")!.textContent || ""
    expect(updatedStyle).toContain("rgba(18, 18, 24, 0.84)")
    expect(updatedStyle).toContain("width: 36px; height: 36px; border-radius: 9999px;")
  })

  it("toggles menu visibility and closes on Escape", async () => {
    activate(DEFAULT_QUICK_HUB_CONFIG)

    await vi.waitFor(() => {
      expect(capturedShadowRoot?.querySelector(".qh-trigger")).not.toBeNull()
    })

    const trigger = capturedShadowRoot!.querySelector(".qh-trigger")!
    const menu = capturedShadowRoot!.querySelector(".qh-menu")!

    toggleQuickHubMenu()
    expect(trigger.classList.contains("qh-open")).toBe(true)
    expect(menu.classList.contains("qh-menu-open")).toBe(true)

    window.dispatchEvent(
      new KeyboardEvent("keydown", { key: "Escape", bubbles: true })
    )
    expect(trigger.classList.contains("qh-open")).toBe(false)
    expect(menu.classList.contains("qh-menu-open")).toBe(false)
  })
})
