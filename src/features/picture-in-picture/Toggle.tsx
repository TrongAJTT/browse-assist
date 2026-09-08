import { PictureInPicture2 } from "lucide-react"
import type React from "react"

import { useStorage } from "@plasmohq/storage/hook"

import { ToggleSwitch } from "~components/ToggleSwitch"
import {
  DEFAULT_SETTINGS,
  FEATURES_LIST,
  STORAGE_KEYS,
  type FeatureSettings
} from "~core/types"

const meta = FEATURES_LIST.find((f) => f.key === "pictureInPicture")!

interface PictureInPictureToggleProps {
  onOpenSettings?: () => void
}

/**
 * Toggle component for Universal Picture-in-Picture.
 */
export const PictureInPictureToggle: React.FC<PictureInPictureToggleProps> = ({
  onOpenSettings
}) => {
  const [settings, setSettings] = useStorage<FeatureSettings>(
    STORAGE_KEYS.SETTINGS,
    DEFAULT_SETTINGS
  )

  const isEnabled =
    settings?.pictureInPicture ?? DEFAULT_SETTINGS.pictureInPicture

  const handleToggle = (enabled: boolean) => {
    setSettings((prev) => ({
      ...(prev ?? DEFAULT_SETTINGS),
      pictureInPicture: enabled
    }))
  }

  return (
    <ToggleSwitch
      icon={<PictureInPicture2 className="w-5 h-5 text-indigo-400" />}
      title={meta.title}
      description={meta.description}
      enabled={isEnabled}
      onChange={handleToggle}
      shortcut="Alt + P"
      onConfigure={onOpenSettings}
    />
  )
}
