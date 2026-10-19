import {
  ChevronDown,
  Compass,
  History,
  Laptop,
  LayoutGrid,
  List,
  Moon,
  Palette,
  Sparkles,
  Sun,
  Zap
} from "lucide-react"
import React, { useEffect, useMemo, useRef, useState } from "react"

import { useStorage } from "@plasmohq/storage/hook"

import { SegmentedTabs, type SegmentedTabItem } from "~components/SegmentedTabs"
import { Slider } from "~components/Slider"
import {
  SortableVisibilityList,
  type SortableVisibilityItem
} from "~components/SortableVisibilityList"
import { SubSettingsLayout } from "~components/SubSettingsLayout"
import { Switch } from "~components/Switch"
import { isColorPickerSupported } from "~core/browserDetect"
import { FEATURE_CATALOG } from "~core/featureCatalog"
import {
  DEFAULT_FEATURE_LAYOUT_CONFIG,
  DEFAULT_SETTINGS,
  STORAGE_KEYS,
  type FeatureKey,
  type FeatureSettings,
  type ThemeMode,
  type ViewMode
} from "~core/types"

interface PreferencesSettingsViewProps {
  onBack: () => void
}

const THEME_OPTIONS: SegmentedTabItem<ThemeMode>[] = [
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

const VIEW_MODE_OPTIONS: SegmentedTabItem<ViewMode>[] = [
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
    const savedOrder =
      currentLayout?.order ?? DEFAULT_FEATURE_LAYOUT_CONFIG.order
    const missing = DEFAULT_FEATURE_LAYOUT_CONFIG.order.filter(
      (k) => !savedOrder.includes(k)
    )
    return [...savedOrder, ...missing].filter(
      (k) => k !== "colorPicker" || isColorPickerSupported
    )
  }, [currentLayout?.order])

  const hiddenSet = React.useMemo(
    () => new Set(currentLayout?.hidden ?? []),
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
    const newHidden = isCurrentlyHidden
      ? currentLayout.hidden.filter((k) => k !== key)
      : [...(currentLayout.hidden ?? []), key]

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
        "elementZapper",
        "colorPicker"
      ]
      // Show reading & navigation tools, hide heavy inspection tools
      newHidden = ["colorPicker", "elementZapper"]
    } else if (preset === "designer") {
      // Prioritize design, inspect, layout tinkering
      newOrder = [
        "allowRightClick",
        "colorPicker",
        "elementZapper",
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
        "elementZapper"
      ]
      newHidden = [
        "mouseZoom",
        "colorPicker",
        "elementZapper",
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
    return order
      .map((key): SortableVisibilityItem<FeatureKey> | null => {
        const item = FEATURE_CATALOG[key]
        if (!item) return null
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
  }, [order, hiddenSet])

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

  return (
    <SubSettingsLayout title="Preferences" onBack={onBack}>
      <div className="space-y-6">
        {/* Appearance Section */}
        <div className="space-y-2.5">
          <span className="section-header">Appearance</span>

          <div className="space-y-2.5">
            <div>
              <div className="flex items-center gap-1.5">
                <Palette className="w-4 h-4 text-accent" />
                <span className="text-xs font-semibold text-content-primary">
                  Theme Mode
                </span>
              </div>
              <p className="text-[11px] text-content-muted mt-0.5 leading-snug">
                Choose light, dark, or automatically synchronize with your
                operating system display settings.
              </p>
            </div>

            <SegmentedTabs<ThemeMode>
              items={THEME_OPTIONS}
              value={currentTheme}
              onChange={handleSelectTheme}
            />

            <div className="pt-2">
              <div className="flex items-center gap-1.5">
                <LayoutGrid className="w-4 h-4 text-accent" />
                <span className="text-xs font-semibold text-content-primary">
                  View Mode
                </span>
              </div>
              <p className="text-[11px] text-content-muted mt-0.5 leading-snug">
                Choose between detailed list view with descriptions or a compact grid layout.
              </p>
            </div>

            <SegmentedTabs<ViewMode>
              items={VIEW_MODE_OPTIONS}
              value={currentViewMode}
              onChange={handleSelectViewMode}
            />
          </div>
        </div>

        {/* Customize Menu Section */}
        <div className="pt-3 border-t border-border-divider">
          <SortableVisibilityList<FeatureKey>
            title="Customize Menu"
            description="Drag items to reorder them in the popup list, or toggle visibility to hide features you don't use."
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
                  <span>Presets</span>
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
                          Reading & Navigation
                        </span>
                        <span className="text-[10px] text-content-muted">
                          Scroll, drag & read
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
                          Designer & Dev
                        </span>
                        <span className="text-[10px] text-content-muted">
                          Color, inspect & zapper
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
                          Essentials Only
                        </span>
                        <span className="text-[10px] text-content-muted">
                          Minimal & focused
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
          <span className="section-header">Navigation</span>

          <div className="space-y-2">
            <div className="flex items-center justify-between gap-3 py-1">
              <div className="flex items-start gap-2.5 flex-1 min-w-0">
                <History className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                <div className="flex flex-col min-w-0">
                  <span className="text-xs font-semibold text-content-primary">
                    Remember Last View
                  </span>
                  <p className="text-[11px] text-content-muted mt-0.5 leading-snug">
                    Reopen the popup on the settings page you were previously
                    browsing.
                  </p>
                </div>
              </div>
              <Switch
                checked={currentNav.rememberLastView}
                onChange={handleToggleRememberLastView}
                ariaLabel="Remember last active view"
              />
            </div>

            {currentNav.rememberLastView && (
              <div className="pt-1 pb-1 pl-3">
                <div className="pl-3 border-l-2 border-border-subtle">
                  <Slider
                    label="Session Timeout"
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
      </div>
    </SubSettingsLayout>
  )
}
