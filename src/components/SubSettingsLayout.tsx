import { ChevronLeft } from "lucide-react"
import { useEffect } from "react"
import type React from "react"

interface SubSettingsLayoutProps {
  title: string
  icon?: React.ReactNode
  onBack: () => void
  children: React.ReactNode
}

/**
 * Standardized reusable sub-settings page layout for Browse Assist features.
 * Listens for Backspace or Backquote (`) keys to navigate back quickly.
 */
export const SubSettingsLayout: React.FC<SubSettingsLayoutProps> = ({
  title,
  icon,
  onBack,
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
      {/* Standard Sub-header with Back Button and Title */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-1 px-1.5 py-1 -ml-1 text-xs font-semibold text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/50">
          <ChevronLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <div className="flex items-center gap-2 text-xs text-slate-300 font-semibold">
          {icon && (
            <span className="flex items-center justify-center">{icon}</span>
          )}
          <span>{title}</span>
        </div>
      </div>

      {/* Main Sub-settings content */}
      <div className="space-y-4 pb-2">{children}</div>
    </div>
  )
}
