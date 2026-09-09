import { MODE_COLORS, ZAPPER_CONTAINER_ID } from "./constants"
import { getElementDescriptor, isInternalElement } from "./domUtils"
import type { ElementZapperConfig, ZapperMode } from "~core/types"

export class OverlayView {
  private container: HTMLDivElement | null = null
  private highlightBox: HTMLDivElement | null = null
  private tagBadge: HTMLDivElement | null = null

  public get isMounted(): boolean {
    return (
      this.container !== null && document.documentElement.contains(this.container)
    )
  }

  public mount(toolbarEl: HTMLDivElement): void {
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
    this.container.id = ZAPPER_CONTAINER_ID
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

  public updateHighlight(
    target: HTMLElement | null,
    mode: ZapperMode,
    config: ElementZapperConfig,
    scopeDepth: number,
    isDragging: boolean,
    editingElement: HTMLElement | null
  ): void {
    if (!this.highlightBox || !this.tagBadge || !this.container) return

    if (
      !target ||
      target === document.body ||
      target === document.documentElement ||
      isInternalElement(target) ||
      isDragging ||
      editingElement === target
    ) {
      this.highlightBox.style.display = "none"
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
      actionHint = `Drag for ${typeLabel} (Press +/- scope)`
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
  }
}
