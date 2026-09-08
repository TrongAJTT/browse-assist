import { Feather, Gauge, Scroll, Sliders, Zap } from "lucide-react"
import type React from "react"

import { useStorage } from "@plasmohq/storage/hook"

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

  return (
    <SubSettingsLayout
      title="Smooth Scroll Settings"
      icon={<Scroll className="w-4 h-4 text-amber-400" />}
      onBack={onBack}>
      {/* 4-item Horizontal Grid Picker for Profiles including Custom */}
      <div className="space-y-2">
        <span className="text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
          Profiles
        </span>

        <div className="grid grid-cols-4 gap-1.5">
          {profileGridItems.map((item) => {
            const isSelected = currentConfig.preset === item.id
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleSelectPreset(item.id)}
                className={`flex flex-col items-center justify-center gap-1.5 py-2 px-1 rounded-xl border transition-all ${
                  isSelected
                    ? "bg-indigo-600/20 border-indigo-500 text-indigo-300 shadow-sm"
                    : "bg-slate-800/40 hover:bg-slate-800 border-slate-700/60 text-slate-400 hover:text-slate-200"
                }`}>
                <span
                  className={isSelected ? "text-indigo-400" : "text-slate-400"}>
                  {item.icon}
                </span>
                <span className="text-[11px] font-semibold text-center leading-tight truncate w-full">
                  {item.label}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Fine-Tuning Physics Sliders (without enclosing cards) */}
      <div className="space-y-4 pt-3 border-t border-slate-800/80">
        <span className="text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
          Fine Tuning
        </span>

        {/* Step Size Slider */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-300 font-medium">Scroll Distance</span>
            <span className="font-mono text-indigo-400 font-semibold">
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
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500 focus:outline-none"
          />
        </div>

        {/* Smoothness Slider */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-300 font-medium">Gliding Duration</span>
            <span className="font-mono text-indigo-400 font-semibold">
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
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500 focus:outline-none"
          />
        </div>
      </div>
    </SubSettingsLayout>
  )
}
