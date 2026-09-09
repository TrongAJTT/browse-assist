/**
 * Element Toys - Background Service Worker Logic
 * Listens for keyboard command and opens popup/settings upon user request.
 */

import { Storage } from "@plasmohq/storage"

import { MESSAGE_TYPES, sendToActiveTab } from "~core/messaging"
import { STORAGE_KEYS } from "~core/types"

const localStorage = new Storage({ area: "local" })

/**
 * Listens for commands registered in manifest.
 */
function onCommandListener(command: string): void {
  if (command === "toggle_element_zapper") {
    sendToActiveTab(MESSAGE_TYPES.TRIGGER_ELEMENT_ZAPPER).catch(() => {})
  }
}

/**
 * Listens for OPEN_POPUP requests from in-page HUD toolbar.
 */
function onMessageListener(
  message: { type?: string; action?: string; view?: string },
  _sender: chrome.runtime.MessageSender,
  sendResponse: (response?: { ok: boolean }) => void
): boolean | void {
  const msgType = message?.type || message?.action
  if (msgType === MESSAGE_TYPES.OPEN_POPUP) {
    ;(async () => {
      try {
        const targetView = message?.view || "element-zapper-settings"

        // Store into localStorage area matching popup.tsx LAST_VIEW key
        await localStorage.set(STORAGE_KEYS.LAST_VIEW, {
          view: targetView,
          timestamp: Date.now()
        })

        let opened = false
        const windowId = _sender.tab?.windowId

        // Try chrome.action.openPopup first
        if (typeof chrome.action?.openPopup === "function") {
          try {
            await chrome.action.openPopup(windowId ? { windowId } : undefined)
            opened = true
          } catch {
            // User gesture token might not be available across message port
          }
        }

        // Reliable fallback: open popup in dedicated extension popup window with direct ?view= query
        if (!opened) {
          try {
            const popupUrl = chrome.runtime.getURL(
              `popup.html?view=${encodeURIComponent(targetView)}`
            )
            await chrome.windows.create({
              url: popupUrl,
              type: "popup",
              width: 380,
              height: 580,
              focused: true
            })
            opened = true
          } catch {
            chrome.runtime.openOptionsPage()
          }
        }
      } catch (err) {
        console.error("Failed to open settings:", err)
      }
      sendResponse({ ok: true })
    })()
    return true
  }
}

/**
 * Initializes the Element Toys background listeners.
 */
export async function initElementZapperBackground(): Promise<void> {
  chrome.commands.onCommand.addListener(onCommandListener)
  chrome.runtime.onMessage.addListener(onMessageListener)
}
