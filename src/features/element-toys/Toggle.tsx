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

const meta = FEATURE_CATALOG.elementToys

export interface ElementToysToggleProps {
  onConfigure?: () => void
}

export type ElementZapperToggleProps = ElementToysToggleProps

/**
 * Toggle component for Element Toys on Popup main view.
 */
export const ElementToysToggle: React.FC<ElementToysToggleProps> = ({
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
        const cmd = commands.find(
          (c) => c.name === "toggle_element_toys" || c.name === "toggle_element_zapper"
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
    settings?.elementToys ?? settings?.elementZapper ?? DEFAULT_SETTINGS.elementToys

  const handleToggle = (enabled: boolean) => {
    setSettings((prev) => ({
      ...(prev ?? DEFAULT_SETTINGS),
      elementToys: enabled,
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

export const ElementZapperToggle = ElementToysToggle

