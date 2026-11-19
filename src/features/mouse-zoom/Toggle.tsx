import { ZoomIn } from "lucide-react"
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

interface MouseZoomToggleProps {
  onConfigure?: () => void
}

/**
 * Mouse Pin-to-Zoom toggle row component for Popup UI.
 */
export const MouseZoomToggle: React.FC<MouseZoomToggleProps> = ({
  onConfigure
}) => {
  useI18n()
  const meta = getLocalizedFeatureMeta("mouseZoom")
  const [settings, setSettings] = useStorage<FeatureSettings>(
    STORAGE_KEYS.SETTINGS,
    DEFAULT_SETTINGS
  )

  const isEnabled = settings?.mouseZoom ?? DEFAULT_SETTINGS.mouseZoom
  const modifier = settings?.mouseZoomConfig?.modifier ?? "alt"
  const modifierLabel =
    modifier === "shift"
      ? "Shift"
      : modifier === "right-click"
        ? "Right Click"
        : modifier === "left-click"
          ? "Left Click"
          : "Alt"

  const handleChange = (enabled: boolean) => {
    setSettings((prev) => ({
      ...(prev ?? DEFAULT_SETTINGS),
      mouseZoom: enabled
    }))
  }

  return (
    <ToggleSwitch
      icon={<ZoomIn className="w-5 h-5 text-violet-400" />}
      title={meta.title}
      description={meta.description}
      enabled={isEnabled}
      onChange={handleChange}
      shortcut={`${modifierLabel} + Scroll`}
      onConfigure={onConfigure}
    />
  )
}
