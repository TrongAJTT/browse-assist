import { Storage, type StorageWatchCallback } from "@plasmohq/storage"

import {
  DEFAULT_SETTINGS,
  DEFAULT_SITE_RULES,
  STORAGE_KEYS,
  type FeatureKey,
  type FeatureSettings,
  type SiteRule
} from "./types"

/**
 * Shared Plasmo storage instance.
 * Defaults to `chrome.storage.sync` if available, otherwise falls back to `chrome.storage.local`.
 */
export const extensionStorage = new Storage()

/**
 * Retrieves the current feature settings from storage,
 * merged with default settings for any missing keys.
 */
export async function getStoredSettings(): Promise<FeatureSettings> {
  const settings = await extensionStorage.get<FeatureSettings>(
    STORAGE_KEYS.SETTINGS
  )
  return { ...DEFAULT_SETTINGS, ...settings }
}

/**
 * Updates a single feature toggle in storage and returns the updated settings.
 *
 * @param key - The feature key to update
 * @param enabled - Whether the feature should be enabled or disabled
 */
export async function updateFeatureSetting(
  key: FeatureKey,
  enabled: boolean
): Promise<FeatureSettings> {
  return updateStoredSettings((current) => ({
    ...current,
    [key]: enabled
  }))
}

/**
 * Atomically reads, transforms, and persists the full FeatureSettings object.
 */
export async function updateStoredSettings(
  updater: (current: FeatureSettings) => FeatureSettings
): Promise<FeatureSettings> {
  const current = await getStoredSettings()
  const next = updater(current)
  await extensionStorage.set(STORAGE_KEYS.SETTINGS, next)
  return next
}

/**
 * Subscribes to settings updates in real time across any extension context.
 *
 * @param callback - Called whenever settings change with the new resolved FeatureSettings
 * @returns A cleanup function to unsubscribe the listener
 */
export function subscribeToSettings(
  callback: (settings: FeatureSettings) => void
): () => void {
  const handler: StorageWatchCallback = (change) => {
    const next = (change.newValue as FeatureSettings) ?? DEFAULT_SETTINGS
    callback({ ...DEFAULT_SETTINGS, ...next })
  }

  extensionStorage.watch({
    [STORAGE_KEYS.SETTINGS]: handler
  })

  return () => {
    extensionStorage.unwatch({
      [STORAGE_KEYS.SETTINGS]: handler
    })
  }
}

/**
 * Retrieves the per-site exclusion rules from storage.
 */
export async function getStoredSiteRules(): Promise<SiteRule[]> {
  const rules = await extensionStorage.get<SiteRule[]>(STORAGE_KEYS.SITE_RULES)
  return Array.isArray(rules) ? rules : DEFAULT_SITE_RULES
}

/**
 * Atomically reads, transforms, and persists the SiteRule[] list.
 */
export async function updateStoredSiteRules(
  updater: (current: SiteRule[]) => SiteRule[]
): Promise<SiteRule[]> {
  const current = await getStoredSiteRules()
  const next = updater(current)
  await extensionStorage.set(STORAGE_KEYS.SITE_RULES, next)
  return next
}

/**
 * Subscribes to per-site rule updates in real time across any extension context.
 */
export function subscribeToSiteRules(
  callback: (rules: SiteRule[]) => void
): () => void {
  const handler: StorageWatchCallback = (change) => {
    const next = Array.isArray(change.newValue)
      ? (change.newValue as SiteRule[])
      : DEFAULT_SITE_RULES
    callback(next)
  }

  extensionStorage.watch({
    [STORAGE_KEYS.SITE_RULES]: handler
  })

  return () => {
    extensionStorage.unwatch({
      [STORAGE_KEYS.SITE_RULES]: handler
    })
  }
}

/**
 * Clears all persistent and local data stored by the extension in the browser,
 * then restores the default settings schema.
 */
export async function clearAllExtensionData(): Promise<void> {
  const localStorage = new Storage({ area: "local" })

  // 1. Clear Plasmo storage instances
  await Promise.allSettled([
    extensionStorage.clear(),
    localStorage.clear()
  ])

  // 2. Clear native chrome.storage areas if available
  if (typeof chrome !== "undefined" && chrome.storage) {
    const clearArea = (area?: chrome.storage.StorageArea) => {
      if (!area) return Promise.resolve()
      return new Promise<void>((resolve) => {
        try {
          area.clear(() => resolve())
        } catch {
          resolve()
        }
      })
    }

    await Promise.allSettled([
      clearArea(chrome.storage.sync),
      clearArea(chrome.storage.local),
      clearArea(chrome.storage.session)
    ])
  }

  // 3. Clear window localStorage / sessionStorage if in browser window context
  if (typeof window !== "undefined") {
    try {
      window.localStorage.clear()
      window.sessionStorage.clear()
    } catch {
      // Ignore origin or security errors
    }
  }

  // 4. Seed back factory defaults
  await extensionStorage.set(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS)
}
