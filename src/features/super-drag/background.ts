/**
 * Super Drag - Background Service Worker Logic
 * Handles tab creation and search queries initiated by drag operations.
 */

import { cleanUrl } from "~features/context-menu-actions/cleanUrl"
import { extensionStorage } from "~core/storage"
import {
  DEFAULT_SETTINGS,
  STORAGE_KEYS,
  type FeatureSettings,
  type SuperDragConfig
} from "~core/types"

export interface SuperDragMessage {
  action: "SUPER_DRAG_SEARCH" | "SUPER_DRAG_OPEN_LINK"
  text?: string
  url?: string
  openInBackground?: boolean
}

/**
 * Executes a search query using the browser's default search engine.
 */
async function handleSearch(
  text: string,
  _config: SuperDragConfig,
  senderTab?: chrome.tabs.Tab,
  overrideBackground = true
): Promise<void> {
  if (!text) return

  const openInBackground = overrideBackground

  if (chrome.search?.query) {
    await chrome.search.query({
      text,
      disposition: "NEW_TAB"
    })

    // If configured to open in background, refocus the sender tab
    if (openInBackground && senderTab?.id) {
      try {
        await chrome.tabs.update(senderTab.id, { active: true })
      } catch {
        // Suppress if tab was closed
      }
    }
  } else {
    // Fallback if chrome.search is unavailable in specific environment
    const fallbackUrl = `https://www.google.com/search?q=${encodeURIComponent(text)}`
    chrome.tabs.create({
      url: fallbackUrl,
      active: !openInBackground
    })
  }
}

/**
 * Opens a hyperlink in a new tab (with optional tracking parameter cleaning).
 */
async function handleOpenLink(
  rawUrl: string,
  _config: SuperDragConfig,
  senderTab?: chrome.tabs.Tab,
  overrideBackground = true
): Promise<void> {
  if (!rawUrl) return

  const url = cleanUrl(rawUrl)
  let targetIndex: number | undefined

  // Default natural behavior: open adjacent to current tab if possible
  if (senderTab && typeof senderTab.index === "number") {
    targetIndex = senderTab.index + 1
  }

  const openInBackground = overrideBackground

  chrome.tabs.create({
    url,
    active: !openInBackground,
    index: targetIndex
  })
}

/**
 * Runtime message listener for Super Drag actions.
 */
function onMessageListener(
  message: SuperDragMessage,
  sender: chrome.runtime.MessageSender,
  sendResponse: (response?: unknown) => void
): boolean | void {
  if (
    message?.action !== "SUPER_DRAG_SEARCH" &&
    message?.action !== "SUPER_DRAG_OPEN_LINK"
  ) {
    return
  }

  extensionStorage
    .get<FeatureSettings>(STORAGE_KEYS.SETTINGS)
    .then((settings) => {
      const isMasterEnabled =
        settings?.superDrag ?? DEFAULT_SETTINGS.superDrag
      if (!isMasterEnabled) return

      const config: SuperDragConfig =
        settings?.superDragConfig ?? DEFAULT_SETTINGS.superDragConfig

      if (message.action === "SUPER_DRAG_SEARCH" && message.text) {
        if (config.searchSelectedText) {
          handleSearch(
            message.text,
            config,
            sender.tab,
            message.openInBackground
          )
        }
      } else if (message.action === "SUPER_DRAG_OPEN_LINK" && message.url) {
        if (config.openHyperlinks) {
          handleOpenLink(
            message.url,
            config,
            sender.tab,
            message.openInBackground
          )
        }
      }
      sendResponse({ success: true })
    })
    .catch((err) => {
      console.warn("Browse Assist: Failed to execute Super Drag action", err)
      sendResponse({ success: false, error: String(err) })
    })

  return true // Async response
}

/**
 * Initializes Super Drag background message listeners.
 */
export async function initSuperDragBackground(): Promise<void> {
  if (typeof chrome === "undefined" || !chrome.runtime?.onMessage) return

  if (!chrome.runtime.onMessage.hasListener(onMessageListener)) {
    chrome.runtime.onMessage.addListener(onMessageListener)
  }
}
