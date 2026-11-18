import rosetta from "rosetta"

import type { LanguageCode, SupportedLocale } from "~core/types"
import { de } from "~locales/de"
import { en, type TranslationDict } from "~locales/en"
import { es } from "~locales/es"
import { fr } from "~locales/fr"
import { ja } from "~locales/ja"
import { ko } from "~locales/ko"
import { vi } from "~locales/vi"
import { zh_CN } from "~locales/zh_CN"
import { zh_TW } from "~locales/zh_TW"

const LOCALE_TABLES: Record<SupportedLocale, TranslationDict> = {
  en,
  vi,
  de,
  es,
  fr,
  ja,
  ko,
  zh_CN,
  zh_TW
}

type Paths<T> = T extends string
  ? never
  : {
      [K in keyof T & string]: T[K] extends string ? K : `${K}.${Paths<T[K]>}`
    }[keyof T & string]

export type TranslationKey = Paths<TranslationDict>

const i18n = rosetta<TranslationDict>(LOCALE_TABLES)
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
 * Translates a dot-notation key for a specific locale without mutating global state,
 * falling back to English if the key is missing.
 */
export function translateFor(
  locale: SupportedLocale,
  key: TranslationKey,
  params?: Record<string, string | number>
): string {
  const translated = i18n.t(key, params, locale)
  if (translated) return translated
  if (locale !== "en") {
    const fallback = i18n.t(key, params, "en")
    if (fallback) return fallback
  }
  return key
}

/**
 * Translates a dot-notation key with optional interpolation parameters,
 * falling back to the English dictionary if a key is missing.
 */
export function t(
  key: TranslationKey,
  params?: Record<string, string | number>
): string {
  return translateFor(activeLocale, key, params)
}

export { LOCALE_TABLES }
