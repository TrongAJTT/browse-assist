/**
 * Browse Assist - Content Script Entry Point
 * Orchestrates DOM listeners and page interventions based on user settings.
 */

import type { PlasmoCSConfig } from "plasmo"

import { getStoredSettings, subscribeToSettings } from "~core/storage"
import type { FeatureSettings } from "~core/types"
import {
  activate as activateRightClick,
  deactivate as deactivateRightClick
} from "~features/allow-right-click/logic"
import {
  activate as activateCopyLink,
  deactivate as deactivateCopyLink
} from "~features/copy-link-text/logic"
import {
  activate as activateMouseZoom,
  deactivate as deactivateMouseZoom
} from "~features/mouse-zoom/logic"
import {
  activate as activateSmoothScroll,
  deactivate as deactivateSmoothScroll
} from "~features/smooth-scroll/logic"

export const config: PlasmoCSConfig = {
  matches: ["http://*/*", "https://*/*"],
  all_frames: false
}

function applySettings(nextSettings: FeatureSettings): void {
  // Allow Right Click
  if (nextSettings.allowRightClick) {
    activateRightClick()
  } else {
    deactivateRightClick()
  }

  // Copy Link Text
  if (nextSettings.copyLinkText) {
    activateCopyLink()
  } else {
    deactivateCopyLink()
  }

  // Smooth Scroll
  if (nextSettings.smoothScroll) {
    activateSmoothScroll()
  } else {
    deactivateSmoothScroll()
  }

  // Mouse Pin-to-Zoom
  if (nextSettings.mouseZoom) {
    activateMouseZoom()
  } else {
    deactivateMouseZoom()
  }
}

/**
 * Initializes content script features.
 */
async function init(): Promise<void> {
  try {
    const initialSettings = await getStoredSettings()
    applySettings(initialSettings)

    // Watch for live setting updates from popup
    subscribeToSettings((updatedSettings) => {
      applySettings(updatedSettings)
    })
  } catch (error) {
    console.error("Browse Assist: Failed to initialize content features", error)
  }
}

// Start orchestration
init()
