import { isInternalElement } from "../domUtils"
import type { UndoManager } from "../undoManager"
import type { ElementMoveType } from "~core/types"

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

export class MoveController {
  private _isDragging = false
  private dragTarget: HTMLElement | null = null
  private startX = 0
  private startY = 0
  private initialTranslateX = 0
  private initialTranslateY = 0
  private initialTransform = ""
  private initialParent: HTMLElement | null = null
  private initialNextSibling: Node | null = null

  public get isDragging(): boolean {
    return this._isDragging
  }

  public get target(): HTMLElement | null {
    return this.dragTarget
  }

  public startDrag(target: HTMLElement, clientX: number, clientY: number): void {
    this._isDragging = true
    this.dragTarget = target
    this.startX = clientX
    this.startY = clientY

    this.initialParent = target.parentElement
    this.initialNextSibling = target.nextSibling
    this.initialTransform = target.style.transform || ""

    const { x, y } = parseTranslate3d(target)
    this.initialTranslateX = x
    this.initialTranslateY = y

    target.style.willChange = "transform"
    document.documentElement.style.cursor = "grabbing"
  }

  /**
   * Performs drag move operation. Returns the updated BoundingClientRect of the target.
   */
  public onMove(
    clientX: number,
    clientY: number,
    moveType: ElementMoveType,
    hideHighlightBox: () => void,
    showHighlightBox: () => void
  ): DOMRect | null {
    if (!this._isDragging || !this.dragTarget) return null

    if (moveType === "relative") {
      // Cross-container relative layout flow reordering:
      hideHighlightBox()
      const hovered = document.elementFromPoint(clientX, clientY) as HTMLElement | null
      showHighlightBox()

      if (
        hovered &&
        hovered !== this.dragTarget &&
        !this.dragTarget.contains(hovered) &&
        !isInternalElement(hovered) &&
        hovered !== document.body &&
        hovered !== document.documentElement
      ) {
        const rect = hovered.getBoundingClientRect()
        const isAfter =
          clientY > rect.top + rect.height / 2 || clientX > rect.left + rect.width / 2

        if (isAfter) {
          if (hovered.nextSibling !== this.dragTarget) {
            hovered.after(this.dragTarget)
          }
        } else {
          if (hovered.previousSibling !== this.dragTarget) {
            hovered.before(this.dragTarget)
          }
        }
      }

      return this.dragTarget.getBoundingClientRect()
    } else {
      // Absolute freeform translate3d
      const dx = clientX - this.startX
      const dy = clientY - this.startY
      const newX = this.initialTranslateX + dx
      const newY = this.initialTranslateY + dy
      this.dragTarget.style.transform = `translate3d(${newX}px, ${newY}px, 0px)`

      return this.dragTarget.getBoundingClientRect()
    }
  }

  /**
   * Concludes drag operation and records action into undoManager if modified.
   */
  public endDrag(moveType: ElementMoveType, undoManager: UndoManager): void {
    if (!this._isDragging || !this.dragTarget) return

    this._isDragging = false
    const target = this.dragTarget

    if (moveType === "relative") {
      const currentParent = target.parentElement
      const currentNextSibling = target.nextSibling

      if (
        currentParent !== this.initialParent ||
        currentNextSibling !== this.initialNextSibling
      ) {
        undoManager.push({
          type: "move",
          element: target,
          moveType: "relative",
          oldParent: this.initialParent,
          oldNextSibling: this.initialNextSibling,
          newParent: currentParent,
          newNextSibling: currentNextSibling
        })
      }
    } else {
      const newTransform = target.style.transform || ""
      if (newTransform !== this.initialTransform) {
        undoManager.push({
          type: "move",
          element: target,
          moveType: "absolute",
          oldTransform: this.initialTransform,
          newTransform
        })
      }
    }

    this.dragTarget = null
  }
}
