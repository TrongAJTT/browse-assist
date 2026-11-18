import { Keyboard } from "lucide-react"
import type React from "react"

import { openBrowserShortcutsPage } from "~core/shortcutsHelper"
import { useI18n } from "~core/useI18n"

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
  const { t } = useI18n()
  const isAssigned = Boolean(shortcut && shortcut.trim().length > 0)

  const handleOpenShortcutsPage = (e: React.MouseEvent) => {
    if (!interactive) return
    e.stopPropagation()
    openBrowserShortcutsPage().catch(() => {})
  }

  if (isAssigned) {
    return (
      <kbd
        onClick={interactive ? handleOpenShortcutsPage : undefined}
        title={
          interactive
            ? "Click to customize shortcut in browser settings"
            : undefined
        }
        className={`badge-kbd ${
          interactive
            ? "cursor-pointer hover:border-accent hover:text-accent active:scale-95 transition-all"
            : ""
        } ${className}`}>
        {shortcut}
      </kbd>
    )
  }

  return (
    <button
      type="button"
      onClick={interactive ? handleOpenShortcutsPage : undefined}
      title="Shortcut not assigned. Click to configure in browser settings"
      className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium bg-app-surface text-content-muted border border-border-subtle ${
        interactive
          ? "cursor-pointer hover:text-content-primary hover:border-accent/40 active:scale-95 transition-all"
          : ""
      } ${className}`}>
      <Keyboard className="w-2.5 h-2.5 opacity-75" />
      <span>{t("common.unassigned")}</span>
    </button>
  )
}
