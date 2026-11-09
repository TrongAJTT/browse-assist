import type React from "react"
import { useCallback, useMemo, useRef, useState } from "react"

import type { EdgePlacement, ScreenEdge } from "~core/types"

export interface EdgePositionPickerProps {
  value: EdgePlacement
  onChange: (value: EdgePlacement) => void
  allowedEdges?: ScreenEdge[]
  disabled?: boolean
  className?: string
}

const DEFAULT_ALLOWED_EDGES: ScreenEdge[] = ["top", "right", "bottom", "left"]
const SNAP_POINTS = [0, 50, 100]
const SNAP_THRESHOLD = 6 // Snap window in percentage points (±6%)

/**
 * Interactive 16:9 Screen Edge Position Picker with Snapping and Alignment Guides.
 * Allows users to click or drag an anchor handle along allowed perimeter tracks.
 */
export const EdgePositionPicker: React.FC<EdgePositionPickerProps> = ({
  value,
  onChange,
  allowedEdges = DEFAULT_ALLOWED_EDGES,
  disabled = false,
  className = ""
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)

  // Current normalized edge & offset (0 to 100)
  const currentEdge: ScreenEdge = allowedEdges.includes(value.edge)
    ? value.edge
    : allowedEdges[0] || "right"
  const currentOffset = Math.max(0, Math.min(100, Math.round(value.offsetPercent)))

  // Check if currently snapped to a landmark
  const snappedPoint = useMemo(() => {
    return (
      SNAP_POINTS.find((point) => Math.abs(currentOffset - point) <= 1) ?? null
    )
  }, [currentOffset])

  /**
   * Projects a raw coordinate into the closest allowed edge and offset percentage,
   * applying snapping landmarks and clamping.
   */
  const computePlacement = useCallback(
    (clientX: number, clientY: number): EdgePlacement => {
      const container = containerRef.current
      if (!container) return value

      const rect = container.getBoundingClientRect()
      const clampX = Math.max(0, Math.min(rect.width, clientX - rect.left))
      const clampY = Math.max(0, Math.min(rect.height, clientY - rect.top))

      const relX = clampX / rect.width
      const relY = clampY / rect.height

      // Distances to perimeter edges (0 to 1)
      const dists: Record<ScreenEdge, number> = {
        top: relY,
        bottom: 1 - relY,
        left: relX,
        right: 1 - relX
      }

      // Pick closest allowed edge
      let closestEdge: ScreenEdge = allowedEdges[0] || "right"
      let minDistance = 999999

      for (const edge of allowedEdges) {
        if (dists[edge] < minDistance) {
          minDistance = dists[edge]
          closestEdge = edge
        }
      }

      // Calculate raw offset percentage along the chosen edge
      let rawOffset = 50
      switch (closestEdge) {
        case "top":
        case "bottom":
          rawOffset = relX * 100
          break
        case "left":
        case "right":
          rawOffset = relY * 100
          break
      }

      // Apply snapping
      let finalOffset = Math.round(rawOffset)
      for (const snap of SNAP_POINTS) {
        if (Math.abs(finalOffset - snap) <= SNAP_THRESHOLD) {
          finalOffset = snap
          break
        }
      }

      // Safe perimeter clamp: 0% to 100%
      finalOffset = Math.max(0, Math.min(100, finalOffset))

      return {
        edge: closestEdge,
        offsetPercent: finalOffset
      }
    },
    [allowedEdges, value]
  )

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (disabled) return
    e.preventDefault()
    setIsDragging(true)
    e.currentTarget.setPointerCapture(e.pointerId)
    const next = computePlacement(e.clientX, e.clientY)
    onChange(next)
  }

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging || disabled) return
    const next = computePlacement(e.clientX, e.clientY)
    onChange(next)
  }

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return
    setIsDragging(false)
    try {
      e.currentTarget.releasePointerCapture(e.pointerId)
    } catch {
      // Ignored if pointer capture already ended
    }
  }

  // Handle position coordinates (0 - 100%)
  const handleStyle = useMemo(() => {
    switch (currentEdge) {
      case "top":
        return { left: `${currentOffset}%`, top: "0%" }
      case "bottom":
        return { left: `${currentOffset}%`, top: "100%" }
      case "left":
        return { left: "0%", top: `${currentOffset}%` }
      case "right":
      default:
        return { left: "100%", top: `${currentOffset}%` }
    }
  }, [currentEdge, currentOffset])

  // Landmark label for footer display
  const landmarkLabel = useMemo(() => {
    if (snappedPoint === 50) return "Center"
    if (currentEdge === "top" || currentEdge === "bottom") {
      if (snappedPoint === 0) return "Left"
      if (snappedPoint === 100) return "Right"
    } else {
      if (snappedPoint === 0) return "Top"
      if (snappedPoint === 100) return "Bottom"
    }
    return null
  }, [currentEdge, snappedPoint])

  return (
    <div className={`space-y-2 select-none ${className}`}>
      {/* Outer padding wrapper so perimeter anchor handle is not clipped */}
      <div className="relative px-3 py-3">
        {/* 16:9 Screen Viewport Container (Sharp edges, no rounded corners, no macOS header) */}
        <div
          ref={containerRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          className={`relative w-full aspect-video rounded-none border border-border-subtle bg-app-surface/90 shadow-inner flex flex-col transition-all touch-none ${
            disabled ? "opacity-60 cursor-not-allowed" : "cursor-crosshair"
          } ${isDragging ? "ring-2 ring-accent/50 shadow-accent-glow" : ""}`}>
          {/* Center Viewport Canvas & Watermark */}
          <div className="flex-1 relative flex items-center justify-center pointer-events-none overflow-hidden">
            <div className="text-[10px] font-mono tracking-wider text-content-faint/25 font-semibold uppercase">
              Viewport Screen
            </div>

            {/* Dynamic Alignment Guides - ONLY visible during dragging */}
            {isDragging &&
              (currentEdge === "left" || currentEdge === "right" ? (
                <div
                  style={{ top: `${currentOffset}%` }}
                  className={`absolute left-0 right-0 border-t border-dashed pointer-events-none z-10 transition-colors ${
                    snappedPoint === 50 ? "border-accent/90" : "border-accent/50"
                  }`}
                />
              ) : (
                <div
                  style={{ left: `${currentOffset}%` }}
                  className={`absolute top-0 bottom-0 border-l border-dashed pointer-events-none z-10 transition-colors ${
                    snappedPoint === 50 ? "border-accent/90" : "border-accent/50"
                  }`}
                />
              ))}
          </div>

          {/* Perimeter Active Track Highlights */}
          {allowedEdges.includes("top") && (
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-accent/30 pointer-events-none" />
          )}
          {allowedEdges.includes("bottom") && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent/30 pointer-events-none" />
          )}
          {allowedEdges.includes("left") && (
            <div className="absolute top-0 bottom-0 left-0 w-0.5 bg-accent/30 pointer-events-none" />
          )}
          {allowedEdges.includes("right") && (
            <div className="absolute top-0 bottom-0 right-0 w-0.5 bg-accent/30 pointer-events-none" />
          )}

          {/* Snap Tick Marks along allowed edges (Center tick) */}
          {allowedEdges.includes("left") && (
            <span
              style={{ top: "50%" }}
              className="absolute left-0 w-1.5 h-0.5 bg-content-faint/40 -translate-y-1/2 pointer-events-none"
            />
          )}
          {allowedEdges.includes("right") && (
            <span
              style={{ top: "50%" }}
              className="absolute right-0 w-1.5 h-0.5 bg-content-faint/40 -translate-y-1/2 pointer-events-none"
            />
          )}
          {allowedEdges.includes("top") && (
            <span
              style={{ left: "50%" }}
              className="absolute top-0 h-1.5 w-0.5 bg-content-faint/40 -translate-x-1/2 pointer-events-none"
            />
          )}
          {allowedEdges.includes("bottom") && (
            <span
              style={{ left: "50%" }}
              className="absolute bottom-0 h-1.5 w-0.5 bg-content-faint/40 -translate-x-1/2 pointer-events-none"
            />
          )}

          {/* Floating Anchor Handle (Centered on edge border) */}
          <div
            style={handleStyle}
            className={`absolute -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none transition-transform ${
              isDragging ? "scale-125" : "scale-100"
            }`}>
            <div className="w-5 h-5 rounded-full bg-accent text-white shadow-md shadow-accent/60 border-2 border-white dark:border-slate-900 flex items-center justify-center ring-2 ring-accent/30">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            </div>
          </div>
        </div>
      </div>

      {/* Info & Quick Snap Buttons Bar */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-1.5 text-xs text-content-secondary">
          <span className="font-semibold capitalize text-content-primary">
            {currentEdge} Edge
          </span>
          <span className="text-content-faint">·</span>
          <span className="font-mono text-accent font-medium">
            {currentOffset}%
          </span>
          {landmarkLabel && (
            <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-md bg-accent-subtle text-accent border border-accent/20">
              {landmarkLabel}
            </span>
          )}
        </div>

        {/* Quick Snap Chips */}
        <div className="flex items-center gap-1">
          {SNAP_POINTS.map((snap) => {
            const isSelected = currentOffset === snap
            const label =
              snap === 50
                ? "Center"
                : currentEdge === "top" || currentEdge === "bottom"
                  ? snap === 0
                    ? "Left"
                    : "Right"
                  : snap === 0
                    ? "Top"
                    : "Bottom"

            return (
              <button
                key={snap}
                type="button"
                disabled={disabled}
                onClick={() =>
                  onChange({ edge: currentEdge, offsetPercent: snap })
                }
                className={`text-[10px] font-medium px-2 py-0.5 rounded transition-all ${
                  isSelected
                    ? "bg-accent text-white font-semibold shadow-xs"
                    : "bg-app-surface text-content-muted hover:text-content-primary hover:bg-app-surface-hover"
                }`}>
                {label}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
