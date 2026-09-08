/**
 * Browse Assist - Background Service Worker Entry Point
 * Orchestrates background workers and services across extension features.
 */

import { initContextMenuActionsBackground } from "~features/context-menu-actions/background"
import { initSuperDragBackground } from "~features/super-drag/background"

// Initialize background handlers
initContextMenuActionsBackground().catch((err) => {
  console.error("Failed to initialize context-menu-actions background service:", err)
})

initSuperDragBackground().catch((err) => {
  console.error("Failed to initialize super-drag background service:", err)
})


