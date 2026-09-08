/**
 * Browse Assist - Type-Safe Messaging Wrapper
 * Standardizes communication between Popup, Content Scripts, and Background Service Worker.
 * Handles active tab discovery, errors, and Promise-based async workflows.
 */

import { MESSAGE_TYPES, type MessageType } from "~core/constants"

export { MESSAGE_TYPES, type MessageType }

export interface PiPSession {
  tabId: number
  title: string
}

/**
 * Registry of all message types, payloads, and response contracts in Browse Assist.
 */
export interface MessageRegistry {
  // Picture-in-Picture
  [MESSAGE_TYPES.FOCUS_PIP_TAB]: {
    request: undefined
    response: { ok: boolean }
  }
  [MESSAGE_TYPES.CLOSE_PIP]: {
    request: undefined
    response: { ok: boolean }
  }
  [MESSAGE_TYPES.GET_ACTIVE_PIP_SESSION]: {
    request: undefined
    response: { session: PiPSession | null }
  }
  [MESSAGE_TYPES.TOGGLE_PICTURE_IN_PICTURE]: {
    request: undefined
    response: { ok: boolean }
  }
  [MESSAGE_TYPES.EXIT_PICTURE_IN_PICTURE]: {
    request: undefined
    response: { ok: boolean }
  }
  [MESSAGE_TYPES.PIP_STATUS_CHANGED]: {
    request: { isPip: boolean; title?: string }
    response: { ok: boolean }
  }

  // Allow Right Click
  [MESSAGE_TYPES.GET_RIGHT_CLICK_STATUS]: {
    request: undefined
    response: { active: boolean }
  }
  [MESSAGE_TYPES.TOGGLE_RIGHT_CLICK]: {
    request: { enabled: boolean }
    response: { active: boolean }
  }
  [MESSAGE_TYPES.TOGGLE_RIGHT_CLICK_SHORTCUT]: {
    request: undefined
    response: { active: boolean }
  }

  // Mouse Pin-to-Zoom
  [MESSAGE_TYPES.RESET_MOUSE_ZOOM]: {
    request: undefined
    response: { success: boolean }
  }

  // Super Drag
  [MESSAGE_TYPES.SUPER_DRAG_SEARCH]: {
    request: { text: string; openInBackground: boolean }
    response: { ok: boolean }
  }
  [MESSAGE_TYPES.SUPER_DRAG_OPEN_LINK]: {
    request: { url: string; openInBackground: boolean }
    response: { ok: boolean }
  }

  // ColorPick Eyedropper
  [MESSAGE_TYPES.TRIGGER_COLOR_PICKER]: {
    request: undefined
    response: { success: boolean }
  }
}

/**
 * Standardized message envelope.
 * Always includes both `type` and `action` for 100% backwards-compatibility across all handlers.
 */
export type ExtensionMessageEnvelope<K extends keyof MessageRegistry> = {
  type: K
  action: K
} & (MessageRegistry[K]["request"] extends undefined
  ? object
  : MessageRegistry[K]["request"])

/**
 * Sends a type-safe message to the Background Service Worker.
 */
export async function sendToBackground<K extends keyof MessageRegistry>(
  type: K,
  payload?: MessageRegistry[K]["request"]
): Promise<MessageRegistry[K]["response"] | null> {
  if (typeof chrome === "undefined" || !chrome.runtime?.sendMessage) {
    return null
  }

  try {
    const envelope = {
      type,
      action: type,
      ...(payload || {})
    }
    const response = await chrome.runtime.sendMessage(envelope)
    return (response ?? null) as MessageRegistry[K]["response"] | null
  } catch {
    // Suppress background communication failures (e.g. extension reloading)
    return null
  }
}

/**
 * Sends a type-safe message to a specific tab.
 */
export async function sendToTab<K extends keyof MessageRegistry>(
  tabId: number,
  type: K,
  payload?: MessageRegistry[K]["request"]
): Promise<MessageRegistry[K]["response"] | null> {
  if (typeof chrome === "undefined" || !chrome.tabs?.sendMessage) {
    return null
  }

  try {
    const envelope = {
      type,
      action: type,
      ...(payload || {})
    }
    const response = await chrome.tabs.sendMessage(tabId, envelope)
    return (response ?? null) as MessageRegistry[K]["response"] | null
  } catch {
    // Suppress errors if content script is unavailable on tab (e.g. chrome:// or restricted origin)
    return null
  }
}

/**
 * Resolves the currently active tab in the focused/current browser window.
 */
export async function getActiveTab(): Promise<chrome.tabs.Tab | null> {
  if (typeof chrome === "undefined" || !chrome.tabs?.query) {
    return null
  }

  return new Promise((resolve) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      resolve(tabs[0] || null)
    })
  })
}

/**
 * Sends a type-safe message to the currently active tab.
 */
export async function sendToActiveTab<K extends keyof MessageRegistry>(
  type: K,
  payload?: MessageRegistry[K]["request"]
): Promise<MessageRegistry[K]["response"] | null> {
  const activeTab = await getActiveTab()
  if (!activeTab?.id) return null
  return sendToTab(activeTab.id, type, payload)
}
