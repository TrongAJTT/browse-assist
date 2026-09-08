import { MousePointerClick } from "lucide-react"
import type React from "react"
import { useEffect, useState } from "react"

import { ToggleSwitch } from "~components/ToggleSwitch"
import { FEATURES_LIST } from "~core/types"

const meta = FEATURES_LIST.find((f) => f.key === "allowRightClick")!

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
  const [isActiveInTab, setIsActiveInTab] = useState(false)
  const [currentTabId, setCurrentTabId] = useState<number | null>(null)

  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const activeTab = tabs[0]
      if (!activeTab?.id) {
        onReady?.()
        return
      }

      const tabId = activeTab.id
      setCurrentTabId(tabId)

      chrome.tabs.sendMessage(
        tabId,
        { type: "GET_RIGHT_CLICK_STATUS" },
        (response) => {
          if (!chrome.runtime.lastError && typeof response?.active === "boolean") {
            setIsActiveInTab(response.active)
            onStatusChange?.(response.active)
          }
          onReady?.()
        }
      )
    })
  }, [onStatusChange, onReady])

  const handleChange = (enabled: boolean) => {
    setIsActiveInTab(enabled)
    onStatusChange?.(enabled)

    if (currentTabId) {
      chrome.tabs.sendMessage(
        currentTabId,
        { type: "TOGGLE_RIGHT_CLICK", enabled },
        () => {
          if (chrome.runtime.lastError) {
            // Suppress error if tab doesn't have content script injected (e.g. chrome:// URL)
          }
        }
      )
    }
  }

  return (
    <ToggleSwitch
      icon={<MousePointerClick className="w-5 h-5 text-emerald-400" />}
      title={meta.title}
      description="Enable context menu and copy on the current tab without breaking other apps."
      enabled={isActiveInTab}
      onChange={handleChange}
      badge="On-Demand"
    />
  )
}
