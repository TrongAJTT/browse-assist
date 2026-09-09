import {
  Compass,
  Link2,
  MousePointer2,
  MousePointerClick,
  PictureInPicture2,
  Pipette,
  Scroll,
  Volume2,
  Zap,
  ZoomIn
} from "lucide-react"
import type React from "react"

import type { FeatureKey } from "./types"

export interface FeatureIconProps {
  className?: string
}

/**
 * Unified UI specification for a Browse Assist feature.
 */
export interface FeatureCatalogItem {
  key: FeatureKey
  title: string
  description: string
  icon: React.ComponentType<FeatureIconProps>
  colorClass: string
  bgClass: string
  hasSettings?: boolean
}

/**
 * Single source of truth catalog for all Browse Assist features (UI presentation & icons).
 */
export const FEATURE_CATALOG: Record<FeatureKey, FeatureCatalogItem> = {
  allowRightClick: {
    key: "allowRightClick",
    title: "Allow Right Click",
    description:
      "Re-enable context menu, selection, and copy on restricted websites.",
    icon: MousePointerClick,
    colorClass: "text-emerald-400",
    bgClass: "bg-emerald-500/10 border-emerald-500/30"
  },
  contextMenuActions: {
    key: "contextMenuActions",
    title: "Context Menu Actions",
    description:
      "Custom right-click menu actions for copying clean, formatted links.",
    icon: Link2,
    colorClass: "text-cyan-400",
    bgClass: "bg-cyan-500/10 border-cyan-500/30",
    hasSettings: true
  },
  superDrag: {
    key: "superDrag",
    title: "Super Drag",
    description:
      "Drag selected text to search or drag hyperlinks to open in new tabs.",
    icon: MousePointer2,
    colorClass: "text-pink-400",
    bgClass: "bg-pink-500/10 border-pink-500/30",
    hasSettings: true
  },
  quickScroll: {
    key: "quickScroll",
    title: "Quick Scroll Buttons",
    description:
      "Floating smart buttons to smoothly jump to page top or bottom.",
    icon: Compass,
    colorClass: "text-indigo-400",
    bgClass: "bg-indigo-500/10 border-indigo-500/30",
    hasSettings: true
  },
  smoothScroll: {
    key: "smoothScroll",
    title: "Smooth Scrolling",
    description: "Enhanced, fluid page scrolling with interpolated physics.",
    icon: Scroll,
    colorClass: "text-amber-400",
    bgClass: "bg-amber-500/10 border-amber-500/30",
    hasSettings: true
  },
  mouseZoom: {
    key: "mouseZoom",
    title: "Mouse Pin-to-Zoom",
    description:
      "Hold modifier key and scroll mouse wheel to zoom into cursor position.",
    icon: ZoomIn,
    colorClass: "text-violet-400",
    bgClass: "bg-violet-500/10 border-violet-500/30",
    hasSettings: true
  },
  pictureInPicture: {
    key: "pictureInPicture",
    title: "Universal Picture-in-Picture",
    description: "Toggle floating video window using customizable shortcut.",
    icon: PictureInPicture2,
    colorClass: "text-indigo-400",
    bgClass: "bg-indigo-500/10 border-indigo-500/30",
    hasSettings: true
  },
  videoWheelControl: {
    key: "videoWheelControl",
    title: "Video Wheel Control",
    description:
      "Adjust video volume and playback speed smoothly using the mouse wheel.",
    icon: Volume2,
    colorClass: "text-violet-400",
    bgClass: "bg-violet-500/10 border-violet-500/30",
    hasSettings: true
  },
  colorPicker: {
    key: "colorPicker",
    title: "Color Picker",
    description:
      "Pick any pixel color from the screen with instant multi-format copy.",
    icon: Pipette,
    colorClass: "text-pink-400",
    bgClass: "bg-pink-500/10 border-pink-500/30",
    hasSettings: true
  },
  elementZapper: {
    key: "elementZapper",
    title: "Element Toys",
    description:
      "Inspect, zap, edit text, or reposition elements on any web page.",
    icon: Zap,
    colorClass: "text-amber-400",
    bgClass: "bg-amber-500/10 border-amber-500/30",
    hasSettings: true
  }
}

/**
 * Array view of all features for iteration (e.g. in Options page).
 */
export const FEATURE_CATALOG_LIST: FeatureCatalogItem[] =
  Object.values(FEATURE_CATALOG)
