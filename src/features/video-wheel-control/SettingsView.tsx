import {
  ArrowUpDown,
  Command,
  Eye,
  Gauge,
  MousePointerClick,
  Volume2
} from "lucide-react"
import type React from "react"

import { useStorage } from "@plasmohq/storage/hook"

import { SegmentedTabs, type SegmentedTabItem } from "~components/SegmentedTabs"
import { SettingToggleRow } from "~components/SettingToggleRow"
import { Slider } from "~components/Slider"
import { SubSettingsLayout } from "~components/SubSettingsLayout"
import {
  DEFAULT_SETTINGS,
  STORAGE_KEYS,
  type FeatureSettings,
  type VideoWheelControlConfig,
  type VideoWheelModifier
} from "~core/types"

interface VideoWheelControlSettingsViewProps {
  onBack: () => void
}

const MODIFIER_ITEMS: SegmentedTabItem<VideoWheelModifier>[] = [
  {
    id: "shift",
    label: "Shift",
    icon: <Command className="w-3.5 h-3.5" />
  },
  {
    id: "alt",
    label: "Alt",
    icon: <Command className="w-3.5 h-3.5" />
  },
  {
    id: "ctrl",
    label: "Ctrl",
    icon: <Command className="w-3.5 h-3.5" />
  },
  {
    id: "none",
    label: "None",
    icon: <MousePointerClick className="w-3.5 h-3.5" />
  }
]

/**
 * Dedicated sub-settings view for Video Wheel Control.
 */
export const VideoWheelControlSettingsView: React.FC<
  VideoWheelControlSettingsViewProps
> = ({ onBack }) => {
  const [settings, setSettings] = useStorage<FeatureSettings>(
    STORAGE_KEYS.SETTINGS,
    DEFAULT_SETTINGS
  )

  const isEnabled =
    settings?.videoWheelControl ?? DEFAULT_SETTINGS.videoWheelControl
  const currentConfig: VideoWheelControlConfig =
    settings?.videoWheelControlConfig ??
    DEFAULT_SETTINGS.videoWheelControlConfig

  const handleToggleFeature = (enabled: boolean) => {
    setSettings((prev) => ({
      ...(prev ?? DEFAULT_SETTINGS),
      videoWheelControl: enabled
    }))
  }

  const updateConfig = (patch: Partial<VideoWheelControlConfig>) => {
    setSettings((prev) => ({
      ...(prev ?? DEFAULT_SETTINGS),
      videoWheelControlConfig: {
        ...(prev?.videoWheelControlConfig ??
          DEFAULT_SETTINGS.videoWheelControlConfig),
        ...patch
      }
    }))
  }

  return (
    <SubSettingsLayout
      title="Video Wheel Control"
      enabled={isEnabled}
      onToggle={handleToggleFeature}
      onBack={onBack}>
      <div className="space-y-4">
        {/* Modifier Configuration */}
        <div className="space-y-3">
          <span className="section-header">Modifier Keys</span>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-content-primary">
                Volume Control Key
              </span>
              <span className="text-[11px] text-content-muted">
                Hold key + scroll over video
              </span>
            </div>
            <SegmentedTabs
              items={MODIFIER_ITEMS}
              value={currentConfig.volumeModifier}
              onChange={(modifier) =>
                updateConfig({ volumeModifier: modifier })
              }
            />
          </div>

          <div className="space-y-1.5 pt-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-content-primary">
                Speed Control Key
              </span>
              <span className="text-[11px] text-content-muted">
                Hold key + scroll over video
              </span>
            </div>
            <SegmentedTabs
              items={MODIFIER_ITEMS}
              value={currentConfig.speedModifier}
              onChange={(modifier) => updateConfig({ speedModifier: modifier })}
            />
          </div>
        </div>

        {/* Sensitivity & Step Sizes */}
        <div className="space-y-3 pt-2 border-t border-border-divider">
          <span className="section-header">Step Sizes</span>

          {/* Volume Step Slider */}
          <div className="space-y-1 py-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Volume2 className="w-4 h-4 text-violet-400" />
                <span className="text-xs font-semibold text-content-primary">
                  Volume Step
                </span>
              </div>
              <span className="text-xs font-bold text-violet-400">
                {Math.round(currentConfig.volumeStep * 100)}%
              </span>
            </div>
            <Slider
              value={currentConfig.volumeStep}
              onChange={(val) => updateConfig({ volumeStep: val })}
              min={0.01}
              max={0.2}
              step={0.01}
              ariaLabel="Volume Step"
            />
          </div>

          {/* Speed Step Slider */}
          <div className="space-y-1 py-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Gauge className="w-4 h-4 text-indigo-400" />
                <span className="text-xs font-semibold text-content-primary">
                  Speed Step
                </span>
              </div>
              <span className="text-xs font-bold text-indigo-400">
                {currentConfig.speedStep.toFixed(2)}x
              </span>
            </div>
            <Slider
              value={currentConfig.speedStep}
              onChange={(val) => updateConfig({ speedStep: val })}
              min={0.05}
              max={0.5}
              step={0.05}
              ariaLabel="Speed Step"
            />
          </div>
        </div>

        {/* Options & Behaviors */}
        <div className="space-y-2 pt-2 border-t border-border-divider">
          <span className="section-header">Behaviors & Display</span>

          <div className="divide-y divide-border-divider">
            {/* Middle Click to Mute */}
            <SettingToggleRow
              icon={<MousePointerClick className="w-5 h-5 text-violet-400" />}
              title="Middle-Click to Mute"
              description="Click mouse wheel on video to quickly toggle mute/unmute."
              enabled={currentConfig.middleClickToMute}
              onToggle={(enabled) =>
                updateConfig({ middleClickToMute: enabled })
              }
            />

            {/* Show OSD */}
            <SettingToggleRow
              icon={<Eye className="w-5 h-5 text-indigo-400" />}
              title="On-Screen Display (OSD)"
              description="Show a sleek floating badge with volume/speed indicator."
              enabled={currentConfig.showOsd}
              onToggle={(enabled) => updateConfig({ showOsd: enabled })}
            />

            {/* Invert Volume Scroll */}
            <SettingToggleRow
              icon={<ArrowUpDown className="w-5 h-5 text-content-muted" />}
              title="Invert Volume Scroll"
              description="Reverse the wheel scroll direction when adjusting volume."
              enabled={currentConfig.invertVolumeScroll}
              onToggle={(enabled) =>
                updateConfig({ invertVolumeScroll: enabled })
              }
            />

            {/* Invert Speed Scroll */}
            <SettingToggleRow
              icon={<ArrowUpDown className="w-5 h-5 text-content-muted" />}
              title="Invert Speed Scroll"
              description="Reverse the wheel scroll direction when adjusting playback speed."
              enabled={currentConfig.invertSpeedScroll}
              onToggle={(enabled) =>
                updateConfig({ invertSpeedScroll: enabled })
              }
            />
          </div>
        </div>
      </div>
    </SubSettingsLayout>
  )
}
