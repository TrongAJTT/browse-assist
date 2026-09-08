/**
 * Browse Assist - Content Script Entry Point
 * Orchestrates DOM listeners and page interventions based on user settings.
 */

import type { PlasmoCSConfig } from "plasmo"

import { getStoredSettings, subscribeToSettings } from "~core/storage"
import type { FeatureSettings } from "~core/types"
import {
  activate as activateRightClick,
  deactivate as deactivateRightClick,
  isRightClickActive
} from "~features/allow-right-click/logic"
import {
  activate as activateContextMenuActions,
  deactivate as deactivateContextMenuActions
} from "~features/context-menu-actions/logic"
import {
  activate as activateMouseZoom,
  deactivate as deactivateMouseZoom
} from "~features/mouse-zoom/logic"
import {
  activate as activatePiP,
  deactivate as deactivatePiP
} from "~features/picture-in-picture/logic"
import {
  activate as activateQuickScroll,
  deactivate as deactivateQuickScroll
} from "~features/quick-scroll/logic"
import {
  activate as activateSmoothScroll,
  deactivate as deactivateSmoothScroll
} from "~features/smooth-scroll/logic"
import {
  activate as activateSuperDrag,
  deactivate as deactivateSuperDrag
} from "~features/super-drag/logic"

export const config: PlasmoCSConfig = {
  matches: ["http://*/*", "https://*/*"],
  all_frames: false
}

function applySettings(nextSettings: FeatureSettings): void {
  // Allow Right Click is managed per-tab on-demand, not auto-activated globally.

  // Context Menu Actions
  if (nextSettings.contextMenuActions) {
    activateContextMenuActions()
  } else {
    deactivateContextMenuActions()
  }

  // Super Drag
  if (nextSettings.superDrag) {
    activateSuperDrag(nextSettings.superDragConfig)
  } else {
    deactivateSuperDrag()
  }

  // Quick Scroll Buttons
  if (nextSettings.quickScroll) {
    activateQuickScroll(nextSettings.quickScrollConfig)
  } else {
    deactivateQuickScroll()
  }

  // Smooth Scroll
  if (nextSettings.smoothScroll) {
    activateSmoothScroll(nextSettings.smoothScrollConfig)
  } else {
    deactivateSmoothScroll()
  }

  // Mouse Pin-to-Zoom
  if (nextSettings.mouseZoom) {
    activateMouseZoom(nextSettings.mouseZoomConfig)
  } else {
    deactivateMouseZoom()
  }

  // Universal Picture-in-Picture
  if (nextSettings.pictureInPicture) {
    activatePiP(nextSettings.pictureInPictureConfig)
  } else {
    deactivatePiP()
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

    // Listen for tab-scoped commands (e.g. per-tab Allow Right Click)
    chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
      if (message?.type === "GET_RIGHT_CLICK_STATUS") {
        sendResponse({ active: isRightClickActive() })
        return true
      }
      if (message?.type === "TOGGLE_RIGHT_CLICK") {
        if (message.enabled) {
          activateRightClick()
        } else {
          deactivateRightClick()
        }
        sendResponse({ active: isRightClickActive() })
        return true
      }
      if (message?.type === "RESET_MOUSE_ZOOM") {
        if (typeof window !== "undefined" && document.body) {
          document.body.style.removeProperty("zoom")
          document.body.style.removeProperty("transition")
          const toast = document.getElementById("browse-assist-zoom-toast")
          if (toast && toast.parentNode) {
            toast.parentNode.removeChild(toast)
          }
        }
        sendResponse({ success: true })
        return true
      }
    })
  } catch (error) {
    console.error("Browse Assist: Failed to initialize content features", error)
  }
}

// Start orchestration
init()
