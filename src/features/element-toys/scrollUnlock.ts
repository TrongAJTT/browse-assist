import { showContentToast } from "~core/toast"

/**
 * Checks and unfreezes body/html scroll lock when removing overlays/modals.
 */
export function unfreezeScrollLock(showToast = true): void {
  try {
    const targets = [document.body, document.documentElement]
    let unfrozen = false

    targets.forEach((el) => {
      if (!el) return
      const style = window.getComputedStyle(el)
      if (style.overflow === "hidden" || style.overflowY === "hidden") {
        el.style.setProperty("overflow", "auto", "important")
        el.style.setProperty("overflow-y", "auto", "important")
        unfrozen = true
      }
      if (style.position === "fixed") {
        el.style.setProperty("position", "static", "important")
        unfrozen = true
      }
    })

    if (unfrozen && showToast) {
      showContentToast({
        message: "Page Scroll Unfrozen",
        detail: "overflow: auto restored",
        type: "info",
        duration: 2000
      })
    }
  } catch {
    // Ignore style errors
  }
}
