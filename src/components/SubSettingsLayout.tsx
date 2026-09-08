import { ChevronLeft } from "lucide-react"
import type React from "react"

interface SubSettingsLayoutProps {
  title: string
  icon?: React.ReactNode
  onBack: () => void
  children: React.ReactNode
}

/**
 * Standardized reusable sub-settings page layout for Browse Assist features.
 */
export const SubSettingsLayout: React.FC<SubSettingsLayoutProps> = ({
  title,
  icon,
  onBack,
  children
}) => {
  return (
    <div className="flex flex-col space-y-4">
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
      <div className="space-y-4">{children}</div>
    </div>
  )
}
