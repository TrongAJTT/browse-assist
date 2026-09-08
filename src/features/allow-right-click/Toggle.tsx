import { MousePointerClick } from "lucide-react"
import type React from "react"

import { useStorage } from "@plasmohq/storage/hook"

import { ToggleSwitch } from "~components/ToggleSwitch"
import {
  DEFAULT_SETTINGS,
  FEATURES_LIST,
  STORAGE_KEYS,
  type FeatureSettings
} from "~core/types"

const meta = FEATURES_LIST.find((f) => f.key === "allowRightClick")!

/**
 * Allow Right Click toggle row component for Popup UI.
 */
export const AllowRightClickToggle: React.FC = () => {
  const [settings, setSettings] = useStorage<FeatureSettings>(
    STORAGE_KEYS.SETTINGS,
    DEFAULT_SETTINGS
  )

  const isEnabled =
    settings?.allowRightClick ?? DEFAULT_SETTINGS.allowRightClick

  const handleChange = (enabled: boolean) => {
    setSettings((prev) => ({
      ...(prev ?? DEFAULT_SETTINGS),
      allowRightClick: enabled
    }))
  }

  return (
    <ToggleSwitch
      icon={<MousePointerClick className="w-4 h-4 text-emerald-400" />}
      title={meta.title}
      description={meta.description}
      enabled={isEnabled}
      onChange={handleChange}
    />
  )
}
