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
let isUpdating = false
let pendingUpdate: { masterEnabled: boolean; config: ContextMenuActionsConfig } | null = null

/**
 * Resolves the active contextMenus / menus API across Chromium and Gecko (Firefox).
 */
function getMenusApi(): typeof chrome.contextMenus | null {
  const globalObj = globalThis as unknown as {
    browser?: {
      contextMenus?: typeof chrome.contextMenus
      menus?: typeof chrome.contextMenus
    }
    chrome?: { contextMenus?: typeof chrome.contextMenus }
  }

  return (
    globalObj.browser?.contextMenus ||
    globalObj.browser?.menus ||
    globalObj.chrome?.contextMenus ||
    null
  )
}

/**
 * Synchronizes context menus with active configuration.
 * Uses mutex locking and promise resolution to avoid race conditions in Firefox MV3 event pages.
 */
export async function updateContextMenus(
  masterEnabled: boolean,
  config: ContextMenuActionsConfig
): Promise<void> {
  const menusApi = getMenusApi()
  if (!menusApi) return

  if (isUpdating) {
    pendingUpdate = { masterEnabled, config }
    return
  }

  isUpdating = true

  try {
    // Safely remove all our registered menus first
    await new Promise<void>((resolve) => {
      try {
        const res = (menusApi.removeAll as (cb?: () => void) => unknown)(() => {
          resolve()
        })
        if (res && typeof (res as Promise<void>).then === "function") {
          ;(res as Promise<void>).then(() => resolve()).catch(() => resolve())
        }
      } catch {
        resolve()
      }
    })

    registeredMenuIds.clear()

    if (!masterEnabled) return

    const order = config.order || [
      "copyLinkText",
      "cleanLinkCopy",
      "markdownLinkCopy"
    ]

    const actionDefinitions = {
      copyLinkText: {
        id: MENU_ITEMS.COPY_LINK_TEXT,
        title: "Copy Link Text",
        enabled: config.copyLinkText
      },
      cleanLinkCopy: {
        id: MENU_ITEMS.CLEAN_LINK_COPY,
        title: "Copy Clean Link",
        enabled: config.cleanLinkCopy
      },
      markdownLinkCopy: {
        id: MENU_ITEMS.MARKDOWN_LINK_COPY,
        title: "Copy Link as Markdown",
        enabled: config.markdownLinkCopy
      }
    }

    // Register items in the exact sequence specified by order
    for (const actionId of order) {
      const def = actionDefinitions[actionId]
      if (def && def.enabled) {
        try {
          menusApi.create(
            {
              id: def.id,
              title: def.title,
              contexts: ["link"]
            },
            () => {
              const err = chrome.runtime?.lastError
              if (err) {
                console.warn("[Browse Assist] Context menu error:", err.message)
              } else {
                registeredMenuIds.add(def.id)
              }
            }
          )
        } catch (err) {
          console.warn("[Browse Assist] Context menu create error:", err)
        }
      }
    }
  } finally {
    isUpdating = false
    if (pendingUpdate) {
      const next = pendingUpdate
      pendingUpdate = null
      await updateContextMenus(next.masterEnabled, next.config)
    }
  }
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
 * Synchronizes context menus from storage.
 */
async function syncMenusFromStorage(): Promise<void> {
  const settings = await extensionStorage.get<FeatureSettings>(
    STORAGE_KEYS.SETTINGS
  )
  const isMasterEnabled =
    settings?.contextMenuActions ?? DEFAULT_SETTINGS.contextMenuActions
  const config =
    settings?.contextMenuActionsConfig ??
    DEFAULT_SETTINGS.contextMenuActionsConfig

  await updateContextMenus(isMasterEnabled, config)
}

/**
 * Initializes the background handlers and synchronizes with storage settings.
 */
export async function initContextMenuActionsBackground(): Promise<void> {
  const menusApi = getMenusApi()
  if (!menusApi) return

  // Initial sync
  await syncMenusFromStorage()

  // Register in runtime lifecycle hooks for Firefox & Chrome MV3 persistence
  if (
    chrome.runtime?.onInstalled &&
    !chrome.runtime.onInstalled.hasListener(syncMenusFromStorage)
  ) {
    chrome.runtime.onInstalled.addListener(syncMenusFromStorage)
  }
  if (
    chrome.runtime?.onStartup &&
    !chrome.runtime.onStartup.hasListener(syncMenusFromStorage)
  ) {
    chrome.runtime.onStartup.addListener(syncMenusFromStorage)
  }

  // Watch for toggle & config updates from popup
  extensionStorage.watch({
    [STORAGE_KEYS.SETTINGS]: (change) => {
      const nextSettings = change.newValue as FeatureSettings | undefined
      const nextMaster =
        nextSettings?.contextMenuActions ?? DEFAULT_SETTINGS.contextMenuActions
      const nextConfig =
        nextSettings?.contextMenuActionsConfig ??
        DEFAULT_SETTINGS.contextMenuActionsConfig

      updateContextMenus(nextMaster, nextConfig).catch(() => {})
    }
  })

  // Listen for context menu click events
  if (
    menusApi.onClicked &&
    !menusApi.onClicked.hasListener(handleContextMenuClick)
  ) {
    menusApi.onClicked.addListener(handleContextMenuClick)
  }
}
