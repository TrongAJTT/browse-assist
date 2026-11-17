/**
 * Context Menu Actions - Background Service Worker Logic
 * Dynamically registers and manages right-click context menu options:
 * - Copy Link Text
 * - Copy Clean Link
 * - Copy Link as Markdown
 */

import { extensionStorage } from "~core/storage"
import {
  DEFAULT_CONTEXT_MENU_ACTIONS_CONFIG,
  DEFAULT_SETTINGS,
  STORAGE_KEYS,
  type ContextMenuActionId,
  type ContextMenuActionsConfig,
  type FeatureSettings
} from "~core/types"

export const MENU_ITEMS = {
  COPY_LINK_TEXT: "browse_assist_copy_link_text",
  CLEAN_LINK_COPY: "browse_assist_clean_link_copy",
  MARKDOWN_LINK_COPY: "browse_assist_markdown_link_copy",
  COPY_CLEAN_PAGE_URL: "browse_assist_copy_clean_page_url",
  COPY_PAGE_MARKDOWN: "browse_assist_copy_page_markdown",
  COPY_SELECTION_QUOTE: "browse_assist_copy_selection_quote"
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

    const defaultOrder = DEFAULT_CONTEXT_MENU_ACTIONS_CONFIG.order
    const rawOrder = Array.isArray(config.order) ? config.order : defaultOrder
    const order: ContextMenuActionId[] = [
      ...rawOrder.filter((id) => defaultOrder.includes(id)),
      ...defaultOrder.filter((id) => !rawOrder.includes(id))
    ]

    const actionDefinitions: Record<
      ContextMenuActionId,
      {
        id: MenuItemId
        title: string
        contexts: [chrome.contextMenus.ContextType, ...chrome.contextMenus.ContextType[]]
        enabled: boolean
      }
    > = {
      copyLinkText: {
        id: MENU_ITEMS.COPY_LINK_TEXT,
        title: "Copy Link Text",
        contexts: ["link"],
        enabled: config.copyLinkText
      },
      cleanLinkCopy: {
        id: MENU_ITEMS.CLEAN_LINK_COPY,
        title: "Copy Clean Link",
        contexts: ["link"],
        enabled: config.cleanLinkCopy
      },
      markdownLinkCopy: {
        id: MENU_ITEMS.MARKDOWN_LINK_COPY,
        title: "Copy Link as Markdown",
        contexts: ["link"],
        enabled: config.markdownLinkCopy
      },
      copyCleanPageUrl: {
        id: MENU_ITEMS.COPY_CLEAN_PAGE_URL,
        title: "Copy Clean Page URL",
        contexts: ["page"],
        enabled: config.copyCleanPageUrl ?? true
      },
      copyPageMarkdown: {
        id: MENU_ITEMS.COPY_PAGE_MARKDOWN,
        title: "Copy Page as Markdown",
        contexts: ["page"],
        enabled: config.copyPageMarkdown ?? false
      },
      copySelectionQuote: {
        id: MENU_ITEMS.COPY_SELECTION_QUOTE,
        title: "Copy Selection as Quote",
        contexts: ["selection"],
        enabled: config.copySelectionQuote ?? true
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
              contexts: def.contexts
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
  const validIds = Object.values(MENU_ITEMS) as string[]
  if (!validIds.includes(menuItemId)) {
    return
  }

  chrome.tabs
    .sendMessage(tab.id, {
      action: menuItemId,
      linkUrl: info.linkUrl || "",
      pageUrl: info.pageUrl || tab.url || "",
      selectionText: info.selectionText || ""
    })
    .catch((err) => {
      console.warn("Failed to dispatch context menu action to tab:", err)
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
