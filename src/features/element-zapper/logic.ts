/**
 * Element Toys - Content Script DOM Logic
 * Comprehensive in-page DOM inspector & tweaker:
 * - Continuous interactive session with in-page HUD Toolbar (SVG icons)
 * - Multi-action modes: Zap (delete), Edit (inline text with key capture),
 *   Move (relative layout flow across containers or absolute freeform), Hide (soft hide)
 * - Scope adjustment (+ / -) to expand selection to parent or shrink to child
 * - Dimension badge (W × H px) & HTML tag selector
 * - Direct Settings launch button
 * - Undo stack (Ctrl+Z) for all actions
 * - Intelligent scroll-unlock recovery
 */

import { MESSAGE_TYPES, sendToBackground } from "~core/messaging"
import { extensionStorage } from "~core/storage"
import { showContentToast } from "~core/toast"
import {
  DEFAULT_ELEMENT_ZAPPER_CONFIG,
  STORAGE_KEYS,
  type ElementMoveType,
  type ElementZapperConfig,
  type FeatureSettings,
  type ZapperMode
} from "~core/types"

let isActive = false
let isSessionActive = false
let currentConfig: ElementZapperConfig = DEFAULT_ELEMENT_ZAPPER_CONFIG
let currentMode: ZapperMode = "zap"

// Active editing state
let editingElement: HTMLElement | null = null
let editingOriginalHTML = ""
let editingCleanups: Array<() => void> = []

// Active moving state
let isDragging = false
let dragTarget: HTMLElement | null = null
let dragStartX = 0
let dragStartY = 0
let dragInitialTranslateX = 0
let dragInitialTranslateY = 0
let dragInitialTransform = ""
let dragInitialParent: HTMLElement | null = null
let dragInitialNextSibling: Node | null = null

// Scope hierarchy tracking (+/- keys)
let scopeDepth = 0
let scopeBaseElement: HTMLElement | null = null

// Undo action history
interface UndoAction {
  type: ZapperMode
  element: HTMLElement
  parent?: HTMLElement | null
  nextSibling?: Node | null
  oldText?: string
  newText?: string
  moveType?: ElementMoveType
  oldTransform?: string
  newTransform?: string
  oldParent?: HTMLElement | null
  oldNextSibling?: Node | null
  newParent?: HTMLElement | null
  newNextSibling?: Node | null
  oldVisibility?: string
  oldDisplay?: string
}

const undoStack: UndoAction[] = []

// UI Overlay DOM references
let overlayContainer: HTMLDivElement | null = null
let highlightBox: HTMLDivElement | null = null
let tagBadge: HTMLDivElement | null = null
let toolbarElement: HTMLDivElement | null = null
let currentHoveredElement: HTMLElement | null = null

const ZAPPER_CONTAINER_ID = "__browse_assist_element_toys_container__"
const TOOLBAR_ID = "__browse_assist_element_toys_toolbar__"

// Crisp inline SVG icons (13x13 or 14x14) matching Lucide design language
const SVG_ICONS = {
  logo: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>`,
  zap: `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>`,
  edit: `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg>`,
  move: `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="5 9 2 12 5 15"/><polyline points="9 5 12 2 15 5"/><polyline points="15 19 12 22 9 19"/><polyline points="19 9 22 12 19 15"/><line x1="2" y1="12" x2="22" y2="12"/><line x1="12" y1="2" x2="12" y2="22"/></svg>`,
  hide: `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>`,
  undo: `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 7v6h6"/><path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13"/></svg>`,
  settings: `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>`,
  exit: `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`
}

// Mode visual themes
const MODE_COLORS: Record<ZapperMode, { primary: string; bg: string; border: string }> = {
  zap: {
    primary: "#ef4444",
    bg: "rgba(239, 68, 68, 0.15)",
    border: "#ef4444"
  },
  edit: {
    primary: "#0ea5e9",
    bg: "rgba(14, 165, 233, 0.15)",
    border: "#0ea5e9"
  },
  move: {
    primary: "#10b981",
    bg: "rgba(16, 185, 129, 0.15)",
    border: "#10b981"
  },
  hide: {
    primary: "#f59e0b",
    bg: "rgba(245, 158, 11, 0.15)",
    border: "#f59e0b"
  }
}

/**
 * Returns appropriate cursor style for the current mode.
 */
function getCursorForMode(mode: ZapperMode): string {
  switch (mode) {
    case "zap":
      return "crosshair"
    case "edit":
      return "text"
    case "move":
      return isDragging ? "grabbing" : "grab"
    case "hide":
      return "cell"
    default:
      return "crosshair"
  }
}

/**
 * Creates the highlighter elements and floating HUD toolbar.
 */
function ensureOverlay(): void {
  // If overlay already exists and is attached to the document, ensure elements are wired
  if (overlayContainer && document.documentElement.contains(overlayContainer)) {
    if (toolbarElement && !overlayContainer.contains(toolbarElement)) {
      overlayContainer.appendChild(toolbarElement)
    }
    return
  }

  // Clean up any detached container if present
  if (overlayContainer && overlayContainer.parentNode) {
    overlayContainer.parentNode.removeChild(overlayContainer)
  }

  // Root container
  overlayContainer = document.createElement("div")
  overlayContainer.id = ZAPPER_CONTAINER_ID
  overlayContainer.setAttribute("data-browse-assist-internal", "true")
  overlayContainer.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    pointer-events: none;
    z-index: 2147483647;
    display: none;
  `

  // Highlight Box
  if (!highlightBox) {
    highlightBox = document.createElement("div")
    highlightBox.setAttribute("data-browse-assist-internal", "true")
    highlightBox.style.cssText = `
      position: fixed;
      pointer-events: none;
      box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.3);
      border-radius: 4px;
      transition: top 0.04s ease-out, left 0.04s ease-out, width 0.04s ease-out, height 0.04s ease-out;
      box-sizing: border-box;
      display: none;
    `

    // Badge
    tagBadge = document.createElement("div")
    tagBadge.setAttribute("data-browse-assist-internal", "true")
    tagBadge.style.cssText = `
      position: absolute;
      top: -26px;
      left: 0;
      background: #18181b;
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      font-size: 11px;
      font-weight: 600;
      padding: 3px 8px;
      border-radius: 5px;
      white-space: nowrap;
      pointer-events: none;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.6);
      display: flex;
      align-items: center;
      gap: 5px;
    `
    highlightBox.appendChild(tagBadge)
  }

  overlayContainer.appendChild(highlightBox)

  // Floating HUD Toolbar
  createToolbar()

  document.documentElement.appendChild(overlayContainer)
}

/**
 * Builds the floating pill toolbar for switching modes, undoing, settings, and exiting.
 */
function createToolbar(): void {
  if (!toolbarElement) {
    toolbarElement = document.createElement("div")
    toolbarElement.id = TOOLBAR_ID
    toolbarElement.setAttribute("data-browse-assist-internal", "true")
    toolbarElement.style.cssText = `
      position: fixed;
      top: 14px;
      left: 50%;
      transform: translateX(-50%);
      pointer-events: auto;
      z-index: 2147483647;
      background: rgba(18, 18, 22, 0.94);
      backdrop-filter: blur(14px);
      -webkit-backdrop-filter: blur(14px);
      border: 1px solid rgba(255, 255, 255, 0.14);
      box-shadow: 0 12px 36px rgba(0, 0, 0, 0.55), 0 0 0 1px rgba(0, 0, 0, 0.4);
      border-radius: 9999px;
      padding: 4px 8px;
      display: flex;
      align-items: center;
      gap: 4px;
      user-select: none;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      font-size: 12px;
      color: #f4f4f5;
    `
  }

  if (overlayContainer && !overlayContainer.contains(toolbarElement)) {
    overlayContainer.appendChild(toolbarElement)
  }

  renderToolbarContents()
}

/**
 * Renders toolbar buttons with SVGs and active states.
 */
function renderToolbarContents(): void {
  if (!toolbarElement) return

  const isMoveActive = currentMode === "move"

  toolbarElement.innerHTML = `
    <div style="display:flex;align-items:center;gap:5px;padding:0 6px 0 4px;color:#fbbf24;font-weight:700;font-size:11.5px;letter-spacing:0.02em;">
      ${SVG_ICONS.logo}
      <span>Element Toys</span>
    </div>
    <div style="width:1px;height:16px;background:rgba(255,255,255,0.15);margin:0 2px;"></div>
    
    <!-- Mode Buttons with crisp SVG icons -->
    <div style="display:flex;align-items:center;gap:3px;" id="__et_modes__">
      <button type="button" data-mode="zap" title="Zap: Click to eliminate element from DOM" style="${getModeButtonStyle("zap")}">
        ${SVG_ICONS.zap}<span>Zap</span>
      </button>
      <button type="button" data-mode="edit" title="Edit Text: Click any text to edit inline" style="${getModeButtonStyle("edit")}">
        ${SVG_ICONS.edit}<span>Edit</span>
      </button>

      <!-- Move Button with embedded Flow / Free switcher -->
      ${
        isMoveActive
          ? `
        <div style="display:flex;align-items:center;background:#10b981;border-radius:9999px;padding:2px 3px;gap:3px;box-shadow:0 2px 8px #10b98166;">
          <button type="button" data-mode="move" title="Move Tool Active (Press +/- to adjust parent scope)" style="display:flex;align-items:center;gap:4px;border:none;background:transparent;color:#ffffff;font-size:11.5px;font-weight:700;cursor:pointer;padding:2px 4px;">
            ${SVG_ICONS.move}<span>Move</span>
          </button>
          <div style="display:flex;align-items:center;background:rgba(0,0,0,0.28);border-radius:9999px;padding:1px 2px;gap:2px;">
            <button type="button" data-sub-move="relative" title="Flow Mode: Reorders in DOM layout across containers & pushes other elements" style="${getSubMoveBtnStyle(currentConfig.moveType === "relative")}">Flow</button>
            <button type="button" data-sub-move="absolute" title="Free Mode: Freeform transform without altering layout" style="${getSubMoveBtnStyle(currentConfig.moveType === "absolute")}">Free</button>
          </div>
        </div>
      `
          : `
        <button type="button" data-mode="move" title="Move: Click to activate Move mode (Flow / Free)" style="${getModeButtonStyle("move")}">
          ${SVG_ICONS.move}<span>Move (${currentConfig.moveType === "relative" ? "Flow" : "Free"})</span>
        </button>
      `
      }

      <button type="button" data-mode="hide" title="Hide: Click to soft-hide without shifting layout" style="${getModeButtonStyle("hide")}">
        ${SVG_ICONS.hide}<span>Hide</span>
      </button>
    </div>

    <div style="width:1px;height:16px;background:rgba(255,255,255,0.15);margin:0 2px;"></div>

    <!-- Undo Button -->
    <button type="button" id="__et_undo__" title="Undo Last Action (Ctrl+Z)" ${undoStack.length === 0 ? "disabled" : ""} style="${getActionButtonStyle(undoStack.length === 0)}">
      ${SVG_ICONS.undo}
      <span>Undo</span>
      ${undoStack.length > 0 ? `<span style="background:rgba(255,255,255,0.2);padding:1px 5px;border-radius:10px;font-size:10px;">${undoStack.length}</span>` : ""}
    </button>

    <!-- Settings Button -->
    <button type="button" id="__et_settings__" title="Open Element Toys Settings" style="display:flex;align-items:center;gap:3.5px;padding:4px 8px;border-radius:9999px;border:1px solid rgba(255,255,255,0.1);background:rgba(255,255,255,0.06);color:#e4e4e7;cursor:pointer;font-size:11.5px;font-weight:500;transition:all 0.15s ease;">
      ${SVG_ICONS.settings}
      <span>Settings</span>
    </button>

    <!-- Exit Button -->
    <button type="button" id="__et_exit__" title="Exit Element Toys (Esc)" style="display:flex;align-items:center;gap:3px;padding:4px 8px;border-radius:9999px;border:none;background:rgba(255,255,255,0.08);color:#a1a1aa;cursor:pointer;font-size:11px;font-weight:600;transition:all 0.15s ease;">
      ${SVG_ICONS.exit}
      <span>Exit</span>
    </button>
  `

  // Attach button click events
  const modeButtons = toolbarElement.querySelectorAll<HTMLButtonElement>("[data-mode]")
  modeButtons.forEach((btn) => {
    btn.onclick = (e) => {
      e.stopPropagation()
      const selected = btn.getAttribute("data-mode") as ZapperMode
      if (selected) {
        setMode(selected)
      }
    }
  })

  // Attach sub-move (Flow vs Free) click events
  const subMoveButtons = toolbarElement.querySelectorAll<HTMLButtonElement>("[data-sub-move]")
  subMoveButtons.forEach((btn) => {
    btn.onclick = (e) => {
      e.stopPropagation()
      const chosen = btn.getAttribute("data-sub-move") as ElementMoveType
      if (chosen) {
        setMoveType(chosen)
      }
    }
  })

  const undoBtn = toolbarElement.querySelector<HTMLButtonElement>("#__et_undo__")
  if (undoBtn) {
    undoBtn.onclick = (e) => {
      e.stopPropagation()
      undoLastAction()
    }
  }

  const settingsBtn = toolbarElement.querySelector<HTMLButtonElement>("#__et_settings__")
  if (settingsBtn) {
    settingsBtn.onclick = (e) => {
      e.stopPropagation()
      openSettingsView()
    }
  }

  const exitBtn = toolbarElement.querySelector<HTMLButtonElement>("#__et_exit__")
  if (exitBtn) {
    exitBtn.onclick = (e) => {
      e.stopPropagation()
      stopZapping(false)
    }
  }
}

/**
 * Updates move sub-type (Flow vs Free) and saves to extension settings.
 */
async function setMoveType(type: ElementMoveType): Promise<void> {
  currentConfig.moveType = type
  renderToolbarContents()
  updateHighlight(currentHoveredElement, true)

  try {
    const settings = await extensionStorage.get<FeatureSettings>(STORAGE_KEYS.SETTINGS)
    if (settings) {
      await extensionStorage.set(STORAGE_KEYS.SETTINGS, {
        ...settings,
        elementZapperConfig: {
          ...(settings.elementZapperConfig || currentConfig),
          moveType: type
        }
      })
    }
  } catch {
    // Ignore storage errors
  }
}

/**
 * Styling for the embedded Flow / Free mini pill buttons.
 */
function getSubMoveBtnStyle(isBtnActive: boolean): string {
  if (isBtnActive) {
    return `
      border: none;
      background: #ffffff;
      color: #065f46;
      font-size: 10.5px;
      font-weight: 700;
      padding: 1.5px 6px;
      border-radius: 9999px;
      cursor: pointer;
      box-shadow: 0 1px 3px rgba(0,0,0,0.3);
      transition: all 0.12s ease;
    `
  }
  return `
    border: none;
    background: transparent;
    color: rgba(255,255,255,0.75);
    font-size: 10.5px;
    font-weight: 500;
    padding: 1.5px 5px;
    border-radius: 9999px;
    cursor: pointer;
    transition: all 0.12s ease;
  `
}

/**
 * Opens extension popup and navigates to Element Toys settings.
 */
async function openSettingsView(): Promise<void> {
  stopZapping(false)
  await sendToBackground(MESSAGE_TYPES.OPEN_POPUP, { view: "element-zapper-settings" })
}

/**
 * Generates inline style for mode toggle buttons.
 */
function getModeButtonStyle(mode: ZapperMode): string {
  const isSelected = currentMode === mode
  const color = MODE_COLORS[mode]
  if (isSelected) {
    return `
      display: flex;
      align-items: center;
      gap: 4.5px;
      padding: 4px 10px;
      border-radius: 9999px;
      border: 1px solid ${color.border};
      background: ${color.border};
      color: #ffffff;
      cursor: pointer;
      font-size: 11.5px;
      font-weight: 600;
      box-shadow: 0 2px 8px ${color.border}66;
      transition: all 0.15s ease;
    `
  }
  return `
    display: flex;
    align-items: center;
    gap: 4.5px;
    padding: 4px 8px;
    border-radius: 9999px;
    border: 1px solid transparent;
    background: transparent;
    color: #a1a1aa;
    cursor: pointer;
    font-size: 11.5px;
    font-weight: 500;
    transition: all 0.15s ease;
  `
}

/**
 * Generates inline style for action buttons.
 */
function getActionButtonStyle(disabled: boolean): string {
  if (disabled) {
    return `
      display: flex;
      align-items: center;
      gap: 4px;
      padding: 4px 8px;
      border-radius: 9999px;
      border: none;
      background: transparent;
      color: #52525b;
      cursor: not-allowed;
      font-size: 11.5px;
      font-weight: 500;
      opacity: 0.5;
    `
  }
  return `
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 4px 8px;
    border-radius: 9999px;
    border: 1px solid rgba(255, 255, 255, 0.12);
    background: rgba(255, 255, 255, 0.08);
    color: #e4e4e7;
    cursor: pointer;
    font-size: 11.5px;
    font-weight: 500;
    transition: all 0.15s ease;
  `
}

/**
 * Switches active tool mode.
 */
function setMode(mode: ZapperMode): void {
  if (editingElement) {
    commitTextEdit(true)
  }

  currentMode = mode
  document.documentElement.style.cursor = getCursorForMode(mode)
  renderToolbarContents()
  updateHighlight(currentHoveredElement, true)
}

/**
 * Builds readable descriptor for an element (e.g. "div#cookie-banner.modal").
 */
function getElementDescriptor(el: HTMLElement): string {
  const tagName = el.tagName.toLowerCase()
  const idStr = el.id ? `#${el.id.slice(0, 18)}` : ""
  let classStr = ""
  if (typeof el.className === "string" && el.className.trim()) {
    const firstClass = el.className.trim().split(/\s+/)[0]
    if (firstClass && !firstClass.startsWith("__browse_assist")) {
      classStr = `.${firstClass.slice(0, 18)}`
    }
  }
  return `${tagName}${idStr}${classStr}`
}

/**
 * Checks if target belongs to extension internal UI.
 */
function isInternalElement(target: HTMLElement | null): boolean {
  if (!target) return false
  return (
    target.id === ZAPPER_CONTAINER_ID ||
    target.id === TOOLBAR_ID ||
    !!target.closest(`#${ZAPPER_CONTAINER_ID}`) ||
    !!target.closest(`[data-browse-assist-internal]`)
  )
}

/**
 * Expands target element scope to parent (+ / = key).
 */
function expandScope(): void {
  if (!currentHoveredElement || editingElement) return
  const parent = currentHoveredElement.parentElement
  if (
    parent &&
    parent !== document.body &&
    parent !== document.documentElement &&
    !isInternalElement(parent)
  ) {
    if (scopeDepth === 0) {
      scopeBaseElement = currentHoveredElement
    }
    scopeDepth++
    currentHoveredElement = parent
    updateHighlight(currentHoveredElement, true)

    if (currentConfig.showToast) {
      showContentToast({
        message: `Scope: <${getElementDescriptor(parent)}>`,
        detail: `Level +${scopeDepth} (Press - to shrink)`,
        type: "info",
        duration: 1100
      })
    }
  }
}

/**
 * Contracts target element scope back towards original child (- key).
 */
function shrinkScope(): void {
  if (!currentHoveredElement || editingElement) return
  if (scopeDepth > 1 && currentHoveredElement.firstElementChild) {
    scopeDepth--
    let child = currentHoveredElement.firstElementChild as HTMLElement | null
    if (scopeBaseElement) {
      const matchingChild = Array.from(currentHoveredElement.children).find((c) =>
        c.contains(scopeBaseElement!)
      ) as HTMLElement | undefined
      if (matchingChild) child = matchingChild
    }
    if (child) {
      currentHoveredElement = child
      updateHighlight(currentHoveredElement, true)
    }
  } else if (scopeDepth === 1 && scopeBaseElement) {
    scopeDepth = 0
    currentHoveredElement = scopeBaseElement
    updateHighlight(currentHoveredElement, true)
  }
}

/**
 * Updates the highlight box position and badge to tightly wrap target.
 */
function updateHighlight(target: HTMLElement | null, _force = false): void {
  if (!highlightBox || !tagBadge || !overlayContainer) return

  if (
    !target ||
    target === document.body ||
    target === document.documentElement ||
    isInternalElement(target) ||
    isDragging ||
    editingElement === target
  ) {
    highlightBox.style.display = "none"
    currentHoveredElement = null
    return
  }

  currentHoveredElement = target
  const rect = target.getBoundingClientRect()
  const theme = MODE_COLORS[currentMode]

  highlightBox.style.display = "block"
  highlightBox.style.top = `${rect.top}px`
  highlightBox.style.left = `${rect.left}px`
  highlightBox.style.width = `${Math.max(rect.width, 10)}px`
  highlightBox.style.height = `${Math.max(rect.height, 10)}px`
  highlightBox.style.border = `2px ${currentMode === "edit" ? "solid" : "dashed"} ${theme.border}`
  highlightBox.style.backgroundColor = theme.bg
  highlightBox.style.boxShadow = `0 0 0 1px rgba(0, 0, 0, 0.3), inset 0 0 12px ${theme.border}33`

  if (rect.top < 32) {
    tagBadge.style.top = "auto"
    tagBadge.style.bottom = "-28px"
  } else {
    tagBadge.style.top = "-28px"
    tagBadge.style.bottom = "auto"
  }

  tagBadge.style.color = theme.primary
  tagBadge.style.border = `1px solid ${theme.border}88`

  const parts: string[] = []
  if (currentConfig.showTagDescriptor) {
    const scopeBadge = scopeDepth > 0 ? ` [Scope +${scopeDepth}]` : ""
    parts.push(`<${getElementDescriptor(target)}>${scopeBadge}`)
  }
  if (currentConfig.showDimensions) {
    parts.push(`${Math.round(rect.width)} × ${Math.round(rect.height)}px`)
  }

  let actionHint = "Click to zap"
  if (currentMode === "edit") {
    actionHint = "Click to edit text"
  } else if (currentMode === "move") {
    const typeLabel = currentConfig.moveType === "relative" ? "Flow Reorder" : "Free Move"
    actionHint = `Drag for ${typeLabel} (Press +/- scope)`
  } else if (currentMode === "hide") {
    actionHint = "Click to hide"
  }

  const prefix = parts.length > 0 ? `${parts.join(" • ")} — ` : ""
  tagBadge.textContent = `${prefix}${actionHint}`
}

/**
 * Checks and unfreezes body/html scroll lock.
 */
function unfreezeScrollLock(): void {
  try {
    const targets = [document.body, document.documentElement]
    let unfrozen = false

    targets.forEach((el) => {
      if (!el) return
      const style = window.getComputedStyle(el)
      if (style.overflow === "hidden" || style.overflowY === "hidden") {
        el.style.setProperty("overflow", "auto", "important")
        el.style.setProperty("overflow-y", "auto", "important")
        unfrozen = true
      }
      if (style.position === "fixed") {
        el.style.setProperty("position", "static", "important")
        unfrozen = true
      }
    })

    if (unfrozen && currentConfig.showToast) {
      showContentToast({
        message: "Page Scroll Unfrozen",
        detail: "overflow: auto restored",
        type: "info",
        duration: 2000
      })
    }
  } catch {
    // Ignore style error
  }
}

/**
 * Reverts the most recent action in the undo stack.
 */
function undoLastAction(): void {
  if (undoStack.length === 0) return

  const action = undoStack.pop()
  if (!action) return

  try {
    switch (action.type) {
      case "zap": {
        if (action.parent) {
          action.parent.insertBefore(action.element, action.nextSibling || null)
        } else {
          document.body.appendChild(action.element)
        }
        break
      }
      case "hide": {
        action.element.style.visibility = action.oldVisibility || ""
        action.element.style.display = action.oldDisplay || ""
        break
      }
      case "edit": {
        if (action.oldText !== undefined) {
          action.element.innerHTML = action.oldText
        }
        break
      }
      case "move": {
        if (action.moveType === "relative") {
          if (action.oldParent) {
            action.oldParent.insertBefore(action.element, action.oldNextSibling || null)
          }
        } else {
          action.element.style.transform = action.oldTransform || ""
        }
        break
      }
    }

    if (currentConfig.showToast) {
      showContentToast({
        message: "Action Undone",
        detail: `Reverted ${action.type}`,
        type: "info",
        duration: 1800
      })
    }
  } catch {
    // Ignore revert errors
  }

  renderToolbarContents()
  updateHighlight(currentHoveredElement, true)
}

/**
 * Finalizes inline text editing and tears down key capturing listeners.
 */
function commitTextEdit(saveChanges = true): void {
  if (!editingElement) return

  const el = editingElement
  const original = editingOriginalHTML

  editingCleanups.forEach((cleanup) => cleanup())
  editingCleanups = []

  el.contentEditable = "false"
  el.style.removeProperty("outline")
  el.style.removeProperty("outline-offset")

  if (saveChanges && el.innerHTML !== original) {
    undoStack.push({
      type: "edit",
      element: el,
      oldText: original,
      newText: el.innerHTML
    })

    if (currentConfig.showToast) {
      showContentToast({
        message: "Text Updated",
        type: "success",
        duration: 1800
      })
    }
  } else if (!saveChanges) {
    el.innerHTML = original
  }

  editingElement = null
  editingOriginalHTML = ""
  renderToolbarContents()

  if (!currentConfig.continuousMode) {
    stopZapping(true)
  }
}

/**
 * Pointer move listener across window during session.
 */
function onPointerMove(e: PointerEvent): void {
  if (!isSessionActive) return

  // Handle Drag & Drop Move
  if (isDragging && dragTarget) {
    if (currentConfig.moveType === "relative") {
      // Cross-container relative layout flow reordering:
      if (highlightBox) highlightBox.style.display = "none"
      const hovered = document.elementFromPoint(e.clientX, e.clientY) as HTMLElement | null
      if (highlightBox) highlightBox.style.display = "block"

      if (
        hovered &&
        hovered !== dragTarget &&
        !dragTarget.contains(hovered) &&
        !isInternalElement(hovered) &&
        hovered !== document.body &&
        hovered !== document.documentElement
      ) {
        const rect = hovered.getBoundingClientRect()
        const isAfter =
          e.clientY > rect.top + rect.height / 2 || e.clientX > rect.left + rect.width / 2

        if (isAfter) {
          if (hovered.nextSibling !== dragTarget) {
            hovered.after(dragTarget)
          }
        } else {
          if (hovered.previousSibling !== dragTarget) {
            hovered.before(dragTarget)
          }
        }
      }

      if (highlightBox) {
        const rect = dragTarget.getBoundingClientRect()
        highlightBox.style.top = `${rect.top}px`
        highlightBox.style.left = `${rect.left}px`
        highlightBox.style.width = `${rect.width}px`
        highlightBox.style.height = `${rect.height}px`
      }
    } else {
      // Absolute freeform translate3d
      const dx = e.clientX - dragStartX
      const dy = e.clientY - dragStartY
      const newX = dragInitialTranslateX + dx
      const newY = dragInitialTranslateY + dy
      dragTarget.style.transform = `translate3d(${newX}px, ${newY}px, 0px)`

      if (highlightBox) {
        const rect = dragTarget.getBoundingClientRect()
        highlightBox.style.top = `${rect.top}px`
        highlightBox.style.left = `${rect.left}px`
      }
    }
    return
  }

  // Normal hover inspect
  const target = document.elementFromPoint(e.clientX, e.clientY) as HTMLElement | null
  if (target) {
    if (scopeDepth > 0 && currentHoveredElement && currentHoveredElement.contains(target)) {
      // Mouse is still within the expanded scope container, keep current scope!
      return
    }
    scopeDepth = 0
    scopeBaseElement = target
  }
  updateHighlight(target)
}

/**
 * Extracts current 2D translate values from transform string.
 */
function parseTranslate3d(el: HTMLElement): { x: number; y: number } {
  const transform = el.style.transform || window.getComputedStyle(el).transform
  if (!transform || transform === "none") {
    return { x: 0, y: 0 }
  }
  const match = transform.match(/matrix\((.+)\)/)
  if (match) {
    const values = match[1].split(",").map((v) => parseFloat(v.trim()))
    return { x: values[4] || 0, y: values[5] || 0 }
  }
  const translateMatch = transform.match(/translate(?:3d)?\(([-0-9.]+)px,\s*([-0-9.]+)px/)
  if (translateMatch) {
    return {
      x: parseFloat(translateMatch[1]) || 0,
      y: parseFloat(translateMatch[2]) || 0
    }
  }
  return { x: 0, y: 0 }
}

/**
 * Handles pointerdown for initiating drag in Move mode.
 */
function onPointerDownCapture(e: PointerEvent): void {
  if (!isSessionActive) return

  const target = e.target as HTMLElement | null
  if (isInternalElement(target)) return

  if (currentMode === "move" && currentHoveredElement) {
    e.preventDefault()
    e.stopPropagation()

    isDragging = true
    dragTarget = currentHoveredElement
    dragStartX = e.clientX
    dragStartY = e.clientY

    dragInitialParent = dragTarget.parentElement
    dragInitialNextSibling = dragTarget.nextSibling
    dragInitialTransform = dragTarget.style.transform || ""

    const { x, y } = parseTranslate3d(dragTarget)
    dragInitialTranslateX = x
    dragInitialTranslateY = y

    dragTarget.style.willChange = "transform"
    document.documentElement.style.cursor = "grabbing"
  }
}

/**
 * Handles pointerup to conclude drag in Move mode.
 */
function onPointerUpCapture(e: PointerEvent): void {
  if (!isSessionActive || !isDragging || !dragTarget) return

  e.preventDefault()
  e.stopPropagation()

  isDragging = false
  const target = dragTarget

  if (currentConfig.moveType === "relative") {
    const currentParent = target.parentElement
    const currentNextSibling = target.nextSibling

    if (
      currentParent !== dragInitialParent ||
      currentNextSibling !== dragInitialNextSibling
    ) {
      undoStack.push({
        type: "move",
        element: target,
        moveType: "relative",
        oldParent: dragInitialParent,
        oldNextSibling: dragInitialNextSibling,
        newParent: currentParent,
        newNextSibling: currentNextSibling
      })
      renderToolbarContents()
    }
  } else {
    const newTransform = target.style.transform || ""
    if (newTransform !== dragInitialTransform) {
      undoStack.push({
        type: "move",
        element: target,
        moveType: "absolute",
        oldTransform: dragInitialTransform,
        newTransform
      })
      renderToolbarContents()
    }
  }

  dragTarget = null
  document.documentElement.style.cursor = getCursorForMode(currentMode)

  if (!currentConfig.continuousMode) {
    stopZapping(true)
  }
}

/**
 * Primary click capture handler executing selected mode action.
 */
function onClickCapture(e: MouseEvent): void {
  if (!isSessionActive) return

  const rawTarget = e.target as HTMLElement | null
  if (isInternalElement(rawTarget)) return

  e.preventDefault()
  e.stopPropagation()
  e.stopImmediatePropagation()

  const target = currentHoveredElement
  if (!target || target === document.body || target === document.documentElement) {
    return
  }

  const desc = getElementDescriptor(target)
  const isPotentialModal =
    window.getComputedStyle(target).position === "fixed" ||
    window.getComputedStyle(target).position === "absolute"

  // 1. ZAP MODE
  if (currentMode === "zap") {
    const parent = target.parentElement
    const nextSibling = target.nextSibling

    undoStack.push({
      type: "zap",
      element: target,
      parent,
      nextSibling
    })

    try {
      target.remove()
    } catch {
      target.style.display = "none"
    }

    if (currentConfig.autoUnfreezeScroll && isPotentialModal) {
      unfreezeScrollLock()
    }

    if (currentConfig.showToast) {
      showContentToast({
        message: "Element Zapped!",
        detail: `<${desc}>`,
        type: "success",
        iconSvg: SVG_ICONS.zap,
        duration: 2000
      })
    }

    renderToolbarContents()
    updateHighlight(null)

    if (!currentConfig.continuousMode) {
      stopZapping(true)
    }
    return
  }

  // 2. HIDE MODE
  if (currentMode === "hide") {
    const oldVisibility = target.style.visibility
    const oldDisplay = target.style.display

    undoStack.push({
      type: "hide",
      element: target,
      oldVisibility,
      oldDisplay
    })

    target.style.setProperty("visibility", "hidden", "important")

    if (currentConfig.autoUnfreezeScroll && isPotentialModal) {
      unfreezeScrollLock()
    }

    if (currentConfig.showToast) {
      showContentToast({
        message: "Element Hidden",
        detail: `<${desc}>`,
        type: "info",
        duration: 1800
      })
    }

    renderToolbarContents()
    updateHighlight(null)

    if (!currentConfig.continuousMode) {
      stopZapping(true)
    }
    return
  }

  // 3. EDIT TEXT MODE (With complete keystroke isolation)
  if (currentMode === "edit") {
    if (editingElement) {
      commitTextEdit(true)
    }

    editingElement = target
    editingOriginalHTML = target.innerHTML

    target.contentEditable = "true"
    target.style.outline = "2px solid #0ea5e9"
    target.style.outlineOffset = "2px"
    target.focus()

    if (highlightBox) {
      highlightBox.style.display = "none"
    }

    const onEditKeyDown = (keyEv: KeyboardEvent) => {
      keyEv.stopPropagation()
      keyEv.stopImmediatePropagation()

      if (keyEv.key === "Enter" && !keyEv.shiftKey) {
        keyEv.preventDefault()
        commitTextEdit(true)
      } else if (keyEv.key === "Escape") {
        keyEv.preventDefault()
        commitTextEdit(false)
      }
    }

    const isolateKeyEvent = (ev: Event) => {
      ev.stopPropagation()
      ev.stopImmediatePropagation()
    }

    const onBlur = () => {
      commitTextEdit(true)
    }

    target.addEventListener("keydown", onEditKeyDown, { capture: true })
    target.addEventListener("keyup", isolateKeyEvent, { capture: true })
    target.addEventListener("keypress", isolateKeyEvent, { capture: true })
    target.addEventListener("blur", onBlur)

    editingCleanups = [
      () => target.removeEventListener("keydown", onEditKeyDown, { capture: true }),
      () => target.removeEventListener("keyup", isolateKeyEvent, { capture: true }),
      () => target.removeEventListener("keypress", isolateKeyEvent, { capture: true }),
      () => target.removeEventListener("blur", onBlur)
    ]
  }
}

/**
 * Handles keyboard shortcuts:
 * - Scope adjustment: = / + (expand) and - (shrink)
 * - Undo: Ctrl+Z / Cmd+Z
 * - Exit: Escape
 */
function onKeyDown(e: KeyboardEvent): void {
  if (!isSessionActive) return

  // If user is currently editing text, capture and isolate ALL keystrokes from host webpage
  if (editingElement) {
    e.stopPropagation()
    e.stopImmediatePropagation()

    if (e.key === "Escape") {
      e.preventDefault()
      commitTextEdit(false)
    } else if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      commitTextEdit(true)
    }
    return
  }

  // Scope Adjustment (+/- or =/-) when not editing text
  if (e.key === "=" || e.key === "+" || e.code === "Equal") {
    e.preventDefault()
    e.stopPropagation()
    expandScope()
    return
  }

  if (e.key === "-" || e.key === "_" || e.code === "Minus") {
    e.preventDefault()
    e.stopPropagation()
    shrinkScope()
    return
  }

  // Revert / Undo on Ctrl+Z or Cmd+Z
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "z" && !e.shiftKey) {
    e.preventDefault()
    e.stopPropagation()
    undoLastAction()
    return
  }

  // Escape to exit session
  if (e.key === "Escape") {
    e.preventDefault()
    e.stopPropagation()

    stopZapping(false)
    if (currentConfig.showToast) {
      showContentToast({
        message: "Element Toys Closed",
        type: "info",
        duration: 1500
      })
    }
  }
}

/**
 * Handles right-click cancel.
 */
function onContextMenu(e: MouseEvent): void {
  if (!isSessionActive) return
  const rawTarget = e.target as HTMLElement | null
  if (isInternalElement(rawTarget)) return

  e.preventDefault()
  e.stopPropagation()

  if (editingElement) {
    commitTextEdit(false)
  } else {
    stopZapping(false)
  }
}

/**
 * Starts the Element Toys interactive session.
 */
export function startZapping(): void {
  if (!isActive || isSessionActive) return
  isSessionActive = true
  currentMode = currentConfig.defaultMode || "zap"
  scopeDepth = 0
  scopeBaseElement = null

  ensureOverlay()
  if (overlayContainer) {
    overlayContainer.style.display = "block"
  }

  renderToolbarContents()

  window.addEventListener("pointermove", onPointerMove, {
    capture: true,
    passive: true
  })
  window.addEventListener("pointerdown", onPointerDownCapture, { capture: true })
  window.addEventListener("pointerup", onPointerUpCapture, { capture: true })
  window.addEventListener("click", onClickCapture, { capture: true })
  window.addEventListener("keydown", onKeyDown, { capture: true })
  window.addEventListener("contextmenu", onContextMenu, { capture: true })

  document.documentElement.style.cursor = getCursorForMode(currentMode)

  if (currentConfig.showToast) {
    showContentToast({
      message: "Element Toys Active",
      detail: "Select tools from top toolbar • Esc to exit",
      type: "info",
      iconSvg: SVG_ICONS.logo,
      duration: 2500
    })
  }
}

/**
 * Stops the Element Toys session and restores page interaction.
 */
export function stopZapping(_zapped = false): void {
  if (!isSessionActive) return
  isSessionActive = false

  if (editingElement) {
    commitTextEdit(false)
  }

  isDragging = false
  dragTarget = null
  scopeDepth = 0
  scopeBaseElement = null

  window.removeEventListener("pointermove", onPointerMove, { capture: true })
  window.removeEventListener("pointerdown", onPointerDownCapture, { capture: true })
  window.removeEventListener("pointerup", onPointerUpCapture, { capture: true })
  window.removeEventListener("click", onClickCapture, { capture: true })
  window.removeEventListener("keydown", onKeyDown, { capture: true })
  window.removeEventListener("contextmenu", onContextMenu, { capture: true })

  document.documentElement.style.cursor = ""

  if (highlightBox) {
    highlightBox.style.display = "none"
  }
  if (overlayContainer) {
    overlayContainer.style.display = "none"
  }
  currentHoveredElement = null
}

/**
 * Activates Element Toys feature listeners and updates configuration.
 */
export function activate(config?: ElementZapperConfig): void {
  if (config) {
    currentConfig = { ...DEFAULT_ELEMENT_ZAPPER_CONFIG, ...config }
    if (isSessionActive) {
      renderToolbarContents()
      updateHighlight(currentHoveredElement, true)
    }
  }
  isActive = true
}

/**
 * Deactivates Element Toys and cleans up all DOM nodes.
 */
export function deactivate(): void {
  isActive = false
  stopZapping(false)

  if (overlayContainer && overlayContainer.parentNode) {
    overlayContainer.parentNode.removeChild(overlayContainer)
    overlayContainer = null
    highlightBox = null
    tagBadge = null
    toolbarElement = null
  }
}
