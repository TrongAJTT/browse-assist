import { Check, Copy, HelpCircle, X } from "lucide-react"
import type React from "react"
import { useState } from "react"

export interface DialogOptions {
  title: string
  icon?: React.ReactNode
  content: React.ReactNode
  confirmText?: string
  cancelText?: string
}

// Global modal state holder
let showDialogHandler: ((options: DialogOptions) => Promise<boolean>) | null =
  null

/**
 * Programmatic imperative API to show a modal dialog from anywhere in the popup.
 * Returns a Promise that resolves to true (confirmed) or false (cancelled/closed).
 */
export function showGlobalDialog(options: DialogOptions): Promise<boolean> {
  if (!showDialogHandler) {
    console.warn("GlobalDialogHost is not mounted yet.")
    return Promise.resolve(false)
  }
  return showDialogHandler(options)
}

/**
 * Shows the Firefox shortcut guide dialog modal.
 */
export function showFirefoxShortcutGuide(): Promise<boolean> {
  return showGlobalDialog({
    title: "Firefox Shortcut Configuration Guide",
    icon: <HelpCircle className="w-5 h-5 text-sky-400" />,
    content: <FirefoxShortcutGuideContent />
  })
}

/**
 * Rich content component for the Firefox Shortcut Guide matching the user's design.
 */
const FirefoxShortcutGuideContent: React.FC = () => {
  const [copied, setCopied] = useState(false)

  const handleCopyAddons = async (e: React.MouseEvent) => {
    e.stopPropagation()
    try {
      await navigator.clipboard.writeText("about:addons")
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      // Ignore clipboard error
    }
  }

  return (
    <div className="space-y-3 text-xs text-content-secondary leading-relaxed select-text">
      <p>
        Shortcut hotkeys can be customized directly in your browser&apos;s
        extension settings:
      </p>

      <ol className="space-y-2 list-none pl-0">
        <li className="flex items-start gap-2">
          <span className="font-semibold text-content-primary shrink-0">
            1.
          </span>
          <div className="flex flex-wrap items-center gap-1.5">
            <span>Open a new tab in Firefox and navigate to</span>
            <button
              type="button"
              onClick={handleCopyAddons}
              title="Click to copy URL"
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 border border-sky-500/25 font-mono text-[11px] transition-all cursor-pointer">
              <span>about:addons</span>
              {copied ? (
                <Check className="w-3 h-3 text-emerald-400" />
              ) : (
                <Copy className="w-3 h-3 text-sky-400/70" />
              )}
            </button>
          </div>
        </li>

        <li className="flex items-start gap-2">
          <span className="font-semibold text-content-primary shrink-0">
            2.
          </span>
          <span>
            Click the{" "}
            <strong className="text-content-primary">Gear icon ⚙</strong> in
            the top right corner of the Add-ons Manager page.
          </span>
        </li>

        <li className="flex items-start gap-2">
          <span className="font-semibold text-content-primary shrink-0">
            3.
          </span>
          <span>
            Select{" "}
            <strong className="text-content-primary">
              &apos;Manage Extension Shortcuts&apos;
            </strong>{" "}
            from the dropdown menu.
          </span>
        </li>

        <li className="flex items-start gap-2">
          <span className="font-semibold text-content-primary shrink-0">
            4.
          </span>
          <span>
            Locate{" "}
            <strong className="text-content-primary">
              &apos;Browse Assist&apos;
            </strong>{" "}
            and assign your preferred hotkeys for each command action.
          </span>
        </li>
      </ol>
    </div>
  )
}

/**
 * Root Dialog Host Component to mount at the root of popup.tsx.
 */
export const GlobalDialogHost: React.FC = () => {
  const [currentDialog, setCurrentDialog] = useState<DialogOptions | null>(null)
  const [resolver, setResolver] = useState<((val: boolean) => void) | null>(
    null
  )

  useState(() => {
    showDialogHandler = (opts: DialogOptions) => {
      return new Promise<boolean>((resolve) => {
        setCurrentDialog(opts)
        setResolver(() => resolve)
      })
    }
  })

  const handleClose = (result: boolean) => {
    if (resolver) {
      resolver(result)
    }
    setCurrentDialog(null)
    setResolver(null)
  }

  if (!currentDialog) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div
        className="w-full max-w-sm rounded-2xl bg-app-elevated border border-border-subtle shadow-2xl shadow-black/80 overflow-hidden animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border-divider bg-surface-subtle/30">
          <div className="flex items-center gap-2">
            {currentDialog.icon}
            <h3 className="text-xs font-bold text-content-primary tracking-tight">
              {currentDialog.title}
            </h3>
          </div>
          <button
            type="button"
            onClick={() => handleClose(false)}
            className="p-1 rounded-lg text-content-muted hover:text-content-primary hover:bg-surface-elevated transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4">{currentDialog.content}</div>

        {/* Modal Footer */}
        <div className="flex justify-end gap-2 px-4 py-3 border-t border-border-divider bg-surface-subtle/20">
          <button
            type="button"
            onClick={() => handleClose(true)}
            className="px-3.5 py-1.5 rounded-xl bg-accent-hover text-white text-xs font-semibold shadow-sm hover:brightness-105 active:scale-95 transition-all">
            {currentDialog.confirmText || "Got it"}
          </button>
        </div>
      </div>
    </div>
  )
}
