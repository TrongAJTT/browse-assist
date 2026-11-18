/**
 * Context Menu Actions - Content Script Logic
 * Tracks right-clicked elements, resolves link text/URL, performs formatting & clipboard writes,
 * and shows floating toast feedback.
 * Uses shared linkUtils as single source of truth.
 */

import { t } from "~core/i18n"
import {
  cleanUrl,
  copyToClipboard,
  extractAnchorText,
  showCopiedFeedback
} from "~core/linkUtils"

let isActive = false
let lastContextMenuTarget: EventTarget | null = null

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
  return extractAnchorText(anchor, linkUrl)
}

/**
 * Handles incoming messages from background service worker.
 */
async function onMessage(
  message: {
    action?: string
    linkUrl?: string
    pageUrl?: string
    selectionText?: string
  },
  _sender: chrome.runtime.MessageSender,
  _sendResponse: (response?: unknown) => void
): Promise<void> {
  const rawUrl = message?.linkUrl || ""
  const pageUrl = message?.pageUrl || window.location.href

  switch (message?.action) {
    case "browse_assist_copy_link_text": {
      const linkText = resolveLinkText(rawUrl)
      if (linkText) {
        const success = await copyToClipboard(linkText)
        if (success) showCopiedFeedback(t("content.copied.linkText"), linkText)
      }
      break
    }

    case "browse_assist_clean_link_copy": {
      const cleaned = cleanUrl(rawUrl)
      if (cleaned) {
        const success = await copyToClipboard(cleaned)
        if (success) showCopiedFeedback(t("content.copied.cleanLink"), cleaned)
      }
      break
    }

    case "browse_assist_markdown_link_copy": {
      const linkText = resolveLinkText(rawUrl).replace(/\[|\]/g, "")
      const cleanedUrl = cleanUrl(rawUrl)
      const markdown = `[${linkText}](${cleanedUrl})`
      const success = await copyToClipboard(markdown)
      if (success) showCopiedFeedback(t("content.copied.markdown"), markdown)
      break
    }

    case "browse_assist_copy_clean_page_url": {
      const cleaned = cleanUrl(pageUrl)
      if (cleaned) {
        const success = await copyToClipboard(cleaned)
        if (success)
          showCopiedFeedback(t("content.copied.cleanPageUrl"), cleaned)
      }
      break
    }

    case "browse_assist_copy_page_markdown": {
      const cleaned = cleanUrl(pageUrl)
      const title = (document.title || cleaned).replace(/\[|\]/g, "")
      const markdown = `[${title}](${cleaned})`
      const success = await copyToClipboard(markdown)
      if (success)
        showCopiedFeedback(t("content.copied.pageMarkdown"), markdown)
      break
    }

    case "browse_assist_copy_selection_quote": {
      const selected = (
        message?.selectionText ||
        window.getSelection()?.toString() ||
        ""
      ).trim()
      if (selected) {
        const cleaned = cleanUrl(pageUrl)
        const title = (document.title || cleaned).replace(/\[|\]/g, "")
        const quoted = selected
          .split(/\r?\n/)
          .map((line) => `> ${line}`)
          .join("\n")
        const markdown = `${quoted}\n— [${title}](${cleaned})`
        const success = await copyToClipboard(markdown)
        if (success) showCopiedFeedback(t("content.copied.quote"), selected)
      }
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
  lastContextMenuTarget = null

  window.removeEventListener("contextmenu", onContextMenu, true)

  if (typeof chrome !== "undefined" && chrome.runtime?.onMessage) {
    chrome.runtime.onMessage.removeListener(onMessage)
  }
}
