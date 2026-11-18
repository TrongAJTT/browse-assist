import { Bell, Droplets, Eye, MousePointerClick, PauseCircle } from "lucide-react"
import type React from "react"
import { useEffect, useState } from "react"

import { useStorage } from "@plasmohq/storage/hook"

import { EdgePositionPicker } from "~components/EdgePositionPicker"
import { FeatureShortcutRow } from "~components/FeatureShortcutRow"
import {
  OPACITY_DROPDOWN_OPTIONS,
  SelectDropdown
} from "~components/SelectDropdown"
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
import { useI18n } from "~core/useI18n"

interface PictureInPictureSettingsViewProps {
  onBack: () => void
}


/**
 * Sub-settings view for Universal Picture-in-Picture.
 */
export const PictureInPictureSettingsView: React.FC<
  PictureInPictureSettingsViewProps
> = ({ onBack }) => {
  const { t } = useI18n()
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
          setShortcut("")
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
      title={t("features.pictureInPicture.settings.shortTitle")}
      enabled={isMasterEnabled}
      onToggle={handleToggleMaster}
      onBack={onBack}>
      <div className="space-y-4">
        {/* Shortcut Section */}
        <FeatureShortcutRow
          title={t("features.pictureInPicture.settings.globalShortcut")}
          description={t(
            "features.pictureInPicture.settings.globalShortcutDesc"
          )}
          shortcut={shortcut}
          iconColorClass="text-indigo-400"
          onConfigureShortcuts={handleOpenShortcutsPage}
        />

        {/* Options */}
        <div className="space-y-2 pt-2 border-t border-border-divider">
          <span className="section-header">
            {t("features.pictureInPicture.settings.displayFeedback")}
          </span>

          <div className="divide-y divide-border-divider">
            {/* Show Badge */}
            <SettingToggleRow
              icon={<Eye className="w-5 h-5 text-accent" />}
              title={t("features.pictureInPicture.settings.extensionBadge")}
              description={t(
                "features.pictureInPicture.settings.extensionBadgeDesc"
              )}
              enabled={currentConfig.showBadge}
              onToggle={() => handleToggleOption("showBadge")}
            />

            {/* Show Action Toast */}
            <SettingToggleRow
              icon={<Bell className="w-5 h-5 text-emerald-400" />}
              title={t("features.pictureInPicture.settings.actionToast")}
              description={t(
                "features.pictureInPicture.settings.actionToastDesc"
              )}
              enabled={currentConfig.showToast}
              onToggle={() => handleToggleOption("showToast")}
            />

            {/* Auto-Pause on Exit PiP */}
            <SettingToggleRow
              icon={<PauseCircle className="w-5 h-5 text-amber-400" />}
              title={t("features.pictureInPicture.settings.autoPauseOnExit")}
              description={t(
                "features.pictureInPicture.settings.autoPauseOnExitDesc"
              )}
              enabled={Boolean(currentConfig.autoPauseOnExit)}
              onToggle={() => handleToggleOption("autoPauseOnExit")}
            />

            {/* Hover PiP Button */}
            <SettingToggleRow
              icon={<MousePointerClick className="w-5 h-5 text-indigo-400" />}
              title={t("features.pictureInPicture.settings.hoverButton")}
              badge={{
                text: t("common.unstable"),
                bgClass: "bg-amber-500/10",
                colorClass: "text-amber-400",
                borderClass: "border-amber-500/25"
              }}
              description={t(
                "features.pictureInPicture.settings.hoverButtonDesc"
              )}
              enabled={currentConfig.hoverButton}
              onToggle={() => handleToggleOption("hoverButton")}
            />
          </div>
        </div>

        {/* Hover Button Corner Position (when enabled) */}
        {currentConfig.hoverButton && (
          <div className="space-y-2 pt-2 border-t border-border-divider">
            <span className="section-header">
              {t("features.pictureInPicture.settings.buttonPosition")}
            </span>
            <div className="space-y-1.5">
              <span className="text-xs font-semibold text-content-primary">
                {t("features.pictureInPicture.settings.edgeAlignment")}
              </span>
              <p className="text-[11px] text-content-muted leading-snug">
                {t("features.pictureInPicture.settings.edgeAlignmentDesc")}
              </p>
              <EdgePositionPicker
                value={currentPlacement}
                onChange={handleSelectPlacement}
                allowedEdges={["top", "right", "bottom", "left"]}
              />
            </div>

            <div className="flex items-center justify-between gap-3 pt-2">
              <div className="flex items-start gap-3 flex-1 min-w-0">
                <Droplets className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />
                <div className="flex flex-col min-w-0">
                  <span className="text-xs font-semibold text-content-primary">
                    {t("common.buttonOpacity")}
                  </span>
                  <p className="text-[11px] text-content-muted mt-0.5 leading-snug">
                    {t(
                      "features.pictureInPicture.settings.buttonOpacityDesc"
                    )}
                  </p>
                </div>
              </div>

              <SelectDropdown<string>
                value={String(currentConfig.hoverButtonOpacity ?? 1)}
                options={OPACITY_DROPDOWN_OPTIONS}
                onChange={(val) => {
                  const opacity = parseFloat(val)
                  if (Number.isNaN(opacity)) return
                  setSettings((prev) => ({
                    ...(prev ?? DEFAULT_SETTINGS),
                    pictureInPictureConfig: {
                      ...(prev?.pictureInPictureConfig ??
                        DEFAULT_SETTINGS.pictureInPictureConfig),
                      hoverButtonOpacity: opacity
                    }
                  }))
                }}
                ariaLabel={t("common.buttonOpacity")}
              />
            </div>
          </div>
        )}
      </div>
    </SubSettingsLayout>
  )
}
