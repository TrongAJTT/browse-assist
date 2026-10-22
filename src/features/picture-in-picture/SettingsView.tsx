import { Eye, MousePointerClick } from "lucide-react"
import type React from "react"
import { useEffect, useState } from "react"

import { useStorage } from "@plasmohq/storage/hook"

import { EdgePositionPicker } from "~components/EdgePositionPicker"
import { FeatureShortcutRow } from "~components/FeatureShortcutRow"
import { SettingToggleRow } from "~components/SettingToggleRow"
import { SubSettingsLayout } from "~components/SubSettingsLayout"
import { openBrowserShortcutsPage } from "~core/shortcutsHelper"
import {
  DEFAULT_PICTURE_IN_PICTURE_CONFIG,
  DEFAULT_SETTINGS,
  STORAGE_KEYS,
  type EdgePlacement,
  type FeatureSettings,
  type PictureInPictureConfig,
  normalizeEdgePlacement
} from "~core/types"

interface PictureInPictureSettingsViewProps {
  onBack: () => void
}


/**
 * Sub-settings view for Universal Picture-in-Picture.
 */
export const PictureInPictureSettingsView: React.FC<
  PictureInPictureSettingsViewProps
> = ({ onBack }) => {
  const [settings, setSettings] = useStorage<FeatureSettings>(
    STORAGE_KEYS.SETTINGS,
    DEFAULT_SETTINGS
  )
  const [shortcut, setShortcut] = useState<string>("Alt + P")

  useEffect(() => {
    if (chrome.commands?.getAll) {
      chrome.commands.getAll((commands) => {
        const cmd = commands.find((c) => c.name === "toggle_picture_in_picture")
        if (cmd?.shortcut) {
          setShortcut(cmd.shortcut)
        } else {
          setShortcut("Not configured")
        }
      })
    }
  }, [])

  const isMasterEnabled =
    settings?.pictureInPicture ?? DEFAULT_SETTINGS.pictureInPicture
  const currentConfig: PictureInPictureConfig =
    settings?.pictureInPictureConfig ?? DEFAULT_SETTINGS.pictureInPictureConfig

  const handleToggleMaster = (enabled: boolean) => {
    setSettings((prev) => ({
      ...(prev ?? DEFAULT_SETTINGS),
      pictureInPicture: enabled
    }))
  }

  const handleToggleOption = (key: keyof PictureInPictureConfig) => {
    setSettings((prev) => ({
      ...(prev ?? DEFAULT_SETTINGS),
      pictureInPictureConfig: {
        ...(prev?.pictureInPictureConfig ??
          DEFAULT_SETTINGS.pictureInPictureConfig),
        [key]: !currentConfig[key]
      }
    }))
  }

  const currentPlacement = normalizeEdgePlacement(
    currentConfig.placement ?? currentConfig.buttonPosition,
    DEFAULT_PICTURE_IN_PICTURE_CONFIG.placement
  )

  const handleSelectPlacement = (placement: EdgePlacement) => {
    setSettings((prev) => ({
      ...(prev ?? DEFAULT_SETTINGS),
      pictureInPictureConfig: {
        ...(prev?.pictureInPictureConfig ??
          DEFAULT_SETTINGS.pictureInPictureConfig),
        placement,
        buttonPosition:
          placement.edge === "top"
            ? placement.offsetPercent < 50
              ? "top-left"
              : "top-right"
            : placement.edge === "bottom"
              ? placement.offsetPercent < 50
                ? "bottom-left"
                : "bottom-right"
              : placement.edge === "left"
                ? placement.offsetPercent < 50
                  ? "top-left"
                  : "bottom-left"
                : placement.offsetPercent < 50
                  ? "top-right"
                  : "bottom-right"
      }
    }))
  }

  const handleOpenShortcutsPage = () => {
    openBrowserShortcutsPage().catch(() => {})
  }

  return (
    <SubSettingsLayout
      title="Picture-in-Picture"
      enabled={isMasterEnabled}
      onToggle={handleToggleMaster}
      onBack={onBack}>
      <div className="space-y-4">
        {/* Shortcut Section */}
        <FeatureShortcutRow
          title="Global Shortcut"
          description="Toggle floating video window"
          shortcut={shortcut}
          iconColorClass="text-indigo-400"
          onConfigureShortcuts={handleOpenShortcutsPage}
        />

        {/* Options */}
        <div className="space-y-2 pt-2 border-t border-border-divider">
          <span className="section-header">Display & Feedback</span>

          <div className="divide-y divide-border-divider">
            {/* Show Badge */}
            <SettingToggleRow
              icon={<Eye className="w-5 h-5 text-accent" />}
              title="Extension Badge Indicator"
              description="Show “PiP” badge on extension icon whenever a video is playing in PiP."
              enabled={currentConfig.showBadge}
              onToggle={() => handleToggleOption("showBadge")}
            />

            {/* Show Action Toast */}
            <SettingToggleRow
              icon={<Eye className="w-5 h-5 text-emerald-400" />}
              title="Action Toast Notification"
              description="Display brief confirmation toast when entering or exiting PiP."
              enabled={currentConfig.showToast}
              onToggle={() => handleToggleOption("showToast")}
            />

            {/* Hover PiP Button */}
            <SettingToggleRow
              icon={<MousePointerClick className="w-5 h-5 text-indigo-400" />}
              title="Hover Video PiP Button"
              badge={{
                text: "Unstable",
                bgClass: "bg-amber-500/10",
                colorClass: "text-amber-400",
                borderClass: "border-amber-500/25"
              }}
              description="Show a floating PiP trigger inside playing videos. May be unstable or blocked on some custom web video players."
              enabled={currentConfig.hoverButton}
              onToggle={() => handleToggleOption("hoverButton")}
            />
          </div>
        </div>

        {/* Hover Button Corner Position (when enabled) */}
        {currentConfig.hoverButton && (
          <div className="space-y-2 pt-2 border-t border-border-divider">
            <span className="section-header">Button Position</span>
            <div className="space-y-1.5">
              <span className="text-xs font-semibold text-content-primary">
                Edge & Alignment
              </span>
              <p className="text-[11px] text-content-muted leading-snug">
                Drag or click along the edges to anchor the floating PiP button inside the video frame.
              </p>
              <EdgePositionPicker
                value={currentPlacement}
                onChange={handleSelectPlacement}
                allowedEdges={["top", "right", "bottom", "left"]}
              />
            </div>
          </div>
        )}
      </div>
    </SubSettingsLayout>
  )
}
