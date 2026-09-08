import { ChevronLeft } from "lucide-react"
import { useEffect } from "react"
import type React from "react"

import { Switch } from "./Switch"

interface SubSettingsLayoutProps {
  title: string
  onBack: () => void
  enabled?: boolean
  onToggle?: (enabled: boolean) => void
  rightActions?: React.ReactNode
  children: React.ReactNode
}

/**
 * Standardized reusable sub-settings page layout for Browse Assist features.
 * Title on the left replacing the "Back" label, optional switch on the right.
 * Listens for Backspace or Backquote (`) keys to navigate back quickly.
 */
export const SubSettingsLayout: React.FC<SubSettingsLayoutProps> = ({
  title,
  onBack,
  enabled,
  onToggle,
  rightActions,
  children
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is actively typing in an input element
      const target = e.target as HTMLElement | null
      const isInput =
        target?.tagName === "INPUT" ||
        target?.tagName === "TEXTAREA" ||
        target?.isContentEditable

      if (isInput && e.key === "Backspace") {
        return
      }

      if (e.key === "Backspace" || e.key === "`" || e.code === "Backquote") {
        e.preventDefault()
        onBack()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [onBack])

  return (
    <div className="flex flex-col space-y-4 py-2">
      {/* Header: Title on the left with Chevron Back, Optional Actions & Switch on the right */}
      <div className="flex items-center justify-between pb-2 border-b border-border-divider">
        <button
          type="button"
          onClick={onBack}
          title="Back (Backspace or `)"
          className="flex items-center gap-1.5 px-1.5 py-1 -ml-1 text-xs font-semibold text-content-secondary hover:text-content-primary rounded-lg hover:bg-app-surface transition-all focus:outline-none focus:ring-2 focus:ring-border-focus">
          <ChevronLeft className="w-4 h-4 text-content-muted" />
          <span className="text-[13px] font-semibold tracking-tight text-content-primary">
            {title}
          </span>
        </button>

        {/* Right header controls: custom action buttons + toggle switch */}
        <div className="flex items-center gap-2">
          {rightActions}

          {onToggle !== undefined && enabled !== undefined && (
            <Switch
              checked={enabled}
              onChange={onToggle}
              ariaLabel={`Toggle ${title}`}
            />
          )}
        </div>
      </div>

      {/* Main Sub-settings content */}
      <div className="space-y-4 pb-2">{children}</div>
    </div>
  )
}
