import { useCallback, useEffect, useRef, useState } from "react"

/**
 * Custom hook providing a debounced stream-like sink for high-frequency value changes
 * (such as drag inputs, sliders, search boxes).
 *
 * - `value`: Local state updating immediately (60fps) for instant UI feedback.
 * - `commit`: Immediately pushes the current value to the target sink (e.g. storage), cancelling pending timers.
 * - `setValue`: High-frequency setter that schedules a debounced call to `onCommit`.
 *
 * @param externalValue The canonical value from persistent storage or props.
 * @param onCommit Callback to persist the value once debounced or explicitly committed.
 * @param delay Debounce delay in milliseconds (default: 300ms).
 */
export function useDebouncedValue<T>(
  externalValue: T,
  onCommit: (value: T) => void,
  delay = 300
) {
  const [value, setValueState] = useState<T>(externalValue)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const latestValueRef = useRef<T>(externalValue)
  const onCommitRef = useRef(onCommit)
  onCommitRef.current = onCommit

  // Synchronize when canonical externalValue changes from outside
  useEffect(() => {
    setValueState(externalValue)
    latestValueRef.current = externalValue
  }, [externalValue])

  // Explicit immediate commit (e.g. onPointerUp / onKeyUp)
  const commit = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
    onCommitRef.current(latestValueRef.current)
  }, [])

  // High frequency setter (e.g. onChange)
  const setValue = useCallback(
    (newValue: T | ((prev: T) => T)) => {
      setValueState((prev) => {
        const resolved =
          typeof newValue === "function"
            ? (newValue as (prev: T) => T)(prev)
            : newValue
        latestValueRef.current = resolved

        if (timerRef.current) {
          clearTimeout(timerRef.current)
        }

        timerRef.current = setTimeout(() => {
          timerRef.current = null
          onCommitRef.current(resolved)
        }, delay)

        return resolved
      })
    },
    [delay]
  )

  // Cleanup pending debounce timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }
    }
  }, [])

  return {
    value,
    setValue,
    commit
  }
}
