/**
 * Allow Right Click - Background Service Worker Logic
 * Listens for browser shortcut commands to toggle Allow Right Click on the active tab.
 */

/**
 * Listens for commands registered in manifest.
 */
function onCommandListener(command: string): void {
  if (command === "toggle_allow_right_click") {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const activeTab = tabs[0]
      if (activeTab?.id) {
        chrome.tabs
          .sendMessage(activeTab.id, {
            type: "TOGGLE_RIGHT_CLICK_SHORTCUT"
          })
          .catch(() => {
            // Tab may not have content script injected (e.g. chrome:// or restricted pages)
          })
      }
    })
  }
}

/**
 * Initializes the Allow Right Click background listeners.
 */
export async function initAllowRightClickBackground(): Promise<void> {
  chrome.commands.onCommand.addListener(onCommandListener)
}
