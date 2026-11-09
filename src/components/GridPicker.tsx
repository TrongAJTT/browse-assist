import type React from "react"

export interface GridPickerItem<T extends string = string> {
  id: T
  label: string
  icon?: React.ReactNode
}

interface GridPickerProps<T extends string = string> {
  items: GridPickerItem<T>[]
  value: T
  onChange: (value: T) => void
  columns?: 2 | 3 | 4
  disabled?: boolean
  className?: string
}

/**
 * Reusable horizontal grid selection picker with active highlights and smooth transitions.
 */
export function GridPicker<T extends string = string>({
  items,
  value,
  onChange,
  columns = 4,
  disabled = false,
  className = ""
}: GridPickerProps<T>): React.ReactElement {
  const colClass =
    columns === 2
      ? "grid-cols-2"
      : columns === 3
        ? "grid-cols-3"
        : "grid-cols-4"

  return (
    <div
      className={`grid ${colClass} gap-1.5 ${disabled ? "opacity-35 pointer-events-none" : ""} ${className}`}>
      {items.map((item) => {
        const isSelected = value === item.id
        return (
          <button
            key={item.id}
            type="button"
            disabled={disabled}
            onClick={() => onChange(item.id)}
            className={`flex flex-col items-center justify-center gap-1 py-1.5 px-2 rounded-md border transition-all ${
              isSelected
                ? "bg-accent border-accent text-white shadow-sm font-semibold"
                : "bg-app-surface hover:bg-app-card border-border-subtle text-content-muted hover:text-content-primary"
            }`}>
            {item.icon && (
              <span
                className={isSelected ? "text-white" : "text-content-muted"}>
                {item.icon}
              </span>
            )}
            <span className="text-[11px] font-semibold text-center leading-tight truncate w-full">
              {item.label}
            </span>
          </button>
        )
      })}
    </div>
  )
}
