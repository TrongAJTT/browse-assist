/**
 * Per-Site Rules & Pattern Matching Engine
 * Pure helpers for domain and wildcard (*) URL exclusion rules.
 */

import type { FeatureKey, SiteRule } from "./types"

function escapeRegExpExceptWildcard(input: string): string {
  return input.replace(/[.+?^${}()|[\]\\]/g, "\\$&").replace(/\*/g, ".*")
}

/**
 * Extracts normalized lowercase hostname for http/https URLs; returns null for internal browser pages.
 */
export function extractHostname(url: string): string | null {
  if (!url) return null
  try {
    const parsed = new URL(url)
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      return null
    }
    return parsed.hostname.toLowerCase()
  } catch {
    return null
  }
}

/**
 * Normalizes a user-entered domain or URL wildcard pattern.
 */
export function normalizeSitePattern(raw: string): string {
  const trimmed = raw.trim()
  if (!trimmed) return ""

  // Preserve path case when a scheme or slash is present, while lowercasing scheme + host
  const schemeMatch = trimmed.match(/^(https?:\/\/)([^/]+)(.*)$/i)
  if (schemeMatch) {
    return `${schemeMatch[1].toLowerCase()}${schemeMatch[2].toLowerCase()}${schemeMatch[3]}`
  }

  const slashIndex = trimmed.indexOf("/")
  if (slashIndex !== -1) {
    return `${trimmed.slice(0, slashIndex).toLowerCase()}${trimmed.slice(slashIndex)}`
  }

  return trimmed.toLowerCase()
}

/**
 * Validates that a normalized pattern is safe and meaningful.
 */
export function validateSitePattern(raw: string): boolean {
  const pattern = normalizeSitePattern(raw)
  if (!pattern) return false
  if (/^\*+$/.test(pattern)) return false
  if (/\s/.test(pattern)) return false

  // Must contain at least one alphanumeric character
  if (!/[a-z0-9]/i.test(pattern)) return false

  return true
}

/**
 * Checks whether a given URL matches a domain or wildcard (*) pattern.
 */
export function matchesSitePattern(url: string, rawPattern: string): boolean {
  const pattern = normalizeSitePattern(rawPattern)
  if (!pattern || !validateSitePattern(pattern)) return false

  let parsed: URL
  try {
    parsed = new URL(url)
  } catch {
    return false
  }

  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    return false
  }

  const hostname = parsed.hostname.toLowerCase()

  // 1. Full URL pattern with explicit scheme (e.g. https://*.example.com/app/*)
  if (/^https?:\/\//i.test(pattern)) {
    const regex = new RegExp(`^${escapeRegExpExceptWildcard(pattern)}$`, "i")
    return regex.test(parsed.href)
  }

  // 2. Host + path wildcard pattern without scheme (e.g. docs.google.com/spreadsheets/*)
  if (pattern.includes("/")) {
    const hostAndPath = `${hostname}${parsed.pathname}${parsed.search}`
    const regex = new RegExp(`^${escapeRegExpExceptWildcard(pattern)}$`, "i")
    return regex.test(hostAndPath)
  }

  // 3. Domain-only pattern
  // Explicit wildcard prefix: *.figma.com matches figma.com and any subdomain
  if (pattern.startsWith("*.")) {
    const baseDomain = pattern.slice(2)
    return hostname === baseDomain || hostname.endsWith(`.${baseDomain}`)
  }

  // Other wildcard in domain (e.g. *figma*.com or figma.*)
  if (pattern.includes("*")) {
    const regex = new RegExp(`^${escapeRegExpExceptWildcard(pattern)}$`, "i")
    return regex.test(hostname)
  }

  // Plain domain (e.g. figma.com) matches exact domain and subdomains (www.figma.com)
  return hostname === pattern || hostname.endsWith(`.${pattern}`)
}

/**
 * Returns true if any enabled rule blocks the given feature on `url`.
 */
export function isFeatureBlockedOnUrl(
  feature: FeatureKey,
  url: string,
  rules: SiteRule[]
): boolean {
  for (const rule of rules) {
    if (!rule.enabled) continue
    if (!matchesSitePattern(url, rule.pattern)) continue
    if (rule.scope === "all" || rule.scope.includes(feature)) {
      return true
    }
  }
  return false
}

/**
 * Returns the set of features blocked on `url`, plus whether a rule pauses all features.
 */
export function getUrlExclusionSummary(
  url: string,
  rules: SiteRule[]
): { isFullyPaused: boolean; blockedFeatures: Set<FeatureKey> } {
  let isFullyPaused = false
  const blockedFeatures = new Set<FeatureKey>()

  for (const rule of rules) {
    if (!rule.enabled) continue
    if (!matchesSitePattern(url, rule.pattern)) continue
    if (rule.scope === "all") {
      isFullyPaused = true
    } else {
      for (const key of rule.scope) {
        blockedFeatures.add(key)
      }
    }
  }

  return { isFullyPaused, blockedFeatures }
}

/**
 * Returns true if any enabled rule targets a URL path/query (requires SPA navigation check).
 */
export function hasPathWildcardRules(rules: SiteRule[]): boolean {
  return rules.some((rule) => rule.enabled && rule.pattern.includes("/"))
}

function generateRuleId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID()
  }
  return `rule_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
}

/**
 * Toggles a full-site pause rule (`scope: "all"`) for `hostname`.
 */
export function togglePauseSiteRule(
  rules: SiteRule[],
  hostname: string
): SiteRule[] {
  const normalized = normalizeSitePattern(hostname)
  if (!normalized) return rules

  const existingIndex = rules.findIndex(
    (r) => normalizeSitePattern(r.pattern) === normalized && r.scope === "all"
  )

  if (existingIndex !== -1) {
    const existing = rules[existingIndex]
    // If currently enabled, remove/disable it; if disabled, re-enable it
    if (existing.enabled) {
      return rules.filter((_, idx) => idx !== existingIndex)
    }
    return rules.map((r, idx) =>
      idx === existingIndex ? { ...r, enabled: true } : r
    )
  }

  return [
    {
      id: generateRuleId(),
      pattern: normalized,
      enabled: true,
      scope: "all"
    },
    ...rules
  ]
}

/**
 * Toggles a single feature exclusion on `hostname`.
 * Reuses an existing feature-scoped rule for that exact hostname when possible.
 */
export function toggleFeatureOnSiteRule(
  rules: SiteRule[],
  hostname: string,
  feature: FeatureKey
): SiteRule[] {
  const normalized = normalizeSitePattern(hostname)
  if (!normalized) return rules

  const existingIndex = rules.findIndex(
    (r) =>
      normalizeSitePattern(r.pattern) === normalized && Array.isArray(r.scope)
  )

  if (existingIndex !== -1) {
    const existing = rules[existingIndex]
    const currentList = existing.scope as FeatureKey[]
    const hasFeature = currentList.includes(feature)

    if (hasFeature && existing.enabled) {
      const nextList = currentList.filter((f) => f !== feature)
      if (nextList.length === 0) {
        return rules.filter((_, idx) => idx !== existingIndex)
      }
      return rules.map((r, idx) =>
        idx === existingIndex ? { ...r, scope: nextList } : r
      )
    }

    const nextList = hasFeature ? currentList : [...currentList, feature]
    return rules.map((r, idx) =>
      idx === existingIndex ? { ...r, enabled: true, scope: nextList } : r
    )
  }

  return [
    {
      id: generateRuleId(),
      pattern: normalized,
      enabled: true,
      scope: [feature]
    },
    ...rules
  ]
}
