import { describe, expect, it } from "vitest"

import { getColorValueByFormat, parseColor } from "../colorUtils"

describe("colorUtils", () => {
  it("parses hex colors into uppercase HEX, RGB, and HSL formats", () => {
    const parsed = parseColor("#6366f1")

    expect(parsed.hex).toBe("#6366F1")
    expect(parsed.rgb).toBe("rgb(99, 102, 241)")
    expect(parsed.hsl).toMatch(/^hsl\(\d+,\s*\d+%,\s*\d+%\)$/)
    expect(typeof parsed.timestamp).toBe("number")
  })

  it("handles pure white and black accurately", () => {
    const white = parseColor("#ffffff")
    expect(white.rgb).toBe("rgb(255, 255, 255)")
    expect(white.hsl).toBe("hsl(0, 0%, 100%)")

    const black = parseColor("#000000")
    expect(black.rgb).toBe("rgb(0, 0, 0)")
    expect(black.hsl).toBe("hsl(0, 0%, 0%)")
  })

  it("returns the requested color format via getColorValueByFormat", () => {
    const item = parseColor("#10b981")

    expect(getColorValueByFormat(item, "hex")).toBe(item.hex)
    expect(getColorValueByFormat(item, "rgb")).toBe(item.rgb)
    expect(getColorValueByFormat(item, "hsl")).toBe(item.hsl)
  })
})
