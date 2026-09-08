/**
 * Browse Assist - Background Service Worker Entry Point
 * Orchestrates background workers and services across extension features.
 */

import { initCopyLinkBackground } from "~features/copy-link-text/background"

// Initialize background handlers
initCopyLinkBackground().catch((err) => {
  console.error("Failed to initialize copy-link background service:", err)
})
