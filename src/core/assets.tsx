/**
 * Centralized Asset Management Module
 * Encapsulates static media, icons, and asset accessors for Browse Assist.
 */

import type React from "react"
import appIconUri from "data-base64:../../assets/icon.png"

/**
 * Centralized registry of application assets.
 */
export const ASSETS = {
  icons: {
    app: appIconUri
  }
} as const

/**
 * Accessor function for the primary application icon.
 */
export function getAppIcon(): string {
  return ASSETS.icons.app
}

export interface AppIconProps {
  className?: string
  alt?: string
}

/**
 * Pre-styled App Icon component for headers and identity badges.
 */
export const AppIcon: React.FC<AppIconProps> = ({
  className = "w-8 h-8 rounded-xl object-contain shadow-md",
  alt = "Browse Assist"
}) => {
  return (
    <img
      src={ASSETS.icons.app}
      alt={alt}
      className={className}
      draggable={false}
    />
  )
}
