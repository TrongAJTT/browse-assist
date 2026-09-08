import { ExternalLink, Eye, Keyboard, ShieldAlert } from "lucide-react"
import type React from "react"
import { useEffect, useState } from "react"

import { useStorage } from "@plasmohq/storage/hook"

import { SubSettingsLayout } from "~components/SubSettingsLayout"
import {
  DEFAULT_SETTINGS,
  STORAGE_KEYS,
  type FeatureSettings,
  type PictureInPictureConfig
} from "~core/types"

interface PictureInPictureSettingsViewProps {
  onBack: () => void
}

/**
 * Sub-settings view for Universal Picture-in-Picture.
 */
export const PictureInPictureSettingsView: React.FC<
  PictureInPictureSettingsViewProps
> = ({ onBack }) => {
  const [settings, setSettings] = useStorage<FeatureSettings>(
    STORAGE_KEYS.SETTINGS,
    DEFAULT_SETTINGS
  )
  const [shortcut, setShortcut] = useState<string>("Alt + P")

  useEffect(() => {
    if (chrome.commands?.getAll) {
      chrome.commands.getAll((commands) => {
        const cmd = commands.find(
          (c) => c.name === "toggle_picture_in_picture"
        )
        if (cmd?.shortcut) {
          setShortcut(cmd.shortcut)
        } else {
          setShortcut("Not configured")
        }
      })
    }
  }, [])

  const isMasterEnabled =
    settings?.pictureInPicture ?? DEFAULT_SETTINGS.pictureInPicture
  const currentConfig: PictureInPictureConfig =
    settings?.pictureInPictureConfig ?? DEFAULT_SETTINGS.pictureInPictureConfig

  const handleToggleMaster = (enabled: boolean) => {
    setSettings((prev) => ({
      ...(prev ?? DEFAULT_SETTINGS),
      pictureInPicture: enabled
    }))
  }

  const handleToggleOption = (key: keyof PictureInPictureConfig) => {
    setSettings((prev) => ({
      ...(prev ?? DEFAULT_SETTINGS),
      pictureInPictureConfig: {
        ...(prev?.pictureInPictureConfig ??
          DEFAULT_SETTINGS.pictureInPictureConfig),
        [key]: !currentConfig[key]
      }
    }))
  }

  const handleOpenShortcutsPage = () => {
    chrome.tabs.create({ url: "chrome://extensions/shortcuts" })
  }

  return (
    <SubSettingsLayout
      title="Picture-in-Picture"
      enabled={isMasterEnabled}
      onToggle={handleToggleMaster}
      onBack={onBack}>
      <div className="space-y-4">
        {/* Shortcut Section */}
        <div className="space-y-2">
          <span className="text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
            Keyboard Shortcut
          </span>

          <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/50 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400">
                <Keyboard className="w-4 h-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-slate-200">
                  Global Shortcut
                </span>
                <span className="text-[10.5px] text-slate-400">
                  Toggle floating video window
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <kbd className="px-2 py-1 text-[11px] font-mono font-bold text-slate-200 bg-slate-800 rounded border border-slate-600 shadow-sm">
                {shortcut}
              </kbd>
              <button
                type="button"
                onClick={handleOpenShortcutsPage}
                title="Customize in browser shortcut settings"
                className="p-1 text-slate-400 hover:text-indigo-400 transition-colors">
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Options */}
        <div className="space-y-2 pt-2 border-t border-slate-800/80">
          <span className="text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
            Display & Feedback
          </span>

          <div className="divide-y divide-slate-800/80">
            {/* Show Badge */}
            <div className="flex items-center justify-between gap-3 py-3 group">
              <div
                onClick={() => handleToggleOption("showBadge")}
                className={`flex items-start gap-3 flex-1 min-w-0 cursor-pointer ${
                  currentConfig.showBadge
                    ? "feature-row-active"
                    : "feature-row-dimmed"
                }`}>
                <div className="shrink-0 mt-0.5 flex items-center justify-center transition-transform duration-200 ease-out group-hover:scale-110">
                  <Eye className="w-5 h-5 text-indigo-400" />
                </div>
                <div className="flex flex-col min-w-0 flex-1">
                  <span className="text-xs font-semibold text-slate-200">
                    Extension Badge Indicator
                  </span>
                  <span className="text-[11px] text-slate-400 leading-snug mt-0.5">
                    Show &ldquo;PiP&rdquo; badge on extension icon whenever a video is playing in PiP.
                  </span>
                </div>
              </div>

              <button
                type="button"
                role="switch"
                aria-checked={currentConfig.showBadge}
                onClick={() => handleToggleOption("showBadge")}
                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-900 ${
                  currentConfig.showBadge
                    ? "bg-indigo-600 shadow-indigo-500/20 shadow-sm"
                    : "bg-slate-700"
                }`}>
                <span
                  className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                    currentConfig.showBadge
                      ? "translate-x-4"
                      : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            {/* Show Action Toast */}
            <div className="flex items-center justify-between gap-3 py-3 group">
              <div
                onClick={() => handleToggleOption("showToast")}
                className={`flex items-start gap-3 flex-1 min-w-0 cursor-pointer ${
                  currentConfig.showToast
                    ? "feature-row-active"
                    : "feature-row-dimmed"
                }`}>
                <div className="shrink-0 mt-0.5 flex items-center justify-center transition-transform duration-200 ease-out group-hover:scale-110">
                  <Eye className="w-5 h-5 text-emerald-400" />
                </div>
                <div className="flex flex-col min-w-0 flex-1">
                  <span className="text-xs font-semibold text-slate-200">
                    Action Toast Notification
                  </span>
                  <span className="text-[11px] text-slate-400 leading-snug mt-0.5">
                    Display brief confirmation toast when entering or exiting PiP.
                  </span>
                </div>
              </div>

              <button
                type="button"
                role="switch"
                aria-checked={currentConfig.showToast}
                onClick={() => handleToggleOption("showToast")}
                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-900 ${
                  currentConfig.showToast
                    ? "bg-indigo-600 shadow-indigo-500/20 shadow-sm"
                    : "bg-slate-700"
                }`}>
                <span
                  className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                    currentConfig.showToast
                      ? "translate-x-4"
                      : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Feature Highlights Note */}
        <div className="p-3 rounded-xl bg-slate-800/30 border border-slate-700/40 text-[11px] text-slate-400 space-y-1">
          <div className="flex items-center gap-1.5 font-semibold text-slate-300">
            <ShieldAlert className="w-3.5 h-3.5 text-indigo-400" />
            <span>Universal Compatibility</span>
          </div>
          <p className="leading-relaxed">
            Automatically finds currently active playing videos, unlocks restricted players, and allows single-click tab refocusing right from the extension popup.
          </p>
        </div>
      </div>
    </SubSettingsLayout>
  )
}
