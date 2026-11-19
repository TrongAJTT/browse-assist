import {
  Bell,
  ChevronDown,
  EyeOff,
  HelpCircle,
  Move,
  Repeat,
  Ruler,
  Sparkles,
  Tag,
  Trash2,
  Type,
  Wrench,
  Zap
} from "lucide-react"
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
import { useI18n } from "~core/useI18n"

export interface ElementToysSettingsViewProps {
  onBack: () => void
}

export const ElementToysSettingsView: React.FC<
  ElementToysSettingsViewProps
> = ({ onBack }) => {
  const { t } = useI18n()
  const [settings, setSettings] = useStorage<FeatureSettings>(
    STORAGE_KEYS.SETTINGS,
    DEFAULT_SETTINGS
  )

  const defaultModeOptions: SelectDropdownOption<ElementToysMode>[] = [
    {
      id: "zap",
      label: t("features.elementToys.settings.modes.zap"),
      icon: <Trash2 className="w-3.5 h-3.5 text-red-400" />
    },
    {
      id: "edit",
      label: t("features.elementToys.settings.modes.edit"),
      icon: <Type className="w-3.5 h-3.5 text-sky-400" />
    },
    {
      id: "move",
      label: t("features.elementToys.settings.modes.move"),
      icon: <Move className="w-3.5 h-3.5 text-emerald-400" />
    },
    {
      id: "hide",
      label: t("features.elementToys.settings.modes.hide"),
      icon: <EyeOff className="w-3.5 h-3.5 text-amber-400" />
    }
  ]
  const [shortcut, setShortcut] = useState<string>("Alt + Shift + Z")
  const [isTipsOpen, setIsTipsOpen] = useState(false)

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
      title={t("features.elementToys.title")}
      enabled={isMasterEnabled}
      onToggle={handleToggleMaster}
      onBack={onBack}
      rightActions={
        <button
          type="button"
          onClick={handleLaunchNow}
          disabled={!isMasterEnabled}
          title={t("features.elementToys.settings.launchTooltip")}
          className="px-2.5 py-1 rounded-lg bg-accent hover:bg-accent-hover text-white font-semibold text-xs shadow-sm shadow-accent-glow active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none flex items-center gap-1.5">
          <Zap className="w-3.5 h-3.5 fill-current" />
          <span>{t("common.launch")}</span>
        </button>
      }>
      <div className="space-y-4">
        {/* Keyboard Shortcut Row */}
        <FeatureShortcutRow
          title={t("features.elementToys.settings.shortcutTitle")}
          description={t("features.elementToys.settings.shortcutDesc")}
          shortcut={shortcut}
          iconColorClass="text-amber-400"
          onConfigureShortcuts={() => {
            openBrowserShortcutsPage().catch(() => {})
          }}
        />

        {/* Element Inspector Badge Options */}
        <div className="space-y-1 pt-2 border-t border-border-divider">
          <span className="section-header">
            {t("features.elementToys.settings.inspectorBadge")}
          </span>

          <div className="divide-y divide-border-divider">
            {/* Show Dimensions Switch */}
            <SettingToggleRow
              icon={<Ruler className="w-5 h-5 text-sky-400" />}
              title={t("features.elementToys.settings.showDimensions")}
              description={t(
                "features.elementToys.settings.showDimensionsDesc"
              )}
              enabled={currentConfig.showDimensions}
              onToggle={() => handleToggleConfig("showDimensions")}
            />

            {/* Show Tag & Class Names Switch */}
            <SettingToggleRow
              icon={<Tag className="w-5 h-5 text-amber-400" />}
              title={t("features.elementToys.settings.showTags")}
              description={t("features.elementToys.settings.showTagsDesc")}
              enabled={currentConfig.showTagDescriptor}
              onToggle={() => handleToggleConfig("showTagDescriptor")}
            />
          </div>
        </div>

        {/* Behavior & Default Mode */}
        <div className="space-y-1 pt-2 border-t border-border-divider">
          <span className="section-header">
            {t("features.elementToys.settings.behaviorSection")}
          </span>

          {/* Default Starting Mode (Trailing Dropdown) */}
          <div className="flex items-center justify-between gap-3 py-2">
            <div className="flex items-start gap-3 flex-1 min-w-0">
              <Wrench className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-semibold text-content-primary">
                  {t("features.elementToys.settings.defaultTool")}
                </span>
                <span className="text-[11px] text-content-muted leading-tight mt-0.5">
                  {t("features.elementToys.settings.defaultToolDesc")}
                </span>
              </div>
            </div>
            <SelectDropdown<ElementToysMode>
              options={defaultModeOptions}
              value={currentConfig.defaultMode ?? "zap"}
              onChange={handleSetDefaultMode}
              ariaLabel={t("features.elementToys.settings.defaultTool")}
            />
          </div>

          <div className="divide-y divide-border-divider">
            {/* Continuous Mode Switch */}
            <SettingToggleRow
              icon={<Repeat className="w-5 h-5 text-indigo-400" />}
              title={t("features.elementToys.settings.continuousSession")}
              description={t(
                "features.elementToys.settings.continuousSessionDesc"
              )}
              enabled={currentConfig.continuousMode}
              onToggle={() => handleToggleConfig("continuousMode")}
            />

            {/* Auto Unfreeze Scroll Switch */}
            <SettingToggleRow
              icon={<Sparkles className="w-5 h-5 text-emerald-400" />}
              title={t("features.elementToys.settings.autoUnfreeze")}
              description={t("features.elementToys.settings.autoUnfreezeDesc")}
              enabled={currentConfig.autoUnfreezeScroll}
              onToggle={() => handleToggleConfig("autoUnfreezeScroll")}
            />

            {/* Show Toast Notifications Switch */}
            <SettingToggleRow
              icon={<Bell className="w-5 h-5 text-rose-400" />}
              title={t("features.elementToys.settings.showToast")}
              description={t("features.elementToys.settings.showToastDesc")}
              enabled={currentConfig.showToast}
              onToggle={() => handleToggleConfig("showToast")}
            />
          </div>
        </div>

        {/* How to use Tips (Collapsible) */}
        <div className="rounded-xl bg-app-surface/50 border border-border-subtle overflow-hidden">
          <button
            type="button"
            onClick={() => setIsTipsOpen((prev) => !prev)}
            className="w-full flex items-center justify-between px-3 py-2.5 text-xs font-semibold text-content-primary hover:bg-app-surface transition-colors">
            <span className="flex items-center gap-1.5">
              <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
              <span>{t("features.elementToys.settings.howToUse")}</span>
            </span>
            <ChevronDown
              className={`w-3.5 h-3.5 text-content-muted transition-transform duration-150 ${
                isTipsOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {isTipsOpen && (
            <ul className="px-3 pb-3 pt-1 text-[11px] text-content-muted space-y-1.5 list-disc list-inside border-t border-border-divider">
              <li>
                {shortcut ? (
                  <>
                    {t("features.elementToys.settings.tipShortcutPrefix")}{" "}
                    <span className="font-mono text-content-primary font-semibold">
                      {shortcut}
                    </span>{" "}
                    {t("features.elementToys.settings.tipShortcutSuffix")}
                  </>
                ) : (
                  <>
                    {t("features.elementToys.settings.tipNoShortcutPrefix")}{" "}
                    <span className="font-semibold text-content-primary">
                      {t("common.launch")}
                    </span>{" "}
                    {t("features.elementToys.settings.tipNoShortcutSuffix")}
                  </>
                )}
              </li>
              <li>
                <span className="text-red-400 font-semibold">
                  {t("features.elementToys.settings.modes.zap")}
                </span>
                : {t("features.elementToys.settings.tipZapDesc")}
              </li>
              <li>
                <span className="text-sky-400 font-semibold">
                  {t("features.elementToys.settings.modes.edit")}
                </span>
                : {t("features.elementToys.settings.tipEditDesc")}
              </li>
              <li>
                <span className="text-emerald-400 font-semibold">
                  {t("features.elementToys.settings.modes.move")}
                </span>
                : {t("features.elementToys.settings.tipMoveDesc")}
              </li>
              <li>
                <span className="text-amber-400 font-semibold">
                  {t("features.elementToys.settings.modes.hide")}
                </span>
                : {t("features.elementToys.settings.tipHideDesc")}
              </li>
              <li>
                {t("features.elementToys.settings.tipUndoPrefix")}{" "}
                <span className="font-mono text-content-primary font-semibold">
                  Ctrl + Z
                </span>{" "}
                {t("features.elementToys.settings.tipUndoMiddle")}{" "}
                <span className="font-semibold text-content-primary">
                  {t("features.elementToys.settings.tipUndoSettings")}
                </span>{" "}
                {t("features.elementToys.settings.tipUndoSuffix")}
              </li>
            </ul>
          )}
        </div>
      </div>
    </SubSettingsLayout>
  )
}

