/**
 * Quick Scroll Buttons - Content Script Logic
 * Creates isolated floating scroll-to-top & bottom buttons using Shadow DOM.
 * Features smart page luminance detection for dynamic light/dark contrast.
 */

import {
  DEFAULT_QUICK_SCROLL_CONFIG,
  type QuickScrollConfig,
  type ThemeMode
} from "~core/types"

let isActive = false
let currentConfig: QuickScrollConfig = DEFAULT_QUICK_SCROLL_CONFIG
let extensionTheme: ThemeMode = "system"

// DOM References
let hostElement: HTMLDivElement | null = null
let shadowRoot: ShadowRoot | null = null
let containerElement: HTMLDivElement | null = null
let btnTop: HTMLButtonElement | null = null
let btnBottom: HTMLButtonElement | null = null
let styleElement: HTMLStyleElement | null = null

// Mutation observer for theme changes on webpage
let themeObserver: MutationObserver | null = null

// Single-slot return memory state
interface ReturnMemorySlot {
  scrollY: number
  target: "top" | "bottom"
}

let returnMemory: ReturnMemorySlot | null = null
let memoryTimer: number | null = null
let hideTimer: number | null = null
let isTicking = false
let detectedTheme: "dark" | "light" = "dark"

const MIN_PAGE_RATIO = 1.6 // Minimum document height / viewport height
const SCROLL_THRESHOLD = 300 // px threshold to show top or bottom button

// SVG Icons
const UP_ARROW_SVG = `
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
    <path d="m18 15-6-6-6 6"/>
  </svg>
`
const RETURN_SVG = `
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
    <path d="M9 14 4 9l5-5"/>
    <path d="M4 9h10.5a5.5 5.5 0 0 1 5.5 5.5a5.5 5.5 0 0 1-5.5 5.5H11"/>
  </svg>
`
const DOWN_ARROW_SVG = `
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
    <path d="m6 9 6 6 6-6"/>
  </svg>
`

/**
 * Parses RGB / RGBA color string and returns luminance (0 - 255), or null if transparent.
 */
function parseRgbLuminance(colorStr: string): number | null {
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
function detectPageTheme(): "dark" | "light" {
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
  } catch (err) {
    // Fail silently on security/frame boundaries
  }

  // 4. Fallback to extension theme setting
  if (extensionTheme === "dark") return "dark"
  if (extensionTheme === "light") return "light"

  // 5. Final fallback to OS system preference
  const prefersDark =
    window.matchMedia?.("(prefers-color-scheme: dark)").matches ?? true
  return prefersDark ? "dark" : "light"
}

function getStyles(theme: "dark" | "light"): string {
  const isDark = theme === "dark"

  return `
    :host {
      all: initial;
      z-index: 2147483645;
      position: fixed;
      pointer-events: none;
    }

    .qs-container {
      position: fixed;
      display: flex;
      flex-direction: column;
      gap: 6px;
      padding: 5px;
      z-index: 2147483645;
      pointer-events: auto;
      transition: opacity 0.3s cubic-bezier(0.16, 1, 0.3, 1), transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
      user-select: none;
      -webkit-user-select: none;
    }

    /* 6 Screen Positions (3 rows x 2 columns) */
    .qs-pos-top-left {
      left: 18px;
      top: 24px;
    }

    .qs-pos-top-right {
      right: 18px;
      top: 24px;
    }

    .qs-pos-center-left {
      left: 18px;
      top: 50%;
      transform: translateY(-50%);
    }

    .qs-pos-center-right {
      right: 18px;
      top: 50%;
      transform: translateY(-50%);
    }

    .qs-pos-bottom-left {
      left: 18px;
      bottom: 24px;
    }

    .qs-pos-bottom-right {
      right: 18px;
      bottom: 24px;
    }

    .qs-dimmed {
      opacity: 0.28;
    }

    .qs-container:hover,
    .qs-container:focus-within {
      opacity: 1 !important;
    }

    .qs-button {
      width: 38px;
      height: 38px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border-radius: 9999px;
      cursor: pointer;
      transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
      outline: none;
      padding: 0;
      margin: 0;
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      ${
        isDark
          ? `
        border: 1px solid rgba(255, 255, 255, 0.18);
        background: rgba(15, 23, 42, 0.72);
        color: #f8fafc;
        box-shadow: 0 4px 14px rgba(0, 0, 0, 0.35), 0 1px 3px rgba(0, 0, 0, 0.2);
      `
          : `
        border: 1px solid rgba(0, 0, 0, 0.12);
        background: rgba(255, 255, 255, 0.84);
        color: #0f172a;
        box-shadow: 0 4px 14px rgba(0, 0, 0, 0.12), 0 1px 3px rgba(0, 0, 0, 0.08);
      `
      }
    }

    .qs-button:hover {
      background: ${isDark ? "#6366f1" : "#4f46e5"};
      color: #ffffff;
      border-color: ${isDark ? "rgba(99, 102, 241, 0.6)" : "rgba(79, 70, 229, 0.6)"};
      transform: scale(1.1);
      box-shadow: 0 6px 20px ${isDark ? "rgba(99, 102, 241, 0.45)" : "rgba(79, 70, 229, 0.35)"};
    }

    .qs-button:active {
      transform: scale(0.95);
    }

    .qs-hidden {
      display: none !important;
    }
  `
}

function updateThemeStyles(): void {
  const newTheme = detectPageTheme()
  if (newTheme !== detectedTheme || !styleElement) {
    detectedTheme = newTheme
    if (styleElement) {
      styleElement.textContent = getStyles(detectedTheme)
    }
  }
}

function createShadowDOM(): void {
  if (hostElement && document.documentElement.contains(hostElement)) return

  hostElement = document.createElement("div")
  hostElement.id = "browse-assist-quick-scroll-host"
  hostElement.style.all = "initial"

  shadowRoot = hostElement.attachShadow({ mode: "closed" })

  detectedTheme = detectPageTheme()
  styleElement = document.createElement("style")
  styleElement.textContent = getStyles(detectedTheme)

  containerElement = document.createElement("div")
  containerElement.className = `qs-container qs-pos-${currentConfig.position}`

  // Button Scroll to Top
  btnTop = document.createElement("button")
  btnTop.className = "qs-button qs-hidden"
  btnTop.setAttribute("aria-label", "Scroll to top")
  btnTop.title = "Scroll to top"
  btnTop.innerHTML = UP_ARROW_SVG
  btnTop.addEventListener("click", handleScrollTopClick)

  // Button Scroll to Bottom
  btnBottom = document.createElement("button")
  btnBottom.className = "qs-button qs-hidden"
  btnBottom.setAttribute("aria-label", "Scroll to bottom")
  btnBottom.title = "Scroll to bottom"
  btnBottom.innerHTML = DOWN_ARROW_SVG
  btnBottom.addEventListener("click", handleScrollBottomClick)

  containerElement.appendChild(btnTop)
  containerElement.appendChild(btnBottom)

  shadowRoot.appendChild(styleElement)
  shadowRoot.appendChild(containerElement)

  document.documentElement.appendChild(hostElement)

  // Observe potential page theme changes (e.g. user clicks dark/light mode button on site)
  if (!themeObserver && document.documentElement) {
    themeObserver = new MutationObserver(() => {
      updateThemeStyles()
    })
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class", "data-theme", "data-color-mode", "style"]
    })
  }
}

function handleScrollTopClick(e: MouseEvent): void {
  e.stopPropagation()
  e.preventDefault()

  if (returnMemory?.target === "top" && returnMemory.scrollY > 0) {
    // Return back to saved reading position
    window.scrollTo({
      top: returnMemory.scrollY,
      behavior: "smooth"
    })
    resetReturnMemory()
    return
  }

  // Clear any existing opposite memory slot first (single slot invariant)
  resetReturnMemory()

  const scrollY = window.scrollY || document.documentElement.scrollTop || 0

  // Save current scroll position before jumping to top
  if (currentConfig.enableReturnMemory && scrollY > 0) {
    returnMemory = {
      scrollY,
      target: "top"
    }

    if (btnTop) {
      btnTop.title = "Return to previous position"
      btnTop.innerHTML = RETURN_SVG
    }

    if (memoryTimer) clearTimeout(memoryTimer)
    memoryTimer = window.setTimeout(() => {
      resetReturnMemory()
    }, 6000)
  }

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  })
}

function handleScrollBottomClick(e: MouseEvent): void {
  e.stopPropagation()
  e.preventDefault()

  if (returnMemory?.target === "bottom" && returnMemory.scrollY >= 0) {
    // Return back to saved reading position
    window.scrollTo({
      top: returnMemory.scrollY,
      behavior: "smooth"
    })
    resetReturnMemory()
    return
  }

  // Clear any existing opposite memory slot first (single slot invariant)
  resetReturnMemory()

  const scrollY = window.scrollY || document.documentElement.scrollTop || 0
  const maxScroll = Math.max(
    document.body.scrollHeight,
    document.documentElement.scrollHeight
  )

  // Save current scroll position before jumping to bottom
  if (currentConfig.enableReturnMemory && scrollY < maxScroll - 100) {
    returnMemory = {
      scrollY,
      target: "bottom"
    }

    if (btnBottom) {
      btnBottom.title = "Return to previous position"
      btnBottom.innerHTML = RETURN_SVG
    }

    if (memoryTimer) clearTimeout(memoryTimer)
    memoryTimer = window.setTimeout(() => {
      resetReturnMemory()
    }, 6000)
  }

  window.scrollTo({
    top: maxScroll,
    behavior: "smooth"
  })
}

function resetReturnMemory(): void {
  returnMemory = null
  if (memoryTimer) {
    clearTimeout(memoryTimer)
    memoryTimer = null
  }
  if (btnTop) {
    btnTop.title = "Scroll to top"
    btnTop.innerHTML = UP_ARROW_SVG
  }
  if (btnBottom) {
    btnBottom.title = "Scroll to bottom"
    btnBottom.innerHTML = DOWN_ARROW_SVG
  }
}

function updateButtonsVisibility(): void {
  if (!containerElement || !btnTop || !btnBottom) return

  const scrollY = window.scrollY || document.documentElement.scrollTop || 0
  const viewportHeight =
    window.innerHeight || document.documentElement.clientHeight || 0
  const totalHeight = Math.max(
    document.body.scrollHeight,
    document.documentElement.scrollHeight,
    document.body.offsetHeight,
    document.documentElement.offsetHeight
  )

  // Only display if page is significantly scrollable
  const isPageScrollable = totalHeight > viewportHeight * MIN_PAGE_RATIO

  if (!isPageScrollable) {
    containerElement.classList.add("qs-hidden")
    return
  }

  const distanceToBottom = totalHeight - (scrollY + viewportHeight)

  // Top button visibility: only show if scrolled down or holding return memory
  const hasActiveTopReturn = returnMemory?.target === "top"
  const canScrollUp = scrollY > SCROLL_THRESHOLD || hasActiveTopReturn

  // Bottom button visibility: only show when scrolling through content (not at top, not at bottom)
  // or holding return memory. Never show a standalone bottom button at the very top of the page!
  const hasActiveBottomReturn = returnMemory?.target === "bottom"
  const canScrollDown =
    (currentConfig.buttonsMode === "both" &&
      scrollY > SCROLL_THRESHOLD &&
      distanceToBottom > SCROLL_THRESHOLD) ||
    hasActiveBottomReturn

  // If neither button should show (e.g. at top without return memory), hide the container entirely
  if (!canScrollUp && !canScrollDown) {
    containerElement.classList.add("qs-hidden")
    return
  }

  containerElement.classList.remove("qs-hidden")

  if (canScrollUp) {
    btnTop.classList.remove("qs-hidden")
  } else {
    btnTop.classList.add("qs-hidden")
    if (hasActiveTopReturn) {
      resetReturnMemory()
    }
  }

  if (canScrollDown) {
    btnBottom.classList.remove("qs-hidden")
  } else {
    btnBottom.classList.add("qs-hidden")
    if (hasActiveBottomReturn) {
      resetReturnMemory()
    }
  }

  // Dimming on idle
  if (currentConfig.autoHide) {
    containerElement.classList.remove("qs-dimmed")

    if (hideTimer) clearTimeout(hideTimer)
    hideTimer = window.setTimeout(() => {
      containerElement?.classList.add("qs-dimmed")
    }, 2400)
  } else {
    containerElement.classList.remove("qs-dimmed")
  }
}

function onScroll(): void {
  if (!isTicking) {
    window.requestAnimationFrame(() => {
      updateButtonsVisibility()
      isTicking = false
    })
    isTicking = true
  }
}

export function activate(
  config: QuickScrollConfig = DEFAULT_QUICK_SCROLL_CONFIG,
  theme: ThemeMode = "system"
): void {
  currentConfig = config
  extensionTheme = theme

  if (!isActive) {
    isActive = true
    createShadowDOM()
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onScroll, { passive: true })
  } else if (containerElement) {
    containerElement.className = `qs-container qs-pos-${currentConfig.position}`
    updateThemeStyles()
  }

  updateButtonsVisibility()
}

export function deactivate(): void {
  if (!isActive) return
  isActive = false

  window.removeEventListener("scroll", onScroll)
  window.removeEventListener("resize", onScroll)

  if (themeObserver) {
    themeObserver.disconnect()
    themeObserver = null
  }

  if (hideTimer) {
    clearTimeout(hideTimer)
    hideTimer = null
  }
  if (memoryTimer) {
    clearTimeout(memoryTimer)
    memoryTimer = null
  }

  if (hostElement && hostElement.parentNode) {
    hostElement.parentNode.removeChild(hostElement)
  }

  hostElement = null
  shadowRoot = null
  containerElement = null
  btnTop = null
  btnBottom = null
  styleElement = null
}
