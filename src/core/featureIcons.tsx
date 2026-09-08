import {
  Link2,
  MousePointer2,
  MousePointerClick,
  PictureInPicture2,
  Scroll,
  ZoomIn
} from "lucide-react"
import type React from "react"

import type { FeatureKey } from "./types"

export interface FeatureIconProps {
  className?: string
}

export const FEATURE_ICONS: Record<
  FeatureKey,
  {
    icon: React.ComponentType<FeatureIconProps>
    colorClass: string
    bgClass: string
  }
> = {
  allowRightClick: {
    icon: MousePointerClick,
    colorClass: "text-emerald-400",
    bgClass: "bg-emerald-500/10 border-emerald-500/30"
  },
  contextMenuActions: {
    icon: Link2,
    colorClass: "text-cyan-400",
    bgClass: "bg-cyan-500/10 border-cyan-500/30"
  },
  superDrag: {
    icon: MousePointer2,
    colorClass: "text-pink-400",
    bgClass: "bg-pink-500/10 border-pink-500/30"
  },
  smoothScroll: {
    icon: Scroll,
    colorClass: "text-amber-400",
    bgClass: "bg-amber-500/10 border-amber-500/30"
  },
  mouseZoom: {
    icon: ZoomIn,
    colorClass: "text-violet-400",
    bgClass: "bg-violet-500/10 border-violet-500/30"
  },
  pictureInPicture: {
    icon: PictureInPicture2,
    colorClass: "text-indigo-400",
    bgClass: "bg-indigo-500/10 border-indigo-500/30"
  }
}
