import { Check, ChevronDown } from "lucide-react"
import React, { useEffect, useRef, useState } from "react"

export interface SelectDropdownOption<T extends string> {
  id: T
  label: string
  icon?: React.ReactNode
}

/**
 * Shared opacity preset options reusable across feature settings.
 */
export const OPACITY_DROPDOWN_OPTIONS: SelectDropdownOption<string>[] = [
  { id: "1", label: "100%" },
  { id: "0.85", label: "85%" },
  { id: "0.7", label: "70%" },
  { id: "0.5", label: "50%" },
  { id: "0.35", label: "35%" }
]

interface SelectDropdownProps<T extends string> {
  value: T
  options: SelectDropdownOption<T>[]
  onChange: (value: T) => void
  ariaLabel?: string
  className?: string
}

/**
 * Reusable compact trailing dropdown menu adhering to Browse Assist Design Tokens.
 */
export function SelectDropdown<T extends string>({
  value,
  options,
  onChange,
  ariaLabel,
  className = ""
}: SelectDropdownProps<T>) {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const selectedOption =
    options.find((opt) => opt.id === value) ?? options[0]

  useEffect(() => {
    if (!isOpen) return

    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    document.addEventListener("keydown", handleKeyDown)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [isOpen])

  return (
    <div ref={containerRef} className={`relative shrink-0 ${className}`}>
      <button
        type="button"
        aria-label={ariaLabel}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        onClick={() => setIsOpen((prev) => !prev)}
        className={`inline-flex items-center justify-between gap-2 min-w-[104px] px-2.5 py-1.5 rounded-lg text-xs font-medium bg-app-surface border transition-all focus:outline-none ${
          isOpen
            ? "border-accent text-content-primary ring-1 ring-accent-glow"
            : "border-border-subtle text-content-primary hover:border-accent/40"
        }`}>
        <span className="flex items-center gap-1.5 truncate">
          {selectedOption?.icon && (
            <span className="shrink-0 text-content-muted">
              {selectedOption.icon}
            </span>
          )}
          <span className="truncate">{selectedOption?.label}</span>
        </span>
        <ChevronDown
          className={`w-3.5 h-3.5 text-content-muted shrink-0 transition-transform duration-150 ${
            isOpen ? "rotate-180 text-accent" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div
          role="listbox"
          className="absolute right-0 mt-1.5 min-w-[136px] rounded-xl bg-app-elevated border border-border-subtle shadow-xl shadow-black/40 py-1 z-30 animate-in fade-in zoom-in-95 duration-100">
          {options.map((opt) => {
            const isSelected = opt.id === value
            return (
              <button
                key={opt.id}
                type="button"
                role="option"
                aria-selected={isSelected}
                onClick={() => {
                  onChange(opt.id)
                  setIsOpen(false)
                }}
                className={`w-full flex items-center justify-between gap-2 px-3 py-1.5 text-xs transition-colors ${
                  isSelected
                    ? "bg-accent-subtle text-accent font-semibold"
                    : "text-content-secondary hover:text-content-primary hover:bg-app-surface"
                }`}>
                <span className="flex items-center gap-2 truncate">
                  {opt.icon && <span className="shrink-0">{opt.icon}</span>}
                  <span className="truncate">{opt.label}</span>
                </span>
                {isSelected && <Check className="w-3.5 h-3.5 shrink-0" />}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
