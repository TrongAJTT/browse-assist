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
import {
  FEATURE_CATALOG_LIST,
  getLocalizedFeatureMeta
} from "~core/featureCatalog"
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
import { useI18n } from "~core/useI18n"

import "~style.css"

function OptionsPage() {
  const { t } = useI18n()

  useEffect(() => {
    document.title = t("options.title")
  }, [t])
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
                {t("options.title")}
              </h1>
              <p className="text-sm text-content-muted mt-0.5">
                {t("options.subtitle")}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Open Popup Button */}
            <button
              type="button"
              onClick={() => openExtensionPopup("main")}
              title={t("options.openPopupTip")}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-content-secondary bg-app-surface hover:bg-app-surface-hover hover:text-content-primary border border-border-subtle rounded-xl transition-all shadow-sm cursor-pointer">
              <AppWindow className="w-3.5 h-3.5 text-accent" />
              <span>{t("options.openPopup")}</span>
            </button>

            {/* View Preferences Button */}
            <button
              type="button"
              onClick={() => openExtensionPopup("preferences")}
              title={t("options.preferencesTip")}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-content-secondary bg-app-surface hover:bg-app-surface-hover hover:text-content-primary border border-border-subtle rounded-xl transition-all shadow-sm cursor-pointer">
              <Sliders className="w-3.5 h-3.5 text-indigo-400" />
              <span>{t("options.preferences")}</span>
            </button>

            {/* View About Button */}
            <button
              type="button"
              onClick={() => openExtensionPopup("about")}
              title={t("options.aboutTip")}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-content-secondary bg-app-surface hover:bg-app-surface-hover hover:text-content-primary border border-border-subtle rounded-xl transition-all shadow-sm cursor-pointer">
              <Info className="w-3.5 h-3.5 text-sky-400" />
              <span>{t("options.about")}</span>
            </button>


          </div>
        </header>

        {/* Feature List */}
        <section className="mt-8 space-y-4">
          <h2 className="text-base font-semibold text-content-primary">
            {t("options.activeModules")}
          </h2>

          <div className="grid gap-3.5">
            {FEATURE_CATALOG_LIST.map((rawFeature) => {
              const feature = getLocalizedFeatureMeta(rawFeature.key, t)
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
                          title={t("options.configureInPopup", {
                            feature: feature.title
                          })}
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
                          aria-label={t("common.toggleFeatureAria", {
                            feature: feature.title
                          })}
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
                {t("options.shortcutsTitle")}
              </h2>
              <p className="text-xs text-content-muted mt-0.5">
                {t("options.shortcutsSubtitle")}
              </p>
            </div>
            <button
              type="button"
              onClick={() => openBrowserShortcutsPage().catch(() => {})}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-accent bg-accent-subtle hover:bg-accent-glow active:scale-[0.98] border border-accent/30 rounded-xl transition-all shadow-sm">
              <ExternalLink className="w-3.5 h-3.5" />
              <span>{t("options.customizeShortcuts")}</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-border-divider text-xs font-semibold text-content-muted uppercase tracking-wider">
                  <th className="pb-3">{t("options.table.action")}</th>
                  <th className="pb-3">{t("options.table.shortcut")}</th>
                  <th className="pb-3">{t("options.table.description")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-divider text-content-secondary">
                {/* 1. Universal Picture-in-Picture */}
                <tr>
                  <td className="py-3 font-medium text-content-primary">
                    {t("options.shortcuts.pip.name")}
                  </td>
                  <td className="py-3">
                    <ShortcutBadge shortcut={commands["toggle_picture_in_picture"]} />
                  </td>
                  <td className="py-3 text-content-muted text-xs">
                    {t("options.shortcuts.pip.desc")}
                  </td>
                </tr>

                {/* 2. Allow Right Click */}
                <tr>
                  <td className="py-3 font-medium text-content-primary">
                    {t("options.shortcuts.allowRightClick.name")}
                  </td>
                  <td className="py-3">
                    <ShortcutBadge shortcut={commands["toggle_allow_right_click"]} />
                  </td>
                  <td className="py-3 text-content-muted text-xs">
                    {t("options.shortcuts.allowRightClick.desc")}
                  </td>
                </tr>

                {/* 3. Element Toys */}
                <tr>
                  <td className="py-3 font-medium text-content-primary">
                    {t("options.shortcuts.elementToys.name")}
                  </td>
                  <td className="py-3">
                    <ShortcutBadge shortcut={commands["toggle_element_toys"]} />
                  </td>
                  <td className="py-3 text-content-muted text-xs">
                    {t("options.shortcuts.elementToys.desc")}
                  </td>
                </tr>

                {/* 4. Color Picker (Chromium only) */}
                {isColorPickerSupported && (
                  <tr>
                    <td className="py-3 font-medium text-content-primary">
                      {t("options.shortcuts.colorPicker.name")}
                    </td>
                    <td className="py-3">
                      <ShortcutBadge shortcut={commands["toggle_color_picker"]} />
                    </td>
                    <td className="py-3 text-content-muted text-xs">
                      {t("options.shortcuts.colorPicker.desc")}
                    </td>
                  </tr>
                )}

                {/* 5. Quick Hub Menu Hotkey */}
                <tr>
                  <td className="py-3 font-medium text-content-primary">
                    {t("options.shortcuts.quickHub.name")}
                  </td>
                  <td className="py-3">
                    <ShortcutBadge shortcut={commands["toggle_quick_hub"]} />
                  </td>
                  <td className="py-3 text-content-muted text-xs">
                    {t("options.shortcuts.quickHub.desc")}
                  </td>
                </tr>

                {/* 6. Video Volume Control */}
                <tr>
                  <td className="py-3 font-medium text-content-primary">
                    {t("options.shortcuts.volume.name")}
                  </td>
                  <td className="py-3">
                    <kbd className="badge-kbd">
                      {t("options.triggers.mouseWheel", {
                        modifier: formatModifier(
                          resolved.videoWheelControlConfig.volumeModifier
                        )
                      })}
                    </kbd>
                  </td>
                  <td className="py-3 text-content-muted text-xs">
                    {t("options.shortcuts.volume.desc")}
                  </td>
                </tr>

                {/* 7. Video Speed Control */}
                <tr>
                  <td className="py-3 font-medium text-content-primary">
                    {t("options.shortcuts.speed.name")}
                  </td>
                  <td className="py-3">
                    <kbd className="badge-kbd">
                      {t("options.triggers.mouseWheel", {
                        modifier: formatModifier(
                          resolved.videoWheelControlConfig.speedModifier
                        )
                      })}
                    </kbd>
                  </td>
                  <td className="py-3 text-content-muted text-xs">
                    {t("options.shortcuts.speed.desc")}
                  </td>
                </tr>

                {/* 8. Video Seek & Frame Stepper */}
                <tr>
                  <td className="py-3 font-medium text-content-primary">
                    {t("options.shortcuts.seek.name")}
                  </td>
                  <td className="py-3">
                    <kbd className="badge-kbd">
                      {t("options.triggers.mouseWheel", {
                        modifier: formatModifier(
                          resolved.videoWheelControlConfig.seekModifier
                        )
                      })}
                    </kbd>
                  </td>
                  <td className="py-3 text-content-muted text-xs">
                    {t("options.shortcuts.seek.desc")}
                  </td>
                </tr>

                {/* 9. Video Boost Speed */}
                <tr>
                  <td className="py-3 font-medium text-content-primary">
                    {t("options.shortcuts.boost.name")}
                  </td>
                  <td className="py-3">
                    <kbd className="badge-kbd">{"X"}</kbd>
                  </td>
                  <td className="py-3 text-content-muted text-xs">
                    {t("options.shortcuts.boost.desc", {
                      speed: resolved.videoWheelControlConfig.boostSpeed
                    })}
                  </td>
                </tr>

                {/* 10. Mouse Pin-to-Zoom */}
                <tr>
                  <td className="py-3 font-medium text-content-primary">
                    {t("options.shortcuts.mouseZoom.name")}
                  </td>
                  <td className="py-3">
                    <kbd className="badge-kbd">
                      {t("options.triggers.mouseWheel", {
                        modifier: formatModifier(
                          resolved.mouseZoomConfig.modifier
                        )
                      })}
                    </kbd>
                  </td>
                  <td className="py-3 text-content-muted text-xs">
                    {t("options.shortcuts.mouseZoom.desc")}
                  </td>
                </tr>

                {/* 11. Super Drag */}
                <tr>
                  <td className="py-3 font-medium text-content-primary">
                    {t("options.shortcuts.superDrag.name")}
                  </td>
                  <td className="py-3">
                    <kbd className="badge-kbd">
                      {t("options.triggers.mouseDrag")}
                    </kbd>
                  </td>
                  <td className="py-3 text-content-muted text-xs">
                    {t("options.shortcuts.superDrag.desc")}
                  </td>
                </tr>

                {/* 12. Quick Scroll */}
                <tr>
                  <td className="py-3 font-medium text-content-primary">
                    {t("options.shortcuts.quickScroll.name")}
                  </td>
                  <td className="py-3">
                    <kbd className="badge-kbd">
                      {t("options.triggers.doubleClickMargin")}
                    </kbd>
                  </td>
                  <td className="py-3 text-content-muted text-xs">
                    {t("options.shortcuts.quickScroll.desc")}
                  </td>
                </tr>

                {/* 13. Smooth Scrolling */}
                <tr>
                  <td className="py-3 font-medium text-content-primary">
                    {t("options.shortcuts.smoothScroll.name")}
                  </td>
                  <td className="py-3">
                    <kbd className="badge-kbd">
                      {t("options.triggers.mouseWheel", { modifier: "🖱" })}
                    </kbd>
                  </td>
                  <td className="py-3 text-content-muted text-xs">
                    {t("options.shortcuts.smoothScroll.desc")}
                  </td>
                </tr>

                {/* 14. Clean Link & Markdown Copy */}
                <tr>
                  <td className="py-3 font-medium text-content-primary">
                    {t("options.shortcuts.cleanLink.name")}
                  </td>
                  <td className="py-3">
                    <kbd className="badge-kbd">
                      {t("options.triggers.rightClickLink")}
                    </kbd>
                  </td>
                  <td className="py-3 text-content-muted text-xs">
                    {t("options.shortcuts.cleanLink.desc")}
                  </td>
                </tr>

                {/* 15. Quick Hub Trigger Zone */}
                <tr>
                  <td className="py-3 font-medium text-content-primary">
                    {t("options.shortcuts.quickHubZone.name")}
                  </td>
                  <td className="py-3">
                    <kbd className="badge-kbd">
                      {formatModifier(resolved.quickHubConfig.corner)}
                    </kbd>
                  </td>
                  <td className="py-3 text-content-muted text-xs">
                    {t("options.shortcuts.quickHubZone.desc")}
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
                  {t("options.storage.title")}
                </h2>
              </div>
              <p className="text-xs text-content-muted leading-relaxed max-w-xl">
                {t("options.storage.desc")}
              </p>
            </div>

            <div className="shrink-0">
              <button
                type="button"
                onClick={() => setShowConfirmModal(true)}
                className="flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-rose-500 bg-rose-500/10 hover:bg-rose-500/20 active:bg-rose-500/30 border border-rose-500/30 hover:border-rose-500/50 rounded-xl transition-all shadow-sm">
                <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                <span>{t("options.storage.clearAll")}</span>
              </button>
            </div>
          </div>

          {/* Success Banner */}
          {showSuccessBanner && (
            <div className="mt-4 flex items-center justify-between p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 text-xs animate-in fade-in duration-150">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>{t("options.storage.cleared")}</span>
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
          {t("options.storage.footer")}
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
                  {t("options.modal.title")}
                </h3>
                <p className="text-xs text-content-muted mt-1 leading-relaxed">
                  {t("options.modal.body")}
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-app-surface border border-border-subtle text-xs text-content-muted space-y-2">
              <div className="font-semibold text-content-primary">
                {t("options.modal.listHeader")}
              </div>
              <ul className="list-disc list-inside space-y-1 pl-1 text-content-muted">
                <li>{t("options.modal.item1")}</li>
                <li>{t("options.modal.item2")}</li>
                <li>{t("options.modal.item3")}</li>
                <li>{t("options.modal.item4")}</li>
              </ul>
            </div>

            <div className="text-xs text-amber-500 font-medium">
              {t("options.modal.warning")}
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-border-divider">
              <button
                type="button"
                disabled={isClearing}
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2 text-xs font-semibold text-content-secondary bg-app-surface hover:bg-app-surface-hover hover:text-content-primary border border-border-subtle rounded-xl transition-all disabled:opacity-50">
                {t("common.cancel")}
              </button>
              <button
                type="button"
                disabled={isClearing}
                onClick={handleClearAllData}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-500 active:bg-rose-700 rounded-xl transition-all shadow-md shadow-rose-900/30 disabled:opacity-50">
                {isClearing ? (
                  <span>{t("options.modal.clearing")}</span>
                ) : (
                  <>
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>{t("options.modal.confirm")}</span>
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
