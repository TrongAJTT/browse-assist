import type React from "react"
import { useStorage } from "@plasmohq/storage/hook"

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
 * Dedicated sub-settings view for Smooth Scrolling.
 */
export const SmoothScrollSettingsView: React.FC<SmoothScrollSettingsViewProps> = ({
  onBack
}) => {
  const [settings, setSettings] = useStorage<FeatureSettings>(
    STORAGE_KEYS.SETTINGS,
    DEFAULT_SETTINGS
  )

  const currentConfig: SmoothScrollConfig =
    settings?.smoothScrollConfig ?? DEFAULT_SETTINGS.smoothScrollConfig

  const handleSelectPreset = (preset: SmoothScrollPreset) => {
    const nextConfig = { ...SMOOTH_SCROLL_PRESETS[preset] }
    setSettings((prev) => ({
      ...(prev ?? DEFAULT_SETTINGS),
      smoothScrollConfig: nextConfig
    }))
  }

  const handleUpdateParam = (
    key: "stepSize" | "smoothness",
    value: number
  ) => {
    setSettings((prev) => {
      const baseConfig = prev?.smoothScrollConfig ?? DEFAULT_SETTINGS.smoothScrollConfig
      return {
        ...(prev ?? DEFAULT_SETTINGS),
        smoothScrollConfig: {
          ...baseConfig,
          [key]: value
        }
      }
    })
  }

  const presetList: {
    id: SmoothScrollPreset
    label: string
    desc: string
    badge: string
  }[] = [
    {
      id: "balanced",
      label: "Balanced",
      desc: "Natural feel suitable for everyday browsing and reading.",
      badge: "Default"
    },
    {
      id: "ultra",
      label: "Ultra Smooth",
      desc: "Long gliding inertia, best for social feeds and articles.",
      badge: "Silky"
    },
    {
      id: "snappy",
      label: "Snappy",
      desc: "Crisp, low-latency stops, best for code and documents.",
      badge: "Quick"
    }
  ]

  return (
    <div className="flex flex-col space-y-4">
      {/* Sub-header with Back Button */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-1.5 px-2 py-1 -ml-1 text-xs font-semibold text-slate-300 hover:text-white rounded-lg hover:bg-slate-800/80 transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/50">
          <svg
            className="w-4 h-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          <span>Back</span>
        </button>

        <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
          <span>📜</span>
          <span className="text-white font-semibold">Smooth Scroll Settings</span>
        </div>
      </div>

      {/* Preset Cards */}
      <div className="space-y-2">
        <span className="text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
          Profiles
        </span>

        <div className="grid gap-2">
          {presetList.map((item) => {
            const isSelected = currentConfig.preset === item.id
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleSelectPreset(item.id)}
                className={`text-left p-2.5 rounded-xl border transition-all ${
                  isSelected
                    ? "bg-indigo-950/40 border-indigo-500/60 ring-1 ring-indigo-500/40 shadow-sm"
                    : "bg-slate-800/40 hover:bg-slate-800/80 border-slate-800"
                }`}>
                <div className="flex items-center justify-between">
                  <span
                    className={`text-xs font-bold ${
                      isSelected ? "text-indigo-300" : "text-slate-200"
                    }`}>
                    {item.label}
                  </span>
                  <span
                    className={`px-1.5 py-0.5 text-[9px] font-semibold rounded-md border ${
                      isSelected
                        ? "bg-indigo-500/20 text-indigo-300 border-indigo-500/40"
                        : "bg-slate-800 text-slate-400 border-slate-700"
                    }`}>
                    {item.badge}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1 leading-snug">
                  {item.desc}
                </p>
              </button>
            )
          })}
        </div>
      </div>

      {/* Fine-Tuning Physics Sliders */}
      <div className="space-y-3 pt-2 border-t border-slate-800/60">
        <span className="text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
          Fine Tuning
        </span>

        {/* Step Size Slider */}
        <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-800 space-y-1.5">
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
            className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500 focus:outline-none"
          />
        </div>

        {/* Smoothness Slider */}
        <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-800 space-y-1.5">
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
            className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500 focus:outline-none"
          />
        </div>
      </div>
    </div>
  )
}
