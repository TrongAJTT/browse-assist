import { ArrowUpToLine, Compass, Eye, History } from "lucide-react"
import type React from "react"

import { useStorage } from "@plasmohq/storage/hook"

import { EdgePositionPicker } from "~components/EdgePositionPicker"
import { SegmentedTabs, type SegmentedTabItem } from "~components/SegmentedTabs"
import { SettingToggleRow } from "~components/SettingToggleRow"
import { SubSettingsLayout } from "~components/SubSettingsLayout"
import {
  DEFAULT_QUICK_SCROLL_CONFIG,
  DEFAULT_SETTINGS,
  normalizeEdgePlacement,
  STORAGE_KEYS,
  type EdgePlacement,
  type FeatureSettings,
  type QuickScrollButtonsMode,
  type QuickScrollConfig
} from "~core/types"

interface QuickScrollSettingsViewProps {
  onBack: () => void
}

const BUTTON_ITEMS: SegmentedTabItem<QuickScrollButtonsMode>[] = [
  {
    id: "both",
    label: "Top & Bottom",
    icon: <Compass className="w-3.5 h-3.5" />
  },
  {
    id: "top-only",
    label: "Top Only",
    icon: <ArrowUpToLine className="w-3.5 h-3.5" />
  }
]

/**
 * Sub-settings view for Quick Scroll Buttons.
 * Designed with a flat, modern layout without card/container wrappers.
 */
export const QuickScrollSettingsView: React.FC<
  QuickScrollSettingsViewProps
> = ({ onBack }) => {
  const [settings, setSettings] = useStorage<FeatureSettings>(
    STORAGE_KEYS.SETTINGS,
    DEFAULT_SETTINGS
  )

  const isMasterEnabled = settings?.quickScroll ?? DEFAULT_SETTINGS.quickScroll
  const currentConfig: QuickScrollConfig =
    settings?.quickScrollConfig ?? DEFAULT_SETTINGS.quickScrollConfig

  const handleToggleMaster = (enabled: boolean) => {
    setSettings((prev) => ({
      ...(prev ?? DEFAULT_SETTINGS),
      quickScroll: enabled
    }))
  }

  const currentPlacement = normalizeEdgePlacement(
    currentConfig.placement ?? currentConfig.position,
    DEFAULT_QUICK_SCROLL_CONFIG.placement
  )

  const handleSelectPlacement = (placement: EdgePlacement) => {
    setSettings((prev) => ({
      ...(prev ?? DEFAULT_SETTINGS),
      quickScrollConfig: {
        ...(prev?.quickScrollConfig ?? DEFAULT_SETTINGS.quickScrollConfig),
        placement
      }
    }))
  }

  const handleSelectButtonsMode = (buttonsMode: QuickScrollButtonsMode) => {
    setSettings((prev) => ({
      ...(prev ?? DEFAULT_SETTINGS),
      quickScrollConfig: {
        ...(prev?.quickScrollConfig ?? DEFAULT_SETTINGS.quickScrollConfig),
        buttonsMode
      }
    }))
  }

  const handleToggleOption = (
    key: keyof Pick<QuickScrollConfig, "autoHide" | "enableReturnMemory">
  ) => {
    setSettings((prev) => ({
      ...(prev ?? DEFAULT_SETTINGS),
      quickScrollConfig: {
        ...(prev?.quickScrollConfig ?? DEFAULT_SETTINGS.quickScrollConfig),
        [key]: !currentConfig[key]
      }
    }))
  }

  return (
    <SubSettingsLayout
      title="Quick Scroll Buttons"
      enabled={isMasterEnabled}
      onToggle={handleToggleMaster}
      onBack={onBack}>
      <div className="space-y-4">
        {/* Section 1: Screen Position (Edge Position Picker with Snapping) */}
        <div className="space-y-2">
          <span className="section-header">Screen Position</span>
          <div className="space-y-1.5">
            <span className="text-xs font-semibold text-content-primary">
              Button Placement
            </span>
            <p className="text-[11px] text-content-muted leading-snug">
              Drag or click along the left or right perimeter to anchor the
              floating scroll buttons.
            </p>
            <EdgePositionPicker
              allowedEdges={["left", "right"]}
              value={currentPlacement}
              onChange={handleSelectPlacement}
            />
          </div>
        </div>

        {/* Section 2: Visible Buttons (Flat Layout) */}
        <div className="space-y-2 pt-3 border-t border-border-divider">
          <span className="section-header">Visible Controls</span>
          <div className="space-y-1.5">
            <span className="text-xs font-semibold text-content-primary">
              Button Selection
            </span>
            <p className="text-[11px] text-content-muted leading-snug">
              Choose whether to display both top & bottom buttons or only scroll
              to top.
            </p>
            <SegmentedTabs<QuickScrollButtonsMode>
              items={BUTTON_ITEMS}
              value={currentConfig.buttonsMode}
              onChange={handleSelectButtonsMode}
            />
          </div>
        </div>

        {/* Section 3: Smart Behavior Toggles */}
        <div className="space-y-1 pt-3 border-t border-border-divider">
          <span className="section-header">Behavior & Intelligence</span>

          <div className="divide-y divide-border-divider">
            {/* Auto-Dim on Idle */}
            <SettingToggleRow
              icon={<Eye className="w-5 h-5 text-cyan-400" />}
              title="Auto-Dim on Idle"
              description="Fade buttons to subtle opacity when you pause scrolling; restore instantly on hover."
              enabled={currentConfig.autoHide}
              onToggle={() => handleToggleOption("autoHide")}
            />

            {/* Scroll Memory Return */}
            <SettingToggleRow
              icon={<History className="w-5 h-5 text-amber-400" />}
              title="Scroll Position Memory"
              description="Save your exact reading spot upon jumping away, allowing 1-click return to where you were."
              enabled={currentConfig.enableReturnMemory}
              onToggle={() => handleToggleOption("enableReturnMemory")}
            />
          </div>
        </div>
      </div>
    </SubSettingsLayout>
  )
}
