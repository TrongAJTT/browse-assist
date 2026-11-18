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

interface ImageHoverPreviewSettingsViewProps {
  onBack: () => void
}

const MODIFIER_OPTIONS: SelectDropdownOption<ImageHoverPreviewModifier>[] = [
  { id: "shift", label: "Shift" },
  { id: "alt", label: "Alt" },
  { id: "ctrl", label: "Ctrl" }
]

const DELAY_OPTIONS: SelectDropdownOption<string>[] = [
  { id: "0", label: "Instant" },
  { id: "150", label: "150ms" },
  { id: "250", label: "250ms" },
  { id: "450", label: "450ms" }
]

/**
 * Sub-settings view for Image Hover Preview.
 */
export const ImageHoverPreviewSettingsView: React.FC<
  ImageHoverPreviewSettingsViewProps
> = ({ onBack }) => {
  const [settings, setSettings] = useStorage<FeatureSettings>(
    STORAGE_KEYS.SETTINGS,
    DEFAULT_SETTINGS
  )

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
      title="Image Hover Preview"
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
          <span className="section-header">Activation</span>

          <div className="flex items-center justify-between gap-3 py-0.5">
            <div className="flex items-start gap-3 flex-1 min-w-0">
              <Command className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-semibold text-content-primary">
                  Trigger Modifier
                </span>
                <p className="text-[11px] text-content-muted mt-0.5 leading-snug">
                  Hold this key while hovering an image to preview.
                </p>
              </div>
            </div>

            <SelectDropdown<ImageHoverPreviewModifier>
              value={currentConfig.triggerModifier}
              options={MODIFIER_OPTIONS}
              onChange={(triggerModifier) => updateConfig({ triggerModifier })}
              ariaLabel="Trigger Modifier"
            />
          </div>

          <div className="flex items-center justify-between gap-3 py-0.5">
            <div className="flex items-start gap-3 flex-1 min-w-0">
              <Clock className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-semibold text-content-primary">
                  Hover Delay
                </span>
                <p className="text-[11px] text-content-muted mt-0.5 leading-snug">
                  Wait time before opening the preview card.
                </p>
              </div>
            </div>

            <SelectDropdown<string>
              value={String(currentConfig.delayMs)}
              options={DELAY_OPTIONS}
              onChange={(val) => {
                const delayMs = parseInt(val, 10)
                if (!Number.isNaN(delayMs)) updateConfig({ delayMs })
              }}
              ariaLabel="Hover Delay"
            />
          </div>
        </div>

        {/* Size Limit */}
        <div className="space-y-2 pt-3 border-t border-border-divider">
          <div className="flex items-center gap-1.5">
            <Maximize2 className="w-3.5 h-3.5 text-sky-400" />
            <span className="section-header">Display Size</span>
          </div>

          <Slider
            label="Max Viewport Size"
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
          <span className="section-header">Behavior</span>
          <div className="divide-y divide-border-divider">
            <SettingToggleRow
              icon={<Link2 className="w-5 h-5 text-cyan-400" />}
              title="Preview Image Links"
              description="Show image preview when hovering hyperlinks pointing to image files."
              enabled={currentConfig.previewImageLinks}
              onToggle={(previewImageLinks) =>
                updateConfig({ previewImageLinks })
              }
            />

            <SettingToggleRow
              icon={<Ruler className="w-5 h-5 text-amber-400" />}
              title="Show Dimensions Badge"
              description="Display natural width × height (px) on the preview corner."
              enabled={currentConfig.showDimensions}
              onToggle={(showDimensions) => updateConfig({ showDimensions })}
            />
          </div>
        </div>
      </div>
    </SubSettingsLayout>
  )
}
