/**
 * Context Menu Actions - Background Service Worker Logic
 * Dynamically registers and manages right-click context menu options:
 * - Copy Link Text
 * - Copy Clean Link
 * - Copy Link as Markdown
 */

import { extensionStorage } from "~core/storage"
import {
  DEFAULT_SETTINGS,
  STORAGE_KEYS,
  type ContextMenuActionsConfig,
  type FeatureSettings
} from "~core/types"

export const MENU_ITEMS = {
  COPY_LINK_TEXT: "browse_assist_copy_link_text",
  CLEAN_LINK_COPY: "browse_assist_clean_link_copy",
  MARKDOWN_LINK_COPY: "browse_assist_markdown_link_copy"
} as const

type MenuItemId = (typeof MENU_ITEMS)[keyof typeof MENU_ITEMS]

const registeredMenuIds = new Set<string>()

/**
 * Synchronizes context menus with active configuration.
 */
export function updateContextMenus(
  masterEnabled: boolean,
  config: ContextMenuActionsConfig
): void {
  if (typeof chrome === "undefined" || !chrome.contextMenus) return

  // Remove all our registered menus first to avoid conflicts
  chrome.contextMenus.removeAll(() => {
    if (chrome.runtime.lastError) {
      // Suppress removal errors
    }
    registeredMenuIds.clear()

    if (!masterEnabled) return

    // Register Copy Link Text
    if (config.copyLinkText) {
      chrome.contextMenus.create(
        {
          id: MENU_ITEMS.COPY_LINK_TEXT,
          title: "Copy Link Text",
          contexts: ["link"]
        },
        () => {
          if (!chrome.runtime.lastError) {
            registeredMenuIds.add(MENU_ITEMS.COPY_LINK_TEXT)
          }
        }
      )
    }

    // Register Clean Link Copy
    if (config.cleanLinkCopy) {
      chrome.contextMenus.create(
        {
          id: MENU_ITEMS.CLEAN_LINK_COPY,
          title: "Copy Clean Link",
          contexts: ["link"]
        },
        () => {
          if (!chrome.runtime.lastError) {
            registeredMenuIds.add(MENU_ITEMS.CLEAN_LINK_COPY)
          }
        }
      )
    }

    // Register Markdown Link Copy
    if (config.markdownLinkCopy) {
      chrome.contextMenus.create(
        {
          id: MENU_ITEMS.MARKDOWN_LINK_COPY,
          title: "Copy Link as Markdown",
          contexts: ["link"]
        },
        () => {
          if (!chrome.runtime.lastError) {
            registeredMenuIds.add(MENU_ITEMS.MARKDOWN_LINK_COPY)
          }
        }
      )
    }
  })
}

/**
 * Handles context menu clicks and forwards the command to the active tab's content script.
 */
export function handleContextMenuClick(
  info: chrome.contextMenus.OnClickData,
  tab?: chrome.tabs.Tab
): void {
  if (!tab?.id) return

  const menuItemId = info.menuItemId as MenuItemId
  if (
    menuItemId !== MENU_ITEMS.COPY_LINK_TEXT &&
    menuItemId !== MENU_ITEMS.CLEAN_LINK_COPY &&
    menuItemId !== MENU_ITEMS.MARKDOWN_LINK_COPY
  ) {
    return
  }

  chrome.tabs
    .sendMessage(tab.id, {
      action: menuItemId,
      linkUrl: info.linkUrl || ""
    })
    .catch((err) => {
      console.warn("Failed to dispatch link copy message to tab:", err)
    })
}

/**
 * Initializes the background handlers and synchronizes with storage settings.
 */
export async function initContextMenuActionsBackground(): Promise<void> {
  if (typeof chrome === "undefined") return

  // Read current settings
  const settings = await extensionStorage.get<FeatureSettings>(STORAGE_KEYS.SETTINGS)
  const isMasterEnabled =
    settings?.contextMenuActions ?? DEFAULT_SETTINGS.contextMenuActions
  const config =
    settings?.contextMenuActionsConfig ?? DEFAULT_SETTINGS.contextMenuActionsConfig

  updateContextMenus(isMasterEnabled, config)

  // Watch for toggle & config updates from popup
  extensionStorage.watch({
    [STORAGE_KEYS.SETTINGS]: (change) => {
      const nextSettings = change.newValue as FeatureSettings | undefined
      const nextMaster =
        nextSettings?.contextMenuActions ?? DEFAULT_SETTINGS.contextMenuActions
      const nextConfig =
        nextSettings?.contextMenuActionsConfig ??
        DEFAULT_SETTINGS.contextMenuActionsConfig

      updateContextMenus(nextMaster, nextConfig)
    }
  })

  // Listen for context menu click events
  if (
    chrome.contextMenus?.onClicked &&
    !chrome.contextMenus.onClicked.hasListener(handleContextMenuClick)
  ) {
    chrome.contextMenus.onClicked.addListener(handleContextMenuClick)
  }
}
