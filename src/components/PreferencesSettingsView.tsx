import {
  ChevronDown,
  Compass,
  ExternalLink,
  Globe,
  History,
  Laptop,
  LayoutGrid,
  List,
  Moon,
  Palette,
  Search,
  Sliders,
  Sparkles,
  Sun,
  Zap
} from "lucide-react"
import React, { useEffect, useMemo, useRef, useState } from "react"

import { useStorage } from "@plasmohq/storage/hook"

import {
  SelectDropdown,
  type SelectDropdownOption
} from "~components/SelectDropdown"
import { Slider } from "~components/Slider"
import {
  SortableVisibilityList,
  type SortableVisibilityItem
} from "~components/SortableVisibilityList"
import { SubSettingsLayout } from "~components/SubSettingsLayout"
import { Switch } from "~components/Switch"
import { isColorPickerSupported } from "~core/browserDetect"
import {
  FEATURE_CATALOG,
  getLocalizedFeatureMeta
} from "~core/featureCatalog"
import { useI18n } from "~core/useI18n"
import {
  DEFAULT_FEATURE_LAYOUT_CONFIG,
  DEFAULT_POPUP_NAVIGATION_CONFIG,
  DEFAULT_SETTINGS,
  STORAGE_KEYS,
  normalizeFeatureHidden,
  normalizeFeatureOrder,
  type FeatureKey,
  type FeatureSettings,
  type LanguageCode,
  type ThemeMode,
  type ViewMode
} from "~core/types"

interface PreferencesSettingsViewProps {
  onBack: () => void
}

const THEME_OPTIONS: SelectDropdownOption<ThemeMode>[] = [
  {
    id: "dark",
    label: "Dark",
    icon: <Moon className="w-3.5 h-3.5" />
  },
  {
    id: "light",
    label: "Light",
    icon: <Sun className="w-3.5 h-3.5" />
  },
  {
    id: "system",
    label: "System",
    icon: <Laptop className="w-3.5 h-3.5" />
  }
]

const VIEW_MODE_OPTIONS: SelectDropdownOption<ViewMode>[] = [
  {
    id: "list",
    label: "List",
    icon: <List className="w-3.5 h-3.5" />
  },
  {
    id: "grid",
    label: "Grid",
    icon: <LayoutGrid className="w-3.5 h-3.5" />
  }
]

/**
 * Preferences / General Settings view.
 * Configures appearance theme mode, menu order/visibility, and popup navigation memory.
 */
export const PreferencesSettingsView: React.FC<
  PreferencesSettingsViewProps
> = ({ onBack }) => {
  const { t, locale } = useI18n()
  const [settings, setSettings] = useStorage<FeatureSettings>(
    STORAGE_KEYS.SETTINGS,
    DEFAULT_SETTINGS
  )

  const [isPresetMenuOpen, setIsPresetMenuOpen] = useState(false)
  const presetMenuRef = useRef<HTMLDivElement | null>(null)

  // Close preset menu on click outside
  useEffect(() => {
    if (!isPresetMenuOpen) return
    const handleClickOutside = (e: MouseEvent) => {
      if (
        presetMenuRef.current &&
        !presetMenuRef.current.contains(e.target as Node)
      ) {
        setIsPresetMenuOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [isPresetMenuOpen])

  const currentTheme = settings?.theme ?? DEFAULT_SETTINGS.theme
  const currentViewMode: ViewMode =
    settings?.viewMode ?? DEFAULT_SETTINGS.viewMode ?? "list"
  const currentLayout =
    settings?.featureLayout ?? DEFAULT_SETTINGS.featureLayout
  const currentNav =
    settings?.popupNavigation ?? DEFAULT_SETTINGS.popupNavigation

  // Ensure all known features exist in order array (in case new features were added)
  const order: FeatureKey[] = React.useMemo(() => {
    const fullOrder = normalizeFeatureOrder(currentLayout?.order)
    return fullOrder.filter(
      (k) => k !== "colorPicker" || isColorPickerSupported
    )
  }, [currentLayout?.order])

  const hiddenSet = React.useMemo(
    () => new Set(normalizeFeatureHidden(currentLayout?.hidden)),
    [currentLayout?.hidden]
  )

  const handleSelectTheme = (theme: ThemeMode) => {
    setSettings((prev) => ({
      ...(prev ?? DEFAULT_SETTINGS),
      theme
    }))
  }

  const handleSelectViewMode = (viewMode: ViewMode) => {
    setSettings((prev) => ({
      ...(prev ?? DEFAULT_SETTINGS),
      viewMode
    }))
  }

  const handleToggleVisibility = (key: FeatureKey) => {
    const isCurrentlyHidden = hiddenSet.has(key)
    const currentHiddenList = normalizeFeatureHidden(currentLayout?.hidden)
    const newHidden = isCurrentlyHidden
      ? currentHiddenList.filter((k) => k !== key)
      : [...currentHiddenList, key]

    setSettings((prev) => ({
      ...(prev ?? DEFAULT_SETTINGS),
      featureLayout: {
        ...(prev?.featureLayout ?? DEFAULT_SETTINGS.featureLayout),
        order,
        hidden: newHidden
      }
    }))
  }

  const handleResetLayout = () => {
    setIsPresetMenuOpen(false)
    setSettings((prev) => ({
      ...(prev ?? DEFAULT_SETTINGS),
      featureLayout: DEFAULT_FEATURE_LAYOUT_CONFIG
    }))
  }

  const handleApplyPreset = (preset: "reading" | "designer" | "essential") => {
    setIsPresetMenuOpen(false)

    let newOrder: FeatureKey[] = [...DEFAULT_FEATURE_LAYOUT_CONFIG.order]
    let newHidden: FeatureKey[] = []

    if (preset === "reading") {
      // Prioritize navigation, reading, uncluttering
      newOrder = [
        "allowRightClick",
        "quickScroll",
        "smoothScroll",
        "superDrag",
        "contextMenuActions",
        "pictureInPicture",
        "mouseZoom",
        "elementToys",
        "colorPicker"
      ]
      // Show reading & navigation tools, hide heavy inspection tools
      newHidden = ["colorPicker", "elementToys"]
    } else if (preset === "designer") {
      // Prioritize design, inspect, layout tinkering
      newOrder = [
        "allowRightClick",
        "colorPicker",
        "elementToys",
        "contextMenuActions",
        "mouseZoom",
        "superDrag",
        "quickScroll",
        "smoothScroll",
        "pictureInPicture"
      ]
      newHidden = []
    } else if (preset === "essential") {
      // Minimalist: only core essential utilities
      newOrder = [
        "allowRightClick",
        "superDrag",
        "contextMenuActions",
        "quickScroll",
        "pictureInPicture",
        "smoothScroll",
        "mouseZoom",
        "colorPicker",
        "elementToys"
      ]
      newHidden = [
        "mouseZoom",
        "colorPicker",
        "elementToys",
        "smoothScroll"
      ]
    }

    setSettings((prev) => ({
      ...(prev ?? DEFAULT_SETTINGS),
      featureLayout: {
        order: newOrder,
        hidden: newHidden
      }
    }))
  }

  const listItems: SortableVisibilityItem<FeatureKey>[] = useMemo(() => {
    void locale
    return order
      .map((key): SortableVisibilityItem<FeatureKey> | null => {
        const base = FEATURE_CATALOG[key]
        if (!base) return null
        const item = getLocalizedFeatureMeta(key)
        return {
          id: key,
          title: item.title,
          description: item.description,
          icon: item.icon,
          colorClass: item.colorClass,
          isHidden: hiddenSet.has(key)
        }
      })
      .filter(
        (item): item is SortableVisibilityItem<FeatureKey> => item !== null
      )
  }, [order, hiddenSet, locale])

  const handleToggleRememberLastView = (enabled: boolean) => {
    setSettings((prev) => ({
      ...(prev ?? DEFAULT_SETTINGS),
      popupNavigation: {
        ...(prev?.popupNavigation ?? DEFAULT_SETTINGS.popupNavigation),
        rememberLastView: enabled
      }
    }))
  }

  const handleUpdateTimeout = (minutes: number) => {
    setSettings((prev) => ({
      ...(prev ?? DEFAULT_SETTINGS),
      popupNavigation: {
        ...(prev?.popupNavigation ?? DEFAULT_SETTINGS.popupNavigation),
        sessionTimeoutMinutes: minutes
      }
    }))
  }

  const languageOptions: SelectDropdownOption<LanguageCode>[] = [
    { id: "auto", label: t("preferences.languageAuto") },
    { id: "en", label: "English" },
    { id: "vi", label: "Tiếng Việt" },
    { id: "de", label: "Deutsch" },
    { id: "es", label: "Español" },
    { id: "fr", label: "Français" },
    { id: "ja", label: "日本語" },
    { id: "ko", label: "한국어" },
    { id: "zh_CN", label: "简体中文" },
    { id: "zh_TW", label: "繁體中文" }
  ]

  const currentLanguage: LanguageCode =
    settings?.language ?? DEFAULT_SETTINGS.language ?? "auto"

  const handleSelectLanguage = (language: LanguageCode) => {
    setSettings((prev) => ({
      ...(prev ?? DEFAULT_SETTINGS),
      language
    }))
  }

  return (
    <SubSettingsLayout title={t("preferences.title")} onBack={onBack}>
      <div className="space-y-6">
        {/* Appearance Section */}
        <div className="space-y-2.5">
          <span className="section-header">{t("preferences.appearance")}</span>

          <div className="space-y-3">
            <div className="flex items-center justify-between gap-3 py-0.5">
              <div className="flex items-start gap-2.5 flex-1 min-w-0">
                <Palette className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                <div className="flex flex-col min-w-0">
                  <span className="text-xs font-semibold text-content-primary">
                    {t("preferences.themeMode")}
                  </span>
                  <p className="text-[11px] text-content-muted mt-0.5 leading-snug">
                    {t("preferences.themeModeDesc")}
                  </p>
                </div>
              </div>

              <SelectDropdown<ThemeMode>
                value={currentTheme}
                options={THEME_OPTIONS}
                onChange={handleSelectTheme}
                ariaLabel={t("preferences.themeMode")}
              />
            </div>

            <div className="flex items-center justify-between gap-3 py-0.5">
              <div className="flex items-start gap-2.5 flex-1 min-w-0">
                <LayoutGrid className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                <div className="flex flex-col min-w-0">
                  <span className="text-xs font-semibold text-content-primary">
                    {t("preferences.viewMode")}
                  </span>
                  <p className="text-[11px] text-content-muted mt-0.5 leading-snug">
                    {t("preferences.viewModeDesc")}
                  </p>
                </div>
              </div>

              <SelectDropdown<ViewMode>
                value={currentViewMode}
                options={VIEW_MODE_OPTIONS}
                onChange={handleSelectViewMode}
                ariaLabel={t("preferences.viewMode")}
              />
            </div>

            <div className="flex items-center justify-between gap-3 py-0.5">
              <div className="flex items-start gap-2.5 flex-1 min-w-0">
                <Globe className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                <div className="flex flex-col min-w-0">
                  <span className="text-xs font-semibold text-content-primary">
                    {t("preferences.language")}
                  </span>
                  <p className="text-[11px] text-content-muted mt-0.5 leading-snug">
                    {t("preferences.languageDesc")}
                  </p>
                </div>
              </div>

              <SelectDropdown<LanguageCode>
                value={currentLanguage}
                options={languageOptions}
                onChange={handleSelectLanguage}
                ariaLabel={t("preferences.language")}
              />
            </div>
          </div>
        </div>

        {/* Customize Menu Section */}
        <div className="pt-3 border-t border-border-divider">
          <SortableVisibilityList<FeatureKey>
            title={t("preferences.customizeMenu")}
            description={t("preferences.customizeMenuDesc")}
            items={listItems}
            onOrderChange={(newOrder) => {
              setSettings((prev) => ({
                ...(prev ?? DEFAULT_SETTINGS),
                featureLayout: {
                  ...(prev?.featureLayout ?? DEFAULT_SETTINGS.featureLayout),
                  order: newOrder
                }
              }))
            }}
            onToggleVisibility={handleToggleVisibility}
            onResetOrder={handleResetLayout}
            headerActions={
              <div className="relative" ref={presetMenuRef}>
                <button
                  type="button"
                  onClick={() => setIsPresetMenuOpen((prev) => !prev)}
                  className="flex items-center gap-1 text-[11px] font-medium text-accent hover:text-accent-hover transition-colors">
                  <Sparkles className="w-3 h-3" />
                  <span>{t("preferences.presets")}</span>
                  <ChevronDown
                    className={`w-3 h-3 transition-transform duration-150 ${
                      isPresetMenuOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {isPresetMenuOpen && (
                  <div className="absolute right-0 top-full mt-1.5 w-44 p-1 rounded-xl bg-app-surface border border-border-subtle shadow-xl shadow-black/40 backdrop-blur-md z-30 flex flex-col gap-0.5 animate-in fade-in zoom-in-95 duration-100 select-none">
                    <button
                      type="button"
                      onClick={() => handleApplyPreset("reading")}
                      className="flex items-center gap-2 px-2 py-1.5 text-left rounded-lg hover:bg-app-surface-hover text-content-primary transition-colors group">
                      <Compass className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                      <div className="flex flex-col min-w-0">
                        <span className="text-xs font-medium">
                          {t("preferences.presetReading")}
                        </span>
                        <span className="text-[10px] text-content-muted">
                          {t("preferences.presetReadingDesc")}
                        </span>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleApplyPreset("designer")}
                      className="flex items-center gap-2 px-2 py-1.5 text-left rounded-lg hover:bg-app-surface-hover text-content-primary transition-colors group">
                      <Palette className="w-3.5 h-3.5 text-pink-400 shrink-0" />
                      <div className="flex flex-col min-w-0">
                        <span className="text-xs font-medium">
                          {t("preferences.presetDesigner")}
                        </span>
                        <span className="text-[10px] text-content-muted">
                          {t("preferences.presetDesignerDesc")}
                        </span>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleApplyPreset("essential")}
                      className="flex items-center gap-2 px-2 py-1.5 text-left rounded-lg hover:bg-app-surface-hover text-content-primary transition-colors group">
                      <Zap className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <div className="flex flex-col min-w-0">
                        <span className="text-xs font-medium">
                          {t("preferences.presetEssential")}
                        </span>
                        <span className="text-[10px] text-content-muted">
                          {t("preferences.presetEssentialDesc")}
                        </span>
                      </div>
                    </button>
                  </div>
                )}
              </div>
            }
          />
        </div>

        {/* Navigation & Popup Memory Section */}
        <div className="space-y-2.5 pt-3 border-t border-border-divider">
          <span className="section-header">{t("preferences.navigation")}</span>

          <div className="space-y-2">
            <div className="flex items-center justify-between gap-3 py-1">
              <div className="flex items-start gap-2.5 flex-1 min-w-0">
                <Search className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                <div className="flex flex-col min-w-0">
                  <span className="text-xs font-semibold text-content-primary">
                    {t("preferences.searchAndFilter")}
                  </span>
                  <p className="text-[11px] text-content-muted mt-0.5 leading-snug">
                    {t("preferences.searchAndFilterDesc")}
                  </p>
                </div>
              </div>
              <Switch
                checked={Boolean(currentNav.showSearchAndFilter)}
                onChange={(enabled) => {
                  setSettings((prev) => ({
                    ...(prev ?? DEFAULT_SETTINGS),
                    popupNavigation: {
                      ...(prev?.popupNavigation ??
                        DEFAULT_POPUP_NAVIGATION_CONFIG),
                      showSearchAndFilter: enabled
                    }
                  }))
                }}
                ariaLabel={t("preferences.searchAndFilter")}
              />
            </div>

            <div className="flex items-center justify-between gap-3 py-1">
              <div className="flex items-start gap-2.5 flex-1 min-w-0">
                <History className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                <div className="flex flex-col min-w-0">
                  <span className="text-xs font-semibold text-content-primary">
                    {t("preferences.rememberLastView")}
                  </span>
                  <p className="text-[11px] text-content-muted mt-0.5 leading-snug">
                    {t("preferences.rememberLastViewDesc")}
                  </p>
                </div>
              </div>
              <Switch
                checked={currentNav.rememberLastView}
                onChange={handleToggleRememberLastView}
                ariaLabel={t("preferences.rememberLastView")}
              />
            </div>

            {currentNav.rememberLastView && (
              <div className="pt-1 pb-1 pl-3">
                <div className="pl-3 border-l-2 border-border-subtle">
                  <Slider
                    label={t("preferences.sessionTimeout")}
                    value={currentNav.sessionTimeoutMinutes}
                    valueDisplay={`${currentNav.sessionTimeoutMinutes} min`}
                    min={1}
                    max={60}
                    step={1}
                    onChange={handleUpdateTimeout}
                    ticks={[
                      { label: "1 min" },
                      { label: "10 min (Default)" },
                      { label: "60 min" }
                    ]}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Other Section */}
        <div className="space-y-2.5 pt-3 border-t border-border-divider">
          <span className="section-header">{t("preferences.other")}</span>

          <button
            type="button"
            onClick={() => {
              if (typeof chrome !== "undefined" && chrome.runtime?.openOptionsPage) {
                chrome.runtime.openOptionsPage()
              } else if (typeof chrome !== "undefined" && chrome.runtime?.getURL) {
                window.open(chrome.runtime.getURL("options.html"), "_blank")
              }
            }}
            className="w-full flex items-center justify-between p-2.5 rounded-xl bg-app-surface hover:bg-app-surface-hover border border-border-subtle hover:border-accent/40 active:scale-[0.99] transition-all text-content-primary group cursor-pointer shadow-sm">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="p-1.5 rounded-lg bg-accent-subtle text-accent shrink-0">
                <Sliders className="w-4 h-4" />
              </div>
              <div className="flex flex-col text-left min-w-0">
                <span className="text-xs font-semibold text-content-primary">
                  {t("preferences.optionsPage")}
                </span>
                <span className="text-[10px] text-content-muted truncate">
                  {t("preferences.optionsPageDesc")}
                </span>
              </div>
            </div>

            <ExternalLink className="w-3.5 h-3.5 text-content-muted group-hover:text-accent shrink-0 ml-2 transition-colors" />
          </button>
        </div>
      </div>
    </SubSettingsLayout>
  )
}
