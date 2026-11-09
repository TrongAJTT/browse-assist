/**
 * Browse Assist - Content Script Entry Point
 * Orchestrates DOM listeners and page interventions based on user settings.
 */

import type { PlasmoCSConfig } from "plasmo"

import { isColorPickerSupported } from "~core/browserDetect"
import { MESSAGE_TYPES } from "~core/messaging"
import { getStoredSettings, subscribeToSettings } from "~core/storage"
import type { FeatureSettings } from "~core/types"
import {
  activate as activateRightClick,
  deactivate as deactivateRightClick,
  isRightClickActive,
  toggleRightClick
} from "~features/allow-right-click/logic"
import {
  activate as activateContextMenuActions,
  deactivate as deactivateContextMenuActions
} from "~features/context-menu-actions/logic"
import {
  activate as activateMouseZoom,
  deactivate as deactivateMouseZoom,
  resetZoom as resetMouseZoom
} from "~features/mouse-zoom/logic"
import {
  activate as activatePiP,
  deactivate as deactivatePiP
} from "~features/picture-in-picture/logic"
import {
  activate as activateVideoWheelControl,
  deactivate as deactivateVideoWheelControl
} from "~features/video-wheel-control/logic"
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
import {
  activate as activateColorPicker,
  deactivate as deactivateColorPicker
} from "~features/color-picker/logic"
import {
  activate as activateElementToys,
  deactivate as deactivateElementToys,
  startZapping as startElementToys
} from "~features/element-toys/logic"
import {
  activate as activateQuickHub,
  deactivate as deactivateQuickHub,
  toggleQuickHubMenu
} from "~features/quick-hub/logic"

export const config: PlasmoCSConfig = {
  matches: ["http://*/*", "https://*/*"],
  all_frames: false
}

let isElementToysEnabled = true

function applySettings(nextSettings: FeatureSettings): void {
  isElementToysEnabled = Boolean(nextSettings?.elementToys)
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
    activateQuickScroll(nextSettings.quickScrollConfig, nextSettings.theme)
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

  // Video Wheel Control
  if (nextSettings.videoWheelControl) {
    activateVideoWheelControl(nextSettings.videoWheelControlConfig)
  } else {
    deactivateVideoWheelControl()
  }

  // ColorPick Eyedropper (Chromium only)
  if (isColorPickerSupported && nextSettings.colorPicker) {
    activateColorPicker(nextSettings.colorPickerConfig)
  } else {
    deactivateColorPicker()
  }

  // Element Toys
  if (nextSettings.elementToys) {
    activateElementToys(nextSettings.elementToysConfig)
  } else {
    deactivateElementToys()
  }

  // Quick Hub
  if (nextSettings.quickHub) {
    activateQuickHub(nextSettings.quickHubConfig)
  } else {
    deactivateQuickHub()
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
      const msgType = message?.type || message?.action

      if (msgType === MESSAGE_TYPES.GET_RIGHT_CLICK_STATUS) {
        sendResponse({ active: isRightClickActive() })
        return true
      }
      if (msgType === MESSAGE_TYPES.TOGGLE_RIGHT_CLICK) {
        if (message.enabled) {
          activateRightClick()
        } else {
          deactivateRightClick()
        }
        sendResponse({ active: isRightClickActive() })
        return true
      }
      if (msgType === MESSAGE_TYPES.TOGGLE_RIGHT_CLICK_SHORTCUT) {
        const nextState = toggleRightClick(true)
        sendResponse({ active: nextState })
        return true
      }
      if (msgType === MESSAGE_TYPES.RESET_MOUSE_ZOOM) {
        resetMouseZoom()
        sendResponse({ success: true })
        return true
      }
      if (msgType === MESSAGE_TYPES.TRIGGER_ELEMENT_TOYS) {
        startElementToys()
        sendResponse({ success: true })
        return true
      }
      if (msgType === MESSAGE_TYPES.TOGGLE_QUICK_HUB) {
        toggleQuickHubMenu()
        sendResponse({ success: true })
        return true
      }
    })

    // In-page keyboard shortcut capture for Element Toys (Alt+Shift+Z)
    // Intercepts and stops event before browser/page can hijack it
    window.addEventListener(
      "keydown",
      (e) => {
        if (
          isElementToysEnabled &&
          e.altKey &&
          e.shiftKey &&
          (e.key?.toLowerCase() === "z" || e.code === "KeyZ")
        ) {
          e.preventDefault()
          e.stopPropagation()
          e.stopImmediatePropagation()
          startElementToys()
        }
      },
      { capture: true }
    )
  } catch (error) {
    console.error("Browse Assist: Failed to initialize content features", error)
  }
}

// Start orchestration
init()
