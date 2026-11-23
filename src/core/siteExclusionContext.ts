import { createContext, useContext } from "react"

import type { FeatureKey } from "./types"

export interface SiteExclusionContextValue {
  isFullyPaused: boolean
  blockedFeatures: Set<FeatureKey>
  hostname: string | null
  onOpenSiteRules?: () => void
}

export const SiteExclusionContext = createContext<SiteExclusionContextValue>({
  isFullyPaused: false,
  blockedFeatures: new Set(),
  hostname: null
})

export const useSiteExclusion = (): SiteExclusionContextValue =>
  useContext(SiteExclusionContext)

export const FeatureKeyContext = createContext<FeatureKey | null>(null)

export const useFeatureKey = (): FeatureKey | null =>
  useContext(FeatureKeyContext)
