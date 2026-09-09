import {
  AlertTriangle,
  ArrowUpDown,
  Camera,
  Eye,
  FastForward,
  Film,
  Gauge,
  Info,
  Maximize2,
  MousePointerClick,
  Sliders,
  Volume2,
  Zap
} from "lucide-react"
import React, { useState } from "react"

import { useStorage } from "@plasmohq/storage/hook"

import { GridPicker, type GridPickerItem } from "~components/GridPicker"
import { SegmentedTabs, type SegmentedTabItem } from "~components/SegmentedTabs"
import { SettingToggleRow } from "~components/SettingToggleRow"
import { Slider } from "~components/Slider"
import { SubSettingsLayout } from "~components/SubSettingsLayout"
import { Switch } from "~components/Switch"
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

type TabType = "volume" | "speed" | "seek" | "extra"

const TABS: SegmentedTabItem<TabType>[] = [
  {
    id: "volume",
    label: "Volume",
    icon: <Volume2 className="w-3.5 h-3.5" />
  },
  {
    id: "speed",
    label: "Speed",
    icon: <Gauge className="w-3.5 h-3.5" />
  },
  {
    id: "seek",
    label: "Seek",
    icon: <FastForward className="w-3.5 h-3.5" />
  },
  {
    id: "extra",
    label: "Extra",
    icon: <Sliders className="w-3.5 h-3.5" />
  }
]

// 6 modifier items arranged in 3 columns x 2 rows
const MODIFIER_GRID_ITEMS: GridPickerItem<VideoWheelModifier>[] = [
  { id: "shift", label: "Shift" },
  { id: "alt", label: "Alt" },
  { id: "ctrl", label: "Ctrl" },
  { id: "ctrl+shift", label: "Ctrl+Shift" },
  { id: "ctrl+alt", label: "Ctrl+Alt" },
  { id: "alt+shift", label: "Alt+Shift" }
]

/**
 * Domain-grouped Sub-settings view for Video Wheel Control:
 * Volume | Speed | Seek | Extra
 */
export const VideoWheelControlSettingsView: React.FC<
  VideoWheelControlSettingsViewProps
> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState<TabType>("volume")

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

  // Detect conflict between enabled modifiers
  const activeModifiers = [
    currentConfig.enableVolume
      ? { name: "Volume", key: currentConfig.volumeModifier }
      : null,
    currentConfig.enableSpeed
      ? { name: "Speed", key: currentConfig.speedModifier }
      : null,
    currentConfig.enableSeek
      ? { name: "Seek", key: currentConfig.seekModifier }
      : null
  ].filter(Boolean) as { name: string; key: VideoWheelModifier }[]

  const hasConflict =
    activeModifiers.length > 1 &&
    new Set(activeModifiers.map((m) => m.key)).size < activeModifiers.length

  return (
    <SubSettingsLayout
      title="Video Wheel Control"
      enabled={isEnabled}
      onToggle={handleToggleFeature}
      onBack={onBack}>
      <div className="space-y-4">
        {/* Navigation Tabs */}
        <SegmentedTabs
          items={TABS}
          value={activeTab}
          onChange={(tab) => setActiveTab(tab)}
        />

        {/* Global Conflict Warning Banner */}
        {hasConflict && (
          <div className="flex items-start gap-2.5 p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/25 text-amber-400 text-[11px] leading-relaxed">
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-amber-400" />
            <div>
              <span className="font-semibold block text-amber-300">
                Modifier Key Conflict Detected
              </span>
              Two or more active controls share the same modifier key (Seek &gt;
              Speed &gt; Volume priority). Please assign unique modifier keys to
              avoid collisions.
            </div>
          </div>
        )}

        {/* TAB 1: VOLUME */}
        {activeTab === "volume" && (
          <div className="space-y-4">
            {/* Header with Switch & Grid */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Volume2 className="w-4 h-4 text-violet-400" />
                  <span className="text-xs font-semibold text-content-primary">
                    Volume Control
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-content-muted">
                    {currentConfig.enableVolume ? "Enabled" : "Disabled"}
                  </span>
                  <Switch
                    size="sm"
                    checked={currentConfig.enableVolume}
                    onChange={(checked) =>
                      updateConfig({ enableVolume: checked })
                    }
                    ariaLabel="Toggle Volume Control"
                  />
                </div>
              </div>

              {/* Modifier 3x2 Grid Picker */}
              <div className="space-y-1.5 pt-1">
                <span className="text-[11px] font-medium text-content-muted block">
                  Modifier Key (Hold key + scroll over video)
                </span>
                <GridPicker
                  columns={3}
                  disabled={!currentConfig.enableVolume}
                  items={MODIFIER_GRID_ITEMS}
                  value={currentConfig.volumeModifier}
                  onChange={(modifier) =>
                    updateConfig({ volumeModifier: modifier })
                  }
                />
              </div>
            </div>

            {/* Volume Step Slider */}
            {currentConfig.enableVolume && (
              <div className="space-y-1.5 pt-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Volume2 className="w-3.5 h-3.5 text-violet-400" />
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
            )}

            {/* Volume Behaviors */}
            <div className="divide-y divide-border-divider">
              <SettingToggleRow
                icon={<MousePointerClick className="w-5 h-5 text-violet-400" />}
                title="Click to Mute"
                description={`Click video while holding ${currentConfig.volumeModifier.toUpperCase()} to toggle mute.`}
                enabled={
                  currentConfig.clickToMute && currentConfig.enableVolume
                }
                disabled={!currentConfig.enableVolume}
                onToggle={(enabled) => updateConfig({ clickToMute: enabled })}
              />

              <SettingToggleRow
                icon={<ArrowUpDown className="w-5 h-5 text-content-muted" />}
                title="Invert Volume Scroll"
                description="Reverse wheel scroll direction when adjusting volume."
                enabled={
                  currentConfig.invertVolumeScroll && currentConfig.enableVolume
                }
                disabled={!currentConfig.enableVolume}
                onToggle={(enabled) =>
                  updateConfig({ invertVolumeScroll: enabled })
                }
              />
            </div>
          </div>
        )}

        {/* TAB 2: SPEED */}
        {activeTab === "speed" && (
          <div className="space-y-4">
            {/* Header with Switch & Grid */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Gauge className="w-4 h-4 text-indigo-400" />
                  <span className="text-xs font-semibold text-content-primary">
                    Speed Control
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-content-muted">
                    {currentConfig.enableSpeed ? "Enabled" : "Disabled"}
                  </span>
                  <Switch
                    size="sm"
                    checked={currentConfig.enableSpeed}
                    onChange={(checked) =>
                      updateConfig({ enableSpeed: checked })
                    }
                    ariaLabel="Toggle Speed Control"
                  />
                </div>
              </div>

              {/* Modifier 3x2 Grid Picker */}
              <div className="space-y-1.5 pt-1">
                <span className="text-[11px] font-medium text-content-muted block">
                  Modifier Key (Hold key + scroll over video)
                </span>
                <GridPicker
                  columns={3}
                  disabled={!currentConfig.enableSpeed}
                  items={MODIFIER_GRID_ITEMS}
                  value={currentConfig.speedModifier}
                  onChange={(modifier) =>
                    updateConfig({ speedModifier: modifier })
                  }
                />
              </div>
            </div>

            {/* Speed Step Slider */}
            {currentConfig.enableSpeed && (
              <div className="space-y-1.5 pt-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Gauge className="w-3.5 h-3.5 text-indigo-400" />
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
            )}

            {/* Speed Behaviors & Hold-to-Boost */}
            <div className="divide-y divide-border-divider pt-1">
              <SettingToggleRow
                icon={<Zap className="w-5 h-5 text-amber-500" />}
                title="Hold 'X' to Boost (2.0x)"
                description="Hold the 'X' key while watching a video to temporarily speed it up to 2.0x."
                enabled={currentConfig.enableHoldToBoost}
                onToggle={(enabled) =>
                  updateConfig({ enableHoldToBoost: enabled })
                }
              />

              <SettingToggleRow
                icon={<Maximize2 className="w-5 h-5 text-sky-400" />}
                title="Click to Fullscreen"
                description={`Click video while holding ${currentConfig.speedModifier.toUpperCase()} to toggle fullscreen.`}
                enabled={
                  currentConfig.clickToFullscreen && currentConfig.enableSpeed
                }
                disabled={!currentConfig.enableSpeed}
                onToggle={(enabled) =>
                  updateConfig({ clickToFullscreen: enabled })
                }
              />

              <SettingToggleRow
                icon={<ArrowUpDown className="w-5 h-5 text-content-muted" />}
                title="Invert Speed Scroll"
                description="Reverse wheel scroll direction when adjusting playback speed."
                enabled={
                  currentConfig.invertSpeedScroll && currentConfig.enableSpeed
                }
                disabled={!currentConfig.enableSpeed}
                onToggle={(enabled) =>
                  updateConfig({ invertSpeedScroll: enabled })
                }
              />
            </div>
          </div>
        )}

        {/* TAB 3: SEEK */}
        {activeTab === "seek" && (
          <div className="space-y-4">
            {/* Header with Switch & Grid */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FastForward className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-semibold text-content-primary">
                    Seek Control
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-content-muted">
                    {currentConfig.enableSeek ? "Enabled" : "Disabled"}
                  </span>
                  <Switch
                    size="sm"
                    checked={currentConfig.enableSeek}
                    onChange={(checked) =>
                      updateConfig({ enableSeek: checked })
                    }
                    ariaLabel="Toggle Seek Control"
                  />
                </div>
              </div>

              {/* Modifier 3x2 Grid Picker */}
              <div className="space-y-1.5 pt-1">
                <span className="text-[11px] font-medium text-content-muted block">
                  Modifier Key (Hold key + scroll over video)
                </span>
                <GridPicker
                  columns={3}
                  disabled={!currentConfig.enableSeek}
                  items={MODIFIER_GRID_ITEMS}
                  value={currentConfig.seekModifier}
                  onChange={(modifier) =>
                    updateConfig({ seekModifier: modifier })
                  }
                />
              </div>
            </div>

            {/* Seek Step Slider */}
            {currentConfig.enableSeek && (
              <div className="space-y-1.5 pt-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FastForward className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-xs font-semibold text-content-primary">
                      Seek Step (Seconds)
                    </span>
                  </div>
                  <span className="text-xs font-bold text-emerald-400">
                    ±{currentConfig.seekStep}s
                  </span>
                </div>
                <Slider
                  value={currentConfig.seekStep}
                  onChange={(val) =>
                    updateConfig({ seekStep: Math.round(val) })
                  }
                  min={1}
                  max={30}
                  step={1}
                  ariaLabel="Seek Step"
                />
              </div>
            )}

            {/* Seek Behaviors */}
            <div className="divide-y divide-border-divider pt-1">
              <SettingToggleRow
                icon={<Film className="w-5 h-5 text-amber-400" />}
                title="Frame-by-Frame Stepper"
                description="When video is paused, wheel scrolling steps frame-by-frame (~1/30s)."
                enabled={
                  currentConfig.enableFrameStep && currentConfig.enableSeek
                }
                disabled={!currentConfig.enableSeek}
                onToggle={(enabled) =>
                  updateConfig({ enableFrameStep: enabled })
                }
              />

              <SettingToggleRow
                icon={<ArrowUpDown className="w-5 h-5 text-content-muted" />}
                title="Invert Seek Scroll"
                description="Reverse wheel scroll direction when seeking video."
                enabled={
                  currentConfig.invertSeekScroll && currentConfig.enableSeek
                }
                disabled={!currentConfig.enableSeek}
                onToggle={(enabled) =>
                  updateConfig({ invertSeekScroll: enabled })
                }
              />
            </div>
          </div>
        )}

        {/* TAB 4: EXTRA */}
        {activeTab === "extra" && (
          <div className="space-y-3">
            <div className="divide-y divide-border-divider">
              {/* Video Screenshot */}
              <SettingToggleRow
                icon={<Camera className="w-5 h-5 text-pink-400" />}
                title="Video Screenshot (Shift+Alt+Click)"
                description="Capture current video frame directly to clipboard as PNG."
                enabled={currentConfig.enableScreenshot}
                onToggle={(enabled) =>
                  updateConfig({ enableScreenshot: enabled })
                }
              />

              {/* Show OSD */}
              <SettingToggleRow
                icon={<Eye className="w-5 h-5 text-indigo-400" />}
                title="On-Screen Display (OSD)"
                description="Show sleek floating HUD badges for volume, speed, seek, and boost."
                enabled={currentConfig.showOsd}
                onToggle={(enabled) => updateConfig({ showOsd: enabled })}
              />
            </div>
          </div>
        )}

        {/* Compatibility & State Notice Card - Always pinned at bottom */}
        <div className="card-subtle p-3 text-[11px] text-content-muted space-y-1.5 border border-border-subtle/80 pt-2.5">
          <div className="flex items-center gap-1.5 font-semibold text-content-secondary">
            <Info className="w-3.5 h-3.5 text-violet-400 shrink-0" />
            <span>Compatibility & State Notice</span>
            <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded border bg-amber-500/10 text-amber-400 border-amber-500/25 ml-auto">
              HTML5 Direct
            </span>
          </div>
          <p className="leading-relaxed">
            This feature interacts directly with the underlying HTML5 media
            element (
            <code className="text-violet-300 font-mono text-[10px]">
              &lt;video&gt;
            </code>
            ).
          </p>
          <p className="leading-relaxed text-content-muted">
            On advanced web platforms (e.g. YouTube, Facebook, Netflix), custom
            state managers may occasionally reset playback rate or mute status
            when a video loops, changes stream resolution, or auto-plays the
            next item.
          </p>
        </div>
      </div>
    </SubSettingsLayout>
  )
}
