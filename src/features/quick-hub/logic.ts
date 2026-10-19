/**
 * Quick Hub - Content Script Logic
 * Creates an in-page floating hub button and menu isolated within Shadow DOM.
 * Provides instant on-page access to PiP, Color Picker, Element Toys,
 * Quick Scroll, Reset Zoom, and Clean URL without losing user gesture activation.
 */

import { isColorPickerSupported } from "~core/browserDetect"
import { cleanUrl, copyToClipboard, showCopiedFeedback } from "~core/linkUtils"
import { getStoredSettings, subscribeToSettings } from "~core/storage"
import {
  DEFAULT_QUICK_HUB_ACTION_ORDER,
  DEFAULT_QUICK_HUB_CONFIG,
  normalizeEdgePlacement,
  type EdgePlacement,
  type FeatureSettings,
  type QuickHubActionId,
  type QuickHubConfig
} from "~core/types"
import { pickColor } from "~features/color-picker/logic"
import { startZapping as startElementToys } from "~features/element-toys/logic"
import { resetZoom as resetMouseZoom } from "~features/mouse-zoom/logic"
import { togglePictureInPicture } from "~features/picture-in-picture/logic"

let isActive = false
let currentConfig: QuickHubConfig = { ...DEFAULT_QUICK_HUB_CONFIG }
let cachedSettings: FeatureSettings | null = null
let settingsUnsubscribe: (() => void) | null = null

// DOM elements
let hostElement: HTMLDivElement | null = null
let shadowRoot: ShadowRoot | null = null
let triggerBtn: HTMLButtonElement | null = null
let menuCard: HTMLDivElement | null = null
let styleElement: HTMLStyleElement | null = null

// State
let isMenuOpen = false
let hideTimeout: number | null = null
const PROXIMITY_RADIUS = 80 // px distance from corner to reveal

// SVG Icons
const SPARKLES_ICON_SVG = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/></svg>`
const PIP_ICON_SVG = `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="14" x="2" y="3" rx="2"/><rect width="8" height="5" x="12" y="10" rx="1"/><path d="m2 17 20 0"/></svg>`
const EYEDROPPER_ICON_SVG = `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m2 22 1-1h3l9-9"/><path d="M3 21v-3l9-9"/><path d="m15 6 3.4-3.4a2.1 2.1 0 1 1 3 3L18 9l.4.4a2.1 2.1 0 1 1-3 3l-3.8-3.8a2.1 2.1 0 1 1 3-3l.4.4Z"/></svg>`
const ZAP_ICON_SVG = `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>`
const ARROW_UP_SVG = `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m18 15-6-6-6 6"/></svg>`
const ARROW_DOWN_SVG = `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>`
const ZOOM_SVG = `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="8" y1="11" x2="14" y2="11"/></svg>`
const LINK_SVG = `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>`

function getPlacementCss(placement: EdgePlacement): {
  btnCss: string
  menuCss: string
} {
  const edge = placement.edge
  const offset = Math.max(0, Math.min(100, placement.offsetPercent))

  switch (edge) {
    case "top": {
      const isNearLeft = offset < 35
      const isNearRight = offset > 65
      const origin = isNearLeft ? "top left" : isNearRight ? "top right" : "top center"
      const menuLeftCss = isNearLeft
        ? `left: clamp(16px, ${offset}vw - 18px, calc(100vw - 266px));`
        : isNearRight
          ? `left: clamp(16px, calc(${offset}vw - 232px), calc(100vw - 266px));`
          : `left: clamp(16px, calc(${offset}vw - 125px), calc(100vw - 266px));`

      return {
        btnCss: `top: 16px; left: calc(16px + (100vw - 32px) * ${offset} / 100); transform: translateX(-${offset}%);`,
        menuCss: `top: 56px; ${menuLeftCss} transform-origin: ${origin};`
      }
    }
    case "bottom": {
      const isNearLeft = offset < 35
      const isNearRight = offset > 65
      const origin = isNearLeft ? "bottom left" : isNearRight ? "bottom right" : "bottom center"
      const menuLeftCss = isNearLeft
        ? `left: clamp(16px, ${offset}vw - 18px, calc(100vw - 266px));`
        : isNearRight
          ? `left: clamp(16px, calc(${offset}vw - 232px), calc(100vw - 266px));`
          : `left: clamp(16px, calc(${offset}vw - 125px), calc(100vw - 266px));`

      return {
        btnCss: `bottom: 16px; left: calc(16px + (100vw - 32px) * ${offset} / 100); transform: translateX(-${offset}%);`,
        menuCss: `bottom: 56px; ${menuLeftCss} transform-origin: ${origin};`
      }
    }
    case "left": {
      const isNearTop = offset < 35
      const isNearBottom = offset > 65
      const origin = isNearTop ? "top left" : isNearBottom ? "bottom left" : "center left"
      const menuTopCss = isNearTop
        ? `top: clamp(16px, ${offset}vh - 18px, calc(100vh - 320px));`
        : isNearBottom
          ? `bottom: clamp(16px, calc(100vh - ${offset}vh - 18px), calc(100vh - 320px));`
          : `top: clamp(16px, calc(${offset}vh - 150px), calc(100vh - 320px));`

      return {
        btnCss: `left: 16px; top: calc(16px + (100vh - 32px) * ${offset} / 100); transform: translateY(-${offset}%);`,
        menuCss: `left: 56px; ${menuTopCss} transform-origin: ${origin};`
      }
    }
    case "right":
    default: {
      const isNearTop = offset < 35
      const isNearBottom = offset > 65
      const origin = isNearTop ? "top right" : isNearBottom ? "bottom right" : "center right"
      const menuTopCss = isNearTop
        ? `top: clamp(16px, ${offset}vh - 18px, calc(100vh - 320px));`
        : isNearBottom
          ? `bottom: clamp(16px, calc(100vh - ${offset}vh - 18px), calc(100vh - 320px));`
          : `top: clamp(16px, calc(${offset}vh - 150px), calc(100vh - 320px));`

      return {
        btnCss: `right: 16px; top: calc(16px + (100vh - 32px) * ${offset} / 100); transform: translateY(-${offset}%);`,
        menuCss: `right: 56px; ${menuTopCss} transform-origin: ${origin};`
      }
    }
  }
}

function getShadowStyles(config: QuickHubConfig): string {
  const placement = normalizeEdgePlacement(
    config.placement ?? config.corner,
    DEFAULT_QUICK_HUB_CONFIG.placement
  )
  const { btnCss, menuCss } = getPlacementCss(placement)

  return `
    :host {
      all: initial;
      position: static;
      z-index: 2147483647;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    .qh-trigger {
      position: fixed;
      ${btnCss}
      width: 36px;
      height: 36px;
      border-radius: 10px;
      background: rgba(18, 18, 24, 0.82);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      border: 1px solid rgba(255, 255, 255, 0.16);
      box-shadow: 0 4px 18px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.05);
      color: #fbbf24;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 2147483647;
      user-select: none;
      outline: none;
      transition: opacity 0.22s cubic-bezier(0.16, 1, 0.3, 1),
                  transform 0.22s cubic-bezier(0.16, 1, 0.3, 1),
                  background 0.15s ease,
                  border-color 0.15s ease,
                  box-shadow 0.15s ease;
    }

    .qh-trigger:hover {
      background: rgba(28, 28, 38, 0.95);
      border-color: rgba(251, 191, 36, 0.5);
      box-shadow: 0 6px 22px rgba(0, 0, 0, 0.5), 0 0 12px rgba(251, 191, 36, 0.25);
      transform: scale(1.06);
    }

    .qh-trigger:active {
      transform: scale(0.94);
    }

    .qh-trigger.qh-open {
      background: rgba(251, 191, 36, 0.15);
      border-color: #fbbf24;
      color: #fbbf24;
      box-shadow: 0 0 16px rgba(251, 191, 36, 0.35);
      opacity: 1 !important;
      pointer-events: auto !important;
      transform: scale(1) !important;
    }

    /* Proximity mode (hoverToReveal === true) */
    .qh-trigger.qh-proximity.qh-hidden {
      opacity: 0;
      pointer-events: none;
      transform: scale(0.85);
    }

    .qh-trigger.qh-proximity.qh-visible {
      opacity: 1;
      pointer-events: auto;
      transform: scale(1);
    }

    /* Persistent mode (hoverToReveal === false): 30% opacity when idle, 100% on hover/open */
    .qh-trigger.qh-persistent {
      opacity: 0.3;
      pointer-events: auto;
      transform: scale(1);
    }

    .qh-menu {
      position: fixed;
      ${menuCss}
      width: 250px;
      max-width: calc(100vw - 32px);
      background: rgba(18, 18, 24, 0.94);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.14);
      border-radius: 14px;
      box-shadow: 0 16px 40px rgba(0, 0, 0, 0.55), 0 0 0 1px rgba(255, 255, 255, 0.06);
      padding: 6px;
      z-index: 2147483647;
      opacity: 0;
      pointer-events: none;
      transform: scale(0.92);
      transition: opacity 0.18s cubic-bezier(0.16, 1, 0.3, 1),
                  transform 0.18s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .qh-menu.qh-menu-open {
      opacity: 1;
      pointer-events: auto;
      transform: scale(1);
    }

    .qh-items-list {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .qh-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      padding: 7px 9px;
      border: none;
      background: transparent;
      border-radius: 8px;
      color: #cbd5e1;
      font-size: 12px;
      font-weight: 500;
      cursor: pointer;
      text-align: left;
      transition: background 0.14s ease, color 0.14s ease, transform 0.14s ease;
      outline: none;
    }

    .qh-item:hover {
      background: rgba(255, 255, 255, 0.08);
      color: #f8fafc;
      transform: translateX(2px);
    }

    .qh-item:active {
      transform: scale(0.98) translateX(2px);
    }

    .qh-item-content {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .qh-icon-box {
      width: 26px;
      height: 26px;
      border-radius: 6px;
      display: flex;
      align-items: center;
      justify-content: center;
      shrink: 0;
    }

    .qh-icon-pip {
      background: rgba(99, 102, 241, 0.15);
      color: #818cf8;
    }

    .qh-icon-color {
      background: rgba(244, 114, 182, 0.15);
      color: #f472b6;
    }

    .qh-icon-zap {
      background: rgba(251, 191, 36, 0.15);
      color: #fbbf24;
    }

    .qh-icon-scroll {
      background: rgba(129, 140, 248, 0.15);
      color: #a5b4fc;
    }

    .qh-icon-zoom {
      background: rgba(167, 139, 250, 0.15);
      color: #c084fc;
    }

    .qh-icon-link {
      background: rgba(34, 211, 238, 0.15);
      color: #22d3ee;
    }

    .qh-item-name {
      font-size: 11.5px;
      font-weight: 500;
    }

    .qh-empty-msg {
      padding: 14px 10px;
      text-align: center;
      font-size: 11px;
      color: #94a3b8;
      line-height: 1.4;
    }
  `
}

const ACTION_RENDERERS: Record<
  QuickHubActionId,
  (list: HTMLElement, settings: FeatureSettings) => boolean
> = {
  pip: (list, settings) => {
    if (
      !settings.pictureInPicture ||
      settings.featureLayout?.hidden?.includes("pictureInPicture")
    ) {
      return false
    }
    const btn = document.createElement("button")
    btn.type = "button"
    btn.className = "qh-item"
    btn.innerHTML = `
      <div class="qh-item-content">
        <div class="qh-icon-box qh-icon-pip">${PIP_ICON_SVG}</div>
        <span class="qh-item-name">Watch Video in PiP</span>
      </div>
    `
    btn.addEventListener("click", () => {
      closeMenu()
      togglePictureInPicture().catch(() => {})
    })
    list.appendChild(btn)
    return true
  },
  colorPicker: (list, settings) => {
    if (
      !isColorPickerSupported ||
      !settings.colorPicker ||
      settings.featureLayout?.hidden?.includes("colorPicker")
    ) {
      return false
    }
    const btn = document.createElement("button")
    btn.type = "button"
    btn.className = "qh-item"
    btn.innerHTML = `
      <div class="qh-item-content">
        <div class="qh-icon-box qh-icon-color">${EYEDROPPER_ICON_SVG}</div>
        <span class="qh-item-name">Pick Color from Screen</span>
      </div>
    `
    btn.addEventListener("click", () => {
      closeMenu()
      pickColor().catch(() => {})
    })
    list.appendChild(btn)
    return true
  },
  elementToys: (list, settings) => {
    const isEnabled = settings.elementToys ?? settings.elementZapper
    const isHidden =
      settings.featureLayout?.hidden?.includes("elementToys") ||
      settings.featureLayout?.hidden?.includes("elementZapper")

    if (!isEnabled || isHidden) {
      return false
    }
    const btn = document.createElement("button")
    btn.type = "button"
    btn.className = "qh-item"
    btn.innerHTML = `
      <div class="qh-item-content">
        <div class="qh-icon-box qh-icon-zap">${ZAP_ICON_SVG}</div>
        <span class="qh-item-name">Element Toys</span>
      </div>
    `
    btn.addEventListener("click", () => {
      closeMenu()
      startElementToys()
    })
    list.appendChild(btn)
    return true
  },
  get elementZapper() {
    return this.elementToys
  },
  scrollTop: (list, settings) => {
    if (
      !settings.quickScroll ||
      settings.featureLayout?.hidden?.includes("quickScroll")
    ) {
      return false
    }
    const btn = document.createElement("button")
    btn.type = "button"
    btn.className = "qh-item"
    btn.innerHTML = `
      <div class="qh-item-content">
        <div class="qh-icon-box qh-icon-scroll">${ARROW_UP_SVG}</div>
        <span class="qh-item-name">Scroll to Top</span>
      </div>
    `
    btn.addEventListener("click", () => {
      closeMenu()
      window.scrollTo({ top: 0, behavior: "smooth" })
    })
    list.appendChild(btn)
    return true
  },
  scrollBottom: (list, settings) => {
    if (
      !settings.quickScroll ||
      settings.featureLayout?.hidden?.includes("quickScroll") ||
      settings.quickScrollConfig?.buttonsMode === "top-only"
    ) {
      return false
    }
    const btn = document.createElement("button")
    btn.type = "button"
    btn.className = "qh-item"
    btn.innerHTML = `
      <div class="qh-item-content">
        <div class="qh-icon-box qh-icon-scroll">${ARROW_DOWN_SVG}</div>
        <span class="qh-item-name">Scroll to Bottom</span>
      </div>
    `
    btn.addEventListener("click", () => {
      closeMenu()
      const scrollHeight = Math.max(
        document.body.scrollHeight,
        document.documentElement.scrollHeight
      )
      window.scrollTo({ top: scrollHeight, behavior: "smooth" })
    })
    list.appendChild(btn)
    return true
  },
  resetZoom: (list, settings) => {
    if (
      !settings.mouseZoom ||
      settings.featureLayout?.hidden?.includes("mouseZoom")
    ) {
      return false
    }
    const btn = document.createElement("button")
    btn.type = "button"
    btn.className = "qh-item"
    btn.innerHTML = `
      <div class="qh-item-content">
        <div class="qh-icon-box qh-icon-zoom">${ZOOM_SVG}</div>
        <span class="qh-item-name">Reset Page Zoom</span>
      </div>
    `
    btn.addEventListener("click", () => {
      closeMenu()
      resetMouseZoom()
    })
    list.appendChild(btn)
    return true
  },
  cleanUrl: (list, settings) => {
    if (
      !settings.contextMenuActions ||
      settings.featureLayout?.hidden?.includes("contextMenuActions")
    ) {
      return false
    }
    const btn = document.createElement("button")
    btn.type = "button"
    btn.className = "qh-item"
    btn.innerHTML = `
      <div class="qh-item-content">
        <div class="qh-icon-box qh-icon-link">${LINK_SVG}</div>
        <span class="qh-item-name">Copy Clean URL</span>
      </div>
    `
    btn.addEventListener("click", async () => {
      closeMenu()
      const rawUrl = window.location.href
      const cleaned = cleanUrl(rawUrl)
      const ok = await copyToClipboard(cleaned)
      if (ok) {
        showCopiedFeedback("Clean URL Copied", cleaned)
      }
    })
    list.appendChild(btn)
    return true
  }
}

function renderMenuContent(): void {
  if (!menuCard) return

  menuCard.innerHTML = ""

  // Items List
  const list = document.createElement("div")
  list.className = "qh-items-list"

  let renderedCount = 0
  const settings = cachedSettings

  if (settings) {
    const rawOrder = currentConfig.actionOrder ?? DEFAULT_QUICK_HUB_ACTION_ORDER
    const missing = DEFAULT_QUICK_HUB_ACTION_ORDER.filter(
      (id) => !rawOrder.includes(id)
    )
    const fullOrder = [...rawOrder, ...missing]
    const hiddenSet = new Set(currentConfig.hiddenActions ?? [])

    for (const actionId of fullOrder) {
      if (hiddenSet.has(actionId)) continue
      const renderer = ACTION_RENDERERS[actionId]
      if (renderer && renderer(list, settings)) {
        renderedCount++
      }
    }
  }

  if (renderedCount === 0) {
    const empty = document.createElement("div")
    empty.className = "qh-empty-msg"
    empty.textContent = "No tools active. Enable features in Browse Assist popup."
    list.appendChild(empty)
  }

  menuCard.appendChild(list)
}

function openMenu(): void {
  if (isMenuOpen || !menuCard || !triggerBtn) return
  isMenuOpen = true
  renderMenuContent()
  menuCard.classList.add("qh-menu-open")
  triggerBtn.classList.add("qh-open")
  if (currentConfig.hoverToReveal) {
    triggerBtn.classList.remove("qh-hidden")
    triggerBtn.classList.add("qh-visible")
  }
}

function closeMenu(): void {
  if (!isMenuOpen || !menuCard || !triggerBtn) return
  isMenuOpen = false
  menuCard.classList.remove("qh-menu-open")
  triggerBtn.classList.remove("qh-open")

  if (currentConfig.hoverToReveal) {
    triggerBtn.classList.remove("qh-visible")
    triggerBtn.classList.add("qh-hidden")
  }
}

export function toggleQuickHubMenu(): void {
  if (isMenuOpen) {
    closeMenu()
  } else {
    openMenu()
  }
}

/**
 * Checks proximity between mouse coordinate and floating trigger button.
 */
function handleMouseMove(e: MouseEvent): void {
  if (!currentConfig.hoverToReveal || isMenuOpen || !triggerBtn) return

  const rect = triggerBtn.getBoundingClientRect()
  const btnCenterX = rect.left + rect.width / 2
  const btnCenterY = rect.top + rect.height / 2

  const dist = Math.hypot(btnCenterX - e.clientX, btnCenterY - e.clientY)

  if (dist <= PROXIMITY_RADIUS) {
    if (hideTimeout) {
      clearTimeout(hideTimeout)
      hideTimeout = null
    }
    triggerBtn.classList.remove("qh-hidden")
    triggerBtn.classList.add("qh-visible")
  } else {
    if (!hideTimeout && triggerBtn.classList.contains("qh-visible")) {
      hideTimeout = window.setTimeout(() => {
        if (!isMenuOpen && triggerBtn) {
          triggerBtn.classList.remove("qh-visible")
          triggerBtn.classList.add("qh-hidden")
        }
        hideTimeout = null
      }, 450)
    }
  }
}

/**
 * Closes Quick Hub if clicking outside the shadow DOM host.
 */
function handleDocumentPointerDown(e: MouseEvent): void {
  if (!isMenuOpen) return

  const path = e.composedPath?.() || []
  if (hostElement && path.includes(hostElement)) {
    return
  }
  closeMenu()
}

/**
 * Escape key closes the menu.
 */
function handleDocumentKeyDown(e: KeyboardEvent): void {
  if (isMenuOpen && e.key === "Escape") {
    e.preventDefault()
    e.stopPropagation()
    closeMenu()
  }
}

function createDOM(): void {
  if (hostElement && document.documentElement.contains(hostElement)) return

  hostElement = document.createElement("div")
  hostElement.id = "browse-assist-quick-hub-host"
  hostElement.setAttribute("data-browse-assist-internal", "true")

  shadowRoot = hostElement.attachShadow({ mode: "closed" })

  styleElement = document.createElement("style")
  styleElement.textContent = getShadowStyles(currentConfig)

  // Floating trigger button
  triggerBtn = document.createElement("button")
  triggerBtn.type = "button"
  triggerBtn.className = `qh-trigger ${
    currentConfig.hoverToReveal ? "qh-proximity qh-hidden" : "qh-persistent"
  }`
  triggerBtn.title = "Quick Hub (Instant Tools)"
  triggerBtn.setAttribute("aria-label", "Quick Hub")
  triggerBtn.innerHTML = SPARKLES_ICON_SVG
  triggerBtn.addEventListener("click", (e) => {
    e.stopPropagation()
    toggleQuickHubMenu()
  })

  // Popup Menu
  menuCard = document.createElement("div")
  menuCard.className = "qh-menu"

  shadowRoot.appendChild(styleElement)
  shadowRoot.appendChild(triggerBtn)
  shadowRoot.appendChild(menuCard)

  document.documentElement.appendChild(hostElement)
}

function updateStyles(): void {
  if (styleElement) {
    styleElement.textContent = getShadowStyles(currentConfig)
  }
  if (triggerBtn) {
    if (currentConfig.hoverToReveal) {
      triggerBtn.classList.remove("qh-persistent")
      triggerBtn.classList.add("qh-proximity")
      if (!isMenuOpen) {
        triggerBtn.classList.remove("qh-visible")
        triggerBtn.classList.add("qh-hidden")
      } else {
        triggerBtn.classList.remove("qh-hidden")
        triggerBtn.classList.add("qh-visible")
      }
    } else {
      triggerBtn.classList.remove("qh-proximity", "qh-hidden", "qh-visible")
      triggerBtn.classList.add("qh-persistent")
    }
  }
}

/**
 * Updates runtime Quick Hub config.
 */
export function updateQuickHubConfig(config?: Partial<QuickHubConfig>): void {
  if (!config) return
  currentConfig = { ...currentConfig, ...config }
  updateStyles()
}

/**
 * Activates Quick Hub content script listeners and mounts UI.
 */
export function activate(config?: QuickHubConfig): void {
  if (config) {
    currentConfig = { ...currentConfig, ...config }
  }

  if (isActive || typeof window === "undefined") return
  isActive = true

  // Hydrate settings
  getStoredSettings()
    .then((settings) => {
      cachedSettings = settings
      if (settings?.quickHubConfig) {
        currentConfig = { ...currentConfig, ...settings.quickHubConfig }
      }
      createDOM()
      updateStyles()
    })
    .catch(() => {})

  settingsUnsubscribe = subscribeToSettings((newSettings) => {
    cachedSettings = newSettings
    if (newSettings.quickHubConfig) {
      currentConfig = { ...currentConfig, ...newSettings.quickHubConfig }
      updateStyles()
    }
    if (isMenuOpen) {
      renderMenuContent()
    }
  })

  window.addEventListener("pointermove", handleMouseMove, { passive: true })
  window.addEventListener("pointerdown", handleDocumentPointerDown, { capture: true })
  window.addEventListener("keydown", handleDocumentKeyDown, { capture: true })
}

/**
 * Deactivates Quick Hub, removes DOM and listeners.
 */
export function deactivate(): void {
  if (!isActive) return
  isActive = false

  closeMenu()

  if (settingsUnsubscribe) {
    settingsUnsubscribe()
    settingsUnsubscribe = null
  }

  window.removeEventListener("pointermove", handleMouseMove)
  window.removeEventListener("pointerdown", handleDocumentPointerDown, { capture: true })
  window.removeEventListener("keydown", handleDocumentKeyDown, { capture: true })

  if (hideTimeout) {
    clearTimeout(hideTimeout)
    hideTimeout = null
  }

  if (hostElement && hostElement.parentNode) {
    hostElement.parentNode.removeChild(hostElement)
  }
  hostElement = null
  shadowRoot = null
  triggerBtn = null
  menuCard = null
  styleElement = null
}
