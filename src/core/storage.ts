import { Storage } from "@plasmohq/storage";
import { DEFAULT_SETTINGS, STORAGE_KEYS, type FeatureKey, type FeatureSettings } from "./types";

export const extensionStorage = new Storage();

export async function getStoredSettings(): Promise<FeatureSettings> {
  const settings = await extensionStorage.get<FeatureSettings>(STORAGE_KEYS.SETTINGS);
  return { ...DEFAULT_SETTINGS, ...settings };
}

export async function updateFeatureSetting(
  key: FeatureKey,
  enabled: boolean
): Promise<FeatureSettings> {
  const current = await getStoredSettings();
  const next: FeatureSettings = {
    ...current,
    [key]: enabled
  };
  await extensionStorage.set(STORAGE_KEYS.SETTINGS, next);
  return next;
}
