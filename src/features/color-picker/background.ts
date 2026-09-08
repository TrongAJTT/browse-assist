/**
 * ColorPick Eyedropper - Background Service Worker Logic
 * Listens for the Alt+Shift+C keyboard command and dispatches to active tab.
 */

import { MESSAGE_TYPES, sendToActiveTab } from "~core/messaging"

/**
 * Listens for commands registered in manifest.
 */
function onCommandListener(command: string): void {
  if (command === "toggle_color_picker") {
    sendToActiveTab(MESSAGE_TYPES.TRIGGER_COLOR_PICKER).catch(() => {})
  }
}

/**
 * Initializes the Color Picker background listeners.
 */
export async function initColorPickerBackground(): Promise<void> {
  chrome.commands.onCommand.addListener(onCommandListener)
}
