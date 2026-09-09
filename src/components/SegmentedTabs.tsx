import type React from "react"

export interface SegmentedTabItem<T extends string = string> {
  id: T
  label: string
  icon?: React.ReactNode
  showOffDot?: boolean // Indicates disabled or attention-needed state
  disabled?: boolean
}

interface SegmentedTabsProps<T extends string = string> {
  items: SegmentedTabItem<T>[]
  value: T
  onChange: (value: T) => void
  className?: string
}

/**
 * Reusable Segmented Tabs component matching Browse Assist design tokens.
 * Features smooth transitions, active accent states, and optional OFF indicator dots.
 */
export function SegmentedTabs<T extends string = string>({
  items,
  value,
  onChange,
  className = ""
}: SegmentedTabsProps<T>): React.ReactElement {
  return (
    <div
      role="tablist"
      className={`flex items-center gap-1 p-1 bg-app-surface border border-border-subtle rounded-lg select-none ${className}`}>
      {items.map((tab) => {
        const isSelected = value === tab.id

        return (
          <button
            key={tab.id}
            role="tab"
            type="button"
            disabled={tab.disabled}
            aria-selected={isSelected}
            onClick={() => onChange(tab.id)}
            title={`${tab.label}${tab.showOffDot ? " (Off)" : ""}`}
            className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 text-xs font-semibold rounded-md transition-all ${
              tab.disabled
                ? "opacity-40 cursor-not-allowed"
                : isSelected
                  ? "bg-accent text-white shadow-sm"
                  : "text-content-muted hover:text-content-primary hover:bg-app-surface-hover"
            }`}>
            {tab.icon && (
              <span className="shrink-0 flex items-center justify-center">
                {tab.icon}
              </span>
            )}
            <span>{tab.label}</span>

            {/* OFF Indicator Dot */}
            {tab.showOffDot && (
              <span
                className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                  isSelected
                    ? "bg-white/70"
                    : "bg-amber-400/80 ring-1 ring-amber-400/30"
                }`}
                title="Disabled"
              />
            )}
          </button>
        )
      })}
    </div>
  )
}
