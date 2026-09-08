import {
  Compass,
  ExternalLink,
  Layers,
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
 * Configures background tab behavior, placement, and drag targets.
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
        [key]: !((prev?.superDragConfig ?? DEFAULT_SETTINGS.superDragConfig)[key])
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
        {/* Section 1: Tab Opening Behavior */}
        <div className="space-y-2">
          <span className="text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
            Tab Opening Behavior
          </span>

          <div className="divide-y divide-slate-800/80">
            {/* Open in Background Tab */}
            <div className="flex items-center justify-between gap-3 py-3 group">
              <div
                onClick={() => handleToggleOption("openInBackground")}
                className={`flex items-start gap-3 flex-1 min-w-0 cursor-pointer ${
                  currentConfig.openInBackground
                    ? "feature-row-active"
                    : "feature-row-dimmed"
                }`}>
                <div className="shrink-0 mt-0.5 flex items-center justify-center transition-transform duration-200 ease-out group-hover:scale-110">
                  <Layers className="w-5 h-5 text-indigo-400" />
                </div>
                <div className="flex flex-col min-w-0 flex-1">
                  <span className="text-xs font-semibold text-slate-200">
                    Open in Background Tab
                  </span>
                  <span className="text-[11px] text-slate-400 leading-snug mt-0.5">
                    Open new tabs silently in the background without stealing focus.
                  </span>
                </div>
              </div>

              <button
                type="button"
                role="switch"
                aria-checked={currentConfig.openInBackground}
                onClick={() => handleToggleOption("openInBackground")}
                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-900 ${
                  currentConfig.openInBackground
                    ? "bg-indigo-600 shadow-indigo-500/20 shadow-sm"
                    : "bg-slate-700"
                }`}>
                <span
                  className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                    currentConfig.openInBackground
                      ? "translate-x-4"
                      : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            {/* Open Next to Current Tab */}
            <div className="flex items-center justify-between gap-3 py-3 group">
              <div
                onClick={() => handleToggleOption("openNextToActive")}
                className={`flex items-start gap-3 flex-1 min-w-0 cursor-pointer ${
                  currentConfig.openNextToActive
                    ? "feature-row-active"
                    : "feature-row-dimmed"
                }`}>
                <div className="shrink-0 mt-0.5 flex items-center justify-center transition-transform duration-200 ease-out group-hover:scale-110">
                  <Compass className="w-5 h-5 text-cyan-400" />
                </div>
                <div className="flex flex-col min-w-0 flex-1">
                  <span className="text-xs font-semibold text-slate-200">
                    Open Next to Current Tab
                  </span>
                  <span className="text-[11px] text-slate-400 leading-snug mt-0.5">
                    Place newly opened tab immediately adjacent to current tab.
                  </span>
                </div>
              </div>

              <button
                type="button"
                role="switch"
                aria-checked={currentConfig.openNextToActive}
                onClick={() => handleToggleOption("openNextToActive")}
                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-900 ${
                  currentConfig.openNextToActive
                    ? "bg-indigo-600 shadow-indigo-500/20 shadow-sm"
                    : "bg-slate-700"
                }`}>
                <span
                  className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                    currentConfig.openNextToActive
                      ? "translate-x-4"
                      : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Section 2: Drag Targets */}
        <div className="space-y-2 pt-2 border-t border-slate-800/80">
          <span className="text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
            Drag Targets
          </span>

          <div className="divide-y divide-slate-800/80">
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
                  <span className="text-xs font-semibold text-slate-200">
                    Search Highlighted Text
                  </span>
                  <span className="text-[11px] text-slate-400 leading-snug mt-0.5">
                    Drag highlighted text to search using your default search engine.
                  </span>
                </div>
              </div>

              <button
                type="button"
                role="switch"
                aria-checked={currentConfig.searchSelectedText}
                onClick={() => handleToggleOption("searchSelectedText")}
                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-900 ${
                  currentConfig.searchSelectedText
                    ? "bg-indigo-600 shadow-indigo-500/20 shadow-sm"
                    : "bg-slate-700"
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
                  <span className="text-xs font-semibold text-slate-200">
                    Open Hyperlinks
                  </span>
                  <span className="text-[11px] text-slate-400 leading-snug mt-0.5">
                    Drag any hyperlink to immediately open the destination URL in a new tab.
                  </span>
                </div>
              </div>

              <button
                type="button"
                role="switch"
                aria-checked={currentConfig.openHyperlinks}
                onClick={() => handleToggleOption("openHyperlinks")}
                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-900 ${
                  currentConfig.openHyperlinks
                    ? "bg-indigo-600 shadow-indigo-500/20 shadow-sm"
                    : "bg-slate-700"
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
          </div>
        </div>
      </div>
    </SubSettingsLayout>
  )
}
