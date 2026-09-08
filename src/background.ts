/**
 * Browse Assist - Background Service Worker Entry Point
 * Orchestrates background workers and services across extension features.
 */

import { initContextMenuActionsBackground } from "~features/context-menu-actions/background"

// Initialize background handlers
initContextMenuActionsBackground().catch((err) => {
  console.error("Failed to initialize context-menu-actions background service:", err)
})

