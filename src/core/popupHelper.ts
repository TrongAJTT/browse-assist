import { Storage } from "@plasmohq/storage"

import { MESSAGE_TYPES, sendToBackground } from "./messaging"
import { STORAGE_KEYS, type ActiveView } from "./types"

const localStorage = new Storage({ area: "local" })

/**
 * Shared API to open the Browse Assist extension popup,
 * optionally navigating directly to a specific sub-view.
 *
 * Supported across:
 * - Options Page (extension page)
 * - Content Scripts (in-page elements/HUD)
 * - Background Service Worker
 *
 * @param view - The target sub-view to display (defaults to "main")
 */
export async function openExtensionPopup(
  view: ActiveView = "main",
  siteUrl?: string
): Promise<void> {
  // 1. Persist intended target view (and optional source tab URL) so popup.tsx restores it immediately
  try {
    await localStorage.set(STORAGE_KEYS.LAST_VIEW, {
      view,
      ...(siteUrl ? { siteUrl } : {}),
      timestamp: Date.now()
    })
  } catch {
    // Ignore storage errors
  }

  const query = new URLSearchParams()
  if (view !== "main") query.set("view", view)
  if (siteUrl) query.set("siteUrl", siteUrl)
  const queryString = query.toString() ? `?${query.toString()}` : ""

  // 2. Extension context with direct chrome.action or chrome.windows API
  if (typeof chrome !== "undefined") {
    // Try chrome.action.openPopup first (supported in Chromium 99+ with user interaction)
    if (typeof chrome.action?.openPopup === "function") {
      try {
        await chrome.action.openPopup()
        return
      } catch {
        // Fall through to dedicated popup window
      }
    }

    // Try opening as a dedicated sleek popup window (standard dimensions: 444x600 matching popup)
    if (typeof chrome.windows?.create === "function") {
      try {
        const popupUrl = chrome.runtime.getURL(`popup.html${queryString}`)
        await chrome.windows.create({
          url: popupUrl,
          type: "popup",
          width: 444,
          height: 600,
          focused: true
        })
        return
      } catch {
        // Fall through to background message
      }
    }

    // If in content script or restricted tab context, request background service worker to open
    try {
      await sendToBackground(MESSAGE_TYPES.OPEN_POPUP, {
        view,
        ...(siteUrl ? { siteUrl } : {})
      })
      return
    } catch {
      // Fall through to window.open
    }
  }

  // 3. Web window fallback
  if (typeof window !== "undefined") {
    const popupUrl =
      typeof chrome !== "undefined" && chrome.runtime?.getURL
        ? chrome.runtime.getURL(`popup.html${queryString}`)
        : `popup.html${queryString}`
    window.open(
      popupUrl,
      "BrowseAssistPopup",
      "width=444,height=600,menubar=no,toolbar=no,location=no,status=no"
    )
  }
}
