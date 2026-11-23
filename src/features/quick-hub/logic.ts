/**
 * Quick Hub - Content Script Logic
 * Creates an in-page floating hub button and menu isolated within Shadow DOM.
 * Provides instant on-page access to PiP, Color Picker, Element Toys,
 * Quick Scroll, Reset Zoom, and Clean URL without losing user gesture activation.
 */

import { isColorPickerSupported } from "~core/browserDetect"
import {
  bindFabRightClick,
  dismissFabOnTab,
  FAB_MENU_ICONS,
  isFabContextMenuOpen,
  isFabRepositioning
} from "~core/fab"
import { t } from "~core/i18n"
import { cleanUrl, copyToClipboard, showCopiedFeedback } from "~core/linkUtils"
import { openExtensionPopup } from "~core/popupHelper"
import { isFeatureBlockedOnUrl, matchesSitePattern } from "~core/siteRules"
import {
  getStoredSettings,
  getStoredSiteRules,
  subscribeToSettings,
  subscribeToSiteRules,
  updateFeatureSetting,
  updateStoredSettings
} from "~core/storage"
import { detectPageTheme, observePageTheme } from "~core/themeDetect"
import { showContentToast } from "~core/toast"
import {
  DEFAULT_QUICK_HUB_CONFIG,
  DEFAULT_SITE_RULES,
  normalizeEdgePlacement,
  normalizeQuickHubActionOrder,
  normalizeQuickHubHiddenActions,
  type EdgePlacement,
  type FeatureKey,
  type FeatureSettings,
  type QuickHubActionId,
  type QuickHubConfig,
  type SiteRule
} from "~core/types"
import {
  isRightClickActive,
  toggleRightClick
} from "~features/allow-right-click/logic"
import { pickColor } from "~features/color-picker/logic"
import { startZapping as startElementToys } from "~features/element-toys/logic"
import { resetZoom as resetMouseZoom } from "~features/mouse-zoom/logic"
import { togglePictureInPicture } from "~features/picture-in-picture/logic"
import { captureActiveVideoFrame } from "~features/video-wheel-control/logic"

let isActive = false
let currentConfig: QuickHubConfig = { ...DEFAULT_QUICK_HUB_CONFIG }
let cachedSettings: FeatureSettings | null = null
let cachedSiteRules: SiteRule[] = DEFAULT_SITE_RULES
let settingsUnsubscribe: (() => void) | null = null
let siteRulesUnsubscribe: (() => void) | null = null

// DOM elements
let hostElement: HTMLDivElement | null = null
let shadowRoot: ShadowRoot | null = null
let triggerBtn: HTMLButtonElement | null = null
let menuCard: HTMLDivElement | null = null
let styleElement: HTMLStyleElement | null = null

// State
let isMenuOpen = false
let hideTimeout: number | null = null
let themeObserver: MutationObserver | null = null
let detectedTheme: "dark" | "light" = "dark"
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
const RIGHT_CLICK_SVG = `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 9 5 12 1.8-5.2L21 14Z"/><path d="M7.2 2.2 8 5.1"/><path d="m5.1 8-2.9-.8"/><path d="M14 4.1 12 6"/><path d="m6 12-1.9 2"/></svg>`
const MARKDOWN_SVG = `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><path d="m10 13-2 2 2 2"/><path d="m14 17 2-2-2-2"/></svg>`
const SHIELD_SVG = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/></svg>`
const CAMERA_SVG = `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></svg>`

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

function getShadowStyles(
  config: QuickHubConfig,
  pageTheme: "dark" | "light" = "dark"
): string {
  const placement = normalizeEdgePlacement(
    config.placement ?? config.corner,
    DEFAULT_QUICK_HUB_CONFIG.placement
  )
  const { btnCss, menuCss } = getPlacementCss(placement)
  const isDark = pageTheme === "dark"
  const opacity = config.buttonOpacity ?? 1
  const shape = config.buttonShape ?? "rounded"
  const shapeCss =
    shape === "circle"
      ? "width: 36px; height: 36px; border-radius: 9999px;"
      : shape === "pill"
        ? "width: 44px; height: 32px; border-radius: 9999px;"
        : "width: 36px; height: 36px; border-radius: 10px;"

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
      ${shapeCss}
      background: ${isDark ? "rgba(18, 18, 24, 0.84)" : "rgba(255, 255, 255, 0.88)"};
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      border: 1px solid ${isDark ? "rgba(255, 255, 255, 0.16)" : "rgba(15, 23, 42, 0.14)"};
      box-shadow: ${
        isDark
          ? "0 4px 18px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.05)"
          : "0 4px 16px rgba(15, 23, 42, 0.12), 0 1px 3px rgba(15, 23, 42, 0.08)"
      };
      color: ${isDark ? "#fbbf24" : "#d97706"};
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
      background: ${isDark ? "rgba(28, 28, 38, 0.95)" : "rgba(255, 255, 255, 0.98)"};
      border-color: rgba(251, 191, 36, 0.55);
      box-shadow: ${
        isDark
          ? "0 6px 22px rgba(0, 0, 0, 0.5), 0 0 12px rgba(251, 191, 36, 0.25)"
          : "0 6px 20px rgba(15, 23, 42, 0.16), 0 0 10px rgba(245, 158, 11, 0.22)"
      };
      opacity: 1 !important;
      transform: scale(1.06);
    }

    .qh-trigger:active {
      transform: scale(0.94);
    }

    .qh-trigger.qh-open {
      background: rgba(251, 191, 36, 0.15);
      border-color: #fbbf24;
      color: #f59e0b;
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
      opacity: ${opacity};
      pointer-events: auto;
      transform: scale(1);
    }

    /* Persistent mode (hoverToReveal === false): idle opacity * 0.3, 100% on hover/open */
    .qh-trigger.qh-persistent {
      opacity: ${Number((opacity * 0.35).toFixed(2))};
      pointer-events: auto;
      transform: scale(1);
    }

    .qh-menu {
      position: fixed;
      ${menuCss}
      min-width: 204px;
      max-width: min(260px, calc(100vw - 32px));
      padding: 5px;
      border-radius: 12px;
      backdrop-filter: blur(18px) saturate(160%);
      -webkit-backdrop-filter: blur(18px) saturate(160%);
      ${
        isDark
          ? `
        background: rgba(15, 23, 42, 0.94);
        border: 1px solid rgba(255, 255, 255, 0.14);
        color: #f1f5f9;
        box-shadow: 0 12px 32px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(0, 0, 0, 0.25);
      `
          : `
        background: rgba(255, 255, 255, 0.96);
        border: 1px solid rgba(15, 23, 42, 0.12);
        color: #0f172a;
        box-shadow: 0 12px 32px rgba(15, 23, 42, 0.16), 0 0 0 1px rgba(15, 23, 42, 0.04);
      `
      }
      z-index: 2147483647;
      opacity: 0;
      pointer-events: none;
      transform: scale(0.95);
      transition: opacity 0.14s ease-out, transform 0.14s ease-out;
    }

    .qh-menu.qh-menu-open {
      opacity: 1;
      pointer-events: auto;
      transform: scale(1);
    }

    .qh-items-list {
      display: flex;
      flex-direction: column;
      gap: 1px;
    }

    .qh-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      padding: 7px 10px;
      border: none;
      background: transparent;
      border-radius: 8px;
      color: inherit;
      font-family: inherit;
      font-size: 12px;
      line-height: 1.35;
      font-weight: 500;
      cursor: pointer;
      text-align: left;
      transition: background 0.12s ease, color 0.12s ease;
      outline: none;
    }

    .qh-item:hover,
    .qh-item:focus-visible {
      background: ${isDark ? "rgba(99, 102, 241, 0.22)" : "rgba(79, 70, 229, 0.1)"};
      color: ${isDark ? "#c7d2fe" : "#4338ca"};
    }

    .qh-item:active {
      transform: scale(0.99);
    }

    .qh-item-content {
      display: flex;
      align-items: center;
      gap: 9px;
      min-width: 0;
    }

    .qh-icon-box {
      width: 16px;
      height: 16px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .qh-icon-pip {
      color: ${isDark ? "#818cf8" : "#4f46e5"};
    }

    .qh-icon-color {
      color: ${isDark ? "#f472b6" : "#db2777"};
    }

    .qh-icon-zap {
      color: ${isDark ? "#fbbf24" : "#d97706"};
    }

    .qh-icon-scroll {
      color: ${isDark ? "#a5b4fc" : "#4f46e5"};
    }

    .qh-icon-zoom {
      color: ${isDark ? "#c084fc" : "#9333ea"};
    }

    .qh-icon-link {
      color: ${isDark ? "#22d3ee" : "#0891b2"};
    }

    .qh-icon-rightclick {
      color: ${isDark ? "#34d399" : "#059669"};
    }

    .qh-icon-markdown {
      color: ${isDark ? "#38bdf8" : "#0284c7"};
    }

    .qh-icon-camera {
      color: ${isDark ? "#fb7185" : "#e11d48"};
    }

    .qh-status-dot {
      width: 7px;
      height: 7px;
      border-radius: 9999px;
      background: #10b981;
      box-shadow: 0 0 6px rgba(16, 185, 129, 0.7);
      flex-shrink: 0;
    }

    .qh-item-name {
      font-size: 12px;
      font-weight: 500;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .qh-empty-msg {
      padding: 14px 10px;
      text-align: center;
      font-size: 11px;
      color: #94a3b8;
      line-height: 1.4;
    }

    .qh-item:disabled,
    .qh-item.qh-item-blocked {
      opacity: 0.48;
      cursor: not-allowed;
    }

    .qh-item:disabled:hover,
    .qh-item.qh-item-blocked:hover {
      background: transparent;
      transform: none;
    }

    .qh-site-off-badge {
      margin-left: auto;
      padding: 2px 6px;
      border-radius: 5px;
      font-size: 9px;
      font-weight: 700;
      letter-spacing: 0.02em;
      color: #fbbf24;
      background: rgba(245, 158, 11, 0.16);
      border: 1px solid rgba(245, 158, 11, 0.35);
      flex-shrink: 0;
    }

    .qh-footer {
      margin-top: 4px;
      padding-top: 4px;
      border-top: 1px solid ${isDark ? "rgba(148, 163, 184, 0.14)" : "rgba(15, 23, 42, 0.08)"};
    }

    .qh-footer-btn {
      display: flex;
      align-items: center;
      gap: 7px;
      width: 100%;
      padding: 6px 10px;
      border: none;
      background: transparent;
      border-radius: 8px;
      color: ${isDark ? "#94a3b8" : "#64748b"};
      font-family: inherit;
      font-size: 11px;
      font-weight: 500;
      cursor: pointer;
      text-align: left;
      transition: background 0.12s ease, color 0.12s ease;
      outline: none;
    }

    .qh-footer-btn:hover,
    .qh-footer-btn:focus-visible {
      background: ${isDark ? "rgba(99, 102, 241, 0.18)" : "rgba(79, 70, 229, 0.08)"};
      color: ${isDark ? "#c7d2fe" : "#4338ca"};
    }

    .qh-footer-btn.qh-footer-active {
      color: ${isDark ? "#fbbf24" : "#b45309"};
    }

    .qh-footer-btn.qh-footer-active:hover,
    .qh-footer-btn.qh-footer-active:focus-visible {
      background: ${isDark ? "rgba(245, 158, 11, 0.16)" : "rgba(217, 119, 6, 0.12)"};
      color: ${isDark ? "#fcd34d" : "#92400e"};
    }

    .qh-footer-label {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  `
}

function markButtonIfSiteBlocked(
  btn: HTMLButtonElement,
  featureKey: FeatureKey
): boolean {
  if (
    !isFeatureBlockedOnUrl(featureKey, window.location.href, cachedSiteRules)
  ) {
    return false
  }
  btn.disabled = true
  btn.classList.add("qh-item-blocked")
  btn.title = t("siteRules.siteOffQuickHubTip")
  const badge = document.createElement("span")
  badge.className = "qh-site-off-badge"
  badge.textContent = t("siteRules.siteOffBadge")
  btn.appendChild(badge)
  return true
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
        <span class="qh-item-name">${t("features.quickHub.settings.actions.pipTitle")}</span>
      </div>
    `
    if (!markButtonIfSiteBlocked(btn, "pictureInPicture")) {
      btn.addEventListener("click", () => {
        closeMenu()
        togglePictureInPicture().catch(() => {})
      })
    }
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
        <span class="qh-item-name">${t("features.quickHub.settings.actions.colorPickerTitle")}</span>
      </div>
    `
    if (!markButtonIfSiteBlocked(btn, "colorPicker")) {
      btn.addEventListener("click", () => {
        closeMenu()
        pickColor().catch(() => {})
      })
    }
    list.appendChild(btn)
    return true
  },
  elementToys: (list, settings) => {
    const isEnabled = settings.elementToys
    const isHidden = settings.featureLayout?.hidden?.includes("elementToys")

    if (!isEnabled || isHidden) {
      return false
    }
    const btn = document.createElement("button")
    btn.type = "button"
    btn.className = "qh-item"
    btn.innerHTML = `
      <div class="qh-item-content">
        <div class="qh-icon-box qh-icon-zap">${ZAP_ICON_SVG}</div>
        <span class="qh-item-name">${t("features.quickHub.settings.actions.elementToysTitle")}</span>
      </div>
    `
    if (!markButtonIfSiteBlocked(btn, "elementToys")) {
      btn.addEventListener("click", () => {
        closeMenu()
        startElementToys()
      })
    }
    list.appendChild(btn)
    return true
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
        <span class="qh-item-name">${t("features.quickHub.settings.actions.scrollTopTitle")}</span>
      </div>
    `
    if (!markButtonIfSiteBlocked(btn, "quickScroll")) {
      btn.addEventListener("click", () => {
        closeMenu()
        window.scrollTo({ top: 0, behavior: "smooth" })
      })
    }
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
        <span class="qh-item-name">${t("features.quickHub.settings.actions.scrollBottomTitle")}</span>
      </div>
    `
    if (!markButtonIfSiteBlocked(btn, "quickScroll")) {
      btn.addEventListener("click", () => {
        closeMenu()
        const scrollHeight = Math.max(
          document.body.scrollHeight,
          document.documentElement.scrollHeight
        )
        window.scrollTo({ top: scrollHeight, behavior: "smooth" })
      })
    }
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
        <span class="qh-item-name">${t("features.quickHub.settings.actions.resetZoomTitle")}</span>
      </div>
    `
    if (!markButtonIfSiteBlocked(btn, "mouseZoom")) {
      btn.addEventListener("click", () => {
        closeMenu()
        resetMouseZoom()
      })
    }
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
        <span class="qh-item-name">${t("features.quickHub.settings.actions.cleanUrlTitle")}</span>
      </div>
    `
    if (!markButtonIfSiteBlocked(btn, "contextMenuActions")) {
      btn.addEventListener("click", async () => {
        const rawUrl = window.location.href
        const cleaned = cleanUrl(rawUrl)
        const ok = await copyToClipboard(cleaned)
        closeMenu()
        if (ok) {
          showCopiedFeedback(t("features.quickHub.logic.cleanUrlCopied"), cleaned)
        }
      })
    }
    list.appendChild(btn)
    return true
  },
  allowRightClick: (list, settings) => {
    if (settings.featureLayout?.hidden?.includes("allowRightClick")) {
      return false
    }
    const active = isRightClickActive()
    const btn = document.createElement("button")
    btn.type = "button"
    btn.className = "qh-item"
    btn.innerHTML = `
      <div class="qh-item-content">
        <div class="qh-icon-box qh-icon-rightclick">${RIGHT_CLICK_SVG}</div>
        <span class="qh-item-name">${t("features.quickHub.settings.actions.allowRightClickTitle")}</span>
      </div>
      ${active ? `<span class="qh-status-dot"></span>` : ""}
    `
    btn.addEventListener("click", () => {
      closeMenu()
      toggleRightClick(true)
    })
    list.appendChild(btn)
    return true
  },
  copyMarkdown: (list, settings) => {
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
        <div class="qh-icon-box qh-icon-markdown">${MARKDOWN_SVG}</div>
        <span class="qh-item-name">${t("features.quickHub.settings.actions.copyMarkdownTitle")}</span>
      </div>
    `
    if (!markButtonIfSiteBlocked(btn, "contextMenuActions")) {
      btn.addEventListener("click", async () => {
        const cleaned = cleanUrl(window.location.href)
        const title = (document.title || cleaned).replace(/[[\]]/g, "\\$&")
        const markdown = `[${title}](${cleaned})`
        const ok = await copyToClipboard(markdown)
        closeMenu()
        if (ok) {
          showCopiedFeedback(t("features.quickHub.logic.markdownCopied"), markdown)
        }
      })
    }
    list.appendChild(btn)
    return true
  },
  videoScreenshot: (list, settings) => {
    if (
      !settings.videoWheelControl ||
      settings.featureLayout?.hidden?.includes("videoWheelControl")
    ) {
      return false
    }
    const btn = document.createElement("button")
    btn.type = "button"
    btn.className = "qh-item"
    btn.innerHTML = `
      <div class="qh-item-content">
        <div class="qh-icon-box qh-icon-camera">${CAMERA_SVG}</div>
        <span class="qh-item-name">${t("features.quickHub.settings.actions.videoScreenshotTitle")}</span>
      </div>
    `
    if (!markButtonIfSiteBlocked(btn, "videoWheelControl")) {
      btn.addEventListener("click", async () => {
        closeMenu()
        const captured = await captureActiveVideoFrame()
        if (!captured) {
          showContentToast({
            message: t("features.quickHub.logic.noVideoFound"),
            type: "warning",
            duration: 1800
          })
        }
      })
    }
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
    const fullOrder = normalizeQuickHubActionOrder(currentConfig.actionOrder)
    const hiddenSet = new Set(normalizeQuickHubHiddenActions(currentConfig.hiddenActions))

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
    empty.textContent = t("features.quickHub.logic.noToolsActive")
    list.appendChild(empty)
  }

  menuCard.appendChild(list)

  // Persistent Site Rules Footer
  const matchingRules = cachedSiteRules.filter(
    (r) => r.enabled && matchesSitePattern(window.location.href, r.pattern)
  )
  const footer = document.createElement("div")
  footer.className = "qh-footer"

  const footerBtn = document.createElement("button")
  footerBtn.type = "button"
  footerBtn.className =
    matchingRules.length > 0
      ? "qh-footer-btn qh-footer-active"
      : "qh-footer-btn"
  footerBtn.title =
    matchingRules.length > 0
      ? t("features.quickHub.logic.siteRulesActiveTip")
      : t("features.quickHub.logic.siteRulesAddTip")
  footerBtn.innerHTML = `
    <span class="qh-icon-box">${SHIELD_SVG}</span>
    <span class="qh-footer-label">${
      matchingRules.length > 0
        ? t("features.quickHub.logic.siteRulesActive", {
            count: matchingRules.length
          })
        : t("features.quickHub.logic.siteRulesAdd")
    }</span>
  `
  footerBtn.addEventListener("click", () => {
    closeMenu()
    Promise.resolve(openExtensionPopup("site-rules")).catch(() => {})
  })
  footer.appendChild(footerBtn)
  menuCard.appendChild(footer)
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
  if (
    !currentConfig.hoverToReveal ||
    isMenuOpen ||
    isFabContextMenuOpen() ||
    isFabRepositioning() ||
    !triggerBtn
  ) {
    return
  }

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

  detectedTheme = detectPageTheme(cachedSettings?.theme ?? "system")
  styleElement = document.createElement("style")
  styleElement.textContent = getShadowStyles(currentConfig, detectedTheme)

  // Floating trigger button
  triggerBtn = document.createElement("button")
  triggerBtn.type = "button"
  triggerBtn.className = `qh-trigger ${
    currentConfig.hoverToReveal ? "qh-proximity qh-hidden" : "qh-persistent"
  }`
  triggerBtn.title = t("features.quickHub.logic.triggerTooltip")
  triggerBtn.setAttribute(
    "aria-label",
    t("features.quickHub.logic.triggerAria")
  )
  triggerBtn.innerHTML = SPARKLES_ICON_SVG
  triggerBtn.addEventListener("click", (e) => {
    e.stopPropagation()
    toggleQuickHubMenu()
  })
  bindFabRightClick(triggerBtn, {
    allowedEdges: ["left", "right", "top", "bottom"],
    getInitialPlacement: () =>
      normalizeEdgePlacement(
        currentConfig.placement ?? currentConfig.corner,
        DEFAULT_QUICK_HUB_CONFIG.placement
      ),
    getBounds: () => ({
      left: 0,
      top: 0,
      width: window.innerWidth,
      height: window.innerHeight
    }),
    getTheme: () => detectedTheme,
    onInteractionStart: () => {
      closeMenu()
      if (hideTimeout) {
        clearTimeout(hideTimeout)
        hideTimeout = null
      }
      if (currentConfig.hoverToReveal && triggerBtn) {
        triggerBtn.classList.remove("qh-hidden")
        triggerBtn.classList.add("qh-visible")
      }
    },
    onPreview: (placement) => {
      currentConfig = { ...currentConfig, placement }
      if (styleElement) {
        styleElement.textContent = getShadowStyles(currentConfig, detectedTheme)
      }
    },
    onCommit: async (placement) => {
      currentConfig = { ...currentConfig, placement }
      updateStyles()
      await updateStoredSettings((cur) => ({
        ...cur,
        quickHubConfig: {
          ...cur.quickHubConfig,
          placement
        }
      }))
    },
    onInteractionEnd: () => {
      updateStyles()
    },
    getMenuItems: ({ startMove }) => [
      {
        id: "move",
        label: t("content.fabMenu.movePosition"),
        iconSvg: FAB_MENU_ICONS.move,
        onSelect: startMove
      },
      {
        id: "settings",
        label: t("content.fabMenu.openSettings"),
        iconSvg: FAB_MENU_ICONS.settings,
        onSelect: () => {
          void openExtensionPopup("quick-hub-settings")
        }
      },
      {
        id: "hide-tab",
        label: t("content.fabMenu.hideOnTab"),
        iconSvg: FAB_MENU_ICONS.eyeOff,
        onSelect: () => {
          dismissFabOnTab("quickHub")
          deactivate()
          showContentToast({
            message: t("content.fabMenu.hiddenOnTab", {
              feature: t("features.quickHub.title")
            }),
            type: "info",
            duration: 1800
          })
        }
      },
      {
        id: "disable",
        label: t("content.fabMenu.disableFeature", {
          feature: t("features.quickHub.title")
        }),
        iconSvg: FAB_MENU_ICONS.power,
        danger: true,
        dividerBefore: true,
        onSelect: () => {
          void updateFeatureSetting("quickHub", false)
        }
      }
    ]
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
  detectedTheme = detectPageTheme(cachedSettings?.theme ?? "system")
  if (styleElement) {
    styleElement.textContent = getShadowStyles(currentConfig, detectedTheme)
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

  // Hydrate settings & site rules
  Promise.all([getStoredSettings(), getStoredSiteRules()])
    .then(([settings, rules]) => {
      cachedSettings = settings
      cachedSiteRules = rules
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

  siteRulesUnsubscribe = subscribeToSiteRules((newRules) => {
    cachedSiteRules = newRules
    if (isMenuOpen) {
      renderMenuContent()
    }
  })

  window.addEventListener("pointermove", handleMouseMove, { passive: true })
  window.addEventListener("pointerdown", handleDocumentPointerDown, { capture: true })
  window.addEventListener("keydown", handleDocumentKeyDown, { capture: true })
  themeObserver = observePageTheme(() => updateStyles())
}

/**
 * Deactivates Quick Hub, removes DOM and listeners.
 */
export function deactivate(): void {
  if (!isActive) return
  isActive = false

  closeMenu()

  if (themeObserver) {
    themeObserver.disconnect()
    themeObserver = null
  }

  if (settingsUnsubscribe) {
    settingsUnsubscribe()
    settingsUnsubscribe = null
  }

  if (siteRulesUnsubscribe) {
    siteRulesUnsubscribe()
    siteRulesUnsubscribe = null
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
