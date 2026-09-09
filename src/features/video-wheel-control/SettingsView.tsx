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
  Volume2,
  Zap
} from "lucide-react"
import type React from "react"

import { useStorage } from "@plasmohq/storage/hook"

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

const MODIFIER_ITEMS: SegmentedTabItem<VideoWheelModifier>[] = [
  {
    id: "shift",
    label: "Shift"
  },
  {
    id: "alt",
    label: "Alt"
  },
  {
    id: "ctrl",
    label: "Ctrl"
  },
  {
    id: "ctrl+shift",
    label: "Ctrl+Shift"
  },
  {
    id: "ctrl+alt",
    label: "Ctrl+Alt"
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
        {/* Modifier Configuration */}
        <div className="space-y-3">
          <span className="section-header">Modifier Keys & Controls</span>

          {/* Volume Modifier Block */}
          <div className="p-2.5 rounded-lg border border-border-subtle bg-app-surface/60 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Volume2 className="w-4 h-4 text-violet-400" />
                <span className="text-xs font-semibold text-content-primary">
                  Volume Control Key
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
                  ariaLabel="Enable Volume Control"
                />
              </div>
            </div>
            <div
              className={`transition-opacity duration-150 ${
                currentConfig.enableVolume
                  ? "opacity-100"
                  : "opacity-35 pointer-events-none"
              }`}>
              <SegmentedTabs
                items={MODIFIER_ITEMS}
                value={currentConfig.volumeModifier}
                onChange={(modifier) =>
                  updateConfig({ volumeModifier: modifier })
                }
              />
            </div>
          </div>

          {/* Speed Modifier Block */}
          <div className="p-2.5 rounded-lg border border-border-subtle bg-app-surface/60 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Gauge className="w-4 h-4 text-indigo-400" />
                <span className="text-xs font-semibold text-content-primary">
                  Speed Control Key
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-content-muted">
                  {currentConfig.enableSpeed ? "Enabled" : "Disabled"}
                </span>
                <Switch
                  size="sm"
                  checked={currentConfig.enableSpeed}
                  onChange={(checked) => updateConfig({ enableSpeed: checked })}
                  ariaLabel="Enable Speed Control"
                />
              </div>
            </div>
            <div
              className={`transition-opacity duration-150 ${
                currentConfig.enableSpeed
                  ? "opacity-100"
                  : "opacity-35 pointer-events-none"
              }`}>
              <SegmentedTabs
                items={MODIFIER_ITEMS}
                value={currentConfig.speedModifier}
                onChange={(modifier) =>
                  updateConfig({ speedModifier: modifier })
                }
              />
            </div>
          </div>

          {/* Seek Modifier Block */}
          <div className="p-2.5 rounded-lg border border-border-subtle bg-app-surface/60 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FastForward className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-semibold text-content-primary">
                  Seek Control Key
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-content-muted">
                  {currentConfig.enableSeek ? "Enabled" : "Disabled"}
                </span>
                <Switch
                  size="sm"
                  checked={currentConfig.enableSeek}
                  onChange={(checked) => updateConfig({ enableSeek: checked })}
                  ariaLabel="Enable Seek Control"
                />
              </div>
            </div>
            <div
              className={`transition-opacity duration-150 ${
                currentConfig.enableSeek
                  ? "opacity-100"
                  : "opacity-35 pointer-events-none"
              }`}>
              <SegmentedTabs
                items={MODIFIER_ITEMS}
                value={currentConfig.seekModifier}
                onChange={(modifier) =>
                  updateConfig({ seekModifier: modifier })
                }
              />
            </div>
          </div>

          {/* Conflict Warning Card */}
          {hasConflict && (
            <div className="flex items-start gap-2.5 p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/25 text-amber-400 text-[11px] leading-relaxed">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-amber-400" />
              <div>
                <span className="font-semibold block text-amber-300">
                  Modifier Key Conflict Detected
                </span>
                Two or more active controls share the same modifier key. The
                extension prioritizes Seek &gt; Speed &gt; Volume when
                scrolling. Please choose unique modifier keys to prevent
                unexpected behavior.
              </div>
            </div>
          )}
        </div>

        {/* Sensitivity & Step Sizes */}
        <div className="space-y-3 pt-2 border-t border-border-divider">
          <span className="section-header">Step Sizes</span>

          {/* Volume Step Slider */}
          {currentConfig.enableVolume && (
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
          )}

          {/* Speed Step Slider */}
          {currentConfig.enableSpeed && (
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
          )}

          {/* Seek Step Slider */}
          {currentConfig.enableSeek && (
            <div className="space-y-1 py-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FastForward className="w-4 h-4 text-emerald-400" />
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
                onChange={(val) => updateConfig({ seekStep: Math.round(val) })}
                min={1}
                max={30}
                step={1}
                ariaLabel="Seek Step"
              />
            </div>
          )}
        </div>

        {/* Options & Behaviors */}
        <div className="space-y-2 pt-2 border-t border-border-divider">
          <span className="section-header">Behaviors & Features</span>

          <div className="divide-y divide-border-divider">
            {/* Frame-by-Frame Stepper when Paused */}
            {currentConfig.enableSeek && (
              <SettingToggleRow
                icon={<Film className="w-5 h-5 text-amber-400" />}
                title="Frame-by-Frame Stepper"
                description="When video is paused, wheel scrolling steps frame-by-frame (~1/30s)."
                enabled={currentConfig.enableFrameStep}
                onToggle={(enabled) =>
                  updateConfig({ enableFrameStep: enabled })
                }
              />
            )}

            {/* Hold-to-Boost */}
            <SettingToggleRow
              icon={<Zap className="w-5 h-5 text-amber-500" />}
              title="Hold 'X' to Boost (2.0x)"
              description="Hold the 'X' key while watching a video to temporarily speed it up to 2.0x."
              enabled={currentConfig.enableHoldToBoost}
              onToggle={(enabled) =>
                updateConfig({ enableHoldToBoost: enabled })
              }
            />

            {/* Video Screenshot */}
            <SettingToggleRow
              icon={<Camera className="w-5 h-5 text-pink-400" />}
              title="Video Screenshot (Shift+Alt+Click)"
              description="Capture the current video frame directly to clipboard as PNG."
              enabled={currentConfig.enableScreenshot}
              onToggle={(enabled) =>
                updateConfig({ enableScreenshot: enabled })
              }
            />

            {/* Left Click to Mute */}
            {currentConfig.enableVolume && (
              <SettingToggleRow
                icon={<MousePointerClick className="w-5 h-5 text-violet-400" />}
                title="Click to Mute"
                description={`Click video while holding volume modifier (${currentConfig.volumeModifier.toUpperCase()}) to toggle mute.`}
                enabled={currentConfig.clickToMute}
                onToggle={(enabled) => updateConfig({ clickToMute: enabled })}
              />
            )}

            {/* Left Click to Fullscreen */}
            {currentConfig.enableSpeed && (
              <SettingToggleRow
                icon={<Maximize2 className="w-5 h-5 text-sky-400" />}
                title="Click to Fullscreen"
                description={`Click video while holding speed modifier (${currentConfig.speedModifier.toUpperCase()}) to toggle fullscreen.`}
                enabled={currentConfig.clickToFullscreen}
                onToggle={(enabled) =>
                  updateConfig({ clickToFullscreen: enabled })
                }
              />
            )}

            {/* Show OSD */}
            <SettingToggleRow
              icon={<Eye className="w-5 h-5 text-indigo-400" />}
              title="On-Screen Display (OSD)"
              description="Show sleek floating HUD badges for volume, speed, seek, and boost."
              enabled={currentConfig.showOsd}
              onToggle={(enabled) => updateConfig({ showOsd: enabled })}
            />

            {/* Invert Volume Scroll */}
            {currentConfig.enableVolume && (
              <SettingToggleRow
                icon={<ArrowUpDown className="w-5 h-5 text-content-muted" />}
                title="Invert Volume Scroll"
                description="Reverse wheel scroll direction when adjusting volume."
                enabled={currentConfig.invertVolumeScroll}
                onToggle={(enabled) =>
                  updateConfig({ invertVolumeScroll: enabled })
                }
              />
            )}

            {/* Invert Speed Scroll */}
            {currentConfig.enableSpeed && (
              <SettingToggleRow
                icon={<ArrowUpDown className="w-5 h-5 text-content-muted" />}
                title="Invert Speed Scroll"
                description="Reverse wheel scroll direction when adjusting playback speed."
                enabled={currentConfig.invertSpeedScroll}
                onToggle={(enabled) =>
                  updateConfig({ invertSpeedScroll: enabled })
                }
              />
            )}

            {/* Invert Seek Scroll */}
            {currentConfig.enableSeek && (
              <SettingToggleRow
                icon={<ArrowUpDown className="w-5 h-5 text-content-muted" />}
                title="Invert Seek Scroll"
                description="Reverse wheel scroll direction when seeking video."
                enabled={currentConfig.invertSeekScroll}
                onToggle={(enabled) =>
                  updateConfig({ invertSeekScroll: enabled })
                }
              />
            )}
          </div>
        </div>

        {/* Compatibility & State Notice Card */}
        <div className="card-subtle p-3 text-[11px] text-content-muted space-y-1.5 border border-border-subtle/80">
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
