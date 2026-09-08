import { ChevronRight, PictureInPicture2 } from "lucide-react"
import type React from "react"

import { useStorage } from "@plasmohq/storage/hook"

import {
  DEFAULT_SETTINGS,
  STORAGE_KEYS,
  type FeatureSettings
} from "~core/types"

interface PictureInPictureToggleProps {
  onOpenSettings?: () => void
}

/**
 * Toggle component for Universal Picture-in-Picture.
 */
export const PictureInPictureToggle: React.FC<PictureInPictureToggleProps> = ({
  onOpenSettings
}) => {
  const [settings, setSettings] = useStorage<FeatureSettings>(
    STORAGE_KEYS.SETTINGS,
    DEFAULT_SETTINGS
  )

  const isEnabled = settings?.pictureInPicture ?? DEFAULT_SETTINGS.pictureInPicture

  const handleToggle = () => {
    setSettings((prev) => ({
      ...(prev ?? DEFAULT_SETTINGS),
      pictureInPicture: !isEnabled
    }))
  }

  return (
    <div className="flex items-center justify-between gap-3 py-3 group">
      {/* Clickable Area: Icon & Title & Description */}
      <div
        onClick={onOpenSettings}
        className={`flex items-start gap-3 flex-1 min-w-0 cursor-pointer ${
          isEnabled ? "feature-row-active" : "feature-row-dimmed"
        }`}>
        <div className="shrink-0 mt-0.5 flex items-center justify-center transition-transform duration-200 ease-out group-hover:scale-110">
          <PictureInPicture2 className="w-5 h-5 text-indigo-400" />
        </div>
        <div className="flex flex-col min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-semibold text-slate-200 group-hover:text-indigo-300 transition-colors">
              Universal Picture-in-Picture
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-slate-300 transition-colors" />
          </div>
          <span className="text-[11px] text-slate-400 leading-snug mt-0.5">
            Toggle floating video window using configurable hotkey (default Alt+P).
          </span>
        </div>
      </div>

      {/* Modern Switch Toggle */}
      <button
        type="button"
        role="switch"
        aria-checked={isEnabled}
        onClick={handleToggle}
        className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-900 ${
          isEnabled
            ? "bg-indigo-600 shadow-indigo-500/20 shadow-sm"
            : "bg-slate-700"
        }`}>
        <span
          className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
            isEnabled ? "translate-x-4" : "translate-x-0"
          }`}
        />
      </button>
    </div>
  )
}
