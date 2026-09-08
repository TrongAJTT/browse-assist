import { Scroll } from "lucide-react"
import type React from "react"

import { useStorage } from "@plasmohq/storage/hook"

import { ToggleSwitch } from "~components/ToggleSwitch"
import {
  DEFAULT_SETTINGS,
  FEATURES_LIST,
  STORAGE_KEYS,
  type FeatureSettings
} from "~core/types"

const meta = FEATURES_LIST.find((f) => f.key === "smoothScroll")!

interface SmoothScrollToggleProps {
  onConfigure?: () => void
}

/**
 * Smooth Scroll toggle row component for Popup UI.
 */
export const SmoothScrollToggle: React.FC<SmoothScrollToggleProps> = ({
  onConfigure
}) => {
  const [settings, setSettings] = useStorage<FeatureSettings>(
    STORAGE_KEYS.SETTINGS,
    DEFAULT_SETTINGS
  )

  const isEnabled = settings?.smoothScroll ?? DEFAULT_SETTINGS.smoothScroll

  const handleChange = (enabled: boolean) => {
    setSettings((prev) => ({
      ...(prev ?? DEFAULT_SETTINGS),
      smoothScroll: enabled
    }))
  }

  return (
    <ToggleSwitch
      icon={<Scroll className="w-4 h-4 text-amber-400" />}
      title={meta.title}
      description={meta.description}
      enabled={isEnabled}
      onChange={handleChange}
      onConfigure={onConfigure}
    />
  )
}
