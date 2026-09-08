import { ExternalLink, Keyboard } from "lucide-react"
import type React from "react"

import { ShortcutBadge } from "./ShortcutBadge"

interface FeatureShortcutRowProps {
  title: string
  description: string
  shortcut?: string
  iconColorClass?: string
  onConfigureShortcuts: () => void
}

/**
 * Standardized, flat Keyboard Shortcut row matching the Color Picker gold standard:
 * Icon + Title + Description on the left, ShortcutBadge + ExternalLink button on the right.
 */
export const FeatureShortcutRow: React.FC<FeatureShortcutRowProps> = ({
  title,
  description,
  shortcut,
  iconColorClass = "text-pink-400",
  onConfigureShortcuts
}) => {
  return (
    <div className="space-y-2">
      <span className="section-header">Keyboard Shortcut</span>
      <div className="flex items-center justify-between gap-3 py-1">
        <div className="flex items-center gap-2.5">
          <div className={`p-1 ${iconColorClass}`}>
            <Keyboard className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-content-primary">
              {title}
            </span>
            <span className="text-[11px] text-content-muted">
              {description}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <ShortcutBadge shortcut={shortcut} />
          <button
            type="button"
            onClick={onConfigureShortcuts}
            title="Customize in browser shortcut settings"
            className="p-1 text-content-muted hover:text-accent transition-colors">
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  )
}
