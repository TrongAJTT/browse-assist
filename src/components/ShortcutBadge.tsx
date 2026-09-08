import { Keyboard } from "lucide-react"
import type React from "react"

interface ShortcutBadgeProps {
  /** The shortcut key combination string (e.g. "Alt+R", "Alt+P") or empty string if unassigned */
  shortcut?: string
  /** Optional custom class name */
  className?: string
  /** Whether clicking the badge opens the browser shortcut configuration page (default: true) */
  interactive?: boolean
}

/**
 * Standardized Shortcut Badge component.
 * - Displays a sleek kbd badge when assigned.
 * - Displays an actionable "Unassigned" warning badge that directs users to configure the shortcut when empty/conflicted.
 */
export const ShortcutBadge: React.FC<ShortcutBadgeProps> = ({
  shortcut,
  className = "",
  interactive = true
}) => {
  const isAssigned = Boolean(shortcut && shortcut.trim().length > 0)

  const handleOpenShortcutsPage = (e: React.MouseEvent) => {
    if (!interactive) return
    e.stopPropagation()
    chrome.tabs.create({ url: "chrome://extensions/shortcuts" })
  }

  if (isAssigned) {
    return (
      <kbd
        onClick={interactive ? handleOpenShortcutsPage : undefined}
        title={interactive ? "Click to customize shortcut in browser settings" : undefined}
        className={`badge-kbd ${
          interactive ? "cursor-pointer hover:border-accent hover:text-accent active:scale-95 transition-all" : ""
        } ${className}`}>
        {shortcut}
      </kbd>
    )
  }

  return (
    <button
      type="button"
      onClick={interactive ? handleOpenShortcutsPage : undefined}
      title="Shortcut conflict or unassigned. Click to configure in browser settings"
      className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/25 ${
        interactive ? "cursor-pointer hover:bg-amber-500/20 hover:border-amber-500/40 active:scale-95 transition-all" : ""
      } ${className}`}>
      <Keyboard className="w-2.5 h-2.5" />
      <span>Unassigned</span>
    </button>
  )
}
