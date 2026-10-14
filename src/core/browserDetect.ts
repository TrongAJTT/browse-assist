import { BROWSER_SHORTCUT_URLS, type SupportedBrowser } from "./constants"

/**
 * Detects the current browser environment based on userAgent and vendor properties.
 */
export function detectBrowser(): SupportedBrowser {
  if (typeof navigator === "undefined") {
    return "unknown"
  }

  const userAgent = navigator.userAgent.toLowerCase()

  // Firefox / Gecko
  if (userAgent.includes("firefox") || userAgent.includes("fxios")) {
    return "firefox"
  }

  // Microsoft Edge
  if (userAgent.includes("edg/") || userAgent.includes("edge/")) {
    return "edge"
  }

  // Opera
  if (userAgent.includes("opr/") || userAgent.includes("opera")) {
    return "opera"
  }

  // Brave (has navigator.brave.isBrave() or brave in userAgent)
  const isBrave =
    Boolean(
      (navigator as unknown as { brave?: { isBrave?: () => Promise<boolean> } })
        ?.brave
    ) || userAgent.includes("brave")
  if (isBrave) {
    return "brave"
  }

  // Google Chrome or Chromium generic
  if (userAgent.includes("chrome") || userAgent.includes("crios")) {
    return "chrome"
  }

  return "unknown"
}

/**
 * Gets the browser-specific shortcut management URL.
 * Returns null for Firefox because Firefox prohibits extensions from opening about: pages directly.
 */
export function getBrowserShortcutUrl(): string | null {
  const browser = detectBrowser()
  switch (browser) {
    case "edge":
      return BROWSER_SHORTCUT_URLS.edge
    case "brave":
      return BROWSER_SHORTCUT_URLS.brave
    case "opera":
      return BROWSER_SHORTCUT_URLS.opera
    case "chrome":
      return BROWSER_SHORTCUT_URLS.chrome
    case "firefox":
      return null // Firefox prevents chrome.tabs.create to about:addons
    default:
      return BROWSER_SHORTCUT_URLS.chrome
  }
}

/**
 * Whether the EyeDropper Color Picker is supported in the current target/environment.
 * Combines compile-time target check (for tree-shaking Firefox builds) and runtime EyeDropper check.
 */
export const isColorPickerSupported: boolean =
  process.env.PLASMO_TARGET !== "firefox-mv3" &&
  (typeof window === "undefined" || "EyeDropper" in window)
