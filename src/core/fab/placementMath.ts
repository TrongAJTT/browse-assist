/**
 * Pure geometry helpers for snapping a pointer coordinate onto the nearest
 * allowed perimeter edge of a reference bounding rectangle (viewport or video).
 */

import type { EdgePlacement, ScreenEdge } from "~core/types"

export interface Point2D {
  x: number
  y: number
}

export interface RectBounds {
  left: number
  top: number
  width: number
  height: number
}

/**
 * Computes the closest EdgePlacement along one of `allowedEdges` for a given
 * client pointer coordinate relative to `bounds`.
 */
export function computeEdgePlacementFromPoint(
  point: Point2D,
  bounds: RectBounds,
  allowedEdges: readonly ScreenEdge[] = ["left", "right", "top", "bottom"]
): EdgePlacement {
  const width = Math.max(1, bounds.width)
  const height = Math.max(1, bounds.height)
  const edges: readonly ScreenEdge[] =
    allowedEdges.length > 0 ? allowedEdges : ["right"]

  const relX = Math.max(0, Math.min(width, point.x - bounds.left))
  const relY = Math.max(0, Math.min(height, point.y - bounds.top))

  const distances: Record<ScreenEdge, number> = {
    left: relX,
    right: width - relX,
    top: relY,
    bottom: height - relY
  }

  let closestEdge: ScreenEdge = edges[0]
  let minDistance = distances[closestEdge]

  for (let i = 1; i < edges.length; i++) {
    const candidate = edges[i]
    if (distances[candidate] < minDistance) {
      minDistance = distances[candidate]
      closestEdge = candidate
    }
  }

  const rawPercent =
    closestEdge === "left" || closestEdge === "right"
      ? (relY / height) * 100
      : (relX / width) * 100

  return {
    edge: closestEdge,
    offsetPercent: Math.max(0, Math.min(100, Math.round(rawPercent)))
  }
}
