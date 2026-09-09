import type { UndoAction } from "./types"

export class UndoManager {
  private stack: UndoAction[] = []

  public push(action: UndoAction): void {
    this.stack.push(action)
  }

  public get count(): number {
    return this.stack.length
  }

  public clear(): void {
    this.stack = []
  }

  /**
   * Reverts the most recent action from the stack.
   * Returns the reverted action or null if stack was empty.
   */
  public undo(): UndoAction | null {
    const action = this.stack.pop()
    if (!action) return null

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
    } catch {
      // Ignore revert DOM exceptions
    }

    return action
  }
}
