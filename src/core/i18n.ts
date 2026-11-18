import rosetta from "rosetta"

import type { LanguageCode, SupportedLocale } from "~core/types"
import { en, type TranslationDict } from "~locales/en"
import { vi } from "~locales/vi"

const LOCALE_TABLES: Partial<Record<SupportedLocale, TranslationDict>> = {
  en,
  vi
}

const i18n = rosetta<TranslationDict>(LOCALE_TABLES as Record<SupportedLocale, TranslationDict>)
i18n.locale("en")

let activeLocale: SupportedLocale = "en"

/**
 * Maps a raw browser language tag (e.g. "vi-VN", "zh-TW", "zh-CN") to a SupportedLocale.
 */
export function resolveBrowserLocale(rawLang?: string): SupportedLocale {
  const raw = (
    rawLang ||
    (typeof chrome !== "undefined" && chrome.i18n?.getUILanguage
      ? chrome.i18n.getUILanguage()
      : undefined) ||
    (typeof navigator !== "undefined" ? navigator.language : "en")
  ).toLowerCase()

  if (raw.startsWith("vi")) return "vi"
  if (raw.startsWith("de")) return "de"
  if (raw.startsWith("es")) return "es"
  if (raw.startsWith("fr")) return "fr"
  if (raw.startsWith("ja")) return "ja"
  if (raw.startsWith("ko")) return "ko"
  if (raw.startsWith("zh")) {
    if (
      raw.includes("tw") ||
      raw.includes("hk") ||
      raw.includes("mo") ||
      raw.includes("hant")
    ) {
      return "zh_TW"
    }
    return "zh_CN"
  }
  return "en"
}

/**
 * Resolves a LanguageCode ("auto" or explicit locale) to a loaded SupportedLocale.
 */
export function resolveLocale(lang: LanguageCode = "auto"): SupportedLocale {
  const candidate: SupportedLocale =
    lang === "auto" ? resolveBrowserLocale() : lang
  return LOCALE_TABLES[candidate] ? candidate : "en"
}

/**
 * Updates the active rosetta locale and returns the resolved SupportedLocale.
 */
export function setLocale(lang: LanguageCode = "auto"): SupportedLocale {
  const resolved = resolveLocale(lang)
  activeLocale = resolved
  i18n.locale(resolved)
  return resolved
}

/**
 * Returns the currently active locale.
 */
export function getCurrentLocale(): SupportedLocale {
  return activeLocale
}

/**
 * Translates a dot-notation key with optional interpolation parameters,
 * falling back to the English dictionary if a key is missing.
 */
export function t(
  key: string,
  params?: Record<string, string | number>
): string {
  const translated = i18n.t(key, params)
  if (translated) return translated
  if (activeLocale !== "en") {
    const prev = activeLocale
    i18n.locale("en")
    const fallback = i18n.t(key, params)
    i18n.locale(prev)
    if (fallback) return fallback
  }
  return key
}

export { LOCALE_TABLES }
