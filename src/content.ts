/**
 * Browse Assist - Content Script Entry Point
 * Orchestrates DOM listeners and page interventions based on user settings.
 */

import type { PlasmoCSConfig } from "plasmo"

import { isColorPickerSupported } from "~core/browserDetect"
import { clearFabDismissedOnTab, isFabDismissedOnTab } from "~core/fab"
import { setLocale } from "~core/i18n"
import { MESSAGE_TYPES } from "~core/messaging"
import {
  getStoredSettings,
  getStoredSiteRules,
  subscribeToSettings,
  subscribeToSiteRules
} from "~core/storage"
import { hasPathWildcardRules, isFeatureBlockedOnUrl } from "~core/siteRules"
import {
  DEFAULT_SITE_RULES,
  type FeatureKey,
  type FeatureSettings,
  type SiteRule
} from "~core/types"
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
import {
  activate as activateImageHoverPreview,
  deactivate as deactivateImageHoverPreview
} from "~features/image-hover-preview/logic"

export const config: PlasmoCSConfig = {
  matches: ["http://*/*", "https://*/*"],
  all_frames: false
}

let isElementToysEnabled = true
let latestSettings: FeatureSettings | null = null
let latestSiteRules: SiteRule[] = DEFAULT_SITE_RULES
let lastEvaluatedUrl = window.location.href
let spaWatchTimer: number | null = null

function isFeatureAllowed(
  feature: FeatureKey,
  globallyEnabled: boolean
): boolean {
  if (!globallyEnabled) return false
  return !isFeatureBlockedOnUrl(feature, window.location.href, latestSiteRules)
}

function syncSpaWatcher(): void {
  const needsTimer = hasPathWildcardRules(latestSiteRules)
  if (needsTimer && spaWatchTimer === null) {
    spaWatchTimer = window.setInterval(() => {
      if (window.location.href !== lastEvaluatedUrl && latestSettings) {
        applySettings(latestSettings)
      }
    }, 1000)
  } else if (!needsTimer && spaWatchTimer !== null) {
    window.clearInterval(spaWatchTimer)
    spaWatchTimer = null
  }
}

function applySettings(nextSettings: FeatureSettings): void {
  lastEvaluatedUrl = window.location.href
  // If the user explicitly re-enabled a feature in Popup after turning it off,
  // clear its per-tab dismissal so the FAB reappears as expected.
  if (latestSettings) {
    if (!latestSettings.quickScroll && nextSettings.quickScroll) {
      clearFabDismissedOnTab("quickScroll")
    }
    if (!latestSettings.quickHub && nextSettings.quickHub) {
      clearFabDismissedOnTab("quickHub")
    }
    if (
      !latestSettings.pictureInPictureConfig?.hoverButton &&
      nextSettings.pictureInPictureConfig?.hoverButton
    ) {
      clearFabDismissedOnTab("pipHover")
    }
  }
  latestSettings = nextSettings

  setLocale(nextSettings?.language ?? "auto")
  isElementToysEnabled = isFeatureAllowed(
    "elementToys",
    Boolean(nextSettings?.elementToys)
  )
  // Allow Right Click is managed per-tab on-demand, not auto-activated globally.

  // Context Menu Actions
  if (
    isFeatureAllowed(
      "contextMenuActions",
      Boolean(nextSettings.contextMenuActions)
    )
  ) {
    activateContextMenuActions()
  } else {
    deactivateContextMenuActions()
  }

  // Super Drag
  if (isFeatureAllowed("superDrag", Boolean(nextSettings.superDrag))) {
    activateSuperDrag(nextSettings.superDragConfig)
  } else {
    deactivateSuperDrag()
  }

  // Quick Scroll Buttons
  if (
    isFeatureAllowed("quickScroll", Boolean(nextSettings.quickScroll)) &&
    !isFabDismissedOnTab("quickScroll")
  ) {
    activateQuickScroll(nextSettings.quickScrollConfig, nextSettings.theme)
  } else {
    deactivateQuickScroll()
  }

  // Smooth Scroll
  if (isFeatureAllowed("smoothScroll", Boolean(nextSettings.smoothScroll))) {
    activateSmoothScroll(nextSettings.smoothScrollConfig)
  } else {
    deactivateSmoothScroll()
  }

  // Mouse Pin-to-Zoom
  if (isFeatureAllowed("mouseZoom", Boolean(nextSettings.mouseZoom))) {
    activateMouseZoom(nextSettings.mouseZoomConfig)
  } else {
    deactivateMouseZoom()
  }

  // Universal Picture-in-Picture
  if (
    isFeatureAllowed("pictureInPicture", Boolean(nextSettings.pictureInPicture))
  ) {
    activatePiP(nextSettings.pictureInPictureConfig)
  } else {
    deactivatePiP()
  }

  // Video Wheel Control
  if (
    isFeatureAllowed(
      "videoWheelControl",
      Boolean(nextSettings.videoWheelControl)
    )
  ) {
    activateVideoWheelControl(nextSettings.videoWheelControlConfig)
  } else {
    deactivateVideoWheelControl()
  }

  // ColorPick Eyedropper (Chromium only)
  if (
    isColorPickerSupported &&
    isFeatureAllowed("colorPicker", Boolean(nextSettings.colorPicker))
  ) {
    activateColorPicker(nextSettings.colorPickerConfig)
  } else {
    deactivateColorPicker()
  }

  // Element Toys
  if (isFeatureAllowed("elementToys", Boolean(nextSettings.elementToys))) {
    activateElementToys(nextSettings.elementToysConfig)
  } else {
    deactivateElementToys()
  }

  // Quick Hub
  if (
    isFeatureAllowed("quickHub", Boolean(nextSettings.quickHub)) &&
    !isFabDismissedOnTab("quickHub")
  ) {
    activateQuickHub(nextSettings.quickHubConfig)
  } else {
    deactivateQuickHub()
  }

  // Image Hover Preview
  if (
    isFeatureAllowed(
      "imageHoverPreview",
      Boolean(nextSettings.imageHoverPreview)
    )
  ) {
    activateImageHoverPreview(nextSettings.imageHoverPreviewConfig)
  } else {
    deactivateImageHoverPreview()
  }
}

/**
 * Initializes content script features.
 */
async function init(): Promise<void> {
  try {
    const [initialSettings, initialRules] = await Promise.all([
      getStoredSettings(),
      getStoredSiteRules()
    ])
    latestSiteRules = initialRules
    applySettings(initialSettings)
    syncSpaWatcher()

    // Watch for live setting updates from popup / options
    subscribeToSettings((updatedSettings) => {
      applySettings(updatedSettings)
    })

    // Watch for live site-rule updates from popup / options
    subscribeToSiteRules((updatedRules) => {
      latestSiteRules = updatedRules
      syncSpaWatcher()
      if (latestSettings) {
        applySettings(latestSettings)
      }
    })

    const handleUrlChange = () => {
      if (window.location.href !== lastEvaluatedUrl && latestSettings) {
        applySettings(latestSettings)
      }
    }
    window.addEventListener("popstate", handleUrlChange)
    window.addEventListener("hashchange", handleUrlChange)

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
        if (
          !isFeatureAllowed("quickHub", Boolean(latestSettings?.quickHub))
        ) {
          sendResponse({ success: false })
          return true
        }
        if (isFabDismissedOnTab("quickHub") && latestSettings?.quickHub) {
          clearFabDismissedOnTab("quickHub")
          activateQuickHub(latestSettings.quickHubConfig)
        }
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
