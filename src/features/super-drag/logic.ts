/**
 * Super Drag - Content Script Logic
 * Intercepts dragstart, dragover, and dragend events to trigger directional actions:
 * - Drag Right / Up: Search or Open Link in background
 * - Drag Left: Search or Open Link in active (foreground) tab
 * - Drag Down: Copy Text or Clean Link to clipboard
 */

import { cleanUrl } from "~features/context-menu-actions/cleanUrl"
import {
  DEFAULT_SUPER_DRAG_CONFIG,
  type SuperDragConfig
} from "~core/types"

let isActive = false
let currentConfig: SuperDragConfig = { ...DEFAULT_SUPER_DRAG_CONFIG }

// Minimum distance threshold in pixels to distinguish deliberate drag from text selection
const MIN_DRAG_DISTANCE = 25
// Maximum distance threshold in pixels to prevent stray cross-screen drags from executing
const MAX_DRAG_DISTANCE = 600

export type DragDirection = "up" | "down" | "left" | "right"

interface DragSession {
  startX: number
  startY: number
  type: "text" | "link"
  payload: string
}

let activeSession: DragSession | null = null
let toastElement: HTMLDivElement | null = null
let toastTimeoutId: number | null = null

/**
 * Floating feedback toast for Super Drag actions (e.g. Copied).
 */
function showToast(label: string, text: string): void {
  if (typeof document === "undefined") return

  if (!toastElement) {
    toastElement = document.createElement("div")
    toastElement.id = "browse-assist-drag-toast"
    toastElement.style.cssText = `
      position: fixed;
      bottom: 24px;
      right: 24px;
      z-index: 2147483647;
      background: rgba(15, 23, 42, 0.92);
      color: #f8fafc;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      font-size: 13px;
      font-weight: 500;
      padding: 8px 16px;
      border-radius: 8px;
      box-shadow: 0 4px 14px rgba(0, 0, 0, 0.25);
      border: 1px solid rgba(255, 255, 255, 0.15);
      pointer-events: none;
      transition: opacity 0.2s ease-in-out, transform 0.2s ease-in-out;
      opacity: 0;
      transform: translateY(6px);
      max-width: 360px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    `
    document.documentElement.appendChild(toastElement)
  }

  const preview = text.length > 40 ? text.slice(0, 37) + "..." : text
  toastElement.textContent = `${label}: "${preview}"`
  toastElement.style.opacity = "1"
  toastElement.style.transform = "translateY(0)"

  if (toastTimeoutId !== null) {
    window.clearTimeout(toastTimeoutId)
  }

  toastTimeoutId = window.setTimeout(() => {
    if (toastElement) {
      toastElement.style.opacity = "0"
      toastElement.style.transform = "translateY(6px)"
    }
    toastTimeoutId = null
  }, 1600)
}

/**
 * Copies text to clipboard with fallback.
 */
async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    try {
      const textarea = document.createElement("textarea")
      textarea.value = text
      textarea.style.position = "fixed"
      textarea.style.opacity = "0"
      document.body.appendChild(textarea)
      textarea.select()
      const successful = document.execCommand("copy")
      document.body.removeChild(textarea)
      return successful
    } catch {
      return false
    }
  }
}

/**
 * Determines primary drag direction based on displacement angles.
 */
function getDragDirection(deltaX: number, deltaY: number): DragDirection {
  if (Math.abs(deltaX) > Math.abs(deltaY)) {
    return deltaX > 0 ? "right" : "left"
  } else {
    return deltaY > 0 ? "down" : "up"
  }
}

/**
 * Checks if target is an editable form element where native drag must not be hijacked.
 */
function isEditableElement(target: EventTarget | null): boolean {
  if (!target || !(target instanceof HTMLElement)) return false

  const tagName = target.tagName.toUpperCase()
  if (tagName === "INPUT" || tagName === "TEXTAREA") return true
  if (target.isContentEditable) return true
  if (target.closest("[contenteditable='true']")) return true

  return false
}

/**
 * Captures drag start coordinates and extracts link or selected text.
 */
function onDragStart(event: DragEvent): void {
  if (!isActive) return

  // Safeguard: Do not intercept dragging inside form fields or rich text editors
  if (isEditableElement(event.target)) {
    activeSession = null
    return
  }

  const target = event.target as HTMLElement | null
  const anchor = target?.closest?.("a")

  // Check if dragging a hyperlink
  if (currentConfig.openHyperlinks && anchor && anchor.href) {
    activeSession = {
      startX: event.clientX,
      startY: event.clientY,
      type: "link",
      payload: anchor.href
    }
    return
  }

  // Check if dragging highlighted text
  if (currentConfig.searchSelectedText) {
    const selectedText = window.getSelection()?.toString().trim()
    if (selectedText) {
      activeSession = {
        startX: event.clientX,
        startY: event.clientY,
        type: "text",
        payload: selectedText
      }
      return
    }
  }

  activeSession = null
}

/**
 * Allows dropping anywhere by preventing default when an active drag session exists.
 */
function onDragOver(event: DragEvent): void {
  if (!isActive || !activeSession) return
  event.preventDefault()
  if (event.dataTransfer) {
    event.dataTransfer.dropEffect = "copy"
  }
}

/**
 * Calculates vector distance, determines direction, and dispatches action.
 */
async function onDragEnd(event: DragEvent): Promise<void> {
  if (!isActive || !activeSession) return

  const deltaX = event.clientX - activeSession.startX
  const deltaY = event.clientY - activeSession.startY
  const distance = Math.hypot(deltaX, deltaY)

  // Must exceed minimum threshold and not exceed maximum bounding distance
  if (distance >= MIN_DRAG_DISTANCE && distance <= MAX_DRAG_DISTANCE) {
    const direction = getDragDirection(deltaX, deltaY)

    if (direction === "down") {
      // DRAG DOWN: Copy to Clipboard
      if (activeSession.type === "text") {
        const success = await copyToClipboard(activeSession.payload)
        if (success) showToast("Copied Text", activeSession.payload)
      } else if (activeSession.type === "link") {
        const cleaned = cleanUrl(activeSession.payload)
        const success = await copyToClipboard(cleaned)
        if (success) showToast("Copied Clean Link", cleaned)
      }
    } else {
      // DRAG RIGHT / UP: Open in Background Tab
      // DRAG LEFT: Open in Active / Foreground Tab
      const openInBackground = direction === "left" ? false : true

      if (activeSession.type === "text" && currentConfig.searchSelectedText) {
        chrome.runtime.sendMessage({
          action: "SUPER_DRAG_SEARCH",
          text: activeSession.payload,
          openInBackground
        })
      } else if (activeSession.type === "link" && currentConfig.openHyperlinks) {
        chrome.runtime.sendMessage({
          action: "SUPER_DRAG_OPEN_LINK",
          url: activeSession.payload,
          openInBackground
        })
      }
    }
  }

  activeSession = null
}

/**
 * Hot updates runtime Super Drag config.
 */
export function updateSuperDragConfig(config?: Partial<SuperDragConfig>): void {
  if (!config) return
  currentConfig = { ...currentConfig, ...config }
}

/**
 * Activates the Super Drag event listeners.
 */
export function activate(config?: SuperDragConfig): void {
  if (config) {
    updateSuperDragConfig(config)
  }

  if (isActive || typeof window === "undefined") return
  isActive = true

  window.addEventListener("dragstart", onDragStart, true)
  window.addEventListener("dragover", onDragOver, true)
  window.addEventListener("dragend", onDragEnd, true)
}

/**
 * Deactivates the Super Drag event listeners and cleans up session state.
 */
export function deactivate(): void {
  if (!isActive || typeof window === "undefined") return
  isActive = false

  window.removeEventListener("dragstart", onDragStart, true)
  window.removeEventListener("dragover", onDragOver, true)
  window.removeEventListener("dragend", onDragEnd, true)

  if (toastElement && toastElement.parentNode) {
    toastElement.parentNode.removeChild(toastElement)
    toastElement = null
  }
  if (toastTimeoutId !== null) {
    window.clearTimeout(toastTimeoutId)
    toastTimeoutId = null
  }

  activeSession = null
}

