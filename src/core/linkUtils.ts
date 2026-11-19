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

  // Social & Ad click identifiers
  "fbclid",
  "gclid",
  "gclsrc",
  "dclid",
  "msclkid",
  "ttclid",
  "twclid",
  "yclid",
  "zanpid",
  "igshid",
  "mc_eid",
  "mc_cid",
  "mkt_tok",
  "_hsenc",
  "_hsmi",
  "hsctatracking",
  "vero_id",
  "li_fat_id",
  "oly_enc_id",
  "oly_anon_id",
  "rb_clickid",
  "wickedid",
  "epik",
  "si", // YouTube / Spotify share identifier
  "spm", // AliExpress / Alibaba / Shopee tracking
  "_ga",
  "_gl",
  "sc_channel",
  "sc_campaign",
  "sc_geo",
  "sc_country",

  // Generic referral & Google search click noise
  "ref",
  "ref_src",
  "ref_url",
  "ved",
  "ei",
  "sei"
])

const GOOGLE_SEARCH_KEEP_PARAMS = new Set([
  "q",
  "tbm",
  "udm",
  "tbs",
  "start",
  "hl",
  "lr",
  "num",
  "safe"
])

const YOUTUBE_STRIP_PARAMS = new Set([
  "si",
  "pp",
  "feature",
  "ab_channel",
  "kw"
])

const AMAZON_STRIP_PARAMS = new Set([
  "ref",
  "ref_",
  "qid",
  "sr",
  "dib",
  "dib_tag",
  "sprefix",
  "crid",
  "keywords",
  "psc",
  "th",
  "tag",
  "linkcode",
  "camp",
  "creative",
  "ascsubtag"
])

const ECOMMERCE_STRIP_PARAMS = new Set([
  "sp_atk",
  "xptdk",
  "spm",
  "clicktrackinfo",
  "itm",
  "algo_pvid",
  "algo_exp_id",
  "pdp_npi",
  "curpageloguid",
  "pdp_ext_f",
  "aff_fcid",
  "aff_fsk",
  "aff_platform",
  "aff_trace_key"
])

const SOCIAL_STRIP_PARAMS = new Set([
  "mibextid",
  "rdid",
  "share_url",
  "__tn__",
  "is_from_webapp",
  "sender_device",
  "rdt",
  "rcm",
  "trk",
  "trackingid",
  "lipi",
  "licu"
])

/**
 * Unwraps common redirector URLs (Google, Facebook, Reddit) to extract the target destination.
 */
function unwrapRedirectUrl(parsed: URL): URL {
  const host = parsed.hostname.toLowerCase()
  const path = parsed.pathname.toLowerCase()

  // Google redirect: https://www.google.com/url?q=https://... or ?url=https://...
  if (/(^|\.)google\.[a-z.]+$/.test(host) && path === "/url") {
    const target = parsed.searchParams.get("q") || parsed.searchParams.get("url")
    if (target && /^https?:\/\//i.test(target)) {
      try {
        return new URL(target)
      } catch {
        return parsed
      }
    }
  }

  // Facebook / Instagram outbound redirect: l.facebook.com/l.php?u=...
  if (
    (host === "l.facebook.com" ||
      host === "lm.facebook.com" ||
      host === "l.instagram.com") &&
    parsed.searchParams.has("u")
  ) {
    const target = parsed.searchParams.get("u")
    if (target && /^https?:\/\//i.test(target)) {
      try {
        return new URL(target)
      } catch {
        return parsed
      }
    }
  }

  // Reddit outbound redirect: out.reddit.com/?url=...
  if (host === "out.reddit.com" && parsed.searchParams.has("url")) {
    const target = parsed.searchParams.get("url")
    if (target && /^https?:\/\//i.test(target)) {
      try {
        return new URL(target)
      } catch {
        return parsed
      }
    }
  }

  return parsed
}

/**
 * Removes tracking parameters and platform-specific session noise from a URL
 * while keeping functional query params and hash anchors intact.
 * If the input is not a valid URL (e.g. javascript: or tel:), returns the raw input unchanged.
 */
export function cleanUrl(rawUrl: string): string {
  if (!rawUrl) return ""

  try {
    const parsed = unwrapRedirectUrl(new URL(rawUrl))
    const host = parsed.hostname.toLowerCase()
    const path = parsed.pathname.toLowerCase()

    // 1. Google Search: whitelist only meaningful query parameters
    if (/(^|\.)google\.[a-z.]+$/.test(host) && path === "/search") {
      const keysToDelete: string[] = []
      parsed.searchParams.forEach((_value, key) => {
        if (!GOOGLE_SEARCH_KEEP_PARAMS.has(key.toLowerCase())) {
          keysToDelete.push(key)
        }
      })
      keysToDelete.forEach((key) => parsed.searchParams.delete(key))
      return parsed.toString()
    }

    const isYouTube =
      host === "youtu.be" ||
      host === "youtube.com" ||
      host.endsWith(".youtube.com")
    const isAmazon = /(^|\.)amazon\.[a-z.]+$/.test(host)
    const isTwitterX =
      host === "x.com" ||
      host.endsWith(".x.com") ||
      host === "twitter.com" ||
      host.endsWith(".twitter.com")
    const isSocial =
      isTwitterX ||
      host.endsWith("facebook.com") ||
      host.endsWith("fb.com") ||
      host.endsWith("tiktok.com") ||
      host.endsWith("linkedin.com") ||
      host.endsWith("reddit.com")
    const isEcommerce =
      host.includes("shopee.") ||
      host.includes("lazada.") ||
      host.includes("aliexpress.") ||
      host.includes("tiki.vn")

    // Amazon path cleanup: strip trailing /ref=... segment
    if (isAmazon && /\/ref=[^/]*$/i.test(parsed.pathname)) {
      parsed.pathname = parsed.pathname.replace(/\/ref=[^/]*$/i, "")
    }

    // 2. Delete global & domain-specific tracking params
    const keysToDelete: string[] = []
    parsed.searchParams.forEach((_value, key) => {
      const lowerKey = key.toLowerCase()
      const isGlobalTracking =
        TRACKING_PARAMS.has(lowerKey) ||
        lowerKey.startsWith("utm_") ||
        lowerKey.startsWith("mc_") ||
        lowerKey.startsWith("sc_")

      const isDomainTracking =
        (isYouTube && YOUTUBE_STRIP_PARAMS.has(lowerKey)) ||
        (isAmazon &&
          (AMAZON_STRIP_PARAMS.has(lowerKey) ||
            lowerKey.startsWith("pd_rd_") ||
            lowerKey.startsWith("pf_rd_"))) ||
        (isEcommerce && ECOMMERCE_STRIP_PARAMS.has(lowerKey)) ||
        (isSocial &&
          (SOCIAL_STRIP_PARAMS.has(lowerKey) ||
            lowerKey.startsWith("__cft__"))) ||
        (isTwitterX && (lowerKey === "s" || lowerKey === "t"))

      if (isGlobalTracking || isDomainTracking) {
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
