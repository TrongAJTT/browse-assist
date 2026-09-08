import { Compass } from "lucide-react"
import type React from "react"

import { useStorage } from "@plasmohq/storage/hook"

import { ToggleSwitch } from "~components/ToggleSwitch"
import {
  DEFAULT_SETTINGS,
  FEATURES_LIST,
  STORAGE_KEYS,
  type FeatureSettings
} from "~core/types"

const meta = FEATURES_LIST.find((f) => f.key === "quickScroll")!

interface QuickScrollToggleProps {
  onConfigure?: () => void
}

/**
 * Quick Scroll Buttons toggle row for Popup UI.
 */
export const QuickScrollToggle: React.FC<QuickScrollToggleProps> = ({
  onConfigure
}) => {
  const [settings, setSettings] = useStorage<FeatureSettings>(
    STORAGE_KEYS.SETTINGS,
    DEFAULT_SETTINGS
  )

  const isEnabled = settings?.quickScroll ?? DEFAULT_SETTINGS.quickScroll

  const handleToggle = (enabled: boolean) => {
    setSettings((prev) => ({
      ...(prev ?? DEFAULT_SETTINGS),
      quickScroll: enabled
    }))
  }

  return (
    <ToggleSwitch
      icon={<Compass className="w-5 h-5 text-indigo-400" />}
      title={meta.title}
      description={meta.description}
      enabled={isEnabled}
      onChange={handleToggle}
      onConfigure={onConfigure}
    />
  )
}
