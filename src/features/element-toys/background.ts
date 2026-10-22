/**
 * Element Toys - Background Service Worker Logic
 * Listens for keyboard command and opens popup/settings upon user request.
 */

import { MESSAGE_TYPES, sendToActiveTab } from "~core/messaging"
import { openExtensionPopup } from "~core/popupHelper"
import type { ActiveView } from "~core/types"

/**
 * Listens for commands registered in manifest.
 */
function onCommandListener(command: string): void {
  if (command === "toggle_element_toys") {
    sendToActiveTab(MESSAGE_TYPES.TRIGGER_ELEMENT_TOYS).catch(() => {})
  }
}

/**
 * Listens for OPEN_POPUP requests from in-page HUD toolbar.
 */
function onMessageListener(
  message: { type?: string; action?: string; view?: string },
  _sender: chrome.runtime.MessageSender,
  sendResponse: (response?: { ok: boolean }) => void
): boolean | void {
  const msgType = message?.type || message?.action
  if (msgType === MESSAGE_TYPES.OPEN_POPUP) {
    const targetView = (message?.view as ActiveView) || "element-toys-settings"
    openExtensionPopup(targetView).catch((err) => {
      console.error("Failed to open popup:", err)
    })
    sendResponse({ ok: true })
    return true
  }
}

/**
 * Initializes the Element Toys background listeners.
 */
export async function initElementToysBackground(): Promise<void> {
  chrome.commands.onCommand.addListener(onCommandListener)
  chrome.runtime.onMessage.addListener(onMessageListener)
}

