/**
 * Element Toys - Content Script Orchestrator
 * Adheres to SOLID, KISS, and DRY:
 * - Single Responsibility: Coordinates lifecycle, DOM events, and delegates
 *   specific tasks to dedicated action handlers, views, and managers.
 * - Features:
 *   - Move Flow: Debounced divider preview (horizontal / vertical), commits on mouseup.
 *   - Move Resize: Interactive corner handles allowing direct element resizing with undo.
 */

import { executeHide } from "./actions/hide"
import { MoveController } from "./actions/move"
import { ResizeController } from "./actions/resize"
import { TextEditor } from "./actions/edit"
import { executeZap } from "./actions/zap"
import { SVG_ICONS } from "./constants"
import { getElementDescriptor, isInternalElement } from "./domUtils"
import { OverlayView } from "./overlay"
import { ScopeManager } from "./scopeManager"
import { ToolbarView } from "./toolbar"
import type { ResizeHandle } from "./types"
import { UndoManager } from "./undoManager"
import { MESSAGE_TYPES, sendToBackground } from "~core/messaging"
import { extensionStorage } from "~core/storage"
import { showContentToast } from "~core/toast"
import {
  DEFAULT_ELEMENT_TOYS_CONFIG,
  STORAGE_KEYS,
  type ElementMoveType,
  type ElementToysConfig,
  type FeatureSettings,
  type ElementToysMode
} from "~core/types"

// Feature state
let isActive = false
let isSessionActive = false
let currentConfig: ElementToysConfig = DEFAULT_ELEMENT_TOYS_CONFIG
let currentMode: ElementToysMode = "zap"
let currentHoveredElement: HTMLElement | null = null

// Subsystem instances
const undoManager = new UndoManager()
const scopeManager = new ScopeManager()
const textEditor = new TextEditor()
const moveController = new MoveController()
const resizeController = new ResizeController()
const overlayView = new OverlayView()
const toolbarView = new ToolbarView()

function getCursorForMode(mode: ElementToysMode): string {
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
    resizeController.isResizing,
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

function setMode(mode: ElementToysMode): void {
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
      const nextConfig = {
        ...(settings.elementToysConfig || settings.elementZapperConfig || currentConfig),
        moveType: type
      }
      await extensionStorage.set(STORAGE_KEYS.SETTINGS, {
        ...settings,
        elementToysConfig: nextConfig,
        elementZapperConfig: nextConfig
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
  await sendToBackground(MESSAGE_TYPES.OPEN_POPUP, { view: "element-toys-settings" })
}

function onPointerMove(e: PointerEvent): void {
  if (!isSessionActive) return

  // 1. Resizing in progress
  if (resizeController.isResizing) {
    const rect = resizeController.onResize(e.clientX, e.clientY)
    if (rect) {
      overlayView.updateRect(rect)
    }
    return
  }

  // 2. Dragging in progress
  if (moveController.isDragging && moveController.target) {
    const rect = moveController.onMove(
      e.clientX,
      e.clientY,
      currentConfig.moveType,
      () => overlayView.hideHighlight(),
      () => overlayView.showHighlight()
    )

    if (currentConfig.moveType === "relative") {
      overlayView.showFlowDivider(moveController.dropTarget)
    }

    if (rect) {
      overlayView.updateRect(rect)
    }
    return
  }

  // 3. Normal hover inspect
  // In Move mode, if cursor is near a corner resize handle, lock currentHoveredElement so it won't switch to parent/outside
  if (currentMode === "move" && currentHoveredElement && overlayView.isNearHandle(e.clientX, e.clientY)) {
    return
  }

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

  // Start dragging move target
  if (currentMode === "move" && currentHoveredElement && !resizeController.isResizing) {
    e.preventDefault()
    e.stopPropagation()

    moveController.startDrag(currentHoveredElement, e.clientX, e.clientY)
  }
}

function onPointerUpCapture(e: PointerEvent): void {
  if (!isSessionActive) return

  // End resize
  if (resizeController.isResizing) {
    e.preventDefault()
    e.stopPropagation()

    resizeController.endResize(undoManager, currentConfig.showToast)
    renderToolbar()
    document.documentElement.style.cursor = getCursorForMode(currentMode)
    updateHighlight(currentHoveredElement)
    return
  }

  // End drag move
  if (moveController.isDragging && moveController.target) {
    e.preventDefault()
    e.stopPropagation()

    overlayView.showFlowDivider(null)
    moveController.endDrag(currentConfig.moveType, undoManager)
    renderToolbar()

    document.documentElement.style.cursor = getCursorForMode(currentMode)
    updateHighlight(currentHoveredElement)

    if (!currentConfig.continuousMode) {
      stopZapping(true)
    }
  }
}

function onClickCapture(e: MouseEvent): void {
  if (!isSessionActive) return

  const rawTarget = e.target as HTMLElement | null
  if (isInternalElement(rawTarget)) return

  // Do not execute action clicks if we just finished resizing or dragging
  if (resizeController.isResizing || moveController.isDragging) return

  if (currentMode === "move") {
    // In move mode, clicking is reserved for drag & resize
    return
  }

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

function handleResizeStart(handle: ResizeHandle, e: PointerEvent): void {
  if (!currentHoveredElement) return
  resizeController.startResize(currentHoveredElement, handle, e.clientX, e.clientY)
}

export function startZapping(): void {
  if (!isActive || isSessionActive) return
  isSessionActive = true
  currentMode = currentConfig.defaultMode || "zap"
  scopeManager.reset()

  overlayView.mount(toolbarView.domElement, handleResizeStart)
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
  resizeController.endResize(undoManager, false)
  overlayView.showFlowDivider(null)
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

export function activate(config?: ElementToysConfig): void {
  if (config) {
    currentConfig = { ...DEFAULT_ELEMENT_TOYS_CONFIG, ...config }
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
