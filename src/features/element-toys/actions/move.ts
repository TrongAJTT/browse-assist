import { isInternalElement } from "../domUtils"
import type { FlowDropTarget } from "../types"
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

  // Flow preview drop target (calculated with debounce/throttle during drag)
  private pendingDropTarget: FlowDropTarget | null = null
  private lastComputeTime = 0
  private readonly THROTTLE_MS = 25

  public get isDragging(): boolean {
    return this._isDragging
  }

  public get target(): HTMLElement | null {
    return this.dragTarget
  }

  public get dropTarget(): FlowDropTarget | null {
    return this.pendingDropTarget
  }

  public startDrag(target: HTMLElement, clientX: number, clientY: number): void {
    this._isDragging = true
    this.dragTarget = target
    this.startX = clientX
    this.startY = clientY
    this.pendingDropTarget = null
    this.lastComputeTime = 0

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
   * Performs drag move operation.
   * In Flow mode: Does NOT mutate DOM during drag! Instead calculates pendingDropTarget and divider preview.
   * In Free mode: Updates translate3d in real-time.
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
      const now = performance.now()
      if (now - this.lastComputeTime >= this.THROTTLE_MS) {
        this.lastComputeTime = now

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
          const isWider = rect.width > rect.height * 1.5
          const isTaller = rect.height > rect.width * 1.5

          let isVertical = false
          let isAfter = false

          if (isWider) {
            // Predominantly horizontal block -> split horizontally (top vs bottom)
            isVertical = false
            isAfter = clientY > rect.top + rect.height / 2
          } else if (isTaller) {
            // Predominantly vertical block -> split vertically (left vs right)
            isVertical = true
            isAfter = clientX > rect.left + rect.width / 2
          } else {
            // Check nearest edge
            const distTop = Math.abs(clientY - rect.top)
            const distBottom = Math.abs(clientY - rect.bottom)
            const distLeft = Math.abs(clientX - rect.left)
            const distRight = Math.abs(clientX - rect.right)
            const minDist = Math.min(distTop, distBottom, distLeft, distRight)

            if (minDist === distLeft || minDist === distRight) {
              isVertical = true
              isAfter = minDist === distRight
            } else {
              isVertical = false
              isAfter = minDist === distBottom
            }
          }

          let dividerTop = 0
          let dividerLeft = 0
          let dividerWidth = 0
          let dividerHeight = 0

          if (isVertical) {
            dividerTop = rect.top
            dividerHeight = rect.height
            dividerWidth = 4
            dividerLeft = isAfter ? rect.right - 2 : rect.left - 2
          } else {
            dividerLeft = rect.left
            dividerWidth = rect.width
            dividerHeight = 4
            dividerTop = isAfter ? rect.bottom - 2 : rect.top - 2
          }

          const container = hovered.parentElement || document.body
          this.pendingDropTarget = {
            container,
            referenceNode: hovered,
            placement: isAfter ? "after" : "before",
            dividerRect: {
              top: dividerTop,
              left: dividerLeft,
              width: dividerWidth,
              height: dividerHeight,
              isVertical
            }
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
   * Concludes drag operation.
   * If in Flow mode: Commits the pending drop placement into DOM only on mouse release!
   */
  public endDrag(moveType: ElementMoveType, undoManager: UndoManager): void {
    if (!this._isDragging || !this.dragTarget) return

    this._isDragging = false
    const target = this.dragTarget

    if (moveType === "relative") {
      if (this.pendingDropTarget && this.pendingDropTarget.referenceNode) {
        const ref = this.pendingDropTarget.referenceNode as HTMLElement

        // Apply DOM mutation on drop
        if (this.pendingDropTarget.placement === "after") {
          if (ref.nextSibling !== target) {
            ref.after(target)
          }
        } else {
          if (ref.previousSibling !== target) {
            ref.before(target)
          }
        }

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
      }

      this.pendingDropTarget = null
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
