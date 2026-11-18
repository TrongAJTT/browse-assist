import { Clock, Command, Link2, Maximize2, Ruler } from "lucide-react"
import type React from "react"

import { useStorage } from "@plasmohq/storage/hook"

import {
  SelectDropdown,
  type SelectDropdownOption
} from "~components/SelectDropdown"
import { SettingToggleRow } from "~components/SettingToggleRow"
import { Slider } from "~components/Slider"
import { SubSettingsLayout } from "~components/SubSettingsLayout"
import {
  DEFAULT_IMAGE_HOVER_PREVIEW_CONFIG,
  DEFAULT_SETTINGS,
  STORAGE_KEYS,
  type FeatureSettings,
  type ImageHoverPreviewConfig,
  type ImageHoverPreviewModifier
} from "~core/types"
import { useI18n } from "~core/useI18n"

interface ImageHoverPreviewSettingsViewProps {
  onBack: () => void
}

const MODIFIER_OPTIONS: SelectDropdownOption<ImageHoverPreviewModifier>[] = [
  { id: "shift", label: "Shift" },
  { id: "alt", label: "Alt" },
  { id: "ctrl", label: "Ctrl" }
]

/**
 * Sub-settings view for Image Hover Preview.
 */
export const ImageHoverPreviewSettingsView: React.FC<
  ImageHoverPreviewSettingsViewProps
> = ({ onBack }) => {
  const { t } = useI18n()
  const [settings, setSettings] = useStorage<FeatureSettings>(
    STORAGE_KEYS.SETTINGS,
    DEFAULT_SETTINGS
  )

  const delayOptions: SelectDropdownOption<string>[] = [
    { id: "0", label: t("features.imageHoverPreview.settings.instant") },
    { id: "150", label: "150ms" },
    { id: "250", label: "250ms" },
    { id: "450", label: "450ms" }
  ]

  const isMasterEnabled =
    settings?.imageHoverPreview ?? DEFAULT_SETTINGS.imageHoverPreview
  const currentConfig: ImageHoverPreviewConfig =
    settings?.imageHoverPreviewConfig ?? DEFAULT_IMAGE_HOVER_PREVIEW_CONFIG

  const updateConfig = (patch: Partial<ImageHoverPreviewConfig>) => {
    setSettings((prev) => ({
      ...(prev ?? DEFAULT_SETTINGS),
      imageHoverPreviewConfig: {
        ...(prev?.imageHoverPreviewConfig ??
          DEFAULT_IMAGE_HOVER_PREVIEW_CONFIG),
        ...patch
      }
    }))
  }

  return (
    <SubSettingsLayout
      title={t("features.imageHoverPreview.title")}
      enabled={isMasterEnabled}
      onToggle={(enabled) =>
        setSettings((prev) => ({
          ...(prev ?? DEFAULT_SETTINGS),
          imageHoverPreview: enabled
        }))
      }
      onBack={onBack}>
      <div className="space-y-4">
        {/* Trigger & Timing */}
        <div className="space-y-3">
          <span className="section-header">
            {t("features.imageHoverPreview.settings.activation")}
          </span>

          <div className="flex items-center justify-between gap-3 py-0.5">
            <div className="flex items-start gap-3 flex-1 min-w-0">
              <Command className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-semibold text-content-primary">
                  {t("features.imageHoverPreview.settings.triggerModifier")}
                </span>
                <p className="text-[11px] text-content-muted mt-0.5 leading-snug">
                  {t("features.imageHoverPreview.settings.triggerModifierDesc")}
                </p>
              </div>
            </div>

            <SelectDropdown<ImageHoverPreviewModifier>
              value={currentConfig.triggerModifier}
              options={MODIFIER_OPTIONS}
              onChange={(triggerModifier) => updateConfig({ triggerModifier })}
              ariaLabel={t("features.imageHoverPreview.settings.triggerModifier")}
            />
          </div>

          <div className="flex items-center justify-between gap-3 py-0.5">
            <div className="flex items-start gap-3 flex-1 min-w-0">
              <Clock className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-semibold text-content-primary">
                  {t("features.imageHoverPreview.settings.hoverDelay")}
                </span>
                <p className="text-[11px] text-content-muted mt-0.5 leading-snug">
                  {t("features.imageHoverPreview.settings.hoverDelayDesc")}
                </p>
              </div>
            </div>

            <SelectDropdown<string>
              value={String(currentConfig.delayMs)}
              options={delayOptions}
              onChange={(val) => {
                const delayMs = parseInt(val, 10)
                if (!Number.isNaN(delayMs)) updateConfig({ delayMs })
              }}
              ariaLabel={t("features.imageHoverPreview.settings.hoverDelay")}
            />
          </div>
        </div>

        {/* Size Limit */}
        <div className="space-y-2 pt-3 border-t border-border-divider">
          <div className="flex items-center gap-1.5">
            <Maximize2 className="w-3.5 h-3.5 text-sky-400" />
            <span className="section-header">
              {t("features.imageHoverPreview.settings.displaySize")}
            </span>
          </div>

          <Slider
            label={t("features.imageHoverPreview.settings.maxViewportSize")}
            value={currentConfig.maxSizePercent}
            valueDisplay={`${currentConfig.maxSizePercent}%`}
            min={35}
            max={85}
            step={5}
            onChange={(val) => updateConfig({ maxSizePercent: val })}
          />
        </div>

        {/* Behavior Toggles */}
        <div className="space-y-1 pt-3 border-t border-border-divider">
          <span className="section-header">
            {t("features.imageHoverPreview.settings.behavior")}
          </span>
          <div className="divide-y divide-border-divider">
            <SettingToggleRow
              icon={<Link2 className="w-5 h-5 text-cyan-400" />}
              title={t("features.imageHoverPreview.settings.previewImageLinks")}
              description={t(
                "features.imageHoverPreview.settings.previewImageLinksDesc"
              )}
              enabled={currentConfig.previewImageLinks}
              onToggle={(previewImageLinks) =>
                updateConfig({ previewImageLinks })
              }
            />

            <SettingToggleRow
              icon={<Ruler className="w-5 h-5 text-amber-400" />}
              title={t("features.imageHoverPreview.settings.showDimensions")}
              description={t(
                "features.imageHoverPreview.settings.showDimensionsDesc"
              )}
              enabled={currentConfig.showDimensions}
              onToggle={(showDimensions) => updateConfig({ showDimensions })}
            />
          </div>
        </div>
      </div>
    </SubSettingsLayout>
  )
}
