import {
  ArrowDown,
  ArrowUp,
  Circle,
  Droplets,
  Eye,
  Link2,
  PictureInPicture2,
  Pill,
  Pipette,
  Shapes,
  Square,
  Zap,
  ZoomIn
} from "lucide-react"
import type React from "react"
import { useEffect, useMemo, useState } from "react"

import { useStorage } from "@plasmohq/storage/hook"

import { EdgePositionPicker } from "~components/EdgePositionPicker"
import { FeatureShortcutRow } from "~components/FeatureShortcutRow"
import {
  OPACITY_DROPDOWN_OPTIONS,
  SelectDropdown,
  type SelectDropdownOption
} from "~components/SelectDropdown"
import { SettingToggleRow } from "~components/SettingToggleRow"
import {
  SortableVisibilityList,
  type SortableVisibilityItem
} from "~components/SortableVisibilityList"
import { SubSettingsLayout } from "~components/SubSettingsLayout"
import { isColorPickerSupported } from "~core/browserDetect"
import { t as translate } from "~core/i18n"
import { openBrowserShortcutsPage } from "~core/shortcutsHelper"
import {
  DEFAULT_QUICK_HUB_ACTION_ORDER,
  DEFAULT_QUICK_HUB_CONFIG,
  DEFAULT_SETTINGS,
  normalizeEdgePlacement,
  normalizeQuickHubActionOrder,
  normalizeQuickHubHiddenActions,
  STORAGE_KEYS,
  type EdgePlacement,
  type FeatureSettings,
  type QuickHubActionId,
  type QuickHubButtonShape,
  type QuickHubConfig
} from "~core/types"
import { useI18n } from "~core/useI18n"

interface QuickHubSettingsViewProps {
  onBack: () => void
}

interface QuickHubActionMeta {
  id: QuickHubActionId
  title: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  colorClass: string
  getSourceState: (settings: FeatureSettings) => {
    isDisabled: boolean
    reason?: string
  }
}

function getQuickHubActionsMeta(
  t: typeof translate
): Record<QuickHubActionId, QuickHubActionMeta> {
  return {
    pip: {
      id: "pip",
      title: t("features.quickHub.settings.actions.pipTitle"),
      description: t("features.quickHub.settings.actions.pipDesc"),
      icon: PictureInPicture2,
      colorClass: "text-indigo-400",
      getSourceState: (s) => {
        if (!s.pictureInPicture) {
          return {
            isDisabled: true,
            reason: t("features.quickHub.settings.disabledInSettings", {
              feature: t("features.pictureInPicture.title")
            })
          }
        }
        if (s.featureLayout?.hidden?.includes("pictureInPicture")) {
          return {
            isDisabled: true,
            reason: t("features.quickHub.settings.hiddenInMenu", {
              feature: t("features.pictureInPicture.title")
            })
          }
        }
        return { isDisabled: false }
      }
    },
    colorPicker: {
      id: "colorPicker",
      title: t("features.quickHub.settings.actions.colorPickerTitle"),
      description: t("features.quickHub.settings.actions.colorPickerDesc"),
      icon: Pipette,
      colorClass: "text-pink-400",
      getSourceState: (s) => {
        if (!s.colorPicker) {
          return {
            isDisabled: true,
            reason: t("features.quickHub.settings.disabledInSettings", {
              feature: t("features.colorPicker.title")
            })
          }
        }
        if (s.featureLayout?.hidden?.includes("colorPicker")) {
          return {
            isDisabled: true,
            reason: t("features.quickHub.settings.hiddenInMenu", {
              feature: t("features.colorPicker.title")
            })
          }
        }
        return { isDisabled: false }
      }
    },
    elementToys: {
      id: "elementToys",
      title: t("features.quickHub.settings.actions.elementToysTitle"),
      description: t("features.quickHub.settings.actions.elementToysDesc"),
      icon: Zap,
      colorClass: "text-amber-400",
      getSourceState: (s) => {
        if (!s.elementToys) {
          return {
            isDisabled: true,
            reason: t("features.quickHub.settings.disabledInSettings", {
              feature: t("features.elementToys.title")
            })
          }
        }
        if (s.featureLayout?.hidden?.includes("elementToys")) {
          return {
            isDisabled: true,
            reason: t("features.quickHub.settings.hiddenInMenu", {
              feature: t("features.elementToys.title")
            })
          }
        }
        return { isDisabled: false }
      }
    },
    scrollTop: {
      id: "scrollTop",
      title: t("features.quickHub.settings.actions.scrollTopTitle"),
      description: t("features.quickHub.settings.actions.scrollTopDesc"),
      icon: ArrowUp,
      colorClass: "text-sky-400",
      getSourceState: (s) => {
        if (!s.quickScroll) {
          return {
            isDisabled: true,
            reason: t("features.quickHub.settings.disabledInSettings", {
              feature: t("features.quickScroll.title")
            })
          }
        }
        if (s.featureLayout?.hidden?.includes("quickScroll")) {
          return {
            isDisabled: true,
            reason: t("features.quickHub.settings.hiddenInMenu", {
              feature: t("features.quickScroll.title")
            })
          }
        }
        return { isDisabled: false }
      }
    },
    scrollBottom: {
      id: "scrollBottom",
      title: t("features.quickHub.settings.actions.scrollBottomTitle"),
      description: t("features.quickHub.settings.actions.scrollBottomDesc"),
      icon: ArrowDown,
      colorClass: "text-sky-400",
      getSourceState: (s) => {
        if (!s.quickScroll) {
          return {
            isDisabled: true,
            reason: t("features.quickHub.settings.disabledInSettings", {
              feature: t("features.quickScroll.title")
            })
          }
        }
        if (s.featureLayout?.hidden?.includes("quickScroll")) {
          return {
            isDisabled: true,
            reason: t("features.quickHub.settings.hiddenInMenu", {
              feature: t("features.quickScroll.title")
            })
          }
        }
        if (s.quickScrollConfig?.buttonsMode === "top-only") {
          return {
            isDisabled: true,
            reason: t("features.quickHub.settings.quickScrollTopOnly")
          }
        }
        return { isDisabled: false }
      }
    },
    resetZoom: {
      id: "resetZoom",
      title: t("features.quickHub.settings.actions.resetZoomTitle"),
      description: t("features.quickHub.settings.actions.resetZoomDesc"),
      icon: ZoomIn,
      colorClass: "text-violet-400",
      getSourceState: (s) => {
        if (!s.mouseZoom) {
          return {
            isDisabled: true,
            reason: t("features.quickHub.settings.disabledInSettings", {
              feature: t("features.mouseZoom.title")
            })
          }
        }
        if (s.featureLayout?.hidden?.includes("mouseZoom")) {
          return {
            isDisabled: true,
            reason: t("features.quickHub.settings.hiddenInMenu", {
              feature: t("features.mouseZoom.title")
            })
          }
        }
        return { isDisabled: false }
      }
    },
    cleanUrl: {
      id: "cleanUrl",
      title: t("features.quickHub.settings.actions.cleanUrlTitle"),
      description: t("features.quickHub.settings.actions.cleanUrlDesc"),
      icon: Link2,
      colorClass: "text-cyan-400",
      getSourceState: (s) => {
        if (!s.contextMenuActions) {
          return {
            isDisabled: true,
            reason: t("features.quickHub.settings.disabledInSettings", {
              feature: t("features.contextMenuActions.title")
            })
          }
        }
        if (s.featureLayout?.hidden?.includes("contextMenuActions")) {
          return {
            isDisabled: true,
            reason: t("features.quickHub.settings.hiddenInMenu", {
              feature: t("features.contextMenuActions.title")
            })
          }
        }
        return { isDisabled: false }
      }
    }
  }
}

/**
 * Sub-settings view for Quick Hub.
 */
export const QuickHubSettingsView: React.FC<QuickHubSettingsViewProps> = ({
  onBack
}) => {
  const { t, locale } = useI18n()
  const [settings, setSettings] = useStorage<FeatureSettings>(
    STORAGE_KEYS.SETTINGS,
    DEFAULT_SETTINGS
  )
  const [shortcut, setShortcut] = useState<string>("")

  const buttonShapeOptions: SelectDropdownOption<QuickHubButtonShape>[] = [
    {
      id: "rounded",
      label: t("common.shapes.rounded"),
      icon: <Square className="w-3.5 h-3.5" />
    },
    {
      id: "circle",
      label: t("common.shapes.circle"),
      icon: <Circle className="w-3.5 h-3.5" />
    },
    {
      id: "pill",
      label: t("common.shapes.pill"),
      icon: <Pill className="w-3.5 h-3.5" />
    }
  ]

  const actionsMeta = useMemo(
    () => getQuickHubActionsMeta(t),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [locale]
  )

  useEffect(() => {
    if (chrome.commands?.getAll) {
      chrome.commands.getAll((commands) => {
        const cmd = commands.find((c) => c.name === "toggle_quick_hub")
        if (cmd?.shortcut) {
          setShortcut(cmd.shortcut)
        } else {
          setShortcut("")
        }
      })
    }
  }, [])

  const isMasterEnabled = settings?.quickHub ?? DEFAULT_SETTINGS.quickHub
  const currentConfig: QuickHubConfig =
    settings?.quickHubConfig ?? DEFAULT_SETTINGS.quickHubConfig

  const handleToggleMaster = (enabled: boolean) => {
    setSettings((prev) => ({
      ...(prev ?? DEFAULT_SETTINGS),
      quickHub: enabled
    }))
  }

  const currentPlacement = normalizeEdgePlacement(
    currentConfig.placement ?? currentConfig.corner,
    DEFAULT_QUICK_HUB_CONFIG.placement
  )

  const handlePlacementChange = (placement: EdgePlacement) => {
    setSettings((prev) => ({
      ...(prev ?? DEFAULT_SETTINGS),
      quickHubConfig: {
        ...(prev?.quickHubConfig ?? DEFAULT_SETTINGS.quickHubConfig),
        placement
      }
    }))
  }

  const handleToggleOption = (key: keyof QuickHubConfig) => {
    setSettings((prev) => ({
      ...(prev ?? DEFAULT_SETTINGS),
      quickHubConfig: {
        ...(prev?.quickHubConfig ?? DEFAULT_SETTINGS.quickHubConfig),
        [key]: !currentConfig[key]
      }
    }))
  }

  const handleOpenShortcutsPage = () => {
    openBrowserShortcutsPage().catch(() => {})
  }

  // Action Order & Visibility
  // If Color Picker is not supported in this browser, hide it completely rather than forcing disabled
  const actionOrder: QuickHubActionId[] = useMemo(() => {
    const fullOrder = normalizeQuickHubActionOrder(currentConfig.actionOrder)
    return fullOrder.filter(
      (id) => id !== "colorPicker" || isColorPickerSupported
    )
  }, [currentConfig.actionOrder])

  const hiddenActionsSet = useMemo(
    () => new Set(normalizeQuickHubHiddenActions(currentConfig.hiddenActions)),
    [currentConfig.hiddenActions]
  )

  const handleToggleActionVisibility = (actionId: QuickHubActionId) => {
    const meta = actionsMeta[actionId]
    if (settings && meta?.getSourceState(settings).isDisabled) {
      // Do nothing if disabled or hidden in parent settings, preserving state
      return
    }

    const isCurrentlyHidden = hiddenActionsSet.has(actionId)
    const currentHiddenList = normalizeQuickHubHiddenActions(currentConfig.hiddenActions)
    const newHidden = isCurrentlyHidden
      ? currentHiddenList.filter((id) => id !== actionId)
      : [...currentHiddenList, actionId]

    setSettings((prev) => ({
      ...(prev ?? DEFAULT_SETTINGS),
      quickHubConfig: {
        ...(prev?.quickHubConfig ?? DEFAULT_SETTINGS.quickHubConfig),
        actionOrder,
        hiddenActions: newHidden
      }
    }))
  }

  const handleResetActionOrder = () => {
    setSettings((prev) => ({
      ...(prev ?? DEFAULT_SETTINGS),
      quickHubConfig: {
        ...(prev?.quickHubConfig ?? DEFAULT_SETTINGS.quickHubConfig),
        actionOrder: [...DEFAULT_QUICK_HUB_ACTION_ORDER],
        hiddenActions: []
      }
    }))
  }

  const handleOrderChange = (newOrder: QuickHubActionId[]) => {
    setSettings((prev) => ({
      ...(prev ?? DEFAULT_SETTINGS),
      quickHubConfig: {
        ...(prev?.quickHubConfig ?? DEFAULT_SETTINGS.quickHubConfig),
        actionOrder: newOrder
      }
    }))
  }

  const listItems: SortableVisibilityItem<QuickHubActionId>[] = useMemo(() => {
    return actionOrder
      .map(
        (actionId): SortableVisibilityItem<QuickHubActionId> | null => {
          const meta = actionsMeta[actionId]
        if (!meta) return null
        const sourceState = settings
          ? meta.getSourceState(settings)
          : { isDisabled: false }

        return {
          id: actionId,
          title: meta.title,
          description: meta.description,
          icon: meta.icon,
          colorClass: meta.colorClass,
          isHidden: hiddenActionsSet.has(actionId),
          isDisabled: sourceState.isDisabled,
          disabledReason: sourceState.reason,
          badge: sourceState.isDisabled ? (
            <span className="text-[9px] px-1.5 py-0.5 rounded bg-app-card text-content-muted border border-border-subtle shrink-0">
              {t("common.disabled")}
            </span>
          ) : undefined
        }
      })
      .filter(
        (item): item is SortableVisibilityItem<QuickHubActionId> =>
          item !== null
      )
  }, [actionOrder, actionsMeta, hiddenActionsSet, settings, t])

  return (
    <SubSettingsLayout
      title={t("features.quickHub.title")}
      enabled={isMasterEnabled}
      onToggle={handleToggleMaster}
      onBack={onBack}>
      <div className="space-y-4">
        {/* Section 1: Screen Position Placement (Edge Position Picker with Snapping) */}
        <div className="space-y-2">
          <span className="section-header">{t("common.screenPosition")}</span>
          <div className="space-y-1.5">
            <span className="text-xs font-semibold text-content-primary">
              {t("features.quickHub.settings.floatingPlacement")}
            </span>
            <p className="text-[11px] text-content-muted leading-snug">
              {t("features.quickHub.settings.floatingPlacementDesc")}
            </p>
            <EdgePositionPicker
              allowedEdges={["top", "right", "bottom", "left"]}
              value={currentPlacement}
              onChange={handlePlacementChange}
            />
          </div>

          <div className="flex items-center justify-between gap-3 pt-2">
            <div className="flex items-start gap-3 flex-1 min-w-0">
              <Shapes className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-semibold text-content-primary">
                  {t("common.buttonShape")}
                </span>
                <p className="text-[11px] text-content-muted mt-0.5 leading-snug">
                  {t("features.quickHub.settings.buttonShapeDesc")}
                </p>
              </div>
            </div>

            <SelectDropdown<QuickHubButtonShape>
              value={currentConfig.buttonShape ?? "rounded"}
              options={buttonShapeOptions}
              onChange={(buttonShape) => {
                setSettings((prev) => ({
                  ...(prev ?? DEFAULT_SETTINGS),
                  quickHubConfig: {
                    ...(prev?.quickHubConfig ?? DEFAULT_QUICK_HUB_CONFIG),
                    buttonShape
                  }
                }))
              }}
              ariaLabel={t("common.buttonShape")}
            />
          </div>

          <div className="flex items-center justify-between gap-3 pt-1">
            <div className="flex items-start gap-3 flex-1 min-w-0">
              <Droplets className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-semibold text-content-primary">
                  {t("common.buttonOpacity")}
                </span>
                <p className="text-[11px] text-content-muted mt-0.5 leading-snug">
                  {t("features.quickHub.settings.buttonOpacityDesc")}
                </p>
              </div>
            </div>

            <SelectDropdown<string>
              value={String(currentConfig.buttonOpacity ?? 1)}
              options={OPACITY_DROPDOWN_OPTIONS}
              onChange={(val) => {
                const buttonOpacity = parseFloat(val)
                if (Number.isNaN(buttonOpacity)) return
                setSettings((prev) => ({
                  ...(prev ?? DEFAULT_SETTINGS),
                  quickHubConfig: {
                    ...(prev?.quickHubConfig ?? DEFAULT_QUICK_HUB_CONFIG),
                    buttonOpacity
                  }
                }))
              }}
              ariaLabel={t("common.buttonOpacity")}
            />
          </div>
        </div>

        {/* Section 2: Customize Menu Actions (Shared SortableVisibilityList) */}
        <div className="pt-3 border-t border-border-divider">
          <SortableVisibilityList<QuickHubActionId>
            title={t("features.quickHub.settings.customizeMenu")}
            description={t("features.quickHub.settings.customizeMenuDesc")}
            items={listItems}
            onOrderChange={handleOrderChange}
            onToggleVisibility={handleToggleActionVisibility}
            onResetOrder={handleResetActionOrder}
          />
        </div>

        {/* Section 3: Proximity & Behavior */}
        <div className="space-y-2 pt-3 border-t border-border-divider">
          <span className="section-header">
            {t("features.quickHub.settings.behaviorProximity")}
          </span>
          <div className="divide-y divide-border-divider">
            <SettingToggleRow
              icon={<Eye className="w-5 h-5 text-amber-400" />}
              title={t("features.quickHub.settings.hoverProximity")}
              description={t("features.quickHub.settings.hoverProximityDesc")}
              enabled={currentConfig.hoverToReveal}
              onToggle={() => handleToggleOption("hoverToReveal")}
            />
          </div>
        </div>

        {/* Section 4: Keyboard Shortcut (Secondary Method) */}
        <div className="space-y-2 pt-3 border-t border-border-divider">
          <span className="section-header">
            {t("features.quickHub.settings.keyboardShortcut")}
          </span>
          <FeatureShortcutRow
            title={t("features.quickHub.settings.globalHotkey")}
            description={t("features.quickHub.settings.globalHotkeyDesc")}
            shortcut={shortcut}
            iconColorClass="text-amber-400"
            onConfigureShortcuts={handleOpenShortcutsPage}
          />
        </div>
      </div>
    </SubSettingsLayout>
  )
}
