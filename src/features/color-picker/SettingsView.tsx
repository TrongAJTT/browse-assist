import { Bell, Check, Copy, History, LayoutPanelTop, Palette, Trash2 } from "lucide-react"
import type React from "react"
import { useEffect, useState } from "react"

import { useStorage } from "@plasmohq/storage/hook"

import { FeatureShortcutRow } from "~components/FeatureShortcutRow"
import {
  SelectDropdown,
  type SelectDropdownOption
} from "~components/SelectDropdown"
import { SettingToggleRow } from "~components/SettingToggleRow"
import { SubSettingsLayout } from "~components/SubSettingsLayout"
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
import { useI18n } from "~core/useI18n"

import { getColorValueByFormat } from "./colorUtils"

interface ColorPickerSettingsViewProps {
  onBack: () => void
}

const FORMAT_ITEMS: SelectDropdownOption<ColorFormat>[] = [
  {
    id: "hex",
    label: "HEX",
    icon: <span className="font-mono text-xs font-bold opacity-75">#</span>
  },
  {
    id: "rgb",
    label: "RGB"
  },
  {
    id: "hsl",
    label: "HSL"
  }
]

/**
 * Sub-settings view for ColorPick Eyedropper.
 * Flat layout without card wrappers, with recent colors palette and one-click copy.
 */
export const ColorPickerSettingsView: React.FC<
  ColorPickerSettingsViewProps
> = ({ onBack }) => {
  const { t } = useI18n()
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
    key: keyof Pick<ColorPickerConfig, "autoCopy" | "showToast" | "showPaletteModal">
  ) => {
    const currentValue =
      key === "showPaletteModal"
        ? (currentConfig.showPaletteModal ?? true)
        : currentConfig[key]
    setSettings((prev) => ({
      ...(prev ?? DEFAULT_SETTINGS),
      colorPickerConfig: {
        ...(prev?.colorPickerConfig ?? DEFAULT_COLOR_PICKER_CONFIG),
        [key]: !currentValue
      }
    }))
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
      title={t("features.colorPicker.title")}
      enabled={isMasterEnabled}
      onToggle={handleToggleMaster}
      onBack={onBack}>
      <div className="space-y-4">
        {/* Section 1: Keyboard Shortcut */}
        <FeatureShortcutRow
          title={t("features.colorPicker.settings.shortcutTitle")}
          description={t("features.colorPicker.settings.shortcutDesc")}
          shortcut={shortcut}
          iconColorClass="text-pink-400"
          onConfigureShortcuts={handleOpenShortcutsPage}
        />

        {/* Section 2: Recent Colors Palette History (Flat Layout) */}
        <div className="space-y-2 pt-2 border-t border-border-divider">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <History className="w-3.5 h-3.5 text-content-muted" />
              <span className="section-header">
                {t("features.colorPicker.settings.recentColors")}
              </span>
            </div>
            {colorHistory && colorHistory.length > 0 && (
              <button
                type="button"
                onClick={handleClearHistory}
                title={t("features.colorPicker.settings.clearHistoryTooltip")}
                className="flex items-center gap-1 text-[11px] font-medium text-content-muted hover:text-rose-400 transition-colors">
                <Trash2 className="w-3 h-3" />
                <span>{t("common.clear")}</span>
              </button>
            )}
          </div>

          {colorHistory && colorHistory.length > 0 ? (
            <div className="grid grid-cols-5 gap-2 pt-1">
              {colorHistory.slice(0, 18).map((item) => (
                <button
                  key={item.hex + item.timestamp}
                  type="button"
                  onClick={() => handleCopyColor(item)}
                  title={t("features.colorPicker.settings.clickToCopy", {
                    value: getColorValueByFormat(
                      item,
                      currentConfig.defaultFormat
                    )
                  })}
                  className="group relative flex flex-col items-center overflow-hidden rounded-md bg-app-surface border border-border-subtle hover:border-accent hover:shadow-md transition-all active:scale-95">
                  <div
                    className="w-full h-7 border-b border-border-subtle flex items-center justify-center relative"
                    style={{ backgroundColor: item.hex }}>
                    {copiedHex === item.hex && (
                      <Check className="w-3.5 h-3.5 text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] stroke-[3]" />
                    )}
                  </div>
                  <div className="w-full py-1 px-0.5 text-center">
                    <span className="font-mono text-[12px] font-semibold text-content-secondary group-hover:text-accent truncate block max-w-full">
                      {item.hex}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <p className="text-[11px] text-content-muted italic py-1">
              {t("features.colorPicker.settings.noRecentColors")}
            </p>
          )}
        </div>

        {/* Section 3: Default Format Selection (Trailing Dropdown) */}
        <div className="space-y-2 pt-2 border-t border-border-divider">
          <span className="section-header">
            {t("features.colorPicker.settings.defaultFormat")}
          </span>
          <div className="flex items-center justify-between gap-3 py-0.5">
            <div className="flex items-start gap-3 flex-1 min-w-0">
              <Palette className="w-5 h-5 text-pink-400 shrink-0 mt-0.5" />
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-semibold text-content-primary">
                  {t("features.colorPicker.settings.clipboardFormat")}
                </span>
                <p className="text-[11px] text-content-muted mt-0.5 leading-snug">
                  {t("features.colorPicker.settings.clipboardFormatDesc")}
                </p>
              </div>
            </div>

            <SelectDropdown<ColorFormat>
              value={currentConfig.defaultFormat}
              options={FORMAT_ITEMS}
              onChange={handleSelectFormat}
              ariaLabel={t("features.colorPicker.settings.clipboardFormat")}
            />
          </div>
        </div>

        {/* Section 4: Behavior & Feedback */}
        <div className="space-y-1 pt-2 border-t border-border-divider">
          <span className="section-header">
            {t("features.colorPicker.settings.behaviorFeedback")}
          </span>

          <div className="divide-y divide-border-divider">
            {/* Auto-Copy to Clipboard */}
            <SettingToggleRow
              icon={<Copy className="w-5 h-5 text-emerald-400" />}
              title={t("features.colorPicker.settings.autoCopy")}
              description={t("features.colorPicker.settings.autoCopyDesc")}
              enabled={currentConfig.autoCopy}
              onToggle={() => handleToggleOption("autoCopy")}
            />

            {/* Floating Palette Modal */}
            <SettingToggleRow
              icon={<LayoutPanelTop className="w-5 h-5 text-indigo-400" />}
              title={t("features.colorPicker.settings.showPalette")}
              description={t("features.colorPicker.settings.showPaletteDesc")}
              enabled={currentConfig.showPaletteModal ?? true}
              onToggle={() => handleToggleOption("showPaletteModal")}
            />

            {/* Feedback Notification (disabled when Floating Palette is active) */}
            <SettingToggleRow
              icon={<Bell className="w-5 h-5 text-pink-400" />}
              title={t("features.colorPicker.settings.feedbackNotification")}
              description={
                (currentConfig.showPaletteModal ?? true)
                  ? t("features.colorPicker.settings.feedbackDisabledDesc")
                  : t("features.colorPicker.settings.feedbackEnabledDesc")
              }
              enabled={
                currentConfig.showToast &&
                !(currentConfig.showPaletteModal ?? true)
              }
              disabled={currentConfig.showPaletteModal ?? true}
              onToggle={() => handleToggleOption("showToast")}
            />
          </div>
        </div>
      </div>
    </SubSettingsLayout>
  )
}
