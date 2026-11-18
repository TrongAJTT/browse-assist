import { MousePointer2 } from "lucide-react"
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

interface SuperDragToggleProps {
  onConfigure?: () => void
}

/**
 * Super Drag toggle row for Popup UI.
 */
export const SuperDragToggle: React.FC<SuperDragToggleProps> = ({
  onConfigure
}) => {
  useI18n()
  const meta = getLocalizedFeatureMeta("superDrag")
  const [settings, setSettings] = useStorage<FeatureSettings>(
    STORAGE_KEYS.SETTINGS,
    DEFAULT_SETTINGS
  )

  const isEnabled = settings?.superDrag ?? DEFAULT_SETTINGS.superDrag

  const handleToggle = (enabled: boolean) => {
    setSettings((prev) => ({
      ...(prev ?? DEFAULT_SETTINGS),
      superDrag: enabled
    }))
  }

  return (
    <ToggleSwitch
      icon={<MousePointer2 className="w-5 h-5 text-pink-400" />}
      title={meta.title}
      description={meta.description}
      enabled={isEnabled}
      onChange={handleToggle}
      onConfigure={onConfigure}
    />
  )
}
