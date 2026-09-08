import {
  Coffee,
  ExternalLink,
  GitBranch,
  Heart,
  HelpCircle,
  PictureInPicture2,
  Pipette,
  Settings as SettingsIcon,
  Sparkles,
  X,
  Zap
} from "lucide-react"
import { useEffect, useRef, useState } from "react"

import { useStorage } from "@plasmohq/storage/hook"

import { AboutView } from "~components/AboutView"
import { GlobalDialogHost } from "~components/GlobalDialogHost"
import { PreferencesSettingsView } from "~components/PreferencesSettingsView"
import { AppIcon } from "~core/assets"
import { DONATE_OPTIONS } from "~core/constants"
import {
  MESSAGE_TYPES,
  sendToActiveTab,
  sendToBackground
} from "~core/messaging"
import {
  DEFAULT_SETTINGS,
  STORAGE_KEYS,
  type FeatureSettings
} from "~core/types"
import { AllowRightClickToggle } from "~features/allow-right-click/Toggle"
import { ColorPickerSettingsView } from "~features/color-picker/SettingsView"
import { ColorPickerToggle } from "~features/color-picker/Toggle"
import { ContextMenuActionsSettingsView } from "~features/context-menu-actions/SettingsView"
import { ContextMenuActionsToggle } from "~features/context-menu-actions/Toggle"
import { ElementZapperSettingsView } from "~features/element-zapper/SettingsView"
import { ElementZapperToggle } from "~features/element-zapper/Toggle"
import { MouseZoomSettingsView } from "~features/mouse-zoom/SettingsView"
import { MouseZoomToggle } from "~features/mouse-zoom/Toggle"
import { PictureInPictureSettingsView } from "~features/picture-in-picture/SettingsView"
import { PictureInPictureToggle } from "~features/picture-in-picture/Toggle"
import { QuickScrollSettingsView } from "~features/quick-scroll/SettingsView"
import { QuickScrollToggle } from "~features/quick-scroll/Toggle"
import { SmoothScrollSettingsView } from "~features/smooth-scroll/SettingsView"
import { SmoothScrollToggle } from "~features/smooth-scroll/Toggle"
import { SuperDragSettingsView } from "~features/super-drag/SettingsView"
import { SuperDragToggle } from "~features/super-drag/Toggle"

import "~style.css"

type ActiveView =
  | "main"
  | "context-menu-actions-settings"
  | "super-drag-settings"
  | "quick-scroll-settings"
  | "picture-in-picture-settings"
  | "smooth-scroll-settings"
  | "mouse-zoom-settings"
  | "color-picker-settings"
  | "element-zapper-settings"
  | "preferences"
  | "about"

function IndexPopup() {
  const [currentView, setCurrentView] = useState<ActiveView>("main")
  const [isTabReady, setIsTabReady] = useState(false)
  const [isDonateOpen, setIsDonateOpen] = useState(false)
  const donateMenuRef = useRef<HTMLDivElement>(null)
  const [isQuickToolsOpen, setIsQuickToolsOpen] = useState(false)
  const quickToolsMenuRef = useRef<HTMLDivElement>(null)

  const [settings] = useStorage<FeatureSettings>(
    STORAGE_KEYS.SETTINGS,
    DEFAULT_SETTINGS
  )

  const [activePiP, setActivePiP] = useState<{
    tabId: number
    title: string
  } | null>(null)
  const [pipShortcut, setPipShortcut] = useState<string>("Alt + P")
  const [colorPickerShortcut, setColorPickerShortcut] =
    useState<string>("Alt + Shift + C")
  const [elementZapperShortcut, setElementZapperShortcut] =
    useState<string>("Alt + Shift + Z")

  // Query background for active PiP session and command shortcuts
  useEffect(() => {
    sendToBackground(MESSAGE_TYPES.GET_ACTIVE_PIP_SESSION).then((response) => {
      if (response?.session) {
        setActivePiP(response.session)
      }
    })

    if (chrome.commands?.getAll) {
      chrome.commands.getAll((commands) => {
        const pipCmd = commands.find(
          (c) => c.name === "toggle_picture_in_picture"
        )
        if (pipCmd?.shortcut) {
          setPipShortcut(pipCmd.shortcut)
        } else {
          setPipShortcut("")
        }

        const cpCmd = commands.find((c) => c.name === "toggle_color_picker")
        if (cpCmd?.shortcut) {
          setColorPickerShortcut(cpCmd.shortcut)
        } else {
          setColorPickerShortcut("")
        }

        const ezCmd = commands.find((c) => c.name === "toggle_element_zapper")
        if (ezCmd?.shortcut) {
          setElementZapperShortcut(ezCmd.shortcut)
        } else {
          setElementZapperShortcut("")
        }
      })
    }
  }, [])

  const handleFocusPiPTab = async () => {
    await sendToBackground(MESSAGE_TYPES.FOCUS_PIP_TAB)
    window.close()
  }

  const handleClosePiP = async (e: React.MouseEvent) => {
    e.stopPropagation()
    await sendToBackground(MESSAGE_TYPES.CLOSE_PIP)
    setActivePiP(null)
  }

  const handleTogglePiPOnCurrentTab = async () => {
    if (activePiP) {
      await sendToBackground(MESSAGE_TYPES.CLOSE_PIP)
      setActivePiP(null)
      return
    }

    await sendToActiveTab(MESSAGE_TYPES.TOGGLE_PICTURE_IN_PICTURE)
    // Re-check PiP state after small delay
    setTimeout(async () => {
      const response = await sendToBackground(
        MESSAGE_TYPES.GET_ACTIVE_PIP_SESSION
      )
      if (response?.session) {
        setActivePiP(response.session)
      }
    }, 300)
  }

  // Ready when both storage settings and active tab state are hydrated
  const isHydrated = isTabReady && settings !== undefined

  // Close dropdown menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node
      if (donateMenuRef.current && !donateMenuRef.current.contains(target)) {
        setIsDonateOpen(false)
      }
      if (
        quickToolsMenuRef.current &&
        !quickToolsMenuRef.current.contains(target)
      ) {
        setIsQuickToolsOpen(false)
      }
    }
    if (isDonateOpen || isQuickToolsOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [isDonateOpen, isQuickToolsOpen])

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

  // Evaluate active theme ("dark" vs "light")
  const activeThemeMode = settings?.theme ?? DEFAULT_SETTINGS.theme
  const [systemPrefersDark, setSystemPrefersDark] = useState<boolean>(() => {
    return window.matchMedia?.("(prefers-color-scheme: dark)").matches ?? true
  })

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
    const handler = (e: MediaQueryListEvent) => setSystemPrefersDark(e.matches)
    mediaQuery.addEventListener("change", handler)
    return () => mediaQuery.removeEventListener("change", handler)
  }, [])

  const isDark =
    activeThemeMode === "dark" ||
    (activeThemeMode === "system" && systemPrefersDark)

  const themeClass = isDark ? "theme-dark" : "theme-light"

  return (
    <div
      className={`w-[444px] h-[600px] bg-app text-content-primary font-sans select-none antialiased flex flex-col overflow-hidden transition-opacity duration-150 ${themeClass} ${
        isHydrated ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}>
      {/* Header - Crisp and cleanly separated from content */}
      <header className="px-4 py-3 bg-app-header border-b border-border-divider flex items-center justify-between sticky top-0 z-20 backdrop-blur-md">
        <div className="flex items-center gap-2.5">
          <AppIcon className="w-8 h-8 rounded-xl object-contain shadow-md shadow-accent-glow ring-1 ring-white/10" />
          <div>
            <h1 className="text-sm font-bold tracking-tight text-content-primary leading-none">
              Browse Assist
            </h1>
            <p className="text-[11px] text-content-muted font-normal mt-1">
              PowerToys for Web Browsing
            </p>
          </div>
        </div>

        {/* Action icons: Quick Tools, Preferences, About & Donate */}
        <div className="flex items-center gap-1">
          {/* Quick Tools Dropdown */}
          <div className="relative" ref={quickToolsMenuRef}>
            <button
              type="button"
              title="Quick Tools (Instant Actions)"
              onClick={() => setIsQuickToolsOpen((prev) => !prev)}
              className={`p-1.5 rounded-lg transition-all focus:outline-none ${
                isQuickToolsOpen
                  ? "bg-accent-subtle text-accent ring-1 ring-accent-glow"
                  : activePiP
                    ? "bg-indigo-500/20 text-indigo-400 ring-1 ring-indigo-500/30 animate-pulse"
                    : "text-content-muted hover:text-accent hover:bg-app-surface active:scale-95"
              }`}>
              <Sparkles className="w-4 h-4 fill-current/20" />
            </button>

            {/* Quick Tools Dropdown Menu */}
            {isQuickToolsOpen && (
              <div className="absolute right-0 mt-2 w-64 rounded-xl bg-app-elevated border border-border-subtle shadow-2xl shadow-black/50 py-1.5 z-30 animate-in fade-in zoom-in-95 duration-100">
                <div className="px-3 py-1.5 border-b border-border-divider/50 mb-1 flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-content-muted">
                    Quick Tools
                  </span>
                  <span className="text-[10px] text-content-muted">
                    Click to launch on page
                  </span>
                </div>

                <div className="space-y-0.5 px-1">
                  {/* Pick Color from Screen */}
                  {settings?.colorPicker && (
                    <button
                      type="button"
                      onClick={async () => {
                        setIsQuickToolsOpen(false)
                        if (
                          typeof window !== "undefined" &&
                          "EyeDropper" in window
                        ) {
                          try {
                            const EyeDropperClass = (
                              window as unknown as {
                                EyeDropper: new () => {
                                  open: () => Promise<{ sRGBHex: string }>
                                }
                              }
                            ).EyeDropper
                            const eyeDropper = new EyeDropperClass()
                            const result = await eyeDropper.open()
                            if (result?.sRGBHex) {
                              const hex = result.sRGBHex.toUpperCase()
                              await navigator.clipboard
                                .writeText(hex)
                                .catch(() => {})
                            }
                          } catch {
                            // User cancelled
                          }
                          return
                        }
                        await sendToActiveTab(
                          MESSAGE_TYPES.TRIGGER_COLOR_PICKER
                        )
                        window.close()
                      }}
                      className="w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs hover:bg-app-surface text-content-primary transition-colors group text-left">
                      <div className="flex items-center gap-2.5">
                        <div className="p-1 rounded-md bg-pink-500/10 text-pink-400 group-hover:scale-105 transition-transform">
                          <Pipette className="w-3.5 h-3.5" />
                        </div>
                        <span className="font-medium text-[11px]">
                          Pick Color
                        </span>
                      </div>
                      {colorPickerShortcut && (
                        <kbd className="px-1.5 py-0.5 bg-surface-elevated text-content-muted rounded text-[10px] font-mono border border-border-subtle">
                          {colorPickerShortcut}
                        </kbd>
                      )}
                    </button>
                  )}

                  {/* Zap Element from Page */}
                  {settings?.elementZapper && (
                    <button
                      type="button"
                      onClick={async () => {
                        setIsQuickToolsOpen(false)
                        await sendToActiveTab(
                          MESSAGE_TYPES.TRIGGER_ELEMENT_ZAPPER
                        )
                        window.close()
                      }}
                      className="w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs hover:bg-app-surface text-content-primary transition-colors group text-left">
                      <div className="flex items-center gap-2.5">
                        <div className="p-1 rounded-md bg-amber-500/10 text-amber-400 group-hover:scale-105 transition-transform">
                          <Zap className="w-3.5 h-3.5" />
                        </div>
                        <span className="font-medium text-[11px]">
                          Element Zapper
                        </span>
                      </div>
                      {elementZapperShortcut && (
                        <kbd className="px-1.5 py-0.5 bg-surface-elevated text-content-muted rounded text-[10px] font-mono border border-border-subtle">
                          {elementZapperShortcut}
                        </kbd>
                      )}
                    </button>
                  )}

                  {/* Toggle Picture-in-Picture */}
                  {settings?.pictureInPicture && (
                    <button
                      type="button"
                      onClick={async () => {
                        setIsQuickToolsOpen(false)
                        await handleTogglePiPOnCurrentTab()
                      }}
                      className="w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs hover:bg-app-surface text-content-primary transition-colors group text-left">
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`p-1 rounded-md transition-transform group-hover:scale-105 ${
                            activePiP
                              ? "bg-indigo-500/20 text-indigo-400 animate-pulse"
                              : "bg-indigo-500/10 text-indigo-400"
                          }`}>
                          <PictureInPicture2 className="w-3.5 h-3.5" />
                        </div>
                        <div className="flex flex-col">
                          <span className="font-medium text-[11px]">
                            {activePiP
                              ? "Exit PiP Video"
                              : "Picture-in-Picture"}
                          </span>
                        </div>
                      </div>
                      {pipShortcut && (
                        <kbd className="px-1.5 py-0.5 bg-surface-elevated text-content-muted rounded text-[10px] font-mono border border-border-subtle">
                          {pipShortcut}
                        </kbd>
                      )}
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Preferences / Settings Button */}
          <button
            type="button"
            title="Preferences & Theme"
            onClick={() => setCurrentView("preferences")}
            className={`p-1.5 rounded-lg transition-all focus:outline-none ${
              currentView === "preferences"
                ? "bg-accent-subtle text-accent ring-1 ring-accent-glow"
                : "text-content-muted hover:text-content-primary hover:bg-app-surface active:scale-95"
            }`}>
            <SettingsIcon className="w-4 h-4" />
          </button>

          {/* About Button */}
          <button
            type="button"
            title="About Browse Assist"
            onClick={() => setCurrentView("about")}
            className={`p-1.5 rounded-lg transition-all focus:outline-none ${
              currentView === "about"
                ? "bg-accent-subtle text-accent ring-1 ring-accent-glow"
                : "text-content-muted hover:text-content-primary hover:bg-app-surface active:scale-95"
            }`}>
            <HelpCircle className="w-4 h-4" />
          </button>

          {/* Donate Button & Dropdown (Last item) */}
          <div className="relative" ref={donateMenuRef}>
            <button
              type="button"
              title="Support & Donate"
              onClick={() => setIsDonateOpen((prev) => !prev)}
              className={`p-1.5 rounded-lg transition-all focus:outline-none ${
                isDonateOpen
                  ? "bg-rose-500/20 text-rose-400 ring-1 ring-rose-500/40"
                  : "text-content-muted hover:text-rose-400 hover:bg-app-surface active:scale-95"
              }`}>
              <Heart className="w-4 h-4 fill-current/20" />
            </button>

            {/* Donate Popup Menu */}
            {isDonateOpen && (
              <div className="absolute right-0 mt-2 w-48 rounded-xl bg-app-elevated border border-border-subtle shadow-xl shadow-black/40 py-1.5 z-30 animate-in fade-in zoom-in-95 duration-100">
                <div className="px-3 py-1 text-[10px] font-semibold text-content-muted tracking-wider uppercase border-b border-border-divider mb-1">
                  Support the Project
                </div>
                {DONATE_OPTIONS.map((option) => (
                  <a
                    key={option.id}
                    href={option.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setIsDonateOpen(false)}
                    className="flex items-center justify-between px-3 py-2 text-xs text-content-secondary hover:text-content-primary hover:bg-app-surface transition-colors">
                    <div className="flex items-center gap-2">
                      {getDonateIcon(option.iconName)}
                      <span className="font-medium">{option.label}</span>
                    </div>
                    <ExternalLink className="w-3 h-3 text-content-muted" />
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Body Area - Swappable between Main List, Feature Settings and About View */}
      <div className="px-4 py-2.5 pb-3.5 flex-1 overflow-y-auto">
        {/* Universal PiP Active Banner */}
        {activePiP && currentView === "main" && (
          <div
            onClick={handleFocusPiPTab}
            title="Click to jump to this video tab"
            className="mb-2 py-1.5 px-2.5 rounded-lg bg-accent-subtle border border-accent/40 hover:border-accent transition-all cursor-pointer group flex items-center justify-between gap-2.5 shadow-lg shadow-black/20">
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <div className="p-1 text-accent group-hover:scale-105 transition-transform shrink-0">
                <PictureInPicture2 className="w-4 h-4 animate-pulse" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-[10px] font-bold uppercase tracking-wider text-accent leading-none">
                  Video in PiP Mode
                </span>
                <span className="text-xs font-semibold text-content-primary truncate mt-0.5 group-hover:text-accent transition-colors">
                  {activePiP.title}
                </span>
              </div>
            </div>

            <div className="flex items-center shrink-0">
              <button
                type="button"
                onClick={handleClosePiP}
                title="Exit Picture-in-Picture window"
                className="flex items-center gap-1.5 text-[11px] font-semibold text-content-secondary bg-app-elevated border border-border-subtle px-2.5 py-1 rounded-lg transition-all duration-150 hover:bg-rose-500 hover:text-white hover:border-rose-500 hover:shadow-md hover:shadow-rose-500/25 hover:scale-[1.02] active:scale-95 focus:outline-none focus:ring-2 focus:ring-rose-500/50">
                <X className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Exit PiP</span>
              </button>
            </div>
          </div>
        )}

        {currentView === "main" ? (
          <div>
            {/* PowerToys-style Utilities List with Dividers */}
            <main className="divide-y divide-border-divider">
              <AllowRightClickToggle onReady={() => setIsTabReady(true)} />
              <ContextMenuActionsToggle
                onConfigure={() =>
                  setCurrentView("context-menu-actions-settings")
                }
              />
              <SuperDragToggle
                onConfigure={() => setCurrentView("super-drag-settings")}
              />
              <QuickScrollToggle
                onConfigure={() => setCurrentView("quick-scroll-settings")}
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
              <ColorPickerToggle
                onConfigure={() => setCurrentView("color-picker-settings")}
              />
              <ElementZapperToggle
                onConfigure={() => setCurrentView("element-zapper-settings")}
              />
            </main>
          </div>
        ) : currentView === "context-menu-actions-settings" ? (
          <ContextMenuActionsSettingsView
            onBack={() => setCurrentView("main")}
          />
        ) : currentView === "super-drag-settings" ? (
          <SuperDragSettingsView onBack={() => setCurrentView("main")} />
        ) : currentView === "quick-scroll-settings" ? (
          <QuickScrollSettingsView onBack={() => setCurrentView("main")} />
        ) : currentView === "picture-in-picture-settings" ? (
          <PictureInPictureSettingsView onBack={() => setCurrentView("main")} />
        ) : currentView === "smooth-scroll-settings" ? (
          <SmoothScrollSettingsView onBack={() => setCurrentView("main")} />
        ) : currentView === "mouse-zoom-settings" ? (
          <MouseZoomSettingsView onBack={() => setCurrentView("main")} />
        ) : currentView === "color-picker-settings" ? (
          <ColorPickerSettingsView onBack={() => setCurrentView("main")} />
        ) : currentView === "element-zapper-settings" ? (
          <ElementZapperSettingsView onBack={() => setCurrentView("main")} />
        ) : currentView === "preferences" ? (
          <PreferencesSettingsView onBack={() => setCurrentView("main")} />
        ) : (
          <AboutView onBack={() => setCurrentView("main")} />
        )}
      </div>

      {/* Global Dialog Modal Host */}
      <GlobalDialogHost />
    </div>
  )
}

export default IndexPopup
