import {
  ArrowDown,
  ArrowUp,
  Eye,
  Link2,
  PictureInPicture2,
  Pipette,
  Zap,
  ZoomIn
} from "lucide-react"
import type React from "react"
import { useEffect, useMemo, useState } from "react"

import { useStorage } from "@plasmohq/storage/hook"

import { EdgePositionPicker } from "~components/EdgePositionPicker"
import { FeatureShortcutRow } from "~components/FeatureShortcutRow"
import { SettingToggleRow } from "~components/SettingToggleRow"
import {
  SortableVisibilityList,
  type SortableVisibilityItem
} from "~components/SortableVisibilityList"
import { SubSettingsLayout } from "~components/SubSettingsLayout"
import { isColorPickerSupported } from "~core/browserDetect"
import { openBrowserShortcutsPage } from "~core/shortcutsHelper"
import {
  DEFAULT_QUICK_HUB_ACTION_ORDER,
  DEFAULT_QUICK_HUB_CONFIG,
  DEFAULT_SETTINGS,
  normalizeEdgePlacement,
  STORAGE_KEYS,
  type EdgePlacement,
  type FeatureSettings,
  type QuickHubActionId,
  type QuickHubConfig
} from "~core/types"

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

const QUICK_HUB_ACTIONS_META: Record<QuickHubActionId, QuickHubActionMeta> = {
  pip: {
    id: "pip",
    title: "Watch Video in PiP",
    description: "Watch video in floating picture-in-picture window",
    icon: PictureInPicture2,
    colorClass: "text-indigo-400",
    getSourceState: (s) => {
      if (!s.pictureInPicture) {
        return {
          isDisabled: true,
          reason: "Universal PiP is disabled in extension settings"
        }
      }
      if (s.featureLayout?.hidden?.includes("pictureInPicture")) {
        return {
          isDisabled: true,
          reason: "Universal PiP is hidden in popup menu"
        }
      }
      return { isDisabled: false }
    }
  },
  colorPicker: {
    id: "colorPicker",
    title: "Pick Color from Screen",
    description: "Eyedropper pixel magnifier and instant hex copy",
    icon: Pipette,
    colorClass: "text-pink-400",
    getSourceState: (s) => {
      if (!s.colorPicker) {
        return {
          isDisabled: true,
          reason: "Color Picker is disabled in extension settings"
        }
      }
      if (s.featureLayout?.hidden?.includes("colorPicker")) {
        return {
          isDisabled: true,
          reason: "Color Picker is hidden in popup menu"
        }
      }
      return { isDisabled: false }
    }
  },
  elementZapper: {
    id: "elementZapper",
    title: "Zap Element / Toys",
    description: "Remove overlays and inspect DOM elements",
    icon: Zap,
    colorClass: "text-amber-400",
    getSourceState: (s) => {
      if (!s.elementZapper) {
        return {
          isDisabled: true,
          reason: "Element Toys is disabled in extension settings"
        }
      }
      if (s.featureLayout?.hidden?.includes("elementZapper")) {
        return {
          isDisabled: true,
          reason: "Element Toys is hidden in popup menu"
        }
      }
      return { isDisabled: false }
    }
  },
  scrollTop: {
    id: "scrollTop",
    title: "Scroll to Top",
    description: "Smoothly jump to page top",
    icon: ArrowUp,
    colorClass: "text-sky-400",
    getSourceState: (s) => {
      if (!s.quickScroll) {
        return {
          isDisabled: true,
          reason: "Quick Scroll is disabled in extension settings"
        }
      }
      if (s.featureLayout?.hidden?.includes("quickScroll")) {
        return {
          isDisabled: true,
          reason: "Quick Scroll is hidden in popup menu"
        }
      }
      return { isDisabled: false }
    }
  },
  scrollBottom: {
    id: "scrollBottom",
    title: "Scroll to Bottom",
    description: "Smoothly jump to page bottom",
    icon: ArrowDown,
    colorClass: "text-sky-400",
    getSourceState: (s) => {
      if (!s.quickScroll) {
        return {
          isDisabled: true,
          reason: "Quick Scroll is disabled in extension settings"
        }
      }
      if (s.featureLayout?.hidden?.includes("quickScroll")) {
        return {
          isDisabled: true,
          reason: "Quick Scroll is hidden in popup menu"
        }
      }
      if (s.quickScrollConfig?.buttonsMode === "top-only") {
        return {
          isDisabled: true,
          reason: "Quick Scroll is configured as 'Top-only'"
        }
      }
      return { isDisabled: false }
    }
  },
  resetZoom: {
    id: "resetZoom",
    title: "Reset Page Zoom",
    description: "Restore 100% viewport zoom",
    icon: ZoomIn,
    colorClass: "text-violet-400",
    getSourceState: (s) => {
      if (!s.mouseZoom) {
        return {
          isDisabled: true,
          reason: "Mouse Zoom is disabled in extension settings"
        }
      }
      if (s.featureLayout?.hidden?.includes("mouseZoom")) {
        return {
          isDisabled: true,
          reason: "Mouse Zoom is hidden in popup menu"
        }
      }
      return { isDisabled: false }
    }
  },
  cleanUrl: {
    id: "cleanUrl",
    title: "Copy Clean URL",
    description: "Copy link without tracking queries (utm_*, fbclid)",
    icon: Link2,
    colorClass: "text-cyan-400",
    getSourceState: (s) => {
      if (!s.contextMenuActions) {
        return {
          isDisabled: true,
          reason: "Context Menu Actions is disabled in extension settings"
        }
      }
      if (s.featureLayout?.hidden?.includes("contextMenuActions")) {
        return {
          isDisabled: true,
          reason: "Context Menu Actions is hidden in popup menu"
        }
      }
      return { isDisabled: false }
    }
  }
}

/**
 * Sub-settings view for Quick Hub.
 */
export const QuickHubSettingsView: React.FC<QuickHubSettingsViewProps> = ({
  onBack
}) => {
  const [settings, setSettings] = useStorage<FeatureSettings>(
    STORAGE_KEYS.SETTINGS,
    DEFAULT_SETTINGS
  )
  const [shortcut, setShortcut] = useState<string>("")

  useEffect(() => {
    if (chrome.commands?.getAll) {
      chrome.commands.getAll((commands) => {
        const cmd = commands.find((c) => c.name === "toggle_quick_hub")
        if (cmd?.shortcut) {
          setShortcut(cmd.shortcut)
        } else {
          setShortcut("Not configured")
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
    const savedOrder =
      currentConfig.actionOrder ?? DEFAULT_QUICK_HUB_ACTION_ORDER
    const missing = DEFAULT_QUICK_HUB_ACTION_ORDER.filter(
      (id) => !savedOrder.includes(id)
    )
    return [...savedOrder, ...missing].filter(
      (id) => id !== "colorPicker" || isColorPickerSupported
    )
  }, [currentConfig.actionOrder])

  const hiddenActionsSet = useMemo(
    () => new Set(currentConfig.hiddenActions ?? []),
    [currentConfig.hiddenActions]
  )

  const handleToggleActionVisibility = (actionId: QuickHubActionId) => {
    const meta = QUICK_HUB_ACTIONS_META[actionId]
    if (settings && meta?.getSourceState(settings).isDisabled) {
      // Do nothing if disabled or hidden in parent settings, preserving state
      return
    }

    const isCurrentlyHidden = hiddenActionsSet.has(actionId)
    const newHidden = isCurrentlyHidden
      ? (currentConfig.hiddenActions ?? []).filter((id) => id !== actionId)
      : [...(currentConfig.hiddenActions ?? []), actionId]

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
          const meta = QUICK_HUB_ACTIONS_META[actionId]
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
              Disabled
            </span>
          ) : undefined
        }
      })
      .filter(
        (item): item is SortableVisibilityItem<QuickHubActionId> =>
          item !== null
      )
  }, [actionOrder, hiddenActionsSet, settings])

  return (
    <SubSettingsLayout
      title="Quick Hub"
      enabled={isMasterEnabled}
      onToggle={handleToggleMaster}
      onBack={onBack}>
      <div className="space-y-4">
        {/* Section 1: Screen Position Placement (Edge Position Picker with Snapping) */}
        <div className="space-y-2">
          <span className="section-header">Screen Position</span>
          <div className="space-y-1.5">
            <span className="text-xs font-semibold text-content-primary">
              Floating Button Placement
            </span>
            <p className="text-[11px] text-content-muted leading-snug">
              Drag or click along the perimeter to anchor the Quick Hub trigger
              anywhere on screen.
            </p>
            <EdgePositionPicker
              allowedEdges={["top", "right", "bottom", "left"]}
              value={currentPlacement}
              onChange={handlePlacementChange}
            />
          </div>
        </div>

        {/* Section 2: Customize Menu Actions (Shared SortableVisibilityList) */}
        <div className="pt-3 border-t border-border-divider">
          <SortableVisibilityList<QuickHubActionId>
            title="Customize Menu"
            description="Drag items to reorder them in the Quick Hub list, or toggle visibility to hide features you don't use."
            items={listItems}
            onOrderChange={handleOrderChange}
            onToggleVisibility={handleToggleActionVisibility}
            onResetOrder={handleResetActionOrder}
          />
        </div>

        {/* Section 3: Proximity & Behavior */}
        <div className="space-y-2 pt-3 border-t border-border-divider">
          <span className="section-header">Behavior & Proximity</span>
          <div className="divide-y divide-border-divider">
            <SettingToggleRow
              icon={<Eye className="w-5 h-5 text-amber-400" />}
              title="Hover Proximity Reveal"
              description="Reveal the floating button only when moving cursor near the corner. When disabled, the button stays visible at 30% idle opacity."
              enabled={currentConfig.hoverToReveal}
              onToggle={() => handleToggleOption("hoverToReveal")}
            />
          </div>
        </div>

        {/* Section 4: Keyboard Shortcut (Secondary Method) */}
        <div className="space-y-2 pt-3 border-t border-border-divider">
          <span className="section-header">Keyboard Shortcut</span>
          <FeatureShortcutRow
            title="Global Hotkey (Optional)"
            description="Toggle the Quick Hub menu on active webpage."
            shortcut={shortcut}
            iconColorClass="text-amber-400"
            onConfigureShortcuts={handleOpenShortcutsPage}
          />
        </div>
      </div>
    </SubSettingsLayout>
  )
}
