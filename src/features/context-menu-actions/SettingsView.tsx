import {
  FileCode,
  FileText,
  Globe,
  HelpCircle,
  Quote,
  Sparkles,
  Type
} from "lucide-react"
import type React from "react"
import { useState } from "react"

import { useStorage } from "@plasmohq/storage/hook"

import { SubSettingsLayout } from "~components/SubSettingsLayout"
import { Switch } from "~components/Switch"
import {
  DEFAULT_CONTEXT_MENU_ACTIONS_CONFIG,
  DEFAULT_SETTINGS,
  STORAGE_KEYS,
  type ContextMenuActionId,
  type ContextMenuActionsConfig,
  type FeatureSettings
} from "~core/types"
import { useI18n } from "~core/useI18n"

interface ContextMenuActionsSettingsViewProps {
  onBack: () => void
}

interface ActionMeta {
  id: ContextMenuActionId
  title: string
  badge: string
  badgeColor: string
  description: string
  icon: React.ReactNode
}

/**
 * Sub-settings view for Context Menu Actions.
 * Clean, flat list layout with HTML5 drag-and-drop & button reordering.
 */
export const ContextMenuActionsSettingsView: React.FC<
  ContextMenuActionsSettingsViewProps
> = ({ onBack }) => {
  const { t } = useI18n()
  const [settings, setSettings] = useStorage<FeatureSettings>(
    STORAGE_KEYS.SETTINGS,
    DEFAULT_SETTINGS
  )

  const actionMetas: Record<ContextMenuActionId, ActionMeta> = {
    copyLinkText: {
      id: "copyLinkText",
      title: t("features.contextMenuActions.copyLinkText"),
      badge: t("features.contextMenuActions.settings.badges.textOnly"),
      badgeColor: "badge-muted",
      description: t(
        "features.contextMenuActions.settings.descriptions.copyLinkText"
      ),
      icon: <Type className="w-5 h-5 text-cyan-400" />
    },
    cleanLinkCopy: {
      id: "cleanLinkCopy",
      title: t("features.contextMenuActions.cleanLinkCopy"),
      badge: t("features.contextMenuActions.settings.badges.antiTracking"),
      badgeColor: "badge-success",
      description: t(
        "features.contextMenuActions.settings.descriptions.cleanLinkCopy"
      ),
      icon: <Sparkles className="w-5 h-5 text-emerald-400" />
    },
    markdownLinkCopy: {
      id: "markdownLinkCopy",
      title: t("features.contextMenuActions.markdownLinkCopy"),
      badge: t("features.contextMenuActions.settings.badges.markdown"),
      badgeColor: "badge-accent",
      description: t(
        "features.contextMenuActions.settings.descriptions.markdownLinkCopy"
      ),
      icon: <FileCode className="w-5 h-5 text-indigo-400" />
    },
    copyCleanPageUrl: {
      id: "copyCleanPageUrl",
      title: t("features.contextMenuActions.copyCleanPageUrl"),
      badge: t("features.contextMenuActions.settings.badges.page"),
      badgeColor: "badge-success",
      description: t(
        "features.contextMenuActions.settings.descriptions.copyCleanPageUrl"
      ),
      icon: <Globe className="w-5 h-5 text-emerald-400" />
    },
    copyPageMarkdown: {
      id: "copyPageMarkdown",
      title: t("features.contextMenuActions.copyPageMarkdown"),
      badge: t("features.contextMenuActions.settings.badges.page"),
      badgeColor: "badge-accent",
      description: t(
        "features.contextMenuActions.settings.descriptions.copyPageMarkdown"
      ),
      icon: <FileText className="w-5 h-5 text-sky-400" />
    },
    copySelectionQuote: {
      id: "copySelectionQuote",
      title: t("features.contextMenuActions.copySelectionQuote"),
      badge: t("features.contextMenuActions.settings.badges.selection"),
      badgeColor: "badge-muted",
      description: t(
        "features.contextMenuActions.settings.descriptions.copySelectionQuote"
      ),
      icon: <Quote className="w-5 h-5 text-amber-400" />
    }
  }

  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null)

  const isMasterEnabled =
    settings?.contextMenuActions ?? DEFAULT_SETTINGS.contextMenuActions
  const currentConfig: ContextMenuActionsConfig =
    settings?.contextMenuActionsConfig ?? DEFAULT_SETTINGS.contextMenuActionsConfig

  const defaultOrder = DEFAULT_CONTEXT_MENU_ACTIONS_CONFIG.order
  const rawOrder = Array.isArray(currentConfig.order)
    ? currentConfig.order
    : defaultOrder
  const order: ContextMenuActionId[] = [
    ...rawOrder.filter((id) => defaultOrder.includes(id)),
    ...defaultOrder.filter((id) => !rawOrder.includes(id))
  ]

  const handleToggleMaster = (enabled: boolean) => {
    setSettings((prev) => ({
      ...(prev ?? DEFAULT_SETTINGS),
      contextMenuActions: enabled
    }))
  }

  const handleToggleAction = (actionId: ContextMenuActionId) => {
    setSettings((prev) => {
      const prevConfig =
        prev?.contextMenuActionsConfig ??
        DEFAULT_SETTINGS.contextMenuActionsConfig
      const prevValue =
        prevConfig[actionId] ?? DEFAULT_CONTEXT_MENU_ACTIONS_CONFIG[actionId]
      return {
        ...(prev ?? DEFAULT_SETTINGS),
        contextMenuActionsConfig: {
          ...prevConfig,
          [actionId]: !prevValue
        }
      }
    })
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
      contextMenuActionsConfig: {
        ...(prev?.contextMenuActionsConfig ??
          DEFAULT_SETTINGS.contextMenuActionsConfig),
        order: newOrder
      }
    }))
  }

  const handleDragEnd = () => {
    setDraggedIndex(null)
    setDragOverIndex(null)
  }

  return (
    <SubSettingsLayout
      title={t("features.contextMenuActions.title")}
      enabled={isMasterEnabled}
      onToggle={handleToggleMaster}
      onBack={onBack}>
      <div className="space-y-4">
        <div>
          <span className="section-header">
            {t("features.contextMenuActions.settings.sectionTitle")}
          </span>
          <p className="text-xs text-content-muted mt-1">
            {t("features.contextMenuActions.settings.sectionDesc")}
          </p>
        </div>

        {/* Clean, flat list separated by dividers with native drag & drop */}
        <div className="divide-y divide-border-divider">
          {order.map((actionId, index) => {
            const item = actionMetas[actionId]
            if (!item) return null

            const isItemEnabled = Boolean(
              currentConfig[actionId] ??
                DEFAULT_CONTEXT_MENU_ACTIONS_CONFIG[actionId]
            )
            const isDragging = draggedIndex === index
            const isDragOver = dragOverIndex === index && draggedIndex !== index

            return (
              <div
                key={actionId}
                draggable
                onDragStart={(e) => handleDragStart(e, index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDrop={(e) => handleDrop(e, index)}
                onDragEnd={handleDragEnd}
                className={`flex items-center justify-between gap-3 py-3 group cursor-grab active:cursor-grabbing transition-all duration-150 ${
                  isDragging ? "opacity-30 scale-[0.98]" : "opacity-100"
                } ${
                  isDragOver
                    ? "border-t-2 border-t-accent bg-accent-subtle"
                    : ""
                }`}>
                {/* Left side: Icon + Title + Help Tooltip */}
                <div
                  onClick={() => handleToggleAction(actionId)}
                  className={`flex items-center gap-3 flex-1 min-w-0 ${
                    isItemEnabled ? "feature-row-active" : "feature-row-dimmed"
                  }`}>
                  <div className="shrink-0 flex items-center justify-center transition-transform duration-200 ease-out group-hover:scale-110">
                    {item.icon}
                  </div>

                  <div className="flex items-center gap-1.5 min-w-0 flex-1">
                    <span className="text-xs font-semibold text-content-primary truncate">
                      {item.title}
                    </span>
                    <span
                      title={`${item.badge}: ${item.description}`}
                      className="inline-flex items-center shrink-0 text-content-muted/70 hover:text-content-primary transition-colors">
                      <HelpCircle className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>

                {/* Right side: Switch toggle */}
                <div className="flex items-center shrink-0">
                  <Switch
                    checked={isItemEnabled}
                    onChange={() => handleToggleAction(actionId)}
                    ariaLabel={`Toggle ${item.title}`}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </SubSettingsLayout>
  )
}

