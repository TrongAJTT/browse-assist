/**
 * Element Toys - Content Script Orchestrator
 * Adheres to SOLID, KISS, and DRY:
 * - Single Responsibility: Coordinates lifecycle, DOM events, and delegates
 *   specific tasks to dedicated action handlers, views, and managers.
 * - Modular design:
 *   - constants.ts: SVG icons, styles, themes
 *   - domUtils.ts: Element descriptors, internal target filters
 *   - undoManager.ts: Undo history stack and rollbacks
 *   - scopeManager.ts: Parent/child scope level navigation
 *   - overlay.ts: Highlighting and container rendering
 *   - toolbar.ts: Floating HUD toolbar presentation
 *   - actions/: zap, hide, edit, move implementations
 */

import { executeHide } from "./actions/hide"
import { MoveController } from "./actions/move"
import { TextEditor } from "./actions/edit"
import { executeZap } from "./actions/zap"
import { SVG_ICONS } from "./constants"
import { getElementDescriptor, isInternalElement } from "./domUtils"
import { OverlayView } from "./overlay"
import { ScopeManager } from "./scopeManager"
import { ToolbarView } from "./toolbar"
import { UndoManager } from "./undoManager"
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

// Feature state
let isActive = false
let isSessionActive = false
let currentConfig: ElementZapperConfig = DEFAULT_ELEMENT_ZAPPER_CONFIG
let currentMode: ZapperMode = "zap"
let currentHoveredElement: HTMLElement | null = null

// Subsystem instances
const undoManager = new UndoManager()
const scopeManager = new ScopeManager()
const textEditor = new TextEditor()
const moveController = new MoveController()
const overlayView = new OverlayView()
const toolbarView = new ToolbarView()

function getCursorForMode(mode: ZapperMode): string {
  switch (mode) {
    case "zap":
      return "crosshair"
    case "edit":
      return "text"
    case "move":
      return moveController.isDragging ? "grabbing" : "grab"
    case "hide":
      return "cell"
    default:
      return "crosshair"
  }
}

function updateHighlight(target: HTMLElement | null): void {
  overlayView.updateHighlight(
    target,
    currentMode,
    currentConfig,
    scopeManager.depth,
    moveController.isDragging,
    textEditor.element
  )
}

function renderToolbar(): void {
  toolbarView.render(
    currentMode,
    currentConfig.moveType,
    undoManager.count,
    {
      onModeChange: (mode) => setMode(mode),
      onSubMoveChange: (type) => setMoveType(type),
      onUndo: () => undoLastAction(),
      onSettings: () => openSettingsView(),
      onExit: () => stopZapping(false)
    }
  )
}

function setMode(mode: ZapperMode): void {
  if (textEditor.isEditing) {
    textEditor.commit(undoManager, true, currentConfig.showToast)
  }

  currentMode = mode
  document.documentElement.style.cursor = getCursorForMode(mode)
  renderToolbar()
  updateHighlight(currentHoveredElement)
}

async function setMoveType(type: ElementMoveType): Promise<void> {
  currentConfig.moveType = type
  renderToolbar()
  updateHighlight(currentHoveredElement)

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

function undoLastAction(): void {
  const action = undoManager.undo()
  if (!action) return

  if (currentConfig.showToast) {
    showContentToast({
      message: "Action Undone",
      detail: `Reverted ${action.type}`,
      type: "info",
      duration: 1800
    })
  }

  renderToolbar()
  updateHighlight(currentHoveredElement)
}

async function openSettingsView(): Promise<void> {
  stopZapping(false)
  await sendToBackground(MESSAGE_TYPES.OPEN_POPUP, { view: "element-zapper-settings" })
}

function onPointerMove(e: PointerEvent): void {
  if (!isSessionActive) return

  if (moveController.isDragging && moveController.target) {
    const rect = moveController.onMove(
      e.clientX,
      e.clientY,
      currentConfig.moveType,
      () => overlayView.hideHighlight(),
      () => overlayView.showHighlight()
    )
    if (rect) {
      overlayView.updateRect(rect)
    }
    return
  }

  // Normal hover inspect
  const target = document.elementFromPoint(e.clientX, e.clientY) as HTMLElement | null
  if (target) {
    if (
      scopeManager.depth > 0 &&
      currentHoveredElement &&
      currentHoveredElement.contains(target)
    ) {
      // Mouse is still within the expanded scope container, keep current scope
      return
    }
    scopeManager.reset()
  }
  currentHoveredElement = target
  updateHighlight(target)
}

function onPointerDownCapture(e: PointerEvent): void {
  if (!isSessionActive) return

  const target = e.target as HTMLElement | null
  if (isInternalElement(target)) return

  if (currentMode === "move" && currentHoveredElement) {
    e.preventDefault()
    e.stopPropagation()

    moveController.startDrag(currentHoveredElement, e.clientX, e.clientY)
  }
}

function onPointerUpCapture(e: PointerEvent): void {
  if (!isSessionActive || !moveController.isDragging || !moveController.target) return

  e.preventDefault()
  e.stopPropagation()

  moveController.endDrag(currentConfig.moveType, undoManager)
  renderToolbar()

  document.documentElement.style.cursor = getCursorForMode(currentMode)

  if (!currentConfig.continuousMode) {
    stopZapping(true)
  }
}

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

  switch (currentMode) {
    case "zap": {
      executeZap(target, currentConfig, undoManager)
      renderToolbar()
      updateHighlight(null)
      if (!currentConfig.continuousMode) stopZapping(true)
      break
    }
    case "hide": {
      executeHide(target, currentConfig, undoManager)
      renderToolbar()
      updateHighlight(null)
      if (!currentConfig.continuousMode) stopZapping(true)
      break
    }
    case "edit": {
      textEditor.start(
        target,
        undoManager,
        () => {
          renderToolbar()
          if (!currentConfig.continuousMode) stopZapping(true)
        },
        currentConfig.showToast
      )
      overlayView.hideHighlight()
      break
    }
  }
}

function onKeyDown(e: KeyboardEvent): void {
  if (!isSessionActive) return

  // Do not intercept if actively typing in text editor
  if (textEditor.isEditing) return

  // Scope: expand with = / +
  if (e.key === "=" || e.key === "+" || e.code === "Equal") {
    e.preventDefault()
    e.stopPropagation()

    if (currentHoveredElement) {
      const parent = scopeManager.expand(currentHoveredElement)
      if (parent) {
        currentHoveredElement = parent
        updateHighlight(parent)

        if (currentConfig.showToast) {
          showContentToast({
            message: `Scope: <${getElementDescriptor(parent)}>`,
            detail: `Level +${scopeManager.depth} (Press - to shrink)`,
            type: "info",
            duration: 1100
          })
        }
      }
    }
    return
  }

  // Scope: shrink with - / _
  if (e.key === "-" || e.key === "_" || e.code === "Minus") {
    e.preventDefault()
    e.stopPropagation()

    if (currentHoveredElement) {
      const child = scopeManager.shrink(currentHoveredElement)
      if (child) {
        currentHoveredElement = child
        updateHighlight(child)
      }
    }
    return
  }

  // Undo: Ctrl+Z / Cmd+Z
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "z" && !e.shiftKey) {
    e.preventDefault()
    e.stopPropagation()
    undoLastAction()
    return
  }

  // Exit: Esc
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

function onContextMenu(e: MouseEvent): void {
  if (!isSessionActive) return
  const rawTarget = e.target as HTMLElement | null
  if (isInternalElement(rawTarget)) return

  e.preventDefault()
  e.stopPropagation()

  if (textEditor.isEditing) {
    textEditor.commit(undoManager, false, currentConfig.showToast)
    renderToolbar()
  } else {
    stopZapping(false)
  }
}

export function startZapping(): void {
  if (!isActive || isSessionActive) return
  isSessionActive = true
  currentMode = currentConfig.defaultMode || "zap"
  scopeManager.reset()

  overlayView.mount(toolbarView.domElement)
  overlayView.setVisible(true)
  renderToolbar()

  window.addEventListener("pointermove", onPointerMove, { capture: true, passive: true })
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

export function stopZapping(_zapped = false): void {
  if (!isSessionActive) return
  isSessionActive = false

  if (textEditor.isEditing) {
    textEditor.commit(undoManager, false, currentConfig.showToast)
  }

  moveController.endDrag(currentConfig.moveType, undoManager)
  scopeManager.reset()

  window.removeEventListener("pointermove", onPointerMove, { capture: true })
  window.removeEventListener("pointerdown", onPointerDownCapture, { capture: true })
  window.removeEventListener("pointerup", onPointerUpCapture, { capture: true })
  window.removeEventListener("click", onClickCapture, { capture: true })
  window.removeEventListener("keydown", onKeyDown, { capture: true })
  window.removeEventListener("contextmenu", onContextMenu, { capture: true })

  document.documentElement.style.cursor = ""
  overlayView.hideHighlight()
  overlayView.setVisible(false)
  currentHoveredElement = null
}

export function activate(config?: ElementZapperConfig): void {
  if (config) {
    currentConfig = { ...DEFAULT_ELEMENT_ZAPPER_CONFIG, ...config }
    if (isSessionActive) {
      renderToolbar()
      updateHighlight(currentHoveredElement)
    }
  }
  isActive = true
}

export function deactivate(): void {
  isActive = false
  stopZapping(false)
  overlayView.destroy()
}
