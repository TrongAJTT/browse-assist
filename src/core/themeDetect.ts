import type { ThemeMode } from "./types"

/**
 * Parses RGB / RGBA color string and returns luminance (0 - 255), or null if transparent.
 */
export function parseRgbLuminance(colorStr: string): number | null {
  if (
    !colorStr ||
    colorStr === "transparent" ||
    colorStr === "rgba(0, 0, 0, 0)"
  ) {
    return null
  }
  const match = colorStr.match(
    /rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/
  )
  if (!match) return null

  const r = parseInt(match[1], 10)
  const g = parseInt(match[2], 10)
  const b = parseInt(match[3], 10)
  const a = match[4] !== undefined ? parseFloat(match[4]) : 1

  if (a < 0.1) return null // Virtually transparent

  // Standard perception-weighted formula
  return 0.299 * r + 0.587 * g + 0.114 * b
}

/**
 * Inspects page background color and dark mode attributes.
 * Falls back to extension / OS theme if page background is ambiguous.
 */
export function detectPageTheme(
  fallbackTheme: ThemeMode = "system"
): "dark" | "light" {
  try {
    const htmlEl = document.documentElement
    const bodyEl = document.body

    // 1. Check known explicit dark attributes on <html> or <body>
    const htmlClass = htmlEl?.className?.toLowerCase?.() || ""
    const bodyClass = bodyEl?.className?.toLowerCase?.() || ""
    const dataTheme =
      htmlEl?.getAttribute("data-theme") ||
      htmlEl?.getAttribute("data-color-mode") ||
      bodyEl?.getAttribute("data-theme") ||
      bodyEl?.getAttribute("data-color-mode")

    if (
      dataTheme === "dark" ||
      htmlClass.includes("dark") ||
      bodyClass.includes("dark")
    ) {
      return "dark"
    }
    if (
      dataTheme === "light" ||
      htmlClass.includes("light") ||
      bodyClass.includes("light")
    ) {
      return "light"
    }

    // 2. Check meta color-scheme
    const metaTheme = document
      .querySelector('meta[name="color-scheme"]')
      ?.getAttribute("content")
    if (metaTheme) {
      if (metaTheme.includes("dark") && !metaTheme.includes("light"))
        return "dark"
      if (metaTheme.includes("light") && !metaTheme.includes("dark"))
        return "light"
    }

    // 3. Inspect computed background colors
    if (bodyEl) {
      const bodyBg = window.getComputedStyle(bodyEl).backgroundColor
      const bodyLum = parseRgbLuminance(bodyBg)
      if (bodyLum !== null) {
        return bodyLum < 130 ? "dark" : "light"
      }
    }

    if (htmlEl) {
      const htmlBg = window.getComputedStyle(htmlEl).backgroundColor
      const htmlLum = parseRgbLuminance(htmlBg)
      if (htmlLum !== null) {
        return htmlLum < 130 ? "dark" : "light"
      }
    }
  } catch {
    // Fail silently on security/frame boundaries
  }

  // 4. Fallback to extension theme setting
  if (fallbackTheme === "dark") return "dark"
  if (fallbackTheme === "light") return "light"

  // 5. Final fallback to OS system preference
  const prefersDark =
    window.matchMedia?.("(prefers-color-scheme: dark)").matches ?? true
  return prefersDark ? "dark" : "light"
}

/**
 * Observes root theme attribute/class mutations and triggers callback on change.
 */
export function observePageTheme(onThemeChange: () => void): MutationObserver | null {
  if (typeof MutationObserver === "undefined" || !document.documentElement) {
    return null
  }
  const observer = new MutationObserver(() => onThemeChange())
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class", "data-theme", "data-color-mode", "style"]
  })
  if (document.body) {
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ["class", "data-theme", "data-color-mode", "style"]
    })
  }
  return observer
}
