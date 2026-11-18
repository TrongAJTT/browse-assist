import { useEffect } from "react"

import { useStorage } from "@plasmohq/storage/hook"

import { getCurrentLocale, setLocale, t } from "~core/i18n"
import {
  DEFAULT_SETTINGS,
  STORAGE_KEYS,
  type FeatureSettings,
  type SupportedLocale
} from "~core/types"

/**
 * React hook for localized UI components.
 * Subscribes to settings.language in @plasmohq/storage and keeps rosetta in sync.
 */
export function useI18n(): {
  t: typeof t
  locale: SupportedLocale
} {
  const [settings] = useStorage<FeatureSettings>(
    STORAGE_KEYS.SETTINGS,
    DEFAULT_SETTINGS
  )

  const language = settings?.language ?? "auto"
  const locale = setLocale(language)

  useEffect(() => {
    setLocale(language)
  }, [language])

  return {
    t,
    locale: locale || getCurrentLocale()
  }
}
