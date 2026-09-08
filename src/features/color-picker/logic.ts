/**
 * ColorPick Eyedropper - Content Script Logic
 * Launches native window.EyeDropper, parses the picked color, copies it,
 * adds to persistent color history, and displays a floating color palette modal.
 */

import { MESSAGE_TYPES } from "~core/messaging"
import { extensionStorage } from "~core/storage"
import { showContentToast } from "~core/toast"
import {
  DEFAULT_COLOR_PICKER_CONFIG,
  STORAGE_KEYS,
  type ColorHistoryItem,
  type ColorPickerConfig
} from "~core/types"

import { getColorValueByFormat, parseColor } from "./colorUtils"

let isActive = false
let currentConfig: ColorPickerConfig = { ...DEFAULT_COLOR_PICKER_CONFIG }

// DOM elements for Floating Color Palette Modal
let hostElement: HTMLDivElement | null = null
let shadowRoot: ShadowRoot | null = null
let autoDismissTimeout: number | null = null

// SVG Icons
const EYE_DROPPER_ICON_SVG = `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m2 22 1-1h3l9-9"/><path d="M3 21v-3l9-9"/><path d="m15 6 3.4-3.4a2.1 2.1 0 1 1 3 3L18 9l.4.4a2.1 2.1 0 1 1-3 3l-3.8-3.8a2.1 2.1 0 1 1 3-3l.4.4Z"/></svg>`
const COPY_ICON_SVG = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>`
const CHECK_ICON_SVG = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#34d399" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>`
const CLOSE_ICON_SVG = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>`

/**
 * Copies plain text to clipboard.
 */
async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text)
      return true
    }
    const textarea = document.createElement("textarea")
    textarea.value = text
    textarea.style.position = "fixed"
    textarea.style.opacity = "0"
    textarea.style.pointerEvents = "none"
    document.body.appendChild(textarea)
    textarea.select()
    const success = document.execCommand("copy")
    document.body.removeChild(textarea)
    return success
  } catch {
    return false
  }
}

/**
 * Saves a new color into persistent color history (capped at 20 items).
 */
async function saveToColorHistory(item: ColorHistoryItem): Promise<void> {
  try {
    const existing =
      (await extensionStorage.get<ColorHistoryItem[]>(
        STORAGE_KEYS.COLOR_HISTORY
      )) || []
    // Prepend and filter duplicates
    const filtered = existing.filter((c) => c.hex !== item.hex)
    const updated = [item, ...filtered].slice(0, 20)
    await extensionStorage.set(STORAGE_KEYS.COLOR_HISTORY, updated)
  } catch {
    // Ignore storage update errors
  }
}

/**
 * Destroys the floating palette modal.
 */
function hidePaletteModal(): void {
  if (autoDismissTimeout !== null) {
    window.clearTimeout(autoDismissTimeout)
    autoDismissTimeout = null
  }
  if (hostElement && hostElement.parentNode) {
    hostElement.parentNode.removeChild(hostElement)
  }
  hostElement = null
  shadowRoot = null
}

/**
 * Injects and renders the floating Color Palette Modal inside a closed Shadow DOM.
 */
function showPaletteModal(color: ColorHistoryItem): void {
  hidePaletteModal()

  if (typeof document === "undefined" || !document.documentElement) return

  hostElement = document.createElement("div")
  hostElement.id = "browse-assist-color-palette-host"
  hostElement.style.cssText = `
    position: fixed;
    z-index: 2147483647;
    bottom: 24px;
    right: 24px;
    pointer-events: auto;
  `
  document.documentElement.appendChild(hostElement)

  shadowRoot = hostElement.attachShadow({ mode: "closed" })

  const style = document.createElement("style")
  style.textContent = `
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    }
    .palette-card {
      width: 270px;
      background: rgba(15, 23, 42, 0.94);
      border: 1px solid rgba(255, 255, 255, 0.14);
      border-radius: 16px;
      padding: 14px;
      color: #f8fafc;
      box-shadow: 0 20px 30px -10px rgba(0, 0, 0, 0.5), 0 10px 15px -5px rgba(0, 0, 0, 0.35);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      animation: slideIn 0.22s cubic-bezier(0.16, 1, 0.3, 1);
    }
    @keyframes slideIn {
      from {
        opacity: 0;
        transform: translateY(12px) scale(0.96);
      }
      to {
        opacity: 1;
        transform: translateY(0) scale(1);
      }
    }
    .header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 12px;
    }
    .title-row {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .swatch {
      width: 28px;
      height: 28px;
      border-radius: 8px;
      border: 2px solid rgba(255, 255, 255, 0.25);
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
      flex-shrink: 0;
    }
    .title-text {
      display: flex;
      flex-direction: column;
    }
    .title {
      font-size: 13px;
      font-weight: 700;
      letter-spacing: -0.01em;
      color: #ffffff;
    }
    .subtitle {
      font-size: 10px;
      color: #94a3b8;
    }
    .close-btn {
      background: transparent;
      border: none;
      color: #94a3b8;
      cursor: pointer;
      padding: 4px;
      border-radius: 6px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.15s ease;
    }
    .close-btn:hover {
      background: rgba(255, 255, 255, 0.1);
      color: #ffffff;
    }
    .values-list {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }
    .value-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 6px 10px;
      background: rgba(30, 41, 59, 0.6);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 8px;
      transition: all 0.15s ease;
    }
    .value-row:hover {
      background: rgba(51, 65, 85, 0.8);
      border-color: rgba(255, 255, 255, 0.18);
    }
    .format-label {
      font-size: 10px;
      font-weight: 700;
      color: #818cf8;
      letter-spacing: 0.04em;
      width: 32px;
    }
    .format-value {
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      font-size: 12px;
      font-weight: 600;
      color: #f1f5f9;
      flex: 1;
      text-align: left;
      margin-left: 6px;
    }
    .copy-btn {
      background: transparent;
      border: none;
      color: #94a3b8;
      cursor: pointer;
      padding: 4px 6px;
      border-radius: 6px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.15s ease;
    }
    .copy-btn:hover {
      background: rgba(99, 102, 241, 0.25);
      color: #a5b4fc;
    }
  `

  const card = document.createElement("div")
  card.className = "palette-card"

  card.innerHTML = `
    <div class="header">
      <div class="title-row">
        <div class="swatch" style="background-color: ${color.hex}"></div>
        <div class="title-text">
          <span class="title">${color.hex}</span>
          <span class="subtitle">Picked Color</span>
        </div>
      </div>
      <button class="close-btn" id="btn-close" title="Close">${CLOSE_ICON_SVG}</button>
    </div>

    <div class="values-list">
      <!-- HEX -->
      <div class="value-row">
        <span class="format-label">HEX</span>
        <span class="format-value">${color.hex}</span>
        <button class="copy-btn" data-val="${color.hex}" title="Copy HEX">${COPY_ICON_SVG}</button>
      </div>

      <!-- RGB -->
      <div class="value-row">
        <span class="format-label">RGB</span>
        <span class="format-value">${color.rgb}</span>
        <button class="copy-btn" data-val="${color.rgb}" title="Copy RGB">${COPY_ICON_SVG}</button>
      </div>

      <!-- HSL -->
      <div class="value-row">
        <span class="format-label">HSL</span>
        <span class="format-value">${color.hsl}</span>
        <button class="copy-btn" data-val="${color.hsl}" title="Copy HSL">${COPY_ICON_SVG}</button>
      </div>
    </div>
  `

  shadowRoot.appendChild(style)
  shadowRoot.appendChild(card)

  // Wire close button
  const closeBtn = card.querySelector("#btn-close")
  closeBtn?.addEventListener("click", () => hidePaletteModal())

  // Wire copy buttons
  const copyButtons = card.querySelectorAll<HTMLButtonElement>(".copy-btn")
  copyButtons.forEach((btn) => {
    btn.addEventListener("click", async () => {
      const val = btn.getAttribute("data-val")
      if (!val) return
      await copyToClipboard(val)

      // Quick visual feedback on button
      btn.innerHTML = CHECK_ICON_SVG
      setTimeout(() => {
        btn.innerHTML = COPY_ICON_SVG
      }, 1200)

      if (currentConfig.showToast) {
        showContentToast({
          message: "Copied Color",
          detail: val,
          type: "success",
          iconSvg: EYE_DROPPER_ICON_SVG,
          duration: 1400
        })
      }
    })
  })

  // Auto dismiss after 10 seconds of inactivity if not interacted
  autoDismissTimeout = window.setTimeout(() => {
    hidePaletteModal()
  }, 10000)
}

/**
 * Triggers the native window.EyeDropper picker.
 */
export async function pickColor(): Promise<void> {
  // Check if browser supports EyeDropper
  if (typeof window === "undefined" || !("EyeDropper" in window)) {
    if (currentConfig.showToast) {
      showContentToast({
        message: "EyeDropper not supported on this page/browser",
        type: "error",
        duration: 2500
      })
    }
    return
  }

  try {
    // Type definition for EyeDropper API
    const EyeDropperClass = (
      window as unknown as {
        EyeDropper: new () => { open: () => Promise<{ sRGBHex: string }> }
      }
    ).EyeDropper
    const eyeDropper = new EyeDropperClass()
    const result = await eyeDropper.open()

    if (result?.sRGBHex) {
      const colorItem = parseColor(result.sRGBHex)

      // 1. Save to persistent history
      await saveToColorHistory(colorItem)

      // 2. Auto-copy to clipboard if configured
      if (currentConfig.autoCopy) {
        const copyVal = getColorValueByFormat(
          colorItem,
          currentConfig.defaultFormat
        )
        await copyToClipboard(copyVal)
      }

      // 3. Show feedback toast
      if (currentConfig.showToast) {
        const copyVal = getColorValueByFormat(
          colorItem,
          currentConfig.defaultFormat
        )
        showContentToast({
          message: currentConfig.autoCopy
            ? "Color Picked & Copied"
            : "Color Picked",
          detail: copyVal,
          type: "success",
          iconSvg: EYE_DROPPER_ICON_SVG,
          position: "bottom-right",
          duration: 1800
        })
      }

      // 4. Show floating palette modal with all formats
      showPaletteModal(colorItem)
    }
  } catch (err: unknown) {
    const error = err as { name?: string; message?: string }
    // AbortError is thrown when user presses Escape or cancels
    if (error?.name !== "AbortError") {
      console.warn("Browse Assist Color Picker error:", err)
      if (currentConfig.showToast) {
        showContentToast({
          message: "Could not open Color Picker",
          detail: error?.message || "User interaction required or not permitted",
          type: "error",
          duration: 2500
        })
      }
    }
  }
}

/**
 * Runtime message listener to receive picker triggers from background/popup.
 */
function onRuntimeMessage(
  message: { action?: string; type?: string },
  _sender: chrome.runtime.MessageSender,
  sendResponse: (response?: unknown) => void
): boolean | void {
  const msgType = message?.type || message?.action

  if (msgType === MESSAGE_TYPES.TRIGGER_COLOR_PICKER) {
    pickColor().then(() => sendResponse({ success: true }))
    return true
  }
}

/**
 * Updates runtime Color Picker config.
 */
export function updateColorPickerConfig(
  config?: Partial<ColorPickerConfig>
): void {
  if (!config) return
  currentConfig = { ...currentConfig, ...config }
}

/**
 * Activates the ColorPick Eyedropper content script listeners.
 */
export function activate(config?: ColorPickerConfig): void {
  if (config) {
    updateColorPickerConfig(config)
  }

  if (isActive || typeof window === "undefined") return
  isActive = true

  chrome.runtime.onMessage.addListener(onRuntimeMessage)
}

/**
 * Deactivates ColorPick Eyedropper and cleans up any active modals.
 */
export function deactivate(): void {
  if (!isActive) return
  isActive = false

  chrome.runtime.onMessage.removeListener(onRuntimeMessage)
  hidePaletteModal()
}
