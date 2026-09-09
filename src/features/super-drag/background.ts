/**
 * Super Drag - Background Service Worker Logic
 * Handles tab creation, window splitting, new windows, and search queries.
 */

import { MESSAGE_TYPES } from "~core/messaging"
import { extensionStorage } from "~core/storage"
import {
  DEFAULT_SETTINGS,
  STORAGE_KEYS,
  type FeatureSettings,
  type SuperDragAction,
  type SuperDragConfig
} from "~core/types"
import { cleanUrl } from "~features/context-menu-actions/cleanUrl"

export interface SuperDragMessage {
  action?: string
  type?: string
  text?: string
  url?: string
  openInBackground?: boolean
  // Extended directional payload
  targetType?: "text" | "link" | "image"
  payload?: string
}

/**
 * Resolves a target URL from payload or search query.
 */
function resolveUrl(targetType: "text" | "link" | "image", payload: string): string {
  if (targetType === "text") {
    return `https://www.google.com/search?q=${encodeURIComponent(payload)}`
  }
  return cleanUrl(payload)
}

/**
 * Dual-Window Side-by-Side Split View (Model A).
 * Resizes current window to 50% left width, opens new window on 50% right width.
 */
async function handleSplitView(url: string, senderTab?: chrome.tabs.Tab): Promise<void> {
  try {
    const currentWin = senderTab?.windowId
      ? await chrome.windows.get(senderTab.windowId)
      : await chrome.windows.getCurrent()

    const screenLeft = currentWin.left ?? 0
    const screenTop = currentWin.top ?? 0
    const totalWidth = currentWin.width ?? 1280
    const totalHeight = currentWin.height ?? 800

    const halfWidth = Math.max(400, Math.floor(totalWidth / 2))

    // 1. Resize current window to left half
    if (currentWin.id) {
      await chrome.windows.update(currentWin.id, {
        left: screenLeft,
        top: screenTop,
        width: halfWidth,
        height: totalHeight,
        state: "normal"
      })
    }

    // 2. Open new window on right half
    await chrome.windows.create({
      url,
      left: screenLeft + halfWidth,
      top: screenTop,
      width: halfWidth,
      height: totalHeight,
      focused: true
    })
  } catch (err) {
    console.warn("Browse Assist: Failed to execute split view, falling back to new tab", err)
    chrome.tabs.create({ url, active: true })
  }
}

/**
 * Opens a URL in a new window with optional incognito or background focus.
 */
async function handleNewWindow(
  url: string,
  options: { incognito?: boolean; focused?: boolean }
): Promise<void> {
  const { incognito = false, focused = true } = options

  if (incognito) {
    const isAllowed = await new Promise<boolean>((resolve) => {
      if (chrome.extension?.isAllowedIncognitoAccess) {
        chrome.extension.isAllowedIncognitoAccess(resolve)
      } else {
        resolve(false)
      }
    })

    if (!isAllowed) {
      console.warn("Browse Assist: Extension not allowed in incognito mode.")
      // Fallback to active tab
      chrome.tabs.create({ url, active: true })
      return
    }
  }

  try {
    await chrome.windows.create({
      url,
      incognito,
      focused
    })
  } catch (err) {
    console.warn("Browse Assist: Failed to create window, falling back to tab", err)
    chrome.tabs.create({ url, active: focused })
  }
}

/**
 * Central dispatcher for Super Drag actions.
 */
async function executeSuperDragAction(
  action: SuperDragAction,
  targetType: "text" | "link" | "image",
  rawPayload: string,
  senderTab?: chrome.tabs.Tab
): Promise<void> {
  if (action === "none") return

  const url = resolveUrl(targetType, rawPayload)

  switch (action) {
    case "open_bg_tab": {
      let targetIndex: number | undefined
      if (senderTab && typeof senderTab.index === "number") {
        targetIndex = senderTab.index + 1
      }
      chrome.tabs.create({ url, active: false, index: targetIndex })
      break
    }
    case "open_active_tab": {
      let targetIndex: number | undefined
      if (senderTab && typeof senderTab.index === "number") {
        targetIndex = senderTab.index + 1
      }
      chrome.tabs.create({ url, active: true, index: targetIndex })
      break
    }
    case "open_split_view":
      await handleSplitView(url, senderTab)
      break
    case "open_window_active":
      await handleNewWindow(url, { focused: true })
      break
    case "open_window_bg":
      await handleNewWindow(url, { focused: false })
      break
    case "open_incognito_active":
      await handleNewWindow(url, { incognito: true, focused: true })
      break
    case "open_incognito_bg":
      await handleNewWindow(url, { incognito: true, focused: false })
      break
    default:
      chrome.tabs.create({ url, active: false })
      break
  }
}

/**
 * Executes a search query using the browser's default search engine (legacy).
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

    if (openInBackground && senderTab?.id) {
      try {
        await chrome.tabs.update(senderTab.id, { active: true })
      } catch {
        // Suppress if tab was closed
      }
    }
  } else {
    const fallbackUrl = `https://www.google.com/search?q=${encodeURIComponent(text)}`
    chrome.tabs.create({
      url: fallbackUrl,
      active: !openInBackground
    })
  }
}

/**
 * Opens a hyperlink in a new tab (legacy).
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

  if (senderTab && typeof senderTab.index === "number") {
    targetIndex = senderTab.index + 1
  }

  chrome.tabs.create({
    url,
    active: !overrideBackground,
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
  const msgType = message?.type || message?.action

  if (
    msgType !== MESSAGE_TYPES.SUPER_DRAG_SEARCH &&
    msgType !== MESSAGE_TYPES.SUPER_DRAG_OPEN_LINK &&
    msgType !== MESSAGE_TYPES.SUPER_DRAG_EXECUTE_ACTION
  ) {
    return
  }

  extensionStorage
    .get<FeatureSettings>(STORAGE_KEYS.SETTINGS)
    .then(async (settings) => {
      const isMasterEnabled = settings?.superDrag ?? DEFAULT_SETTINGS.superDrag
      if (!isMasterEnabled) {
        sendResponse({ success: false, reason: "disabled" })
        return
      }

      const config: SuperDragConfig =
        settings?.superDragConfig ?? DEFAULT_SETTINGS.superDragConfig

      if (msgType === MESSAGE_TYPES.SUPER_DRAG_EXECUTE_ACTION) {
        const action = (message as unknown as { action: SuperDragAction }).action
        const targetType = message.targetType ?? "text"
        const payload = message.payload ?? ""

        if (action && payload) {
          await executeSuperDragAction(action, targetType, payload, sender.tab)
          sendResponse({ success: true })
        } else {
          sendResponse({ success: false, error: "Missing action or payload" })
        }
      } else if (msgType === MESSAGE_TYPES.SUPER_DRAG_SEARCH && message.text) {
        if (config.searchSelectedText) {
          await handleSearch(
            message.text,
            config,
            sender.tab,
            message.openInBackground
          )
        }
        sendResponse({ success: true })
      } else if (msgType === MESSAGE_TYPES.SUPER_DRAG_OPEN_LINK && message.url) {
        if (config.openHyperlinks) {
          await handleOpenLink(
            message.url,
            config,
            sender.tab,
            message.openInBackground
          )
        }
        sendResponse({ success: true })
      }
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
