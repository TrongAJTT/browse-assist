import { Zap } from "lucide-react"
import type React from "react"
import { useEffect, useState } from "react"

import { useStorage } from "@plasmohq/storage/hook"

import { ToggleSwitch } from "~components/ToggleSwitch"
import { FEATURE_CATALOG } from "~core/featureCatalog"
import {
  DEFAULT_SETTINGS,
  STORAGE_KEYS,
  type FeatureSettings
} from "~core/types"

const meta = FEATURE_CATALOG.elementZapper

interface ElementZapperToggleProps {
  onConfigure?: () => void
}

/**
 * Toggle component for Element Zapper on Popup main view.
 */
export const ElementZapperToggle: React.FC<ElementZapperToggleProps> = ({
  onConfigure
}) => {
  const [settings, setSettings] = useStorage<FeatureSettings>(
    STORAGE_KEYS.SETTINGS,
    DEFAULT_SETTINGS
  )
  const [shortcut, setShortcut] = useState<string>("Alt + Shift + Z")

  useEffect(() => {
    if (chrome.commands?.getAll) {
      chrome.commands.getAll((commands) => {
        const cmd = commands.find((c) => c.name === "toggle_element_zapper")
        if (cmd?.shortcut) {
          setShortcut(cmd.shortcut)
        } else {
          setShortcut("")
        }
      })
    }
  }, [])

  const isEnabled = settings?.elementZapper ?? DEFAULT_SETTINGS.elementZapper

  const handleToggle = (enabled: boolean) => {
    setSettings((prev) => ({
      ...(prev ?? DEFAULT_SETTINGS),
      elementZapper: enabled
    }))
  }

  return (
    <ToggleSwitch
      icon={<Zap className="w-5 h-5 text-amber-400" />}
      title={meta.title}
      description={meta.description}
      enabled={isEnabled}
      onChange={handleToggle}
      shortcut={shortcut}
      onConfigure={onConfigure}
    />
  )
}
