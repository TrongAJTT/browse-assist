import { escapeHtml } from "~core/escapeHtml"
import { t } from "~core/i18n"
import type { ElementMoveType, ElementToysMode } from "~core/types"

import { SVG_ICONS, MODE_COLORS, TOOLBAR_ID } from "./constants"

export interface ToolbarHandlers {
  onModeChange: (mode: ElementToysMode) => void
  onSubMoveChange: (type: ElementMoveType) => void
  onUndo: () => void
  onSettings: () => void
  onExit: () => void
}

function getModeButtonStyle(mode: ElementToysMode, isSelected: boolean): string {
  const color = MODE_COLORS[mode]
  if (isSelected) {
    return `
      display: flex;
      align-items: center;
      gap: 4.5px;
      padding: 4px 10px;
      border-radius: 9999px;
      border: 1px solid ${color.border};
      background: ${color.border};
      color: #ffffff;
      cursor: pointer;
      font-size: 11.5px;
      font-weight: 600;
      box-shadow: 0 2px 8px ${color.border}66;
      transition: all 0.15s ease;
    `
  }
  return `
    display: flex;
    align-items: center;
    gap: 4.5px;
    padding: 4px 8px;
    border-radius: 9999px;
    border: 1px solid transparent;
    background: transparent;
    color: #a1a1aa;
    cursor: pointer;
    font-size: 11.5px;
    font-weight: 500;
    transition: all 0.15s ease;
  `
}

function getSubMoveBtnStyle(isActive: boolean): string {
  if (isActive) {
    return `
      border: none;
      background: #ffffff;
      color: #065f46;
      font-size: 10.5px;
      font-weight: 700;
      padding: 1.5px 6px;
      border-radius: 9999px;
      cursor: pointer;
      box-shadow: 0 1px 3px rgba(0,0,0,0.3);
      transition: all 0.12s ease;
    `
  }
  return `
    border: none;
    background: transparent;
    color: rgba(255,255,255,0.75);
    font-size: 10.5px;
    font-weight: 500;
    padding: 1.5px 5px;
    border-radius: 9999px;
    cursor: pointer;
    transition: all 0.12s ease;
  `
}

function getActionButtonStyle(disabled: boolean): string {
  if (disabled) {
    return `
      display: flex;
      align-items: center;
      gap: 4px;
      padding: 4px 8px;
      border-radius: 9999px;
      border: none;
      background: transparent;
      color: #52525b;
      cursor: not-allowed;
      font-size: 11.5px;
      font-weight: 500;
      opacity: 0.5;
    `
  }
  return `
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 4px 8px;
    border-radius: 9999px;
    border: 1px solid rgba(255, 255, 255, 0.12);
    background: rgba(255, 255, 255, 0.08);
    color: #e4e4e7;
    cursor: pointer;
    font-size: 11.5px;
    font-weight: 500;
    transition: all 0.15s ease;
  `
}

export class ToolbarView {
  private element: HTMLDivElement | null = null

  public get domElement(): HTMLDivElement {
    if (!this.element) {
      this.element = document.createElement("div")
      this.element.id = TOOLBAR_ID
      this.element.setAttribute("data-browse-assist-internal", "true")
      this.element.style.cssText = `
        position: fixed;
        top: 14px;
        left: 50%;
        transform: translateX(-50%);
        pointer-events: auto;
        z-index: 2147483647;
        background: rgba(18, 18, 22, 0.94);
        backdrop-filter: blur(14px);
        -webkit-backdrop-filter: blur(14px);
        border: 1px solid rgba(255, 255, 255, 0.14);
        box-shadow: 0 12px 36px rgba(0, 0, 0, 0.55), 0 0 0 1px rgba(0, 0, 0, 0.4);
        border-radius: 9999px;
        padding: 4px 8px;
        display: flex;
        align-items: center;
        gap: 4px;
        user-select: none;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        font-size: 12px;
        color: #f4f4f5;
      `
    }
    return this.element
  }

  public render(
    currentMode: ElementToysMode,
    moveType: ElementMoveType,
    undoCount: number,
    handlers: ToolbarHandlers
  ): void {
    const el = this.domElement
    const isMoveActive = currentMode === "move"

    const flowLabel = t("features.elementToys.toolbar.flow")
    const freeLabel = t("features.elementToys.toolbar.free")
    const modeLabel = moveType === "relative" ? flowLabel : freeLabel

    el.innerHTML = `
      <div style="display:flex;align-items:center;gap:5px;padding:0 6px 0 4px;color:#fbbf24;font-weight:700;font-size:11.5px;letter-spacing:0.02em;">
        ${SVG_ICONS.logo}
        <span>${escapeHtml(t("features.elementToys.toolbar.title"))}</span>
      </div>
      <div style="width:1px;height:16px;background:rgba(255,255,255,0.15);margin:0 2px;"></div>
      
      <!-- Mode Buttons -->
      <div style="display:flex;align-items:center;gap:3px;" id="__et_modes__">
        <button type="button" data-mode="zap" title="${escapeHtml(t("features.elementToys.toolbar.zapTip"))}" style="${getModeButtonStyle("zap", currentMode === "zap")}">
          ${SVG_ICONS.zap}<span>${escapeHtml(t("features.elementToys.toolbar.zap"))}</span>
        </button>
        <button type="button" data-mode="edit" title="${escapeHtml(t("features.elementToys.toolbar.editTip"))}" style="${getModeButtonStyle("edit", currentMode === "edit")}">
          ${SVG_ICONS.edit}<span>${escapeHtml(t("features.elementToys.toolbar.edit"))}</span>
        </button>

        <!-- Move Button with embedded Flow / Free switcher -->
        ${
          isMoveActive
            ? `
          <div style="display:flex;align-items:center;background:#10b981;border-radius:9999px;padding:2px 3px;gap:3px;box-shadow:0 2px 8px #10b98166;">
            <button type="button" data-mode="move" title="${escapeHtml(t("features.elementToys.toolbar.moveActiveTip"))}" style="display:flex;align-items:center;gap:4px;border:none;background:transparent;color:#ffffff;font-size:11.5px;font-weight:700;cursor:pointer;padding:2px 4px;">
              ${SVG_ICONS.move}<span>${escapeHtml(t("features.elementToys.toolbar.move"))}</span>
            </button>
            <div style="display:flex;align-items:center;background:rgba(0,0,0,0.28);border-radius:9999px;padding:1px 2px;gap:2px;">
              <button type="button" data-sub-move="relative" title="${escapeHtml(t("features.elementToys.toolbar.flowTip"))}" style="${getSubMoveBtnStyle(moveType === "relative")}">${escapeHtml(flowLabel)}</button>
              <button type="button" data-sub-move="absolute" title="${escapeHtml(t("features.elementToys.toolbar.freeTip"))}" style="${getSubMoveBtnStyle(moveType === "absolute")}">${escapeHtml(freeLabel)}</button>
            </div>
          </div>
        `
            : `
          <button type="button" data-mode="move" title="${escapeHtml(t("features.elementToys.toolbar.moveTip"))}" style="${getModeButtonStyle("move", false)}">
            ${SVG_ICONS.move}<span>${escapeHtml(t("features.elementToys.toolbar.moveLabel", { mode: modeLabel }))}</span>
          </button>
        `
        }

        <button type="button" data-mode="hide" title="${escapeHtml(t("features.elementToys.toolbar.hideTip"))}" style="${getModeButtonStyle("hide", currentMode === "hide")}">
          ${SVG_ICONS.hide}<span>${escapeHtml(t("features.elementToys.toolbar.hide"))}</span>
        </button>
      </div>

      <div style="width:1px;height:16px;background:rgba(255,255,255,0.15);margin:0 2px;"></div>

      <!-- Undo Button -->
      <button type="button" id="__et_undo__" title="${escapeHtml(t("features.elementToys.toolbar.undoTip"))}" ${undoCount === 0 ? "disabled" : ""} style="${getActionButtonStyle(undoCount === 0)}">
        ${SVG_ICONS.undo}
        <span>${escapeHtml(t("features.elementToys.toolbar.undo"))}</span>
        ${undoCount > 0 ? `<span style="background:rgba(255,255,255,0.2);padding:1px 5px;border-radius:10px;font-size:10px;">${undoCount}</span>` : ""}
      </button>

      <!-- Settings Button -->
      <button type="button" id="__et_settings__" title="${escapeHtml(t("features.elementToys.toolbar.settingsTip"))}" style="display:flex;align-items:center;gap:3.5px;padding:4px 8px;border-radius:9999px;border:1px solid rgba(255,255,255,0.1);background:rgba(255,255,255,0.06);color:#e4e4e7;cursor:pointer;font-size:11.5px;font-weight:500;transition:all 0.15s ease;">
        ${SVG_ICONS.settings}
        <span>${escapeHtml(t("features.elementToys.toolbar.settings"))}</span>
      </button>

      <!-- Exit Button -->
      <button type="button" id="__et_exit__" title="${escapeHtml(t("features.elementToys.toolbar.exitTip"))}" style="display:flex;align-items:center;gap:3px;padding:4px 8px;border-radius:9999px;border:none;background:rgba(255,255,255,0.08);color:#a1a1aa;cursor:pointer;font-size:11px;font-weight:600;transition:all 0.15s ease;">
        ${SVG_ICONS.exit}
        <span>${escapeHtml(t("features.elementToys.toolbar.exit"))}</span>
      </button>
    `

    // Wire mode buttons
    el.querySelectorAll<HTMLButtonElement>("[data-mode]").forEach((btn) => {
      btn.onclick = (e) => {
        e.stopPropagation()
        const selected = btn.getAttribute("data-mode") as ElementToysMode
        if (selected) handlers.onModeChange(selected)
      }
    })

    // Wire sub-move buttons
    el.querySelectorAll<HTMLButtonElement>("[data-sub-move]").forEach((btn) => {
      btn.onclick = (e) => {
        e.stopPropagation()
        const chosen = btn.getAttribute("data-sub-move") as ElementMoveType
        if (chosen) handlers.onSubMoveChange(chosen)
      }
    })

    const undoBtn = el.querySelector<HTMLButtonElement>("#__et_undo__")
    if (undoBtn) {
      undoBtn.onclick = (e) => {
        e.stopPropagation()
        handlers.onUndo()
      }
    }

    const settingsBtn = el.querySelector<HTMLButtonElement>("#__et_settings__")
    if (settingsBtn) {
      settingsBtn.onclick = (e) => {
        e.stopPropagation()
        handlers.onSettings()
      }
    }

    const exitBtn = el.querySelector<HTMLButtonElement>("#__et_exit__")
    if (exitBtn) {
      exitBtn.onclick = (e) => {
        e.stopPropagation()
        handlers.onExit()
      }
    }
  }
}
