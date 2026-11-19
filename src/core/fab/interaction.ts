/**
 * Unified right-click interaction binder for Floating Action Buttons (FABs).
 * Cross-platform (Windows / Linux / macOS):
 * - Quick right-click (release before hold threshold & < 6px movement): opens FAB Context Menu.
 * - Right-button hold (> 220ms) or right-button drag (>= 6px): enters quick reposition mode
 *   immediately and commits placement on right-button release (Esc cancels).
 */

import { t } from "~core/i18n"
import type { EdgePlacement, ScreenEdge } from "~core/types"

import { openFabContextMenu, type FabMenuItem } from "./contextMenu"
import type { RectBounds } from "./placementMath"
import { startFabReposition } from "./reposition"

const QUICK_MOVE_HOLD_MS = 220
const QUICK_MOVE_DRAG_THRESHOLD_PX = 6

export interface FabRightClickOptions {
  allowedEdges: readonly ScreenEdge[]
  getInitialPlacement: () => EdgePlacement
  getBounds: () => RectBounds | null
  getTheme?: () => "dark" | "light"
  onPreview: (placement: EdgePlacement) => void
  onCommit: (placement: EdgePlacement) => void | Promise<void>
  onInteractionStart?: () => void
  onInteractionEnd?: () => void
  getMenuItems: (helpers: { startMove: () => void }) => FabMenuItem[]
}

export function bindFabRightClick(
  element: HTMLElement,
  options: FabRightClickOptions
): () => void {
  const handleContextMenu = (e: MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    e.stopImmediatePropagation()
  }

  const handlePointerDown = (downEvent: PointerEvent) => {
    if (downEvent.button !== 2) return

    const initialBounds = options.getBounds()
    if (!initialBounds) return

    downEvent.preventDefault()
    downEvent.stopPropagation()
    options.onInteractionStart?.()

    const startX = downEvent.clientX
    const startY = downEvent.clientY
    const initialPlacement = options.getInitialPlacement()

    let hasEnteredQuickMove = false
    let holdTimer: ReturnType<typeof setTimeout> | null = null

    const clearPendingListeners = () => {
      if (holdTimer !== null) {
        clearTimeout(holdTimer)
        holdTimer = null
      }
      window.removeEventListener("pointermove", handlePendingMove, {
        capture: true
      })
      window.removeEventListener("pointerup", handlePendingUp, {
        capture: true
      })
      window.removeEventListener("pointercancel", handlePendingCancel, {
        capture: true
      })
    }

    const enterQuickMove = () => {
      if (hasEnteredQuickMove) return
      hasEnteredQuickMove = true
      clearPendingListeners()

      startFabReposition({
        initialPlacement,
        allowedEdges: options.allowedEdges,
        getBounds: () => options.getBounds() ?? initialBounds,
        onPreview: options.onPreview,
        onCommit: options.onCommit,
        onEnd: options.onInteractionEnd,
        commitButton: 2,
        hintText: t("content.fabMenu.quickDragHint")
      })
    }

    const handlePendingMove = (moveEvent: PointerEvent) => {
      const dist = Math.hypot(
        moveEvent.clientX - startX,
        moveEvent.clientY - startY
      )
      if (dist >= QUICK_MOVE_DRAG_THRESHOLD_PX) {
        enterQuickMove()
      }
    }

    const handlePendingUp = (upEvent: PointerEvent) => {
      if (upEvent.button !== 2) return
      clearPendingListeners()
      if (hasEnteredQuickMove) return

      upEvent.preventDefault()
      upEvent.stopPropagation()

      let startedMenuMove = false
      const startMenuMove = () => {
        startedMenuMove = true
        startFabReposition({
          initialPlacement: options.getInitialPlacement(),
          allowedEdges: options.allowedEdges,
          getBounds: () => options.getBounds() ?? initialBounds,
          onPreview: options.onPreview,
          onCommit: options.onCommit,
          onEnd: options.onInteractionEnd,
          commitButton: 0
        })
      }

      openFabContextMenu({
        x: upEvent.clientX,
        y: upEvent.clientY,
        theme: options.getTheme?.(),
        items: options.getMenuItems({ startMove: startMenuMove }),
        onClose: () => {
          if (!startedMenuMove) {
            options.onInteractionEnd?.()
          }
        }
      })
    }

    const handlePendingCancel = () => {
      clearPendingListeners()
      if (!hasEnteredQuickMove) {
        options.onInteractionEnd?.()
      }
    }

    holdTimer = setTimeout(enterQuickMove, QUICK_MOVE_HOLD_MS)

    window.addEventListener("pointermove", handlePendingMove, { capture: true })
    window.addEventListener("pointerup", handlePendingUp, { capture: true })
    window.addEventListener("pointercancel", handlePendingCancel, {
      capture: true
    })
  }

  element.addEventListener("contextmenu", handleContextMenu)
  element.addEventListener("pointerdown", handlePointerDown)

  return () => {
    element.removeEventListener("contextmenu", handleContextMenu)
    element.removeEventListener("pointerdown", handlePointerDown)
  }
}
