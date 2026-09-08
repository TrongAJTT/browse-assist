import { Storage, type StorageWatchCallback } from "@plasmohq/storage"

import {
  DEFAULT_SETTINGS,
  STORAGE_KEYS,
  type FeatureKey,
  type FeatureSettings
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
  const current = await getStoredSettings()
  const next: FeatureSettings = {
    ...current,
    [key]: enabled
  }
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
