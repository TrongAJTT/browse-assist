import { Image as ImageIcon } from "lucide-react"
import type React from "react"

import { useStorage } from "@plasmohq/storage/hook"

import { ToggleSwitch } from "~components/ToggleSwitch"
import { getLocalizedFeatureMeta } from "~core/featureCatalog"
import { useI18n } from "~core/useI18n"
import {
  DEFAULT_IMAGE_HOVER_PREVIEW_CONFIG,
  DEFAULT_SETTINGS,
  STORAGE_KEYS,
  type FeatureSettings
} from "~core/types"

interface ImageHoverPreviewToggleProps {
  onConfigure?: () => void
}

/**
 * Image Hover Preview toggle row for Popup UI.
 */
export const ImageHoverPreviewToggle: React.FC<
  ImageHoverPreviewToggleProps
> = ({ onConfigure }) => {
  useI18n()
  const meta = getLocalizedFeatureMeta("imageHoverPreview")
  const [settings, setSettings] = useStorage<FeatureSettings>(
    STORAGE_KEYS.SETTINGS,
    DEFAULT_SETTINGS
  )

  const isEnabled =
    settings?.imageHoverPreview ?? DEFAULT_SETTINGS.imageHoverPreview
  const config =
    settings?.imageHoverPreviewConfig ?? DEFAULT_IMAGE_HOVER_PREVIEW_CONFIG

  const handleToggle = (enabled: boolean) => {
    setSettings((prev) => ({
      ...(prev ?? DEFAULT_SETTINGS),
      imageHoverPreview: enabled
    }))
  }

  const modLabel = (config.triggerModifier || "shift").toUpperCase()

  return (
    <ToggleSwitch
      icon={<ImageIcon className="w-5 h-5 text-sky-400" />}
      title={meta.title}
      description={meta.description}
      enabled={isEnabled}
      onChange={handleToggle}
      badge={modLabel}
      onConfigure={onConfigure}
    />
  )
}
