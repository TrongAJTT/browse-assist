import type React from "react"

import { Switch } from "./Switch"

export interface SettingToggleRowProps {
  icon?: React.ReactNode
  title: string
  description?: string
  badge?: {
    text: string
    colorClass?: string
    bgClass?: string
    borderClass?: string
  }
  enabled: boolean
  onToggle: (enabled: boolean) => void
  disabled?: boolean
  className?: string
}

/**
 * Standardized Settings Toggle Row matching the Browse Assist Design System:
 * [Icon] + [Title + Optional Badge + Description] on the left, [Switch] on the right.
 * Entire row is clickable for toggle convenience.
 */
export const SettingToggleRow: React.FC<SettingToggleRowProps> = ({
  icon,
  title,
  description,
  badge,
  enabled,
  onToggle,
  disabled = false,
  className = ""
}) => {
  return (
    <div
      onClick={() => {
        if (!disabled) {
          onToggle(!enabled)
        }
      }}
      className={`flex items-center justify-between gap-3 py-2.5 transition-colors select-none ${
        disabled
          ? "opacity-50 cursor-not-allowed"
          : "cursor-pointer group"
      } ${className}`}>
      {/* Left section: Icon + Content */}
      <div className="flex items-start gap-3 flex-1 min-w-0">
        {icon && (
          <div className="shrink-0 mt-0.5 flex items-center justify-center transition-transform duration-200 ease-out group-hover:scale-105">
            {icon}
          </div>
        )}

        <div className="flex flex-col min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className={`text-xs font-semibold tracking-tight transition-colors ${
                enabled
                  ? "text-content-primary"
                  : "text-content-secondary group-hover:text-content-primary"
              }`}>
              {title}
            </span>

            {badge && (
              <span
                className={`text-[10px] font-semibold px-1.5 py-0.5 rounded border ${
                  badge.bgClass || "bg-accent-subtle"
                } ${badge.colorClass || "text-accent"} ${
                  badge.borderClass || "border-accent/20"
                }`}>
                {badge.text}
              </span>
            )}
          </div>

          {description && (
            <span className="text-[11px] text-content-muted leading-snug mt-0.5">
              {description}
            </span>
          )}
        </div>
      </div>

      {/* Right section: Standardized Switch */}
      <div className="shrink-0 pl-1">
        <Switch
          checked={enabled}
          onChange={onToggle}
          disabled={disabled}
          ariaLabel={`Toggle ${title}`}
        />
      </div>
    </div>
  )
}
