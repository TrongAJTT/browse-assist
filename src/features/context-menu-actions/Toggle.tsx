import { Link2 } from "lucide-react"
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

interface ContextMenuActionsToggleProps {
  onConfigure?: () => void
}

/**
 * Context Menu Actions toggle row for Popup UI.
 */
export const ContextMenuActionsToggle: React.FC<ContextMenuActionsToggleProps> = ({
  onConfigure
}) => {
  const { t } = useI18n()
  const meta = getLocalizedFeatureMeta("contextMenuActions")
  const [settings, setSettings] = useStorage<FeatureSettings>(
    STORAGE_KEYS.SETTINGS,
    DEFAULT_SETTINGS
  )

  const isEnabled =
    settings?.contextMenuActions ?? DEFAULT_SETTINGS.contextMenuActions

  const handleToggle = (enabled: boolean) => {
    setSettings((prev) => ({
      ...(prev ?? DEFAULT_SETTINGS),
      contextMenuActions: enabled
    }))
  }

  // Count active sub-actions for badge
  const config =
    settings?.contextMenuActionsConfig ?? DEFAULT_SETTINGS.contextMenuActionsConfig
  const activeCount = [
    config.copyLinkText,
    config.cleanLinkCopy,
    config.markdownLinkCopy,
    config.copyCleanPageUrl ?? true,
    config.copyPageMarkdown ?? false,
    config.copySelectionQuote ?? true
  ].filter(Boolean).length

  const badgeText = t("features.contextMenuActions.activeCount", {
    count: activeCount
  })

  return (
    <ToggleSwitch
      icon={<Link2 className="w-5 h-5 text-cyan-400" />}
      title={meta.title}
      description={meta.description}
      enabled={isEnabled}
      onChange={handleToggle}
      badge={badgeText}
      onConfigure={onConfigure}
    />
  )
}
