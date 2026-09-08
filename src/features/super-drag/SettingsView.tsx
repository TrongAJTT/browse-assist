import {
  ExternalLink,
  Eye,
  ImageIcon,
  Search
} from "lucide-react"
import type React from "react"

import { useStorage } from "@plasmohq/storage/hook"

import { SubSettingsLayout } from "~components/SubSettingsLayout"
import { SettingToggleRow } from "~components/SettingToggleRow"
import {
  DEFAULT_SETTINGS,
  STORAGE_KEYS,
  type FeatureSettings,
  type SuperDragConfig
} from "~core/types"

interface SuperDragSettingsViewProps {
  onBack: () => void
}

/**
 * Sub-settings view for Super Drag.
 * Configures drag targets and indicator visibility.
 */
export const SuperDragSettingsView: React.FC<SuperDragSettingsViewProps> = ({
  onBack
}) => {
  const [settings, setSettings] = useStorage<FeatureSettings>(
    STORAGE_KEYS.SETTINGS,
    DEFAULT_SETTINGS
  )

  const isMasterEnabled = settings?.superDrag ?? DEFAULT_SETTINGS.superDrag
  const currentConfig: SuperDragConfig =
    settings?.superDragConfig ?? DEFAULT_SETTINGS.superDragConfig

  const handleToggleMaster = (enabled: boolean) => {
    setSettings((prev) => ({
      ...(prev ?? DEFAULT_SETTINGS),
      superDrag: enabled
    }))
  }

  const handleToggleOption = (key: keyof SuperDragConfig) => {
    setSettings((prev) => ({
      ...(prev ?? DEFAULT_SETTINGS),
      superDragConfig: {
        ...(prev?.superDragConfig ?? DEFAULT_SETTINGS.superDragConfig),
        [key]: !currentConfig[key]
      }
    }))
  }

  return (
    <SubSettingsLayout
      title="Super Drag"
      enabled={isMasterEnabled}
      onToggle={handleToggleMaster}
      onBack={onBack}>
      <div className="space-y-4">
        {/* Drag Targets */}
        <div className="space-y-2">
          <span className="section-header">
            Drag Targets
          </span>

          <div className="divide-y divide-border-divider">
            {/* Search Selected Text */}
            <SettingToggleRow
              icon={<Search className="w-5 h-5 text-amber-400" />}
              title="Search Highlighted Text"
              description="Drag highlighted text to search using your default search engine."
              enabled={currentConfig.searchSelectedText}
              onToggle={() => handleToggleOption("searchSelectedText")}
            />

            {/* Open Hyperlinks */}
            <SettingToggleRow
              icon={<ExternalLink className="w-5 h-5 text-emerald-400" />}
              title="Open Hyperlinks"
              description="Drag any hyperlink to immediately open the destination URL in a new tab."
              enabled={currentConfig.openHyperlinks}
              onToggle={() => handleToggleOption("openHyperlinks")}
            />

            {/* Drag Images */}
            <SettingToggleRow
              icon={<ImageIcon className="w-5 h-5 text-amber-400" />}
              title="Drag Images"
              description="Drag any image to view in a new tab or copy its direct image link."
              enabled={currentConfig.openImages}
              onToggle={() => handleToggleOption("openImages")}
            />

            {/* Show Drag Indicator */}
            <SettingToggleRow
              icon={<Eye className="w-5 h-5 text-violet-400" />}
              title="Show Drag Indicator"
              description="Display floating badge previewing the action when dragged into valid range."
              enabled={currentConfig.showIndicator}
              onToggle={() => handleToggleOption("showIndicator")}
            />
          </div>
        </div>

        {/* Section 3: Gesture Cheat Sheet */}
        <div className="space-y-2 pt-2 border-t border-border-divider">
          <span className="section-header">
            Gesture Directions Guide
          </span>

          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div className="card-subtle p-2.5 flex flex-col items-center">
              <span className="font-mono text-[11px] text-accent font-semibold">
                ↗ Up / Right
              </span>
              <span className="text-[11px] text-content-secondary mt-1 font-medium">
                Background Tab
              </span>
              <span className="text-[10px] text-content-muted">
                Search, Link, or Image
              </span>
            </div>

            <div className="card-subtle p-2.5 flex flex-col items-center">
              <span className="font-mono text-[11px] text-cyan-400 font-semibold">
                ← Left
              </span>
              <span className="text-[11px] text-content-secondary mt-1 font-medium">
                Active Tab
              </span>
              <span className="text-[10px] text-content-muted">
                Switch to new tab
              </span>
            </div>

            <div className="card-subtle p-2.5 flex flex-col items-center">
              <span className="font-mono text-[11px] text-emerald-400 font-semibold">
                ↓ Down
              </span>
              <span className="text-[11px] text-content-secondary mt-1 font-medium">
                Copy to Clipboard
              </span>
              <span className="text-[10px] text-content-muted">
                Text, Link, or Image URL
              </span>
            </div>
          </div>
        </div>
      </div>
    </SubSettingsLayout>
  )
}
