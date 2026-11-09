/**
 * Allow Right Click - Background Service Worker Logic
 * Listens for browser shortcut commands to toggle Allow Right Click on the active tab.
 */

import { MESSAGE_TYPES, sendToActiveTab } from "~core/messaging"

/**
 * Listens for commands registered in manifest.
 */
function onCommandListener(command: string): void {
  if (command === "toggle_allow_right_click") {
    sendToActiveTab(MESSAGE_TYPES.TOGGLE_RIGHT_CLICK_SHORTCUT).catch(() => {})
  }
}

/**
 * Initializes the Allow Right Click background listeners.
 */
export async function initAllowRightClickBackground(): Promise<void> {
  chrome.commands.onCommand.addListener(onCommandListener)
}
