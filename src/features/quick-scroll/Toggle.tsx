import { Compass } from "lucide-react"
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

interface QuickScrollToggleProps {
  onConfigure?: () => void
}

/**
 * Quick Scroll Buttons toggle row for Popup UI.
 */
export const QuickScrollToggle: React.FC<QuickScrollToggleProps> = ({
  onConfigure
}) => {
  useI18n()
  const meta = getLocalizedFeatureMeta("quickScroll")
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
