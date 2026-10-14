import {
  ArrowDownLeft,
  ArrowDownRight,
  ArrowUpLeft,
  ArrowUpRight,
  Eye,
  Sparkles
} from "lucide-react"
import type React from "react"
import { useEffect, useState } from "react"

import { useStorage } from "@plasmohq/storage/hook"

import { FeatureShortcutRow } from "~components/FeatureShortcutRow"
import { GridPicker, type GridPickerItem } from "~components/GridPicker"
import { SettingToggleRow } from "~components/SettingToggleRow"
import { SubSettingsLayout } from "~components/SubSettingsLayout"
import { openBrowserShortcutsPage } from "~core/shortcutsHelper"
import {
  DEFAULT_SETTINGS,
  STORAGE_KEYS,
  type FeatureSettings,
  type QuickHubConfig,
  type QuickHubCorner
} from "~core/types"

interface QuickHubSettingsViewProps {
  onBack: () => void
}

const CORNER_ITEMS: GridPickerItem<QuickHubCorner>[] = [
  {
    id: "top-right",
    label: "Top Right",
    icon: <ArrowUpRight className="w-3.5 h-3.5" />
  },
  {
    id: "top-left",
    label: "Top Left",
    icon: <ArrowUpLeft className="w-3.5 h-3.5" />
  },
  {
    id: "bottom-right",
    label: "Bottom Right",
    icon: <ArrowDownRight className="w-3.5 h-3.5" />
  },
  {
    id: "bottom-left",
    label: "Bottom Left",
    icon: <ArrowDownLeft className="w-3.5 h-3.5" />
  }
]

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

  const handleSelectCorner = (corner: QuickHubCorner) => {
    setSettings((prev) => ({
      ...(prev ?? DEFAULT_SETTINGS),
      quickHubConfig: {
        ...(prev?.quickHubConfig ?? DEFAULT_SETTINGS.quickHubConfig),
        corner
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
        {/* Section 1: Screen Position Placement */}
        <div className="space-y-2">
          <span className="section-header">Screen Position</span>
          <div className="space-y-1.5">
            <span className="text-xs font-semibold text-content-primary">
              Floating Button Placement
            </span>
            <p className="text-[11px] text-content-muted leading-snug">
              Choose which corner of the browser viewport to anchor the floating
              Quick Hub trigger.
            </p>
            <GridPicker<QuickHubCorner>
              items={CORNER_ITEMS}
              value={currentConfig.corner}
              onChange={handleSelectCorner}
              columns={4}
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

        {/* Info card */}
        <div className="card-subtle p-3 text-[11px] text-content-muted space-y-1">
          <div className="flex items-center gap-1.5 font-semibold text-content-secondary">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Direct In-Page Execution</span>
          </div>
          <p className="leading-relaxed">
            Quick Hub activates directly within the webpage DOM, ensuring 100%
            reliable Picture-in-Picture and Color Picker activation without
            losing browser user gesture tokens.
          </p>
        </div>
      </div>
    </SubSettingsLayout>
  )
}
