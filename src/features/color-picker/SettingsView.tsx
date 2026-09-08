import {
  Bell,
  Check,
  Copy,
  ExternalLink,
  History,
  Keyboard,
  Pipette,
  Trash2
} from "lucide-react"
import type React from "react"
import { useEffect, useState } from "react"

import { useStorage } from "@plasmohq/storage/hook"

import { GridPicker, type GridPickerItem } from "~components/GridPicker"
import { ShortcutBadge } from "~components/ShortcutBadge"
import { SubSettingsLayout } from "~components/SubSettingsLayout"
import { MESSAGE_TYPES, sendToActiveTab } from "~core/messaging"
import {
  DEFAULT_COLOR_PICKER_CONFIG,
  DEFAULT_SETTINGS,
  STORAGE_KEYS,
  type ColorFormat,
  type ColorHistoryItem,
  type ColorPickerConfig,
  type FeatureSettings
} from "~core/types"

import { getColorValueByFormat } from "./colorUtils"

interface ColorPickerSettingsViewProps {
  onBack: () => void
}

const FORMAT_ITEMS: GridPickerItem<ColorFormat>[] = [
  {
    id: "hex",
    label: "HEX",
    icon: <span className="font-mono text-xs font-bold text-accent">#</span>
  },
  {
    id: "rgb",
    label: "RGB",
    icon: <span className="font-mono text-xs font-bold text-accent">RGB</span>
  },
  {
    id: "hsl",
    label: "HSL",
    icon: <span className="font-mono text-xs font-bold text-accent">HSL</span>
  }
]

/**
 * Sub-settings view for ColorPick Eyedropper.
 * Flat layout without card wrappers, with recent colors palette and one-click copy.
 */
export const ColorPickerSettingsView: React.FC<
  ColorPickerSettingsViewProps
> = ({ onBack }) => {
  const [settings, setSettings] = useStorage<FeatureSettings>(
    STORAGE_KEYS.SETTINGS,
    DEFAULT_SETTINGS
  )
  const [colorHistory, setColorHistory] = useStorage<ColorHistoryItem[]>(
    STORAGE_KEYS.COLOR_HISTORY,
    []
  )
  const [shortcut, setShortcut] = useState<string>("Alt + Shift + C")
  const [copiedHex, setCopiedHex] = useState<string | null>(null)

  useEffect(() => {
    if (chrome.commands?.getAll) {
      chrome.commands.getAll((commands) => {
        const cmd = commands.find((c) => c.name === "toggle_color_picker")
        if (cmd?.shortcut) {
          setShortcut(cmd.shortcut)
        } else {
          setShortcut("")
        }
      })
    }
  }, [])

  const currentConfig: ColorPickerConfig =
    settings?.colorPickerConfig ?? DEFAULT_COLOR_PICKER_CONFIG
  const isMasterEnabled = settings?.colorPicker ?? DEFAULT_SETTINGS.colorPicker

  const handleToggleMaster = (enabled: boolean) => {
    setSettings((prev) => ({
      ...(prev ?? DEFAULT_SETTINGS),
      colorPicker: enabled
    }))
  }

  const handleSelectFormat = (format: ColorFormat) => {
    setSettings((prev) => ({
      ...(prev ?? DEFAULT_SETTINGS),
      colorPickerConfig: {
        ...(prev?.colorPickerConfig ?? DEFAULT_COLOR_PICKER_CONFIG),
        defaultFormat: format
      }
    }))
  }

  const handleToggleOption = (
    key: keyof Pick<ColorPickerConfig, "autoCopy" | "showToast">
  ) => {
    setSettings((prev) => ({
      ...(prev ?? DEFAULT_SETTINGS),
      colorPickerConfig: {
        ...(prev?.colorPickerConfig ?? DEFAULT_COLOR_PICKER_CONFIG),
        [key]: !currentConfig[key]
      }
    }))
  }

  const handlePickNow = async () => {
    await sendToActiveTab(MESSAGE_TYPES.TRIGGER_COLOR_PICKER)
    window.close()
  }

  const handleCopyColor = async (item: ColorHistoryItem) => {
    const val = getColorValueByFormat(item, currentConfig.defaultFormat)
    try {
      await navigator.clipboard.writeText(val)
      setCopiedHex(item.hex)
      setTimeout(() => setCopiedHex(null), 1200)
    } catch {
      // Ignore clipboard write failure
    }
  }

  const handleClearHistory = () => {
    setColorHistory([])
  }

  const handleOpenShortcutsPage = () => {
    chrome.tabs.create({ url: "chrome://extensions/shortcuts" })
  }

  return (
    <SubSettingsLayout
      title="ColorPick Eyedropper"
      enabled={isMasterEnabled}
      onToggle={handleToggleMaster}
      onBack={onBack}>
      <div className="space-y-4">
        {/* Quick Launch Button */}
        <div className="pt-1">
          <button
            type="button"
            onClick={handlePickNow}
            disabled={!isMasterEnabled}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-pink-500 to-indigo-600 text-white font-semibold text-xs shadow-md shadow-indigo-500/25 hover:from-pink-600 hover:to-indigo-700 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none">
            <Pipette className="w-4 h-4" />
            <span>Pick Color From Screen</span>
          </button>
        </div>

        {/* Section 1: Keyboard Shortcut */}
        <div className="space-y-2">
          <span className="section-header">Keyboard Shortcut</span>
          <div className="flex items-center justify-between gap-3 py-1">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-lg bg-pink-500/10 text-pink-400">
                <Keyboard className="w-4 h-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-content-primary">
                  Eyedropper Shortcut
                </span>
                <span className="text-[11px] text-content-muted">
                  Quickly activate screen color picker
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <ShortcutBadge shortcut={shortcut} />
              <button
                type="button"
                onClick={handleOpenShortcutsPage}
                title="Customize in browser shortcut settings"
                className="p-1 text-content-muted hover:text-accent transition-colors">
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Section 2: Recent Colors Palette History (Flat Layout) */}
        <div className="space-y-2 pt-2 border-t border-border-divider">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <History className="w-3.5 h-3.5 text-content-muted" />
              <span className="section-header">Recent Colors</span>
            </div>
            {colorHistory && colorHistory.length > 0 && (
              <button
                type="button"
                onClick={handleClearHistory}
                title="Clear all recent color history"
                className="flex items-center gap-1 text-[11px] font-medium text-content-muted hover:text-rose-400 transition-colors">
                <Trash2 className="w-3 h-3" />
                <span>Clear</span>
              </button>
            )}
          </div>

          {colorHistory && colorHistory.length > 0 ? (
            <div className="grid grid-cols-5 gap-2 pt-1">
              {colorHistory.slice(0, 15).map((item) => (
                <button
                  key={item.hex + item.timestamp}
                  type="button"
                  onClick={() => handleCopyColor(item)}
                  title={`Click to copy ${getColorValueByFormat(item, currentConfig.defaultFormat)}`}
                  className="group relative flex flex-col items-center p-1.5 rounded-lg bg-app-surface border border-border-subtle hover:border-accent hover:shadow-md transition-all active:scale-95">
                  <div
                    className="w-full h-7 rounded-md border border-white/20 shadow-inner mb-1 flex items-center justify-center"
                    style={{ backgroundColor: item.hex }}>
                    {copiedHex === item.hex && (
                      <Check className="w-3.5 h-3.5 text-white drop-shadow-md stroke-[3]" />
                    )}
                  </div>
                  <span className="font-mono text-[9px] font-semibold text-content-secondary group-hover:text-accent truncate max-w-full">
                    {item.hex}
                  </span>
                </button>
              ))}
            </div>
          ) : (
            <p className="text-[11px] text-content-muted italic py-1">
              No recent colors picked yet. Use shortcut or button above to pick
              colors.
            </p>
          )}
        </div>

        {/* Section 3: Default Format Selection */}
        <div className="space-y-2 pt-2 border-t border-border-divider">
          <span className="section-header">Default Copy Format</span>
          <div className="space-y-1.5">
            <span className="text-xs font-semibold text-content-primary">
              Clipboard Color Format
            </span>
            <p className="text-[11px] text-content-muted leading-snug">
              Select which color standard is copied automatically when you pick
              a pixel.
            </p>
          </div>

          <GridPicker<ColorFormat>
            items={FORMAT_ITEMS}
            value={currentConfig.defaultFormat}
            onChange={handleSelectFormat}
            columns={3}
          />
        </div>

        {/* Section 4: Behavior Toggles */}
        <div className="space-y-3 pt-2 border-t border-border-divider">
          <span className="section-header">Behavior & Feedback</span>

          {/* Auto Copy Toggle */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-start gap-3 flex-1 min-w-0">
              <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 mt-0.5">
                <Copy className="w-4 h-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-content-primary">
                  Auto-Copy to Clipboard
                </span>
                <span className="text-[11px] text-content-muted">
                  Automatically copy selected color value immediately upon
                  picking
                </span>
              </div>
            </div>

            <button
              type="button"
              role="switch"
              aria-checked={currentConfig.autoCopy}
              onClick={() => handleToggleOption("autoCopy")}
              className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                currentConfig.autoCopy ? "bg-accent-hover" : "bg-border-subtle"
              }`}>
              <span
                className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                  currentConfig.autoCopy ? "translate-x-4" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          {/* Show Toast Toggle */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-start gap-3 flex-1 min-w-0">
              <div className="p-1.5 rounded-lg bg-pink-500/10 text-pink-400 mt-0.5">
                <Bell className="w-4 h-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-content-primary">
                  Feedback Notification
                </span>
                <span className="text-[11px] text-content-muted">
                  Display confirmation toast and floating palette modal on page
                </span>
              </div>
            </div>

            <button
              type="button"
              role="switch"
              aria-checked={currentConfig.showToast}
              onClick={() => handleToggleOption("showToast")}
              className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                currentConfig.showToast ? "bg-accent-hover" : "bg-border-subtle"
              }`}>
              <span
                className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                  currentConfig.showToast ? "translate-x-4" : "translate-x-0"
                }`}
              />
            </button>
          </div>
        </div>
      </div>
    </SubSettingsLayout>
  )
}
