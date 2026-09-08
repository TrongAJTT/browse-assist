import { ChevronRight } from "lucide-react"
import type React from "react"

import { ShortcutBadge } from "~components/ShortcutBadge"
import { Switch } from "~components/Switch"

interface ToggleSwitchProps {
  icon: React.ReactNode
  title: string
  description: string
  enabled: boolean
  onChange: (enabled: boolean) => void
  disabled?: boolean
  shortcut?: string
  badge?: string
  onConfigure?: () => void
}

/**
 * PowerToys-style list row with clean divider layout and chevron navigation.
 */
export const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
  icon,
  title,
  description,
  enabled,
  onChange,
  disabled = false,
  shortcut,
  badge,
  onConfigure
}) => {
  const handleItemClick = () => {
    if (disabled) return
    if (onConfigure) {
      onConfigure()
    } else {
      onChange(!enabled)
    }
  }

  return (
    <div
      onClick={!onConfigure ? handleItemClick : undefined}
      className={`flex items-center justify-between gap-3 py-3 group ${
        !onConfigure && !disabled ? "cursor-pointer" : ""
      }`}>
      {/* Clickable info area */}
      <div
        onClick={onConfigure ? handleItemClick : undefined}
        className={`flex items-start gap-3 flex-1 min-w-0 ${
          onConfigure ? "cursor-pointer" : ""
        } ${enabled ? "feature-row-active" : "feature-row-dimmed"}`}>
        <div className="shrink-0 mt-0.5 flex items-center justify-center transition-transform duration-200 ease-out group-hover:scale-110">
          {icon}
        </div>
        <div className="flex flex-col min-w-0 flex-1">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span
              className={`text-[13px] font-semibold truncate transition-colors ${
                enabled ? "text-content-primary" : "text-content-secondary"
              }`}>
              {title}
            </span>
            {badge && (
              <span className="badge-success">
                {badge}
              </span>
            )}
            {shortcut !== undefined && (
              <ShortcutBadge shortcut={shortcut} />
            )}
          </div>
          <span className="text-xs text-content-muted line-clamp-2 leading-relaxed mt-0.5">
            {description}
          </span>
        </div>
      </div>

      {/* Action area: Chevron Right (if sub-settings available) + Switch */}
      <div className="flex items-center gap-1.5 shrink-0">
        {onConfigure && (
          <button
            type="button"
            title={`Configure ${title}`}
            onClick={onConfigure}
            className="p-1 rounded-md text-content-muted hover:text-content-primary hover:bg-app-surface active:scale-95 transition-all focus:outline-none">
            <ChevronRight className="w-4 h-4" />
          </button>
        )}

        <Switch
          checked={enabled}
          onChange={(newChecked) => onChange(newChecked)}
          disabled={disabled}
          size="md"
          aria-label={`Toggle ${title}`}
        />
      </div>
    </div>
  )
}
