import { describe, expect, it } from "vitest"

import {
  getCurrentLocale,
  LOCALE_TABLES,
  resolveBrowserLocale,
  setLocale,
  t,
  translateFor
} from "~core/i18n"
import { en } from "~locales/en"

function collectLeafKeys(obj: Record<string, unknown>, prefix = ""): string[] {
  const keys: string[] = []
  for (const [k, v] of Object.entries(obj)) {
    const full = prefix ? `${prefix}.${k}` : k
    if (typeof v === "string") {
      keys.push(full)
    } else if (v && typeof v === "object") {
      keys.push(...collectLeafKeys(v as Record<string, unknown>, full))
    }
  }
  return keys.sort()
}

function extractPlaceholders(str: string): string[] {
  return (str.match(/\{\{[^}]+\}\}/g) ?? []).sort()
}

function getNestedValue(obj: Record<string, unknown>, path: string): string {
  const val = path
    .split(".")
    .reduce<unknown>(
      (acc, part) =>
        acc && typeof acc === "object"
          ? (acc as Record<string, unknown>)[part]
          : undefined,
      obj
    )
  return typeof val === "string" ? val : ""
}

describe("i18n core (rosetta)", () => {
  it("resolves browser language tags accurately including Chinese variants", () => {
    expect(resolveBrowserLocale("vi-VN")).toBe("vi")
    expect(resolveBrowserLocale("en-US")).toBe("en")
    expect(resolveBrowserLocale("zh-TW")).toBe("zh_TW")
    expect(resolveBrowserLocale("zh-HK")).toBe("zh_TW")
    expect(resolveBrowserLocale("zh-Hant")).toBe("zh_TW")
    expect(resolveBrowserLocale("zh-CN")).toBe("zh_CN")
    expect(resolveBrowserLocale("ja-JP")).toBe("ja")
    expect(resolveBrowserLocale("pt-BR")).toBe("en")
  })

  it("switches locale and interpolates parameters", () => {
    expect(setLocale("vi")).toBe("vi")
    expect(getCurrentLocale()).toBe("vi")
    expect(t("features.contextMenuActions.activeCount", { count: 4 })).toBe(
      "4/6 Đang bật"
    )

    expect(setLocale("en")).toBe("en")
    expect(t("features.contextMenuActions.activeCount", { count: 4 })).toBe(
      "4/6 Active"
    )
    expect(
      translateFor("ja", "features.videoWheelControl.logic.frameStep", {
        sign: "+1",
        time: "0:12"
      })
    ).toBe("フレーム +1 (0:12)")
    expect(getCurrentLocale()).toBe("en")
  })

  it("maintains 100% key and placeholder parity across all supported locales", () => {
    const enKeys = collectLeafKeys(en as unknown as Record<string, unknown>)
    const locales = Object.entries(LOCALE_TABLES)

    expect(locales.map(([code]) => code).sort()).toEqual([
      "de",
      "en",
      "es",
      "fr",
      "ja",
      "ko",
      "vi",
      "zh_CN",
      "zh_TW"
    ])

    for (const [localeCode, dict] of locales) {
      const localeKeys = collectLeafKeys(dict as unknown as Record<string, unknown>)
      expect(localeKeys, `Key parity mismatch for ${localeCode}`).toEqual(enKeys)

      for (const key of enKeys) {
        const enVal = getNestedValue(en as unknown as Record<string, unknown>, key)
        const locVal = getNestedValue(dict as unknown as Record<string, unknown>, key)
        expect(locVal.trim().length, `Empty value in ${localeCode}.${key}`).toBeGreaterThan(0)
        expect(
          extractPlaceholders(locVal),
          `Placeholder mismatch in ${localeCode}.${key}`
        ).toEqual(extractPlaceholders(enVal))
      }
    }
  })
})
