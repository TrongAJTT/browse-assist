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
}

/**
 * Reusable horizontal grid selection picker with active highlights and smooth transitions.
 */
export function GridPicker<T extends string = string>({
  items,
  value,
  onChange,
  columns = 4
}: GridPickerProps<T>): React.ReactElement {
  const colClass =
    columns === 2
      ? "grid-cols-2"
      : columns === 3
        ? "grid-cols-3"
        : "grid-cols-4"

  return (
    <div className={`grid ${colClass} gap-1.5`}>
      {items.map((item) => {
        const isSelected = value === item.id
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onChange(item.id)}
            className={`flex flex-col items-center justify-center gap-1.5 py-2 px-1 rounded-xl border transition-all ${
              isSelected
                ? "bg-indigo-600/20 border-indigo-500 text-indigo-300 shadow-sm"
                : "bg-slate-800/40 hover:bg-slate-800 border-slate-700/60 text-slate-400 hover:text-slate-200"
            }`}>
            {item.icon && (
              <span
                className={isSelected ? "text-indigo-400" : "text-slate-400"}>
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
