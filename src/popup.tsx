import { useStorage } from "@plasmohq/storage/hook"

import { AppIcon } from "~core/assets"
import { DEFAULT_SETTINGS, STORAGE_KEYS, type FeatureSettings } from "~core/types"
import { AllowRightClickToggle } from "~features/allow-right-click/Toggle"
import { CopyLinkTextToggle } from "~features/copy-link-text/Toggle"
import { MouseZoomToggle } from "~features/mouse-zoom/Toggle"
import { SmoothScrollToggle } from "~features/smooth-scroll/Toggle"
import "~style.css"

function IndexPopup() {
  const [settings, setSettings] = useStorage<FeatureSettings>(
    STORAGE_KEYS.SETTINGS,
    DEFAULT_SETTINGS
  )

  const resolved = settings ?? DEFAULT_SETTINGS
  const activeCount = Object.values(resolved).filter(Boolean).length
  const totalCount = Object.keys(DEFAULT_SETTINGS).length

  const handleEnableAll = () => {
    setSettings({
      allowRightClick: true,
      copyLinkText: true,
      smoothScroll: true,
      mouseZoom: true
    })
  }

  const handleDisableAll = () => {
    setSettings({
      allowRightClick: false,
      copyLinkText: false,
      smoothScroll: false,
      mouseZoom: false
    })
  }

  const handleReset = () => {
    setSettings(DEFAULT_SETTINGS)
  }

  return (
    <div className="w-[350px] bg-slate-900 text-slate-100 p-4 font-sans select-none antialiased">
      {/* Header */}
      <header className="flex items-center justify-between pb-3.5 border-b border-slate-800/80">
        <div className="flex items-center gap-2.5">
          <AppIcon className="w-9 h-9 rounded-xl object-contain shadow-lg shadow-indigo-500/20 ring-1 ring-white/20" />
          <div>
            <h1 className="text-sm font-bold tracking-tight text-white flex items-center gap-1.5">
              Browse Assist
            </h1>
            <p className="text-[11px] text-slate-400 font-normal">
              Quality-of-Life Web Toolkit
            </p>
          </div>
        </div>

        {/* Status indicator badge */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-800/90 border border-slate-700/60 shadow-inner">
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              activeCount > 0
                ? "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)] animate-pulse"
                : "bg-slate-500"
            }`}
          />
          <span className="text-[10px] font-semibold text-slate-300">
            {activeCount}/{totalCount} Active
          </span>
        </div>
      </header>

      {/* Quick Actions Bar */}
      <div className="flex items-center justify-between mt-3 px-1 text-[11px] text-slate-400">
        <span className="font-medium text-slate-400">Features</span>
        <div className="flex items-center gap-2">
          {activeCount < totalCount ? (
            <button
              type="button"
              onClick={handleEnableAll}
              className="text-indigo-400 hover:text-indigo-300 transition-colors font-medium">
              Enable all
            </button>
          ) : (
            <button
              type="button"
              onClick={handleDisableAll}
              className="text-slate-400 hover:text-slate-200 transition-colors font-medium">
              Disable all
            </button>
          )}
        </div>
      </div>

      {/* Feature Toggles List */}
      <main className="mt-2 space-y-2.5">
        <AllowRightClickToggle />
        <CopyLinkTextToggle />
        <SmoothScrollToggle />
        <MouseZoomToggle />
      </main>

      {/* Footer & Actions */}
      <footer className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
        <button
          type="button"
          onClick={handleReset}
          className="hover:text-slate-200 transition-colors focus:outline-none underline-offset-2 hover:underline">
          Reset defaults
        </button>
        <div className="flex items-center gap-1 text-[10px] text-slate-500">
          <span>v0.0.1</span>
          <span>•</span>
          <span>Manifest V3</span>
        </div>
      </footer>
    </div>
  )
}

export default IndexPopup
