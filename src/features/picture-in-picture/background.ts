/**
 * Universal Picture-in-Picture - Background Service Worker Logic
 * Handles global badge indicator ("PiP"), tab title tooltips,
 * chrome.commands routing, and tracking the single active PiP tab.
 */

import { MESSAGE_TYPES, sendToActiveTab, sendToTab } from "~core/messaging"
import { extensionStorage } from "~core/storage"
import {
  DEFAULT_SETTINGS,
  STORAGE_KEYS,
  type FeatureSettings,
  type PictureInPictureConfig
} from "~core/types"

export interface ActivePiPSession {
  tabId: number
  title: string
}

let activeSession: ActivePiPSession | null = null

/**
 * Updates extension action badge for Picture-in-Picture.
 */
async function updateBadge(isPip: boolean, title?: string): Promise<void> {
  const settings = await extensionStorage.get<FeatureSettings>(
    STORAGE_KEYS.SETTINGS
  )
  const isMasterEnabled =
    settings?.pictureInPicture ?? DEFAULT_SETTINGS.pictureInPicture
  const config: PictureInPictureConfig =
    settings?.pictureInPictureConfig ?? DEFAULT_SETTINGS.pictureInPictureConfig

  if (!isMasterEnabled || !config.showBadge || !isPip) {
    await chrome.action.setBadgeText({ text: "" })
    await chrome.action.setTitle({ title: "Browse Assist" })
    return
  }

  await chrome.action.setBadgeText({ text: "PiP" })
  await chrome.action.setBadgeBackgroundColor({ color: "#6366f1" }) // Indigo
  if (title) {
    await chrome.action.setTitle({ title: `Playing in PiP: ${title}` })
  }
}

/**
 * Focuses the tab currently running Picture-in-Picture.
 */
export async function focusPiPTab(): Promise<boolean> {
  if (!activeSession) return false

  try {
    const tab = await chrome.tabs.get(activeSession.tabId)
    if (tab && tab.id) {
      if (typeof tab.windowId === "number") {
        await chrome.windows.update(tab.windowId, { focused: true })
      }
      await chrome.tabs.update(tab.id, { active: true })
      return true
    }
  } catch {
    activeSession = null
    await updateBadge(false)
  }

  return false
}

/**
 * Sends a message to the active PiP tab to exit PiP.
 */
export async function closeActivePiP(): Promise<void> {
  if (!activeSession) return

  await sendToTab(activeSession.tabId, MESSAGE_TYPES.EXIT_PICTURE_IN_PICTURE)

  activeSession = null
  await updateBadge(false)
}

/**
 * Message listener for PiP events across tabs and popup queries.
 */
function onMessageListener(
  message: { action?: string; type?: string; isPip?: boolean; title?: string },
  sender: chrome.runtime.MessageSender,
  sendResponse: (response?: unknown) => void
): boolean | void {
  const msgType = message?.type || message?.action

  if (msgType === MESSAGE_TYPES.PIP_STATUS_CHANGED) {
    if (message.isPip && sender.tab?.id) {
      activeSession = {
        tabId: sender.tab.id,
        title: message.title || sender.tab.title || "Video"
      }
      updateBadge(true, activeSession.title).catch(() => {})
    } else {
      if (sender.tab?.id && activeSession?.tabId === sender.tab.id) {
        activeSession = null
        updateBadge(false).catch(() => {})
      }
    }
    sendResponse({ ok: true })
    return true
  }

  if (msgType === MESSAGE_TYPES.GET_ACTIVE_PIP_SESSION) {
    sendResponse({ session: activeSession })
    return true
  }

  if (msgType === MESSAGE_TYPES.FOCUS_PIP_TAB) {
    focusPiPTab().then((success) => sendResponse({ ok: success }))
    return true
  }

  if (msgType === MESSAGE_TYPES.CLOSE_PIP) {
    closeActivePiP().then(() => sendResponse({ ok: true }))
    return true
  }
}

/**
 * Clears PiP session if the hosting tab is closed or reloaded.
 */
function onTabRemovedListener(tabId: number): void {
  if (activeSession && activeSession.tabId === tabId) {
    activeSession = null
    updateBadge(false).catch(() => {})
  }
}

/**
 * Listens for the browser shortcut defined in manifest commands.
 */
function onCommandListener(command: string): void {
  if (command === "toggle_picture_in_picture") {
    sendToActiveTab(MESSAGE_TYPES.TOGGLE_PICTURE_IN_PICTURE).catch(() => {})
  }
}

/**
 * Initializes the Picture-in-Picture background listeners.
 */
export async function initPictureInPictureBackground(): Promise<void> {
  chrome.runtime.onMessage.addListener(onMessageListener)
  chrome.tabs.onRemoved.addListener(onTabRemovedListener)
  chrome.commands.onCommand.addListener(onCommandListener)

  // Watch storage: If pictureInPicture is turned off while a video is in PiP, close it immediately
  extensionStorage.watch({
    [STORAGE_KEYS.SETTINGS]: (change) => {
      const newSettings = change.newValue as FeatureSettings | undefined
      if (newSettings && !newSettings.pictureInPicture && activeSession) {
        closeActivePiP().catch(() => {})
      } else if (
        newSettings &&
        !newSettings.pictureInPictureConfig?.showBadge
      ) {
        chrome.action.setBadgeText({ text: "" }).catch(() => {})
      }
    }
  })
}
