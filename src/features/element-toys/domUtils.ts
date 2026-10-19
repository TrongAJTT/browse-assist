import { ELEMENT_TOYS_CONTAINER_ID, TOOLBAR_ID } from "./constants"

/**
 * Builds readable descriptor for an element (e.g. "div#cookie-banner.modal").
 */
export function getElementDescriptor(el: HTMLElement): string {
  const tagName = el.tagName.toLowerCase()
  const idStr = el.id ? `#${el.id.slice(0, 18)}` : ""
  let classStr = ""
  if (typeof el.className === "string" && el.className.trim()) {
    const firstClass = el.className.trim().split(/\s+/)[0]
    if (firstClass && !firstClass.startsWith("__browse_assist")) {
      classStr = `.${firstClass.slice(0, 18)}`
    }
  }
  return `${tagName}${idStr}${classStr}`
}

/**
 * Checks if target belongs to extension internal UI.
 */
export function isInternalElement(target: HTMLElement | null): boolean {
  if (!target) return false
  return (
    target.id === ELEMENT_TOYS_CONTAINER_ID ||
    target.id === TOOLBAR_ID ||
    !!target.closest(`#${ELEMENT_TOYS_CONTAINER_ID}`) ||
    !!target.closest(`[data-browse-assist-internal]`)
  )
}
