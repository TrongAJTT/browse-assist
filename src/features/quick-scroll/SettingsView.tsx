import {
  ArrowUpToLine,
  Compass,
  Eye,
  History,
  LayoutTemplate,
  Shield
} from "lucide-react"
import type React from "react"

import { useStorage } from "@plasmohq/storage/hook"

import { GridPicker, type GridPickerItem } from "~components/GridPicker"
import { SubSettingsLayout } from "~components/SubSettingsLayout"
import {
  DEFAULT_SETTINGS,
  STORAGE_KEYS,
  type FeatureSettings,
  type QuickScrollButtonsMode,
  type QuickScrollConfig,
  type QuickScrollPosition
} from "~core/types"

interface QuickScrollSettingsViewProps {
  onBack: () => void
}

const POSITION_ITEMS: GridPickerItem<QuickScrollPosition>[] = [
  {
    id: "top-left",
    label: "Top Left",
    icon: <LayoutTemplate className="w-3.5 h-3.5" />
  },
  {
    id: "center-left",
    label: "Center Left",
    icon: <LayoutTemplate className="w-3.5 h-3.5" />
  },
  {
    id: "bottom-left",
    label: "Bottom Left",
    icon: <LayoutTemplate className="w-3.5 h-3.5" />
  },
  {
    id: "top-right",
    label: "Top Right",
    icon: <LayoutTemplate className="w-3.5 h-3.5" />
  },
  {
    id: "center-right",
    label: "Center Right",
    icon: <LayoutTemplate className="w-3.5 h-3.5" />
  },
  {
    id: "bottom-right",
    label: "Bottom Right",
    icon: <LayoutTemplate className="w-3.5 h-3.5" />
  }
]

const BUTTON_ITEMS: GridPickerItem<QuickScrollButtonsMode>[] = [
  {
    id: "both",
    label: "Both (Top & Down)",
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

  const handleSelectPosition = (position: QuickScrollPosition) => {
    setSettings((prev) => ({
      ...(prev ?? DEFAULT_SETTINGS),
      quickScrollConfig: {
        ...(prev?.quickScrollConfig ?? DEFAULT_SETTINGS.quickScrollConfig),
        position
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
    key: keyof Pick<QuickScrollConfig, "autoHide" | "enableReturnMemory" | "safeEdgeZones">
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
        {/* Section 1: Screen Position (Flat Layout, No Card Wrapper) */}
        <div className="space-y-2">
          <span className="section-header">Screen Position</span>
          <div className="space-y-1.5">
            <span className="text-xs font-semibold text-content-primary">
              Button Placement
            </span>
            <p className="text-[11px] text-content-muted leading-snug">
              Choose where floating scroll buttons anchor on your browser
              screen.
            </p>
            <GridPicker<QuickScrollPosition>
              items={POSITION_ITEMS}
              value={currentConfig.position}
              onChange={handleSelectPosition}
              columns={3}
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
            <GridPicker<QuickScrollButtonsMode>
              items={BUTTON_ITEMS}
              value={currentConfig.buttonsMode}
              onChange={handleSelectButtonsMode}
              columns={2}
            />
          </div>
        </div>

        {/* Section 3: Smart Behavior Toggles */}
        <div className="space-y-3 pt-3 border-t border-border-divider">
          <span className="section-header">Behavior & Intelligence</span>

          {/* Safe Edge Zones */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex flex-col min-w-0 flex-1">
              <span className="text-xs font-semibold text-content-primary flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-emerald-400" />
                Safe Edge Zones
              </span>
              <span className="text-[11px] text-content-muted leading-snug mt-0.5">
                Hide buttons entirely near the very top or bottom of the page. Buttons only reveal when scrolling through the middle.
              </span>
            </div>

            <button
              type="button"
              role="switch"
              aria-checked={currentConfig.safeEdgeZones}
              onClick={() => handleToggleOption("safeEdgeZones")}
              className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-app ${
                currentConfig.safeEdgeZones
                  ? "bg-accent shadow-accent-glow"
                  : "bg-border-subtle"
              }`}>
              <span
                className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                  currentConfig.safeEdgeZones
                    ? "translate-x-4"
                    : "translate-x-0"
                }`}
              />
            </button>
          </div>

          {/* Auto-Dim on Idle */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex flex-col min-w-0 flex-1">
              <span className="text-xs font-semibold text-content-primary flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5 text-cyan-400" />
                Auto-Dim on Idle
              </span>
              <span className="text-[11px] text-content-muted leading-snug mt-0.5">
                Fade buttons to subtle opacity when you pause scrolling; restore
                instantly on hover.
              </span>
            </div>

            <button
              type="button"
              role="switch"
              aria-checked={currentConfig.autoHide}
              onClick={() => handleToggleOption("autoHide")}
              className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-app ${
                currentConfig.autoHide
                  ? "bg-accent shadow-accent-glow"
                  : "bg-border-subtle"
              }`}>
              <span
                className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                  currentConfig.autoHide ? "translate-x-4" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          {/* Scroll Memory Return */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex flex-col min-w-0 flex-1">
              <span className="text-xs font-semibold text-content-primary flex items-center gap-1.5">
                <History className="w-3.5 h-3.5 text-amber-400" />
                Scroll Position Memory
              </span>
              <span className="text-[11px] text-content-muted leading-snug mt-0.5">
                After jumping to the top or bottom, click the return button within 6
                seconds to return to where you were reading.
              </span>
            </div>

            <button
              type="button"
              role="switch"
              aria-checked={currentConfig.enableReturnMemory}
              onClick={() => handleToggleOption("enableReturnMemory")}
              className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-app ${
                currentConfig.enableReturnMemory
                  ? "bg-accent shadow-accent-glow"
                  : "bg-border-subtle"
              }`}>
              <span
                className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                  currentConfig.enableReturnMemory
                    ? "translate-x-4"
                    : "translate-x-0"
                }`}
              />
            </button>
          </div>
        </div>
      </div>
    </SubSettingsLayout>
  )
}
