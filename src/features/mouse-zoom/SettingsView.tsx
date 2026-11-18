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
import { Slider } from "~components/Slider"
import { SubSettingsLayout } from "~components/SubSettingsLayout"
import { MESSAGE_TYPES, sendToActiveTab } from "~core/messaging"
import {
  DEFAULT_SETTINGS,
  STORAGE_KEYS,
  type FeatureSettings,
  type MouseZoomConfig,
  type MouseZoomModifier
} from "~core/types"
import { useI18n } from "~core/useI18n"

interface MouseZoomSettingsViewProps {
  onBack: () => void
}

/**
 * Dedicated sub-settings view for Mouse Pin-to-Zoom.
 */
export const MouseZoomSettingsView: React.FC<MouseZoomSettingsViewProps> = ({
  onBack
}) => {
  const { t } = useI18n()
  const [settings, setSettings] = useStorage<FeatureSettings>(
    STORAGE_KEYS.SETTINGS,
    DEFAULT_SETTINGS
  )

  const modifierItems: GridPickerItem<MouseZoomModifier>[] = [
    {
      id: "alt",
      label: t("common.modifiers.altKey"),
      icon: <Command className="w-3.5 h-3.5" />
    },
    {
      id: "shift",
      label: t("common.modifiers.shiftKey"),
      icon: <Command className="w-3.5 h-3.5" />
    },
    {
      id: "right-click",
      label: t("common.modifiers.rightClick"),
      icon: <MousePointer className="w-3.5 h-3.5" />
    },
    {
      id: "left-click",
      label: t("common.modifiers.leftClick"),
      icon: <MousePointer className="w-3.5 h-3.5" />
    }
  ]

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
      title={t("features.mouseZoom.title")}
      enabled={isEnabled}
      onToggle={handleToggleFeature}
      onBack={onBack}
      rightActions={
        <button
          type="button"
          onClick={handleResetZoom}
          title={t("features.mouseZoom.settings.resetZoomTooltip")}
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
          {t("features.mouseZoom.settings.triggerModifier")}
        </span>

        <GridPicker<MouseZoomModifier>
          items={modifierItems}
          value={currentConfig.modifier}
          onChange={handleSelectModifier}
          columns={4}
        />
      </div>

      {/* Zoom Sensitivity / Step Size Slider */}
      <div className="space-y-4 pt-3 border-t border-border-divider">
        <span className="section-header">
          {t("features.mouseZoom.settings.zoomSensitivity")}
        </span>

        <Slider
          label={t("features.mouseZoom.settings.stepIncrement")}
          value={currentConfig.stepSize}
          valueDisplay={`${Math.round(currentConfig.stepSize * 100)}%`}
          min={0.04}
          max={0.25}
          step={0.01}
          onChange={handleUpdateStepSize}
          ticks={[
            { label: t("features.mouseZoom.settings.tickFine") },
            { label: t("features.mouseZoom.settings.tickDefault") },
            { label: t("features.mouseZoom.settings.tickFast") }
          ]}
        />
      </div>

      {/* Behavior Toggles */}
      <div className="space-y-1 pt-3 border-t border-border-divider">
        <span className="section-header">
          {t("features.mouseZoom.settings.behaviorDisplay")}
        </span>

        <div className="divide-y divide-border-divider">
          {/* Smooth Transition */}
          <SettingToggleRow
            icon={<Sparkles className="w-5 h-5 text-amber-400" />}
            title={t("features.mouseZoom.settings.smoothAnimation")}
            description={t("features.mouseZoom.settings.smoothAnimationDesc")}
            enabled={currentConfig.smooth}
            onToggle={() => handleToggleOption("smooth")}
          />

          {/* Invert Scroll Direction */}
          <SettingToggleRow
            icon={<ArrowUpDown className="w-5 h-5 text-cyan-400" />}
            title={t("features.mouseZoom.settings.invertDirection")}
            description={t("features.mouseZoom.settings.invertDirectionDesc")}
            enabled={currentConfig.invertDirection}
            onToggle={() => handleToggleOption("invertDirection")}
          />

          {/* Show Zoom Toast Badge */}
          <SettingToggleRow
            icon={<Eye className="w-5 h-5 text-violet-400" />}
            title={t("features.mouseZoom.settings.showZoomToast")}
            description={t("features.mouseZoom.settings.showZoomToastDesc")}
            enabled={currentConfig.showToast}
            onToggle={() => handleToggleOption("showToast")}
          />
        </div>
      </div>
    </SubSettingsLayout>
  )
}
