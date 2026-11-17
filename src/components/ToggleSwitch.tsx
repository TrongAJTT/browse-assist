import { ChevronRight, Keyboard } from "lucide-react"
import React, { useEffect, useRef, useState } from "react"

import { ShortcutBadge } from "~components/ShortcutBadge"
import { Switch } from "~components/Switch"
import { openBrowserShortcutsPage } from "~core/shortcutsHelper"
import type { ViewMode } from "~core/types"
import { useViewMode } from "~core/viewModeContext"

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
  variant?: ViewMode
}

/**
 * Grid-specific Badge component with Marquee Ping-Pong on card hover.
 * Extends the remaining width of the Title row.
 */
const GridMarqueeBadge: React.FC<{
  badge?: string
  shortcut?: string
}> = ({ badge, shortcut }) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLSpanElement>(null)
  const [overflow, setOverflow] = useState(0)

  const isAssigned = Boolean(shortcut && shortcut.trim().length > 0)
  const isShortcut = badge === undefined && shortcut !== undefined

  const displayText = badge ?? (isAssigned ? shortcut! : "Unassigned")
  const isWarning = isShortcut && !isAssigned

  useEffect(() => {
    const measure = () => {
      if (containerRef.current && textRef.current) {
        const diff =
          textRef.current.scrollWidth - containerRef.current.clientWidth
        setOverflow(diff > 2 ? diff : 0)
      }
    }
    measure()
    const timer = setTimeout(measure, 60)
    window.addEventListener("resize", measure)
    return () => {
      clearTimeout(timer)
      window.removeEventListener("resize", measure)
    }
  }, [displayText])

  const handleOpenShortcutsPage = (e: React.MouseEvent) => {
    if (!isShortcut) return
    e.stopPropagation()
    openBrowserShortcutsPage().catch(() => {})
  }

  const style =
    overflow > 0
      ? ({ "--marquee-dist": `-${overflow}px` } as React.CSSProperties)
      : undefined

  const inner = (
    <div
      ref={containerRef}
      style={style}
      className={`overflow-hidden w-full flex ${
        overflow > 0 ? "justify-start" : "justify-center"
      }`}>
      <span
        ref={textRef}
        className={`inline-block whitespace-nowrap group-hover-marquee ${
          overflow > 0 ? "" : "text-center truncate"
        }`}>
        {displayText}
      </span>
    </div>
  )

  if (isShortcut) {
    if (isWarning) {
      return (
        <button
          type="button"
          onClick={handleOpenShortcutsPage}
          title="Shortcut not assigned. Click to configure in browser settings"
          className="flex-1 min-w-0 overflow-hidden inline-flex items-center justify-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium bg-app-surface text-content-muted border border-border-subtle cursor-pointer hover:text-content-primary hover:border-accent/40 active:scale-95 transition-all">
          <Keyboard className="w-3 h-3 shrink-0 opacity-75" />
          {inner}
        </button>
      )
    }

    return (
      <kbd
        onClick={handleOpenShortcutsPage}
        title="Click to customize shortcut in browser settings"
        className="flex-1 min-w-0 overflow-hidden badge-kbd px-1.5 py-0.5 justify-center cursor-pointer hover:border-accent hover:text-accent active:scale-95 transition-all">
        {inner}
      </kbd>
    )
  }

  return (
    <span
      title={displayText}
      className="flex-1 min-w-0 overflow-hidden badge-success text-[9px] py-0.5 px-1.5 justify-center">
      {inner}
    </span>
  )
}

/**
 * Flexible feature toggle item supporting both detailed List row and compact Grid card layouts.
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
  onConfigure,
  variant
}) => {
  const contextViewMode = useViewMode()
  const effectiveViewMode = variant ?? contextViewMode

  const handleItemClick = () => {
    if (disabled) return
    if (onConfigure) {
      onConfigure()
    } else {
      onChange(!enabled)
    }
  }

  const hasBadge = Boolean(badge || shortcut !== undefined)

  // Compact Tile Grid Layout
  if (effectiveViewMode === "grid") {
    return (
      <div
        title={description}
        className={`relative flex flex-col justify-between p-2.5 rounded-xl border transition-all duration-150 group select-none ${
          enabled
            ? "bg-app-surface border-accent/25 shadow-sm hover:border-accent/45"
            : "bg-app-surface/40 border-border-subtle hover:border-border-subtle/80 opacity-75 hover:opacity-100"
        } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}>
        {/* Top row: Icon + Badge/Shortcut (left) and Action buttons (Chevron config + Switch) (right) */}
        <div className="flex items-center justify-between gap-1.5 min-w-0">
          <div className="flex items-center gap-1.5 min-w-0 flex-1 mr-0.5">
            <div className="shrink-0 flex items-center justify-center transition-transform duration-200 ease-out group-hover:scale-110">
              {icon}
            </div>
            {hasBadge && (
              <GridMarqueeBadge badge={badge} shortcut={shortcut} />
            )}
          </div>

          <div className="flex items-center gap-1 shrink-0">
            {onConfigure && (
              <button
                type="button"
                title={`Configure ${title}`}
                onClick={(e) => {
                  e.stopPropagation()
                  onConfigure()
                }}
                className="p-0.5 rounded-md text-content-muted hover:text-content-primary hover:bg-app-surface active:scale-95 transition-all focus:outline-none">
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            )}

            <Switch
              checked={enabled}
              onChange={(newChecked) => onChange(newChecked)}
              disabled={disabled}
              size="sm"
              aria-label={`Toggle ${title}`}
            />
          </div>
        </div>

        {/* Bottom row: Title only (description shown on hover tooltip) */}
        <div
          onClick={handleItemClick}
          className={`mt-2 flex items-center min-w-0 cursor-pointer ${
            enabled ? "feature-row-active" : "feature-row-dimmed"
          }`}>
          <span
            className={`text-xs font-semibold truncate transition-colors ${
              enabled ? "text-content-primary" : "text-content-secondary"
            }`}>
            {title}
          </span>
        </div>
      </div>
    )
  }

  // Detailed List Row Layout (Default)
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
