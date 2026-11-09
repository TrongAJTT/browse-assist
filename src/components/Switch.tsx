import type React from "react"

export interface SwitchProps {
  checked: boolean
  onChange: (checked: boolean) => void
  disabled?: boolean
  size?: "sm" | "md"
  id?: string
  ariaLabel?: string
  className?: string
}

/**
 * Standardized Atomic Toggle Switch component for Browse Assist.
 * Supports "sm" (h-5 w-9) and "md" (h-6 w-11) sizes.
 * Ensures 100% consistent styling, animation transitions, and focus rings across the app.
 */
export const Switch: React.FC<SwitchProps> = ({
  checked,
  onChange,
  disabled = false,
  size = "sm",
  id,
  ariaLabel,
  className = ""
}) => {
  const isMd = size === "md"

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
      className={`relative inline-flex shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-accent-hover focus:ring-offset-2 focus:ring-offset-app ${
        isMd ? "h-6 w-11" : "h-5 w-9"
      } ${
        disabled
          ? "opacity-40 cursor-not-allowed bg-border-subtle"
          : checked
            ? "bg-accent-hover shadow-accent-glow shadow-sm"
            : "bg-border-subtle"
      } ${className}`}>
      <span className="sr-only">{ariaLabel || "Toggle switch"}</span>
      <span
        className={`pointer-events-none inline-block transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
          isMd
            ? `h-5 w-5 ${checked ? "translate-x-5" : "translate-x-0"}`
            : `h-4 w-4 ${checked ? "translate-x-4" : "translate-x-0"}`
        }`}
      />
    </button>
  )
}
