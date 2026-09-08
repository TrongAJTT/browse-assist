import {
  Check,
  FileCode,
  Sparkles,
  Type
} from "lucide-react"
import type React from "react"

import { useStorage } from "@plasmohq/storage/hook"

import { SubSettingsLayout } from "~components/SubSettingsLayout"
import {
  DEFAULT_SETTINGS,
  STORAGE_KEYS,
  type ContextMenuActionsConfig,
  type FeatureSettings
} from "~core/types"

interface ContextMenuActionsSettingsViewProps {
  onBack: () => void
}

/**
 * Sub-settings view for Context Menu Actions.
 * Allows fine-tuning individual right-click actions for links.
 */
export const ContextMenuActionsSettingsView: React.FC<
  ContextMenuActionsSettingsViewProps
> = ({ onBack }) => {
  const [settings, setSettings] = useStorage<FeatureSettings>(
    STORAGE_KEYS.SETTINGS,
    DEFAULT_SETTINGS
  )

  const isMasterEnabled =
    settings?.contextMenuActions ?? DEFAULT_SETTINGS.contextMenuActions
  const currentConfig: ContextMenuActionsConfig =
    settings?.contextMenuActionsConfig ?? DEFAULT_SETTINGS.contextMenuActionsConfig

  const handleToggleMaster = (enabled: boolean) => {
    setSettings((prev) => ({
      ...(prev ?? DEFAULT_SETTINGS),
      contextMenuActions: enabled
    }))
  }

  const handleToggleAction = (key: keyof ContextMenuActionsConfig) => {
    setSettings((prev) => ({
      ...(prev ?? DEFAULT_SETTINGS),
      contextMenuActionsConfig: {
        ...(prev?.contextMenuActionsConfig ??
          DEFAULT_SETTINGS.contextMenuActionsConfig),
        [key]: !((prev?.contextMenuActionsConfig ??
          DEFAULT_SETTINGS.contextMenuActionsConfig)[key])
      }
    }))
  }

  return (
    <SubSettingsLayout
      title="Context Menu Actions"
      enabled={isMasterEnabled}
      onToggle={handleToggleMaster}
      onBack={onBack}>
      {/* Sub-actions list */}
      <div className="space-y-4">
        <div>
          <span className="text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
            Right-Click Menu Items
          </span>
          <p className="text-xs text-slate-400 mt-1">
            Choose which actions appear when right-clicking links on any webpage.
          </p>
        </div>

        <div className="space-y-3">
          {/* Action 1: Copy Link Text */}
          <div className="flex items-start justify-between gap-3 p-3 rounded-xl bg-slate-800/40 border border-slate-700/60 hover:border-slate-600 transition-colors">
            <div className="flex items-start gap-3 min-w-0 flex-1">
              <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 mt-0.5 shrink-0">
                <Type className="w-4 h-4" />
              </div>
              <div className="flex flex-col min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-slate-200">
                    Copy Link Text
                  </span>
                  <span className="font-mono text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 border border-slate-700">
                    Text only
                  </span>
                </div>
                <span className="text-[11px] text-slate-400 leading-snug mt-1">
                  Extracts and copies only the anchor text without copying the URL.
                </span>
              </div>
            </div>

            <button
              type="button"
              role="switch"
              aria-checked={currentConfig.copyLinkText}
              onClick={() => handleToggleAction("copyLinkText")}
              className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-900 mt-1 ${
                currentConfig.copyLinkText
                  ? "bg-indigo-600 shadow-indigo-500/20 shadow-sm"
                  : "bg-slate-700"
              }`}>
              <span
                className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                  currentConfig.copyLinkText ? "translate-x-4" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          {/* Action 2: Clean Link Copy */}
          <div className="flex items-start justify-between gap-3 p-3 rounded-xl bg-slate-800/40 border border-slate-700/60 hover:border-slate-600 transition-colors">
            <div className="flex items-start gap-3 min-w-0 flex-1">
              <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 mt-0.5 shrink-0">
                <Sparkles className="w-4 h-4" />
              </div>
              <div className="flex flex-col min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-slate-200">
                    Clean Link Copy
                  </span>
                  <span className="font-mono text-[10px] px-1.5 py-0.2 rounded bg-emerald-950/60 text-emerald-400 border border-emerald-800/50">
                    Anti-Tracking
                  </span>
                </div>
                <span className="text-[11px] text-slate-400 leading-snug mt-1">
                  Strips tracking parameters (<code className="text-emerald-300">utm_*</code>, <code className="text-emerald-300">fbclid</code>, <code className="text-emerald-300">si</code>) before copying.
                </span>
              </div>
            </div>

            <button
              type="button"
              role="switch"
              aria-checked={currentConfig.cleanLinkCopy}
              onClick={() => handleToggleAction("cleanLinkCopy")}
              className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-900 mt-1 ${
                currentConfig.cleanLinkCopy
                  ? "bg-indigo-600 shadow-indigo-500/20 shadow-sm"
                  : "bg-slate-700"
              }`}>
              <span
                className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                  currentConfig.cleanLinkCopy ? "translate-x-4" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          {/* Action 3: Markdown Link Copy */}
          <div className="flex items-start justify-between gap-3 p-3 rounded-xl bg-slate-800/40 border border-slate-700/60 hover:border-slate-600 transition-colors">
            <div className="flex items-start gap-3 min-w-0 flex-1">
              <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 mt-0.5 shrink-0">
                <FileCode className="w-4 h-4" />
              </div>
              <div className="flex flex-col min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-slate-200">
                    Markdown Link Copy
                  </span>
                  <span className="font-mono text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 border border-slate-700">
                    [Text](URL)
                  </span>
                </div>
                <span className="text-[11px] text-slate-400 leading-snug mt-1">
                  Copies formatted markdown hyperlink, ideal for Obsidian, Notion & GitHub notes.
                </span>
              </div>
            </div>

            <button
              type="button"
              role="switch"
              aria-checked={currentConfig.markdownLinkCopy}
              onClick={() => handleToggleAction("markdownLinkCopy")}
              className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-900 mt-1 ${
                currentConfig.markdownLinkCopy
                  ? "bg-indigo-600 shadow-indigo-500/20 shadow-sm"
                  : "bg-slate-700"
              }`}>
              <span
                className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                  currentConfig.markdownLinkCopy ? "translate-x-4" : "translate-x-0"
                }`}
              />
            </button>
          </div>
        </div>

        {/* Live Example Card */}
        <div className="p-3 rounded-xl bg-slate-800/30 border border-slate-700/40 space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-medium text-slate-300">
            <Check className="w-3.5 h-3.5 text-emerald-400" />
            <span>How Clean Link works</span>
          </div>
          <div className="space-y-1 text-[11px] font-mono">
            <div className="text-rose-400/80 truncate">
              - https://site.com/post?utm_source=fb&id=42
            </div>
            <div className="text-emerald-400 truncate">
              + https://site.com/post?id=42
            </div>
          </div>
        </div>
      </div>
    </SubSettingsLayout>
  )
}
