export type FeatureKey =
  | "allowRightClick"
  | "copyLinkText"
  | "smoothScroll"
  | "mouseZoom";

export interface FeatureSettings {
  allowRightClick: boolean;
  copyLinkText: boolean;
  smoothScroll: boolean;
  mouseZoom: boolean;
}

export const DEFAULT_SETTINGS: FeatureSettings = {
  allowRightClick: true,
  copyLinkText: true,
  smoothScroll: true,
  mouseZoom: true
};

export const STORAGE_KEYS = {
  SETTINGS: "browse_assist_settings"
} as const;

export interface FeatureMeta {
  key: FeatureKey;
  title: string;
  description: string;
  icon: string;
}

export const FEATURES_LIST: FeatureMeta[] = [
  {
    key: "allowRightClick",
    title: "Allow Right Click",
    description: "Re-enable context menu, select, and copy on restricted websites.",
    icon: "🖱️"
  },
  {
    key: "copyLinkText",
    title: "Copy Link Text",
    description: "Right-click any hyperlink to quickly copy its display text.",
    icon: "📋"
  },
  {
    key: "smoothScroll",
    title: "Smooth Scrolling",
    description: "Enhanced, fluid page scrolling across all websites.",
    icon: "📜"
  },
  {
    key: "mouseZoom",
    title: "Mouse Pin-to-Zoom",
    description: "Hold Alt and scroll mouse wheel to zoom into cursor position.",
    icon: "🔍"
  }
];
