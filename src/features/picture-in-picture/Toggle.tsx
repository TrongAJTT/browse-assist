import { PictureInPicture2 } from "lucide-react"
import type React from "react"
import { useEffect, useState } from "react"

import { useStorage } from "@plasmohq/storage/hook"

import { ToggleSwitch } from "~components/ToggleSwitch"
import { getLocalizedFeatureMeta } from "~core/featureCatalog"
import { useI18n } from "~core/useI18n"
import {
  DEFAULT_SETTINGS,
  STORAGE_KEYS,
  type FeatureSettings
} from "~core/types"

interface PictureInPictureToggleProps {
  onOpenSettings?: () => void
}

/**
 * Toggle component for Universal Picture-in-Picture.
 */
export const PictureInPictureToggle: React.FC<PictureInPictureToggleProps> = ({
  onOpenSettings
}) => {
  useI18n()
  const meta = getLocalizedFeatureMeta("pictureInPicture")
  const [settings, setSettings] = useStorage<FeatureSettings>(
    STORAGE_KEYS.SETTINGS,
    DEFAULT_SETTINGS
  )
  const [shortcut, setShortcut] = useState<string>("Alt + P")

  useEffect(() => {
    if (chrome.commands?.getAll) {
      chrome.commands.getAll((commands) => {
        const cmd = commands.find(
          (c) => c.name === "toggle_picture_in_picture"
        )
        if (cmd?.shortcut) {
          setShortcut(cmd.shortcut)
        } else {
          setShortcut("")
        }
      })
    }
  }, [])

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
      shortcut={shortcut}
      onConfigure={onOpenSettings}
    />
  )
}
