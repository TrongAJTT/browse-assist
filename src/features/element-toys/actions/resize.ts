import type { ResizeHandle } from "../types"
import type { UndoManager } from "../undoManager"
import { showContentToast } from "~core/toast"

export class ResizeController {
  private _isResizing = false
  private resizeTarget: HTMLElement | null = null
  private activeHandle: ResizeHandle | null = null
  private startX = 0
  private startY = 0
  private startWidth = 0
  private startHeight = 0
  private initialStyleWidth = ""
  private initialStyleHeight = ""

  public get isResizing(): boolean {
    return this._isResizing
  }

  public get target(): HTMLElement | null {
    return this.resizeTarget
  }

  public startResize(
    target: HTMLElement,
    handle: ResizeHandle,
    clientX: number,
    clientY: number
  ): void {
    this._isResizing = true
    this.resizeTarget = target
    this.activeHandle = handle
    this.startX = clientX
    this.startY = clientY

    const rect = target.getBoundingClientRect()
    this.startWidth = rect.width
    this.startHeight = rect.height

    this.initialStyleWidth = target.style.width || ""
    this.initialStyleHeight = target.style.height || ""

    document.documentElement.style.cursor = this.getCursorForHandle(handle)
  }

  public onResize(clientX: number, clientY: number): DOMRect | null {
    if (!this._isResizing || !this.resizeTarget || !this.activeHandle) return null

    const dx = clientX - this.startX
    const dy = clientY - this.startY

    let newWidth = this.startWidth
    let newHeight = this.startHeight

    if (this.activeHandle.includes("e")) {
      newWidth = Math.max(20, this.startWidth + dx)
    } else if (this.activeHandle.includes("w")) {
      newWidth = Math.max(20, this.startWidth - dx)
    }

    if (this.activeHandle.includes("s")) {
      newHeight = Math.max(20, this.startHeight + dy)
    } else if (this.activeHandle.includes("n")) {
      newHeight = Math.max(20, this.startHeight - dy)
    }

    this.resizeTarget.style.width = `${Math.round(newWidth)}px`
    this.resizeTarget.style.height = `${Math.round(newHeight)}px`

    return this.resizeTarget.getBoundingClientRect()
  }

  public endResize(undoManager: UndoManager, showToast = true): void {
    if (!this._isResizing || !this.resizeTarget) return

    this._isResizing = false
    const target = this.resizeTarget
    const newWidth = target.style.width
    const newHeight = target.style.height

    if (newWidth !== this.initialStyleWidth || newHeight !== this.initialStyleHeight) {
      undoManager.push({
        type: "resize",
        element: target,
        oldWidth: this.initialStyleWidth,
        oldHeight: this.initialStyleHeight,
        newWidth,
        newHeight
      })

      if (showToast) {
        showContentToast({
          message: "Element Resized",
          detail: `${newWidth} × ${newHeight}`,
          type: "success",
          duration: 1800
        })
      }
    }

    this.resizeTarget = null
    this.activeHandle = null
  }

  public getCursorForHandle(handle: ResizeHandle): string {
    switch (handle) {
      case "nw":
      case "se":
        return "nwse-resize"
      case "ne":
      case "sw":
        return "nesw-resize"
      case "n":
      case "s":
        return "ns-resize"
      case "e":
      case "w":
        return "ew-resize"
      default:
        return "pointer"
    }
  }
}
