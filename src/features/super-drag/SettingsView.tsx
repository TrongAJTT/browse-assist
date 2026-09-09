import {
  ExternalLink,
  Eye,
  ImageIcon,
  Link2,
  Search,
  Type
} from "lucide-react"
import React, { useEffect, useState } from "react"

import { useStorage } from "@plasmohq/storage/hook"

import { SettingToggleRow } from "~components/SettingToggleRow"
import { SubSettingsLayout } from "~components/SubSettingsLayout"
import {
  DEFAULT_DIRECTIONAL_ACTIONS,
  DEFAULT_SETTINGS,
  STORAGE_KEYS,
  type FeatureSettings,
  type SuperDragAction,
  type SuperDragConfig
} from "~core/types"
import { DirectionalDPadPicker } from "~features/super-drag/DirectionalDPadPicker"
import type { DragDirection } from "~features/super-drag/logic"

interface SuperDragSettingsViewProps {
  onBack: () => void
}

/**
 * Sub-settings view for Super Drag.
 * Configures drag targets with intuitive nested directional gesture D-pads,
 * and visual feedback preferences.
 */
export const SuperDragSettingsView: React.FC<SuperDragSettingsViewProps> = ({
  onBack
}) => {
  const [settings, setSettings] = useStorage<FeatureSettings>(
    STORAGE_KEYS.SETTINGS,
    DEFAULT_SETTINGS
  )

  const [isIncognitoAllowed, setIsIncognitoAllowed] = useState(false)

  // Check if extension is allowed in Incognito mode
  useEffect(() => {
    if (chrome.extension?.isAllowedIncognitoAccess) {
      chrome.extension.isAllowedIncognitoAccess((isAllowed) => {
        setIsIncognitoAllowed(isAllowed)
      })
    }
  }, [])

  const isMasterEnabled = settings?.superDrag ?? DEFAULT_SETTINGS.superDrag
  const currentConfig: SuperDragConfig =
    settings?.superDragConfig ?? DEFAULT_SETTINGS.superDragConfig

  const handleToggleMaster = (enabled: boolean) => {
    setSettings((prev) => ({
      ...(prev ?? DEFAULT_SETTINGS),
      superDrag: enabled
    }))
  }

  const handleToggleOption = (
    key: "searchSelectedText" | "openHyperlinks" | "openImages" | "showIndicator"
  ) => {
    setSettings((prev) => ({
      ...(prev ?? DEFAULT_SETTINGS),
      superDragConfig: {
        ...(prev?.superDragConfig ?? DEFAULT_SETTINGS.superDragConfig),
        [key]: !currentConfig[key]
      }
    }))
  }

  const handleChangeDirectionAction = (
    targetKey: "textActions" | "linkActions" | "imageActions",
    direction: DragDirection,
    action: SuperDragAction
  ) => {
    const currentActions =
      currentConfig[targetKey] ?? DEFAULT_DIRECTIONAL_ACTIONS

    setSettings((prev) => ({
      ...(prev ?? DEFAULT_SETTINGS),
      superDragConfig: {
        ...(prev?.superDragConfig ?? DEFAULT_SETTINGS.superDragConfig),
        [targetKey]: {
          ...currentActions,
          [direction]: action
        }
      }
    }))
  }

  const handleResetTargetActions = (
    targetKey: "textActions" | "linkActions" | "imageActions"
  ) => {
    setSettings((prev) => ({
      ...(prev ?? DEFAULT_SETTINGS),
      superDragConfig: {
        ...(prev?.superDragConfig ?? DEFAULT_SETTINGS.superDragConfig),
        [targetKey]: { ...DEFAULT_DIRECTIONAL_ACTIONS }
      }
    }))
  }

  return (
    <SubSettingsLayout
      title="Super Drag"
      enabled={isMasterEnabled}
      onToggle={handleToggleMaster}
      onBack={onBack}>
      <div className="space-y-4">
        {/* Section 1: Drag Targets & Directional Config */}
        <div className="space-y-2">
          <span className="section-header">Drag Targets</span>

          <div className="divide-y divide-border-divider">
            {/* 1. Search Highlighted Text */}
            <div className="py-2 first:pt-0">
              <SettingToggleRow
                icon={<Search className="w-5 h-5 text-amber-400" />}
                title="Search Highlighted Text"
                description="Drag selected text in 4 directions to search, open windows, or copy."
                enabled={currentConfig.searchSelectedText}
                onToggle={() => handleToggleOption("searchSelectedText")}
              />
              {currentConfig.searchSelectedText && (
                <div className="mt-2.5 pt-2 pb-1.5 pl-3 border-l-2 border-border-subtle ml-2">
                  <DirectionalDPadPicker
                    actions={
                      currentConfig.textActions ?? DEFAULT_DIRECTIONAL_ACTIONS
                    }
                    onChangeAction={(dir, act) =>
                      handleChangeDirectionAction("textActions", dir, act)
                    }
                    onReset={() => handleResetTargetActions("textActions")}
                    isIncognitoAllowed={isIncognitoAllowed}
                    centerIcon={
                      <Type className="w-4 h-4 text-content-muted/40" />
                    }
                  />
                </div>
              )}
            </div>

            {/* 2. Open Hyperlinks */}
            <div className="py-2">
              <SettingToggleRow
                icon={<ExternalLink className="w-5 h-5 text-emerald-400" />}
                title="Open Hyperlinks"
                description="Drag hyperlinks to open in tabs, split screen, or copy destination URL."
                enabled={currentConfig.openHyperlinks}
                onToggle={() => handleToggleOption("openHyperlinks")}
              />
              {currentConfig.openHyperlinks && (
                <div className="mt-2.5 pt-2 pb-1.5 pl-3 border-l-2 border-border-subtle ml-2">
                  <DirectionalDPadPicker
                    actions={
                      currentConfig.linkActions ?? DEFAULT_DIRECTIONAL_ACTIONS
                    }
                    onChangeAction={(dir, act) =>
                      handleChangeDirectionAction("linkActions", dir, act)
                    }
                    onReset={() => handleResetTargetActions("linkActions")}
                    isIncognitoAllowed={isIncognitoAllowed}
                    centerIcon={
                      <Link2 className="w-4 h-4 text-content-muted/40" />
                    }
                  />
                </div>
              )}
            </div>

            {/* 3. Drag Images */}
            <div className="py-2">
              <SettingToggleRow
                icon={<ImageIcon className="w-5 h-5 text-amber-400" />}
                title="Drag Images"
                description="Drag images to view in tabs, split screen, or copy direct image URLs."
                enabled={currentConfig.openImages}
                onToggle={() => handleToggleOption("openImages")}
              />
              {currentConfig.openImages && (
                <div className="mt-2.5 pt-2 pb-1.5 pl-3 border-l-2 border-border-subtle ml-2">
                  <DirectionalDPadPicker
                    actions={
                      currentConfig.imageActions ?? DEFAULT_DIRECTIONAL_ACTIONS
                    }
                    onChangeAction={(dir, act) =>
                      handleChangeDirectionAction("imageActions", dir, act)
                    }
                    onReset={() => handleResetTargetActions("imageActions")}
                    isIncognitoAllowed={isIncognitoAllowed}
                    centerIcon={
                      <ImageIcon className="w-4 h-4 text-content-muted/40" />
                    }
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Section 2: Visual Feedback / Indicator */}
        <div className="space-y-2 pt-2 border-t border-border-divider">
          <span className="section-header">Display & Feedback</span>

          <div className="divide-y divide-border-divider">
            <SettingToggleRow
              icon={<Eye className="w-5 h-5 text-violet-400" />}
              title="Show Drag Indicator"
              description="Display floating badge previewing the directional action during drag."
              enabled={currentConfig.showIndicator}
              onToggle={() => handleToggleOption("showIndicator")}
            />
          </div>
        </div>
      </div>
    </SubSettingsLayout>
  )
}

