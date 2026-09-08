import { ChevronLeft } from "lucide-react"
import { useEffect } from "react"
import type React from "react"

interface SubSettingsLayoutProps {
  title: string
  onBack: () => void
  enabled?: boolean
  onToggle?: (enabled: boolean) => void
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
      {/* Header: Title on the left with Chevron Back, Optional Switch on the right */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
        <button
          type="button"
          onClick={onBack}
          title="Back (Backspace or `)"
          className="flex items-center gap-1.5 px-1 py-1 -ml-1 text-xs font-semibold text-slate-300 hover:text-white rounded-lg hover:bg-slate-800/60 transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/50">
          <ChevronLeft className="w-4 h-4 text-slate-400" />
          <span className="text-xs font-semibold tracking-tight text-white">
            {title}
          </span>
        </button>

        {/* Optional Toggle Switch on the right */}
        {onToggle !== undefined && enabled !== undefined && (
          <button
            type="button"
            role="switch"
            aria-checked={enabled}
            onClick={() => onToggle(!enabled)}
            className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-900 ${
              enabled
                ? "bg-indigo-600 shadow-indigo-500/20 shadow-sm"
                : "bg-slate-700"
            }`}>
            <span className="sr-only">Toggle {title}</span>
            <span
              className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                enabled ? "translate-x-4" : "translate-x-0"
              }`}
            />
          </button>
        )}
      </div>

      {/* Main Sub-settings content */}
      <div className="space-y-4 pb-2">{children}</div>
    </div>
  )
}
