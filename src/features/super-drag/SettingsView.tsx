import {
  Compass,
  Droplets,
  ExternalLink,
  EyeOff,
  ImageIcon,
  Link2,
  PieChart,
  Search,
  Type
} from "lucide-react"
import React, { useEffect, useState } from "react"

import { useStorage } from "@plasmohq/storage/hook"

import { GridPicker, type GridPickerItem } from "~components/GridPicker"
import { SegmentedTabs, type SegmentedTabItem } from "~components/SegmentedTabs"
import {
  OPACITY_DROPDOWN_OPTIONS,
  SelectDropdown
} from "~components/SelectDropdown"
import { SettingToggleRow } from "~components/SettingToggleRow"
import { SubSettingsLayout } from "~components/SubSettingsLayout"
import {
  DEFAULT_DIRECTIONAL_ACTIONS,
  DEFAULT_SETTINGS,
  STORAGE_KEYS,
  type DragIndicatorStyle,
  type FeatureSettings,
  type SuperDragAction,
  type SuperDragConfig
} from "~core/types"
import { useI18n } from "~core/useI18n"
import { DirectionalDPadPicker } from "~features/super-drag/DirectionalDPadPicker"
import type { DragDirection } from "~features/super-drag/logic"

interface SuperDragSettingsViewProps {
  onBack: () => void
}

type TargetTab = "text" | "link" | "image"

/**
 * Sub-settings view for Super Drag.
 * Configures drag targets with intuitive nested directional gesture D-pads,
 * and visual feedback preferences.
 */
export const SuperDragSettingsView: React.FC<SuperDragSettingsViewProps> = ({
  onBack
}) => {
  const { t } = useI18n()
  const [settings, setSettings] = useStorage<FeatureSettings>(
    STORAGE_KEYS.SETTINGS,
    DEFAULT_SETTINGS
  )

  const indicatorItems: GridPickerItem<DragIndicatorStyle>[] = [
    {
      id: "none",
      label: t("features.superDrag.settings.indicatorStyles.none"),
      icon: <EyeOff className="w-4 h-4" />
    },
    {
      id: "badge",
      label: t("features.superDrag.settings.indicatorStyles.badge"),
      icon: <Compass className="w-4 h-4" />
    },
    {
      id: "radial",
      label: t("features.superDrag.settings.indicatorStyles.radial"),
      icon: <PieChart className="w-4 h-4" />
    }
  ]

  const [activeTab, setActiveTab] = useState<TargetTab>("text")
  const [isIncognitoAllowed, setIsIncognitoAllowed] = useState(false)

  // Check if extension is allowed in Incognito mode
  useEffect(() => {
    if (chrome.extension?.isAllowedIncognitoAccess) {
      chrome.extension.isAllowedIncognitoAccess((isAllowed) => {
        setIsIncognitoAllowed(isAllowed)
      })
    }
  }, [])

  const isMasterEnabled = settings?.superDrag ?? DEFAULT_SETTINGS.superDrag
  const currentConfig: SuperDragConfig =
    settings?.superDragConfig ?? DEFAULT_SETTINGS.superDragConfig

  const targetTabs: SegmentedTabItem<TargetTab>[] = [
    {
      id: "text",
      label: t("features.superDrag.settings.tabs.text"),
      icon: <Type className="w-3.5 h-3.5" />,
      showOffDot: !currentConfig.searchSelectedText
    },
    {
      id: "link",
      label: t("features.superDrag.settings.tabs.link"),
      icon: <Link2 className="w-3.5 h-3.5" />,
      showOffDot: !currentConfig.openHyperlinks
    },
    {
      id: "image",
      label: t("features.superDrag.settings.tabs.image"),
      icon: <ImageIcon className="w-3.5 h-3.5" />,
      showOffDot: !currentConfig.openImages
    }
  ]

  const handleToggleMaster = (enabled: boolean) => {
    setSettings((prev) => ({
      ...(prev ?? DEFAULT_SETTINGS),
      superDrag: enabled
    }))
  }

  const handleToggleOption = (
    key: "searchSelectedText" | "openHyperlinks" | "openImages"
  ) => {
    setSettings((prev) => ({
      ...(prev ?? DEFAULT_SETTINGS),
      superDragConfig: {
        ...(prev?.superDragConfig ?? DEFAULT_SETTINGS.superDragConfig),
        [key]: !currentConfig[key]
      }
    }))
  }

  const handleChangeIndicatorStyle = (style: DragIndicatorStyle) => {
    setSettings((prev) => ({
      ...(prev ?? DEFAULT_SETTINGS),
      superDragConfig: {
        ...(prev?.superDragConfig ?? DEFAULT_SETTINGS.superDragConfig),
        indicatorStyle: style,
        showIndicator: style !== "none"
      }
    }))
  }

  const handleChangeIndicatorOpacity = (val: string) => {
    const indicatorOpacity = parseFloat(val)
    if (Number.isNaN(indicatorOpacity)) return
    setSettings((prev) => ({
      ...(prev ?? DEFAULT_SETTINGS),
      superDragConfig: {
        ...(prev?.superDragConfig ?? DEFAULT_SETTINGS.superDragConfig),
        indicatorOpacity
      }
    }))
  }

  const handleChangeDirectionAction = (
    targetKey: "textActions" | "linkActions" | "imageActions",
    direction: DragDirection,
    action: SuperDragAction
  ) => {
    const currentActions =
      currentConfig[targetKey] ?? DEFAULT_DIRECTIONAL_ACTIONS

    setSettings((prev) => ({
      ...(prev ?? DEFAULT_SETTINGS),
      superDragConfig: {
        ...(prev?.superDragConfig ?? DEFAULT_SETTINGS.superDragConfig),
        [targetKey]: {
          ...currentActions,
          [direction]: action
        }
      }
    }))
  }

  const handleResetTargetActions = (
    targetKey: "textActions" | "linkActions" | "imageActions"
  ) => {
    setSettings((prev) => ({
      ...(prev ?? DEFAULT_SETTINGS),
      superDragConfig: {
        ...(prev?.superDragConfig ?? DEFAULT_SETTINGS.superDragConfig),
        [targetKey]: { ...DEFAULT_DIRECTIONAL_ACTIONS }
      }
    }))
  }

  const currentIndicatorStyle =
    currentConfig.indicatorStyle ??
    (currentConfig.showIndicator ? "radial" : "none")

  return (
    <SubSettingsLayout
      title={t("features.superDrag.title")}
      enabled={isMasterEnabled}
      onToggle={handleToggleMaster}
      onBack={onBack}>
      <div className="space-y-4">
        {/* Section 1: Drag Targets (Segmented Tabs with Off Indicator) */}
        <div className="space-y-2.5">
          <span className="section-header">
            {t("features.superDrag.settings.dragTargets")}
          </span>

          {/* Segmented Tab Bar for Targets */}
          <SegmentedTabs<TargetTab>
            items={targetTabs}
            value={activeTab}
            onChange={setActiveTab}
          />

          {/* Active Target Content */}
          <div className="pt-1">
            {activeTab === "text" && (
              <div className="space-y-2">
                <SettingToggleRow
                  icon={<Search className="w-5 h-5 text-amber-400" />}
                  title={t("features.superDrag.settings.searchText")}
                  description={t("features.superDrag.settings.searchTextDesc")}
                  enabled={currentConfig.searchSelectedText}
                  onToggle={() => handleToggleOption("searchSelectedText")}
                />
                {currentConfig.searchSelectedText ? (
                  <div className="mt-2 pt-2 pb-1 pl-3 border-l-2 border-border-subtle ml-2">
                    <DirectionalDPadPicker
                      targetType="text"
                      actions={
                        currentConfig.textActions ?? DEFAULT_DIRECTIONAL_ACTIONS
                      }
                      onChangeAction={(dir, act) =>
                        handleChangeDirectionAction("textActions", dir, act)
                      }
                      onReset={() => handleResetTargetActions("textActions")}
                      isIncognitoAllowed={isIncognitoAllowed}
                      centerIcon={
                        <Type className="w-4 h-4 text-content-muted/40" />
                      }
                    />
                  </div>
                ) : (
                  <p className="text-xs text-content-muted py-2 text-center">
                    {t("features.superDrag.settings.textDisabled")}
                  </p>
                )}
              </div>
            )}

            {activeTab === "link" && (
              <div className="space-y-2">
                <SettingToggleRow
                  icon={<ExternalLink className="w-5 h-5 text-emerald-400" />}
                  title={t("features.superDrag.settings.openLinks")}
                  description={t("features.superDrag.settings.openLinksDesc")}
                  enabled={currentConfig.openHyperlinks}
                  onToggle={() => handleToggleOption("openHyperlinks")}
                />
                {currentConfig.openHyperlinks ? (
                  <div className="mt-2 pt-2 pb-1 pl-3 border-l-2 border-border-subtle ml-2">
                    <DirectionalDPadPicker
                      targetType="link"
                      actions={
                        currentConfig.linkActions ?? DEFAULT_DIRECTIONAL_ACTIONS
                      }
                      onChangeAction={(dir, act) =>
                        handleChangeDirectionAction("linkActions", dir, act)
                      }
                      onReset={() => handleResetTargetActions("linkActions")}
                      isIncognitoAllowed={isIncognitoAllowed}
                      centerIcon={
                        <Link2 className="w-4 h-4 text-content-muted/40" />
                      }
                    />
                  </div>
                ) : (
                  <p className="text-xs text-content-muted py-2 text-center">
                    {t("features.superDrag.settings.linksDisabled")}
                  </p>
                )}
              </div>
            )}

            {activeTab === "image" && (
              <div className="space-y-2">
                <SettingToggleRow
                  icon={<ImageIcon className="w-5 h-5 text-amber-400" />}
                  title={t("features.superDrag.settings.dragImages")}
                  description={t("features.superDrag.settings.dragImagesDesc")}
                  enabled={currentConfig.openImages}
                  onToggle={() => handleToggleOption("openImages")}
                />
                {currentConfig.openImages ? (
                  <div className="mt-2 pt-2 pb-1 pl-3 border-l-2 border-border-subtle ml-2">
                    <DirectionalDPadPicker
                      targetType="image"
                      actions={
                        currentConfig.imageActions ?? DEFAULT_DIRECTIONAL_ACTIONS
                      }
                      onChangeAction={(dir, act) =>
                        handleChangeDirectionAction("imageActions", dir, act)
                      }
                      onReset={() => handleResetTargetActions("imageActions")}
                      isIncognitoAllowed={isIncognitoAllowed}
                      centerIcon={
                        <ImageIcon className="w-4 h-4 text-content-muted/40" />
                      }
                    />
                  </div>
                ) : (
                  <p className="text-xs text-content-muted py-2 text-center">
                    {t("features.superDrag.settings.imagesDisabled")}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Section 2: Visual Feedback / Indicator (GridPicker) */}
        <div className="space-y-2 pt-2 border-t border-border-divider">
          <span className="section-header">
            {t("features.superDrag.settings.displayFeedback")}
          </span>

          <div className="space-y-2 pt-1">
            <div className="flex flex-col gap-0.5">
              <span className="text-xs font-semibold text-content-primary">
                {t("features.superDrag.settings.dragIndicator")}
              </span>
              <p className="text-[11px] text-content-muted leading-snug">
                {t("features.superDrag.settings.dragIndicatorDesc")}
              </p>
            </div>

            <GridPicker<DragIndicatorStyle>
              items={indicatorItems}
              value={currentIndicatorStyle}
              onChange={handleChangeIndicatorStyle}
              columns={3}
            />

            {currentIndicatorStyle !== "none" && (
              <div className="flex items-center justify-between gap-3 pt-2">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <Droplets className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />
                  <div className="flex flex-col min-w-0">
                    <span className="text-xs font-semibold text-content-primary">
                      {t("features.superDrag.settings.indicatorOpacity")}
                    </span>
                    <p className="text-[11px] text-content-muted mt-0.5 leading-snug">
                      {t("features.superDrag.settings.indicatorOpacityDesc")}
                    </p>
                  </div>
                </div>

                <SelectDropdown<string>
                  value={String(currentConfig.indicatorOpacity ?? 1)}
                  options={OPACITY_DROPDOWN_OPTIONS}
                  onChange={handleChangeIndicatorOpacity}
                  ariaLabel={t("features.superDrag.settings.indicatorOpacity")}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </SubSettingsLayout>
  )
}

