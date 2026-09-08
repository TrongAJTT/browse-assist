import { Pipette } from "lucide-react"
import type React from "react"
import { useEffect, useState } from "react"

import { useStorage } from "@plasmohq/storage/hook"

import { ToggleSwitch } from "~components/ToggleSwitch"
import {
  DEFAULT_SETTINGS,
  FEATURES_LIST,
  STORAGE_KEYS,
  type FeatureSettings
} from "~core/types"

const meta = FEATURES_LIST.find((f) => f.key === "colorPicker")!

interface ColorPickerToggleProps {
  onConfigure?: () => void
}

/**
 * Toggle component for ColorPick Eyedropper on Popup main view.
 */
export const ColorPickerToggle: React.FC<ColorPickerToggleProps> = ({
  onConfigure
}) => {
  const [settings, setSettings] = useStorage<FeatureSettings>(
    STORAGE_KEYS.SETTINGS,
    DEFAULT_SETTINGS
  )
  const [shortcut, setShortcut] = useState<string>("Alt + Shift + C")

  useEffect(() => {
    if (chrome.commands?.getAll) {
      chrome.commands.getAll((commands) => {
        const cmd = commands.find((c) => c.name === "toggle_color_picker")
        if (cmd?.shortcut) {
          setShortcut(cmd.shortcut)
        } else {
          setShortcut("")
        }
      })
    }
  }, [])

  const isEnabled = settings?.colorPicker ?? DEFAULT_SETTINGS.colorPicker

  const handleToggle = (enabled: boolean) => {
    setSettings((prev) => ({
      ...(prev ?? DEFAULT_SETTINGS),
      colorPicker: enabled
    }))
  }

  return (
    <ToggleSwitch
      icon={<Pipette className="w-5 h-5 text-pink-400" />}
      title={meta.title}
      description={meta.description}
      enabled={isEnabled}
      onChange={handleToggle}
      shortcut={shortcut}
      onConfigure={onConfigure}
    />
  )
}
