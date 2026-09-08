import { Bell, Check, Copy, History, Pipette, Trash2 } from "lucide-react"
import type React from "react"
import { useEffect, useState } from "react"

import { useStorage } from "@plasmohq/storage/hook"

import { FeatureShortcutRow } from "~components/FeatureShortcutRow"
import { GridPicker, type GridPickerItem } from "~components/GridPicker"
import { SettingToggleRow } from "~components/SettingToggleRow"
import { SubSettingsLayout } from "~components/SubSettingsLayout"
import { MESSAGE_TYPES, sendToActiveTab } from "~core/messaging"
import { openBrowserShortcutsPage } from "~core/shortcutsHelper"
import {
  DEFAULT_COLOR_PICKER_CONFIG,
  DEFAULT_SETTINGS,
  STORAGE_KEYS,
  type ColorFormat,
  type ColorHistoryItem,
  type ColorPickerConfig,
  type FeatureSettings
} from "~core/types"

import { getColorValueByFormat, parseColor } from "./colorUtils"

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
    // 1. If EyeDropper API is available directly in the current window (popup context),
    // calling it synchronously preserves user activation gesture and never fails!
    if (typeof window !== "undefined" && "EyeDropper" in window) {
      try {
        const EyeDropperClass = (
          window as unknown as {
            EyeDropper: new () => { open: () => Promise<{ sRGBHex: string }> }
          }
        ).EyeDropper
        const eyeDropper = new EyeDropperClass()
        const result = await eyeDropper.open()

        if (result?.sRGBHex) {
          const colorItem = parseColor(result.sRGBHex)

          // Save to persistent storage history
          setColorHistory((prev) => {
            const existing = prev ?? []
            const filtered = existing.filter((c) => c.hex !== colorItem.hex)
            return [colorItem, ...filtered].slice(0, 20)
          })

          // Auto-copy to clipboard if enabled
          if (currentConfig.autoCopy) {
            const val = getColorValueByFormat(
              colorItem,
              currentConfig.defaultFormat
            )
            await navigator.clipboard.writeText(val).catch(() => {})
          }
        }
      } catch {
        // User cancelled or pressed Escape
      } finally {
        window.close()
      }
      return
    }

    // 2. Fallback: Dispatch message to active tab content script
    try {
      await sendToActiveTab(MESSAGE_TYPES.TRIGGER_COLOR_PICKER)
    } finally {
      window.close()
    }
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
    openBrowserShortcutsPage().catch(() => {})
  }

  return (
    <SubSettingsLayout
      title="Color Picker"
      enabled={isMasterEnabled}
      onToggle={handleToggleMaster}
      onBack={onBack}
      rightActions={
        <button
          type="button"
          onClick={handlePickNow}
          disabled={!isMasterEnabled}
          title="Pick Color from Screen"
          className="px-2.5 py-1 rounded-lg bg-accent hover:bg-accent-hover text-white font-semibold text-xs shadow-sm shadow-accent-glow active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none flex items-center gap-1.5">
          <Pipette className="w-3.5 h-3.5" />
          <span>Pick</span>
        </button>
      }>
      <div className="space-y-4">
        {/* Section 1: Keyboard Shortcut */}
        <FeatureShortcutRow
          title="Eyedropper Shortcut"
          description="Quickly activate screen color picker"
          shortcut={shortcut}
          iconColorClass="text-pink-400"
          onConfigureShortcuts={handleOpenShortcutsPage}
        />

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

        {/* Section 4: Behavior & Feedback */}
        <div className="space-y-1 pt-2 border-t border-border-divider">
          <span className="section-header">Behavior & Feedback</span>

          <div className="divide-y divide-border-divider">
            {/* Auto-Copy to Clipboard */}
            <SettingToggleRow
              icon={<Copy className="w-5 h-5 text-emerald-400" />}
              title="Auto-Copy to Clipboard"
              description="Automatically copy selected color value immediately upon picking"
              enabled={currentConfig.autoCopy}
              onToggle={() => handleToggleOption("autoCopy")}
            />

            {/* Feedback Notification */}
            <SettingToggleRow
              icon={<Bell className="w-5 h-5 text-pink-400" />}
              title="Feedback Notification"
              description="Display confirmation toast and floating palette modal on page"
              enabled={currentConfig.showToast}
              onToggle={() => handleToggleOption("showToast")}
            />
          </div>
        </div>
      </div>
    </SubSettingsLayout>
  )
}
