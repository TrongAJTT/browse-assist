/**
 * Quick Hub - Background Service Worker Logic
 * Listens for keyboard shortcut commands to toggle Quick Hub on the active tab.
 */

import { MESSAGE_TYPES, sendToActiveTab } from "~core/messaging"

function onCommandListener(command: string): void {
  if (command === "toggle_quick_hub") {
    sendToActiveTab(MESSAGE_TYPES.TOGGLE_QUICK_HUB).catch(() => {})
  }
}

/**
 * Initializes the Quick Hub background service worker listeners.
 */
export async function initQuickHubBackground(): Promise<void> {
  chrome.commands?.onCommand?.addListener(onCommandListener)
}
