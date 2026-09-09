import type { ElementMoveType, ZapperMode } from "~core/types"

export type ResizeHandle = "n" | "s" | "e" | "w" | "ne" | "nw" | "se" | "sw"

export interface FlowDropTarget {
  container: HTMLElement
  referenceNode: Node | null
  placement: "before" | "after"
  dividerRect: { top: number; left: number; width: number; height: number; isVertical: boolean }
}

export interface UndoAction {
  type: ZapperMode | "resize"
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
  // Resize undo
  oldWidth?: string
  oldHeight?: string
  newWidth?: string
  newHeight?: string
}
