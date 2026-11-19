import { useCallback, useEffect, useMemo } from "react"

import { useStorage } from "@plasmohq/storage/hook"

import {
  resolveLocale,
  setLocale,
  translateFor,
  type TranslationKey
} from "~core/i18n"
import {
  DEFAULT_SETTINGS,
  STORAGE_KEYS,
  type FeatureSettings,
  type SupportedLocale
} from "~core/types"

/**
 * React hook for localized UI components.
 * Subscribes to settings.language in @plasmohq/storage and binds t() to the resolved locale.
 */
export function useI18n(): {
  t: (key: TranslationKey, params?: Record<string, string | number>) => string
  locale: SupportedLocale
} {
  const [settings] = useStorage<FeatureSettings>(
    STORAGE_KEYS.SETTINGS,
    DEFAULT_SETTINGS
  )

  const language = settings?.language ?? "auto"
  const locale = useMemo(() => setLocale(language), [language]) ?? resolveLocale(language)

  const boundT = useCallback(
    (key: TranslationKey, params?: Record<string, string | number>) =>
      translateFor(locale, key, params),
    [locale]
  )

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.lang = locale.replace("_", "-")
    }
  }, [locale])

  return {
    t: boundT,
    locale
  }
}
