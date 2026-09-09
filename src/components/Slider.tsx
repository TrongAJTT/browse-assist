import type React from "react"

import { useDebouncedValue } from "~core/useDebounce"

export interface SliderProps {
  value: number
  onChange: (value: number) => void
  min: number
  max: number
  step?: number
  debounceMs?: number
  label?: string
  valueDisplay?: React.ReactNode
  helperText?: string
  ticks?: { label: string; position?: "start" | "middle" | "end" }[]
  className?: string
  ariaLabel?: string
  disabled?: boolean
}

/**
 * Standardized Atomic Slider component for Browse Assist.
 *
 * Implements a hybrid architecture:
 * 1. High-frequency local state updates during pointer dragging (smooth 60fps UI).
 * 2. Debounced commit (default 300ms) + immediate commit on pointer-up/touch-end to prevent
 *    exceeding Chrome storage write quotas (`MAX_WRITE_OPERATIONS_PER_MINUTE`).
 */
export const Slider: React.FC<SliderProps> = ({
  value: externalValue,
  onChange: onExternalCommit,
  min,
  max,
  step = 1,
  debounceMs = 300,
  label,
  valueDisplay,
  helperText,
  ticks,
  className = "",
  ariaLabel,
  disabled = false
}) => {
  const { value, setValue, commit } = useDebouncedValue(
    externalValue,
    onExternalCommit,
    debounceMs
  )

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nextVal = parseFloat(e.target.value)
    if (!isNaN(nextVal)) {
      setValue(nextVal)
    }
  }

  const handlePointerUp = () => {
    commit()
  }

  const handleKeyUp = (e: React.KeyboardEvent) => {
    if (
      [
        "ArrowLeft",
        "ArrowRight",
        "ArrowUp",
        "ArrowDown",
        "PageUp",
        "PageDown",
        "Home",
        "End"
      ].includes(e.key)
    ) {
      commit()
    }
  }

  return (
    <div className={`space-y-1.5 ${className}`}>
      {(label || valueDisplay) && (
        <div className="flex items-center justify-between text-xs">
          {label && (
            <span className="text-content-secondary font-medium">{label}</span>
          )}
          {valueDisplay && (
            <span className="font-mono text-accent font-semibold">
              {valueDisplay}
            </span>
          )}
        </div>
      )}

      {helperText && (
        <p className="text-[11px] text-content-muted leading-snug">
          {helperText}
        </p>
      )}

      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        disabled={disabled}
        aria-label={ariaLabel || label}
        onChange={handleChange}
        onPointerUp={handlePointerUp}
        onTouchEnd={handlePointerUp}
        onKeyUp={handleKeyUp}
        className={`w-full h-1.5 bg-app-card rounded-lg appearance-none cursor-pointer accent-accent hover:accent-accent-hover focus:outline-none transition-colors ${
          disabled ? "opacity-40 cursor-not-allowed" : ""
        }`}
      />

      {ticks && ticks.length > 0 && (
        <div className="flex justify-between text-[10px] text-content-muted">
          {ticks.map((tick, index) => (
            <span key={index}>{tick.label}</span>
          ))}
        </div>
      )}
    </div>
  )
}
