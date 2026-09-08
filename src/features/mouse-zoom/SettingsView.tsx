import {
  ArrowUpDown,
  Command,
  Eye,
  MousePointer,
  RotateCcw,
  Sparkles
} from "lucide-react"
import type React from "react"
import { useState } from "react"

import { useStorage } from "@plasmohq/storage/hook"

import { GridPicker, type GridPickerItem } from "~components/GridPicker"
import { SubSettingsLayout } from "~components/SubSettingsLayout"
import { sendToActiveTab } from "~core/messaging"
import {
  DEFAULT_SETTINGS,
  STORAGE_KEYS,
  type FeatureSettings,
  type MouseZoomConfig,
  type MouseZoomModifier
} from "~core/types"

interface MouseZoomSettingsViewProps {
  onBack: () => void
}

const MODIFIER_ITEMS: GridPickerItem<MouseZoomModifier>[] = [
  {
    id: "alt",
    label: "Alt Key",
    icon: <Command className="w-3.5 h-3.5" />
  },
  {
    id: "shift",
    label: "Shift Key",
    icon: <Command className="w-3.5 h-3.5" />
  },
  {
    id: "right-click",
    label: "Right Click",
    icon: <MousePointer className="w-3.5 h-3.5" />
  },
  {
    id: "left-click",
    label: "Left Click",
    icon: <MousePointer className="w-3.5 h-3.5" />
  }
]

/**
 * Dedicated sub-settings view for Mouse Pin-to-Zoom.
 */
export const MouseZoomSettingsView: React.FC<MouseZoomSettingsViewProps> = ({
  onBack
}) => {
  const [settings, setSettings] = useStorage<FeatureSettings>(
    STORAGE_KEYS.SETTINGS,
    DEFAULT_SETTINGS
  )

  const isEnabled = settings?.mouseZoom ?? DEFAULT_SETTINGS.mouseZoom
  const currentConfig: MouseZoomConfig =
    settings?.mouseZoomConfig ?? DEFAULT_SETTINGS.mouseZoomConfig

  const handleToggleFeature = (enabled: boolean) => {
    setSettings((prev) => ({
      ...(prev ?? DEFAULT_SETTINGS),
      mouseZoom: enabled
    }))
  }

  const handleSelectModifier = (modifier: MouseZoomModifier) => {
    setSettings((prev) => ({
      ...(prev ?? DEFAULT_SETTINGS),
      mouseZoomConfig: {
        ...(prev?.mouseZoomConfig ?? DEFAULT_SETTINGS.mouseZoomConfig),
        modifier
      }
    }))
  }

  const handleUpdateStepSize = (value: number) => {
    setSettings((prev) => ({
      ...(prev ?? DEFAULT_SETTINGS),
      mouseZoomConfig: {
        ...(prev?.mouseZoomConfig ?? DEFAULT_SETTINGS.mouseZoomConfig),
        stepSize: value
      }
    }))
  }

  const handleToggleOption = (
    key: "invertDirection" | "smooth" | "showToast"
  ) => {
    setSettings((prev) => ({
      ...(prev ?? DEFAULT_SETTINGS),
      mouseZoomConfig: {
        ...(prev?.mouseZoomConfig ?? DEFAULT_SETTINGS.mouseZoomConfig),
        [key]: !((prev?.mouseZoomConfig ?? DEFAULT_SETTINGS.mouseZoomConfig)[key])
      }
    }))
  }

  const [isResetting, setIsResetting] = useState(false)

  const handleResetZoom = async () => {
    setIsResetting(true)
    await sendToActiveTab("RESET_MOUSE_ZOOM")
    setTimeout(() => setIsResetting(false), 500)
  }

  return (
    <SubSettingsLayout
      title="Mouse Pin-to-Zoom"
      enabled={isEnabled}
      onToggle={handleToggleFeature}
      onBack={onBack}
      rightActions={
        <button
          type="button"
          onClick={handleResetZoom}
          title="Reset Zoom to 100% on current tab"
          className="flex items-center justify-center p-1.5 rounded-lg text-content-muted hover:text-content-primary hover:bg-app-card active:scale-95 transition-all focus:outline-none focus:ring-1 focus:ring-accent">
          <RotateCcw
            className={`w-3.5 h-3.5 transition-transform duration-500 ${
              isResetting ? "-rotate-180 text-accent" : ""
            }`}
          />
        </button>
      }>
      {/* Modifier Key Grid Picker */}
      <div className="space-y-2">
        <span className="section-header">
          Trigger Modifier Key
        </span>

        <GridPicker<MouseZoomModifier>
          items={MODIFIER_ITEMS}
          value={currentConfig.modifier}
          onChange={handleSelectModifier}
          columns={4}
        />
      </div>

      {/* Zoom Sensitivity / Step Size Slider */}
      <div className="space-y-4 pt-3 border-t border-border-divider">
        <span className="section-header">
          Zoom Sensitivity
        </span>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-content-secondary font-medium">Step Increment</span>
            <span className="font-mono text-accent font-semibold">
              {Math.round(currentConfig.stepSize * 100)}%
            </span>
          </div>
          <input
            type="range"
            min="0.04"
            max="0.25"
            step="0.01"
            value={currentConfig.stepSize}
            onChange={(e) => handleUpdateStepSize(parseFloat(e.target.value))}
            className="w-full h-1.5 bg-app-card rounded-lg appearance-none cursor-pointer accent-accent hover:accent-accent-hover"
          />
          <div className="flex justify-between text-[10px] text-content-muted">
            <span>4% (Fine)</span>
            <span>10% (Default)</span>
            <span>25% (Fast)</span>
          </div>
        </div>
      </div>

      {/* Behavior Toggles */}
      <div className="space-y-3 pt-3 border-t border-border-divider">
        <span className="section-header">
          Behavior & Display
        </span>

        {/* Smooth Transition */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex flex-col min-w-0 flex-1">
            <span className="text-xs font-semibold text-content-primary flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Smooth Animation
            </span>
            <span className="text-[11px] text-content-muted leading-snug mt-0.5">
              Smoothly interpolate zoom transitions for a fluid feel.
            </span>
          </div>

          <button
            type="button"
            role="switch"
            aria-checked={currentConfig.smooth}
            onClick={() => handleToggleOption("smooth")}
            className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-app ${
              currentConfig.smooth
                ? "bg-accent shadow-accent-glow"
                : "bg-border-subtle"
            }`}>
            <span
              className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                currentConfig.smooth ? "translate-x-4" : "translate-x-0"
              }`}
            />
          </button>
        </div>

        {/* Invert Scroll Direction */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex flex-col min-w-0 flex-1">
            <span className="text-xs font-semibold text-content-primary flex items-center gap-1.5">
              <ArrowUpDown className="w-3.5 h-3.5 text-cyan-400" />
              Invert Direction
            </span>
            <span className="text-[11px] text-content-muted leading-snug mt-0.5">
              Scroll down to zoom in, scroll up to zoom out.
            </span>
          </div>

          <button
            type="button"
            role="switch"
            aria-checked={currentConfig.invertDirection}
            onClick={() => handleToggleOption("invertDirection")}
            className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-app ${
              currentConfig.invertDirection
                ? "bg-accent shadow-accent-glow"
                : "bg-border-subtle"
            }`}>
            <span
              className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                currentConfig.invertDirection ? "translate-x-4" : "translate-x-0"
              }`}
            />
          </button>
        </div>

        {/* Show Zoom Toast Badge */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex flex-col min-w-0 flex-1">
            <span className="text-xs font-semibold text-content-primary flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5 text-violet-400" />
              Show Zoom Toast
            </span>
            <span className="text-[11px] text-content-muted leading-snug mt-0.5">
              Display floating percentage badge on the top-right of the page.
            </span>
          </div>

          <button
            type="button"
            role="switch"
            aria-checked={currentConfig.showToast}
            onClick={() => handleToggleOption("showToast")}
            className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-app ${
              currentConfig.showToast
                ? "bg-accent shadow-accent-glow"
                : "bg-border-subtle"
            }`}>
            <span
              className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                currentConfig.showToast ? "translate-x-4" : "translate-x-0"
              }`}
            />
          </button>
        </div>
      </div>
    </SubSettingsLayout>
  )
}
