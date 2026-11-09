/**
 * Standardized Content-Script Toast Notification System for Browse Assist.
 * Supports rich decorations: types (info, success, warning, error), custom badges/details,
 * custom SVG icons, positioning, dark/light responsiveness, and animated dismissals.
 */

export type ToastType = "info" | "success" | "warning" | "error"
export type ToastPosition =
  | "top-right"
  | "top-center"
  | "bottom-right"
  | "bottom-center"

export interface ShowToastOptions {
  /** Main message text */
  message: string
  /** Secondary detailed text or badge info (e.g. "120%", "Alt + P") */
  detail?: string
  /** Toast intent type for color accent and default icon */
  type?: ToastType
  /** Custom raw SVG string to override the default type icon */
  iconSvg?: string
  /** Screen corner or edge position (default: "bottom-right") */
  position?: ToastPosition
  /** Time in milliseconds before auto-dismiss (default: 1800ms) */
  duration?: number
}

// Global references for the active content toast
let activeToastElement: HTMLDivElement | null = null
let dismissTimeoutId: number | null = null

// Default SVGs for each toast type
const TYPE_ICONS: Record<ToastType, string> = {
  info: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>`,
  success: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>`,
  warning: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`,
  error: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`
}

// Color palettes for accents & badge decoration
const TYPE_COLORS: Record<
  ToastType,
  {
    iconColor: string
    borderColor: string
    badgeBg: string
    badgeColor: string
  }
> = {
  info: {
    iconColor: "#818cf8", // indigo-400
    borderColor: "rgba(99, 102, 241, 0.35)",
    badgeBg: "rgba(99, 102, 241, 0.2)",
    badgeColor: "#a5b4fc"
  },
  success: {
    iconColor: "#34d399", // emerald-400
    borderColor: "rgba(52, 211, 153, 0.35)",
    badgeBg: "rgba(16, 185, 129, 0.2)",
    badgeColor: "#6ee7b7"
  },
  warning: {
    iconColor: "#fbbf24", // amber-400
    borderColor: "rgba(251, 191, 36, 0.35)",
    badgeBg: "rgba(245, 158, 11, 0.2)",
    badgeColor: "#fde68a"
  },
  error: {
    iconColor: "#f87171", // red-400
    borderColor: "rgba(248, 113, 113, 0.35)",
    badgeBg: "rgba(239, 68, 68, 0.2)",
    badgeColor: "#fca5a5"
  }
}

/**
 * Positions mapping to CSS styles.
 */
function applyPositionStyles(
  el: HTMLDivElement,
  position: ToastPosition
): void {
  // Reset all positional properties
  el.style.top = "auto"
  el.style.bottom = "auto"
  el.style.left = "auto"
  el.style.right = "auto"
  el.style.transform = "none"

  switch (position) {
    case "top-right":
      el.style.top = "20px"
      el.style.right = "20px"
      break
    case "top-center":
      el.style.top = "20px"
      el.style.left = "50%"
      el.style.transform = "translateX(-50%)"
      break
    case "bottom-center":
      el.style.bottom = "24px"
      el.style.left = "50%"
      el.style.transform = "translateX(-50%)"
      break
    case "bottom-right":
    default:
      el.style.bottom = "24px"
      el.style.right = "24px"
      break
  }
}

/**
 * Triggers entrance animation depending on top or bottom alignment.
 */
function animateIn(el: HTMLDivElement, position: ToastPosition): void {
  const isTop = position.startsWith("top")
  const isCenter = position.includes("center")

  el.style.opacity = "0"
  el.style.transform = isCenter
    ? `translateX(-50%) translateY(${isTop ? "-8px" : "8px"}) scale(0.96)`
    : `translateY(${isTop ? "-8px" : "8px"}) scale(0.96)`

  // Trigger reflow to start transition
  void el.offsetWidth

  el.style.opacity = "1"
  el.style.transform = isCenter
    ? "translateX(-50%) translateY(0) scale(1)"
    : "translateY(0) scale(1)"
}

/**
 * Triggers exit animation depending on top or bottom alignment.
 */
function animateOut(el: HTMLDivElement, position: ToastPosition): void {
  const isTop = position.startsWith("top")
  const isCenter = position.includes("center")

  el.style.opacity = "0"
  el.style.transform = isCenter
    ? `translateX(-50%) translateY(${isTop ? "-6px" : "6px"}) scale(0.96)`
    : `translateY(${isTop ? "-6px" : "6px"}) scale(0.96)`
}

/**
 * Shows a standardized, elegant toast notification on the active web page.
 */
export function showContentToast(options: ShowToastOptions): void {
  if (typeof document === "undefined" || !document.documentElement) return

  const {
    message,
    detail,
    type = "info",
    iconSvg,
    position = "bottom-right",
    duration = 1800
  } = options

  // Ensure singleton element attached
  if (
    !activeToastElement ||
    !document.documentElement.contains(activeToastElement)
  ) {
    activeToastElement = document.createElement("div")
    activeToastElement.id = "browse-assist-toast"
    activeToastElement.style.cssText = `
      position: fixed;
      z-index: 2147483647;
      display: inline-flex;
      align-items: center;
      gap: 10px;
      padding: 7px 10px;
      border-radius: 12px;
      background: rgba(15, 23, 42, 0.92);
      color: #f8fafc;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      font-size: 12px;
      font-weight: 500;
      letter-spacing: 0.01em;
      line-height: 1.4;
      box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.45), 0 8px 10px -6px rgba(0, 0, 0, 0.35);
      border: 1px solid rgba(255, 255, 255, 0.12);
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
      pointer-events: none;
      user-select: none;
      white-space: nowrap;
      transition: opacity 0.22s cubic-bezier(0.16, 1, 0.3, 1), transform 0.22s cubic-bezier(0.16, 1, 0.3, 1);
    `
    document.documentElement.appendChild(activeToastElement)
  }

  const colors = TYPE_COLORS[type] || TYPE_COLORS.info
  const renderedIcon = iconSvg || TYPE_ICONS[type] || TYPE_ICONS.info

  applyPositionStyles(activeToastElement, position)
  activeToastElement.style.borderColor = colors.borderColor

  // Construct interior decoration
  const detailBadge = detail
    ? `<span style="
        margin-left: 2px;
        padding: 1px 7px;
        border-radius: 9999px;
        background: ${colors.badgeBg};
        color: ${colors.badgeColor};
        font-size: 11px;
        font-weight: 600;
        letter-spacing: 0.02em;
      ">${escapeHtml(detail)}</span>`
    : ""

  activeToastElement.innerHTML = `
    <span style="display:inline-flex;align-items:center;justify-content:center;width:16px;height:16px;flex-shrink:0;color:${colors.iconColor};">
      ${renderedIcon}
    </span>
    <span style="display:inline-flex;align-items:center;gap:6px;">
      <span style="color:#f8fafc;font-weight:500;">${escapeHtml(message)}</span>
      ${detailBadge}
    </span>
  `

  animateIn(activeToastElement, position)

  // Clear pending timeouts
  if (dismissTimeoutId !== null) {
    window.clearTimeout(dismissTimeoutId)
  }

  // Schedule auto dismiss
  dismissTimeoutId = window.setTimeout(() => {
    if (activeToastElement) {
      animateOut(activeToastElement, position)
    }
    dismissTimeoutId = null
  }, duration)
}

/**
 * Immediately dismisses and removes the toast if present.
 */
export function removeContentToast(): void {
  if (dismissTimeoutId !== null) {
    window.clearTimeout(dismissTimeoutId)
    dismissTimeoutId = null
  }
  if (activeToastElement && activeToastElement.parentNode) {
    activeToastElement.parentNode.removeChild(activeToastElement)
    activeToastElement = null
  }
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;")
}
