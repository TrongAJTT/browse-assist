import { describe, expect, it } from "vitest"

import {
  extractHostname,
  getUrlExclusionSummary,
  hasPathWildcardRules,
  isFeatureBlockedOnUrl,
  matchesSitePattern,
  normalizeSitePattern,
  toggleFeatureOnSiteRule,
  togglePauseSiteRule,
  validateSitePattern
} from "../siteRules"
import type { SiteRule } from "../types"

describe("siteRules pattern matching", () => {
  it("extracts hostname only for http/https URLs", () => {
    expect(extractHostname("https://www.Figma.com/design/123")).toBe(
      "www.figma.com"
    )
    expect(extractHostname("http://localhost:3000/app")).toBe("localhost")
    expect(extractHostname("chrome://extensions")).toBeNull()
    expect(extractHostname("about:blank")).toBeNull()
    expect(extractHostname("not-a-url")).toBeNull()
  })

  it("normalizes and validates patterns safely", () => {
    expect(normalizeSitePattern("  HTTPS://Figma.COM/Design/* ")).toBe(
      "https://figma.com/Design/*"
    )
    expect(validateSitePattern("figma.com")).toBe(true)
    expect(validateSitePattern("*.google.com")).toBe(true)
    expect(validateSitePattern("docs.google.com/spreadsheets/*")).toBe(true)
    expect(validateSitePattern("")).toBe(false)
    expect(validateSitePattern("*")).toBe(false)
    expect(validateSitePattern("***")).toBe(false)
    expect(validateSitePattern("has space.com")).toBe(false)
  })

  it("matches plain domains and subdomains", () => {
    expect(matchesSitePattern("https://figma.com/file/abc", "figma.com")).toBe(
      true
    )
    expect(
      matchesSitePattern("https://www.figma.com/file/abc", "figma.com")
    ).toBe(true)
    expect(
      matchesSitePattern("https://notfigma.com/file/abc", "figma.com")
    ).toBe(false)
  })

  it("matches *.domain wildcard patterns for root and subdomains", () => {
    expect(
      matchesSitePattern("https://figma.com/file/abc", "*.figma.com")
    ).toBe(true)
    expect(
      matchesSitePattern("https://app.figma.com/file/abc", "*.figma.com")
    ).toBe(true)
    expect(
      matchesSitePattern("https://evilfigma.com/file/abc", "*.figma.com")
    ).toBe(false)
  })

  it("matches wildcard path and full URL patterns while escaping regex chars", () => {
    expect(
      matchesSitePattern(
        "https://docs.google.com/spreadsheets/d/123/edit",
        "docs.google.com/spreadsheets/*"
      )
    ).toBe(true)
    expect(
      matchesSitePattern(
        "https://docs.google.com/document/d/123/edit",
        "docs.google.com/spreadsheets/*"
      )
    ).toBe(false)
    expect(
      matchesSitePattern(
        "https://app.example.com/v1+beta/room?id=42",
        "https://*.example.com/v1+beta/*"
      )
    ).toBe(true)
    // Dot in pattern must be literal, not regex any-char
    expect(matchesSitePattern("https://figmaxcom/", "figma.com")).toBe(false)
  })

  it("evaluates feature blocking and exclusion summaries", () => {
    const rules: SiteRule[] = [
      {
        id: "1",
        pattern: "figma.com",
        enabled: true,
        scope: ["superDrag", "smoothScroll"]
      },
      {
        id: "2",
        pattern: "disabled.com",
        enabled: false,
        scope: "all"
      },
      {
        id: "3",
        pattern: "paused.example.com",
        enabled: true,
        scope: "all"
      }
    ]

    expect(
      isFeatureBlockedOnUrl("superDrag", "https://www.figma.com/file/1", rules)
    ).toBe(true)
    expect(
      isFeatureBlockedOnUrl("colorPicker", "https://www.figma.com/file/1", rules)
    ).toBe(false)
    expect(
      isFeatureBlockedOnUrl("colorPicker", "https://disabled.com/", rules)
    ).toBe(false)
    expect(
      isFeatureBlockedOnUrl("colorPicker", "https://paused.example.com/", rules)
    ).toBe(true)

    const summary = getUrlExclusionSummary("https://www.figma.com/file/1", rules)
    expect(summary.isFullyPaused).toBe(false)
    expect(summary.blockedFeatures).toEqual(
      new Set(["superDrag", "smoothScroll"])
    )
    expect(hasPathWildcardRules(rules)).toBe(false)
    expect(
      hasPathWildcardRules([
        { id: "4", pattern: "example.com/app/*", enabled: true, scope: "all" }
      ])
    ).toBe(true)
  })

  it("toggles pause and per-feature rules cleanly", () => {
    let rules: SiteRule[] = []
    rules = togglePauseSiteRule(rules, "www.figma.com")
    expect(rules).toHaveLength(1)
    expect(rules[0]).toMatchObject({
      pattern: "www.figma.com",
      enabled: true,
      scope: "all"
    })

    // Toggling again removes the active pause rule
    rules = togglePauseSiteRule(rules, "www.figma.com")
    expect(rules).toHaveLength(0)

    // Per-feature toggle adds and updates a scoped rule
    rules = toggleFeatureOnSiteRule(rules, "figma.com", "superDrag")
    rules = toggleFeatureOnSiteRule(rules, "figma.com", "smoothScroll")
    expect(rules).toHaveLength(1)
    expect(rules[0].scope).toEqual(["superDrag", "smoothScroll"])

    rules = toggleFeatureOnSiteRule(rules, "figma.com", "superDrag")
    expect(rules[0].scope).toEqual(["smoothScroll"])

    rules = toggleFeatureOnSiteRule(rules, "figma.com", "smoothScroll")
    expect(rules).toHaveLength(0)
  })
})
