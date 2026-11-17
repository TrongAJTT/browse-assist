import { Feather, Gauge, Keyboard, Laptop, ShieldAlert, Sliders, Zap } from "lucide-react"
import type React from "react"

import { useStorage } from "@plasmohq/storage/hook"

import { SegmentedTabs, type SegmentedTabItem } from "~components/SegmentedTabs"
import { SettingToggleRow } from "~components/SettingToggleRow"
import { Slider } from "~components/Slider"
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

    setSettings((prev) => {
      const prevConfig =
        prev?.smoothScrollConfig ?? DEFAULT_SETTINGS.smoothScrollConfig
      return {
        ...(prev ?? DEFAULT_SETTINGS),
        smoothScrollConfig: {
          ...prevConfig,
          ...SMOOTH_SCROLL_PRESETS[preset]
        }
      }
    })
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

  const profileGridItems: SegmentedTabItem<SmoothScrollPreset>[] = [
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
      {/* 4-item Horizontal SegmentedTabs for Profiles */}
      <div className="space-y-2">
        <span className="section-header">
          Profiles
        </span>

        <SegmentedTabs<SmoothScrollPreset>
          items={profileGridItems}
          value={currentConfig.preset}
          onChange={handleSelectPreset}
        />
      </div>

      {/* Fine-Tuning Physics Sliders (without enclosing cards) */}
      <div className="space-y-4 pt-3 border-t border-border-divider">
        <span className="section-header">
          Fine Tuning
        </span>

        {/* Step Size Slider */}
        <Slider
          label="Scroll Distance"
          value={currentConfig.stepSize}
          valueDisplay={`${currentConfig.stepSize.toFixed(1)}x`}
          min={0.5}
          max={2.0}
          step={0.1}
          onChange={(val) => handleUpdateParam("stepSize", val)}
        />

        {/* Gliding Duration Slider (right = longer glide / higher %) */}
        <Slider
          label="Gliding Duration"
          value={Number((0.45 - currentConfig.smoothness).toFixed(2))}
          valueDisplay={`${Math.round((1 - currentConfig.smoothness) * 100)}%`}
          min={0.05}
          max={0.4}
          step={0.01}
          onChange={(val) =>
            handleUpdateParam("smoothness", Number((0.45 - val).toFixed(2)))
          }
        />
      </div>

      {/* Behavior & Compatibility Toggles */}
      <div className="pt-3 border-t border-border-divider divide-y divide-border-divider">
        <SettingToggleRow
          icon={<Laptop className="w-5 h-5 text-sky-400" />}
          title="Ignore Touchpad"
          description="Keep native OS trackpad inertia by bypassing small-delta wheel events."
          enabled={Boolean(currentConfig.ignoreTouchpad)}
          onToggle={(enabled) => {
            setSettings((prev) => ({
              ...(prev ?? DEFAULT_SETTINGS),
              smoothScrollConfig: {
                ...(prev?.smoothScrollConfig ??
                  DEFAULT_SETTINGS.smoothScrollConfig),
                ignoreTouchpad: enabled
              }
            }))
          }}
        />

        <SettingToggleRow
          icon={<Keyboard className="w-5 h-5 text-indigo-400" />}
          title="Keyboard Smooth Scroll"
          description="Smoothly interpolate scrolling with Arrow, PageUp/Down, and Space keys."
          enabled={Boolean(currentConfig.keyboardScroll)}
          onToggle={(enabled) => {
            setSettings((prev) => ({
              ...(prev ?? DEFAULT_SETTINGS),
              smoothScrollConfig: {
                ...(prev?.smoothScrollConfig ??
                  DEFAULT_SETTINGS.smoothScrollConfig),
                keyboardScroll: enabled
              }
            }))
          }}
        />

        <SettingToggleRow
          icon={<ShieldAlert className="w-5 h-5 text-amber-400" />}
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
