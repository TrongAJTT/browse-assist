/**
 * In-memory per-tab dismissal registry for floating action buttons (FABs).
 * Intentionally ephemeral (not persisted to storage): resets on page reload
 * and does not affect other browser tabs.
 */

export type FabDismissKey = "quickHub" | "quickScroll" | "pipHover"

const dismissedKeys = new Set<FabDismissKey>()

export function dismissFabOnTab(key: FabDismissKey): void {
  dismissedKeys.add(key)
}

export function clearFabDismissedOnTab(key: FabDismissKey): void {
  dismissedKeys.delete(key)
}

export function isFabDismissedOnTab(key: FabDismissKey): boolean {
  return dismissedKeys.has(key)
}

export function resetAllFabDismissals(): void {
  dismissedKeys.clear()
}
