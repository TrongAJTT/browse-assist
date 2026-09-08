/**
 * List of known tracking, analytics, and marketing query parameter keys.
 */
const TRACKING_PARAMS = new Set([
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
    // Return original string if URL constructor fails
    return rawUrl
  }
}
