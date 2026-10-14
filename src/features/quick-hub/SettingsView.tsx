import { Eye, Sparkles } from "lucide-react"
import type React from "react"
import { useEffect, useState } from "react"

import { useStorage } from "@plasmohq/storage/hook"

import { EdgePositionPicker } from "~components/EdgePositionPicker"
import { FeatureShortcutRow } from "~components/FeatureShortcutRow"
import { SettingToggleRow } from "~components/SettingToggleRow"
import { SubSettingsLayout } from "~components/SubSettingsLayout"
import { openBrowserShortcutsPage } from "~core/shortcutsHelper"
import {
  DEFAULT_QUICK_HUB_CONFIG,
  DEFAULT_SETTINGS,
  normalizeEdgePlacement,
  STORAGE_KEYS,
  type EdgePlacement,
  type FeatureSettings,
  type QuickHubConfig
} from "~core/types"

interface QuickHubSettingsViewProps {
  onBack: () => void
}

/**
 * Sub-settings view for Quick Hub.
 */
export const QuickHubSettingsView: React.FC<QuickHubSettingsViewProps> = ({
  onBack
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
          setShortcut("Not configured")
        }
      })
    }
  }, [])

  const isMasterEnabled = settings?.quickHub ?? DEFAULT_SETTINGS.quickHub
  const currentConfig: QuickHubConfig =
    settings?.quickHubConfig ?? DEFAULT_SETTINGS.quickHubConfig

  const handleToggleMaster = (enabled: boolean) => {
    setSettings((prev) => ({
      ...(prev ?? DEFAULT_SETTINGS),
      quickHub: enabled
    }))
  }

  const currentPlacement = normalizeEdgePlacement(
    currentConfig.placement ?? currentConfig.corner,
    DEFAULT_QUICK_HUB_CONFIG.placement
  )

  const handlePlacementChange = (placement: EdgePlacement) => {
    setSettings((prev) => ({
      ...(prev ?? DEFAULT_SETTINGS),
      quickHubConfig: {
        ...(prev?.quickHubConfig ?? DEFAULT_SETTINGS.quickHubConfig),
        placement
      }
    }))
  }

  const handleToggleOption = (key: keyof QuickHubConfig) => {
    setSettings((prev) => ({
      ...(prev ?? DEFAULT_SETTINGS),
      quickHubConfig: {
        ...(prev?.quickHubConfig ?? DEFAULT_SETTINGS.quickHubConfig),
        [key]: !currentConfig[key]
      }
    }))
  }

  const handleOpenShortcutsPage = () => {
    openBrowserShortcutsPage().catch(() => {})
  }

  return (
    <SubSettingsLayout
      title="Quick Hub"
      enabled={isMasterEnabled}
      onToggle={handleToggleMaster}
      onBack={onBack}>
      <div className="space-y-4">
        {/* Section 1: Screen Position Placement (Edge Position Picker with Snapping) */}
        <div className="space-y-2">
          <span className="section-header">Screen Position</span>
          <div className="space-y-1.5">
            <span className="text-xs font-semibold text-content-primary">
              Floating Button Placement
            </span>
            <p className="text-[11px] text-content-muted leading-snug">
              Drag or click along the perimeter to anchor the Quick Hub trigger
              anywhere on screen.
            </p>
            <EdgePositionPicker
              allowedEdges={["top", "right", "bottom", "left"]}
              value={currentPlacement}
              onChange={handlePlacementChange}
            />
          </div>
        </div>

        {/* Section 2: Proximity & Behavior */}
        <div className="space-y-2 pt-3 border-t border-border-divider">
          <span className="section-header">Behavior & Proximity</span>
          <div className="divide-y divide-border-divider">
            <SettingToggleRow
              icon={<Eye className="w-5 h-5 text-amber-400" />}
              title="Hover Proximity Reveal"
              description="Reveal the floating button only when moving cursor near the corner. When disabled, the button stays visible at 30% idle opacity."
              enabled={currentConfig.hoverToReveal}
              onToggle={() => handleToggleOption("hoverToReveal")}
            />
          </div>
        </div>

        {/* Section 3: Keyboard Shortcut (Secondary Method) */}
        <div className="space-y-2 pt-3 border-t border-border-divider">
          <span className="section-header">Keyboard Shortcut</span>
          <FeatureShortcutRow
            title="Global Hotkey (Optional)"
            description="Toggle the Quick Hub menu on active webpage."
            shortcut={shortcut}
            iconColorClass="text-amber-400"
            onConfigureShortcuts={handleOpenShortcutsPage}
          />
        </div>
      </div>
    </SubSettingsLayout>
  )
}
