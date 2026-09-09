import {
  Eye,
  EyeOff,
  History,
  Laptop,
  Moon,
  Move,
  Palette,
  RotateCcw,
  Sun
} from "lucide-react"
import React, { useState } from "react"

import { useStorage } from "@plasmohq/storage/hook"

import { GridPicker, type GridPickerItem } from "~components/GridPicker"
import { Slider } from "~components/Slider"
import { SubSettingsLayout } from "~components/SubSettingsLayout"
import { Switch } from "~components/Switch"
import { FEATURE_CATALOG } from "~core/featureCatalog"
import {
  DEFAULT_FEATURE_LAYOUT_CONFIG,
  DEFAULT_SETTINGS,
  STORAGE_KEYS,
  type FeatureKey,
  type FeatureSettings,
  type ThemeMode
} from "~core/types"

interface PreferencesSettingsViewProps {
  onBack: () => void
}

const THEME_OPTIONS: GridPickerItem<ThemeMode>[] = [
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

  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null)

  const currentTheme = settings?.theme ?? DEFAULT_SETTINGS.theme
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
    return [...savedOrder, ...missing]
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
    setSettings((prev) => ({
      ...(prev ?? DEFAULT_SETTINGS),
      featureLayout: DEFAULT_FEATURE_LAYOUT_CONFIG
    }))
  }

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index)
    e.dataTransfer.effectAllowed = "move"
    if (e.dataTransfer.setData) {
      e.dataTransfer.setData("text/plain", index.toString())
    }
  }

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
    if (dragOverIndex !== index) {
      setDragOverIndex(index)
    }
  }

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault()
    if (draggedIndex === null || draggedIndex === dropIndex) {
      setDraggedIndex(null)
      setDragOverIndex(null)
      return
    }

    const newOrder = [...order]
    const [movedItem] = newOrder.splice(draggedIndex, 1)
    newOrder.splice(dropIndex, 0, movedItem)

    setDraggedIndex(null)
    setDragOverIndex(null)

    setSettings((prev) => ({
      ...(prev ?? DEFAULT_SETTINGS),
      featureLayout: {
        ...(prev?.featureLayout ?? DEFAULT_SETTINGS.featureLayout),
        order: newOrder
      }
    }))
  }

  const handleDragEnd = () => {
    setDraggedIndex(null)
    setDragOverIndex(null)
  }

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

            <GridPicker<ThemeMode>
              items={THEME_OPTIONS}
              value={currentTheme}
              onChange={handleSelectTheme}
              columns={3}
            />
          </div>
        </div>

        {/* Customize Menu Section */}
        <div className="space-y-2.5 pt-3 border-t border-border-divider">
          <div className="flex items-center justify-between">
            <span className="section-header">Customize Menu</span>
            <button
              type="button"
              onClick={handleResetLayout}
              className="flex items-center gap-1 text-[11px] font-medium text-accent hover:text-accent-hover transition-colors">
              <RotateCcw className="w-3 h-3" />
              <span>Reset order</span>
            </button>
          </div>

          <p className="text-xs text-content-muted">
            Drag items to reorder them in the popup list, or toggle visibility
            to hide features you don&apos;t use.
          </p>

          <div className="divide-y divide-border-divider">
            {order.map((key, index) => {
              const item = FEATURE_CATALOG[key]
              if (!item) return null

              const isHidden = hiddenSet.has(key)
              const isDragging = draggedIndex === index
              const isDragOver =
                dragOverIndex === index && draggedIndex !== index

              const IconComponent = item.icon

              return (
                <div
                  key={key}
                  draggable
                  onDragStart={(e) => handleDragStart(e, index)}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDrop={(e) => handleDrop(e, index)}
                  onDragEnd={handleDragEnd}
                  className={`flex items-center justify-between gap-3 py-2.5 group cursor-grab active:cursor-grabbing transition-all duration-150 ${
                    isDragging ? "opacity-30 scale-[0.98]" : "opacity-100"
                  } ${
                    isDragOver
                      ? "border-t-2 border-t-accent bg-accent-subtle"
                      : ""
                  }`}>
                  {/* Left: Drag Handle Indicator + Icon + Title */}
                  <div
                    onClick={() => handleToggleVisibility(key)}
                    className={`flex items-center gap-2.5 flex-1 min-w-0 cursor-pointer ${
                      !isHidden ? "feature-row-active" : "feature-row-dimmed"
                    }`}>
                    <Move className="w-3.5 h-3.5 text-content-muted opacity-40 group-hover:opacity-100 shrink-0 transition-opacity" />
                    <div className="shrink-0 flex items-center justify-center transition-transform duration-200 ease-out group-hover:scale-110">
                      <IconComponent className={`w-5 h-5 ${item.colorClass}`} />
                    </div>
                    <div className="flex flex-col min-w-0 flex-1">
                      <span className="text-xs font-semibold text-content-primary truncate">
                        {item.title}
                      </span>
                      <span className="text-[10px] text-content-muted truncate">
                        {item.description}
                      </span>
                    </div>
                  </div>

                  {/* Right: Visibility Eye button */}
                  <div className="flex items-center shrink-0">
                    <button
                      type="button"
                      onClick={() => handleToggleVisibility(key)}
                      title={
                        isHidden
                          ? "Show feature in menu"
                          : "Hide feature from menu"
                      }
                      aria-label={`${isHidden ? "Show" : "Hide"} ${item.title}`}
                      className={`p-1.5 rounded-lg border transition-all duration-150 ${
                        isHidden
                          ? "bg-app-card text-content-muted border-border-subtle hover:text-content-primary hover:border-accent"
                          : "bg-accent-subtle text-accent border-accent/20 hover:bg-accent/20"
                      }`}>
                      {isHidden ? (
                        <EyeOff className="w-3.5 h-3.5" />
                      ) : (
                        <Eye className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
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
              <div className="pt-1 pb-1 pl-6">
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
