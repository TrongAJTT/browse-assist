import {
  ArrowUpDown,
  Command,
  Eye,
  RotateCcw,
  Sparkles
} from "lucide-react"
import type React from "react"

import { useStorage } from "@plasmohq/storage/hook"

import { GridPicker, type GridPickerItem } from "~components/GridPicker"
import { SubSettingsLayout } from "~components/SubSettingsLayout"
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
    id: "ctrl",
    label: "Ctrl Key",
    icon: <Command className="w-3.5 h-3.5" />
  },
  {
    id: "shift",
    label: "Shift Key",
    icon: <Command className="w-3.5 h-3.5" />
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

  return (
    <SubSettingsLayout
      title="Mouse Pin-to-Zoom"
      enabled={isEnabled}
      onToggle={handleToggleFeature}
      onBack={onBack}>
      {/* Modifier Key Grid Picker */}
      <div className="space-y-2">
        <span className="text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
          Trigger Modifier Key
        </span>

        <GridPicker<MouseZoomModifier>
          items={MODIFIER_ITEMS}
          value={currentConfig.modifier}
          onChange={handleSelectModifier}
          columns={3}
        />
      </div>

      {/* Zoom Sensitivity / Step Size Slider */}
      <div className="space-y-4 pt-3 border-t border-slate-800/80">
        <span className="text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
          Zoom Sensitivity
        </span>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-300 font-medium">Step Increment</span>
            <span className="font-mono text-indigo-400 font-semibold">
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
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500 hover:accent-indigo-400"
          />
          <div className="flex justify-between text-[10px] text-slate-400">
            <span>4% (Fine)</span>
            <span>10% (Default)</span>
            <span>25% (Fast)</span>
          </div>
        </div>
      </div>

      {/* Behavior Toggles */}
      <div className="space-y-3 pt-3 border-t border-slate-800/80">
        <span className="text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
          Behavior & Display
        </span>

        {/* Smooth Transition */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex flex-col min-w-0 flex-1">
            <span className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Smooth Animation
            </span>
            <span className="text-[11px] text-slate-400 leading-snug mt-0.5">
              Smoothly interpolate zoom transitions for a fluid feel.
            </span>
          </div>

          <button
            type="button"
            role="switch"
            aria-checked={currentConfig.smooth}
            onClick={() => handleToggleOption("smooth")}
            className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-900 ${
              currentConfig.smooth
                ? "bg-indigo-600 shadow-indigo-500/20 shadow-sm"
                : "bg-slate-700"
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
            <span className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
              <ArrowUpDown className="w-3.5 h-3.5 text-cyan-400" />
              Invert Direction
            </span>
            <span className="text-[11px] text-slate-400 leading-snug mt-0.5">
              Scroll down to zoom in, scroll up to zoom out.
            </span>
          </div>

          <button
            type="button"
            role="switch"
            aria-checked={currentConfig.invertDirection}
            onClick={() => handleToggleOption("invertDirection")}
            className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-900 ${
              currentConfig.invertDirection
                ? "bg-indigo-600 shadow-indigo-500/20 shadow-sm"
                : "bg-slate-700"
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
            <span className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5 text-violet-400" />
              Show Zoom Toast
            </span>
            <span className="text-[11px] text-slate-400 leading-snug mt-0.5">
              Display floating percentage badge on the top-right of the page.
            </span>
          </div>

          <button
            type="button"
            role="switch"
            aria-checked={currentConfig.showToast}
            onClick={() => handleToggleOption("showToast")}
            className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-900 ${
              currentConfig.showToast
                ? "bg-indigo-600 shadow-indigo-500/20 shadow-sm"
                : "bg-slate-700"
            }`}>
            <span
              className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                currentConfig.showToast ? "translate-x-4" : "translate-x-0"
              }`}
            />
          </button>
        </div>
      </div>

      {/* Shortcut hint */}
      <div className="p-2.5 rounded-xl bg-slate-800/40 border border-slate-700/50 flex items-center justify-between text-xs text-slate-400">
        <span className="flex items-center gap-1.5">
          <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
          Reset Zoom Shortcut
        </span>
        <span className="font-mono text-[11px] px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300">
          {currentConfig.modifier === "ctrl"
            ? "Ctrl + 0"
            : currentConfig.modifier === "shift"
              ? "Shift + 0"
              : "Alt + 0"}
        </span>
      </div>
    </SubSettingsLayout>
  )
}
