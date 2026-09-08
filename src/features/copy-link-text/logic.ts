/**
 * Copy Link Text - Content Script Logic
 * Tracks right-clicked elements, receives context menu commands from background,
 * extracts the exact anchor text, copies it to clipboard, and shows user feedback.
 */

let isActive = false
let lastContextMenuTarget: EventTarget | null = null
let toastElement: HTMLDivElement | null = null
let toastTimeoutId: number | null = null

/**
 * Shows a brief floating toast notification confirming the text was copied.
 */
function showCopiedToast(text: string): void {
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
      max-width: 320px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    `
    document.documentElement.appendChild(toastElement)
  }

  const preview = text.length > 35 ? text.slice(0, 32) + "..." : text
  toastElement.textContent = `Copied: "${preview}"`
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
  }, 1500)
}

/**
 * Captures the right-clicked target element.
 */
function onContextMenu(event: MouseEvent): void {
  lastContextMenuTarget = event.target
}

/**
 * Resolves the link text from the last clicked target or URL fallback.
 */
function resolveLinkText(linkUrl: string): string {
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

  const extracted = anchor?.innerText?.trim() || anchor?.textContent?.trim()
  return extracted || linkUrl || ""
}

/**
 * Handles incoming messages from background script.
 */
function onMessage(
  message: { action?: string; linkUrl?: string },
  _sender: chrome.runtime.MessageSender,
  _sendResponse: (response?: unknown) => void
): void {
  if (message?.action === "COPY_LINK_TEXT") {
    const textToCopy = resolveLinkText(message.linkUrl || "")

    if (textToCopy) {
      navigator.clipboard
        .writeText(textToCopy)
        .then(() => {
          showCopiedToast(textToCopy)
        })
        .catch(() => {
          // Fallback via textarea for environments restricting asynchronous clipboard writes
          try {
            const textarea = document.createElement("textarea")
            textarea.value = textToCopy
            textarea.style.position = "fixed"
            textarea.style.opacity = "0"
            document.body.appendChild(textarea)
            textarea.select()
            document.execCommand("copy")
            document.body.removeChild(textarea)
            showCopiedToast(textToCopy)
          } catch (fallbackErr) {
            console.warn("Failed to copy link text:", fallbackErr)
          }
        })
    }
  }
}

/**
 * Activates the Copy Link Text content handler.
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
 * Deactivates the Copy Link Text content handler.
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
