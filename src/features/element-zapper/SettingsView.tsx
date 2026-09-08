import { HelpCircle, Sparkles, Zap } from "lucide-react"
import type React from "react"
import { useEffect, useState } from "react"

import { useStorage } from "@plasmohq/storage/hook"

import { FeatureShortcutRow } from "~components/FeatureShortcutRow"
import { SettingToggleRow } from "~components/SettingToggleRow"
import { SubSettingsLayout } from "~components/SubSettingsLayout"
import { MESSAGE_TYPES, sendToActiveTab } from "~core/messaging"
import { openBrowserShortcutsPage } from "~core/shortcutsHelper"
import {
  DEFAULT_ELEMENT_ZAPPER_CONFIG,
  DEFAULT_SETTINGS,
  STORAGE_KEYS,
  type ElementZapperConfig,
  type FeatureSettings
} from "~core/types"

interface ElementZapperSettingsViewProps {
  onBack: () => void
}

export const ElementZapperSettingsView: React.FC<
  ElementZapperSettingsViewProps
> = ({ onBack }) => {
  const [settings, setSettings] = useStorage<FeatureSettings>(
    STORAGE_KEYS.SETTINGS,
    DEFAULT_SETTINGS
  )
  const [shortcut, setShortcut] = useState<string>("Alt + Shift + Z")

  useEffect(() => {
    if (chrome.commands?.getAll) {
      chrome.commands.getAll((commands) => {
        const cmd = commands.find((c) => c.name === "toggle_element_zapper")
        if (cmd?.shortcut) {
          setShortcut(cmd.shortcut)
        } else {
          setShortcut("")
        }
      })
    }
  }, [])

  const currentConfig: ElementZapperConfig =
    settings?.elementZapperConfig ?? DEFAULT_ELEMENT_ZAPPER_CONFIG
  const isMasterEnabled =
    settings?.elementZapper ?? DEFAULT_SETTINGS.elementZapper

  const handleToggleMaster = (enabled: boolean) => {
    setSettings((prev) => ({
      ...(prev ?? DEFAULT_SETTINGS),
      elementZapper: enabled
    }))
  }

  const handleToggleConfig = (key: keyof ElementZapperConfig) => {
    setSettings((prev) => ({
      ...(prev ?? DEFAULT_SETTINGS),
      elementZapperConfig: {
        ...(prev?.elementZapperConfig ?? DEFAULT_ELEMENT_ZAPPER_CONFIG),
        [key]: !currentConfig[key]
      }
    }))
  }

  const handleZapNow = async () => {
    try {
      await sendToActiveTab(MESSAGE_TYPES.TRIGGER_ELEMENT_ZAPPER)
    } finally {
      window.close()
    }
  }

  return (
    <SubSettingsLayout
      title="Element Zapper"
      enabled={isMasterEnabled}
      onToggle={handleToggleMaster}
      onBack={onBack}
      rightActions={
        <button
          type="button"
          onClick={handleZapNow}
          disabled={!isMasterEnabled}
          title="Zap Element from Page"
          className="px-2.5 py-1 rounded-lg bg-accent hover:bg-accent-hover text-white font-semibold text-xs shadow-sm shadow-accent-glow active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none flex items-center gap-1.5">
          <Zap className="w-3.5 h-3.5 fill-current" />
          <span>Zap</span>
        </button>
      }>
      <div className="space-y-4">
        {/* Keyboard Shortcut Row */}
        <FeatureShortcutRow
          title="Zapper Shortcut"
          description="Activate crosshair cursor on page"
          shortcut={shortcut}
          iconColorClass="text-amber-400"
          onConfigureShortcuts={() => {
            openBrowserShortcutsPage().catch(() => {})
          }}
        />

        {/* Behavior Options */}
        <div className="space-y-1 pt-2 border-t border-border-divider">
          <span className="section-header">Zapper Behavior</span>

          <div className="divide-y divide-border-divider">
            {/* Auto Unfreeze Scroll Switch */}
            <SettingToggleRow
              icon={<Sparkles className="w-5 h-5 text-emerald-400" />}
              title="Auto Unfreeze Page Scroll"
              description="Restore scrollability (overflow: auto) if zapped element was a locking modal overlay"
              enabled={currentConfig.autoUnfreezeScroll}
              onToggle={() => handleToggleConfig("autoUnfreezeScroll")}
            />

            {/* Show Toast Notifications Switch */}
            <SettingToggleRow
              icon={<Zap className="w-5 h-5 text-indigo-400" />}
              title="Show Floating Toast"
              description="Display confirmation banner on page when an element is zapped"
              enabled={currentConfig.showToast}
              onToggle={() => handleToggleConfig("showToast")}
            />
          </div>
        </div>

        {/* How to use Tips */}
        <div className="p-3 rounded-xl bg-surface-subtle/40 border border-border-subtle space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-content-primary">
            <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
            <span>How to Use Element Zapper</span>
          </div>
          <ul className="text-[11px] text-content-muted space-y-1.5 list-disc list-inside">
            <li>
              Press{" "}
              <span className="font-mono text-content-primary font-semibold">
                {shortcut || "Alt + Shift + Z"}
              </span>{" "}
              or click the button above.
            </li>
            <li>
              Move your mouse over the banner, modal, or sticky header you want
              to remove.
            </li>
            <li>
              <span className="text-content-primary font-medium">Click</span>{" "}
              once to permanently eliminate it from the page DOM.
            </li>
            <li>
              Press{" "}
              <span className="font-mono text-content-primary font-semibold">
                Escape
              </span>{" "}
              or right-click anytime to cancel.
            </li>
          </ul>
        </div>
      </div>
    </SubSettingsLayout>
  )
}
