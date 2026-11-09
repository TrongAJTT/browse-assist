import type { ColorFormat, ColorHistoryItem } from "~core/types"

/**
 * Parses a 6-character or 3-character hex string into RGB numbers.
 */
export function hexToRgb(hexStr: string): { r: number; g: number; b: number } {
  let hex = hexStr.replace(/^#/, "").trim()
  if (hex.length === 3) {
    hex = hex
      .split("")
      .map((c) => c + c)
      .join("")
  }

  const num = parseInt(hex, 16)
  const r = (num >> 16) & 255
  const g = (num >> 8) & 255
  const b = num & 255

  return { r, g, b }
}

/**
 * Converts RGB numbers to HSL (Hue 0-360, Saturation 0-100%, Lightness 0-100%).
 */
export function rgbToHsl(
  r: number,
  g: number,
  b: number
): { h: number; s: number; l: number } {
  const rNorm = r / 255
  const gNorm = g / 255
  const bNorm = b / 255

  const max = Math.max(rNorm, gNorm, bNorm)
  const min = Math.min(rNorm, gNorm, bNorm)
  const delta = max - min

  let h = 0
  let s = 0
  const l = (max + min) / 2

  if (delta !== 0) {
    s = l > 0.5 ? delta / (2 - max - min) : delta / (max + min)

    switch (max) {
      case rNorm:
        h = ((gNorm - bNorm) / delta + (gNorm < bNorm ? 6 : 0)) * 60
        break
      case gNorm:
        h = ((bNorm - rNorm) / delta + 2) * 60
        break
      case bNorm:
        h = ((rNorm - gNorm) / delta + 4) * 60
        break
    }
  }

  return {
    h: Math.round(h),
    s: Math.round(s * 100),
    l: Math.round(l * 100)
  }
}

/**
 * Formats RGB numbers to string: "rgb(255, 255, 255)".
 */
export function formatRgb(r: number, g: number, b: number): string {
  return `rgb(${r}, ${g}, ${b})`
}

/**
 * Formats HSL numbers to string: "hsl(240, 100%, 50%)".
 */
export function formatHsl(h: number, s: number, l: number): string {
  return `hsl(${h}, ${s}%, ${l}%)`
}

/**
 * Normalizes any valid hex string to a complete ColorHistoryItem.
 */
export function parseColor(rawHex: string): ColorHistoryItem {
  const cleanHex = rawHex.startsWith("#")
    ? rawHex.toUpperCase()
    : `#${rawHex.toUpperCase()}`
  const { r, g, b } = hexToRgb(cleanHex)
  const { h, s, l } = rgbToHsl(r, g, b)

  return {
    hex: cleanHex,
    rgb: formatRgb(r, g, b),
    hsl: formatHsl(h, s, l),
    timestamp: Date.now()
  }
}

/**
 * Formats a color history item according to target format.
 */
export function getColorValueByFormat(
  item: ColorHistoryItem,
  format: ColorFormat
): string {
  switch (format) {
    case "rgb":
      return item.rgb
    case "hsl":
      return item.hsl
    case "hex":
    default:
      return item.hex
  }
}
