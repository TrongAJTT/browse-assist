import {
  FileCode,
  Sparkles,
  Type
} from "lucide-react"
import type React from "react"
import { useState } from "react"

import { useStorage } from "@plasmohq/storage/hook"

import { SubSettingsLayout } from "~components/SubSettingsLayout"
import {
  DEFAULT_SETTINGS,
  STORAGE_KEYS,
  type ContextMenuActionId,
  type ContextMenuActionsConfig,
  type FeatureSettings
} from "~core/types"

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

const ACTION_METAS: Record<ContextMenuActionId, ActionMeta> = {
  copyLinkText: {
    id: "copyLinkText",
    title: "Copy Link Text",
    badge: "Text only",
    badgeColor: "bg-slate-800 text-slate-400 border-slate-700/60",
    description: "Extracts and copies the anchor text without copying the URL.",
    icon: <Type className="w-5 h-5 text-cyan-400" />
  },
  cleanLinkCopy: {
    id: "cleanLinkCopy",
    title: "Clean Link Copy",
    badge: "Anti-Tracking",
    badgeColor: "bg-emerald-950/60 text-emerald-400 border-emerald-800/50",
    description: "Strips tracking parameters (utm_*, fbclid, si) before copying.",
    icon: <Sparkles className="w-5 h-5 text-emerald-400" />
  },
  markdownLinkCopy: {
    id: "markdownLinkCopy",
    title: "Markdown Link Copy",
    badge: "[Text](URL)",
    badgeColor: "bg-indigo-950/60 text-indigo-400 border-indigo-800/50",
    description: "Copies formatted markdown hyperlink, ideal for Obsidian, Notion & GitHub.",
    icon: <FileCode className="w-5 h-5 text-indigo-400" />
  }
}

/**
 * Sub-settings view for Context Menu Actions.
 * Clean, flat list layout with HTML5 drag-and-drop & button reordering.
 */
export const ContextMenuActionsSettingsView: React.FC<
  ContextMenuActionsSettingsViewProps
> = ({ onBack }) => {
  const [settings, setSettings] = useStorage<FeatureSettings>(
    STORAGE_KEYS.SETTINGS,
    DEFAULT_SETTINGS
  )

  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null)

  const isMasterEnabled =
    settings?.contextMenuActions ?? DEFAULT_SETTINGS.contextMenuActions
  const currentConfig: ContextMenuActionsConfig =
    settings?.contextMenuActionsConfig ?? DEFAULT_SETTINGS.contextMenuActionsConfig

  const order: ContextMenuActionId[] = currentConfig.order || [
    "copyLinkText",
    "cleanLinkCopy",
    "markdownLinkCopy"
  ]

  const handleToggleMaster = (enabled: boolean) => {
    setSettings((prev) => ({
      ...(prev ?? DEFAULT_SETTINGS),
      contextMenuActions: enabled
    }))
  }

  const handleToggleAction = (actionId: ContextMenuActionId) => {
    setSettings((prev) => ({
      ...(prev ?? DEFAULT_SETTINGS),
      contextMenuActionsConfig: {
        ...(prev?.contextMenuActionsConfig ??
          DEFAULT_SETTINGS.contextMenuActionsConfig),
        [actionId]: !(
          (prev?.contextMenuActionsConfig ??
            DEFAULT_SETTINGS.contextMenuActionsConfig)[actionId]
        )
      }
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
      title="Context Menu Actions"
      enabled={isMasterEnabled}
      onToggle={handleToggleMaster}
      onBack={onBack}>
      <div className="space-y-4">
        <div>
          <span className="text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
            Right-Click Menu Items
          </span>
          <p className="text-xs text-slate-400 mt-1">
            Drag items to reorder or toggle their visibility in your right-click context menu.
          </p>
        </div>

        {/* Clean, flat list separated by dividers with native drag & drop */}
        <div className="divide-y divide-slate-800/80">
          {order.map((actionId, index) => {
            const item = ACTION_METAS[actionId]
            if (!item) return null

            const isItemEnabled = currentConfig[actionId]
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
                    ? "border-t-2 border-t-indigo-500 bg-indigo-500/5"
                    : ""
                }`}>
                {/* Left side: Icon + Title + Description */}
                <div
                  onClick={() => handleToggleAction(actionId)}
                  className={`flex items-start gap-3 flex-1 min-w-0 ${
                    isItemEnabled ? "feature-row-active" : "feature-row-dimmed"
                  }`}>
                  <div className="shrink-0 mt-0.5 flex items-center justify-center transition-transform duration-200 ease-out group-hover:scale-110">
                    {item.icon}
                  </div>

                  <div className="flex flex-col min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-slate-200">
                        {item.title}
                      </span>
                      <span
                        className={`font-mono text-[10px] px-1.5 py-0.2 rounded border ${item.badgeColor}`}>
                        {item.badge}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-400 leading-snug mt-0.5">
                      {item.description}
                    </span>
                  </div>
                </div>

                {/* Right side: Switch toggle */}
                <div className="flex items-center shrink-0">
                  <button
                    type="button"
                    role="switch"
                    aria-checked={isItemEnabled}
                    onClick={(e) => {
                      e.stopPropagation()
                      handleToggleAction(actionId)
                    }}
                    className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-900 ${
                      isItemEnabled
                        ? "bg-indigo-600 shadow-indigo-500/20 shadow-sm"
                        : "bg-slate-700"
                    }`}>
                    <span
                      className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                        isItemEnabled ? "translate-x-4" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </SubSettingsLayout>
  )
}

