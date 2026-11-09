import {
  Bell,
  EyeOff,
  HelpCircle,
  Move,
  Repeat,
  Ruler,
  Sparkles,
  Tag,
  Trash2,
  Type,
  Zap
} from "lucide-react"
import type React from "react"
import { useEffect, useState } from "react"

import { useStorage } from "@plasmohq/storage/hook"

import { FeatureShortcutRow } from "~components/FeatureShortcutRow"
import { SegmentedTabs, type SegmentedTabItem } from "~components/SegmentedTabs"
import { SettingToggleRow } from "~components/SettingToggleRow"
import { SubSettingsLayout } from "~components/SubSettingsLayout"
import { MESSAGE_TYPES, sendToActiveTab } from "~core/messaging"
import { openBrowserShortcutsPage } from "~core/shortcutsHelper"
import {
  DEFAULT_ELEMENT_TOYS_CONFIG,
  DEFAULT_SETTINGS,
  STORAGE_KEYS,
  type ElementToysConfig,
  type FeatureSettings,
  type ElementToysMode
} from "~core/types"

export interface ElementToysSettingsViewProps {
  onBack: () => void
}

const DEFAULT_MODE_TABS: SegmentedTabItem<ElementToysMode>[] = [
  { id: "zap", label: "Zap", icon: <Trash2 className="w-3.5 h-3.5 text-red-400" /> },
  { id: "edit", label: "Edit", icon: <Type className="w-3.5 h-3.5 text-sky-400" /> },
  { id: "move", label: "Move", icon: <Move className="w-3.5 h-3.5 text-emerald-400" /> },
  { id: "hide", label: "Hide", icon: <EyeOff className="w-3.5 h-3.5 text-amber-400" /> }
]

export const ElementToysSettingsView: React.FC<
  ElementToysSettingsViewProps
> = ({ onBack }) => {
  const [settings, setSettings] = useStorage<FeatureSettings>(
    STORAGE_KEYS.SETTINGS,
    DEFAULT_SETTINGS
  )
  const [shortcut, setShortcut] = useState<string>("Alt + Shift + Z")

  useEffect(() => {
    if (chrome.commands?.getAll) {
      chrome.commands.getAll((commands) => {
        const cmd = commands.find((c) => c.name === "toggle_element_toys")
        if (cmd?.shortcut) {
          setShortcut(cmd.shortcut)
        } else {
          setShortcut("")
        }
      })
    }
  }, [])

  const currentConfig: ElementToysConfig =
    settings?.elementToysConfig ?? DEFAULT_ELEMENT_TOYS_CONFIG
  const isMasterEnabled =
    settings?.elementToys ?? DEFAULT_SETTINGS.elementToys

  const handleToggleMaster = (enabled: boolean) => {
    setSettings((prev) => ({
      ...(prev ?? DEFAULT_SETTINGS),
      elementToys: enabled
    }))
  }

  const handleToggleConfig = (key: keyof ElementToysConfig) => {
    const updatedConfig = {
      ...(settings?.elementToysConfig ?? DEFAULT_ELEMENT_TOYS_CONFIG),
      [key]: !currentConfig[key]
    }
    setSettings((prev) => ({
      ...(prev ?? DEFAULT_SETTINGS),
      elementToysConfig: updatedConfig
    }))
  }

  const handleSetDefaultMode = (mode: ElementToysMode) => {
    const updatedConfig = {
      ...(settings?.elementToysConfig ?? DEFAULT_ELEMENT_TOYS_CONFIG),
      defaultMode: mode
    }
    setSettings((prev) => ({
      ...(prev ?? DEFAULT_SETTINGS),
      elementToysConfig: updatedConfig
    }))
  }

  const handleLaunchNow = async () => {
    try {
      await sendToActiveTab(MESSAGE_TYPES.TRIGGER_ELEMENT_TOYS)
    } finally {
      window.close()
    }
  }

  return (
    <SubSettingsLayout
      title="Element Toys"
      enabled={isMasterEnabled}
      onToggle={handleToggleMaster}
      onBack={onBack}
      rightActions={
        <button
          type="button"
          onClick={handleLaunchNow}
          disabled={!isMasterEnabled}
          title="Launch Element Toys on Page"
          className="px-2.5 py-1 rounded-lg bg-accent hover:bg-accent-hover text-white font-semibold text-xs shadow-sm shadow-accent-glow active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none flex items-center gap-1.5">
          <Zap className="w-3.5 h-3.5 fill-current" />
          <span>Launch</span>
        </button>
      }>
      <div className="space-y-4">
        {/* Keyboard Shortcut Row */}
        <FeatureShortcutRow
          title="Activation Shortcut"
          description="Open floating Element Toys toolbar on active page"
          shortcut={shortcut}
          iconColorClass="text-amber-400"
          onConfigureShortcuts={() => {
            openBrowserShortcutsPage().catch(() => {})
          }}
        />

        {/* Element Inspector Badge Options */}
        <div className="space-y-1 pt-2 border-t border-border-divider">
          <span className="section-header">Element Inspector Badge</span>

          <div className="divide-y divide-border-divider">
            {/* Show Dimensions Switch */}
            <SettingToggleRow
              icon={<Ruler className="w-5 h-5 text-sky-400" />}
              title="Show Element Dimensions"
              description="Measure and display width × height (px) on hover badge"
              enabled={currentConfig.showDimensions}
              onToggle={() => handleToggleConfig("showDimensions")}
            />

            {/* Show Tag & Class Names Switch */}
            <SettingToggleRow
              icon={<Tag className="w-5 h-5 text-amber-400" />}
              title="Show Tag & Class Names"
              description="Display HTML tag name and CSS class selectors (e.g. div.banner#hero)"
              enabled={currentConfig.showTagDescriptor}
              onToggle={() => handleToggleConfig("showTagDescriptor")}
            />
          </div>
        </div>

        {/* Behavior & Default Mode */}
        <div className="space-y-1 pt-2 border-t border-border-divider">
          <span className="section-header">Element Toys Behavior</span>

          {/* Default Starting Mode */}
          <div className="py-2.5 space-y-2">
            <div className="flex flex-col gap-0.5">
              <span className="text-xs font-semibold text-content-primary">
                Default Tool on Launch
              </span>
              <span className="text-[11px] text-content-muted leading-tight">
                Tool selected by default when activating Element Toys
              </span>
            </div>
            <SegmentedTabs
              items={DEFAULT_MODE_TABS}
              value={currentConfig.defaultMode ?? "zap"}
              onChange={handleSetDefaultMode}
            />
          </div>

          <div className="divide-y divide-border-divider">
            {/* Continuous Mode Switch */}
            <SettingToggleRow
              icon={<Repeat className="w-5 h-5 text-indigo-400" />}
              title="Continuous Session"
              description="Keep tools active after each action until pressing Esc or Exit"
              enabled={currentConfig.continuousMode}
              onToggle={() => handleToggleConfig("continuousMode")}
            />

            {/* Auto Unfreeze Scroll Switch */}
            <SettingToggleRow
              icon={<Sparkles className="w-5 h-5 text-emerald-400" />}
              title="Auto Unfreeze Page Scroll"
              description="Restore scrollability (overflow: auto) if target was a locking modal overlay"
              enabled={currentConfig.autoUnfreezeScroll}
              onToggle={() => handleToggleConfig("autoUnfreezeScroll")}
            />

            {/* Show Toast Notifications Switch */}
            <SettingToggleRow
              icon={<Bell className="w-5 h-5 text-rose-400" />}
              title="Show Floating Toast"
              description="Display confirmation banner on page when actions are executed"
              enabled={currentConfig.showToast}
              onToggle={() => handleToggleConfig("showToast")}
            />
          </div>
        </div>

        {/* How to use Tips */}
        <div className="p-3 rounded-xl bg-surface-subtle/40 border border-border-subtle space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-content-primary">
            <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
            <span>How to Use Element Toys</span>
          </div>
          <ul className="text-[11px] text-content-muted space-y-1.5 list-disc list-inside">
            <li>
              Press{" "}
              <span className="font-mono text-content-primary font-semibold">
                {shortcut || "Alt + Shift + Z"}
              </span>{" "}
              to open the in-page floating HUD toolbar.
            </li>
            <li>
              <span className="text-red-400 font-semibold">Zap</span>: Click any banner, overlay, or widget to remove it from the DOM.
            </li>
            <li>
              <span className="text-sky-400 font-semibold">Edit</span>: Click any text to edit inline in real-time (keystrokes are completely isolated from the page).
            </li>
            <li>
              <span className="text-emerald-400 font-semibold">Move</span>: Drag to reposition elements across page layouts. Toggle Flow & Free mode directly on the toolbar, and press + / - to expand or shrink element scope.
            </li>
            <li>
              <span className="text-amber-400 font-semibold">Hide</span>: Click to make elements invisible without breaking page flow.
            </li>
            <li>
              Press{" "}
              <span className="font-mono text-content-primary font-semibold">
                Ctrl + Z
              </span>{" "}
              to undo any action, or click the <span className="font-semibold text-content-primary">Settings</span> button on the toolbar to configure options.
            </li>
          </ul>
        </div>
      </div>
    </SubSettingsLayout>
  )
}

