import {
  AlertTriangle,
  AppWindow,
  Check,
  ChevronRight,
  ExternalLink,
  Info,
  Sliders,
  Trash2,
  X
} from "lucide-react"
import { useEffect, useState } from "react"

import { useStorage } from "@plasmohq/storage/hook"

import { GlobalDialogHost } from "~components/GlobalDialogHost"
import { ShortcutBadge } from "~components/ShortcutBadge"
import { Switch } from "~components/Switch"
import { AppIcon } from "~core/assets"
import { isColorPickerSupported } from "~core/browserDetect"
import { FEATURE_CATALOG_LIST } from "~core/featureCatalog"
import { openExtensionPopup } from "~core/popupHelper"
import { openBrowserShortcutsPage } from "~core/shortcutsHelper"
import { clearAllExtensionData } from "~core/storage"
import {
  DEFAULT_SETTINGS,
  STORAGE_KEYS,
  getFeatureSettingsView,
  type FeatureKey,
  type FeatureSettings
} from "~core/types"

import "~style.css"

function OptionsPage() {
  const [settings, setSettings] = useStorage<FeatureSettings>(
    STORAGE_KEYS.SETTINGS,
    DEFAULT_SETTINGS
  )
  const [commands, setCommands] = useState<Record<string, string>>({})
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [isClearing, setIsClearing] = useState(false)
  const [showSuccessBanner, setShowSuccessBanner] = useState(false)

  // Track system dark mode preference
  const [systemPrefersDark, setSystemPrefersDark] = useState<boolean>(() => {
    return typeof window !== "undefined"
      ? (window.matchMedia?.("(prefers-color-scheme: dark)").matches ?? true)
      : true
  })

  useEffect(() => {
    if (typeof window === "undefined") return
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
    const handler = (e: MediaQueryListEvent) => setSystemPrefersDark(e.matches)
    mediaQuery.addEventListener("change", handler)
    return () => mediaQuery.removeEventListener("change", handler)
  }, [])

  // Dynamically load real shortcuts from browser
  const loadCommands = () => {
    if (typeof chrome !== "undefined" && chrome.commands?.getAll) {
      chrome.commands.getAll((cmdList) => {
        const map: Record<string, string> = {}
        for (const cmd of cmdList) {
          if (cmd.name) {
            map[cmd.name] = cmd.shortcut || ""
          }
        }
        setCommands(map)
      })
    }
  }

  useEffect(() => {
    loadCommands()
    // Re-check shortcuts when user focuses back to the tab after customizing
    window.addEventListener("focus", loadCommands)
    return () => window.removeEventListener("focus", loadCommands)
  }, [])

  // Listen for Escape key to close modal
  useEffect(() => {
    if (!showConfirmModal) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isClearing) {
        setShowConfirmModal(false)
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [showConfirmModal, isClearing])

  // Auto-dismiss success notification
  useEffect(() => {
    if (!showSuccessBanner) return
    const timer = setTimeout(() => setShowSuccessBanner(false), 5000)
    return () => clearTimeout(timer)
  }, [showSuccessBanner])

  const resolved = settings ?? DEFAULT_SETTINGS

  const activeThemeMode = resolved.theme ?? DEFAULT_SETTINGS.theme
  const isDark =
    activeThemeMode === "dark" ||
    (activeThemeMode === "system" && systemPrefersDark)
  const themeClass = isDark ? "theme-dark" : "theme-light"

  // Sync theme class to document element and body
  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.classList.remove("theme-dark", "theme-light")
      document.documentElement.classList.add(themeClass)
      document.body.className = `bg-app text-content-primary ${themeClass}`
    }
  }, [themeClass])

  const getFeatureShortcut = (key: FeatureKey): string | undefined => {
    switch (key) {
      case "pictureInPicture":
        return commands["toggle_picture_in_picture"]
      case "allowRightClick":
        return commands["toggle_allow_right_click"]
      case "elementToys":
        return commands["toggle_element_toys"]
      case "colorPicker":
        return commands["toggle_color_picker"]
      case "quickHub":
        return commands["toggle_quick_hub"]
      default:
        return undefined
    }
  }

  const formatModifier = (mod?: string): string => {
    if (!mod) return ""
    switch (mod.toLowerCase()) {
      case "shift":
        return "Shift"
      case "alt":
        return "Alt"
      case "ctrl":
        return "Ctrl"
      case "ctrl+shift":
        return "Ctrl + Shift"
      case "ctrl+alt":
        return "Ctrl + Alt"
      case "alt+shift":
        return "Alt + Shift"
      case "left-click":
        return "Left Click"
      case "right-click":
        return "Right Click"
      default:
        return mod
    }
  }

  const handleToggle = (key: FeatureKey) => {
    const isCurrentlyEnabled = resolved[key] ?? true
    const nextVal = !isCurrentlyEnabled
    setSettings((prev) => ({
      ...(prev ?? DEFAULT_SETTINGS),
      [key]: nextVal
    }))
  }

  const handleReset = () => {
    setSettings(DEFAULT_SETTINGS)
  }

  const handleClearAllData = async () => {
    setIsClearing(true)
    try {
      await clearAllExtensionData()
      await setSettings(DEFAULT_SETTINGS)
      loadCommands()
      setShowConfirmModal(false)
      setShowSuccessBanner(true)
    } catch (err) {
      console.error("Failed to wipe extension data:", err)
    } finally {
      setIsClearing(false)
    }
  }

  return (
    <div className={`min-h-screen bg-app text-content-primary font-sans antialiased p-8 select-none transition-colors duration-150 ${themeClass}`}>
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-border-divider gap-4">
          <div className="flex items-center gap-3.5">
            <AppIcon className="w-12 h-12 rounded-2xl object-contain shadow-xl shadow-indigo-500/20 ring-1 ring-white/20 shrink-0" />
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-content-primary">
                Browse Assist Settings
              </h1>
              <p className="text-sm text-content-muted mt-0.5">
                Configure your browsing quality-of-life toolkit and shortcuts
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Open Popup Button */}
            <button
              type="button"
              onClick={() => openExtensionPopup("main")}
              title="Open extension popup"
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-content-secondary bg-app-surface hover:bg-app-surface-hover hover:text-content-primary border border-border-subtle rounded-xl transition-all shadow-sm cursor-pointer">
              <AppWindow className="w-3.5 h-3.5 text-accent" />
              <span>Open Popup</span>
            </button>

            {/* View Preferences Button */}
            <button
              type="button"
              onClick={() => openExtensionPopup("preferences")}
              title="Open extension preferences in popup"
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-content-secondary bg-app-surface hover:bg-app-surface-hover hover:text-content-primary border border-border-subtle rounded-xl transition-all shadow-sm cursor-pointer">
              <Sliders className="w-3.5 h-3.5 text-indigo-400" />
              <span>Preferences</span>
            </button>

            {/* View About Button */}
            <button
              type="button"
              onClick={() => openExtensionPopup("about")}
              title="Open about information in popup"
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-content-secondary bg-app-surface hover:bg-app-surface-hover hover:text-content-primary border border-border-subtle rounded-xl transition-all shadow-sm cursor-pointer">
              <Info className="w-3.5 h-3.5 text-sky-400" />
              <span>About</span>
            </button>

            {/* Reset to Defaults */}
            {/* <button
              type="button"
              onClick={handleReset}
              className="px-3 py-1.5 text-xs font-semibold text-content-secondary bg-app-surface hover:bg-app-surface-hover hover:text-content-primary border border-border-subtle rounded-xl transition-all shadow-sm cursor-pointer">
              Reset to Defaults
            </button> */}
          </div>
        </header>

        {/* Feature List */}
        <section className="mt-8 space-y-4">
          <h2 className="text-base font-semibold text-content-primary">
            Active Modules
          </h2>

          <div className="grid gap-3.5">
            {FEATURE_CATALOG_LIST.map((feature) => {
              const isEnabled = resolved[feature.key]
              const IconComp = feature.icon
              const iconColor = feature.colorClass
              const shortcut = getFeatureShortcut(feature.key)
              const settingsView = getFeatureSettingsView(feature.key)
              const hasSettings = Boolean(feature.hasSettings && settingsView)

              const handleCardClick = () => {
                if (hasSettings && settingsView) {
                  openExtensionPopup(settingsView)
                } else {
                  handleToggle(feature.key)
                }
              }

              return (
                <div
                  key={feature.key}
                  className={`p-5 rounded-2xl border transition-all select-none group ${
                    isEnabled
                      ? "bg-app-surface border-border-subtle shadow-md"
                      : "bg-app-surface/40 border-border-divider/60 opacity-60"
                  }`}>
                  <div className="flex items-start justify-between gap-4">
                    {/* Clickable info area */}
                    <div
                      onClick={handleCardClick}
                      className="flex items-start gap-4 flex-1 min-w-0 cursor-pointer">
                      <div className="shrink-0 mt-2 group-hover:scale-105 transition-transform">
                        <IconComp className={`w-7 h-7 ${iconColor}`} />
                      </div>
                      <div className="flex flex-col min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-base font-semibold text-content-primary group-hover:text-accent transition-colors">
                            {feature.title}
                          </h3>
                          {shortcut !== undefined && (
                            <div onClick={(e) => e.stopPropagation()}>
                              <ShortcutBadge shortcut={shortcut} />
                            </div>
                          )}
                        </div>
                        <p className="text-sm text-content-muted mt-1 leading-relaxed">
                          {feature.description}
                        </p>
                      </div>
                    </div>

                    {/* Action area: Chevron Right (if sub-settings available) + Switch */}
                    <div className="flex items-center gap-2.5 shrink-0 mt-0.5">
                      {hasSettings && (
                        <button
                          type="button"
                          title={`Configure ${feature.title} in popup`}
                          onClick={(e) => {
                            e.stopPropagation()
                            if (settingsView) openExtensionPopup(settingsView)
                          }}
                          className="p-1.5 rounded-xl text-content-muted hover:text-content-primary hover:bg-app-elevated active:scale-95 transition-all focus:outline-none cursor-pointer">
                          <ChevronRight className="w-5 h-5" />
                        </button>
                      )}

                      <div onClick={(e) => e.stopPropagation()}>
                        <Switch
                          checked={isEnabled}
                          onChange={() => handleToggle(feature.key)}
                          size="md"
                          aria-label={`Toggle ${feature.title}`}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        {/* Shortcuts Reference Table */}
        <section className="mt-10 p-6 rounded-2xl bg-app-surface border border-border-subtle">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-semibold text-content-primary">
                Keyboard &amp; Mouse Shortcuts Reference
              </h2>
              <p className="text-xs text-content-muted mt-0.5">
                Real-time browser hotkeys and interactive gesture triggers
              </p>
            </div>
            <button
              type="button"
              onClick={() => openBrowserShortcutsPage().catch(() => {})}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-accent bg-accent-subtle hover:bg-accent-glow active:scale-[0.98] border border-accent/30 rounded-xl transition-all shadow-sm">
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Customize Shortcuts</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-border-divider text-xs font-semibold text-content-muted uppercase tracking-wider">
                  <th className="pb-3">Action</th>
                  <th className="pb-3">Shortcut / Trigger</th>
                  <th className="pb-3">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-divider text-content-secondary">
                {/* 1. Universal Picture-in-Picture */}
                <tr>
                  <td className="py-3 font-medium text-content-primary">
                    Universal Picture-in-Picture
                  </td>
                  <td className="py-3">
                    <ShortcutBadge shortcut={commands["toggle_picture_in_picture"]} />
                  </td>
                  <td className="py-3 text-content-muted text-xs">
                    Detach currently playing video into a floating PiP window
                  </td>
                </tr>

                {/* 2. Allow Right Click */}
                <tr>
                  <td className="py-3 font-medium text-content-primary">
                    Allow Right Click
                  </td>
                  <td className="py-3">
                    <ShortcutBadge shortcut={commands["toggle_allow_right_click"]} />
                  </td>
                  <td className="py-3 text-content-muted text-xs">
                    Toggle unblocking context menus and text copying on active tab
                  </td>
                </tr>

                {/* 3. Element Toys */}
                <tr>
                  <td className="py-3 font-medium text-content-primary">
                    Element Toys
                  </td>
                  <td className="py-3">
                    <ShortcutBadge shortcut={commands["toggle_element_toys"]} />
                  </td>
                  <td className="py-3 text-content-muted text-xs">
                    Activate point-and-click targeting to zap, edit, hide, or move elements
                  </td>
                </tr>

                {/* 4. Color Picker (Chromium only) */}
                {isColorPickerSupported && (
                  <tr>
                    <td className="py-3 font-medium text-content-primary">
                      Color Picker
                    </td>
                    <td className="py-3">
                      <ShortcutBadge shortcut={commands["toggle_color_picker"]} />
                    </td>
                    <td className="py-3 text-content-muted text-xs">
                      Activate screen eyedropper magnifier to inspect and copy color codes
                    </td>
                  </tr>
                )}

                {/* 5. Quick Hub Menu Hotkey */}
                <tr>
                  <td className="py-3 font-medium text-content-primary">
                    Quick Hub Shortcut
                  </td>
                  <td className="py-3">
                    <ShortcutBadge shortcut={commands["toggle_quick_hub"]} />
                  </td>
                  <td className="py-3 text-content-muted text-xs">
                    Toggle on-screen Quick Hub floating menu launcher via keyboard
                  </td>
                </tr>

                {/* 6. Video Volume Control */}
                <tr>
                  <td className="py-3 font-medium text-content-primary">
                    Video Volume Control
                  </td>
                  <td className="py-3">
                    <kbd className="badge-kbd">
                      {formatModifier(resolved.videoWheelControlConfig.volumeModifier)} + Mouse Wheel
                    </kbd>
                  </td>
                  <td className="py-3 text-content-muted text-xs">
                    Hover over video to adjust volume; click with modifier to mute
                  </td>
                </tr>

                {/* 7. Video Speed Control */}
                <tr>
                  <td className="py-3 font-medium text-content-primary">
                    Video Speed Control
                  </td>
                  <td className="py-3">
                    <kbd className="badge-kbd">
                      {formatModifier(resolved.videoWheelControlConfig.speedModifier)} + Mouse Wheel
                    </kbd>
                  </td>
                  <td className="py-3 text-content-muted text-xs">
                    Hover over video to adjust playback speed smoothly; click for fullscreen
                  </td>
                </tr>

                {/* 8. Video Seek & Frame Stepper */}
                <tr>
                  <td className="py-3 font-medium text-content-primary">
                    Video Seeking &amp; Stepper
                  </td>
                  <td className="py-3">
                    <kbd className="badge-kbd">
                      {formatModifier(resolved.videoWheelControlConfig.seekModifier)} + Mouse Wheel
                    </kbd>
                  </td>
                  <td className="py-3 text-content-muted text-xs">
                    Seek backward/forward; frame-by-frame stepper when paused
                  </td>
                </tr>

                {/* 9. Video Boost Speed */}
                <tr>
                  <td className="py-3 font-medium text-content-primary">
                    Video Speed Boost
                  </td>
                  <td className="py-3">
                    <kbd className="badge-kbd">Hold X</kbd>
                  </td>
                  <td className="py-3 text-content-muted text-xs">
                    Hold X key over video to temporarily boost speed to {resolved.videoWheelControlConfig.boostSpeed}x
                  </td>
                </tr>

                {/* 10. Mouse Pin-to-Zoom */}
                <tr>
                  <td className="py-3 font-medium text-content-primary">
                    Mouse Pin-to-Zoom
                  </td>
                  <td className="py-3">
                    <kbd className="badge-kbd">
                      {formatModifier(resolved.mouseZoomConfig.modifier)} + Mouse Wheel
                    </kbd>
                  </td>
                  <td className="py-3 text-content-muted text-xs">
                    Fluidly zoom page centered directly at cursor position
                  </td>
                </tr>

                {/* 11. Super Drag */}
                <tr>
                  <td className="py-3 font-medium text-content-primary">
                    Super Drag
                  </td>
                  <td className="py-3">
                    <kbd className="badge-kbd">Mouse Drag</kbd>
                  </td>
                  <td className="py-3 text-content-muted text-xs">
                    Drag text to search in new tab; drag link to open in background tab
                  </td>
                </tr>

                {/* 12. Quick Scroll */}
                <tr>
                  <td className="py-3 font-medium text-content-primary">
                    Quick Scroll
                  </td>
                  <td className="py-3">
                    <kbd className="badge-kbd">Double Click Margin</kbd>
                  </td>
                  <td className="py-3 text-content-muted text-xs">
                    Double-click screen edge margins or click floating buttons to jump to top or bottom
                  </td>
                </tr>

                {/* 13. Smooth Scrolling */}
                <tr>
                  <td className="py-3 font-medium text-content-primary">
                    Smooth Scrolling
                  </td>
                  <td className="py-3">
                    <kbd className="badge-kbd">Mouse Wheel</kbd>
                  </td>
                  <td className="py-3 text-content-muted text-xs">
                    Inertial physics interpolation across all scrollable containers
                  </td>
                </tr>

                {/* 14. Clean Link & Markdown Copy */}
                <tr>
                  <td className="py-3 font-medium text-content-primary">
                    Clean Link Copy
                  </td>
                  <td className="py-3">
                    <kbd className="badge-kbd">Right Click Link</kbd>
                  </td>
                  <td className="py-3 text-content-muted text-xs">
                    Strip tracking queries (utm_*, fbclid) and copy clean or markdown link
                  </td>
                </tr>

                {/* 15. Quick Hub Trigger Zone */}
                <tr>
                  <td className="py-3 font-medium text-content-primary">
                    Quick Hub Trigger Zone
                  </td>
                  <td className="py-3">
                    <kbd className="badge-kbd">
                      Hover {formatModifier(resolved.quickHubConfig.corner)}
                    </kbd>
                  </td>
                  <td className="py-3 text-content-muted text-xs">
                    Hover screen trigger zone to expand in-page quick tools launcher
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Storage Management & Danger Zone */}
        <section className="mt-10 p-6 rounded-2xl bg-rose-500/5 border border-rose-500/20">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h2 className="text-base font-semibold text-content-primary">
                  Extension Storage &amp; Data
                </h2>
              </div>
              <p className="text-xs text-content-muted leading-relaxed max-w-xl">
                Permanently erase all data and settings saved by Browse Assist in your browser. This will wipe your custom configurations, shortcut preferences, Quick Hub order, and Color Picker history.
              </p>
            </div>

            <div className="shrink-0">
              <button
                type="button"
                onClick={() => setShowConfirmModal(true)}
                className="flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-rose-500 bg-rose-500/10 hover:bg-rose-500/20 active:bg-rose-500/30 border border-rose-500/30 hover:border-rose-500/50 rounded-xl transition-all shadow-sm">
                <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                <span>Clear All Data...</span>
              </button>
            </div>
          </div>

          {/* Success Banner */}
          {showSuccessBanner && (
            <div className="mt-4 flex items-center justify-between p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 text-xs animate-in fade-in duration-150">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>All extension data has been wiped and reset to factory defaults.</span>
              </div>
              <button
                type="button"
                onClick={() => setShowSuccessBanner(false)}
                className="p-1 hover:bg-emerald-500/20 rounded-lg text-emerald-500 transition-colors">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </section>

        {/* Footer */}
        <footer className="mt-10 pt-6 border-t border-border-divider text-center text-xs text-content-faint">
          Browse Assist • Manifest V3 • Built with Plasmo, React &amp; Tailwind CSS
        </footer>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150"
          onClick={() => !isClearing && setShowConfirmModal(false)}>
          <div
            className="w-full max-w-md rounded-2xl bg-app-elevated border border-border-subtle shadow-2xl p-6 space-y-4 animate-in zoom-in-95 duration-150 select-text"
            onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start gap-3.5">
              <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-500 shrink-0 mt-0.5">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-content-primary tracking-tight">
                  Clear all extension data?
                </h3>
                <p className="text-xs text-content-muted mt-1 leading-relaxed">
                  This will permanently delete all data stored by Browse Assist across your browser profile.
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-app-surface border border-border-subtle text-xs text-content-muted space-y-2">
              <div className="font-semibold text-content-primary">
                The following will be deleted:
              </div>
              <ul className="list-disc list-inside space-y-1 pl-1 text-content-muted">
                <li>All active feature toggle states &amp; sub-configurations</li>
                <li>Quick Hub ordering, pinned actions &amp; hidden modules</li>
                <li>Color history in Eyedropper Color Picker</li>
                <li>Theme preferences and popup navigation memory</li>
              </ul>
            </div>

            <div className="text-xs text-amber-500 font-medium">
              ⚠️ This action cannot be undone. All settings will immediately revert to factory defaults.
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-border-divider">
              <button
                type="button"
                disabled={isClearing}
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2 text-xs font-semibold text-content-secondary bg-app-surface hover:bg-app-surface-hover hover:text-content-primary border border-border-subtle rounded-xl transition-all disabled:opacity-50">
                Cancel
              </button>
              <button
                type="button"
                disabled={isClearing}
                onClick={handleClearAllData}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-500 active:bg-rose-700 rounded-xl transition-all shadow-md shadow-rose-900/30 disabled:opacity-50">
                {isClearing ? (
                  <span>Clearing data...</span>
                ) : (
                  <>
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Yes, Delete All Data</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Global Dialog Host for Firefox shortcut guide & modal popups */}
      <GlobalDialogHost />
    </div>
  )
}

export default OptionsPage
