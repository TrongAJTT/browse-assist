import type React from "react"

export interface SwitchProps {
  checked: boolean
  onChange: (checked: boolean) => void
  disabled?: boolean
  id?: string
  ariaLabel?: string
  className?: string
}

/**
 * Standardized Atomic Toggle Switch component for Browse Assist.
 * Ensures 100% consistent styling, animation transitions, and focus rings across the app.
 */
export const Switch: React.FC<SwitchProps> = ({
  checked,
  onChange,
  disabled = false,
  id,
  ariaLabel,
  className = ""
}) => {
  return (
    <button
      type="button"
      id={id}
      role="switch"
      aria-checked={checked}
      aria-label={ariaLabel}
      disabled={disabled}
      onClick={(e) => {
        e.stopPropagation()
        if (!disabled) {
          onChange(!checked)
        }
      }}
      className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-accent-hover focus:ring-offset-2 focus:ring-offset-app ${
        disabled
          ? "opacity-40 cursor-not-allowed bg-border-subtle"
          : checked
            ? "bg-accent-hover shadow-accent-glow shadow-sm"
            : "bg-border-subtle"
      } ${className}`}>
      <span className="sr-only">{ariaLabel || "Toggle switch"}</span>
      <span
        className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
          checked ? "translate-x-4" : "translate-x-0"
        }`}
      />
    </button>
  )
}
