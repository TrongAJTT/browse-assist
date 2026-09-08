/**
 * Element Zapper - Background Service Worker Logic
 * Listens for the Alt+Shift+Z keyboard command and dispatches to the active tab.
 */

import { MESSAGE_TYPES, sendToActiveTab } from "~core/messaging"

/**
 * Listens for commands registered in manifest.
 */
function onCommandListener(command: string): void {
  if (command === "toggle_element_zapper") {
    sendToActiveTab(MESSAGE_TYPES.TRIGGER_ELEMENT_ZAPPER).catch(() => {})
  }
}

/**
 * Initializes the Element Zapper background listeners.
 */
export async function initElementZapperBackground(): Promise<void> {
  chrome.commands.onCommand.addListener(onCommandListener)
}
