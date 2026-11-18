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
import { useI18n } from "~core/useI18n"

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
  const { t } = useI18n()
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
      label: t("features.smoothScroll.settings.presetBalanced"),
      icon: <Gauge className="w-3.5 h-3.5" />
    },
    {
      id: "ultra",
      label: t("features.smoothScroll.settings.presetUltra"),
      icon: <Feather className="w-3.5 h-3.5" />
    },
    {
      id: "snappy",
      label: t("features.smoothScroll.settings.presetSnappy"),
      icon: <Zap className="w-3.5 h-3.5" />
    },
    {
      id: "custom",
      label: t("features.smoothScroll.settings.presetCustom"),
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
      title={t("features.smoothScroll.title")}
      enabled={isSmoothScrollEnabled}
      onToggle={handleToggleFeature}
      onBack={onBack}>
      {/* 4-item Horizontal SegmentedTabs for Profiles */}
      <div className="space-y-2">
        <span className="section-header">
          {t("features.smoothScroll.settings.profiles")}
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
          {t("features.smoothScroll.settings.fineTuning")}
        </span>

        {/* Step Size Slider */}
        <Slider
          label={t("features.smoothScroll.settings.scrollDistance")}
          value={currentConfig.stepSize}
          valueDisplay={`${currentConfig.stepSize.toFixed(1)}x`}
          min={0.5}
          max={2.0}
          step={0.1}
          onChange={(val) => handleUpdateParam("stepSize", val)}
        />

        {/* Gliding Duration Slider (right = longer glide / higher %) */}
        <Slider
          label={t("features.smoothScroll.settings.glidingDuration")}
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
          title={t("features.smoothScroll.settings.ignoreTouchpad")}
          description={t("features.smoothScroll.settings.ignoreTouchpadDesc")}
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
          title={t("features.smoothScroll.settings.keyboardScroll")}
          description={t("features.smoothScroll.settings.keyboardScrollDesc")}
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
          title={t("features.smoothScroll.settings.aggressiveMode")}
          description={t("features.smoothScroll.settings.aggressiveModeDesc")}
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
