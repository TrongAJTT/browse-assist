import { Eye, EyeOff, Move, RotateCcw } from "lucide-react"
import React, { useState } from "react"

export interface SortableVisibilityItem<T extends string = string> {
  id: T
  title: string
  description?: string
  icon: React.ComponentType<{ className?: string }> | React.ReactNode
  colorClass?: string
  isHidden: boolean
  isDisabled?: boolean
  disabledReason?: string
  badge?: React.ReactNode
}

export interface SortableVisibilityListProps<T extends string = string> {
  title?: string
  description?: string
  items: SortableVisibilityItem<T>[]
  onOrderChange: (newOrder: T[]) => void
  onToggleVisibility: (id: T) => void
  onResetOrder?: () => void
  resetLabel?: string
  headerActions?: React.ReactNode
  className?: string
}

/**
 * Reusable sortable list with HTML5 drag-and-drop reordering and visibility eye toggles.
 * Shared between General Preferences (popup feature list) and Quick Hub (actions list).
 */
export function SortableVisibilityList<T extends string = string>({
  title,
  description,
  items,
  onOrderChange,
  onToggleVisibility,
  onResetOrder,
  resetLabel = "Reset order",
  headerActions,
  className = ""
}: SortableVisibilityListProps<T>): React.ReactElement {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null)

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

    const newItems = [...items]
    const [moved] = newItems.splice(draggedIndex, 1)
    newItems.splice(dropIndex, 0, moved)

    setDraggedIndex(null)
    setDragOverIndex(null)

    onOrderChange(newItems.map((item) => item.id))
  }

  const handleDragEnd = () => {
    setDraggedIndex(null)
    setDragOverIndex(null)
  }

  const renderIcon = (
    icon: React.ComponentType<{ className?: string }> | React.ReactNode,
    colorClass?: string,
    isDisabled?: boolean
  ) => {
    if (React.isValidElement(icon)) {
      return (
        <span className={isDisabled ? "opacity-50" : ""}>{icon}</span>
      )
    }
    if (
      typeof icon === "function" ||
      (typeof icon === "object" && icon !== null)
    ) {
      const IconComp = icon as React.ComponentType<{ className?: string }>
      return (
        <IconComp
          className={`w-5 h-5 ${colorClass ?? ""} ${isDisabled ? "opacity-50" : ""}`}
        />
      )
    }
    return null
  }

  return (
    <div className={`space-y-2.5 ${className}`}>
      {(title || headerActions || onResetOrder) && (
        <div className="flex items-center justify-between">
          {title && <span className="section-header">{title}</span>}
          <div className="flex items-center gap-3 ml-auto">
            {headerActions}
            {onResetOrder && (
              <button
                type="button"
                onClick={onResetOrder}
                className="flex items-center gap-1 text-[11px] font-medium text-accent hover:text-accent-hover transition-colors">
                <RotateCcw className="w-3 h-3" />
                <span>{resetLabel}</span>
              </button>
            )}
          </div>
        </div>
      )}

      {description && (
        <p className="text-xs text-content-muted leading-snug">{description}</p>
      )}

      <div className="divide-y divide-border-divider">
        {items.map((item, index) => {
          const isDragging = draggedIndex === index
          const isDragOver = dragOverIndex === index && draggedIndex !== index

          return (
            <div
              key={item.id}
              draggable
              onDragStart={(e) => handleDragStart(e, index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDrop={(e) => handleDrop(e, index)}
              onDragEnd={handleDragEnd}
              className={`flex items-center justify-between gap-3 py-2.5 group cursor-grab active:cursor-grabbing transition-all duration-150 ${
                isDragging ? "opacity-30 scale-[0.98]" : "opacity-100"
              } ${
                isDragOver ? "border-t-2 border-t-accent bg-accent-subtle" : ""
              }`}>
              {/* Left: Drag Handle Indicator + Icon + Title + Description */}
              <div
                onClick={() => {
                  if (!item.isDisabled) {
                    onToggleVisibility(item.id)
                  }
                }}
                title={item.isDisabled ? item.disabledReason : undefined}
                className={`flex items-center gap-2.5 flex-1 min-w-0 ${
                  item.isDisabled ? "cursor-default opacity-50" : "cursor-pointer"
                } ${
                  !item.isHidden && !item.isDisabled
                    ? "feature-row-active"
                    : "feature-row-dimmed"
                }`}>
                <Move className="w-3.5 h-3.5 text-content-muted opacity-40 group-hover:opacity-100 shrink-0 transition-opacity" />
                <div className="shrink-0 flex items-center justify-center transition-transform duration-200 ease-out group-hover:scale-110">
                  {renderIcon(item.icon, item.colorClass, item.isDisabled)}
                </div>
                <div className="flex flex-col min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-semibold text-content-primary truncate">
                      {item.title}
                    </span>
                    {item.badge}
                  </div>
                  {item.description && (
                    <span className="text-[10px] text-content-muted truncate">
                      {item.isDisabled && item.disabledReason
                        ? item.disabledReason
                        : item.description}
                    </span>
                  )}
                </div>
              </div>

              {/* Right: Visibility Eye button */}
              <div className="flex items-center shrink-0">
                <button
                  type="button"
                  disabled={item.isDisabled}
                  onClick={(e) => {
                    e.stopPropagation()
                    if (!item.isDisabled) {
                      onToggleVisibility(item.id)
                    }
                  }}
                  title={
                    item.isDisabled
                      ? item.disabledReason
                      : item.isHidden
                        ? `Show ${item.title}`
                        : `Hide ${item.title}`
                  }
                  aria-label={`${item.isHidden ? "Show" : "Hide"} ${item.title}`}
                  className={`p-1.5 rounded-lg border transition-all duration-150 ${
                    item.isDisabled
                      ? "bg-app-card text-content-muted border-border-subtle opacity-35 cursor-not-allowed"
                      : item.isHidden
                        ? "bg-app-card text-content-muted border-border-subtle hover:text-content-primary hover:border-accent cursor-pointer"
                        : "bg-accent-subtle text-accent border-accent/20 hover:bg-accent/20 cursor-pointer"
                  }`}>
                  {item.isHidden ? (
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
  )
}
