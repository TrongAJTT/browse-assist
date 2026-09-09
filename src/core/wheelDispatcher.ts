/**
 * Central Wheel Decision Dispatcher
 *
 * Coordinates wheel event handlers across features (Video Wheel Control,
 * Mouse Pin-to-Zoom, Smooth Scroll) to prevent race conditions, multiple handlers,
 * and unintentional conflicting triggers.
 *
 * Pattern: Chain of Responsibility (GoF) with Priority Ordering.
 */

export type WheelDecisionHandler = (event: WheelEvent) => boolean

export interface WheelSubscriber {
  id: string
  /**
   * Higher priority numbers are evaluated first.
   * e.g.:
   * 100: Contextual media interventions (Video Wheel Control)
   * 50: Page modification actions (Mouse Pin-to-Zoom)
   * 10: General navigation / smoothing (Smooth Scroll)
   */
  priority: number
  handler: WheelDecisionHandler
}

const subscribers: WheelSubscriber[] = []
let isListening = false

function onGlobalWheel(event: WheelEvent): void {
  // If subscribers are registered, iterate through sorted priority list
  for (const subscriber of subscribers) {
    try {
      const handled = subscriber.handler(event)
      if (handled) {
        // Event was consumed: prevent browser default and halt further listeners
        event.preventDefault()
        event.stopPropagation()
        event.stopImmediatePropagation()
        return
      }
    } catch (err) {
      console.error(
        `[Browse Assist] Wheel subscriber '${subscriber.id}' error:`,
        err
      )
    }
  }
}

function ensureListener(): void {
  if (!isListening && typeof window !== "undefined") {
    window.addEventListener("wheel", onGlobalWheel, {
      capture: true,
      passive: false
    })
    isListening = true
  }
}

function checkCleanupListener(): void {
  if (
    isListening &&
    subscribers.length === 0 &&
    typeof window !== "undefined"
  ) {
    window.removeEventListener("wheel", onGlobalWheel, { capture: true })
    isListening = false
  }
}

/**
 * Registers or updates a subscriber in the wheel dispatcher.
 */
export function registerWheelSubscriber(subscriber: WheelSubscriber): void {
  const existingIdx = subscribers.findIndex((s) => s.id === subscriber.id)
  if (existingIdx !== -1) {
    subscribers[existingIdx] = subscriber
  } else {
    subscribers.push(subscriber)
  }

  // Sort descending: highest priority first
  subscribers.sort((a, b) => b.priority - a.priority)
  ensureListener()
}

/**
 * Removes a subscriber by ID. Cleans up global window listener if no subscribers remain.
 */
export function unregisterWheelSubscriber(id: string): void {
  const idx = subscribers.findIndex((s) => s.id === id)
  if (idx !== -1) {
    subscribers.splice(idx, 1)
  }
  checkCleanupListener()
}
