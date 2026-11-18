import {
  AlertTriangle,
  ArrowUpDown,
  Camera,
  Droplets,
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

import {
  OPACITY_DROPDOWN_OPTIONS,
  SelectDropdown,
  type SelectDropdownOption
} from "~components/SelectDropdown"
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
import { useI18n } from "~core/useI18n"

interface VideoWheelControlSettingsViewProps {
  onBack: () => void
}

type TabType = "volume" | "speed" | "seek" | "extra"

// 6 modifier options for trailing dropdown
const MODIFIER_OPTIONS: SelectDropdownOption<VideoWheelModifier>[] = [
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
  const { t } = useI18n()
  const [activeTab, setActiveTab] = useState<TabType>("volume")

  const tabs: SegmentedTabItem<TabType>[] = [
    {
      id: "volume",
      label: t("features.videoWheelControl.settings.tabs.volume"),
      icon: <Volume2 className="w-3.5 h-3.5" />
    },
    {
      id: "speed",
      label: t("features.videoWheelControl.settings.tabs.speed"),
      icon: <Gauge className="w-3.5 h-3.5" />
    },
    {
      id: "seek",
      label: t("features.videoWheelControl.settings.tabs.seek"),
      icon: <FastForward className="w-3.5 h-3.5" />
    },
    {
      id: "extra",
      label: t("features.videoWheelControl.settings.tabs.extra"),
      icon: <Sliders className="w-3.5 h-3.5" />
    }
  ]

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
      title={t("features.videoWheelControl.title")}
      enabled={isEnabled}
      onToggle={handleToggleFeature}
      onBack={onBack}>
      <div className="space-y-4">
        {/* Navigation Tabs */}
        <SegmentedTabs
          items={tabs}
          value={activeTab}
          onChange={(tab) => setActiveTab(tab)}
        />

        {/* Global Conflict Warning Banner */}
        {hasConflict && (
          <div className="flex items-start gap-2.5 p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/25 text-amber-400 text-[11px] leading-relaxed">
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-amber-400" />
            <div>
              <span className="font-semibold block text-amber-300">
                {t("features.videoWheelControl.settings.conflictTitle")}
              </span>
              {t("features.videoWheelControl.settings.conflictDesc")}
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
                    {t("features.videoWheelControl.settings.volumeControl")}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-content-muted">
                    {currentConfig.enableVolume
                      ? t("common.enabled")
                      : t("common.disabled")}
                  </span>
                  <Switch
                    size="sm"
                    checked={currentConfig.enableVolume}
                    onChange={(checked) =>
                      updateConfig({ enableVolume: checked })
                    }
                    ariaLabel={t(
                      "features.videoWheelControl.settings.volumeControl"
                    )}
                  />
                </div>
              </div>

              {/* Modifier Trailing Dropdown */}
              <div className="flex items-center justify-between gap-3 pt-1">
                <div className="flex flex-col min-w-0">
                  <span className="text-xs font-medium text-content-primary">
                    {t("features.videoWheelControl.settings.modifierKey")}
                  </span>
                  <span className="text-[11px] text-content-muted">
                    {t("features.videoWheelControl.settings.modifierKeyDesc")}
                  </span>
                </div>
                <SelectDropdown<VideoWheelModifier>
                  disabled={!currentConfig.enableVolume}
                  options={MODIFIER_OPTIONS}
                  value={currentConfig.volumeModifier}
                  onChange={(modifier) =>
                    updateConfig({ volumeModifier: modifier })
                  }
                  ariaLabel={t("features.videoWheelControl.settings.modifierKey")}
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
                      {t("features.videoWheelControl.settings.volumeStep")}
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
                  ariaLabel={t("features.videoWheelControl.settings.volumeStep")}
                />
              </div>
            )}

            {/* Volume Behaviors */}
            <div className="divide-y divide-border-divider">
              <SettingToggleRow
                icon={<MousePointerClick className="w-5 h-5 text-violet-400" />}
                title={t("features.videoWheelControl.settings.clickToMute")}
                description={t(
                  "features.videoWheelControl.settings.clickToMuteDesc",
                  { key: currentConfig.volumeModifier.toUpperCase() }
                )}
                enabled={
                  currentConfig.clickToMute && currentConfig.enableVolume
                }
                disabled={!currentConfig.enableVolume}
                onToggle={(enabled) => updateConfig({ clickToMute: enabled })}
              />

              <SettingToggleRow
                icon={<ArrowUpDown className="w-5 h-5 text-content-muted" />}
                title={t("features.videoWheelControl.settings.invertVolume")}
                description={t(
                  "features.videoWheelControl.settings.invertVolumeDesc"
                )}
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
                    {t("features.videoWheelControl.settings.speedControl")}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-content-muted">
                    {currentConfig.enableSpeed
                      ? t("common.enabled")
                      : t("common.disabled")}
                  </span>
                  <Switch
                    size="sm"
                    checked={currentConfig.enableSpeed}
                    onChange={(checked) =>
                      updateConfig({ enableSpeed: checked })
                    }
                    ariaLabel={t(
                      "features.videoWheelControl.settings.speedControl"
                    )}
                  />
                </div>
              </div>

              {/* Modifier Trailing Dropdown */}
              <div className="flex items-center justify-between gap-3 pt-1">
                <div className="flex flex-col min-w-0">
                  <span className="text-xs font-medium text-content-primary">
                    {t("features.videoWheelControl.settings.modifierKey")}
                  </span>
                  <span className="text-[11px] text-content-muted">
                    {t("features.videoWheelControl.settings.modifierKeyDesc")}
                  </span>
                </div>
                <SelectDropdown<VideoWheelModifier>
                  disabled={!currentConfig.enableSpeed}
                  options={MODIFIER_OPTIONS}
                  value={currentConfig.speedModifier}
                  onChange={(modifier) =>
                    updateConfig({ speedModifier: modifier })
                  }
                  ariaLabel={t("features.videoWheelControl.settings.modifierKey")}
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
                      {t("features.videoWheelControl.settings.speedStep")}
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
                  ariaLabel={t("features.videoWheelControl.settings.speedStep")}
                />
              </div>
            )}

            {/* Speed Behaviors & Hold-to-Boost */}
            <div className="divide-y divide-border-divider pt-1">
              <SettingToggleRow
                icon={<Zap className="w-5 h-5 text-amber-500" />}
                title={t("features.videoWheelControl.settings.holdXBoost")}
                description={t(
                  "features.videoWheelControl.settings.holdXBoostDesc"
                )}
                enabled={currentConfig.enableHoldToBoost}
                onToggle={(enabled) =>
                  updateConfig({ enableHoldToBoost: enabled })
                }
              />

              <SettingToggleRow
                icon={<Maximize2 className="w-5 h-5 text-sky-400" />}
                title={t(
                  "features.videoWheelControl.settings.clickToFullscreen"
                )}
                description={t(
                  "features.videoWheelControl.settings.clickToFullscreenDesc",
                  { key: currentConfig.speedModifier.toUpperCase() }
                )}
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
                title={t("features.videoWheelControl.settings.invertSpeed")}
                description={t(
                  "features.videoWheelControl.settings.invertSpeedDesc"
                )}
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
                    {t("features.videoWheelControl.settings.seekControl")}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-content-muted">
                    {currentConfig.enableSeek
                      ? t("common.enabled")
                      : t("common.disabled")}
                  </span>
                  <Switch
                    size="sm"
                    checked={currentConfig.enableSeek}
                    onChange={(checked) =>
                      updateConfig({ enableSeek: checked })
                    }
                    ariaLabel={t(
                      "features.videoWheelControl.settings.seekControl"
                    )}
                  />
                </div>
              </div>

              {/* Modifier Trailing Dropdown */}
              <div className="flex items-center justify-between gap-3 pt-1">
                <div className="flex flex-col min-w-0">
                  <span className="text-xs font-medium text-content-primary">
                    {t("features.videoWheelControl.settings.modifierKey")}
                  </span>
                  <span className="text-[11px] text-content-muted">
                    {t("features.videoWheelControl.settings.modifierKeyDesc")}
                  </span>
                </div>
                <SelectDropdown<VideoWheelModifier>
                  disabled={!currentConfig.enableSeek}
                  options={MODIFIER_OPTIONS}
                  value={currentConfig.seekModifier}
                  onChange={(modifier) =>
                    updateConfig({ seekModifier: modifier })
                  }
                  ariaLabel={t("features.videoWheelControl.settings.modifierKey")}
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
                      {t("features.videoWheelControl.settings.seekStep")}
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
                  ariaLabel={t("features.videoWheelControl.settings.seekStep")}
                />
              </div>
            )}

            {/* Seek Behaviors */}
            <div className="divide-y divide-border-divider pt-1">
              <SettingToggleRow
                icon={<Film className="w-5 h-5 text-amber-400" />}
                title={t("features.videoWheelControl.settings.frameStepper")}
                description={t(
                  "features.videoWheelControl.settings.frameStepperDesc"
                )}
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
                title={t("features.videoWheelControl.settings.invertSeek")}
                description={t(
                  "features.videoWheelControl.settings.invertSeekDesc"
                )}
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
                title={t("features.videoWheelControl.settings.screenshot")}
                description={t(
                  "features.videoWheelControl.settings.screenshotDesc"
                )}
                enabled={currentConfig.enableScreenshot}
                onToggle={(enabled) =>
                  updateConfig({ enableScreenshot: enabled })
                }
              />

              {/* Show OSD */}
              <SettingToggleRow
                icon={<Eye className="w-5 h-5 text-indigo-400" />}
                title={t("features.videoWheelControl.settings.osd")}
                description={t("features.videoWheelControl.settings.osdDesc")}
                enabled={currentConfig.showOsd}
                onToggle={(enabled) => updateConfig({ showOsd: enabled })}
              />

              {currentConfig.showOsd && (
                <div className="flex items-center justify-between gap-3 py-2.5">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <Droplets className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />
                    <div className="flex flex-col min-w-0">
                      <span className="text-xs font-semibold text-content-primary">
                        {t("features.videoWheelControl.settings.osdOpacity")}
                      </span>
                      <span className="text-[11px] text-content-muted leading-snug mt-0.5">
                        {t(
                          "features.videoWheelControl.settings.osdOpacityDesc"
                        )}
                      </span>
                    </div>
                  </div>

                  <SelectDropdown<string>
                    value={String(currentConfig.osdOpacity ?? 1)}
                    options={OPACITY_DROPDOWN_OPTIONS}
                    onChange={(val) => {
                      const osdOpacity = parseFloat(val)
                      if (!Number.isNaN(osdOpacity)) {
                        updateConfig({ osdOpacity })
                      }
                    }}
                    ariaLabel={t(
                      "features.videoWheelControl.settings.osdOpacity"
                    )}
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {/* Compatibility & State Notice Card - Always pinned at bottom */}
        <div className="card-subtle p-3 text-[11px] text-content-muted space-y-1.5 border border-border-subtle/80 pt-2.5">
          <div className="flex items-center gap-1.5 font-semibold text-content-secondary">
            <Info className="w-3.5 h-3.5 text-violet-400 shrink-0" />
            <span>{t("features.videoWheelControl.settings.noticeTitle")}</span>
          </div>
          <p className="leading-relaxed">
            {t("features.videoWheelControl.settings.noticeBody1")}
          </p>
          <p className="leading-relaxed text-content-muted">
            {t("features.videoWheelControl.settings.noticeBody2")}
          </p>
        </div>
      </div>
    </SubSettingsLayout>
  )
}
