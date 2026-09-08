/**
 * Super Drag - Content Script Logic
 * Intercepts dragstart, dragover, and dragend events to trigger search or open links.
 */

import {
  DEFAULT_SUPER_DRAG_CONFIG,
  type SuperDragConfig
} from "~core/types"

let isActive = false
let currentConfig: SuperDragConfig = { ...DEFAULT_SUPER_DRAG_CONFIG }

// Minimum distance threshold in pixels to distinguish deliberate drag from text selection click
const MIN_DRAG_DISTANCE = 25

interface DragSession {
  startX: number
  startY: number
  type: "text" | "link"
  payload: string
}

let activeSession: DragSession | null = null

/**
 * Checks if target is an editable input or textarea where native drag must not be hijacked.
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

  // Safeguard: Do not intercept dragging inside form fields or rich editors
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
 * Calculates vector distance and dispatches action to background worker.
 */
function onDragEnd(event: DragEvent): void {
  if (!isActive || !activeSession) return

  const deltaX = event.clientX - activeSession.startX
  const deltaY = event.clientY - activeSession.startY
  const distance = Math.hypot(deltaX, deltaY)

  // Only trigger if dragged beyond safety threshold
  if (distance >= MIN_DRAG_DISTANCE) {
    if (activeSession.type === "text" && currentConfig.searchSelectedText) {
      chrome.runtime.sendMessage({
        action: "SUPER_DRAG_SEARCH",
        text: activeSession.payload
      })
    } else if (activeSession.type === "link" && currentConfig.openHyperlinks) {
      chrome.runtime.sendMessage({
        action: "SUPER_DRAG_OPEN_LINK",
        url: activeSession.payload
      })
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

  activeSession = null
}
