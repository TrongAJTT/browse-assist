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
import { SettingToggleRow } from "~components/SettingToggleRow"
import { SubSettingsLayout } from "~components/SubSettingsLayout"
import { MESSAGE_TYPES, sendToActiveTab } from "~core/messaging"
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
        [key]: !(prev?.mouseZoomConfig ?? DEFAULT_SETTINGS.mouseZoomConfig)[key]
      }
    }))
  }

  const [isResetting, setIsResetting] = useState(false)

  const handleResetZoom = async () => {
    setIsResetting(true)
    await sendToActiveTab(MESSAGE_TYPES.RESET_MOUSE_ZOOM)
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
        <span className="section-header">Trigger Modifier Key</span>

        <GridPicker<MouseZoomModifier>
          items={MODIFIER_ITEMS}
          value={currentConfig.modifier}
          onChange={handleSelectModifier}
          columns={4}
        />
      </div>

      {/* Zoom Sensitivity / Step Size Slider */}
      <div className="space-y-4 pt-3 border-t border-border-divider">
        <span className="section-header">Zoom Sensitivity</span>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-content-secondary font-medium">
              Step Increment
            </span>
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
      <div className="space-y-1 pt-3 border-t border-border-divider">
        <span className="section-header">Behavior & Display</span>

        <div className="divide-y divide-border-divider">
          {/* Smooth Transition */}
          <SettingToggleRow
            icon={<Sparkles className="w-5 h-5 text-amber-400" />}
            title="Smooth Animation"
            description="Smoothly interpolate zoom transitions for a fluid feel."
            enabled={currentConfig.smooth}
            onToggle={() => handleToggleOption("smooth")}
          />

          {/* Invert Scroll Direction */}
          <SettingToggleRow
            icon={<ArrowUpDown className="w-5 h-5 text-cyan-400" />}
            title="Invert Direction"
            description="Scroll down to zoom in, scroll up to zoom out."
            enabled={currentConfig.invertDirection}
            onToggle={() => handleToggleOption("invertDirection")}
          />

          {/* Show Zoom Toast Badge */}
          <SettingToggleRow
            icon={<Eye className="w-5 h-5 text-violet-400" />}
            title="Show Zoom Toast"
            description="Display floating percentage badge on the top-right of the page."
            enabled={currentConfig.showToast}
            onToggle={() => handleToggleOption("showToast")}
          />
        </div>
      </div>
    </SubSettingsLayout>
  )
}
