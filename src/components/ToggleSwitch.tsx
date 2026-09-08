import type React from "react"

interface ToggleSwitchProps {
  icon: string
  title: string
  description: string
  enabled: boolean
  onChange: (enabled: boolean) => void
  disabled?: boolean
  shortcut?: string
}

/**
 * Reusable toggle switch row for feature controls in popup.
 */
export const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
  icon,
  title,
  description,
  enabled,
  onChange,
  disabled = false,
  shortcut
}) => {
  return (
    <div
      className={`group flex items-start justify-between gap-3 p-3 transition-all duration-200 rounded-xl border ${
        enabled
          ? "bg-slate-800/80 hover:bg-slate-800 border-slate-700/80 shadow-sm"
          : "bg-slate-900/40 hover:bg-slate-900/70 border-slate-800/60 opacity-75"
      }`}>
      <div className="flex items-start gap-3 flex-1 min-w-0">
        <span
          className="text-xl select-none mt-0.5 transform transition-transform group-hover:scale-110"
          role="img"
          aria-label={title}>
          {icon}
        </span>
        <div className="flex flex-col min-w-0 flex-1">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span
              className={`text-sm font-semibold truncate transition-colors ${
                enabled ? "text-slate-100" : "text-slate-400"
              }`}>
              {title}
            </span>
            {shortcut && (
              <span className="px-1.5 py-0.5 text-[10px] font-mono font-medium rounded bg-slate-700/60 text-slate-300 border border-slate-600/40">
                {shortcut}
              </span>
            )}
          </div>
          <span className="text-xs text-slate-400 line-clamp-2 leading-relaxed mt-0.5">
            {description}
          </span>
        </div>
      </div>

      <button
        type="button"
        role="switch"
        aria-checked={enabled}
        disabled={disabled}
        onClick={() => onChange(!enabled)}
        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-900 ${
          enabled ? "bg-indigo-600 shadow-indigo-500/20 shadow-md" : "bg-slate-700"
        } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}>
        <span className="sr-only">Toggle {title}</span>
        <span
          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
            enabled ? "translate-x-5" : "translate-x-0"
          }`}
        />
      </button>
    </div>
  )
}
