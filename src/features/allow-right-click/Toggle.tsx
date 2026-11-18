import { MousePointerClick } from "lucide-react"
import type React from "react"
import { useEffect, useState } from "react"

import { ToggleSwitch } from "~components/ToggleSwitch"
import { getLocalizedFeatureMeta } from "~core/featureCatalog"
import { MESSAGE_TYPES, sendToActiveTab } from "~core/messaging"
import { useI18n } from "~core/useI18n"

interface AllowRightClickToggleProps {
  onStatusChange?: (active: boolean) => void
  onReady?: () => void
}

/**
 * Allow Right Click toggle row component for Popup UI.
 * Scoped strictly to the currently active tab (on-demand session).
 */
export const AllowRightClickToggle: React.FC<AllowRightClickToggleProps> = ({
  onStatusChange,
  onReady
}) => {
  const { t } = useI18n()
  const meta = getLocalizedFeatureMeta("allowRightClick")
  const [isActiveInTab, setIsActiveInTab] = useState(false)
  const [shortcut, setShortcut] = useState<string>("Alt + R")

  useEffect(() => {
    if (chrome.commands?.getAll) {
      chrome.commands.getAll((commands) => {
        const cmd = commands.find((c) => c.name === "toggle_allow_right_click")
        if (cmd?.shortcut) {
          setShortcut(cmd.shortcut)
        } else {
          setShortcut("")
        }
      })
    }

    sendToActiveTab(MESSAGE_TYPES.GET_RIGHT_CLICK_STATUS).then((response) => {
      if (typeof response?.active === "boolean") {
        setIsActiveInTab(response.active)
        onStatusChange?.(response.active)
      }
      onReady?.()
    })
  }, [onStatusChange, onReady])

  const handleChange = async (enabled: boolean) => {
    setIsActiveInTab(enabled)
    onStatusChange?.(enabled)
    await sendToActiveTab(MESSAGE_TYPES.TOGGLE_RIGHT_CLICK, { enabled })
  }

  return (
    <ToggleSwitch
      icon={<MousePointerClick className="w-5 h-5 text-emerald-400" />}
      title={meta.title}
      description={t("features.allowRightClick.popupDesc")}
      enabled={isActiveInTab}
      onChange={handleChange}
      shortcut={shortcut}
    />
  )
}
