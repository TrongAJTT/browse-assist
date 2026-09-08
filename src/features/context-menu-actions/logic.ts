/**
 * Context Menu Actions - Content Script Logic
 * Tracks right-clicked elements, resolves link text/URL, performs formatting & clipboard writes,
 * and shows floating toast feedback.
 */

import { cleanUrl } from "./cleanUrl"

let isActive = false
let lastContextMenuTarget: EventTarget | null = null
let toastElement: HTMLDivElement | null = null
let toastTimeoutId: number | null = null

/**
 * Shows a floating toast notification with the copied preview.
 */
function showCopiedToast(label: string, text: string): void {
  if (typeof document === "undefined") return

  if (!toastElement) {
    toastElement = document.createElement("div")
    toastElement.id = "browse-assist-copy-toast"
    toastElement.style.cssText = `
      position: fixed;
      bottom: 24px;
      right: 24px;
      z-index: 2147483647;
      background: rgba(15, 23, 42, 0.92);
      color: #f8fafc;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      font-size: 13px;
      font-weight: 500;
      padding: 8px 16px;
      border-radius: 8px;
      box-shadow: 0 4px 14px rgba(0, 0, 0, 0.25);
      border: 1px solid rgba(255, 255, 255, 0.15);
      pointer-events: none;
      transition: opacity 0.2s ease-in-out, transform 0.2s ease-in-out;
      opacity: 0;
      transform: translateY(6px);
      max-width: 360px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    `
    document.documentElement.appendChild(toastElement)
  }

  const preview = text.length > 40 ? text.slice(0, 37) + "..." : text
  toastElement.textContent = `${label}: "${preview}"`
  toastElement.style.opacity = "1"
  toastElement.style.transform = "translateY(0)"

  if (toastTimeoutId !== null) {
    window.clearTimeout(toastTimeoutId)
  }

  toastTimeoutId = window.setTimeout(() => {
    if (toastElement) {
      toastElement.style.opacity = "0"
      toastElement.style.transform = "translateY(6px)"
    }
    toastTimeoutId = null
  }, 1600)
}

/**
 * Captures the right-clicked target element.
 */
function onContextMenu(event: MouseEvent): void {
  lastContextMenuTarget = event.target
}

/**
 * Resolves the link element from the last clicked target or URL fallback.
 */
function resolveAnchor(linkUrl: string): HTMLAnchorElement | null {
  let anchor: HTMLAnchorElement | null = null

  if (lastContextMenuTarget instanceof Element) {
    anchor = lastContextMenuTarget.closest("a")
  }

  if (!anchor && linkUrl) {
    try {
      anchor = document.querySelector(`a[href="${CSS.escape(linkUrl)}"]`)
    } catch {
      // Ignore selector syntax error for complex/invalid URLs
    }
  }

  return anchor
}

/**
 * Extracts visible text content from an anchor or falls back to URL.
 */
function resolveLinkText(linkUrl: string): string {
  const anchor = resolveAnchor(linkUrl)
  const extracted = anchor?.innerText?.trim() || anchor?.textContent?.trim()
  return extracted || linkUrl || ""
}

/**
 * Writes text to clipboard with fallback.
 */
async function writeToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    try {
      const textarea = document.createElement("textarea")
      textarea.value = text
      textarea.style.position = "fixed"
      textarea.style.opacity = "0"
      document.body.appendChild(textarea)
      textarea.select()
      const successful = document.execCommand("copy")
      document.body.removeChild(textarea)
      return successful
    } catch (err) {
      console.warn("Browse Assist: Failed to write to clipboard:", err)
      return false
    }
  }
}

/**
 * Handles incoming messages from background service worker.
 */
async function onMessage(
  message: { action?: string; linkUrl?: string },
  _sender: chrome.runtime.MessageSender,
  _sendResponse: (response?: unknown) => void
): Promise<void> {
  const rawUrl = message?.linkUrl || ""

  switch (message?.action) {
    case "browse_assist_copy_link_text": {
      const linkText = resolveLinkText(rawUrl)
      if (linkText) {
        const success = await writeToClipboard(linkText)
        if (success) showCopiedToast("Copied Text", linkText)
      }
      break
    }

    case "browse_assist_clean_link_copy": {
      const cleaned = cleanUrl(rawUrl)
      if (cleaned) {
        const success = await writeToClipboard(cleaned)
        if (success) showCopiedToast("Copied Clean Link", cleaned)
      }
      break
    }

    case "browse_assist_markdown_link_copy": {
      const linkText = resolveLinkText(rawUrl)
      const cleanedUrl = cleanUrl(rawUrl)
      const markdown = `[${linkText}](${cleanedUrl})`
      const success = await writeToClipboard(markdown)
      if (success) showCopiedToast("Copied Markdown", markdown)
      break
    }
  }
}

/**
 * Activates the Context Menu Actions content handler.
 */
export function activate(): void {
  if (isActive || typeof window === "undefined") return
  isActive = true

  window.addEventListener("contextmenu", onContextMenu, true)

  if (typeof chrome !== "undefined" && chrome.runtime?.onMessage) {
    chrome.runtime.onMessage.addListener(onMessage)
  }
}

/**
 * Deactivates the Context Menu Actions content handler.
 */
export function deactivate(): void {
  if (!isActive || typeof window === "undefined") return
  isActive = false

  window.removeEventListener("contextmenu", onContextMenu, true)

  if (typeof chrome !== "undefined" && chrome.runtime?.onMessage) {
    chrome.runtime.onMessage.removeListener(onMessage)
  }

  if (toastElement && toastElement.parentNode) {
    toastElement.parentNode.removeChild(toastElement)
    toastElement = null
  }
  if (toastTimeoutId !== null) {
    window.clearTimeout(toastTimeoutId)
    toastTimeoutId = null
  }
}
