import type { ElementMoveType, ZapperMode } from "~core/types"

export interface UndoAction {
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
