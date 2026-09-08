import { Feather, Gauge, Sliders, Zap } from "lucide-react"
import type React from "react"

import { useStorage } from "@plasmohq/storage/hook"

import { GridPicker } from "~components/GridPicker"
import { SettingToggleRow } from "~components/SettingToggleRow"
import { SubSettingsLayout } from "~components/SubSettingsLayout"
import {
  DEFAULT_SETTINGS,
  SMOOTH_SCROLL_PRESETS,
  STORAGE_KEYS,
  type FeatureSettings,
  type SmoothScrollConfig,
  type SmoothScrollPreset
} from "~core/types"

interface SmoothScrollSettingsViewProps {
  onBack: () => void
}

/**
 * Checks if the given stepSize and smoothness match one of the predefined profiles.
 */
function resolvePresetFromParams(
  stepSize: number,
  smoothness: number
): SmoothScrollPreset {
  const eps = 0.01
  for (const [key, config] of Object.entries(SMOOTH_SCROLL_PRESETS)) {
    if (
      Math.abs(config.stepSize - stepSize) < eps &&
      Math.abs(config.smoothness - smoothness) < eps
    ) {
      return key as SmoothScrollPreset
    }
  }
  return "custom"
}

/**
 * Dedicated sub-settings view for Smooth Scrolling using the standardized layout.
 */
export const SmoothScrollSettingsView: React.FC<
  SmoothScrollSettingsViewProps
> = ({ onBack }) => {
  const [settings, setSettings] = useStorage<FeatureSettings>(
    STORAGE_KEYS.SETTINGS,
    DEFAULT_SETTINGS
  )

  const currentConfig: SmoothScrollConfig =
    settings?.smoothScrollConfig ?? DEFAULT_SETTINGS.smoothScrollConfig

  const handleSelectPreset = (preset: SmoothScrollPreset) => {
    if (preset === "custom") {
      setSettings((prev) => ({
        ...(prev ?? DEFAULT_SETTINGS),
        smoothScrollConfig: {
          ...(prev?.smoothScrollConfig ?? DEFAULT_SETTINGS.smoothScrollConfig),
          preset: "custom"
        }
      }))
      return
    }

    const nextConfig = { ...SMOOTH_SCROLL_PRESETS[preset] }
    setSettings((prev) => ({
      ...(prev ?? DEFAULT_SETTINGS),
      smoothScrollConfig: nextConfig
    }))
  }

  const handleUpdateParam = (key: "stepSize" | "smoothness", value: number) => {
    setSettings((prev) => {
      const baseConfig =
        prev?.smoothScrollConfig ?? DEFAULT_SETTINGS.smoothScrollConfig
      const newStep = key === "stepSize" ? value : baseConfig.stepSize
      const newSmooth = key === "smoothness" ? value : baseConfig.smoothness
      const detectedPreset = resolvePresetFromParams(newStep, newSmooth)

      return {
        ...(prev ?? DEFAULT_SETTINGS),
        smoothScrollConfig: {
          ...baseConfig,
          [key]: value,
          preset: detectedPreset
        }
      }
    })
  }

  const profileGridItems: {
    id: SmoothScrollPreset
    label: string
    icon: React.ReactNode
  }[] = [
    {
      id: "balanced",
      label: "Balanced",
      icon: <Gauge className="w-3.5 h-3.5" />
    },
    {
      id: "ultra",
      label: "Ultra",
      icon: <Feather className="w-3.5 h-3.5" />
    },
    {
      id: "snappy",
      label: "Snappy",
      icon: <Zap className="w-3.5 h-3.5" />
    },
    {
      id: "custom",
      label: "Custom",
      icon: <Sliders className="w-3.5 h-3.5" />
    }
  ]

  const isSmoothScrollEnabled =
    settings?.smoothScroll ?? DEFAULT_SETTINGS.smoothScroll

  const handleToggleFeature = (enabled: boolean) => {
    setSettings((prev) => ({
      ...(prev ?? DEFAULT_SETTINGS),
      smoothScroll: enabled
    }))
  }

  return (
    <SubSettingsLayout
      title="Smooth Scrolling"
      enabled={isSmoothScrollEnabled}
      onToggle={handleToggleFeature}
      onBack={onBack}>
      {/* 4-item Horizontal Grid Picker for Profiles including Custom */}
      <div className="space-y-2">
        <span className="section-header">
          Profiles
        </span>

        <GridPicker
          items={profileGridItems}
          value={currentConfig.preset}
          onChange={handleSelectPreset}
          columns={4}
        />
      </div>

      {/* Fine-Tuning Physics Sliders (without enclosing cards) */}
      <div className="space-y-4 pt-3 border-t border-border-divider">
        <span className="section-header">
          Fine Tuning
        </span>

        {/* Step Size Slider */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-content-secondary font-medium">Scroll Distance</span>
            <span className="font-mono text-accent font-semibold">
              {currentConfig.stepSize.toFixed(1)}x
            </span>
          </div>
          <input
            type="range"
            min="0.5"
            max="2.0"
            step="0.1"
            value={currentConfig.stepSize}
            onChange={(e) =>
              handleUpdateParam("stepSize", parseFloat(e.target.value))
            }
            className="w-full h-1.5 bg-app-card rounded-lg appearance-none cursor-pointer accent-accent focus:outline-none"
          />
        </div>

        {/* Smoothness Slider */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-content-secondary font-medium">Gliding Duration</span>
            <span className="font-mono text-accent font-semibold">
              {Math.round((1 - currentConfig.smoothness) * 100)}%
            </span>
          </div>
          <input
            type="range"
            min="0.05"
            max="0.4"
            step="0.01"
            value={currentConfig.smoothness}
            onChange={(e) =>
              handleUpdateParam("smoothness", parseFloat(e.target.value))
            }
            className="w-full h-1.5 bg-app-card rounded-lg appearance-none cursor-pointer accent-accent focus:outline-none"
          />
        </div>
      </div>

      {/* Advanced Compatibility Mode */}
      <div className="pt-3 border-t border-border-divider">
        <SettingToggleRow
          title="Aggressive Interception"
          description="Force smooth scrolling across all sites. Keep disabled to protect canvas & web apps (e.g. Konva, Figma, Maps)."
          enabled={currentConfig.interceptionMode === "aggressive"}
          onToggle={() => {
            const nextMode =
              currentConfig.interceptionMode === "aggressive"
                ? "smart"
                : "aggressive"
            setSettings((prev) => ({
              ...(prev ?? DEFAULT_SETTINGS),
              smoothScrollConfig: {
                ...(prev?.smoothScrollConfig ??
                  DEFAULT_SETTINGS.smoothScrollConfig),
                interceptionMode: nextMode
              }
            }))
          }}
        />
      </div>
    </SubSettingsLayout>
  )
}
