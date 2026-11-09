import { getElementDescriptor } from "../domUtils"
import { unfreezeScrollLock } from "../scrollUnlock"
import type { UndoManager } from "../undoManager"
import { showContentToast } from "~core/toast"
import type { ElementToysConfig } from "~core/types"

export function executeHide(
  target: HTMLElement,
  config: ElementToysConfig,
  undoManager: UndoManager
): void {
  const oldVisibility = target.style.visibility
  const oldDisplay = target.style.display
  const desc = getElementDescriptor(target)
  const isPotentialModal =
    window.getComputedStyle(target).position === "fixed" ||
    window.getComputedStyle(target).position === "absolute"

  undoManager.push({
    type: "hide",
    element: target,
    oldVisibility,
    oldDisplay
  })

  target.style.setProperty("visibility", "hidden", "important")

  if (config.autoUnfreezeScroll && isPotentialModal) {
    unfreezeScrollLock(config.showToast)
  }

  if (config.showToast) {
    showContentToast({
      message: "Element Hidden",
      detail: `<${desc}>`,
      type: "info",
      duration: 1800
    })
  }
}
