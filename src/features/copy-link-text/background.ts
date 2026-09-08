/**
 * Copy Link Text - Background Service Worker Logic
 * Handles registration and interaction of the "Copy Link Text" context menu item.
 */

import { extensionStorage } from "~core/storage"
import { DEFAULT_SETTINGS, STORAGE_KEYS, type FeatureSettings } from "~core/types"

export const CONTEXT_MENU_ID = "browse_assist_copy_link_text"

let isRegistered = false

/**
 * Registers the context menu item if it is not already present.
 */
export function registerCopyLinkContextMenu(): void {
  if (typeof chrome === "undefined" || !chrome.contextMenus) return

  chrome.contextMenus.remove(CONTEXT_MENU_ID, () => {
    // Suppress runtime error if menu item was not present
    if (chrome.runtime.lastError) {
      // noop
    }

    chrome.contextMenus.create(
      {
        id: CONTEXT_MENU_ID,
        title: "Copy Link Text",
        contexts: ["link"]
      },
      () => {
        if (chrome.runtime.lastError) {
          console.warn("Failed to create context menu:", chrome.runtime.lastError.message)
        } else {
          isRegistered = true
        }
      }
    )
  })
}

/**
 * Removes the context menu item.
 */
export function unregisterCopyLinkContextMenu(): void {
  if (typeof chrome === "undefined" || !chrome.contextMenus) return

  chrome.contextMenus.remove(CONTEXT_MENU_ID, () => {
    if (chrome.runtime.lastError) {
      // noop
    }
    isRegistered = false
  })
}

/**
 * Handles context menu clicks for Copy Link Text.
 * Forwards the action to the active tab's content script to extract anchor text and copy to clipboard.
 */
export function handleContextMenuClick(
  info: chrome.contextMenus.OnClickData,
  tab?: chrome.tabs.Tab
): void {
  if (info.menuItemId !== CONTEXT_MENU_ID || !tab?.id) return

  chrome.tabs
    .sendMessage(tab.id, {
      action: "COPY_LINK_TEXT",
      linkUrl: info.linkUrl || ""
    })
    .catch((err) => {
      console.warn("Failed to dispatch copy message to tab:", err)
    })
}

/**
 * Initializes the background handlers and synchronizes with storage settings.
 */
export async function initCopyLinkBackground(): Promise<void> {
  if (typeof chrome === "undefined") return

  // Read current settings
  const settings = await extensionStorage.get<FeatureSettings>(STORAGE_KEYS.SETTINGS)
  const isEnabled = settings?.copyLinkText ?? DEFAULT_SETTINGS.copyLinkText

  if (isEnabled) {
    registerCopyLinkContextMenu()
  } else {
    unregisterCopyLinkContextMenu()
  }

  // Watch for toggle updates from popup
  extensionStorage.watch({
    [STORAGE_KEYS.SETTINGS]: (change) => {
      const nextSettings = change.newValue as FeatureSettings | undefined
      const nextEnabled = nextSettings?.copyLinkText ?? DEFAULT_SETTINGS.copyLinkText

      if (nextEnabled && !isRegistered) {
        registerCopyLinkContextMenu()
      } else if (!nextEnabled && isRegistered) {
        unregisterCopyLinkContextMenu()
      }
    }
  })

  // Listen for context menu click events
  if (chrome.contextMenus?.onClicked && !chrome.contextMenus.onClicked.hasListener(handleContextMenuClick)) {
    chrome.contextMenus.onClicked.addListener(handleContextMenuClick)
  }
}
