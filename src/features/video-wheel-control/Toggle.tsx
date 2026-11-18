import { Volume2 } from "lucide-react"
import type React from "react"

import { useStorage } from "@plasmohq/storage/hook"

import { ToggleSwitch } from "~components/ToggleSwitch"
import { getLocalizedFeatureMeta } from "~core/featureCatalog"
import { useI18n } from "~core/useI18n"
import {
  DEFAULT_SETTINGS,
  STORAGE_KEYS,
  type FeatureSettings
} from "~core/types"

interface VideoWheelControlToggleProps {
  onOpenSettings?: () => void
}

/**
 * Toggle component for Video Wheel Control.
 */
export const VideoWheelControlToggle: React.FC<
  VideoWheelControlToggleProps
> = ({ onOpenSettings }) => {
  useI18n()
  const meta = getLocalizedFeatureMeta("videoWheelControl")
  const [settings, setSettings] = useStorage<FeatureSettings>(
    STORAGE_KEYS.SETTINGS,
    DEFAULT_SETTINGS
  )

  const isEnabled =
    settings?.videoWheelControl ?? DEFAULT_SETTINGS.videoWheelControl
  const config =
    settings?.videoWheelControlConfig ??
    DEFAULT_SETTINGS.videoWheelControlConfig

  const handleToggle = (enabled: boolean) => {
    setSettings((prev) => ({
      ...(prev ?? DEFAULT_SETTINGS),
      videoWheelControl: enabled
    }))
  }

  const volModText = config.volumeModifier.toUpperCase()
  const speedModText = config.speedModifier.toUpperCase()
  const badgeText = `Vol: ${volModText} • Spd: ${speedModText}`

  return (
    <ToggleSwitch
      icon={<Volume2 className="w-5 h-5 text-violet-400" />}
      title={meta.title}
      description={meta.description}
      enabled={isEnabled}
      onChange={handleToggle}
      badge={badgeText}
      onConfigure={onOpenSettings}
    />
  )
}
