import { ChevronRight } from "lucide-react"
import type React from "react"

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
  return (
    <div className="flex items-center justify-between gap-3 py-3 group">
      {/* Clickable info area */}
      <div
        onClick={onConfigure}
        className={`flex items-start gap-3 flex-1 min-w-0 ${
          onConfigure ? "cursor-pointer" : ""
        }`}>
        <div className="shrink-0 mt-0.5 flex items-center justify-center transition-transform duration-200 ease-out group-hover:scale-110">
          {icon}
        </div>
        <div className="flex flex-col min-w-0 flex-1">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span
              className={`text-sm font-semibold truncate transition-colors ${
                enabled ? "text-slate-100" : "text-slate-400"
              }`}>
              {title}
            </span>
            {badge && (
              <span className="px-1.5 py-0.5 text-[10px] font-medium tracking-tight rounded bg-emerald-950/60 text-emerald-400 border border-emerald-800/50">
                {badge}
              </span>
            )}
            {shortcut && (
              <span className="px-1.5 py-0.5 text-[10px] font-mono font-medium rounded bg-slate-800 text-slate-400 border border-slate-700/60">
                {shortcut}
              </span>
            )}
          </div>
          <span className="text-xs text-slate-400 line-clamp-2 leading-relaxed mt-0.5">
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
            className="p-1 rounded-md text-slate-400 hover:text-slate-100 hover:bg-slate-800 active:scale-95 transition-all focus:outline-none">
            <ChevronRight className="w-4 h-4" />
          </button>
        )}

        <button
          type="button"
          role="switch"
          aria-checked={enabled}
          disabled={disabled}
          onClick={() => onChange(!enabled)}
          className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-900 ${
            enabled
              ? "bg-indigo-600 shadow-indigo-500/20 shadow-md"
              : "bg-slate-700"
          } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}>
          <span className="sr-only">Toggle {title}</span>
          <span
            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
              enabled ? "translate-x-5" : "translate-x-0"
            }`}
          />
        </button>
      </div>
    </div>
  )
}
