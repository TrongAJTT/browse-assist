import { SVG_ICONS } from "../constants"
import { getElementDescriptor } from "../domUtils"
import { unfreezeScrollLock } from "../scrollUnlock"
import type { UndoManager } from "../undoManager"
import { showContentToast } from "~core/toast"
import type { ElementZapperConfig } from "~core/types"

export function executeZap(
  target: HTMLElement,
  config: ElementZapperConfig,
  undoManager: UndoManager
): void {
  const parent = target.parentElement
  const nextSibling = target.nextSibling
  const desc = getElementDescriptor(target)
  const isPotentialModal =
    window.getComputedStyle(target).position === "fixed" ||
    window.getComputedStyle(target).position === "absolute"

  undoManager.push({
    type: "zap",
    element: target,
    parent,
    nextSibling
  })

  try {
    target.remove()
  } catch {
    target.style.display = "none"
  }

  if (config.autoUnfreezeScroll && isPotentialModal) {
    unfreezeScrollLock(config.showToast)
  }

  if (config.showToast) {
    showContentToast({
      message: "Element Zapped!",
      detail: `<${desc}>`,
      type: "success",
      iconSvg: SVG_ICONS.zap,
      duration: 2000
    })
  }
}
