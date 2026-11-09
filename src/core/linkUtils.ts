/**
 * Shared Link, Anchor and URL Utilities for Browse Assist
 * Single source of truth used across Context Menu Actions, Super Drag, and other features.
 */

import { showContentToast } from "./toast"

/**
 * List of known tracking, analytics, and marketing query parameter keys.
 */
export const TRACKING_PARAMS = new Set([
  // UTM parameters
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
  "utm_id",
  "utm_reader",
  "utm_referrer",

  // Social & Ad tracking
  "fbclid",
  "gclid",
  "gclsrc",
  "dclid",
  "msclkid",
  "zanpid",
  "igshid",
  "mc_eid",
  "mc_cid",
  "si", // YouTube share identifier
  "_ga",
  "_gl",
  "sc_channel",
  "sc_campaign",
  "sc_geo",
  "sc_country",

  // Generic referral/affiliate noise
  "ref",
  "ref_src",
  "ref_url",
  "source",
  "feature",
  "ved",
  "ei",
  "sei"
])

/**
 * Removes tracking parameters from a URL while keeping functional query params intact.
 * If the input is not a valid URL (e.g. javascript: or tel:), returns the raw input unchanged.
 */
export function cleanUrl(rawUrl: string): string {
  if (!rawUrl) return ""

  try {
    const parsed = new URL(rawUrl)

    // Delete known tracking search params
    const keysToDelete: string[] = []
    parsed.searchParams.forEach((_value, key) => {
      const lowerKey = key.toLowerCase()
      if (
        TRACKING_PARAMS.has(lowerKey) ||
        lowerKey.startsWith("utm_") ||
        lowerKey.startsWith("mc_")
      ) {
        keysToDelete.push(key)
      }
    })

    keysToDelete.forEach((key) => parsed.searchParams.delete(key))
    return parsed.toString()
  } catch {
    return rawUrl
  }
}

/**
 * Extracts the user-visible anchor text from an anchor element,
 * with fallbacks to title, aria-label, img alt, or fallback URL.
 */
export function extractAnchorText(
  anchor: Element | null,
  fallbackUrl = ""
): string {
  if (!anchor) return fallbackUrl

  if (anchor instanceof HTMLElement) {
    // 1. Visible innerText / textContent
    const inner = anchor.innerText?.trim() || anchor.textContent?.trim()
    if (inner) return inner

    // 2. Child image alt or title
    const img = anchor.querySelector("img")
    if (img) {
      const alt = img.alt?.trim() || img.title?.trim()
      if (alt) return alt
    }

    // 3. Anchor aria-label or title attribute
    const aria = anchor.getAttribute("aria-label")?.trim()
    if (aria) return aria

    const title = anchor.title?.trim()
    if (title) return title
  }

  return fallbackUrl
}

/**
 * Copies text to system clipboard with navigator.clipboard and fallback.
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  if (!text) return false
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    try {
      const textarea = document.createElement("textarea")
      textarea.value = text
      textarea.style.position = "fixed"
      textarea.style.opacity = "0"
      document.body.appendChild(textarea)
      textarea.select()
      const successful = document.execCommand("copy")
      document.body.removeChild(textarea)
      return successful
    } catch {
      return false
    }
  }
}

const COPY_ICON_SVG = `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>`

/**
 * Standardized floating toast for copied content.
 */
export function showCopiedFeedback(label: string, text: string): void {
  const preview = text.length > 35 ? text.slice(0, 32) + "..." : text
  showContentToast({
    message: label,
    detail: preview,
    type: "success",
    iconSvg: COPY_ICON_SVG,
    position: "bottom-right",
    duration: 1600
  })
}
