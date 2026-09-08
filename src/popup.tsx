import {
  Coffee,
  ExternalLink,
  GitBranch,
  Heart,
  HelpCircle,
  PictureInPicture2,
  X
} from "lucide-react"
import { useEffect, useRef, useState } from "react"

import { useStorage } from "@plasmohq/storage/hook"

import { AboutView } from "~components/AboutView"
import { AppIcon } from "~core/assets"
import { DONATE_OPTIONS } from "~core/constants"
import {
  DEFAULT_SETTINGS,
  STORAGE_KEYS,
  type FeatureSettings
} from "~core/types"
import { AllowRightClickToggle } from "~features/allow-right-click/Toggle"
import { ContextMenuActionsSettingsView } from "~features/context-menu-actions/SettingsView"
import { ContextMenuActionsToggle } from "~features/context-menu-actions/Toggle"
import { MouseZoomSettingsView } from "~features/mouse-zoom/SettingsView"
import { MouseZoomToggle } from "~features/mouse-zoom/Toggle"
import { PictureInPictureSettingsView } from "~features/picture-in-picture/SettingsView"
import { PictureInPictureToggle } from "~features/picture-in-picture/Toggle"
import { SmoothScrollSettingsView } from "~features/smooth-scroll/SettingsView"
import { SmoothScrollToggle } from "~features/smooth-scroll/Toggle"
import { SuperDragSettingsView } from "~features/super-drag/SettingsView"
import { SuperDragToggle } from "~features/super-drag/Toggle"

import "~style.css"

type ActiveView =
  | "main"
  | "context-menu-actions-settings"
  | "super-drag-settings"
  | "smooth-scroll-settings"
  | "mouse-zoom-settings"
  | "picture-in-picture-settings"
  | "about"

function IndexPopup() {
  const [currentView, setCurrentView] = useState<ActiveView>("main")
  const [isTabReady, setIsTabReady] = useState(false)
  const [isDonateOpen, setIsDonateOpen] = useState(false)
  const donateMenuRef = useRef<HTMLDivElement>(null)

  const [settings] = useStorage<FeatureSettings>(
    STORAGE_KEYS.SETTINGS,
    DEFAULT_SETTINGS
  )

  const [activePiP, setActivePiP] = useState<{
    tabId: number
    title: string
  } | null>(null)
  const [pipShortcut, setPipShortcut] = useState<string>("Alt + P")

  // Query background for active PiP session and command shortcut
  useEffect(() => {
    chrome.runtime.sendMessage(
      { action: "GET_ACTIVE_PIP_SESSION" },
      (response) => {
        if (response?.session) {
          setActivePiP(response.session)
        }
      }
    )

    if (chrome.commands?.getAll) {
      chrome.commands.getAll((commands) => {
        const cmd = commands.find(
          (c) => c.name === "toggle_picture_in_picture"
        )
        if (cmd?.shortcut) {
          setPipShortcut(cmd.shortcut)
        } else {
          setPipShortcut("")
        }
      })
    }
  }, [])

  const handleFocusPiPTab = () => {
    chrome.runtime.sendMessage({ action: "FOCUS_PIP_TAB" }, () => {
      window.close()
    })
  }

  const handleClosePiP = (e: React.MouseEvent) => {
    e.stopPropagation()
    chrome.runtime.sendMessage({ action: "CLOSE_PIP" }, () => {
      setActivePiP(null)
    })
  }

  const handleTogglePiPOnCurrentTab = () => {
    if (activePiP) {
      chrome.runtime.sendMessage({ action: "CLOSE_PIP" }, () => {
        setActivePiP(null)
      })
      return
    }

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const activeTab = tabs[0]
      if (activeTab?.id) {
        chrome.tabs.sendMessage(
          activeTab.id,
          { action: "TOGGLE_PICTURE_IN_PICTURE" },
          () => {
            // Re-check PiP state after small delay
            setTimeout(() => {
              chrome.runtime.sendMessage(
                { action: "GET_ACTIVE_PIP_SESSION" },
                (response) => {
                  if (response?.session) {
                    setActivePiP(response.session)
                  }
                }
              )
            }, 300)
          }
        )
      }
    })
  }

  // Ready when both storage settings and active tab state are hydrated
  const isHydrated = isTabReady && settings !== undefined

  // Close donate menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        donateMenuRef.current &&
        !donateMenuRef.current.contains(event.target as Node)
      ) {
        setIsDonateOpen(false)
      }
    }
    if (isDonateOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [isDonateOpen])

  const getDonateIcon = (iconName: string) => {
    switch (iconName) {
      case "coffee":
        return <Coffee className="w-3.5 h-3.5 text-amber-400" />
      case "github":
        return <GitBranch className="w-3.5 h-3.5 text-slate-200" />
      default:
        return <Heart className="w-3.5 h-3.5 text-rose-400" />
    }
  }

  return (
    <div
      className={`w-[444px] h-[600px] bg-slate-900 text-slate-100 font-sans select-none antialiased flex flex-col overflow-hidden transition-opacity duration-150 ${
        isHydrated ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}>
      {/* Header - Crisp and cleanly separated from content */}
      <header className="px-4 py-3 bg-slate-900/95 border-b border-slate-800 flex items-center justify-between sticky top-0 z-20">
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

        {/* Action icons: PiP Trigger, Donate (Dropdown) & About (Sub-page) */}
        <div className="flex items-center gap-1">
          {/* Quick Trigger PiP Button */}
          {settings?.pictureInPicture && (
            <button
              type="button"
              title={
                activePiP
                  ? "Exit Picture-in-Picture"
                  : pipShortcut
                    ? `Toggle Picture-in-Picture (${pipShortcut})`
                    : "Toggle Picture-in-Picture"
              }
              onClick={handleTogglePiPOnCurrentTab}
              className={`p-1.5 rounded-lg transition-all focus:outline-none ${
                activePiP
                  ? "bg-indigo-600/30 text-indigo-400 ring-1 ring-indigo-500/50 hover:bg-indigo-600/40 animate-pulse"
                  : "text-slate-400 hover:text-indigo-400 hover:bg-slate-800/80 active:scale-95"
              }`}>
              <PictureInPicture2 className="w-4 h-4" />
            </button>
          )}

          {/* Donate Button & Dropdown */}
          <div className="relative" ref={donateMenuRef}>
            <button
              type="button"
              title="Support & Donate"
              onClick={() => setIsDonateOpen((prev) => !prev)}
              className={`p-1.5 rounded-lg transition-all focus:outline-none ${
                isDonateOpen
                  ? "bg-rose-500/20 text-rose-400 ring-1 ring-rose-500/40"
                  : "text-slate-400 hover:text-rose-400 hover:bg-slate-800/80 active:scale-95"
              }`}>
              <Heart className="w-4 h-4 fill-current/20" />
            </button>

            {/* Donate Popup Menu */}
            {isDonateOpen && (
              <div className="absolute right-0 mt-2 w-48 rounded-xl bg-slate-800 border border-slate-700/80 shadow-xl shadow-black/40 py-1.5 z-30 animate-in fade-in zoom-in-95 duration-100">
                <div className="px-3 py-1 text-[10px] font-semibold text-slate-400 tracking-wider uppercase border-b border-slate-700/50 mb-1">
                  Support the Project
                </div>
                {DONATE_OPTIONS.map((option) => (
                  <a
                    key={option.id}
                    href={option.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setIsDonateOpen(false)}
                    className="flex items-center justify-between px-3 py-2 text-xs text-slate-200 hover:text-white hover:bg-slate-700/60 transition-colors">
                    <div className="flex items-center gap-2">
                      {getDonateIcon(option.iconName)}
                      <span className="font-medium">{option.label}</span>
                    </div>
                    <ExternalLink className="w-3 h-3 text-slate-400" />
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* About Button */}
          <button
            type="button"
            title="About Browse Assist"
            onClick={() => setCurrentView("about")}
            className={`p-1.5 rounded-lg transition-all focus:outline-none ${
              currentView === "about"
                ? "bg-indigo-600/20 text-indigo-400 ring-1 ring-indigo-500/40"
                : "text-slate-400 hover:text-slate-100 hover:bg-slate-800/80 active:scale-95"
            }`}>
            <HelpCircle className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Body Area - Swappable between Main List, Feature Settings and About View */}
      <div className="px-4 py-2.5 pb-3.5 flex-1 overflow-y-auto">
        {/* Universal PiP Active Banner */}
        {activePiP && currentView === "main" && (
          <div
            onClick={handleFocusPiPTab}
            title="Click to jump to this video tab"
            className="mb-1.5 py-1.5 px-2.5 rounded-md bg-indigo-950/60 border border-indigo-500/30 hover:border-indigo-500/60 transition-all cursor-pointer group flex items-center justify-between gap-2.5 shadow-lg shadow-indigo-950/20">
            <div className="flex items-center gap-1.5 min-w-0 flex-1">
              <div className="p-1.5 text-indigo-400 group-hover:scale-105 transition-transform shrink-0">
                <PictureInPicture2 className="w-5 h-5 animate-pulse" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 leading-none">
                  Video in PiP Mode
                </span>
                <span className="text-xs font-semibold text-slate-200 truncate mt-0.5 group-hover:text-indigo-200 transition-colors">
                  {activePiP.title}
                </span>
              </div>
            </div>

            <div className="flex items-center shrink-0">
              <button
                type="button"
                onClick={handleClosePiP}
                title="Exit Picture-in-Picture window"
                className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-300 bg-slate-800/90 border border-slate-700/80 px-2.5 py-1 rounded-lg transition-all duration-150 hover:bg-rose-500 hover:text-white hover:border-rose-500 hover:shadow-md hover:shadow-rose-500/25 hover:scale-[1.02] active:scale-95 focus:outline-none focus:ring-2 focus:ring-rose-500/50">
                <X className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Exit PiP</span>
              </button>
            </div>
          </div>
        )}

        {currentView === "main" ? (
          <div>
            {/* PowerToys-style Utilities List with Dividers */}
            <main className="divide-y divide-slate-800/80">
              <AllowRightClickToggle onReady={() => setIsTabReady(true)} />
              <ContextMenuActionsToggle
                onConfigure={() =>
                  setCurrentView("context-menu-actions-settings")
                }
              />
              <SuperDragToggle
                onConfigure={() => setCurrentView("super-drag-settings")}
              />
              <PictureInPictureToggle
                onOpenSettings={() =>
                  setCurrentView("picture-in-picture-settings")
                }
              />
              <SmoothScrollToggle
                onConfigure={() => setCurrentView("smooth-scroll-settings")}
              />
              <MouseZoomToggle
                onConfigure={() => setCurrentView("mouse-zoom-settings")}
              />
            </main>
          </div>
        ) : currentView === "context-menu-actions-settings" ? (
          <ContextMenuActionsSettingsView
            onBack={() => setCurrentView("main")}
          />
        ) : currentView === "super-drag-settings" ? (
          <SuperDragSettingsView onBack={() => setCurrentView("main")} />
        ) : currentView === "picture-in-picture-settings" ? (
          <PictureInPictureSettingsView onBack={() => setCurrentView("main")} />
        ) : currentView === "smooth-scroll-settings" ? (
          <SmoothScrollSettingsView onBack={() => setCurrentView("main")} />
        ) : currentView === "mouse-zoom-settings" ? (
          <MouseZoomSettingsView onBack={() => setCurrentView("main")} />
        ) : (
          <AboutView onBack={() => setCurrentView("main")} />
        )}
      </div>
    </div>
  )
}

export default IndexPopup
