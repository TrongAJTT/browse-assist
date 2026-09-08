import { useState } from "react"

import { useStorage } from "@plasmohq/storage/hook"

import { AppIcon } from "~core/assets"
import {
  DEFAULT_SETTINGS,
  STORAGE_KEYS,
  type FeatureSettings
} from "~core/types"
import { AllowRightClickToggle } from "~features/allow-right-click/Toggle"
import { CopyLinkTextToggle } from "~features/copy-link-text/Toggle"
import { MouseZoomToggle } from "~features/mouse-zoom/Toggle"
import { SmoothScrollSettingsView } from "~features/smooth-scroll/SettingsView"
import { SmoothScrollToggle } from "~features/smooth-scroll/Toggle"

import "~style.css"

type ActiveView = "main" | "smooth-scroll-settings"

function IndexPopup() {
  const [currentView, setCurrentView] = useState<ActiveView>("main")
  const [isRightClickActiveInTab, setIsRightClickActiveInTab] = useState(false)
  const [isTabReady, setIsTabReady] = useState(false)

  const [settings] = useStorage<FeatureSettings>(
    STORAGE_KEYS.SETTINGS,
    DEFAULT_SETTINGS
  )

  // Ready when both storage settings and active tab state are hydrated
  const isHydrated = isTabReady && settings !== undefined

  const resolved = settings ?? DEFAULT_SETTINGS
  // Calculate active count: 3 persistent features + 1 on-demand tab feature
  const persistentActiveCount = [
    resolved.copyLinkText,
    resolved.smoothScroll,
    resolved.mouseZoom
  ].filter(Boolean).length

  const activeCount = persistentActiveCount + (isRightClickActiveInTab ? 1 : 0)
  const totalCount = 4

  return (
    <div
      className={`w-[370px] bg-slate-900 text-slate-100 font-sans select-none antialiased flex flex-col transition-opacity duration-150 ${
        isHydrated ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}>
      {/* Header - Crisp and cleanly separated from content */}
      <header className="px-4 py-3 bg-slate-900/95 border-b border-slate-800 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-2.5">
          <AppIcon className="w-8 h-8 rounded-xl object-contain shadow-md shadow-indigo-500/10 ring-1 ring-white/10" />
          <div>
            <h1 className="text-sm font-bold tracking-tight text-white leading-none">
              Browse Assist
            </h1>
            <p className="text-[10.5px] text-slate-400 font-normal mt-1">
              PowerToys for Web Browsing
            </p>
          </div>
        </div>

        {/* Live Active Status Pill */}
        <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-800/80 border border-slate-700/60 shadow-inner">
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

      {/* Body Area - Swappable between Main List and Feature Settings */}
      <div className="px-4 py-2.5 pb-3.5 flex-1">
        {currentView === "main" ? (
          <div>
            {/* PowerToys-style Utilities List with Dividers */}
            <main className="divide-y divide-slate-800/80">
              <AllowRightClickToggle
                onStatusChange={setIsRightClickActiveInTab}
                onReady={() => setIsTabReady(true)}
              />
              <CopyLinkTextToggle />
              <SmoothScrollToggle
                onConfigure={() => setCurrentView("smooth-scroll-settings")}
              />
              <MouseZoomToggle />
            </main>
          </div>
        ) : (
          <SmoothScrollSettingsView onBack={() => setCurrentView("main")} />
        )}
      </div>
    </div>
  )
}

export default IndexPopup
