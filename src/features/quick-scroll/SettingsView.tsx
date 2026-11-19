import {
  ArrowUpToLine,
  Ban,
  Circle,
  Compass,
  Droplets,
  Eye,
  History,
  Pill,
  Shapes,
  Square
} from "lucide-react"
import type React from "react"

import { useStorage } from "@plasmohq/storage/hook"

import { EdgePositionPicker } from "~components/EdgePositionPicker"
import {
  OPACITY_DROPDOWN_OPTIONS,
  SelectDropdown,
  type SelectDropdownOption
} from "~components/SelectDropdown"
import { SettingToggleRow } from "~components/SettingToggleRow"
import { SubSettingsLayout } from "~components/SubSettingsLayout"
import {
  DEFAULT_QUICK_SCROLL_CONFIG,
  DEFAULT_SETTINGS,
  normalizeEdgePlacement,
  STORAGE_KEYS,
  type EdgePlacement,
  type FeatureSettings,
  type QuickScrollButtonShape,
  type QuickScrollButtonsMode,
  type QuickScrollConfig
} from "~core/types"
import { useI18n } from "~core/useI18n"

interface QuickScrollSettingsViewProps {
  onBack: () => void
}

/**
 * Sub-settings view for Quick Scroll Buttons.
 * Designed with a flat, modern layout without card/container wrappers.
 */
export const QuickScrollSettingsView: React.FC<
  QuickScrollSettingsViewProps
> = ({ onBack }) => {
  const { t } = useI18n()
  const [settings, setSettings] = useStorage<FeatureSettings>(
    STORAGE_KEYS.SETTINGS,
    DEFAULT_SETTINGS
  )

  const buttonItems: SelectDropdownOption<QuickScrollButtonsMode>[] = [
    {
      id: "both",
      label: t("features.quickScroll.settings.modes.both"),
      icon: <Compass className="w-3.5 h-3.5" />
    },
    {
      id: "top-only",
      label: t("features.quickScroll.settings.modes.topOnly"),
      icon: <ArrowUpToLine className="w-3.5 h-3.5" />
    }
  ]

  const shapeItems: SelectDropdownOption<QuickScrollButtonShape>[] = [
    {
      id: "circle",
      label: t("common.shapes.circle"),
      icon: <Circle className="w-3.5 h-3.5" />
    },
    {
      id: "capsule",
      label: t("common.shapes.capsule"),
      icon: <Pill className="w-3.5 h-3.5" />
    },
    {
      id: "rounded",
      label: t("common.shapes.rounded"),
      icon: <Square className="w-3.5 h-3.5" />
    }
  ]

  const isMasterEnabled = settings?.quickScroll ?? DEFAULT_SETTINGS.quickScroll
  const currentConfig: QuickScrollConfig =
    settings?.quickScrollConfig ?? DEFAULT_SETTINGS.quickScrollConfig

  const handleToggleMaster = (enabled: boolean) => {
    setSettings((prev) => ({
      ...(prev ?? DEFAULT_SETTINGS),
      quickScroll: enabled
    }))
  }

  const currentPlacement = normalizeEdgePlacement(
    currentConfig.placement ?? currentConfig.position,
    DEFAULT_QUICK_SCROLL_CONFIG.placement
  )

  const handleSelectPlacement = (placement: EdgePlacement) => {
    setSettings((prev) => ({
      ...(prev ?? DEFAULT_SETTINGS),
      quickScrollConfig: {
        ...(prev?.quickScrollConfig ?? DEFAULT_SETTINGS.quickScrollConfig),
        placement
      }
    }))
  }

  const handleSelectButtonsMode = (buttonsMode: QuickScrollButtonsMode) => {
    setSettings((prev) => ({
      ...(prev ?? DEFAULT_SETTINGS),
      quickScrollConfig: {
        ...(prev?.quickScrollConfig ?? DEFAULT_SETTINGS.quickScrollConfig),
        buttonsMode
      }
    }))
  }

  const handleSelectButtonShape = (buttonShape: QuickScrollButtonShape) => {
    setSettings((prev) => ({
      ...(prev ?? DEFAULT_SETTINGS),
      quickScrollConfig: {
        ...(prev?.quickScrollConfig ?? DEFAULT_SETTINGS.quickScrollConfig),
        buttonShape
      }
    }))
  }

  const handleToggleOption = (
    key: keyof Pick<
      QuickScrollConfig,
      "autoHide" | "enableReturnMemory" | "hideOnNativeButton"
    >
  ) => {
    setSettings((prev) => ({
      ...(prev ?? DEFAULT_SETTINGS),
      quickScrollConfig: {
        ...(prev?.quickScrollConfig ?? DEFAULT_SETTINGS.quickScrollConfig),
        [key]: !currentConfig[key]
      }
    }))
  }

  const handleSelectOpacity = (opacityStr: string) => {
    const opacity = parseFloat(opacityStr)
    if (Number.isNaN(opacity)) return
    setSettings((prev) => ({
      ...(prev ?? DEFAULT_SETTINGS),
      quickScrollConfig: {
        ...(prev?.quickScrollConfig ?? DEFAULT_SETTINGS.quickScrollConfig),
        opacity
      }
    }))
  }

  return (
    <SubSettingsLayout
      title={t("features.quickScroll.title")}
      enabled={isMasterEnabled}
      onToggle={handleToggleMaster}
      onBack={onBack}>
      <div className="space-y-4">
        {/* Section 1: Screen Position (Edge Position Picker with Snapping) */}
        <div className="space-y-2">
          <span className="section-header">{t("common.screenPosition")}</span>
          <div className="space-y-1.5">
            <span className="text-xs font-semibold text-content-primary">
              {t("features.quickScroll.settings.buttonPlacement")}
            </span>
            <p className="text-[11px] text-content-muted leading-snug">
              {t("features.quickScroll.settings.buttonPlacementDesc")}
            </p>
            <EdgePositionPicker
              allowedEdges={["left", "right"]}
              value={currentPlacement}
              onChange={handleSelectPlacement}
            />
          </div>
        </div>

        {/* Section 2: Visible Controls & Button Shape (Trailing Dropdowns) */}
        <div className="space-y-3 pt-3 border-t border-border-divider">
          <span className="section-header">
            {t("features.quickScroll.settings.controlsStyle")}
          </span>

          <div className="flex items-center justify-between gap-3 py-0.5">
            <div className="flex items-start gap-3 flex-1 min-w-0">
              <Compass className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-semibold text-content-primary">
                  {t("features.quickScroll.settings.buttonSelection")}
                </span>
                <p className="text-[11px] text-content-muted mt-0.5 leading-snug">
                  {t("features.quickScroll.settings.buttonSelectionDesc")}
                </p>
              </div>
            </div>

            <SelectDropdown<QuickScrollButtonsMode>
              value={currentConfig.buttonsMode}
              options={buttonItems}
              onChange={handleSelectButtonsMode}
              ariaLabel={t("features.quickScroll.settings.buttonSelection")}
            />
          </div>

          <div className="flex items-center justify-between gap-3 py-0.5">
            <div className="flex items-start gap-3 flex-1 min-w-0">
              <Shapes className="w-5 h-5 text-pink-400 shrink-0 mt-0.5" />
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-semibold text-content-primary">
                  {t("common.buttonShape")}
                </span>
                <p className="text-[11px] text-content-muted mt-0.5 leading-snug">
                  {t("features.quickScroll.settings.buttonShapeDesc")}
                </p>
              </div>
            </div>

            <SelectDropdown<QuickScrollButtonShape>
              value={currentConfig.buttonShape ?? "circle"}
              options={shapeItems}
              onChange={handleSelectButtonShape}
              ariaLabel={t("common.buttonShape")}
            />
          </div>

          <div className="flex items-center justify-between gap-3 py-0.5">
            <div className="flex items-start gap-3 flex-1 min-w-0">
              <Droplets className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-semibold text-content-primary">
                  {t("common.buttonOpacity")}
                </span>
                <p className="text-[11px] text-content-muted mt-0.5 leading-snug">
                  {t("features.quickScroll.settings.buttonOpacityDesc")}
                </p>
              </div>
            </div>

            <SelectDropdown<string>
              value={String(currentConfig.opacity ?? 1)}
              options={OPACITY_DROPDOWN_OPTIONS}
              onChange={handleSelectOpacity}
              ariaLabel={t("common.buttonOpacity")}
            />
          </div>
        </div>

        {/* Section 3: Smart Behavior Toggles */}
        <div className="space-y-1 pt-3 border-t border-border-divider">
          <span className="section-header">
            {t("features.quickScroll.settings.behaviorIntel")}
          </span>

          <div className="divide-y divide-border-divider">
            {/* Auto-Dim on Idle */}
            <SettingToggleRow
              icon={<Eye className="w-5 h-5 text-cyan-400" />}
              title={t("features.quickScroll.settings.autoDim")}
              description={t("features.quickScroll.settings.autoDimDesc")}
              enabled={currentConfig.autoHide}
              onToggle={() => handleToggleOption("autoHide")}
            />

            {/* Scroll Memory Return */}
            <SettingToggleRow
              icon={<History className="w-5 h-5 text-amber-400" />}
              title={t("features.quickScroll.settings.scrollMemory")}
              description={t("features.quickScroll.settings.scrollMemoryDesc")}
              enabled={currentConfig.enableReturnMemory}
              onToggle={() => handleToggleOption("enableReturnMemory")}
            />
            {/* Hide if Page Has Native Scroll Button */}
            <SettingToggleRow
              icon={<Ban className="w-5 h-5 text-rose-400" />}
              title={t("features.quickScroll.settings.hideOnNative")}
              description={t("features.quickScroll.settings.hideOnNativeDesc")}
              enabled={Boolean(currentConfig.hideOnNativeButton)}
              onToggle={() => handleToggleOption("hideOnNativeButton")}
            />
          </div>
        </div>
      </div>
    </SubSettingsLayout>
  )
}
