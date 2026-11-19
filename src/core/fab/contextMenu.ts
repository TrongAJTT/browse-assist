/**
 * Shared Shadow DOM Context Menu for in-page Floating Action Buttons (FABs).
 * Isolated from host page CSS, auto-themed, and viewport-clamped.
 */

import { detectPageTheme } from "~core/themeDetect"

export interface FabMenuItem {
  id: string
  label: string
  iconSvg?: string
  danger?: boolean
  dividerBefore?: boolean
  onSelect: () => void
}

export interface FabContextMenuOptions {
  x: number
  y: number
  items: FabMenuItem[]
  theme?: "dark" | "light"
  onClose?: () => void
}

export const FAB_MENU_ICONS = {
  move: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="5 9 2 12 5 15"/><polyline points="9 5 12 2 15 5"/><polyline points="15 19 12 22 9 19"/><polyline points="19 9 22 12 19 15"/><line x1="2" y1="12" x2="22" y2="12"/><line x1="12" y1="2" x2="12" y2="22"/></svg>`,
  settings: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>`,
  eyeOff: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" y1="2" x2="22" y2="22"/></svg>`,
  power: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18.36 6.64a9 9 0 1 1-12.73 0"/><line x1="12" y1="2" x2="12" y2="12"/></svg>`
} as const

const MENU_HOST_ID = "__browse_assist_fab_context_menu__"

let activeHost: HTMLDivElement | null = null
let activeCleanup: (() => void) | null = null
let activeOnClose: (() => void) | null = null

export function isFabContextMenuOpen(): boolean {
  return activeHost !== null
}

export function closeFabContextMenu(): void {
  if (activeCleanup) {
    activeCleanup()
    activeCleanup = null
  }
  if (activeHost && activeHost.parentNode) {
    activeHost.parentNode.removeChild(activeHost)
  }
  activeHost = null

  const onClose = activeOnClose
  activeOnClose = null
  onClose?.()
}

function getMenuStyles(isDark: boolean): string {
  return `
    :host {
      all: initial;
      position: fixed;
      inset: 0;
      z-index: 2147483647;
      pointer-events: none;
    }

    .fab-menu {
      position: fixed;
      min-width: 196px;
      max-width: 260px;
      padding: 5px;
      border-radius: 12px;
      pointer-events: auto;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      font-size: 12px;
      line-height: 1.35;
      user-select: none;
      -webkit-user-select: none;
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
      opacity: 0;
      transform: scale(0.95);
      transition: opacity 0.12s ease-out, transform 0.12s ease-out;
    }

    .fab-menu.open {
      opacity: 1;
      transform: scale(1);
    }

    .fab-menu-divider {
      height: 1px;
      margin: 4px 6px;
      background: ${isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(15, 23, 42, 0.08)"};
    }

    .fab-menu-item {
      width: 100%;
      display: flex;
      align-items: center;
      gap: 9px;
      padding: 7px 10px;
      border: none;
      border-radius: 8px;
      background: transparent;
      color: inherit;
      font: inherit;
      font-weight: 500;
      text-align: left;
      cursor: pointer;
      transition: background 0.12s ease, color 0.12s ease;
    }

    .fab-menu-item:hover,
    .fab-menu-item:focus-visible {
      outline: none;
      background: ${isDark ? "rgba(99, 102, 241, 0.22)" : "rgba(79, 70, 229, 0.1)"};
      color: ${isDark ? "#c7d2fe" : "#4338ca"};
    }

    .fab-menu-item.danger {
      color: ${isDark ? "#fca5a5" : "#dc2626"};
    }

    .fab-menu-item.danger:hover,
    .fab-menu-item.danger:focus-visible {
      background: ${isDark ? "rgba(239, 68, 68, 0.18)" : "rgba(239, 68, 68, 0.1)"};
      color: ${isDark ? "#fecaca" : "#b91c1c"};
    }

    .fab-menu-icon {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 15px;
      height: 15px;
      flex-shrink: 0;
      opacity: 0.85;
    }

    .fab-menu-label {
      flex: 1;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  `
}

export function openFabContextMenu(options: FabContextMenuOptions): void {
  if (typeof document === "undefined" || !document.documentElement) return

  // Close any existing FAB context menu first
  closeFabContextMenu()

  const theme = options.theme ?? detectPageTheme("system")
  const isDark = theme === "dark"

  const host = document.createElement("div")
  host.id = MENU_HOST_ID
  host.setAttribute("data-browse-assist-internal", "true")

  const shadow = host.attachShadow({ mode: "open" })
  const style = document.createElement("style")
  style.textContent = getMenuStyles(isDark)
  shadow.appendChild(style)

  const menu = document.createElement("div")
  menu.className = "fab-menu"
  menu.setAttribute("role", "menu")
  menu.addEventListener("contextmenu", (e) => {
    e.preventDefault()
    e.stopPropagation()
  })

  for (const item of options.items) {
    if (item.dividerBefore) {
      const divider = document.createElement("div")
      divider.className = "fab-menu-divider"
      divider.setAttribute("role", "separator")
      menu.appendChild(divider)
    }

    const btn = document.createElement("button")
    btn.type = "button"
    btn.className = item.danger ? "fab-menu-item danger" : "fab-menu-item"
    btn.setAttribute("role", "menuitem")
    btn.dataset.actionId = item.id

    if (item.iconSvg) {
      const iconSpan = document.createElement("span")
      iconSpan.className = "fab-menu-icon"
      iconSpan.innerHTML = item.iconSvg
      btn.appendChild(iconSpan)
    }

    const labelSpan = document.createElement("span")
    labelSpan.className = "fab-menu-label"
    labelSpan.textContent = item.label
    btn.appendChild(labelSpan)

    btn.addEventListener("click", (e) => {
      e.preventDefault()
      e.stopPropagation()
      closeFabContextMenu()
      item.onSelect()
    })

    menu.appendChild(btn)
  }

  shadow.appendChild(menu)
  document.documentElement.appendChild(host)

  // Clamp coordinates so menu never overflows viewport
  const margin = 8
  const rect = menu.getBoundingClientRect()
  const menuW = rect.width || 210
  const menuH = rect.height || options.items.length * 36 + 16
  const vw = window.innerWidth
  const vh = window.innerHeight

  const clampedX = Math.max(margin, Math.min(options.x, vw - menuW - margin))
  const clampedY = Math.max(margin, Math.min(options.y, vh - menuH - margin))
  menu.style.left = `${clampedX}px`
  menu.style.top = `${clampedY}px`

  requestAnimationFrame(() => {
    menu.classList.add("open")
  })

  const handlePointerDown = (e: Event) => {
    const path = e.composedPath ? e.composedPath() : []
    if (path.includes(host) || path.includes(menu)) return
    closeFabContextMenu()
  }

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      e.preventDefault()
      e.stopPropagation()
      closeFabContextMenu()
    }
  }

  const handleDismiss = () => {
    closeFabContextMenu()
  }

  // Defer attaching outside-click listener so the triggering event does not immediately close it
  window.addEventListener("pointerdown", handlePointerDown, { capture: true })
  window.addEventListener("keydown", handleKeyDown, { capture: true })
  window.addEventListener("scroll", handleDismiss, {
    capture: true,
    passive: true
  })
  window.addEventListener("blur", handleDismiss)

  activeHost = host
  activeOnClose = options.onClose ?? null
  activeCleanup = () => {
    window.removeEventListener("pointerdown", handlePointerDown, {
      capture: true
    })
    window.removeEventListener("keydown", handleKeyDown, { capture: true })
    window.removeEventListener("scroll", handleDismiss, { capture: true })
    window.removeEventListener("blur", handleDismiss)
  }
}
