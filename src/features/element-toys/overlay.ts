import { MODE_COLORS, ELEMENT_TOYS_CONTAINER_ID } from "./constants"
import { getElementDescriptor, isInternalElement } from "./domUtils"
import type { FlowDropTarget, ResizeHandle } from "./types"
import type { ElementToysConfig, ElementToysMode } from "~core/types"

export class OverlayView {
  private container: HTMLDivElement | null = null
  private highlightBox: HTMLDivElement | null = null
  private tagBadge: HTMLDivElement | null = null
  private flowDivider: HTMLDivElement | null = null
  private resizeHandles: Map<ResizeHandle, HTMLDivElement> = new Map()

  public get isMounted(): boolean {
    return (
      this.container !== null && document.documentElement.contains(this.container)
    )
  }

  public mount(
    toolbarEl: HTMLDivElement,
    onResizeStart?: (handle: ResizeHandle, e: PointerEvent) => void
  ): void {
    if (this.container && document.documentElement.contains(this.container)) {
      if (!this.container.contains(toolbarEl)) {
        this.container.appendChild(toolbarEl)
      }
      return
    }

    if (this.container && this.container.parentNode) {
      this.container.parentNode.removeChild(this.container)
    }

    this.container = document.createElement("div")
    this.container.id = ELEMENT_TOYS_CONTAINER_ID
    this.container.setAttribute("data-browse-assist-internal", "true")
    this.container.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      pointer-events: none;
      z-index: 2147483647;
      display: none;
    `

    // Flow divider line for previewing reorder insertion point
    this.flowDivider = document.createElement("div")
    this.flowDivider.setAttribute("data-browse-assist-internal", "true")
    this.flowDivider.style.cssText = `
      position: fixed;
      pointer-events: none;
      background: #10b981;
      box-shadow: 0 0 10px #10b981, 0 0 2px #ffffff;
      border-radius: 9999px;
      z-index: 2147483647;
      transition: all 0.05s ease-out;
      display: none;
    `
    this.container.appendChild(this.flowDivider)

    // Highlight Box
    if (!this.highlightBox) {
      this.highlightBox = document.createElement("div")
      this.highlightBox.setAttribute("data-browse-assist-internal", "true")
      this.highlightBox.style.cssText = `
        position: fixed;
        pointer-events: none;
        box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.3);
        border-radius: 4px;
        transition: top 0.04s ease-out, left 0.04s ease-out, width 0.04s ease-out, height 0.04s ease-out;
        box-sizing: border-box;
        display: none;
      `

      // Badge
      this.tagBadge = document.createElement("div")
      this.tagBadge.setAttribute("data-browse-assist-internal", "true")
      this.tagBadge.style.cssText = `
        position: absolute;
        top: -26px;
        left: 0;
        background: #18181b;
        font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
        font-size: 11px;
        font-weight: 600;
        padding: 3px 8px;
        border-radius: 5px;
        white-space: nowrap;
        pointer-events: none;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.6);
        display: flex;
        align-items: center;
        gap: 5px;
      `
      this.highlightBox.appendChild(this.tagBadge)

      // 4 corner handles for Move mode resize
      const handles: ResizeHandle[] = ["nw", "ne", "se", "sw"]
      this.resizeHandles.clear()

      handles.forEach((h) => {
        const handleEl = document.createElement("div")
        handleEl.setAttribute("data-browse-assist-internal", "true")
        handleEl.setAttribute("data-resize-handle", h)

        let topStyle = ""
        let leftStyle = ""
        let cursorStyle = ""

        // Generous 28x28px touch target centered on corner (-14px offset)
        switch (h) {
          case "nw":
            topStyle = "-14px"
            leftStyle = "-14px"
            cursorStyle = "nwse-resize"
            break
          case "ne":
            topStyle = "-14px"
            leftStyle = "calc(100% - 14px)"
            cursorStyle = "nesw-resize"
            break
          case "se":
            topStyle = "calc(100% - 14px)"
            leftStyle = "calc(100% - 14px)"
            cursorStyle = "nwse-resize"
            break
          case "sw":
            topStyle = "calc(100% - 14px)"
            leftStyle = "-14px"
            cursorStyle = "nesw-resize"
            break
        }

        handleEl.style.cssText = `
          position: absolute;
          top: ${topStyle};
          left: ${leftStyle};
          width: 28px;
          height: 28px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: ${cursorStyle};
          pointer-events: auto;
          display: none;
          z-index: 100;
        `

        // Visible inner dot (12px circular handle with clean white border)
        const dot = document.createElement("div")
        dot.setAttribute("data-browse-assist-internal", "true")
        dot.style.cssText = `
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: #10b981;
          border: 2px solid #ffffff;
          box-shadow: 0 2px 8px rgba(0,0,0,0.6);
          pointer-events: none;
          transition: transform 0.12s ease;
        `
        handleEl.appendChild(dot)

        handleEl.addEventListener("mouseenter", () => {
          dot.style.transform = "scale(1.25)"
        })
        handleEl.addEventListener("mouseleave", () => {
          dot.style.transform = "scale(1)"
        })

        if (onResizeStart) {
          handleEl.addEventListener("pointerdown", (e) => {
            e.preventDefault()
            e.stopPropagation()
            e.stopImmediatePropagation()
            onResizeStart(h, e)
          })
        }

        this.highlightBox?.appendChild(handleEl)
        this.resizeHandles.set(h, handleEl)
      })
    }

    this.container.appendChild(this.highlightBox)
    this.container.appendChild(toolbarEl)
    document.documentElement.appendChild(this.container)
  }

  public setVisible(visible: boolean): void {
    if (this.container) {
      this.container.style.display = visible ? "block" : "none"
    }
  }

  public hideHighlight(): void {
    if (this.highlightBox) {
      this.highlightBox.style.display = "none"
    }
  }

  public showHighlight(): void {
    if (this.highlightBox) {
      this.highlightBox.style.display = "block"
    }
  }

  public updateRect(rect: DOMRect): void {
    if (this.highlightBox) {
      this.highlightBox.style.top = `${rect.top}px`
      this.highlightBox.style.left = `${rect.left}px`
      this.highlightBox.style.width = `${rect.width}px`
      this.highlightBox.style.height = `${rect.height}px`
    }
  }

  public showFlowDivider(target: FlowDropTarget | null): void {
    if (!this.flowDivider) return

    if (!target) {
      this.flowDivider.style.display = "none"
      return
    }

    const { top, left, width, height } = target.dividerRect
    this.flowDivider.style.display = "block"
    this.flowDivider.style.top = `${top}px`
    this.flowDivider.style.left = `${left}px`
    this.flowDivider.style.width = `${Math.max(width, 4)}px`
    this.flowDivider.style.height = `${Math.max(height, 4)}px`
  }

  /**
   * Checks if pointer coordinates are within the vicinity of any corner resize handle (within 24px radius)
   */
  public isNearHandle(clientX: number, clientY: number): boolean {
    if (!this.highlightBox || this.highlightBox.style.display === "none") return false

    for (const [, handleEl] of this.resizeHandles) {
      if (handleEl.style.display === "none") continue
      const rect = handleEl.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2
      const dist = Math.hypot(clientX - centerX, clientY - centerY)
      if (dist <= 24) {
        return true
      }
    }
    return false
  }

  public updateHighlight(
    target: HTMLElement | null,
    mode: ElementToysMode,
    config: ElementToysConfig,
    scopeDepth: number,
    isDragging: boolean,
    isResizing: boolean,
    editingElement: HTMLElement | null
  ): void {
    if (!this.highlightBox || !this.tagBadge || !this.container) return

    if (
      !target ||
      target === document.body ||
      target === document.documentElement ||
      isInternalElement(target) ||
      isDragging ||
      isResizing ||
      editingElement === target
    ) {
      this.highlightBox.style.display = "none"
      this.resizeHandles.forEach((h) => (h.style.display = "none"))
      return
    }

    const rect = target.getBoundingClientRect()
    const theme = MODE_COLORS[mode]

    this.highlightBox.style.display = "block"
    this.highlightBox.style.top = `${rect.top}px`
    this.highlightBox.style.left = `${rect.left}px`
    this.highlightBox.style.width = `${Math.max(rect.width, 10)}px`
    this.highlightBox.style.height = `${Math.max(rect.height, 10)}px`
    this.highlightBox.style.border = `2px ${mode === "edit" ? "solid" : "dashed"} ${theme.border}`
    this.highlightBox.style.backgroundColor = theme.bg
    this.highlightBox.style.boxShadow = `0 0 0 1px rgba(0, 0, 0, 0.3), inset 0 0 12px ${theme.border}33`

    // Show resize corner handles only in move mode
    const showHandles = mode === "move"
    this.resizeHandles.forEach((handleEl) => {
      handleEl.style.display = showHandles ? "flex" : "none"
      const dot = handleEl.firstElementChild as HTMLElement | null
      if (dot) dot.style.background = theme.primary
    })

    if (rect.top < 32) {
      this.tagBadge.style.top = "auto"
      this.tagBadge.style.bottom = "-28px"
    } else {
      this.tagBadge.style.top = "-28px"
      this.tagBadge.style.bottom = "auto"
    }

    this.tagBadge.style.color = theme.primary
    this.tagBadge.style.border = `1px solid ${theme.border}88`

    const parts: string[] = []
    if (config.showTagDescriptor) {
      const scopeBadge = scopeDepth > 0 ? ` [Scope +${scopeDepth}]` : ""
      parts.push(`<${getElementDescriptor(target)}>${scopeBadge}`)
    }
    if (config.showDimensions) {
      parts.push(`${Math.round(rect.width)} × ${Math.round(rect.height)}px`)
    }

    let actionHint = "Click to zap"
    if (mode === "edit") {
      actionHint = "Click to edit text"
    } else if (mode === "move") {
      const typeLabel = config.moveType === "relative" ? "Flow Reorder" : "Free Move"
      actionHint = `Drag body for ${typeLabel} • Drag corners to resize`
    } else if (mode === "hide") {
      actionHint = "Click to hide"
    }

    const prefix = parts.length > 0 ? `${parts.join(" • ")} — ` : ""
    this.tagBadge.textContent = `${prefix}${actionHint}`
  }

  public destroy(): void {
    if (this.container && this.container.parentNode) {
      this.container.parentNode.removeChild(this.container)
    }
    this.container = null
    this.highlightBox = null
    this.tagBadge = null
    this.flowDivider = null
    this.resizeHandles.clear()
  }
}
