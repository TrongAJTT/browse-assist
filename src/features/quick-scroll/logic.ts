/**
 * Quick Scroll Buttons - Content Script Logic
 * Creates isolated floating scroll-to-top & bottom buttons using Shadow DOM.
 */

import {
  DEFAULT_QUICK_SCROLL_CONFIG,
  type QuickScrollConfig
} from "~core/types"

let isActive = false
let currentConfig: QuickScrollConfig = DEFAULT_QUICK_SCROLL_CONFIG

// DOM References
let hostElement: HTMLDivElement | null = null
let shadowRoot: ShadowRoot | null = null
let containerElement: HTMLDivElement | null = null
let btnTop: HTMLButtonElement | null = null
let btnBottom: HTMLButtonElement | null = null

// State
let lastScrollY = 0
let isAtTopReturned = false
let memoryTimer: number | null = null
let hideTimer: number | null = null
let isTicking = false

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

function createShadowDOM(): void {
  if (hostElement && document.documentElement.contains(hostElement)) return

  hostElement = document.createElement("div")
  hostElement.id = "browse-assist-quick-scroll-host"
  hostElement.style.all = "initial"

  shadowRoot = hostElement.attachShadow({ mode: "closed" })

  const style = document.createElement("style")
  style.textContent = `
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

    .qs-pos-bottom-right {
      right: 18px;
      bottom: 24px;
    }

    .qs-pos-bottom-left {
      left: 18px;
      bottom: 24px;
    }

    .qs-pos-bottom-center {
      left: 50%;
      bottom: 24px;
      transform: translateX(-50%);
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
      border: 1px solid rgba(255, 255, 255, 0.18);
      background: rgba(15, 23, 42, 0.72);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      color: #f8fafc;
      cursor: pointer;
      box-shadow: 0 4px 14px rgba(0, 0, 0, 0.3), 0 1px 3px rgba(0, 0, 0, 0.15);
      transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
      outline: none;
      padding: 0;
      margin: 0;
    }

    .qs-button:hover {
      background: #6366f1;
      color: #ffffff;
      border-color: rgba(99, 102, 241, 0.6);
      transform: scale(1.1);
      box-shadow: 0 6px 20px rgba(99, 102, 241, 0.45);
    }

    .qs-button:active {
      transform: scale(0.95);
    }

    .qs-hidden {
      display: none !important;
    }

    /* Subtle light mode support if document background is predominantly bright */
    @media (prefers-color-scheme: light) {
      .qs-button {
        background: rgba(255, 255, 255, 0.82);
        border: 1px solid rgba(0, 0, 0, 0.1);
        color: #1e293b;
        box-shadow: 0 4px 14px rgba(0, 0, 0, 0.12);
      }
      .qs-button:hover {
        background: #4f46e5;
        color: #ffffff;
      }
    }
  `

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

  shadowRoot.appendChild(style)
  shadowRoot.appendChild(containerElement)

  document.documentElement.appendChild(hostElement)
}

function handleScrollTopClick(e: MouseEvent): void {
  e.stopPropagation()
  e.preventDefault()

  if (isAtTopReturned && lastScrollY > 0) {
    // Return back to saved reading position
    window.scrollTo({
      top: lastScrollY,
      behavior: "smooth"
    })
    resetReturnMemory()
    return
  }

  // Save current scroll position
  if (currentConfig.enableReturnMemory) {
    lastScrollY = window.scrollY || document.documentElement.scrollTop || 0
    isAtTopReturned = true

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

  const maxScroll = Math.max(
    document.body.scrollHeight,
    document.documentElement.scrollHeight
  )

  window.scrollTo({
    top: maxScroll,
    behavior: "smooth"
  })
}

function resetReturnMemory(): void {
  isAtTopReturned = false
  if (memoryTimer) {
    clearTimeout(memoryTimer)
    memoryTimer = null
  }
  if (btnTop) {
    btnTop.title = "Scroll to top"
    btnTop.innerHTML = UP_ARROW_SVG
  }
}

function updateButtonsVisibility(): void {
  if (!containerElement || !btnTop || !btnBottom) return

  const scrollY = window.scrollY || document.documentElement.scrollTop || 0
  const viewportHeight = window.innerHeight || document.documentElement.clientHeight || 0
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
  containerElement.classList.remove("qs-hidden")

  // Top button visibility
  const canScrollUp = scrollY > SCROLL_THRESHOLD || isAtTopReturned
  if (canScrollUp) {
    btnTop.classList.remove("qs-hidden")
  } else {
    btnTop.classList.add("qs-hidden")
    if (!isAtTopReturned) {
      resetReturnMemory()
    }
  }

  // Bottom button visibility
  const distanceToBottom = totalHeight - (scrollY + viewportHeight)
  const canScrollDown =
    currentConfig.buttonsMode === "both" && distanceToBottom > SCROLL_THRESHOLD

  if (canScrollDown) {
    btnBottom.classList.remove("qs-hidden")
  } else {
    btnBottom.classList.add("qs-hidden")
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

export function activate(config: QuickScrollConfig = DEFAULT_QUICK_SCROLL_CONFIG): void {
  currentConfig = config

  if (!isActive) {
    isActive = true
    createShadowDOM()
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onScroll, { passive: true })
  } else if (containerElement) {
    // Update position classes
    containerElement.className = `qs-container qs-pos-${currentConfig.position}`
  }

  updateButtonsVisibility()
}

export function deactivate(): void {
  if (!isActive) return
  isActive = false

  window.removeEventListener("scroll", onScroll)
  window.removeEventListener("resize", onScroll)

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
}
