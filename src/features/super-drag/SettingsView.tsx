import {
  ExternalLink,
  Eye,
  ImageIcon,
  Search
} from "lucide-react"
import type React from "react"

import { useStorage } from "@plasmohq/storage/hook"

import { SubSettingsLayout } from "~components/SubSettingsLayout"
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
            <div className="flex items-center justify-between gap-3 py-3 group">
              <div
                onClick={() => handleToggleOption("searchSelectedText")}
                className={`flex items-start gap-3 flex-1 min-w-0 cursor-pointer ${
                  currentConfig.searchSelectedText
                    ? "feature-row-active"
                    : "feature-row-dimmed"
                }`}>
                <div className="shrink-0 mt-0.5 flex items-center justify-center transition-transform duration-200 ease-out group-hover:scale-110">
                  <Search className="w-5 h-5 text-amber-400" />
                </div>
                <div className="flex flex-col min-w-0 flex-1">
                  <span className="text-xs font-semibold text-content-primary">
                    Search Highlighted Text
                  </span>
                  <span className="text-[11px] text-content-muted leading-snug mt-0.5">
                    Drag highlighted text to search using your default search engine.
                  </span>
                </div>
              </div>

              <button
                type="button"
                role="switch"
                aria-checked={currentConfig.searchSelectedText}
                onClick={() => handleToggleOption("searchSelectedText")}
                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-app ${
                  currentConfig.searchSelectedText
                    ? "bg-accent shadow-accent-glow"
                    : "bg-border-subtle"
                }`}>
                <span
                  className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                    currentConfig.searchSelectedText
                      ? "translate-x-4"
                      : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            {/* Open Hyperlinks */}
            <div className="flex items-center justify-between gap-3 py-3 group">
              <div
                onClick={() => handleToggleOption("openHyperlinks")}
                className={`flex items-start gap-3 flex-1 min-w-0 cursor-pointer ${
                  currentConfig.openHyperlinks
                    ? "feature-row-active"
                    : "feature-row-dimmed"
                }`}>
                <div className="shrink-0 mt-0.5 flex items-center justify-center transition-transform duration-200 ease-out group-hover:scale-110">
                  <ExternalLink className="w-5 h-5 text-emerald-400" />
                </div>
                <div className="flex flex-col min-w-0 flex-1">
                  <span className="text-xs font-semibold text-content-primary">
                    Open Hyperlinks
                  </span>
                  <span className="text-[11px] text-content-muted leading-snug mt-0.5">
                    Drag any hyperlink to immediately open the destination URL in a new tab.
                  </span>
                </div>
              </div>

              <button
                type="button"
                role="switch"
                aria-checked={currentConfig.openHyperlinks}
                onClick={() => handleToggleOption("openHyperlinks")}
                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-app ${
                  currentConfig.openHyperlinks
                    ? "bg-accent shadow-accent-glow"
                    : "bg-border-subtle"
                }`}>
                <span
                  className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                    currentConfig.openHyperlinks
                      ? "translate-x-4"
                      : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            {/* Drag Images */}
            <div className="flex items-center justify-between gap-3 py-3 group">
              <div
                onClick={() => handleToggleOption("openImages")}
                className={`flex items-start gap-3 flex-1 min-w-0 cursor-pointer ${
                  currentConfig.openImages
                    ? "feature-row-active"
                    : "feature-row-dimmed"
                }`}>
                <div className="shrink-0 mt-0.5 flex items-center justify-center transition-transform duration-200 ease-out group-hover:scale-110">
                  <ImageIcon className="w-5 h-5 text-amber-400" />
                </div>
                <div className="flex flex-col min-w-0 flex-1">
                  <span className="text-xs font-semibold text-content-primary">
                    Drag Images
                  </span>
                  <span className="text-[11px] text-content-muted leading-snug mt-0.5">
                    Drag any image to view in a new tab or copy its direct image link.
                  </span>
                </div>
              </div>

              <button
                type="button"
                role="switch"
                aria-checked={currentConfig.openImages}
                onClick={() => handleToggleOption("openImages")}
                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-app ${
                  currentConfig.openImages
                    ? "bg-accent shadow-accent-glow"
                    : "bg-border-subtle"
                }`}>
                <span
                  className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                    currentConfig.openImages
                      ? "translate-x-4"
                      : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            {/* Show Drag Indicator */}
            <div className="flex items-center justify-between gap-3 py-3 group">
              <div
                onClick={() => handleToggleOption("showIndicator")}
                className={`flex items-start gap-3 flex-1 min-w-0 cursor-pointer ${
                  currentConfig.showIndicator
                    ? "feature-row-active"
                    : "feature-row-dimmed"
                }`}>
                <div className="shrink-0 mt-0.5 flex items-center justify-center transition-transform duration-200 ease-out group-hover:scale-110">
                  <Eye className="w-5 h-5 text-violet-400" />
                </div>
                <div className="flex flex-col min-w-0 flex-1">
                  <span className="text-xs font-semibold text-content-primary">
                    Show Drag Indicator
                  </span>
                  <span className="text-[11px] text-content-muted leading-snug mt-0.5">
                    Display floating badge previewing the action when dragged into valid range.
                  </span>
                </div>
              </div>

              <button
                type="button"
                role="switch"
                aria-checked={currentConfig.showIndicator}
                onClick={() => handleToggleOption("showIndicator")}
                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-app ${
                  currentConfig.showIndicator
                    ? "bg-accent shadow-accent-glow"
                    : "bg-border-subtle"
                }`}>
                <span
                  className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                    currentConfig.showIndicator
                      ? "translate-x-4"
                      : "translate-x-0"
                  }`}
                />
              </button>
            </div>
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
