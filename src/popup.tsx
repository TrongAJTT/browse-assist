import { useStorage } from "@plasmohq/storage/hook"

import { DEFAULT_SETTINGS, STORAGE_KEYS, type FeatureSettings } from "~core/types"
import { AllowRightClickToggle } from "~features/allow-right-click/Toggle"
import { CopyLinkTextToggle } from "~features/copy-link-text/Toggle"
import { MouseZoomToggle } from "~features/mouse-zoom/Toggle"
import { SmoothScrollToggle } from "~features/smooth-scroll/Toggle"
import "~style.css"

function IndexPopup() {
  const [, setSettings] = useStorage<FeatureSettings>(
    STORAGE_KEYS.SETTINGS,
    DEFAULT_SETTINGS
  )

  const handleReset = () => {
    setSettings(DEFAULT_SETTINGS)
  }

  return (
    <div className="w-[340px] bg-slate-900 text-slate-100 p-4 font-sans select-none antialiased">
      {/* Header */}
      <header className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-lg shadow-inner">
            ⚡
          </div>
          <div>
            <h1 className="text-base font-bold tracking-tight text-white flex items-center gap-1.5">
              Browse Assist
            </h1>
            <p className="text-[11px] text-slate-400">
              Web Quality-of-Life Enhancements
            </p>
          </div>
        </div>
        <span className="px-2 py-0.5 text-[10px] font-semibold bg-slate-800 text-slate-400 rounded-full border border-slate-700/60">
          v0.0.1
        </span>
      </header>

      {/* Feature Toggles List */}
      <main className="mt-3.5 space-y-2.5">
        <AllowRightClickToggle />
        <CopyLinkTextToggle />
        <SmoothScrollToggle />
        <MouseZoomToggle />
      </main>

      {/* Footer & Actions */}
      <footer className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
        <button
          type="button"
          onClick={handleReset}
          className="hover:text-slate-200 transition-colors focus:outline-none underline-offset-2 hover:underline">
          Reset to defaults
        </button>
        <span className="text-[10px] text-slate-500">
          Changes apply instantly
        </span>
      </footer>
    </div>
  )
}

export default IndexPopup
