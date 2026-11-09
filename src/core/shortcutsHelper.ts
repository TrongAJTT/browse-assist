import { showFirefoxShortcutGuide } from "~components/GlobalDialogHost"

import { getBrowserShortcutUrl } from "./browserDetect"

/**
 * Standardized function to open the browser shortcut settings page.
 * - Detects Chrome, Edge, Brave, Opera and opens their respective internal shortcut pages.
 * - For Firefox, displays the specialized Firefox Shortcut Configuration Guide dialog.
 */
export async function openBrowserShortcutsPage(): Promise<void> {
  const shortcutUrl = getBrowserShortcutUrl()

  if (shortcutUrl) {
    if (typeof chrome !== "undefined" && chrome.tabs?.create) {
      chrome.tabs.create({ url: shortcutUrl })
    } else if (typeof window !== "undefined") {
      window.open(shortcutUrl, "_blank")
    }
  } else {
    // Firefox or unsupported direct about: URL navigation
    await showFirefoxShortcutGuide()
  }
}
