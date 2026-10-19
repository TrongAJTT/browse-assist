import type { UndoManager } from "../undoManager"
import { showContentToast } from "~core/toast"

export class TextEditor {
  private activeElement: HTMLElement | null = null
  private originalHTML = ""
  private cleanups: Array<() => void> = []

  public get isEditing(): boolean {
    return this.activeElement !== null
  }

  public get element(): HTMLElement | null {
    return this.activeElement
  }

  /**
   * Starts inline editing on the target element with isolated keystrokes.
   */
  public start(
    target: HTMLElement,
    undoManager: UndoManager,
    onComplete: () => void,
    showToast: boolean
  ): void {
    if (this.activeElement) {
      this.commit(undoManager, true, showToast)
    }

    this.activeElement = target
    this.originalHTML = target.innerHTML

    target.contentEditable = "true"
    target.style.outline = "2px solid #0ea5e9"
    target.style.outlineOffset = "2px"
    target.focus()

    const onEditKeyDown = (keyEv: KeyboardEvent) => {
      keyEv.stopPropagation()
      keyEv.stopImmediatePropagation()

      if (keyEv.key === "Enter" && !keyEv.shiftKey) {
        keyEv.preventDefault()
        this.commit(undoManager, true, showToast)
        onComplete()
      } else if (keyEv.key === "Escape") {
        keyEv.preventDefault()
        this.commit(undoManager, false, showToast)
        onComplete()
      }
    }

    const isolateKeyEvent = (ev: Event) => {
      ev.stopPropagation()
      ev.stopImmediatePropagation()
    }

    const onBlur = () => {
      this.commit(undoManager, true, showToast)
      onComplete()
    }

    target.addEventListener("keydown", onEditKeyDown, { capture: true })
    target.addEventListener("keyup", isolateKeyEvent, { capture: true })
    target.addEventListener("keypress", isolateKeyEvent, { capture: true })
    target.addEventListener("blur", onBlur)

    this.cleanups = [
      () => target.removeEventListener("keydown", onEditKeyDown, { capture: true }),
      () => target.removeEventListener("keyup", isolateKeyEvent, { capture: true }),
      () => target.removeEventListener("keypress", isolateKeyEvent, { capture: true }),
      () => target.removeEventListener("blur", onBlur)
    ]
  }

  /**
   * Finalizes editing session, restoring or committing changes to undo stack.
   */
  public commit(undoManager: UndoManager, saveChanges = true, showToast = true): void {
    if (!this.activeElement) return

    const el = this.activeElement
    const original = this.originalHTML

    this.cleanups.forEach((cleanup) => cleanup())
    this.cleanups = []

    el.contentEditable = "false"
    el.style.removeProperty("outline")
    el.style.removeProperty("outline-offset")

    if (saveChanges && el.innerHTML !== original) {
      undoManager.push({
        type: "edit",
        element: el,
        oldText: original,
        newText: el.innerHTML
      })

      if (showToast) {
        showContentToast({
          message: "Text Updated",
          type: "success",
          duration: 1800
        })
      }
    } else if (!saveChanges) {
      el.innerHTML = original
    }

    this.activeElement = null
    this.originalHTML = ""
  }
}
