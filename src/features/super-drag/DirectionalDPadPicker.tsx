import {
  AppWindow,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  RotateCcw
} from "lucide-react"
import type React from "react"

import type { DirectionalActions, SuperDragAction } from "~core/types"
import type { DragDirection } from "~features/super-drag/logic"

export interface DirectionalDPadPickerProps {
  actions: DirectionalActions
  onChangeAction: (direction: DragDirection, action: SuperDragAction) => void
  onReset?: () => void
  isIncognitoAllowed: boolean
  centerIcon?: React.ReactNode
}

interface ActionOption {
  id: SuperDragAction
  label: string
  requiresIncognito?: boolean
}

export const SUPER_DRAG_ACTION_OPTIONS: ActionOption[] = [
  { id: "open_bg_tab", label: "Background Tab" },
  { id: "open_active_tab", label: "Active Tab" },
  { id: "open_split_view", label: "Split View" },
  { id: "open_window_active", label: "New Window (Focus)" },
  { id: "open_window_bg", label: "New Window (Bg)" },
  { id: "open_incognito_active", label: "Incognito Window", requiresIncognito: true },
  { id: "open_incognito_bg", label: "Incognito (Bg)", requiresIncognito: true },
  { id: "copy_to_clipboard", label: "Copy to Clipboard" },
  { id: "none", label: "None (Do Nothing)" }
]

interface DirectionMeta {
  key: DragDirection
  label: string
  Icon: React.ComponentType<{ className?: string }>
}

const DIRECTIONS: Record<DragDirection, DirectionMeta> = {
  up: { key: "up", label: "Top", Icon: ArrowUp },
  left: { key: "left", label: "Left", Icon: ArrowLeft },
  right: { key: "right", label: "Right", Icon: ArrowRight },
  down: { key: "down", label: "Bottom", Icon: ArrowDown }
}

/**
 * Intuitive D-Pad Directional Action Picker for Super Drag.
 * Directly integrates the action dropdown inside each directional node (Top, Left, Right, Bottom).
 * Line 1: Icon + Direction Label.
 * Line 2: Action dropdown selector.
 */
export const DirectionalDPadPicker: React.FC<DirectionalDPadPickerProps> = ({
  actions,
  onChangeAction,
  onReset,
  isIncognitoAllowed,
  centerIcon
}) => {
  const renderDirectionNode = (direction: DragDirection, widthClass = "w-[126px]") => {
    const { key, label, Icon } = DIRECTIONS[direction]
    const currentAction = actions[key] ?? "open_bg_tab"

    return (
      <div
        className={`${widthClass} flex flex-col gap-1 p-1.5 rounded-lg border border-border-subtle bg-app-surface hover:border-border-focus focus-within:border-accent focus-within:ring-1 focus-within:ring-accent/40 transition-all`}>
        {/* Top line: Icon + Direction Label */}
        <div className="flex items-center justify-center gap-1 text-xs font-semibold text-content-primary select-none">
          <Icon className="w-3.5 h-3.5 text-accent shrink-0" />
          <span>{label}</span>
        </div>

        {/* Bottom line: Action Dropdown (Left-aligned text) */}
        <select
          value={currentAction}
          onChange={(e) =>
            onChangeAction(key, e.target.value as SuperDragAction)
          }
          className="w-full text-[11px] font-medium bg-app-elevated text-content-primary border border-border-subtle/80 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-accent cursor-pointer truncate text-left">
          {SUPER_DRAG_ACTION_OPTIONS.map((opt) => {
            const isDisabled = opt.requiresIncognito && !isIncognitoAllowed

            return (
              <option
                key={opt.id}
                value={opt.id}
                disabled={isDisabled}
                className={isDisabled ? "text-content-muted/50" : ""}>
                {opt.label} {isDisabled ? "(No Incognito)" : ""}
              </option>
            )
          })}
        </select>
      </div>
    )
  }

  return (
    <div className="space-y-2.5">
      {/* Header & Reset */}
      <div className="flex items-center justify-between">
        <span className="text-[10px] uppercase font-bold text-content-muted tracking-wider">
          Directional Gestures
        </span>
        {onReset && (
          <button
            type="button"
            onClick={onReset}
            className="flex items-center gap-1 text-[11px] font-medium text-accent hover:text-accent-hover transition-colors">
            <RotateCcw className="w-3 h-3" />
            <span>Reset</span>
          </button>
        )}
      </div>

      {/* Symmetrical Cross Layout */}
      <div className="flex flex-col items-center gap-1.5 py-1">
        {/* Row 1: Top */}
        <div className="flex justify-center w-full">
          {renderDirectionNode("up")}
        </div>

        {/* Row 2: Left + Center (Square) + Right */}
        <div className="flex items-center justify-center gap-1.5 w-full">
          {renderDirectionNode("left")}

          {/* Center Target Icon: Guaranteed 1:1 Aspect Square */}
          <div className="w-11 h-11 aspect-square shrink-0 flex items-center justify-center rounded-lg border border-dashed border-border-subtle/80 bg-app-surface/40 select-none">
            {centerIcon ?? <AppWindow className="w-4 h-4 text-content-muted/40" />}
          </div>

          {renderDirectionNode("right")}
        </div>

        {/* Row 3: Bottom */}
        <div className="flex justify-center w-full">
          {renderDirectionNode("down")}
        </div>
      </div>
    </div>
  )
}
