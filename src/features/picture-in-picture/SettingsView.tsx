import {
  Eye,
  MousePointerClick,
  PictureInPicture2,
  ShieldAlert
} from "lucide-react"
import type React from "react"
import { useEffect, useState } from "react"

import { useStorage } from "@plasmohq/storage/hook"

import { FeatureShortcutRow } from "~components/FeatureShortcutRow"
import { SettingToggleRow } from "~components/SettingToggleRow"
import { SubSettingsLayout } from "~components/SubSettingsLayout"
import {
  MESSAGE_TYPES,
  sendToActiveTab,
  sendToBackground
} from "~core/messaging"
import { openBrowserShortcutsPage } from "~core/shortcutsHelper"
import {
  DEFAULT_SETTINGS,
  STORAGE_KEYS,
  type FeatureSettings,
  type PictureInPictureConfig
} from "~core/types"

interface PictureInPictureSettingsViewProps {
  onBack: () => void
}

/**
 * Sub-settings view for Universal Picture-in-Picture.
 */
export const PictureInPictureSettingsView: React.FC<
  PictureInPictureSettingsViewProps
> = ({ onBack }) => {
  const [settings, setSettings] = useStorage<FeatureSettings>(
    STORAGE_KEYS.SETTINGS,
    DEFAULT_SETTINGS
  )
  const [shortcut, setShortcut] = useState<string>("Alt + P")

  useEffect(() => {
    if (chrome.commands?.getAll) {
      chrome.commands.getAll((commands) => {
        const cmd = commands.find((c) => c.name === "toggle_picture_in_picture")
        if (cmd?.shortcut) {
          setShortcut(cmd.shortcut)
        } else {
          setShortcut("Not configured")
        }
      })
    }
  }, [])

  const isMasterEnabled =
    settings?.pictureInPicture ?? DEFAULT_SETTINGS.pictureInPicture
  const currentConfig: PictureInPictureConfig =
    settings?.pictureInPictureConfig ?? DEFAULT_SETTINGS.pictureInPictureConfig

  const handleToggleMaster = (enabled: boolean) => {
    setSettings((prev) => ({
      ...(prev ?? DEFAULT_SETTINGS),
      pictureInPicture: enabled
    }))
  }

  const handleToggleOption = (key: keyof PictureInPictureConfig) => {
    setSettings((prev) => ({
      ...(prev ?? DEFAULT_SETTINGS),
      pictureInPictureConfig: {
        ...(prev?.pictureInPictureConfig ??
          DEFAULT_SETTINGS.pictureInPictureConfig),
        [key]: !currentConfig[key]
      }
    }))
  }

  const [activePiP, setActivePiP] = useState<{
    tabId: number
    title: string
  } | null>(null)

  useEffect(() => {
    sendToBackground(MESSAGE_TYPES.GET_ACTIVE_PIP_SESSION).then((response) => {
      if (response?.session) {
        setActivePiP(response.session)
      }
    })
  }, [])

  const handleTogglePiP = async () => {
    if (activePiP) {
      await sendToBackground(MESSAGE_TYPES.CLOSE_PIP)
      setActivePiP(null)
      return
    }

    await sendToActiveTab(MESSAGE_TYPES.TOGGLE_PICTURE_IN_PICTURE)
    setTimeout(async () => {
      const response = await sendToBackground(
        MESSAGE_TYPES.GET_ACTIVE_PIP_SESSION
      )
      if (response?.session) {
        setActivePiP(response.session)
      }
    }, 300)
    window.close()
  }

  const handleOpenShortcutsPage = () => {
    openBrowserShortcutsPage().catch(() => {})
  }

  return (
    <SubSettingsLayout
      title="Picture-in-Picture"
      enabled={isMasterEnabled}
      onToggle={handleToggleMaster}
      onBack={onBack}
      rightActions={
        <button
          type="button"
          onClick={handleTogglePiP}
          disabled={!isMasterEnabled}
          title={
            activePiP ? "Exit Picture-in-Picture" : "Toggle Picture-in-Picture"
          }
          className={`px-2.5 py-1 rounded-lg font-semibold text-xs transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none flex items-center gap-1.5 shadow-sm ${
            activePiP
              ? "bg-rose-500 hover:bg-rose-600 text-white shadow-rose-500/25"
              : "bg-accent hover:bg-accent-hover text-white shadow-accent-glow"
          }`}>
          <PictureInPicture2 className="w-3.5 h-3.5" />
          <span>{activePiP ? "Exit PiP" : "Launch"}</span>
        </button>
      }>
      <div className="space-y-4">
        {/* Shortcut Section */}
        <FeatureShortcutRow
          title="Global Shortcut"
          description="Toggle floating video window"
          shortcut={shortcut}
          iconColorClass="text-indigo-400"
          onConfigureShortcuts={handleOpenShortcutsPage}
        />

        {/* Options */}
        <div className="space-y-2 pt-2 border-t border-border-divider">
          <span className="section-header">Display & Feedback</span>

          <div className="divide-y divide-border-divider">
            {/* Show Badge */}
            <SettingToggleRow
              icon={<Eye className="w-5 h-5 text-accent" />}
              title="Extension Badge Indicator"
              description="Show “PiP” badge on extension icon whenever a video is playing in PiP."
              enabled={currentConfig.showBadge}
              onToggle={() => handleToggleOption("showBadge")}
            />

            {/* Show Action Toast */}
            <SettingToggleRow
              icon={<Eye className="w-5 h-5 text-emerald-400" />}
              title="Action Toast Notification"
              description="Display brief confirmation toast when entering or exiting PiP."
              enabled={currentConfig.showToast}
              onToggle={() => handleToggleOption("showToast")}
            />

            {/* Hover PiP Button */}
            <SettingToggleRow
              icon={<MousePointerClick className="w-5 h-5 text-indigo-400" />}
              title="Hover Video PiP Button"
              badge={{
                text: "Unstable",
                bgClass: "bg-amber-500/10",
                colorClass: "text-amber-400",
                borderClass: "border-amber-500/25"
              }}
              description="Show a floating PiP trigger above playing videos. May be unstable or blocked on some custom web video players."
              enabled={currentConfig.hoverButton}
              onToggle={() => handleToggleOption("hoverButton")}
            />
          </div>
        </div>

        {/* Feature Highlights Note */}
        <div className="card-subtle p-3 text-[11px] text-content-muted space-y-1">
          <div className="flex items-center gap-1.5 font-semibold text-content-secondary">
            <ShieldAlert className="w-3.5 h-3.5 text-accent" />
            <span>Universal Compatibility</span>
          </div>
          <p className="leading-relaxed">
            Automatically finds currently active playing videos, unlocks
            restricted players, and allows single-click tab refocusing right
            from the extension popup.
          </p>
        </div>
      </div>
    </SubSettingsLayout>
  )
}
