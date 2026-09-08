import { HelpCircle, Keyboard, RotateCcw, Sparkles, Zap } from "lucide-react"
import type React from "react"
import { useEffect, useState } from "react"

import { useStorage } from "@plasmohq/storage/hook"

import { SubSettingsLayout } from "~components/SubSettingsLayout"
import { MESSAGE_TYPES, sendToActiveTab } from "~core/messaging"
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
        {/* Keyboard Shortcut Banner */}
        <div className="p-3 bg-surface-subtle/50 rounded-xl border border-border-subtle flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Keyboard className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-semibold text-content-primary block">
                Zapper Shortcut
              </span>
              <span className="text-[11px] text-content-muted">
                Activate crosshair cursor on page
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <kbd className="px-2 py-1 bg-surface-elevated text-content-primary rounded text-[11px] font-mono border border-border-subtle shadow-sm font-semibold">
              {shortcut || "Not set"}
            </kbd>
            <button
              type="button"
              title="Configure Extension Shortcuts"
              onClick={() => {
                chrome.tabs.create({ url: "chrome://extensions/shortcuts" })
              }}
              className="p-1 rounded text-content-muted hover:text-content-primary hover:bg-surface-elevated transition-colors">
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Behavior Options */}
        <div className="space-y-2 pt-1">
          <span className="text-[11px] font-semibold text-content-muted uppercase tracking-wider block px-1">
            Zapper Behavior
          </span>

          {/* Auto Unfreeze Scroll */}
          <div
            onClick={() => handleToggleConfig("autoUnfreezeScroll")}
            className="p-3 rounded-xl bg-surface-elevated border border-border-subtle hover:border-border-strong cursor-pointer transition-all flex items-center justify-between">
            <div className="flex items-start gap-3">
              <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mt-0.5">
                <Sparkles className="w-4 h-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-medium text-content-primary">
                  Auto Unfreeze Page Scroll
                </span>
                <span className="text-[11px] text-content-muted leading-snug">
                  Restore scrollability (overflow: auto) if zapped element was a
                  locking modal overlay
                </span>
              </div>
            </div>
            <input
              type="checkbox"
              checked={currentConfig.autoUnfreezeScroll}
              onChange={() => {}}
              className="rounded border-border-subtle text-accent-primary focus:ring-accent-primary h-4 w-4 bg-surface-elevated"
            />
          </div>

          {/* Show Toast Notifications */}
          <div
            onClick={() => handleToggleConfig("showToast")}
            className="p-3 rounded-xl bg-surface-elevated border border-border-subtle hover:border-border-strong cursor-pointer transition-all flex items-center justify-between">
            <div className="flex items-start gap-3">
              <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 mt-0.5">
                <Zap className="w-4 h-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-medium text-content-primary">
                  Show Floating Toast
                </span>
                <span className="text-[11px] text-content-muted leading-snug">
                  Display confirmation banner on page when an element is zapped
                </span>
              </div>
            </div>
            <input
              type="checkbox"
              checked={currentConfig.showToast}
              onChange={() => {}}
              className="rounded border-border-subtle text-accent-primary focus:ring-accent-primary h-4 w-4 bg-surface-elevated"
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
