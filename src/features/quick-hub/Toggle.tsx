import { Sparkles } from "lucide-react"
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

const meta = FEATURE_CATALOG.quickHub

interface QuickHubToggleProps {
  onConfigure?: () => void
}

/**
 * Toggle component for Quick Hub on Popup main view.
 */
export const QuickHubToggle: React.FC<QuickHubToggleProps> = ({
  onConfigure
}) => {
  const [settings, setSettings] = useStorage<FeatureSettings>(
    STORAGE_KEYS.SETTINGS,
    DEFAULT_SETTINGS
  )
  const [shortcut, setShortcut] = useState<string>("")

  useEffect(() => {
    if (chrome.commands?.getAll) {
      chrome.commands.getAll((commands) => {
        const cmd = commands.find((c) => c.name === "toggle_quick_hub")
        if (cmd?.shortcut) {
          setShortcut(cmd.shortcut)
        } else {
          setShortcut("")
        }
      })
    }
  }, [])

  const isEnabled = settings?.quickHub ?? DEFAULT_SETTINGS.quickHub

  const handleToggle = (enabled: boolean) => {
    setSettings((prev) => ({
      ...(prev ?? DEFAULT_SETTINGS),
      quickHub: enabled
    }))
  }

  return (
    <ToggleSwitch
      icon={<Sparkles className="w-5 h-5 text-amber-400" />}
      title={meta.title}
      description={meta.description}
      enabled={isEnabled}
      onChange={handleToggle}
      shortcut={shortcut}
      onConfigure={onConfigure}
    />
  )
}
