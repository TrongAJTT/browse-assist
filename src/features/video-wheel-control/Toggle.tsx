import { Volume2 } from "lucide-react"
import type React from "react"

import { useStorage } from "@plasmohq/storage/hook"

import { ToggleSwitch } from "~components/ToggleSwitch"
import { FEATURE_CATALOG } from "~core/featureCatalog"
import {
  DEFAULT_SETTINGS,
  STORAGE_KEYS,
  type FeatureSettings
} from "~core/types"

const meta = FEATURE_CATALOG.videoWheelControl

interface VideoWheelControlToggleProps {
  onOpenSettings?: () => void
}

/**
 * Toggle component for Video Wheel Control.
 */
export const VideoWheelControlToggle: React.FC<
  VideoWheelControlToggleProps
> = ({ onOpenSettings }) => {
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
