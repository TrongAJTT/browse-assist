/**
 * Shared visual repositioning controller for in-page Floating Action Buttons (FABs).
 * Displays a subtle Shadow DOM perimeter guide and live-snaps the FAB along
 * allowed edges as the pointer moves, committing once to storage on click/release.
 */

import { t } from "~core/i18n"
import { showContentToast } from "~core/toast"
import type { EdgePlacement, ScreenEdge } from "~core/types"

import { computeEdgePlacementFromPoint, type RectBounds } from "./placementMath"

export interface FabRepositionOptions {
  initialPlacement: EdgePlacement
  allowedEdges: readonly ScreenEdge[]
  getBounds: () => RectBounds
  onPreview: (placement: EdgePlacement) => void
  onCommit: (placement: EdgePlacement) => void | Promise<void>
  onEnd?: () => void
  /** Mouse button whose release commits placement: 0 (left click, default) or 2 (right-button hold-drag). */
  commitButton?: 0 | 2
  /** Optional custom hint text shown in the top pill. */
  hintText?: string
}

const REPOSITION_HOST_ID = "__browse_assist_fab_reposition_overlay__"

let activeHost: HTMLDivElement | null = null
let activeCancel: (() => void) | null = null

export function isFabRepositioning(): boolean {
  return activeHost !== null
}

export function cancelFabReposition(): void {
  if (activeCancel) {
    activeCancel()
  }
}

export function startFabReposition(options: FabRepositionOptions): void {
  if (typeof document === "undefined" || !document.documentElement) return

  // Cancel any existing reposition session first
  if (activeCancel) {
    activeCancel()
  }

  let latestPlacement: EdgePlacement = { ...options.initialPlacement }
  let isFinished = false

  const host = document.createElement("div")
  host.id = REPOSITION_HOST_ID
  host.setAttribute("data-browse-assist-internal", "true")

  const shadow = host.attachShadow({ mode: "open" })
  const bounds = options.getBounds()

  const style = document.createElement("style")
  style.textContent = `
    :host {
      all: initial;
      position: fixed;
      inset: 0;
      z-index: 2147483646;
      pointer-events: auto;
      cursor: move;
    }

    .reposition-backdrop {
      position: fixed;
      inset: 0;
      background: rgba(15, 23, 42, 0.14);
      cursor: move;
    }

    .reposition-frame {
      position: fixed;
      left: ${bounds.left}px;
      top: ${bounds.top}px;
      width: ${bounds.width}px;
      height: ${bounds.height}px;
      box-sizing: border-box;
      border: 2px dashed rgba(99, 102, 241, 0.85);
      border-radius: 10px;
      background: rgba(99, 102, 241, 0.04);
      pointer-events: none;
    }

    .reposition-hint {
      position: fixed;
      top: 16px;
      left: 50%;
      transform: translateX(-50%);
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 7px 14px;
      border-radius: 9999px;
      background: rgba(15, 23, 42, 0.92);
      border: 1px solid rgba(129, 140, 248, 0.45);
      color: #f8fafc;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      font-size: 12px;
      font-weight: 600;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.35);
      pointer-events: none;
      white-space: nowrap;
    }

    .reposition-dot {
      width: 8px;
      height: 8px;
      border-radius: 9999px;
      background: #818cf8;
      box-shadow: 0 0 8px rgba(129, 140, 248, 0.9);
    }
  `

  const backdrop = document.createElement("div")
  backdrop.className = "reposition-backdrop"

  const frame = document.createElement("div")
  frame.className = "reposition-frame"

  const hint = document.createElement("div")
  hint.className = "reposition-hint"
  const dot = document.createElement("span")
  dot.className = "reposition-dot"
  const hintText = document.createElement("span")
  hintText.textContent = options.hintText ?? t("content.fabMenu.dragHint")
  hint.appendChild(dot)
  hint.appendChild(hintText)

  shadow.appendChild(style)
  shadow.appendChild(backdrop)
  shadow.appendChild(frame)
  shadow.appendChild(hint)
  document.documentElement.appendChild(host)

  const cleanup = () => {
    window.removeEventListener("pointermove", handlePointerMove, {
      capture: true
    })
    window.removeEventListener("pointerup", handleCommitPointer, {
      capture: true
    })
    window.removeEventListener("keydown", handleKeyDown, { capture: true })
    window.removeEventListener("contextmenu", handleContextMenu, {
      capture: true
    })
    if (host.parentNode) {
      host.parentNode.removeChild(host)
    }
    if (activeHost === host) {
      activeHost = null
      activeCancel = null
    }
    options.onEnd?.()
  }

  const updateFromPointer = (clientX: number, clientY: number) => {
    const liveBounds = options.getBounds()
    frame.style.left = `${liveBounds.left}px`
    frame.style.top = `${liveBounds.top}px`
    frame.style.width = `${liveBounds.width}px`
    frame.style.height = `${liveBounds.height}px`

    latestPlacement = computeEdgePlacementFromPoint(
      { x: clientX, y: clientY },
      liveBounds,
      options.allowedEdges
    )
    options.onPreview(latestPlacement)
  }

  const handlePointerMove = (e: PointerEvent) => {
    if (isFinished) return
    updateFromPointer(e.clientX, e.clientY)
  }

  const commitButton = options.commitButton ?? 0

  const handleCommitPointer = (e: PointerEvent) => {
    if (isFinished) return
    if (e.button !== commitButton) return
    e.preventDefault()
    e.stopPropagation()
    updateFromPointer(e.clientX, e.clientY)
    isFinished = true
    cleanup()
    void options.onCommit(latestPlacement)
    showContentToast({
      message: t("content.fabMenu.positionSaved"),
      type: "success",
      duration: 1400
    })
  }

  const cancel = () => {
    if (isFinished) return
    isFinished = true
    options.onPreview(options.initialPlacement)
    cleanup()
  }

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      e.preventDefault()
      e.stopPropagation()
      cancel()
    }
  }

  const handleContextMenu = (e: MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    // Only right-click cancels when in left-click reposition mode;
    // in right-button hold-drag mode (commitButton === 2), suppress the browser menu without cancelling.
    if (commitButton === 0) {
      cancel()
    }
  }

  activeHost = host
  activeCancel = cancel

  window.addEventListener("pointermove", handlePointerMove, { capture: true })
  window.addEventListener("pointerup", handleCommitPointer, { capture: true })
  window.addEventListener("keydown", handleKeyDown, { capture: true })
  window.addEventListener("contextmenu", handleContextMenu, { capture: true })
}
