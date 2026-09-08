/**
 * Browse Assist - Background Service Worker Entry Point
 * Orchestrates background workers and services across extension features.
 */

import { initAllowRightClickBackground } from "~features/allow-right-click/background"
import { initContextMenuActionsBackground } from "~features/context-menu-actions/background"
import { initPictureInPictureBackground } from "~features/picture-in-picture/background"
import { initSuperDragBackground } from "~features/super-drag/background"

// Initialize background handlers
initAllowRightClickBackground().catch((err) => {
  console.error("Failed to initialize allow-right-click background service:", err)
})

initContextMenuActionsBackground().catch((err) => {
  console.error("Failed to initialize context-menu-actions background service:", err)
})

initSuperDragBackground().catch((err) => {
  console.error("Failed to initialize super-drag background service:", err)
})

initPictureInPictureBackground().catch((err) => {
  console.error("Failed to initialize picture-in-picture background service:", err)
})

import { initColorPickerBackground } from "~features/color-picker/background"

initColorPickerBackground().catch((err) => {
  console.error("Failed to initialize color-picker background service:", err)
})


