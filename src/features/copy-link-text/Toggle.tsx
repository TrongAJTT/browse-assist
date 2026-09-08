import type React from "react"
import { useStorage } from "@plasmohq/storage/hook"

import { ToggleSwitch } from "~components/ToggleSwitch"
import {
  DEFAULT_SETTINGS,
  FEATURES_LIST,
  STORAGE_KEYS,
  type FeatureSettings
} from "~core/types"

const meta = FEATURES_LIST.find((f) => f.key === "copyLinkText")!

/**
 * Copy Link Text toggle row component for Popup UI.
 */
export const CopyLinkTextToggle: React.FC = () => {
  const [settings, setSettings] = useStorage<FeatureSettings>(
    STORAGE_KEYS.SETTINGS,
    DEFAULT_SETTINGS
  )

  const isEnabled = settings?.copyLinkText ?? DEFAULT_SETTINGS.copyLinkText

  const handleChange = (enabled: boolean) => {
    setSettings((prev) => ({
      ...(prev ?? DEFAULT_SETTINGS),
      copyLinkText: enabled
    }))
  }

  return (
    <ToggleSwitch
      icon={meta.icon}
      title={meta.title}
      description={meta.description}
      enabled={isEnabled}
      onChange={handleChange}
    />
  )
}
